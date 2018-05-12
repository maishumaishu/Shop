import { MemberService as UserService } from 'admin/services/member';
import app from 'admin/application';
import { siteMap } from 'admin/pageNodes';
import * as ui from 'ui';
import { FormValidator, rules } from 'dilu';

export default function (page: chitu.Page) {

    let userService = page.createService(UserService);
    // app.loadCSS(page.name);
    class RegisterPage extends React.Component<{}, { buttonText: string, buttonEnable: boolean }>{
        private validateCodeError: HTMLElement;
        private formElement: HTMLFormElement;
        private registerValidation: FormValidator;
        private verifyCodeValidation: FormValidator;
        private intervalId: number;
        private mobileInput: HTMLInputElement;
        private passwordInput: HTMLInputElement;
        private verifyCodeInput: HTMLInputElement;
        private mobileError: HTMLElement;

        private smsId: string;

        constructor(props) {
            super(props);
            this.state = { buttonText: '发送验证码', buttonEnable: true };
        }

        componentDidMount() {
            let mobile = this.formElement.querySelector('[name="mobile"]') as HTMLInputElement;
            let verifyCode = this.formElement.querySelector('[name="verifyCode"]') as HTMLInputElement;
            let password = this.formElement.querySelector('[name="password"]') as HTMLInputElement;
            let confirmPassword = this.formElement.querySelector('[name="confirmPassword"]') as HTMLInputElement;
            // this.registerValidation = new FormValidator(this.formElement, {
            //     mobile: { rules: ['required', 'mobile'] },
            //     verifyCode: { rules: ['required'] },
            //     password: { rules: ['required'] },
            //     confirmPassword: { rules: ['required', { name: 'matches', params: ['password'] }] }
            // });

            // this.registerValidation.messages['mobile'] = '手机号码不正确';
            // this.registerValidation.messages['matches'] = '两次输入的密码不正确';

            // this.verifyCodeValidation = new FormValidator(this.formElement, {
            //     mobile: { rules: ['required', 'mobile'] }
            // });

            // this.verifyCodeValidation.messages['mobile'] = '手机号码不正确';

            this.registerValidation = new FormValidator(this.formElement,
                { name: "mobile", rules: [rules.required("手机不能为空"), rules.mobile('手机号码不正确')] },
                { name: "verifyCode", rules: [rules.required('两次输入的密码不正确')], errorElement: this.validateCodeError },
                { name: "password", rules: [rules.required("密码不能为空")] },
                { name: "confirmPassword", rules: [rules.required("请再次确认密码")] }
            )

            this.verifyCodeValidation = new FormValidator(this.formElement,
                { name: "mobile", rules: [rules.required("手机不能为空"), rules.mobile('手机号码不正确')] }
            )
        }

        async  register() {
            this.registerValidation.clearErrors();
            this.verifyCodeValidation.clearErrors();

            let isValid = await this.registerValidation.check();
            if (!isValid) {
                throw new Error("validate fail");
            }

            let username = this.mobileInput.value;
            let password = this.passwordInput.value;

            let verifyCode = this.verifyCodeInput.value;
            return userService.register({ smsId: this.smsId, username, password, verifyCode }).then(data => {
                app.redirect(siteMap.nodes.user_myStores);
                return data;
            });
        }
        async sendVerifyCode() {
            this.registerValidation.clearErrors();
            this.verifyCodeValidation.clearErrors();
            let isValid = await this.verifyCodeValidation.check();
            if (!isValid) {
                throw new Error("validate fail");
            }

            let isMobileRegister = await userService.isMobileRegister(this.mobileInput.value);
            if (isMobileRegister) {
                this.mobileError.innerText = '手机号码已被注册';
                this.mobileError.style.display = 'block';
                return;
            }
            let result = await userService.sendVerifyCode(this.mobileInput.value);
            this.smsId = result.SmsId;

            let setButtonText = (seconds: number) => {
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

        }
        render() {
            return (
                <div className="container">
                    <div ref={(o: HTMLFormElement) => this.formElement = o} className="User-Register form-horizontal col-md-6 col-md-offset-3">
                        <h2>立即注册</h2>
                        <hr />
                        <div className="form-group">
                            <label className="col-sm-2 control-label">手机号码</label>
                            <div className="col-sm-10">
                                <input ref={(o: HTMLInputElement) => this.mobileInput = o} name="mobile" type="text" className="form-control" />
                                <span className="mobile validationMessage" style={{ display: 'none' }}
                                    ref={(e: HTMLElement) => this.mobileError = e || this.mobileError}></span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">验证码</label>
                            <div className="col-sm-10">

                                <div className="input-group">
                                    <input ref={(o: HTMLInputElement) => this.verifyCodeInput = o} name="verifyCode" className="form-control" />
                                    <span className="input-group-btn">
                                        <button onClick={() => this.sendVerifyCode()} className="btn btn-default" disabled={!this.state.buttonEnable}>
                                            {this.state.buttonText}
                                        </button>
                                    </span>
                                </div>
                                <span className={dilu.FormValidator.errorClassName} style={{ display: 'none' }}
                                    ref={(e: HTMLElement) => this.validateCodeError = e || this.validateCodeError}></span>
                                {/* <span className="verifyCode validationMessage" style={{ display: 'none' }}></span> */}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">密码</label>
                            <div className="col-sm-10">
                                <input ref={(o: HTMLInputElement) => this.passwordInput = o} type="password" name="password" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">确认密码</label>
                            <div className="col-sm-10">
                                <input type="password" name="confirmPassword" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button className="btn btn-primary btn-block"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.register())
                                    }}>
                                    <i className="icon-key"></i>
                                    立即注册
                            </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <div className="pull-left">
                                    <button className="btn-link"
                                        onClick={() => app.redirect(siteMap.nodes.user_forgetPassword)}>
                                        忘记密码
                                    </button>
                                </div>
                                <div className="pull-right">
                                    <button className="btn-link"
                                        onClick={() => app.redirect(siteMap.nodes.user_login)}>
                                        登录
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<RegisterPage />, page.element);

} 