define(["require", "exports", "qrcode"], function (require, exports, QRCode) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class QRCodeDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { scaned: false };
        }
        componentDidMount() {
            ui.renderImage(this.img, { imageText: '正在生成二维码' });
            this.dialogContainer = this.dialogElement.parentElement;
        }
        render() {
            let { title, tips } = this.props;
            let { scaned } = this.state;
            return (h("div", { className: "modal-dialog", style: { width: 400 }, ref: (e) => this.dialogElement = e || this.dialogElement },
                h("div", { className: "modal-content" },
                    h("div", { className: "modal-header" },
                        h("button", { type: "button", className: "close", onClick: () => {
                                this.hide();
                            } },
                            h("span", { "aria-hidden": "true" }, "\u00D7")),
                        h("h4", { className: "modal-title" }, title)),
                    h("div", { className: "modal-body form-horizontal" },
                        h("div", { className: "qrcodeElement", ref: (e) => this.qrcodeElement = e },
                            h("img", { style: { width: '100%' }, ref: (e) => this.img = e || this.img }))),
                    h("div", { className: "modal-footer", style: { textAlign: 'center' } }, scaned ?
                        h("h4", null,
                            h("i", { className: "icon-ok text-success", style: { fontSize: 'larger' } }),
                            h("span", { style: { paddingLeft: 8 } }, "\u5DF2\u626B\u63CF\u4E8C\u7EF4\u7801")) :
                        h("h4", null, tips)))));
        }
        show() {
            ui.renderImage(this.img, { imageText: '正在生成二维码' });
            ui.showDialog(this.dialogContainer);
        }
        hide() {
            ui.hideDialog(this.dialogContainer);
        }
        setUrl(url) {
            console.assert(this.qrcodeElement != null);
            let qrcode = new QRCode(this.qrcodeElement.parentElement, { width: 200, height: 200, text: "" });
            let q = qrcode;
            q._oDrawing._elImage = this.qrcodeElement.querySelector('img');
            console.log(url);
            qrcode.makeCode(url);
            this.state.scaned = false;
            this.setState(this.state);
        }
    }
    exports.QRCodeDialog = QRCodeDialog;
    class QRCodeImage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { scaned: false };
        }
        componentDidMount() {
            this.clear();
        }
        render() {
            let { tips } = this.props;
            let { scaned } = this.state;
            return (h("div", { key: 10, className: "qrcodeElement", ref: (e) => this.element = e },
                h("div", null,
                    h("img", { style: { width: '80%' }, ref: (e) => this.img = e || this.img })),
                h("div", { key: 20, style: { textAlign: 'center' } }, scaned ?
                    h("h4", null,
                        h("i", { className: "icon-ok text-success", style: { fontSize: 'larger' } }),
                        h("span", { style: { paddingLeft: 8 } }, "\u5DF2\u626B\u63CF\u4E8C\u7EF4\u7801")) :
                    h("h4", null, tips))));
        }
        clear() {
            ui.renderImage(this.img, { imageText: '正在生成二维码' });
        }
        setUrl(url) {
            console.assert(this.element != null);
            let qrcode = new QRCode(this.element, { width: 200, height: 200, text: "" });
            let q = qrcode;
            q._oDrawing._elImage = this.img; //this.element.querySelector('img');
            console.log(url);
            qrcode.makeCode(url);
            this.state.scaned = false;
            this.setState(this.state);
        }
        show() {
            this.element.style.removeProperty('display');
        }
        hide() {
            this.element.style.display = "none";
        }
    }
    exports.QRCodeImage = QRCodeImage;
});
