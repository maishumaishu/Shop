define(["require", "exports", "components/common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class StyleControl extends common_1.Control {
        get persistentMembers() {
            return ['style'];
        }
        constructor(props) {
            super(props);
            this.state = {};
        }
        _render(h) {
            console.assert(this.state != null);
            let style = this.state.style || 'default'; //(this.state || { style: 'default' }).style;
            let path = `../components/style/style_${style}.css`;
            return h("link", { key: path, rel: "stylesheet", href: path });
            // return <div></div>;
        }
    }
    exports.default = StyleControl;
});
