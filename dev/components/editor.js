define(["require", "exports", "components/common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Editor extends React.Component {
        constructor(props) {
            super(props);
            console.assert(this.props.control.state != null);
        }
        get state() {
            return this._state;
        }
        /**
         * 重写 set state， 在第一次赋值，将控件中 state 的持久化成员赋值过来。
         */
        set state(value) {
            value = value || {};
            if (this._state != null) {
                this._state = value;
                return;
            }
            var state = {};
            let keys = this.props.control.persistentMembers || [];
            let controlState = this.props.control.state;
            for (let i = 0; i < keys.length; i++) {
                var prop = controlState[keys[i]];
                if (prop !== undefined)
                    state[keys[i]] = prop;
            }
            this._state = Object.assign(value, state);
            ;
        }
        get elementPage() {
            return this.props.elementPage;
        }
        componentDidUpdate() {
            let control = this.props.control;
            console.assert(control != null);
            let controlState = control.state;
            let keys = control.persistentMembers;
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                controlState[key] = this.state[key];
            }
            control.setState(controlState);
        }
        static path(controlName) {
            return `${common_1.componentsDir}/${controlName}/editor`;
        }
        loadEditorCSS() {
            var typeName = this.constructor.name;
            typeName = typeName.replace('Editor', '');
            typeName = typeName[0].toLowerCase() + typeName.substr(1);
            requirejs([`css!${common_1.componentsDir}/${typeName}/editor`]);
        }
        bindInputElement(e, obj, fieldName, fieldType) {
            if (!e)
                return;
            if (typeof obj == 'string') {
                fieldName = obj;
                obj = this.state;
            }
            e.value = `${obj[fieldName] || ''}`;
            e.onchange = () => {
                if (fieldType == 'number') {
                    obj[fieldName] = Number.parseFloat(e.value);
                }
                else {
                    obj[fieldName] = e.value;
                }
                this.setState(this.state);
            };
        }
        bindCheckElement(e, obj, fieldName, fieldType) {
            if (!e)
                return;
            if (arguments.length == 3) {
                fieldName = arguments[1];
                fieldType = arguments[2];
                obj = this.state;
            }
            let parseValue = (text) => {
                let value;
                if (fieldType == 'number') {
                    value = text.indexOf('.') > 0 ? Number.parseFloat(text) : Number.parseInt(text);
                }
                else if (fieldType == 'boolean') {
                    value = text == 'false' ? false : text == 'true' ? true : null;
                }
                else {
                    value = text;
                }
                return value;
            };
            let sourceValue = obj[fieldName];
            let targetValue = parseValue(e.value);
            e.checked = sourceValue == targetValue;
            e.onchange = () => {
                let value = parseValue(e.value);
                obj[fieldName] = value;
                this.setState(this.state);
            };
        }
    }
    exports.Editor = Editor;
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    exports.guid = guid;
});
