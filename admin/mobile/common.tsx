

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


export const componentsDir = 'mobile/components';

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
// AJAX
let config = {
    /** 调用服务接口超时时间，单位为秒 */
    ajaxTimeout: 30,
}

export class AjaxError implements Error {
    name: string;
    message: string;
    method: 'get' | 'post';

    constructor(method) {
        this.name = 'ajaxError';
        this.message = 'Ajax Error';
        this.method = method;
    }
}

export function ajax<T>(url: string, options: FetchOptions): Promise<T> {

    let _ajax = async (url: string, options: FetchOptions): Promise<T> => {
        let response = await fetch(url, options);
        if (response.status >= 300) {
            let err = new AjaxError(options.method);
            err.name = `${response.status}`;
            err.message = response.statusText;
            throw err
        }
        let responseText = response.text();
        let p: Promise<string>;
        if (typeof responseText == 'string') {
            p = new Promise<string>((reslove, reject) => {
                reslove(responseText);
            })
        }
        else {
            p = responseText as Promise<string>;
        }

        let text = await responseText;
        let textObject = JSON.parse(text);
        let err = isError(textObject);
        if (err)
            throw err;

        textObject = this.travelJSON(textObject);
        return textObject;
    }


    return new Promise<T>((reslove, reject) => {
        let timeId: number;
        if (options.method == 'get') {
            timeId = window.setTimeout(() => {
                let err = new AjaxError(options.method);
                err.name = 'timeout';
                reject(err);
                this.error.fire(this, err);
                clearTimeout(timeId);

            }, config.ajaxTimeout * 1000)
        }

        _ajax(url, options)
            .then(data => {
                reslove(data);
                if (timeId)
                    clearTimeout(timeId);
            })
            .catch(err => {
                reject(err);
                this.error.fire(this, err);

                if (timeId)
                    clearTimeout(timeId);
            });

    })
}

/** 
 * 判断服务端返回的数据是否为错误信息 
 * @param responseData 服务端返回的数据
 */
function isError(responseData: any): Error {
    if (responseData == null)
        return null;

    if (responseData.Type == 'ErrorObject') {
        if (responseData.Code == 'Success') {
            return null;
        }
        let err = new Error(responseData.Message);
        err.name = responseData.Code;
        return err;
    }

    let err: Error = responseData;
    if (err.name !== undefined && err.message !== undefined && err['stack'] !== undefined) {
        return err;
    }

    return null;
}