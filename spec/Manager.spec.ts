import "jasmine";
import {initModels} from './Util';
import {Manager} from "../src/Manager";
import {Model} from "../src/Model";
import {Record} from '../src/Record';

describe('Manager', () => {

    const models = initModels();

    it('Verify if models are registered', () => {
        const user = Manager.getModel('user');
        expect(user).toBe(models.user);

        const company = Manager.getModel('company');
        expect(company).toBe(models.company);

        const noModel = Manager.getModel('something');
        expect(noModel).toBe(undefined);
    });


    it('unregisterModel', () => {

        // the constructor will automatically register the new Model
        const model = new Model('dummy');
        expect(model).toBe(Manager.getModel('dummy'));

        const record = new Record(model);
        expect(Manager.getRecords(model).length).toBe(1);

        // destroy method will unregister the Model
        model.destroy();
        expect(Manager.getModel('dummy')).toBe(undefined);

        expect(Manager.getRecords(model).length).toBe(0);

    })

    it('getRecordsCollectionForModel', () => {

        const user = models.user;

        const john = new Record(user);
        john.set('firstName', 'John');
        john.set('lastName', 'Orange');
        john.set('age', 21);

        const rux = new Record(user);
        rux.set('firstName', 'Rux');
        rux.set('lastName', 'Senna');
        rux.set('age', 30);

        expect(Manager.getRecords(user).length).toBe(2);

        rux.destroy();
        expect(Manager.getRecords(user).length).toBe(1);

    });

});
