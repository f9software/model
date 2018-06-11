import {ReducedRecord} from "./Reducer";
import {Manager} from "./Manager";
import {Record} from './Record';
import {Field} from "./Field";
import * as reducers from '@f9software/reducers';
import {Model} from './Model';

/**
 * The enhancer for a Record. Pass a ReducedRecord to it and it will return you a full Record.
 * @param {ReducedRecord} reducedRecord
 * @returns {Record}
 */
export const enhancer = <T, K extends keyof T>(reducedRecord: ReducedRecord): Record<T> => {
    const model = <Model<T>> Manager.getModel(reducedRecord.$model);
    const fields = model.getFields();
    const record = new Record(model);
    const reducedData = reducedRecord.$value;

    fields.getRange().forEach((field: Field) => record.set(<K> field.name, reducers.enhance(reducedData[field.name])));

    return record;
};
