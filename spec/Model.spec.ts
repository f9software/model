import {Model} from "../src/Model";
import {Manager} from "../src/Manager";
import {Field} from "../src/Field";

describe('Model', () => {

    it('Create a new model', () => {

        const id = 'dummy';
        const model = new Model<any>(id, 'dummy');
        const fields = model.getFields();

        // make sure that constructor automatically registers the new Model
        expect(Manager.getModel(id)).toBe(model);

        expect(model.getId()).toBe(id);
        expect(fields.length).toBe(0);

        const fieldName: Field = {
            type: 'string',
            name: 'name',
            validators: [],
            defaultValue: 'John'
        };

        model.addField(fieldName);

        model.addField({
            type: 'number',
            name: 'age',
            validators: [
                age => age > 18
            ],
            defaultValue: null
        });

        const data = model.initData();
        expect(data.get('name')).toBe('John');

        fieldName.defaultValue = 'John Travis';
        expect(data.get('name')).toBe('John Travis');

        try {
            data.set('age', 10);
            expect(true).toBe(false);
        }
        catch(e) {
            expect(true).toBe(true);
        }

        expect(Object.keys(data.dump()).length).toBe(2);
        expect(Object.keys(data.dump(false)).length).toBe(0);

        data.set('age', 19);
        expect(data.get('age')).toBe(19);
        expect(Object.keys(data.dump(false)).length).toBe(1);

        // make sure that model is destroyed
        model.destroy();
        expect(Manager.getModel(id)).toBe(undefined);

    });

});
