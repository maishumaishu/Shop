var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/memberService"], function (require, exports, memberService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let member = new memberService_1.MemberService();
    class VerifyCodeButton extends React.Component {
        constructor(props) {
            super(props);
            this.state = { letfSeconds: 0 };
        }
        sendVerifyCode() {
            return __awaiter(this, void 0, void 0, function* () {
                let mobile = this.props.get_mobile();
                if (!mobile) {
                    throw new Error('mobile cannt empty.');
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
                yield member.sentVerifyCode(mobile, this.props.type)
                    .then((data) => {
                    this.props.set_smsId(data.smsId);
                })
                    .catch((err) => {
                    this.state.letfSeconds = 0;
                    this.setState(this.state);
                    throw err;
                });
            });
        }
        render() {
            return (h("button", { type: "button", className: "btn btn-block btn-primary", disabled: this.state.letfSeconds > 0, onClick: () => this.sendVerifyCode() }, this.state.letfSeconds > 0 ? `发送验证码(${this.state.letfSeconds})` : '发送验证码'));
        }
    }
    exports.default = VerifyCodeButton;
});
