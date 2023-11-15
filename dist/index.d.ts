import { Observable } from "rxjs";
export interface ResourceOptions<T> {
    initialValue: T;
}
export declare class Resource<T> {
    private _data;
    private _resource;
    data$: Observable<T | undefined>;
    private _dataSubscription;
    loading: boolean;
    error$: Observable<any>;
    private _error;
    constructor(resource: Observable<T>, options?: ResourceOptions<T>);
    get data(): T | undefined;
    get error(): any;
    refetch(): void;
    mutate(value: T): void;
    unsubscribe(): void;
}
export declare function createResource<T>(resource: Observable<T>, options?: ResourceOptions<T>): Resource<T>;
export declare function createResourceFromAsync<T>(resource: () => Promise<T>, options?: ResourceOptions<T>): Resource<T>;
