import * as uuid from 'uuid';
import {Manager} from "./Manager";
import {Data} from "./Data";
import {Model} from "./Model";
import * as reducers from '@f9software/reducers';
import {reducer, ReducedRecord} from './Reducer';
import {enhancer} from './Enhancer';

/**
 * A Record is a object that is tightly coupled to a Model, meaning that the structure of a Record is given by model.
 * This means that a Record an only store (set/get) defined in the fields (Field) of its Model. Record only has meaning
 * in the context of a Model, so when we refer to a record we have to mention the Model too. For example, we can say
 * record of type user, record of type document, record of type service etc.
 * 
 * Once a Record is initialized with a certain Model, the Model cannot be changed.
 * 
 * Any change on the Model, like adding or removing fields (Field), or making any change to any of the fields of the
 * Model of the Record, these changes will be reflected on every living Record of that Model.
 *
 * Every Record has a unique identifier which is generated at Record initialization. This identifier cannot be changed 
 * and it will exist as long as the instance exist, but it will never be persisted. This unique ID can be accessed 
 * using the getInstanceId() method.
 *
 * Record is using Data underneath to store values.
 */
export class Record {
    private instanceId = uuid.v1();

    private data: Data = this.model.initData();

    private destroyed = false;

    /**
     *
     * @param {Model} model
     */
    public constructor(private model: Model) {
        // register the instance with the Manager
        Manager.registerRecord(this, model);
    }

    /**
     *
     * @param {string} field
     * @returns {any}
     */
    public get(field: string): any {
        return this.data.get(field);
    }

    /**
     * Set data for single field.
     * @param {string} field
     * @param value
     */
    public set(field: string, value: any) {
        this.data.set(field, value);
    }

    /**
     * Set data for multiple fields.
     * @param {{[p: string]: any}} data
     */
    public setAll(data: {[key: string]: any}) {
        this.data.setAll(data);
    }

    /**
     *
     * @returns {Model}
     */
    public getModel(): Model {
        return this.model;
    }

    /**
     * This ID is identifying the instance. Is unique and should never be two Record(s) with the same ID.
     * @returns {string}
     */
    public getInstanceId() {
        return this.instanceId;
    }

    /**
     * Dumps the data. Developer can chose whether to include or not default values for fields that are not populated.
     * @param {boolean} includeDefaultValues
     * @returns {{[p: string]: any}}
     */
    public dump(includeDefaultValues: boolean = true) {
        return this.data.dump(includeDefaultValues);
    }

    /**
     * Destroys the Record. The instance cannot be used after destruction.
     */
    public destroy() {
        Manager.unregisterRecord(this, this.model);

        // we null any links
        this.data.clear();

        delete this.model;

        this.destroyed = true;
    }

    public isDestroyed() {
        return this.destroyed;
    }
}

// we register the "record" Type
reducers.register(
    new reducers.Type<Record, ReducedRecord>(value => value instanceof Record, reducer, enhancer),
    'record'
);
