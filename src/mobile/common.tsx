

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


const controlsDir = 'mobile';

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
export interface EditorProps {
    controlElement: HTMLElement,
    controlId: string,
    controlData?: any,
    pageId: string,
}
export interface EditorState<T> {
    controlData: T
}
export abstract class Editor<S extends EditorState<any>> extends React.Component<EditorProps, S> {
    private controlType: React.ComponentClass<any>;
    // abstract dataType: { new () };

    constructor(props: EditorProps, controlType: React.ComponentClass<any>, controlDataType: { new () }) {
        super(props);

        this.state = { controlData: (props.controlData || new controlDataType()) } as S;
        this.controlType = controlType;
        
    }

    componentDidMount() {
        debugger;
        this.renderControl(this.state.controlData);
    }

    componentDidUpdate(){
        debugger;
        this.renderControl(this.state.controlData);
    }

    renderControl(data) {
        console.assert(this.controlType != null);
        // console.assert(this.dataType != null);
        let reactElement = React.createElement(this.controlType, data);
        ReactDOM.render(reactElement, this.props.controlElement)
    }

    static path(controlName: string) {
        return `${controlsDir}/${controlName}/editor`;
    }
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}