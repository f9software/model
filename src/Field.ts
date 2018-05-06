/**
 * Field is the configuration of a field in a Model. We are using this interface to benefit from strong typing.
 */
export interface Field {
    /**
     * Possible values: string, number, map, collection, array, record, boolean.
     */
    type: string;

    /**
     * Name of the field.
     */
    name: string;

    /**
     * The default value. This default value will be used by any Record that does not have a value for this field.
     */
    defaultValue: any;

    /**
     * Any validators for this field.
     */
    validators: ((value: any) => boolean)[];
}
