export const componentsDir = 'mobileComponents';
export const pageClassName = 'mobile-page';

export interface IMobilePageDesigner {
    selecteControl(control: Component<any, any>, controlType: React.ComponentClass<any>);
    isDesignMode?: boolean;
}

//==============================================================    
export interface ComponentProp<T> extends React.Props<T> {
    onClick?: (event: MouseEvent, control: T) => void,
    // mode?: Mode,
    createElement?: (type, props, ...children) => JSX.Element,
}
export interface ComponentConstructor {
    new(props): Component<any, any>
}
export abstract class Component<P, S> extends React.Component<P, S> {
    private _element: HTMLElement;
    static contextTypes = { designer: React.PropTypes.object };
    context: { designer: IMobilePageDesigner };

    constructor(props) {
        super(props);
    }
    abstract get persistentMembers(): (keyof S)[];
    abstract _render(h): JSX.Element;
    get element(): HTMLElement {
        return this._element;
    }
    set element(value: HTMLElement) {
        console.assert(value != null, 'value can not null.');
        this._element = value;
    }
    get state(): S {
        return super.state;
    }

    /**
     * 重写 set state， 在第一次赋值，将 props 的持久化成员赋值过来。 
     */
    set state(value: S) {
        value = value || {} as S;
        if (super.state != null) {
            super.state = value;
            return;
        }

        var state = {} as any;
        let keys = this.persistentMembers || [];
        for (let i = 0; i < keys.length; i++) {
            var prop = (this.props as any)[keys[i]];
            if (prop !== undefined)
                state[keys[i]] = prop;
        }

        super.state = Object.assign(value, state);;
    }

    render() {
        if (this.context.designer != null)
            return this._render(createDesignTimeElement);

        return this._render(React.createElement);
    }

    static loadEditor(controlName: string, control: Component<any, any>, editorElement: HTMLElement) {
        let editorPathName = `pageComponent/${controlName}/editor`; //Editor.path(controlName);
        requirejs([editorPathName], (exports) => {
            let editorType = exports.default;
            console.assert(editorType != null, 'editor type is null');
            let editorReactElement = React.createElement(editorType, { control });
            ReactDOM.render(editorReactElement, editorElement);
        })
    }

    static createStandElement(type, props: ComponentProp<any>, ...children) {
        let args = [type, props];
        for (let i = 2; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        return React.createElement.apply(React, args);
    }

    private get isDesignMode() {
        let screenElement = this.findScreenElement(this.element);
        return screenElement != null;
    }

    private findScreenElement(element: HTMLElement): HTMLElement {
        let screenElement: HTMLElement;
        let p = element;
        while (p != null) {
            if (p.className.indexOf('screen') >= 0) {
                screenElement = p;
                break;
            }
            p = p.parentElement;
        }
        return screenElement;
    }

    protected loadControlCSS() {
        var typeName = this.constructor.name;
        typeName = typeName.replace('Control', '');
        typeName = typeName[0].toLowerCase() + typeName.substr(1);

        requirejs([`css!${componentsDir}/${typeName}/control`]);
    }

}


export function createDesignTimeElement(type: string | React.ComponentClass<any>, props: ComponentProp<any>, ...children) {
    props = props || {};
    if (typeof type == 'string')
        props.onClick = () => { };
    else if (typeof type != 'string') {
        props.onClick = (event, control: Component<any, any>) => {
            if (control.context != null) {
                control.context.designer.selecteControl(control, type);
            }
        }
    }
    if (type == 'a' && (props as any).href) {
        (props as any).href = 'javascript:';
    }

    // props.mode = 'design';
    let args = [type, props];
    for (let i = 2; i < arguments.length; i++) {
        args[i] = arguments[i];
    }
    return React.createElement.apply(React, args);
}

export let components: { [key: string]: React.ComponentClass<any> } = {};
export function component(name: string) {
    return function (constructor: React.ComponentClass<any>) {
        components[name] = constructor;
    }
}

export interface ComponentClass<T> extends React.ComponentClass<T> {
    attributes: { editorPath?: string, editorExport?: string }
}

type Attributes = { editorPath?: string, editorExport?: string }
export function editor(pathName: string, exportName?: string) {
    return function (constructor: React.ComponentClass<any>) {
        let componentClass = constructor as ComponentClass<any>;
        let attrs = componentClass.attributes = componentClass.attributes || {};
        attrs.editorPath = pathName;
        attrs.editorExport = exportName;
    }
}

export interface ControlState {
    persistentMembers: (keyof this)[];
}
