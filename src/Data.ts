import {Field} from "./Field";
import {Collection} from "@f9software/collection";

/**
 * Data is an object which holds data according to what Collection<Field> contains. The set and get are using validators
 * defined on the Field to make sure that data that is set is valid. The dump and clear methods are two utility methods
 * to export and clear the object of data.
 *
 * TODO Put this in a separate package.
 */
export class Data<T> {
    private values?: Partial<T> = {};

    private fields?: Collection<Field>;

    /**
     * Instantiate a Data with a Collection<Field>. It is okay if Field(s) are added or removed from Collection.
     * @param {Collection<Field>} fields
     *
     * TODO When Field(s) are removed from the collection, the value set on this Data should also be removed.
     */
    public constructor(fields: Collection<Field>) {
        this.fields = fields;
    }

    /**
     * If vaue is not set for the specified Field, then it will fallback to default value of the Field.
     * @param {Field} field
     * @returns {any}
     * @private
     */
    private _get<K extends keyof T>(fieldName: string): T[K] {
        let value;

        if (this.fields && this.values) {
            const field = <Field> this.fields.get(fieldName);
            const values = this.values;

            if (values.hasOwnProperty(field.name)) {
                value = values[<K> field.name];
            }
            else if (field.defaultValue) {
                if (typeof field.defaultValue === 'function') {
                    value = field.defaultValue();
                    this.set(<K> field.name, value);
                }
                else {
                    value = field.defaultValue;
                }
            }
        }

        return value;
    }

    /**
     * Get the value of the specified field.
     * @param {string} name
     * @returns {any}
     */
    public get<K extends keyof T>(name: string): T[K] | undefined {
        const field = this.fields!.get(name);

        if (!field) {
            throw 'Field "' + name + '" cannot be found.';
        }

        return this._get(field.name);
    }

    /**
     * Sets value for the field identified by the passed name. It will validate the value. It will throw an error if
     * the field does not exist or the value is invalid.
     */
    public set<K extends keyof T>(name: K, value: T[K]) {
        const field = this.fields!.get(<string> name);

        if (!field) {
            throw 'Field "' + name + '" cannot be found.';
        }

        // we validate the data before we set it
        const invalid = (field.validators || []).some(validator => !validator(value));
        if (invalid) {
            throw 'Trying to set invalid value for field "' + name + '".';
        }

        this.values![name] = value;
    }

    /**
     * Set multiple properties.
     * @param {{[p: string]: any}} data
     */
    public setAll<K extends keyof T>(data: Partial<T>) {
        Object.keys(data).forEach(key => this.set(<K> key, <T[K]> data[<K> key]));
    }

    /**
     * Dumps the data. Developer can chose whether to include or not the default values.
     */
    public dump<K extends keyof T>(includeDefaultValues: boolean = true): Partial<T> {
        const out: Partial<T> = {};

        this.fields!.getRange()
            .forEach(field => {
                const name = field.name;

                if (includeDefaultValues || this.values!.hasOwnProperty(name)) {
                    out[<K> name] = this._get(name);
                }
            });

        return out;
    }

    /**
     * Males both fields and values NULL.
     */
    public destroy() {
        this.fields = undefined;
        this.values = undefined;
    }
}
