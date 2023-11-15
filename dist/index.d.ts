import { BehaviorSubject, Observable, Subscription } from "rxjs";
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
export declare class Resource<T> implements IResource<T> {
    _data: BehaviorSubject<T | undefined>;
    _resource: Observable<T>;
    data$: Observable<T | undefined>;
    _dataSubscription: Subscription;
    loading: boolean;
    error: any;
    constructor(resource: Observable<T>, options?: ResourceOptions<T>);
    get data(): T | undefined;
    refetch(): void;
    mutate(value: T): void;
    unsubscribe(): void;
}
export declare function createResource<T>(resource: Observable<T>, options?: ResourceOptions<T>): Resource<T>;
export declare function createResourceFromAsync<T>(resource: () => Promise<T>, options?: ResourceOptions<T>): Resource<T>;
export {};
