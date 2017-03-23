

/** 实现数据的存储，以及数据修改的通知 */
export class ValueStore<T> {
    private funcs = new Array<(args: T) => void>();
    private _value: T;

    constructor() {
    }
    add(func: (value: T) => any): (args: T) => any {
        this.funcs.push(func);
        return func;
    }
    remove(func: (value: T) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(value: T) {
        this.funcs.forEach(o => o(value));
    }
    get value(): T {
        return this._value;
    }
    set value(value: T) {
        if (this._value == value)
            return;

        this._value = value;
        this.fire(value);
    }
}


interface DataContructor<T> {
    new (): ValueStoreContainer<T>
}
export class ValueStoreContainer<T> {
    private funcs = new Array<(name: string, value: any) => void>();
    private defaultValues: T;

    constructor(valueType: { new (): T }) {
        this.defaultValues = new valueType();
        let names = Object.getOwnPropertyNames(this.defaultValues);
        for (let i = 0; i < names.length; i++) {
            this.createProperty(names[i], this.defaultValues[names[i]]);
        }
    }

    add(func: (name: string, value: any) => any): (name: string, args: any) => any {
        this.funcs.push(func);
        return func;
    }
    remove(func: (name: string, value: any) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    private fire(name: string, value: any) {
        this.funcs.forEach(o => o(name, value));
    }
    private createProperty<T>(name: string, value: T) {
        if (this[name] != null)
            throw new Error(`Property named '${name}' is exists.`);

        let valueStore = new ValueStore<T>();
        valueStore.value = value;
        valueStore.add((value) => {
            this.fire(name, value);
        })
        this[name] = valueStore;
    }
    values(): T {
        let obj = {};
        let names = Object.getOwnPropertyNames(this);
        for (let i = 0; i < names.length; i++) {
            obj[names[i]] = (this[names[i]] as ValueStore<any>).value;
        }
        return obj as T;
    }
}


export const controlsDir = 'mobile';

//==============================================================
// Control
export interface ControlArguments<T> {
    element: HTMLElement,
    data: T
}
interface ControlConstructor<T> {
    new (args: ControlArguments<T>): Control<T>;
}
export abstract class Control<T> {
    constructor(args: ControlArguments<T>) {
    }
}
//==============================================================
