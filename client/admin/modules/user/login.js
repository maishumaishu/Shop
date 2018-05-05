var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/user", "admin/services/weixin", "admin/application", "admin/siteMap", "dilu", "ui", "share/common", "weixin/modules/openid"], function (require, exports, user_1, weixin_1, application_1, siteMap_1, dilu_1, ui, common_1, openid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            application_1.default.loadCSS(page.name);
            let userService = page.createService(user_1.UserService);
            let weixinService = page.createService(weixin_1.WeiXinService);
            class LoginPage extends React.Component {
                constructor(props) {
                    super(props);
                    // Service.token.value = '';
                }
                componentDidMount() {
                    let usernameElement = this.element.querySelector('[name="username"]');
                    let passwordElement = this.element.querySelector('[name="password"]');
                    this.validator = new dilu_1.FormValidator(this.element, { name: "username", rules: [dilu_1.rules.required()] }, { name: "password", rules: [dilu_1.rules.required()] });
                }
                login() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let isValid = yield this.validator.check();
                        if (!isValid) {
                            return Promise.resolve();
                        }
                        yield userService.login(this.usernameInput.value, this.passwordInput.value);
                        this.redirectDefaultPage();
                    });
                }
                showDialog() {
                    let self = this;
                    openid_1.showQRCodeDialog({
                        title: '登录',
                        tips: '扫描二维码登录',
                        element: this.dialogElement,
                        mobilePageName: 'adminLogin',
                        callback(openId) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let result = yield weixinService.login(openId);
                                if (result.SellerId != null) {
                                    ui.confirm({
                                        message: '微信用户尚未绑定,是否注册新用户?', confirm() {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                yield userService.registerById(result.SellerId);
                                                self.redirectDefaultPage();
                                            });
                                        }
                                    });
                                    throw new Error("微信用户尚未绑定");
                                }
                                self.redirectDefaultPage();
                            });
                        }
                    }).catch((exc) => {
                        application_1.default.error.fire(application_1.default, exc, page);
                    });
                }
                redirectDefaultPage() {
                    application_1.default.redirect(siteMap_1.siteMap.nodes.user_myStores);
                }
                render() {
                    return [
                        h("h1", { key: 8, className: "text-center", style: { paddingBottom: 50 } },
                            common_1.shopName,
                            "\u5546\u5BB6\u540E\u53F0"),
                        h("div", { key: 10, className: "form-horizontal container", style: { maxWidth: 500 }, ref: (e) => this.element = e || this.element },
                            h("div", { className: "form-group" },
                                h("label", { className: "col-sm-2 control-label" }, "\u7528\u6237\u540D"),
                                h("div", { className: "col-sm-10" },
                                    h("input", { name: "username", type: "text", className: "form-control", ref: (e) => this.usernameInput = e || this.usernameInput }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-sm-2 control-label" }, "\u5BC6\u7801"),
                                h("div", { className: "col-sm-10" },
                                    h("input", { type: "password", name: "password", className: "form-control", ref: (e) => this.passwordInput = e || this.passwordInput }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-sm-offset-2 col-sm-10" },
                                    h("button", { type: "button", className: "btn btn-primary btn-block", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.onclick = ui.buttonOnClick(() => this.login());
                                        } },
                                        h("i", { className: "icon-key" }),
                                        "\u7ACB\u5373\u767B\u5F55"))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-sm-offset-2 col-sm-10" },
                                    h("div", { className: "pull-left" },
                                        h("button", { className: "btn-link", onClick: () => application_1.default.redirect(siteMap_1.siteMap.nodes.user_forgetPassword) }, "\u5FD8\u8BB0\u5BC6\u7801")),
                                    h("div", { className: "pull-right" },
                                        h("button", { className: "btn-link", onClick: () => application_1.default.redirect(siteMap_1.siteMap.nodes.user_register) }, "\u6CE8\u518C")))),
                            h("div", { className: "form-group text-center" },
                                h("hr", null),
                                h("div", { className: "col-sm-offset-2 col-sm-10" },
                                    h("img", { src: "content/images/weixin_icon.png", onClick: () => this.showDialog(), style: { width: 80 } }),
                                    h("h4", null, "\u4F7F\u7528\u5FAE\u4FE1\u626B\u63CF\u4E8C\u7EF4\u7801\u767B\u5F55")))),
                        h("div", { key: 20, className: "modal fade", ref: (e) => this.dialogElement = e },
                            h("div", { className: "modal-dialog", style: { width: 320 } },
                                h("div", { className: "modal-content" },
                                    h("div", { className: "modal-header" },
                                        h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(this.dialogElement) },
                                            h("span", { "aria-hidden": "true" }, "\u00D7")),
                                        h("h4", { className: "modal-title" }, "\u5FAE\u4FE1\u626B\u63CF\u4E8C\u7EF4\u7801")),
                                    h("div", { className: "modal-body" },
                                        h("div", { className: "qrcodeElement", ref: (e) => this.qrcodeElement = e },
                                            h("img", { style: { width: '100%' } }))),
                                    h("div", { className: "modal-footer" }))))
                    ];
                }
            }
            ReactDOM.render(h(LoginPage, null), page.element);
        });
    }
    exports.default = default_1;
});
