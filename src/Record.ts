import * as uuid from 'uuid';
import {Manager} from "./Manager";
import {Data} from "./Data";
import {Model} from "./Model";
import * as reducers from '@f9software/reducers';
import {reducer} from './Reducer';
import {enhancer} from './Enhancer';

/**
 * Record is a "instance" of a Model. Once the Record initialized, the Model cannot be changed, but any change on the
 * Model, like adding or removing Field(s), adding or removing Field validators will be reflected on every Record of the
 * Model.
 *
 * Every Record has a unique identifier which is generated at Record initialization. It cannot be changed and it will
 * exist as long as the instance exist, but it will never be persisted to be restored in case of any serialization.
 * This unique ID can be accessed using the getInstanceId() method.
 *
 * Record is using Data underneath to store values.
 */
export class Record {
    private instanceId = uuid.v1();

    private data: Data = this.model.initData();

    public destroyed = false;

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

    public set(field: string, value: any) {
        this.data.set(field, value);
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

        this.data = this.model = null;

        this.destroyed = true;
    }
}

// we register the "record" Type
reducers.register(new reducers.Type(value => value instanceof Record, reducer, enhancer), 'record');
