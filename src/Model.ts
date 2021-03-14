import {Collection} from "@f9software/collection";
import {Data} from "./Data";
import {Field} from "./Field";
import {Manager} from './Manager';

/**
 * The model is used to create a structure for its fields. It creates a "model" in structure for its records to follow.
 * Any change on model's fields is reflected further in Record.
 */
export class Model<T> {
    private fields: Collection<Field> | undefined = new Collection<Field>(field => field.name);

    private destroyed: boolean = false;

    public constructor(private readonly id: string, private collectionName?: string) {
        // register with Manager
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
        if (this.fields) {
            this.fields.add(field);
        }
    }

    public initData(): Data<T> {
        return new Data<T>(this.fields!);
    }

    public getFields(): Collection<Field> {
        return this.fields!;
    }

    // TODO Make sure there are no records that are using this model.
    public destroy() {
        if (this.destroyed) {
            throw new Error('You are trying to destroy an already destroyed Model.');
        }

        if (this.fields) {
            this.fields.clear();
            this.fields = undefined;
        }

        // unregister
        Manager.unregisterModel(this);

        this.destroyed = true;
    }
}
