import {Record} from './Record';
import * as reducers from '@f9software/reducers';

export interface ReducedRecord extends reducers.ReducedValue {
    $model: string;
    $value: {[key: string]: any};
}

/**
 *
 * @param {Record} record
 * @param {{[p: string]: any}} buffer
 * @returns {ReducedRecord}
 */
export const reducer = (record: Record<any>, buffer: {[key: string]: any} = {}): ReducedRecord => {
    const data = record.dump(false);
    const model = record.getModel();
    const fields = model.getFields();
    const reducedData: {[key: string]: any} = {};   // short of reduced data

    Object.keys(data)
        .forEach((fieldName) => {
            const field = fields.get(fieldName);

            if (!field) {
                throw new Error(`Field "${fieldName}" does not exist on model "${model.getId()}".`);
            }

            const type = field.type;
            const value = data[fieldName];

            reducedData[fieldName] = reducers.reduce(value, type);
        });

    return {
        $type: 'record',
        $value: reducedData,
        $model: record.getModel().getId()
    };
};
