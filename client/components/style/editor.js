define(["require", "exports", "components/editor"], function (require, exports, editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let h = React.createElement;
    requirejs(['css!components/style/editor.css']);
    class StyleEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.state = { style: this.props.control.state.style };
        }
        setCurrentStyle(name) {
            this.state.style = name;
            this.setState(this.state);
        }
        render() {
            return (h("div", { className: "style-editor" },
                h("div", { className: "style-solutions" },
                    h("header", null, "\u9009\u62E9\u914D\u8272\u65B9\u6848"),
                    h("ul", null,
                        this.styleItem('default'),
                        this.styleItem('red')),
                    h("div", { className: "clearfix" }))));
        }
        styleItem(name) {
            let currentStyle = (this.state || { style: null }).style || 'default';
            return (h("li", { className: currentStyle == name ? "active" : '', onClick: () => this.setCurrentStyle(name) },
                h("div", { className: name })));
        }
    }
    exports.default = StyleEditor;
});
