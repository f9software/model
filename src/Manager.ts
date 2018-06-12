import {Model} from './Model';
import {Collection} from '@f9software/collection';

export class Manager {
    private static models: Collection<Model<any>> = new Collection(model => model.getId());

    public static registerModel(model: Model<any>) {
        this.models.add(model);
    }

    public static unregisterModel(model: Model<any>) {
        this.models.remove(model);
    }

    public static getModel<T>(id: string): Model<T> | undefined {
        return this.models.get(id);
    }
}
