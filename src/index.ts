import {
    BehaviorSubject,
    Observable,
    Subscription,
    catchError,
    from,
  } from "rxjs";
  
  interface IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    data: Observable<T | undefined>;
    _dataSubscription: Subscription;
    loading: boolean;
    error: any;
  }
  
  interface ResourceOptions<T> {
    initialValue: T;
  }
  
  class AsyncResource<T> implements IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    _resource: () => Promise<T>;
    data: Observable<T | undefined>;
    // @ts-expect-error: "This is getting initialized in the constructor, kind of"
    _dataSubscription: Subscription;
    loading = true;
    error: any = null;
    constructor(resource: () => Promise<T>, options?: ResourceOptions<T>) {
      this._resource = resource;
      this._data = new BehaviorSubject(options?.initialValue);
      this.data = this._data as Observable<T>;
    }
  
    refetch() {
      if (this._dataSubscription !== undefined) {
        this._dataSubscription.unsubscribe();
      }
      this.loading = true;
      this.error = null;
      const observable = from(this._resource()).pipe(
        catchError((error) => {
          this.error = error;
          return [undefined];
        }),
      );
      this._dataSubscription = observable.subscribe((res) => {
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
      this._dataSubscription.unsubscribe();
    }
  }
  
  class ObservableResource<T> implements IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    _resource: Observable<T>;
    data: Observable<T | undefined>;
    // @ts-expect-error: "This is getting initialized in the constructor, kind of"
    _dataSubscription: Subscription;
    loading = true;
    error: any = null;
    constructor(resource: Observable<T>, options?: ResourceOptions<T>) {
      this._resource = resource;
      this._data = new BehaviorSubject(options?.initialValue);
      this.data = this._data as Observable<T>;
      this.refetch();
    }
  
    refetch() {
      if (this._dataSubscription !== undefined) {
        this._dataSubscription.unsubscribe();
      }
      this.loading = true;
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
  
  export function createObservableResource<T>(
    resource: Observable<T>,
    options?: ResourceOptions<T>,
  ) {
    return new ObservableResource(resource, options);
  }
  
  export function createAsyncResource<T>(
    resource: () => Promise<T>,
    options?: ResourceOptions<T>,
  ) {
    return new AsyncResource(resource, options);
  }
  