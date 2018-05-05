define(["require", "exports", "components/editor"], function (require, exports, editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let h = React.createElement;
    class MyEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.state = {};
        }
        render() {
            let { mode } = this.state;
            return (h("div", { className: "editor" }, "\u6682\u65E0\u53EF\u7528\u8BBE\u7F6E"));
        }
    }
    exports.default = MyEditor;
});
