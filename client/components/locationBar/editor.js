define(["require", "exports", "components/editor"], function (require, exports, editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationBarEditor extends editor_1.Editor {
        render() {
            return h("div", null, "\u6682\u65E0\u53EF\u7528\u8BBE\u7F6E");
        }
    }
    exports.default = LocationBarEditor;
});
