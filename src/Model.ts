import {Collection} from "./Collection";
import {Data} from "./Data";
import {Field} from "./Field";

export class Model {
    private fields: Collection<Field> = new Collection<Field>(field => field.name);

    public constructor(private readonly id: string) {

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
}
