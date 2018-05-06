import {ReducedRecord} from "./Reducer";
import {Manager} from "./Manager";
import {Record} from './Record';
import {Field} from "./Field";
import * as reducers from '@f9software/reducers';

/**
 * The enhancer for a Record. Pass a ReducedRecord to it and it will return you a full Record.
 * @param {ReducedRecord} reducedRecord
 * @returns {Record}
 */
export const enhancer = (reducedRecord: ReducedRecord): Record => {
    const model = Manager.getModel(reducedRecord.$model);
    const fields = model.getFields();
    const record = new Record(model);
    const reducedData = reducedRecord.$value;

    fields.getRange().forEach((field: Field) => record.set(field.name, reducers.enhance(reducedData[field.name])));

    return record;
};
