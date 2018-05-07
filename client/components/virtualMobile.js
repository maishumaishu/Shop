define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['css!content/devices.css']);
    class VirtualMobile extends React.Component {
        constructor(props) {
            super(props);
        }
        get screenElement() {
            return this._screenElement;
        }
        render() {
            let children = React.Children.toArray(this.props.children) || [];
            return (h("div", { className: "marvel-device iphone5c blue", style: this.props.style },
                h("div", { className: "top-bar" }),
                h("div", { className: "sleep" }),
                h("div", { className: "volume" }),
                h("div", { className: "camera" }),
                h("div", { className: "sensor" }),
                h("div", { className: "speaker" }),
                h("div", { className: "screen", ref: (e) => {
                        if (!e)
                            return;
                        this._screenElement = e;
                    } }, children),
                h("div", { className: "home" }),
                h("div", { className: "bottom-bar" })));
        }
    }
    exports.VirtualMobile = VirtualMobile;
});
