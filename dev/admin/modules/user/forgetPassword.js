var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "dilu", "admin/services/user", "ui", "admin/application", "admin/siteMap"], function (require, exports, dilu_1, user_1, ui, application_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let userService = page.createService(user_1.UserService);
        // app.loadCSS(page.name);
        class RegisterPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { buttonText: '发送验证码', buttonEnable: true };
            }
            componentDidMount() {
                let mobile = this.formElement.querySelector('[name="mobile"]');
                let verifyCode = this.formElement.querySelector('[name="verifyCode"]');
                let password = this.formElement.querySelector('[name="password"]');
                let confirmPassword = this.formElement.querySelector('[name="confirmPassword"]');
                this.registerValidation = new dilu_1.FormValidator(this.formElement, { name: "mobile", rules: [dilu_1.rules.required("手机不能为空"), dilu_1.rules.mobile('手机号码不正确')] }, { name: "verifyCode", rules: [dilu_1.rules.required('两次输入的密码不正确')], errorElement: this.validateCodeError }, { name: "password", rules: [dilu_1.rules.required("密码不能为空")] }, { name: "confirmPassword", rules: [dilu_1.rules.required("请再次确认密码")] });
                this.verifyCodeValidation = new dilu_1.FormValidator(this.formElement, { name: "mobile", rules: [dilu_1.rules.required(), dilu_1.rules.mobile('手机号码不正确')] });
            }
            resetPassword() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.registerValidation.clearErrors();
                    this.verifyCodeValidation.clearErrors();
                    let isValid = yield this.registerValidation.check();
                    if (!isValid) {
                        throw new Error("validate fail");
                    }
                    let username = this.mobileInput.value;
                    let password = this.passwordInput.value;
                    let verifyCode = this.verifyCodeInput.value;
                    return userService.resetPassword({ smsId: this.smsId, username, password, verifyCode }).then(data => {
                        application_1.default.redirect(siteMap_1.siteMap.nodes.user_myStores);
                        return data;
                    });
                });
            }
            sendVerifyCode() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.registerValidation.clearErrors();
                    this.verifyCodeValidation.clearErrors();
                    let isValid = yield this.verifyCodeValidation.check();
                    if (!isValid) {
                        return;
                    }
                    let isMobileRegister = yield userService.isMobileRegister(this.mobileInput.value);
                    if (!isMobileRegister) {
                        this.mobileError.innerText = '手机号码未注册';
                        this.mobileError.style.display = 'block';
                        return;
                    }
                    userService.sendVerifyCode(this.mobileInput.value).then((result) => {
                        this.smsId = result.SmsId;
                    });
                    let setButtonText = (seconds) => {
                        if (seconds <= 0) {
                            clearInterval(this.intervalId);
                            this.state.buttonText = `发送验证码`;
                            this.state.buttonEnable = true;
                        }
                        else {
                            this.state.buttonText = `发送验证码(${seconds})`;
                            this.state.buttonEnable = false;
                        }
                        this.setState(this.state);
                    };
                    let leftSeconds = 60;
                    this.intervalId = window.setInterval(() => {
                        leftSeconds = leftSeconds - 1;
                        setButtonText(leftSeconds);
                    }, 1000);
                    setButtonText(leftSeconds);
                });
            }
            render() {
                return (h("div", { className: "container" },
                    h("div", { ref: (o) => this.formElement = o, className: "User-Register form-horizontal col-md-6 col-md-offset-3" },
                        h("h2", null, siteMap_1.siteMap.nodes.user_forgetPassword.title),
                        h("hr", null),
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2 control-label" }, "\u624B\u673A\u53F7\u7801"),
                            h("div", { className: "col-sm-10" },
                                h("input", { ref: (o) => this.mobileInput = o, name: "mobile", type: "text", className: "form-control" }),
                                h("span", { className: "mobile validationMessage", style: { display: 'none' }, ref: (e) => this.mobileError = e || this.mobileError }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2 control-label" }, "\u9A8C\u8BC1\u7801"),
                            h("div", { className: "col-sm-10" },
                                h("div", { className: "input-group" },
                                    h("input", { ref: (o) => this.verifyCodeInput = o, name: "verifyCode", className: "form-control" }),
                                    h("span", { className: "input-group-btn" },
                                        h("button", { onClick: () => this.sendVerifyCode(), className: "btn btn-default", disabled: !this.state.buttonEnable }, this.state.buttonText))),
                                h("span", { className: dilu.FormValidator.errorClassName, style: { display: 'none' }, ref: (e) => this.validateCodeError = e || this.validateCodeError }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2 control-label" }, "\u5BC6\u7801"),
                            h("div", { className: "col-sm-10" },
                                h("input", { ref: (o) => this.passwordInput = o, type: "password", name: "password", className: "form-control" }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2 control-label" }, "\u786E\u8BA4\u5BC6\u7801"),
                            h("div", { className: "col-sm-10" },
                                h("input", { type: "password", name: "confirmPassword", className: "form-control" }))),
                        h("div", { className: "form-group" },
                            h("div", { className: "col-sm-offset-2 col-sm-10" },
                                h("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.resetPassword());
                                    } },
                                    h("i", { className: "icon-key" }),
                                    "\u91CD\u7F6E\u5BC6\u7801"))),
                        h("div", { className: "form-group" },
                            h("div", { className: "col-sm-offset-2 col-sm-10" },
                                h("div", { className: "pull-left" },
                                    h("button", { className: "btn-link", onClick: () => application_1.default.redirect(siteMap_1.siteMap.nodes.user_register) }, siteMap_1.siteMap.nodes.user_register.title)),
                                h("div", { className: "pull-right" },
                                    h("button", { className: "btn-link", onClick: () => application_1.default.redirect(siteMap_1.siteMap.nodes.user_login) }, siteMap_1.siteMap.nodes.user_login.title)))))));
            }
        }
        ReactDOM.render(h(RegisterPage, null), page.element);
    }
    exports.default = default_1;
});
