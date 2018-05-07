var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/member", "admin/services/weixin", "weixin/modules/openid", "admin/application"], function (require, exports, member_1, weixin_1, openid_1, application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const label_max_width = 80;
    const input_max_width = 300;
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            application_1.default.loadCSS(page.name);
            let userService = page.createService(member_1.MemberService);
            let seller = yield userService.me();
            let weixin = page.createService(weixin_1.WeiXinService);
            class AccountSettingPage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { seller: this.props.seller, scaned: false };
                }
                showWeiXinBinding() {
                    let it = this;
                    let seller = this.state.seller;
                    let isUnbind = seller.OpenId != null;
                    if (isUnbind && (seller.Mobile == null && seller.UserName == null && seller.Email == null)) {
                        ui.alert({ title: '不允许解绑', message: '手机，用户名，邮箱必须有一个不为空才能解绑' });
                        return;
                    }
                    isUnbind ?
                        openid_1.showQRCodeDialog({
                            title: '解绑微信',
                            tips: '扫描二维码解绑微信号',
                            element: this.weixinBinding,
                            mobilePageName: 'unbinding',
                            callback(code) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    let result = yield weixin.unbind(code);
                                    seller.OpenId = null;
                                    it.setState(it.state);
                                });
                            }
                        }) :
                        openid_1.showQRCodeDialog({
                            title: '微信绑定',
                            tips: '扫描二维码绑定微信号',
                            element: this.weixinBinding,
                            mobilePageName: 'binding',
                            callback(code) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    console.assert(code != null);
                                    let result = yield weixin.bind(code);
                                    seller.OpenId = result.OpenId;
                                    it.setState(it.state);
                                });
                            }
                        });
                }
                render() {
                    let { seller, scaned } = this.state;
                    return [
                        h("div", { key: 20, className: "well" },
                            h("div", { className: "row form-group" },
                                h("label", { className: "col-md-4", style: { width: label_max_width } }, "\u7528\u6237\u540D"),
                                h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                    h("div", { className: "input-group" },
                                        h("input", { type: "text", className: "form-control", readOnly: true, placeholder: !seller.UserName ? '未设置用户名' : seller.UserName }),
                                        h("div", { className: "input-group-addon" },
                                            h("i", { className: "icon-plus" }))))),
                            h("div", { className: "row form-group" },
                                h("label", { className: "col-md-4", style: { width: label_max_width } }, "\u624B\u673A\u53F7"),
                                h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                    h("div", { className: "input-group" },
                                        h("input", { type: "text", className: "form-control", readOnly: true, placeholder: !seller.Mobile ? '未绑定手机号' : seller.Mobile }),
                                        h("div", { className: "input-group-addon" },
                                            h("i", { className: "icon-plus" }))))),
                            h("div", { className: "row form-group" },
                                h("label", { className: "col-md-4", style: { width: label_max_width } }, "\u5FAE\u4FE1\u53F7"),
                                h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                    h("div", { className: "input-group" },
                                        h("input", { type: "text", className: "form-control", readOnly: true, placeholder: !seller.OpenId ? '未绑定微信号' : '已绑定' }),
                                        h("div", { className: "input-group-addon", onClick: () => this.showWeiXinBinding(), style: { cursor: 'pointer' } },
                                            h("i", { className: "icon-plus" })))))),
                        h("div", { key: 30, ref: (e) => this.weixinBinding = e })
                    ];
                }
            }
            ReactDOM.render(h(AccountSettingPage, { seller: seller }), page.element);
        });
    }
    exports.default = default_1;
    class ChangePasswordPage extends React.Component {
        changePassword() {
            return Promise.resolve();
        }
        render() {
            return (h("div", { className: "form-horizontal col-md-6 col-lg-5", style: { marginTop: 20 } },
                h("div", { className: "form-group" },
                    h("label", { className: "col-md-3 control-label" }, "\u65B0\u5BC6\u7801"),
                    h("div", { className: "col-md-9" },
                        h("input", { "data-bind": "value:password", type: "password", className: "form-control", placeholder: "请输入新密码" }))),
                h("div", { className: "form-group" },
                    h("label", { className: "col-md-3 control-label" }, "\u786E\u8BA4\u5BC6\u7801"),
                    h("div", { className: "col-md-9" },
                        h("input", { "data-bind": "value:confirmPassword", type: "password", className: "form-control", placeholder: "请再一次输入新密码" }))),
                h("div", { className: "form-group" },
                    h("div", { className: "col-md-9 col-md-offset-3" },
                        h("button", { "data-bind": "click:changePassword", "data-dialog": "type:'flash',content:'修改密码成功'", className: "btn btn-primary", ref: (e) => {
                                if (!e)
                                    return;
                                e.onclick = ui.buttonOnClick(this.changePassword, { toast: '修改密码成功！' });
                            } },
                            h("span", { className: "icon-ok" }),
                            "\u786E\u5B9A")))));
        }
    }
});
