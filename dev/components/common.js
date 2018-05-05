define(["require", "exports", "react", "share/common"], function (require, exports, React, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.componentsDir = 'components';
    exports.pageClassName = 'mobile-page';
    class Control extends React.Component {
        constructor(props) {
            super(props);
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
            if (this.mobilePage.props.designTime != null)
                return this._render(createDesignTimeElement);
            return this._render(React.createElement);
        }
        loadControlCSS() {
            var typeName = this.constructor.name;
            typeName = typeName.replace('Control', '');
            typeName = typeName[0].toLowerCase() + typeName.substr(1);
            requirejs([`less!${exports.componentsDir}/${typeName}/control`]);
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
