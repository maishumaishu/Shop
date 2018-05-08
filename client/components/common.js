var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "react", "share/common", "lessc"], function (require, exports, React, common_1, lessc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.componentsDir = 'components';
    exports.pageClassName = 'mobile-page';
    class Control extends React.Component {
        constructor(props) {
            super(props);
            this.noneCSS = false;
            this.stateChanged = chitu.Callbacks();
            this.setStateTimes = 0;
            this._page = this.props.mobilePage;
            this._elementPage = this.props.mobilePage.props.elementPage;
        }
        get mobilePage() {
            return this._page;
        }
        get elementPage() {
            return this._elementPage;
        }
        get state() {
            return this._state;
        }
        /**
         * 重写 set state， 在第一次赋值，将 props 的持久化成员赋值过来。
         */
        set state(value) {
            value = value || {};
            if (this._state != null) {
                this._state = value;
                return;
            }
            var state = {};
            let keys = this.persistentMembers || [];
            for (let i = 0; i < keys.length; i++) {
                var prop = this.props[keys[i]];
                if (prop !== undefined)
                    state[keys[i]] = prop;
            }
            this._state = Object.assign(value, state);
            ;
        }
        get hasEditor() {
            return true;
        }
        setState(state, callback) {
            //=====================================================
            // 忽略第一次设置，把第一次设置作为初始化
            if (this.setStateTimes > 0)
                this.stateChanged.fire(this, state);
            //=====================================================
            this.setStateTimes = this.setStateTimes + 1;
            return super.setState(state, callback);
        }
        render() {
            if (!this.noneCSS)
                this.loadControlCSS();
            if (this.mobilePage.props.designTime != null)
                return this._render(createDesignTimeElement);
            return this._render(React.createElement);
        }
        loadControlCSS() {
            return __awaiter(this, void 0, void 0, function* () {
                var typeName = this.constructor.name;
                typeName = typeName.replace('Control', '');
                typeName = typeName[0].toLowerCase() + typeName.substr(1);
                let path = `${exports.componentsDir}/${typeName}/control`;
                let lessText = `@import "../${path}";`;
                let color = this.mobilePage.styleColor;
                if (color != null && color != 'default') {
                    lessText = lessText + `@import "../components/style/colors/${color}.less";`;
                }
                let parser = new lessc.Parser(window['less']);
                parser.parse(lessText, (err, tree) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = tree.toCSS();
                    document.head.appendChild(style);
                });
            });
        }
        subscribe(item, callback) {
            let func = item.add(callback);
            let componentWillUnmount = this.componentWillUnmount;
            this.componentWillUnmount = function () {
                item.remove(func);
                componentWillUnmount();
            };
        }
        get isDesignTime() {
            return window[common_1.ADMIN_APP] != null;
        }
        elementOnClick(e, callback) {
            let isDesignTime = this.isDesignTime;
            e.onclick = function (event) {
                if (isDesignTime) {
                    return;
                }
                callback(event);
            };
        }
    }
    exports.Control = Control;
    function createDesignTimeElement(type, props, ...children) {
        props = props || {};
        if (typeof type == 'string')
            props.onClick = () => { };
        else if (typeof type != 'string') {
            props.onClick = (event, control) => {
                if (control.context != null) {
                    control.context.designer.selecteControl(control, type);
                }
            };
        }
        if (type == 'a' && props.href) {
            props.href = 'javascript:';
        }
        let args = [type, props];
        for (let i = 2; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        return React.createElement.apply(React, args);
    }
    exports.createDesignTimeElement = createDesignTimeElement;
    exports.components = {};
    function component(name) {
        return function (constructor) {
            exports.components[name] = constructor;
        };
    }
    exports.component = component;
});
