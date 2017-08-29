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
    id: string;

    constructor(props) {
        super(props);
        this.id = this.guid();
        // this.state = Object.assign({}, this.props) as S
    }
    abstract get persistentMembers(): (keyof S)[];
    abstract _render(h): JSX.Element;
    get element(): HTMLElement {
        return this._element;
    }
    set element(value: HTMLElement) {
        console.assert(value != null, 'value can not null.');
        this._element = value;
        // if (this.props.onClick != null) {
        //     this._element.onclick = (event) => {
        //         event.preventDefault();
        //         event.stopPropagation();
        //         this.props.onClick(event, this);
        //     }
        // }
    }

    render() {
        if (this.context.designer != null)
            return this._render(createDesignTimeElement);

        return this._render(React.createElement);
    }

    private guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    // static controlSelected: (control: Component<any, any>, type: React.ComponentClass<any>) => void;


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

// export function persistentProperty(value: boolean) {
//     return function (target: ControlState, propertyKey: string, descriptor: PropertyDescriptor) {
//         // console.log("f(): called");
//         let state = target;
//         // state.persistentProperties = state.persistentProperties || [];
//         state.persistentProperties.push(propertyKey);
//     }
// }