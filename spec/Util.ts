import {Model} from "../src/Model";
import {Record} from '../src/Record';

let models: {[key: string]: Model};

export function initModels() {
    if (models) {
        return models;
    }

    const user = new Model('user');

    user.addField({
        type: 'string',
        name: 'firstName',
        defaultValue: null,
        validators: []
    });

    user.addField({
        type: 'string',
        name: 'lastName',
        defaultValue: null,
        validators: []
    });

    user.addField({
        type: 'number',
        name: 'age',
        defaultValue: null,
        validators: [
            (value: number) => value >= 18
        ]
    });


    const company = new Model('company');

    company.addField({
        type: 'string',
        name: 'name',
        defaultValue: null,
        validators: []
    });

    company.addField({
        type: 'number',
        name: 'employees',
        defaultValue: null,
        validators: []
    });

    company.addField({
        type: 'record',
        name: 'founder',
        defaultValue: null,
        validators: [
            (founder: Record) => founder.getModel() === user
        ]
    });

    return models = {
        user: user,
        company: company
    };

}
