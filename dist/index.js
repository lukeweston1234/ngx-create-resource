"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResourceFromAsync = exports.createResource = exports.Resource = void 0;
const rxjs_1 = require("rxjs");
class Resource {
    constructor(resource, options) {
        this.loading = true;
        this.error = null;
        this._resource = resource;
        this._data = new rxjs_1.BehaviorSubject(options === null || options === void 0 ? void 0 : options.initialValue);
        this.data$ = this._data;
        this.refetch();
    }
    get data() {
        return this._data.getValue();
    }
    refetch() {
        if (this._dataSubscription !== undefined) {
            this._dataSubscription.unsubscribe();
        }
        // We don't want to set loading to true if we have data and are refetching
        if (this.data === undefined) {
            this.loading = true;
        }
        this.error = null;
        this._dataSubscription = this._resource
            .pipe((0, rxjs_1.catchError)((error) => {
            this.error = error;
            return [undefined];
        }))
            .subscribe((res) => {
            this._data.next(res);
            if (res !== undefined && !this.loading) {
                this.loading = false;
                this.error = null;
            }
        });
    }
    mutate(value) {
        this._data.next(value);
    }
    unsubscribe() {
        if (this._dataSubscription) {
            this._dataSubscription.unsubscribe();
        }
    }
}
exports.Resource = Resource;
function createResource(resource, options) {
    return new Resource(resource, options);
}
exports.createResource = createResource;
function createResourceFromAsync(resource, options) {
    return new Resource((0, rxjs_1.from)(resource()), options);
}
exports.createResourceFromAsync = createResourceFromAsync;
