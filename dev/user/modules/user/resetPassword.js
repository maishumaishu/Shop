var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "site", "dilu", "user/services/memberService", "ui"], function (require, exports, site_1, dilu_1, memberService_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let member = page.createService(memberService_1.MemberService); //new services.MemberService();
        class ResetPasswordPage extends React.Component {
            constructor() {
                super();
                this.state = { letfSeconds: 0 };
            }
            componentDidMount() {
                // this.validator = new FormValidator(this.formElement, {
                //     mobile: {
                //         rules: ['required', 'mobile'],
                //         messages: { required: '请输入手机号码' }
                //     },
                //     verifyCode: {
                //         rules: ['required'],
                //         messages: { required: '请输入验证码' }
                //     },
                //     password: {
                //         rules: ['required'],
                //         messages: { required: '请输入密码' }
                //     },
                //     confirmPassword: {
                //         rules: ['required', { name: 'matches', params: ['password'] }],
                //         messages: {
                //             required: '请再次输入密码',
                //             matches: '两次输入的密码不匹配'
                //         }
                //     }
                // });
                let { required, matches } = dilu_1.rules;
                let e = this.formElement;
                this.validator = new dilu_1.FormValidator(this.formElement, { name: "mobile", rules: [required('请输入手机号码')] }, { name: "verifyCode", rules: [required('请输入验证码')] }, { name: "password", rules: [required('请输入密码')] }, {
                    name: "confirmPassword", rules: [
                        required('请再次输入密码'),
                        matches(e["password"], "两次输入的密码不匹配")
                    ]
                });
            }
            sendVerifyCode() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (isValid == false) {
                        return;
                    }
                    yield member.sentRegisterVerifyCode(this.formElement['mobile'].value)
                        .then((data) => {
                        this.smsId = data.SmsId;
                    });
                    this.state.letfSeconds = 60;
                    this.setState(this.state);
                    let intervalId = window.setInterval(() => {
                        this.state.letfSeconds = this.state.letfSeconds - 1;
                        this.setState(this.state);
                        if (this.state.letfSeconds <= 0) {
                            window.clearInterval(intervalId);
                        }
                    }, 1000);
                });
            }
            resetPassword() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (isValid == false) {
                        return;
                    }
                    let mobile = this.formElement['mobile'].value;
                    let password = this.formElement['password'].value;
                    let verifyCode = this.formElement['verifyCode'].value;
                    return member.resetPassword(mobile, password, this.smsId, verifyCode);
                });
            }
            render() {
                return [
                    h("header", null, site_1.defaultNavBar(page, { title: "登录密码" })),
                    h("section", null,
                        h("div", { className: "container" },
                            h("form", { className: "form-horizontal", ref: (o) => this.formElement = o || this.formElement },
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-12" },
                                        h("input", { className: "form-control", type: "text", name: "mobile", placeholder: "请输入手机号码" }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-6" },
                                        h("input", { type: "text", name: "verifyCode", className: "form-control", placeholder: "验证码" })),
                                    h("div", { className: "col-xs-6" },
                                        h("button", { type: "button", className: "btn btn-block btn-success", disabled: this.state.letfSeconds > 0, ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => {
                                                    return this.sendVerifyCode();
                                                });
                                            } }, this.state.letfSeconds > 0 ? `发送验证码(${this.state.letfSeconds})` : '发送验证码')),
                                    h("div", { className: "col-xs-12" },
                                        h("span", { className: "verifyCode validationMessage" }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-12" },
                                        h("input", { name: "password", type: "password", className: "form-control", placeholder: "请输入密码" }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-12" },
                                        h("input", { name: "confirmPassword", type: "password", className: "form-control", placeholder: "请再一次输入密码" }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-12" },
                                        h("button", { type: "button", className: "btn btn-primary btn-block", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => {
                                                    return this.resetPassword();
                                                }, { toast: '修改密码成功' });
                                            } }, "\u91CD\u7F6E\u5BC6\u7801"))))))
                ];
            }
        }
        ReactDOM.render(h(ResetPasswordPage, null), page.element);
    }
    exports.default = default_1;
});
