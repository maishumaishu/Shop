var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "site", "dilu", "modules/user/accountSecurity/wizard", "user/services/memberService", "ui"], function (require, exports, site_1, dilu_1, wizard_1, memberService_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        page.loadCSS();
        class LoginPasswordPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { step: 0 };
            }
            componentDidMount() {
                // this.validator = new FormValidator(this.form, {
                //     password: { rules: ['required'] },
                //     confirmPassword: {
                //         rules: [
                //             'required',
                //             { name: 'matches', params: ['password'] }
                //         ],
                //         messages: {
                //             matches: '两次输入的密码不正确'
                //         }
                //     }
                // })
                let { required } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(this.form, { name: "password", rules: [required()] }, { name: "confirmPassword", rules: [required()] });
            }
            changePassword() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (!isValid) {
                        return Promise.reject({});
                    }
                    let { smsId, verifyCode } = this.wizard;
                    return member.changePassword(this.passwordInput.value, smsId, verifyCode);
                });
            }
            render() {
                let userInfo = this.props.userInfo;
                let { step } = this.state;
                return [
                    h("header", { key: "header" }, site_1.defaultNavBar(page, { title: '登录密码' })),
                    h("section", { key: "section" },
                        h(wizard_1.default, { userInfo: this.props.userInfo, ref: (e) => this.wizard = e || this.wizard },
                            h("div", { className: "form-group", ref: (e) => this.form = e ? e.parentElement : this.form },
                                h("div", { className: "col-xs-12" },
                                    h("input", { name: "password", type: "password", className: "form-control", placeholder: "请输入新的登录密码", ref: e => this.passwordInput = e || this.passwordInput }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("input", { name: "confirmPassword", type: "password", className: "form-control", placeholder: "请再次输入登录密码", ref: (e => this.confirmPasswordInput = e || this.confirmPasswordInput) }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("button", { className: "btn btn-block btn-primary", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.onclick = ui.buttonOnClick(() => this.changePassword(), { toast: '修改密码成功' });
                                        } }, "\u4FEE\u6539\u5BC6\u7801")))))
                ];
            }
        }
        let member = page.createService(memberService_1.MemberService);
        member.userInfo().then(userInfo => {
            ReactDOM.render(h(LoginPasswordPage, { userInfo: userInfo }), page.element);
        });
    }
    exports.default = default_1;
});
