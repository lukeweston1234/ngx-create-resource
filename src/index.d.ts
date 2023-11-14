import { BehaviorSubject, Observable, Subscription } from "rxjs";
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
declare class AsyncResource<T> implements IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    _resource: () => Promise<T>;
    data: Observable<T | undefined>;
    _dataSubscription: Subscription;
    loading: boolean;
    error: any;
    constructor(resource: () => Promise<T>, options?: ResourceOptions<T>);
    refetch(): void;
    mutate(value: T): void;
    unsubscribe(): void;
}
declare class ObservableResource<T> implements IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    _resource: Observable<T>;
    data: Observable<T | undefined>;
    _dataSubscription: Subscription;
    loading: boolean;
    error: any;
    constructor(resource: Observable<T>, options?: ResourceOptions<T>);
    refetch(): void;
    mutate(value: T): void;
    unsubscribe(): void;
}
export declare function createObservableResource<T>(resource: Observable<T>, options?: ResourceOptions<T>): ObservableResource<T>;
export declare function createAsyncResource<T>(resource: () => Promise<T>, options?: ResourceOptions<T>): AsyncResource<T>;
