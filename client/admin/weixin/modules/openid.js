var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "share/common", "weixin/common", "admin/services/service", "admin/weixin/application", "weixin/qrCodeControls"], function (require, exports, common_1, common_2, service_1, application_1, qrCodeControls_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let q = location.search ? common_1.parseUrlParams(location.search) : {};
    let openid = "";
    const action = 'openid';
    /**
     * 用于获取 OpenId ，并把 OpenId 发送会指定的页面
     */
    class OpenIdPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { status: 'normal' };
            document.title = this.props.title;
            this.init();
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                let io = yield common_2.loadjs('socket.io');
                this.socket = io(common_1.websocketUrl);
                this.socket.on('connect', () => {
                    let msg = { to: q.from, from: this.socket.id, action: `${action}_scan` };
                    this.socket.emit("weixin", msg);
                });
                this.socket.on("weixin", (msg) => {
                    msg = msg || {};
                    if (msg.action == `${action}_success`) {
                        this.state.status = 'success';
                        this.setState(this.state);
                    }
                    else if (msg.action == `${action}_fail`) {
                        this.state.status = 'fail';
                        this.state.text = msg.data;
                        this.setState(this.state);
                    }
                });
            });
        }
        execute() {
            return __awaiter(this, void 0, void 0, function* () {
                let msg = { to: q.from, from: this.socket.id, data: { code: q.code }, action: `${action}_execute` };
                this.socket.emit("weixin", msg);
            });
        }
        cancel() {
            application_1.default.back();
        }
        render() {
            let { status } = this.state;
            let text = this.state.text || this.props.content[status];
            let buttonBar = status == 'normal' ?
                h("div", { key: 20, className: "container", style: { bottom: 0, position: 'absolute', width: '100%' } },
                    h("div", { className: "form-group" },
                        h("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                if (!e)
                                    return;
                                ui.buttonOnClick(e, () => this.execute());
                            } }, this.props.buttonText))) : null;
            return [
                h("div", { key: 10, style: { paddingTop: 200, textAlign: 'center' }, className: "container" },
                    h("div", null),
                    h("h3", null, text)),
                buttonBar
            ];
        }
        static createUrl(from, page) {
            let { protocol, hostname, pathname, port } = location;
            return `${protocol}//${hostname}${pathname}weixin/?from=${from}#${page}`;
        }
    }
    exports.OpenIdPage = OpenIdPage;
    /**
     * 显示二维码对话框，让手机扫描，用于 PC 端
     * @param element 对话框元素
     * @param mobilePageName 要打开的手机端页面名称
     * @param callback 获取到 openid 后的回调函数
     */
    exports.showQRCodeDialog = (function () {
        var qrcodeDialog;
        return function (options) {
            if (qrcodeDialog == null) {
                let element = document.createElement('div');
                document.body.appendChild(element);
                qrcodeDialog = ReactDOM.render(h(qrCodeControls_1.QRCodeDialog, { title: options.title, tips: options.tips }), element);
            }
            qrcodeDialog.show();
            return new Promise((resolve, reject) => {
                requirejs(['socket.io'], (io) => {
                    var socket = io(common_1.websocketUrl);
                    let { protocol, hostname, pathname, port } = location;
                    socket.on('connect', () => {
                        console.log(socket.id);
                        let appid = service_1.systemWeiXinAppId;
                        let redirect_uri = encodeURIComponent(`${protocol}//${hostname}/admin/weixin/?from=${socket.id}#${options.mobilePageName}`);
                        let auth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`;
                        qrcodeDialog.setUrl(auth_url);
                        resolve();
                    });
                    socket.on('weixin', (msg) => {
                        let data = msg.data;
                        switch (msg.action) {
                            case `${action}_execute`:
                                options.callback(data.code)
                                    .then(() => {
                                    // 发送消息，告诉手机端执行成功
                                    console.assert(msg.from != socket.id);
                                    qrcodeDialog.hide();
                                    let success_msg = {
                                        to: msg.from, from: socket.id, action: `${action}_success`
                                    };
                                    socket.emit("weixin", success_msg);
                                })
                                    .catch((err) => {
                                    // 发送消息，告诉手机端执行失败
                                    console.assert(msg.from != socket.id);
                                    qrcodeDialog.hide();
                                    let fail_msg = {
                                        to: msg.from, from: socket.id, action: `${action}_fail`, data: err.message
                                    };
                                    socket.emit("weixin", fail_msg);
                                });
                                break;
                            case `${action}_scan`:
                                qrcodeDialog.state.scaned = true;
                                qrcodeDialog.setState(qrcodeDialog.state);
                                break;
                        }
                    });
                    socket.on('error', (err) => {
                        reject(err);
                    });
                }, (err) => reject(err));
            });
        };
    })();
    exports.renderQRCode = (function () {
        let qrcodeImage;
        /**
         * 显示二维码，让手机扫描，用于 PC 端
         */
        return function (options) {
            if (qrcodeImage == null) {
                ReactDOM.render(h(qrCodeControls_1.QRCodeImage, { tips: "", ref: (e => qrcodeImage = e || qrcodeImage) }), options.element);
            }
            // function setUrl(url: string) {
            //     let qrcode = new QRCode(qrcodeImage.element, { width: 200, height: 200, text: "" });
            //     let q = qrcode as any;
            //     q._oDrawing._elImage = qrcodeImage.img;
            //     console.log(url);
            //     qrcode.makeCode(url);
            // }
            return new Promise((resolve, reject) => {
                requirejs(['socket.io'], (io) => {
                    var socket = io(common_1.websocketUrl);
                    let { protocol, hostname, pathname, port } = location;
                    socket.on('connect', () => {
                        console.log(socket.id);
                        let appid = service_1.systemWeiXinAppId;
                        let redirect_uri = encodeURIComponent(`${protocol}//${hostname}${pathname}weixin/?from=${socket.id}#${options.mobilePageName}`);
                        let auth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`;
                        // qrcodeDialog.show(auth_url);
                        qrcodeImage.setUrl(auth_url);
                        resolve();
                    });
                    socket.on('weixin', (msg) => {
                        let data = msg.data;
                        switch (msg.action) {
                            case `${action}_execute`:
                                options.callback(data.code)
                                    .then(() => {
                                    // 发送消息，告诉手机端执行成功
                                    console.assert(msg.from != socket.id);
                                    // qrcodeDialog.hide();
                                    socket.emit("weixin", { to: msg.from, form: socket.id, action: `${action}_success` });
                                })
                                    .catch(() => {
                                    // 发送消息，告诉手机端执行失败
                                    console.assert(msg.from != socket.id);
                                    // qrcodeDialog.hide();
                                    socket.emit("weixin", { to: msg.from, form: socket.id, action: `${action}_fail` });
                                });
                                break;
                            case `${action}_scan`:
                                qrcodeImage.state.scaned = true;
                                qrcodeImage.setState(qrcodeImage.state);
                                break;
                        }
                    });
                    socket.on('error', (err) => {
                        reject(err);
                    });
                }, (err) => reject(err));
            });
        };
    })();
});
