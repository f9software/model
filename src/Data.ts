import {Field} from "./Field";
import {Collection} from "@f9software/collection";

/**
 * Data is an object which holds data according to what Collection<Field> contains. The set and get are using validators
 * defined on the Field to make sure that data that is set is valid. The dump and clear methods are two utility methods
 * to export and clear the object of data.
 *
 * TODO Put this in a separate package.
 */
export class Data {
    private values: {[key: string]: any} = {};

    /**
     * Instantiate a Data with a Collection<Field>. It is okay if Field(s) are added or removed from Collection.
     * @param {Collection<Field>} fields
     *
     * TODO When Field(s) are removed from the collection, the value set on this Data should also be removed.
     */
    public constructor(private fields: Collection<Field>) {

    }

    /**
     * If vaue is not set for the specified Field, then it will fallback to default value of the Field.
     * @param {Field} field
     * @returns {any}
     * @private
     */
    private _get(field: Field): any {
        let value = null;

        if (this.values.hasOwnProperty(field.name)) {
            value = this.values[field.name];
        }
        else if (field.defaultValue) {
            if (typeof field.defaultValue === 'function') {
                value = field.defaultValue();
                this.set(field.name, value);
            }
            else {
                value = field.defaultValue;
            }
        }

        return value;
    }

    /**
     * Get the value of the specified field.
     * @param {string} name
     * @returns {any}
     */
    public get(name: string): any {
        const field = this.fields.get(name);

        if (!field) {
            throw 'Field "' + name + '" cannot be found.';
        }

        return this._get(field);
    }

    /**
     * Sets value for the field identified by the passed name. It will validate the value. It will throw an error if
     * the field does not exist of the value is invalid.
     * @param {string} name
     * @param {any} value
     */
    public set(name: string, value: any) {
        const field = this.fields.get(name);

        if (!field) {
            throw 'Field "' + name + '" cannot be found.';
        }

        // we validate the data before we set it
        const invalid = (field.validators || []).some(validator => !validator(value));
        if (invalid) {
            throw 'Trying to set invalid value for field "' + name + '".';
        }

        this.values[name] = value;
    }

    /**
     * Set multiple properties.
     * @param {{[p: string]: any}} data
     */
    public setAll(data: {[key: string]: any}) {
        Object.keys(data).forEach(key => this.set(key, data[key]));
    }

    /**
     * Dumps the data. Developer can chose whether to include or not the default values.
     * @param {boolean} includeDefaultValues
     * @returns {{[p: string]: any}}
     */
    public dump(includeDefaultValues: boolean = true) {
        const out: {[key: string]: any} = {};

        this.fields.getRange()
            .forEach(field => {
                const name = field.name;

                if (includeDefaultValues || this.values.hasOwnProperty(name)) {
                    out[name] = this._get(field);
                }
            });

        return out;
    }

    /**
     * Males both fields and values NULL.
     */
    public clear() {
        this.fields = this.values = null;
    }
}
