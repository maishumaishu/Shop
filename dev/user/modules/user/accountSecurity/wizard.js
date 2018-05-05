var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/memberService", "ui", "dilu", "controls/verifyCodeButton"], function (require, exports, memberService_1, ui, dilu_1, verifyCodeButton_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let member = new memberService_1.MemberService();
    // requirejs(['css!content/app/user/accountSecurity/wizard']);
    class WizardComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { step: 0 };
        }
        nextStep() {
            return __awaiter(this, void 0, void 0, function* () {
                let isValid = yield this.validator.check();
                if (isValid == false) {
                    return;
                }
                if (!this.smsId) {
                    this.verifyCodeErrorElement.innerHTML = '验证码不正确';
                    this.verifyCodeErrorElement.style.display = 'block';
                    return;
                }
                let checkResult = yield member.checkVerifyCode(this.smsId, this.verifyCodeInput.value);
                if (!checkResult) {
                    this.verifyCodeErrorElement.innerHTML = '验证码不正确';
                    this.verifyCodeErrorElement.style.display = 'block';
                    return;
                }
                this.state.step = 1;
                this.setState(this.state);
                return Promise.resolve({});
            });
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.stepOneForm, { name: "verifyCode", rules: [dilu_1.rules.required()] });
            // this.validator.registerCallback('verifyCodeCheck', (value) => {
            // })
        }
        render() {
            let userInfo = this.props.userInfo;
            let { step } = this.state;
            return (h("div", { className: "wizard container" },
                h("div", { className: "step" },
                    h("div", { className: step == 0 ? "step1 active" : 'step1' },
                        h("span", null, "1"),
                        h("div", { className: "name" }, "\u8EAB\u4EFD\u9A8C\u8BC1")),
                    h("div", { className: step == 1 ? "step2 active" : 'step2' },
                        h("span", null, "2"),
                        h("div", { "data-bind": "text:stepTwoName", className: "name" })),
                    h("hr", null),
                    h("div", { className: "clearfix" })),
                h("hr", { className: "row" }),
                h("div", { name: "stepOne", className: "form-horizontal", style: { display: step == 0 ? 'block' : 'none' }, ref: (e) => this.stepOneForm = e || this.stepOneForm },
                    h("div", { style: { display: userInfo.Mobile ? null : 'none' } },
                        h("div", { className: "form-group" },
                            h("div", { className: "col-xs-12" },
                                "\u4F60\u5F53\u524D\u7684\u624B\u673A\u53F7\u7801\u662F",
                                h("span", null, userInfo.Mobile))),
                        h("div", { className: "form-group" },
                            h("div", { className: "col-xs-6" },
                                h("input", { type: "text", name: "verifyCode", className: "form-control", placeholder: "验证码", ref: (e) => {
                                        if (!e)
                                            return;
                                        this.verifyCodeInput = e;
                                        this.verifyCodeInput.onchange = () => {
                                            this.verifyCode = this.verifyCodeInput.value;
                                        };
                                    } })),
                            h("div", { className: "col-xs-6" },
                                h(verifyCodeButton_1.default, { get_mobile: () => userInfo.Mobile, set_smsId: (value) => this.smsId = value, type: 'changeMobile' })),
                            h("div", { className: "col-xs-12" },
                                h("span", { className: "verifyCode validationMessage", ref: (e) => this.verifyCodeErrorElement = e || this.verifyCodeErrorElement }))),
                        h("div", { className: "form-group" },
                            h("div", { className: "col-xs-12" },
                                h("button", { type: "button", className: "btn btn-success btn-block", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.nextStep());
                                    } }, "\u4E0B\u4E00\u6B65")))),
                    h("div", { style: { display: userInfo.Mobile ? 'none' : null } },
                        h("div", { className: "form-group" },
                            h("div", { className: "col-xs-12" },
                                h("div", { className: "alert alert-danger" }, "\u9700\u8981\u7ED1\u5B9A\u624B\u673A\u53F7\u7801\uFF0C\u624D\u80FD\u8FDB\u884C\u8BBE\u7F6E\uFF0C\u8BF7\u5148\u7ED1\u5B9A\u624B\u673A\u53F7\u7801\u3002"))))),
                h("div", { name: "stepTwo", className: "form-horizontal", style: { display: step == 1 ? 'block' : 'none' } }, this.props.children)));
        }
    }
    exports.default = WizardComponent;
});
