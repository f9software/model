import 'jasmine';
import {Field} from "../src/Field";
import {Data} from "../src/Data";
import {Collection} from '@f9software/collection';

describe('Data', () => {

    it('Test function and references in defaultValue', () => {

        const arr: Field = {
            name: 'name',
            type: 'array',
            defaultValue: (): any[] => [],
            validators: null
        };

        const obj = {
            name: 'siblings',
            type: 'array',
            defaultValue: [],
            validators: null
        };

        const fields = new Collection<Field>(field => field.name);
        fields.add(arr);
        fields.add(obj);

        const foo: Data = new Data(fields);
        foo.get('name').push('john');
        foo.get('siblings').push('sibling foo');

        const bar: Data = new Data(fields);
        bar.get('name').push('tom');
        bar.get('siblings').push('sibling bar');

        expect(foo.get('name')).not.toBe(bar.get('name'));
        expect(foo.get('name').length).toBe(1);
        expect(bar.get('name').length).toBe(1);

        expect(foo.get('siblings')).toBe(bar.get('siblings'));
        expect(foo.get('siblings').length).toBe(2);

    });

});
