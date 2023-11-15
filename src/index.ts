import {
    BehaviorSubject,
    Observable,
    Subscription,
    catchError,
    from,
  } from "rxjs";
  
  interface IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    data$: Observable<T | undefined>;
    data: T | undefined;
    _dataSubscription: Subscription;
    loading: boolean;
    error: any;
  }
  
  export interface ResourceOptions<T> {
    initialValue: T;
  }

  export class Resource<T> implements IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    _resource: Observable<T>;
    data$: Observable<T | undefined>;
    // @ts-expect-error: "This is getting initialized in the constructor, kind of"
    _dataSubscription: Subscription;
    loading = true;
    error: any = null;
    constructor(resource: Observable<T>, options?: ResourceOptions<T>) {
      this._resource = resource;
      this._data = new BehaviorSubject(options?.initialValue);
      this.data$ = this._data as Observable<T>;
      this.refetch();
    }

    get data(){
      return this._data.getValue();
    }
  
    refetch() {
      if (this._dataSubscription !== undefined) {
        this._dataSubscription.unsubscribe();
      }
      // We don't want to set loading to true if we have data and are refetching
      if (this.data === undefined){
        this.loading = true;
      }
      this.error = null;
      this._dataSubscription = this._resource
        .pipe(
          catchError((error) => {
            this.error = error;
            return [undefined];
          }),
        )
        .subscribe((res) => {
          this._data.next(res);
          if (res !== undefined && !this.loading) {
            this.loading = false;
            this.error = null;
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
  