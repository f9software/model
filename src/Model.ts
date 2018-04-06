import * as _ from "lodash";
import * as uuid from "uuid";

export interface Field {
    type: string;
    transform?: Function
}

export interface Fields {
    [key: string]: Field;
}

export interface IModelClass<T> {
    new (data: Partial<T>, ghost?: boolean): IModel<T>;

    idKey: string;

    getId: (data: Partial<T>) => string;

    fields: Fields;
}

export interface IModel<T> {
    readonly __id: string;

    setData(data: Partial<T>): any;

    getData(): Partial<T>;

    set<K extends keyof T>(key: K, value: T[K]): any;

    get<K extends keyof T>(key: K): T[K];

    setFlag<K extends keyof Flags>(flag: K, value: Flags[K]): any;

    getFlag<K extends keyof Flags>(flag: K): Flags[K];

    commit(): any;
}

interface Flags {
    ghost: boolean;
    modified: boolean;
}

export abstract class Model<T> implements IModel<T> {
    private readonly data: Partial<T>;

    private flags: Flags = {
        ghost: true,
        modified: false
    };

    public readonly __id: string;  // internal id

    constructor(data: Partial<T> = null, ghost: boolean = true) {
        this.__id = uuid.v1();

        if (data !== null) {
            this.setFlag('ghost', ghost);
        }

        this.data = this.init();
        this.setData(data);

        if (!ghost) {
            this.setFlag('modified', false);
        }
    }

    protected abstract init(): T;

    public setFlag<K extends keyof Flags>(flag: K, value: Flags[K]) {
        this.flags[flag] = value;
    }

    public getFlag<K extends keyof Flags>(flag: K): Flags[K] {
        return this.flags[flag];
    }

    public setData<K extends keyof T>(data: Partial<T>): any {
        Object.keys(data).forEach((key: K) => this._set(<K> key, <T[K]> data[key]));
        this.setFlag('modified', true);
    }

    public getData(): Partial<T> {
        return _.assign({}, this.data);
    }

    public set<K extends keyof T>(key: K, value: T[K]): any {
        this._set(key, value);
        this.setFlag('modified', true);
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    public commit(): any {
        const flags = this.flags;

        flags.ghost = false;
        flags.modified = false;
    }

    private _set<K extends keyof T>(key: K, value: T[K]): any {
        if (!this.data.hasOwnProperty(key)) {
            throw 'Property "' + key + '" can\'t be found in "' + Object.keys(this.data).join('", "') + '".';
        }

        this.data[key] = value;
    }
}
