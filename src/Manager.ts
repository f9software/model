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


    /* MODEL */

    /**
     * Returns an array containing all models.
     */
    public static getModels(): Model[] {
        return this.models.getRange();
    }

    public static getModel(id: string): Model | undefined {
        return this.models.get(id);
    }

    /**
     * Registers a Model with the Manager. Avoid calling this method by hand. It will be called automatically by the
     * constructor of the Model.
     */
    public static registerModel(model: Model) {
        this.models.add(model);
    }

    /**
     * Unregisters a Model. Avoid calling this method by hand. It will be called automatically by the destroy method of
     * the Model.
     * 
     * It does not destroy records of this model but it does NULL its collection of Record(s).
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
        delete this.records[model.getId()];
    }



    /* RECORD */

    /**
     * It returns a Collection of all Record(s) (which are not destroyed) of the specified Model.
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
     */
    public static registerRecord(record: Record, model: Model) {
        this.getRecordsCollectionForModel(model).add(record);
    }

    /**
     * Unregisters a record. This is automatically done at Record destroy. Unless very solid reasons, this method should
     * not be called manually.
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

    /**
     * Finds the record per model and id.
     */
    public static getRecord(model: Model, id: string): Record | undefined {
        return this.getRecordsCollectionForModel(model).get(id);
    }
}
