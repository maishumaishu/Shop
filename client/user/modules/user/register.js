var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/site", "dilu", "user/services/memberService", "ui", "user/siteMap"], function (require, exports, site_1, dilu_1, memberService_1, ui, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let member = page.createService(memberService_1.MemberService); //new services.MemberService();
        class RegisterPage extends React.Component {
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
                let element = (name) => this.formElement.querySelector(`[name='${name}']`);
                let { required, matches } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(this.formElement, { name: "mobile", rules: [required('请输入手机号码')] }, { name: "verifyCode", rules: [required('请输入验证码')] }, { name: "password", rules: [required('请输入密码')] }, {
                    name: "confirmPassword", rules: [
                        required('请再次输入密码'),
                        matches(element("password"), "两次输入的密码不匹配")
                    ]
                });
            }
            sendVerifyCode() {
                return __awaiter(this, void 0, void 0, function* () {
                    let element = (name) => this.formElement.querySelector(`[name='${name}']`);
                    let { required, matches } = dilu_1.rules;
                    let validator = new dilu_1.FormValidator(this.formElement, { name: "mobile", rules: [required('请输入手机号码')] });
                    let isValid = yield validator.check();
                    if (isValid == false) {
                        return;
                    }
                    this.state.letfSeconds = 60;
                    this.setState(this.state);
                    let intervalId = window.setInterval(() => {
                        this.state.letfSeconds = this.state.letfSeconds - 1;
                        this.setState(this.state);
                        if (this.state.letfSeconds <= 0) {
                            window.clearInterval(intervalId);
                        }
                    }, 1000);
                    yield member.sentRegisterVerifyCode(this.formElement['mobile'].value)
                        .then((data) => {
                        this.smsId = data.SmsId;
                    })
                        .catch(() => {
                        this.state.letfSeconds = 0;
                        this.setState(this.state);
                    });
                });
            }
            register() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (isValid == false)
                        return Promise.reject(new Error("validate fail."));
                    let mobile = this.formElement['mobile'].value;
                    let password = this.formElement['password'].value;
                    let verifyCode = this.formElement['verifyCode'].value;
                    return member.register({
                        user: { mobile, password },
                        smsId: this.smsId,
                        verifyCode
                    }).then(() => {
                        site_1.app.redirect(siteMap_1.default.default);
                    });
                });
            }
            render() {
                return [
                    h("header", { key: "header" }, site_1.defaultNavBar(page, { title: "用户注册" })),
                    h("section", { key: "body" },
                        h("div", { className: "container" },
                            h("form", { className: "form-horizontal", ref: (o) => this.formElement = o || this.formElement },
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-12" },
                                        h("input", { className: "form-control", type: "text", name: "mobile", placeholder: "请输入手机号码" }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-xs-6" },
                                        h("input", { type: "text", name: "verifyCode", className: "form-control", placeholder: "验证码" })),
                                    h("div", { className: "col-xs-6" },
                                        h("button", { type: "button", className: "btn btn-block btn-success", disabled: this.state.letfSeconds > 0, onClick: () => this.sendVerifyCode() }, this.state.letfSeconds > 0 ? `发送验证码(${this.state.letfSeconds})` : '发送验证码')),
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
                                                // e.onclick = ui.buttonOnClick(() => this.register(), { toast: '注册成功' });
                                                ui.buttonOnClick(e, () => this.register(), { toast: '注册成功' });
                                            } }, "\u7ACB\u5373\u6CE8\u518C"))))))
                ];
            }
        }
        ReactDOM.render(h(RegisterPage, null), page.element);
        page.showing.add(() => {
            debugger;
        });
    }
    exports.default = default_1;
});
