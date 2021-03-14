import {Model} from './Model';
import {Collection} from '@f9software/collection';

/**
 * Manager is aware of all the models registered with it. It's main purpose is to keep track of the models and be able to return
 * the model when asked for it through getModel method.
 */
export class Manager {
    private static models: Collection<Model<unknown>> = new Collection(model => model.getId());

    public static registerModel(model: Model<unknown>) {
        this.models.add(model);
    }

    public static unregisterModel(model: Model<unknown>) {
        this.models.remove(model);
    }

    public static getModel<T extends unknown = unknown>(id: string): Model<T> | undefined {
        return this.models.get(id);
    }
}
