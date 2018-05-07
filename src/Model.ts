import {Collection} from "@f9software/collection";
import {Data} from "./Data";
import {Field} from "./Field";
import {Manager} from "./Manager";

export class Model {
    private fields: Collection<Field> = new Collection<Field>(field => field.name);

    public constructor(private readonly id: string) {
        Manager.registerModel(this);
    }

    public getId(): string {
        return this.id;
    }

    public addField(field: Field) {
        this.fields.add(field);
    }

    public initData(): Data {
        return new Data(this.fields);
    }

    public getFields(): Collection<Field> {
        return this.fields;
    }

    public destroy() {
        Manager.unregisterModel(this);
    }
}
