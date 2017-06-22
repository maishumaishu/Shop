export const componentsDir = 'mobileComponents';
export const pageClassName = 'mobile-page';

export interface IMobilePageDesigner {
    selecteControl(control: Component<any, any>, controlType: React.ComponentClass<any>);
}

//==============================================================    
// const ENABLE_CLICK = "enableClick";
// export type Mode = 'design' | 'preview';
export interface ComponentProp<T> extends React.Props<T> {
    onClick?: (event: MouseEvent, control: T) => void,
    // mode?: Mode,
    createElement?: (type, props, ...children) => JSX.Element
}
export abstract class Component<P extends ComponentProp<any>, S> extends React.Component<P, S> {
    private _element: HTMLElement;
    static contextTypes = { designer: React.PropTypes.object };
    context: { designer: IMobilePageDesigner };
    id: string;
    constructor(props) {
        super(props);
        this.id = this.guid();
    }
    abstract _render(h): JSX.Element;
    get element(): HTMLElement {
        return this._element;
    }
    set element(value: HTMLElement) {
        console.assert(value != null, 'value can not null.');
        this._element = value;
        if (this.props.onClick != null) {
            this._element.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.props.onClick(event, this);
            }
        }
    }

    render() {
        return this._render(h);
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

export function h(type: string | React.ComponentClass<any>, props: ComponentProp<any>, ...children) {
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