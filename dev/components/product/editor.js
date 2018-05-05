define(["require", "exports", "components/editor"], function (require, exports, editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let h = React.createElement;
    class ProductEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
        }
        render() {
            return (h("div", null));
        }
    }
    exports.default = ProductEditor;
});
