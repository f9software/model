import 'jasmine';
import {initModels} from "./Util";
import {Record} from "../src/Record";
import * as reducers from '@f9software/reducers';
import {Manager} from "../src/Manager";
import {ReducedRecord} from "../src/Reducer";

describe('Record', () => {

    const models = initModels();

    it('', () => {

        const user = models.user;
        const count = Manager.getRecords(user).length;

        const record = new Record(user);

        record.set('firstName', 'John');
        record.set('lastName', 'Travis');
        record.set('age', 22);

        const reducedRecord: ReducedRecord = <ReducedRecord> reducers.reduce(record);
        expect(reducedRecord).toEqual({
            $type: 'record',
            $value: {
                firstName: {
                    $type: 'string',
                    $value: 'John'
                },
                lastName: {
                    $type: 'string',
                    $value: 'Travis'
                },
                age: {
                    $type: 'number',
                    $value: 22
                }
            },
            $model: 'user'
        });

        const enhancedRecord: Record = reducers.enhance(reducedRecord);
        expect(reducers.reduce(record)).toEqual(reducedRecord);
        enhancedRecord.destroy();

        expect(Manager.getRecords(user).length).toBe(count + 1);

        expect(record.isDestroyed()).toBe(false);
        record.destroy();
        expect(record.isDestroyed()).toBe(true);
        expect(Manager.getRecords(user).length).toBe(count);
    });

});
