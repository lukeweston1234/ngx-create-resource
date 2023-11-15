import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  from,
} from "rxjs";

export interface ResourceOptions<T> {
  initialValue: T;
}

export class Resource<T> {
  private _data: BehaviorSubject<T | undefined>;
  private _resource: Observable<T>;
  data$: Observable<T | undefined>;
  // @ts-expect-error: "This is getting initialized in the constructor, kind of"
  private _dataSubscription: Subscription;
  error$: Observable<any>;
  private _error: BehaviorSubject<any>;
  private _loading: BehaviorSubject<boolean>;
  loading$: Observable<boolean>;
  constructor(resource: Observable<T>, options?: ResourceOptions<T>) {
    this._resource = resource;
    this._data = new BehaviorSubject(options?.initialValue);
    this.data$ = this._data as Observable<T>;
    this._error = new BehaviorSubject(null);
    this.error$ = this._error as Observable<any>;
    this._loading = new BehaviorSubject(true);
    this.loading$ = this._loading as Observable<boolean>;
    this.refetch();
  }

  get data() {
    return this._data.getValue();
  }

  get error() {
    return this._error.getValue();
  }

  get loading(){
    return this._loading.getValue();
  }

  refetch() {
    if (this._dataSubscription !== undefined) {
      this._dataSubscription.unsubscribe();
    }
    // We don't want to set loading to true if we have data and are refetching
    if (this.data === undefined) {
      this._loading.next(true);
    }
    this._error.next(null);
    this._dataSubscription = this._resource
      .pipe(
        catchError((error) => {
          this._error.next(error);
          console.error(error);
          return [undefined];
        }),
      )
      .subscribe((res) => {
        this._data.next(res);
        if (res !== undefined) {
          this._loading.next(false);
          this._error.next(null);
        }
      });
  }

  mutate(value: T) {
    this._data.next(value);
  }

  unsubscribe() {
    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
    }
  }
}

export function createResource<T>(
  resource: Observable<T>,
  options?: ResourceOptions<T>,
) {
  return new Resource(resource, options);
}

export function createResourceFromAsync<T>(
  resource: () => Promise<T>,
  options?: ResourceOptions<T>,
) {
  return new Resource(from(resource()), options);
}
