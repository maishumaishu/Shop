import { defaultNavBar, app } from 'site';
import { FormValidator, rules } from 'dilu';
import { MemberService } from 'userServices/memberService';
import * as ui from 'ui';

export default function (page: chitu.Page) {
    let member = page.createService(MemberService);  //new services.MemberService();
    class ResetPasswordPage extends React.Component<{}, { letfSeconds: number }> {
        private validator: FormValidator;
        private formElement: HTMLFormElement;
        private smsId: string;

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
            let { required, matches } = rules;
            let e = this.formElement;
            this.validator = new FormValidator(
                { element: e["mobile"], rules: [required('请输入手机号码')] },
                { element: e["verifyCode"], rules: [required('请输入验证码')] },
                { element: e["password"], rules: [required('请输入密码')] },
                {
                    element: e["confirmPassword"], rules: [
                        required('请再次输入密码'),
                        matches(e["password"], "两次输入的密码不匹配")
                    ]
                }
            )
        }
        async  sendVerifyCode() {
            let isValid = await this.validator.check();
            if (isValid == false) {
                return;
            }

            await member.sentRegisterVerifyCode(this.formElement['mobile'].value)
                .then((data) => {
                    this.smsId = data.smsId;
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
        }
        async resetPassword() {
            let isValid = await this.validator.check();
            if (isValid == false) {
                return;
            }


            let mobile = this.formElement['mobile'].value;
            let password = this.formElement['password'].value;
            let verifyCode = this.formElement['verifyCode'].value;
            return member.resetPassword(mobile, password, this.smsId, verifyCode);
        }
        render() {
            return [
                <header>
                    {defaultNavBar({ title: "登录密码" })}
                </header>,
                <section>
                    <div className="container">
                        <form className="form-horizontal"
                            ref={(o: HTMLFormElement) => this.formElement = o || this.formElement}>
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <input className="form-control" type="text" name="mobile" placeholder="请输入手机号码" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-6">
                                    <input type="text" name="verifyCode" className="form-control" placeholder="验证码" />
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className="btn btn-block btn-success"
                                        disabled={this.state.letfSeconds > 0}
                                        ref={(e: HTMLButtonElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => {
                                                return this.sendVerifyCode();
                                            });
                                        }}>
                                        {this.state.letfSeconds > 0 ? `发送验证码(${this.state.letfSeconds})` : '发送验证码'}
                                    </button>
                                </div>
                                <div className="col-xs-12">
                                    <span className="verifyCode validationMessage"></span>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <input name="password" type="password" className="form-control" placeholder="请输入密码" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <input name="confirmPassword" type="password" className="form-control" placeholder="请再一次输入密码" />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-xs-12">
                                    <button type="button" className="btn btn-primary btn-block"
                                        ref={(e: HTMLButtonElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => {
                                                return this.resetPassword();
                                            }, { toast: '修改密码成功' });
                                        }}>重置密码</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            ]

        }
    }

    ReactDOM.render(<ResetPasswordPage />, page.element);
}