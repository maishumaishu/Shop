import { MobilePage } from 'components/mobilePage';
export const componentsDir = 'components';
export const pageClassName = 'mobile-page';
import { PropTypes } from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ADMIN_APP } from 'share/common';
import lessc = require('lessc');

export interface IMobilePageDesigner {
    selecteControl(control: Control<any, any>, controlType: React.ComponentClass<any>);
    isDesignMode?: boolean;
}

//==============================================================    
export interface ComponentProp<T> extends React.Props<T> {
    onClick?: (event: MouseEvent, control: T) => void,
    createElement?: (type, props, ...children) => JSX.Element,
}
export interface ControlProps<T> extends React.Props<T> {
    mobilePage: MobilePage
}
export interface ControlConstructor {
    new(props): Control<any, any>
}
export abstract class Control<P extends ControlProps<any>, S> extends React.Component<P, S> {
    private _page: MobilePage;
    private _elementPage: chitu.Page;
    private _state: S;

    protected hasCSS = false;

    stateChanged = chitu.Callbacks<this, any>();
    id: string;

    constructor(props) {
        super(props);
        this._page = this.props.mobilePage;
        this._elementPage = this.props.mobilePage.props.elementPage;
    }

    abstract get persistentMembers(): (keyof S)[];
    abstract _render(h): JSX.Element | JSX.Element[];

    get mobilePage() {
        return this._page;
    }
    get elementPage() {
        return this._elementPage;
    }

    get state(): S {
        return this._state;
    }

    /**
     * 重写 set state， 在第一次赋值，将 props 的持久化成员赋值过来。 
     */
    set state(value: S) {
        value = value || {} as S;
        if (this._state != null) {
            this._state = value;
            return;
        }

        var state = {} as any;
        let keys = this.persistentMembers || [];
        for (let i = 0; i < keys.length; i++) {
            var prop = (this.props as any)[keys[i]];
            if (prop !== undefined)
                state[keys[i]] = prop;
        }

        this._state = Object.assign(value, state);;
    }

    get hasEditor() {
        return true;
    }


    private setStateTimes = 0;
    setState(f: (prevState: S, props: P) => S, callback?: () => any): void;
    setState(state: S, callback?: () => any): void;
    setState(state: any, callback?: () => any) {
        //=====================================================
        // 忽略第一次设置，把第一次设置作为初始化
        if (this.setStateTimes > 0)
            this.stateChanged.fire(this, state);
        //=====================================================

        this.setStateTimes = this.setStateTimes + 1;
        return super.setState(state, callback);
    }

    render() {

        if (this.hasCSS)
            this.loadControlCSS();

        if (this.mobilePage.props.designTime != null)
            return this._render(createDesignTimeElement);

        return this._render(React.createElement);
    }

    protected async loadControlCSS() {


        var typeName = this.constructor.name;
        typeName = typeName.replace('Control', '');
        typeName = typeName[0].toLowerCase() + typeName.substr(1);

        let style = document.head.querySelector(`style[name="${typeName}"]`) as HTMLStyleElement;
        if (!style) {
            style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute('name', typeName);
            document.head.appendChild(style);
        }


        let color = this.mobilePage.styleColor || 'default';
        if (color == style.getAttribute('color')) {
            return;
        }

        style.setAttribute('color', color);

        let path = `${componentsDir}/${typeName}/control`;
        let lessText = `@import "../${path}";`;
        if (color != 'default') {
            lessText = lessText + `@import "../components/style/colors/${color}.less";`;
        }

        let parser = new lessc.Parser(window['less']);
        parser.parse(lessText, (err, tree) => {
            if (err) {
                console.error(err);
                return;
            }

            style.innerHTML = tree.toCSS();
        })
    }

    subscribe<T>(item: chitu.ValueStore<T>, callback: (value: T) => void) {
        let func = item.add(callback);
        let componentWillUnmount = (this as any).componentWillUnmount as () => void;
        (this as any).componentWillUnmount = function () {
            item.remove(func);
            componentWillUnmount();
        }
    }

    get isDesignTime(): boolean {
        return window[ADMIN_APP] != null;
    }

    elementOnClick(e: HTMLElement, callback: (event: MouseEvent) => void) {
        let isDesignTime = this.isDesignTime;
        e.onclick = function (event) {
            if (isDesignTime) {
                return;
            }

            callback(event);
        }
    }
}

export function createDesignTimeElement(type: string | React.ComponentClass<any>, props: ComponentProp<any>, ...children) {
    props = props || {};
    if (typeof type == 'string')
        props.onClick = () => { };
    else if (typeof type != 'string') {
        props.onClick = (event, control: Control<any, any>) => {
            if (control.context != null) {
                control.context.designer.selecteControl(control, type);
            }
        }
    }
    if (type == 'a' && (props as any).href) {
        (props as any).href = 'javascript:';
    }

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

export interface ControlState {
    persistentMembers: (keyof this)[];
}

