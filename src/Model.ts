import {Collection} from "@f9software/collection";
import {Data} from "./Data";
import {Field} from "./Field";
import {Manager} from './Manager';

/**
 * The model is used to create a structure for its fields. It creates a "model" in structure for its records to follow.
 * 
 * Any change on model's fields is reflected further in Record.
 */
export class Model<T> {
    private fields: Collection<Field> = new Collection<Field>(field => field.name);

    public constructor(private readonly id: string, private collectionName?: string) {
        Manager.registerModel(this);
    }

    public getId(): string {
        return this.id;
    }

    public setCollectionName(name: string) {
        this.collectionName = name;
    }

    public getCollectionName(): string | undefined {
        return this.collectionName;
    }

    public addField(field: Field) {
        this.fields.add(field);
    }

    public initData(): Data<T> {
        return new Data<T>(this.fields);
    }

    public getFields(): Collection<Field> {
        return this.fields;
    }

    public destroy() {
        Manager.unregisterModel(this);
    }
}
