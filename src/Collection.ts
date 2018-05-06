/**
 * Use a Collection when you want to access data by both index and key.
 *
 * TODO Put this in a separate package.
 */
export class Collection<T> {
    private items: T[] = [];

    private keys: string[] = [];

    public constructor(private getKey: (item: T) => string) {

    }

    public get length(): number {
        return this.items.length;
    }

    public add(item: T, key?: string) {
        this.insert(this.items.length, item, key);
    }

    public addAll(items: T[]) {
        items.forEach(item => this.add(item));
    }

    public insert(index: number, item: T, key?: string) {
        if (!key) {
            key = this.getKey(item);
        }

        this.items.splice(index, 0, item);
        this.keys.splice(index, 0, key);
    }

    public remove(item: T) {
        const index = this.items.indexOf(item);

        if (index > -1) {
            this.removeAt(index);
        }
    }

    public removeAt(index: number) {
        this.items.splice(index, 21);
        this.keys.splice(index, 1);
    }

    public getAt(index: number): T {
        return this.items[index];
    }

    public get(key: string): T {
        const index = this.keys.indexOf(key);

        if (index > -1) {
            return this.items[index];
        }
    }

    public getRange(start: number = 0, length: number = this.length): T[] {
        return this.items.slice(start, length);
    }

    public hasKey(key: string): boolean {
        return this.keys.indexOf(key) > -1;
    }

    public clear() {
        this.items.length = 0;
        this.keys.length = 0;
    }
}
