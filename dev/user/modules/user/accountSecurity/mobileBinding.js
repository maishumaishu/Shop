define(["require", "exports", "site", "user/services/memberService", "ui", "modules/user/accountSecurity/wizard", "controls/verifyCodeButton"], function (require, exports, site_1, memberService_1, ui, wizard_1, verifyCodeButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        page.loadCSS();
        let args = page.data;
        let member = page.createService(memberService_1.MemberService);
        class MobileBindingPage extends React.Component {
            constructor(props) {
                super(props);
            }
            componentDidMount() {
            }
            changeMobile() {
                let mobile = this.mobileInput.value;
                let verifyCode = this.verifyCodeInput.value;
                return member.changeMobile(mobile, this.smsId, verifyCode).then(() => {
                    if (args.mobileChanged) {
                        args.mobileChanged(mobile);
                    }
                });
            }
            render() {
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '手机绑定' })),
                    h("section", { key: "v" },
                        h(wizard_1.default, { userInfo: this.props.userInfo },
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("input", { className: "form-control", type: "text", placeholder: "请输入手机号码", ref: (e) => this.mobileInput = e || this.mobileInput }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-6" },
                                    h("input", { name: "VerifyCode", type: "text", className: "form-control", placeholder: "验证码", ref: (e) => this.verifyCodeInput = e || this.verifyCodeInput })),
                                h("div", { className: "col-xs-6" },
                                    h(verifyCodeButton_1.default, { get_mobile: () => this.mobileInput.value, set_smsId: (value) => this.smsId = value, type: "changeMobile" })),
                                h("div", { className: "col-xs-12" },
                                    h("span", { className: "verifyCode validationMessage" }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("button", { type: "button", className: "btn btn-success btn-block", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.onclick = ui.buttonOnClick(() => this.changeMobile(), { toast: '设置手机号码成功' });
                                        } }, "\u7ACB\u5373\u8BBE\u7F6E")))))
                ];
            }
        }
        member.userInfo().then(userInfo => {
            ReactDOM.render(h(MobileBindingPage, { userInfo: userInfo }), page.element);
        });
    }
    exports.default = default_1;
});
