import {Record} from "./Record";
import {Collection} from "@f9software/collection";
import {Model} from "./Model";

/**
 * Manager knows of all Record(s) and Model(s) in the system. In most of the cases, one should not use the Manager as
 * the Record and Model know how to deal with it.
 *
 * It is no danger in using the get* methods, but pay high attention on anything else.
 */
export class Manager {
    private static models: Collection<Model> = new Collection<Model>(model => model.getId());

    private static records: {[key: string]: Collection<Record>} = {};

    /**
     * Returns an array of all Model(s).
     * @returns {Model[]}
     */
    public static getModels(): Model[] {
        return this.models.getRange();
    }

    /**
     * Returns a Model.
     * @param {string} id
     * @returns {Model}
     */
    public static getModel(id: string): Model {
        return this.models.get(id);
    }

    /**
     * Registers a Model.
     * @param {Model} model
     */
    public static registerModel(model: Model) {
        this.models.add(model);
    }

    /**
     * Unregisters a Model. It does not destroy records of this model but it does NULL its collection of Record(s).
     * @param {Model} model
     */
    public static unregisterModel(model: Model) {
        // // we destroy all records for this model
        // const collection = this.getRecordsCollectionForModel(model, false);
        // if (collection) {
        //     collection.getRange().forEach(record => record.destroy());
        // }

        // we remove the model from our registered models
        this.models.remove(model);

        // we remove model's collection of records
        this.records[model.getId()] = null;
    }

    /**
     * It returns a Collection of all Record(s) (which are not destroyed) of the specified Model.
     * @param {Model} model
     * @param {boolean} autoCreate
     * @returns {Collection<Record>}
     */
    private static getRecordsCollectionForModel(model: Model, autoCreate: boolean = true): Collection<Record> {
        const id = model.getId();

        let collection = this.records[id];
        if (!collection && autoCreate) {
            collection = this.records[id] = new Collection<Record>(record => record.getInstanceId());
        }

        return collection;
    }

    /**
     * Registers a Record. This should not be called manually, as it's being done by the constructor of the Record.
     * @param {Record} record
     * @param {Model} model
     *
     * TODO Add a check so that a record cannot be registered multiple times.
     */
    public static registerRecord(record: Record, model: Model) {
        this.getRecordsCollectionForModel(model).add(record);
    }

    /**
     * Unregisters a record. This is automatically done at Record destroy. Unless very solid reasons, this method should
     * not be called manually.
     * @param {Record} record
     * @param {Model} model
     */
    public static unregisterRecord(record: Record, model: Model) {
        this.getRecordsCollectionForModel(model).remove(record);
    }

    /**
     * Returns all records for the specified Model.
     * @param {Model} model
     * @returns {Record[]}
     */
    public static getRecords(model: Model): Record[] {
        return this.getRecordsCollectionForModel(model).getRange();
    }
}
