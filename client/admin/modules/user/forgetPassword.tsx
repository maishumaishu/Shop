import { FormValidator, rules } from 'dilu';
import { UserService } from 'admin/services/user';
import * as ui from 'ui';
import app from 'admin/application';
import { siteMap } from 'admin/siteMap';

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


            this.registerValidation = new FormValidator(this.formElement,
                { name: "mobile", rules: [rules.required("手机不能为空"), rules.mobile('手机号码不正确')] },
                { name: "verifyCode", rules: [rules.required('两次输入的密码不正确')], errorElement: this.validateCodeError },
                { name: "password", rules: [rules.required("密码不能为空")] },
                { name: "confirmPassword", rules: [rules.required("请再次确认密码")] }
            )

            this.verifyCodeValidation = new FormValidator(this.formElement,
                { name: "mobile", rules: [rules.required(), rules.mobile('手机号码不正确')] }
            )
        }

        async resetPassword() {
            this.registerValidation.clearErrors();
            this.verifyCodeValidation.clearErrors();

            let isValid = await this.registerValidation.check();
            if (!isValid) {
                throw new Error("validate fail");
            }

            let username = this.mobileInput.value;
            let password = this.passwordInput.value;

            let verifyCode = this.verifyCodeInput.value;
            return userService.resetPassword({ smsId: this.smsId, username, password, verifyCode }).then(data => {
                app.redirect(siteMap.nodes.user_myStores);
                return data;
            });
        }
        async sendVerifyCode() {
            this.registerValidation.clearErrors();
            this.verifyCodeValidation.clearErrors();
            let isValid = await this.verifyCodeValidation.check();
            if (!isValid) {
                return;
            }

            let isMobileRegister = await userService.isMobileRegister(this.mobileInput.value);
            if (!isMobileRegister) {
                this.mobileError.innerText = '手机号码未注册';
                this.mobileError.style.display = 'block';
                return;
            }
            userService.sendVerifyCode(this.mobileInput.value).then((result) => {
                this.smsId = result.SmsId;
            });

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
                        <h2>{siteMap.nodes.user_forgetPassword.title}</h2>
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
                                        e.onclick = ui.buttonOnClick(() => this.resetPassword())
                                    }}>
                                    <i className="icon-key"></i>
                                    重置密码
                            </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <div className="pull-left">
                                    <button className="btn-link"
                                        onClick={() => app.redirect(siteMap.nodes.user_register)}>
                                        {siteMap.nodes.user_register.title}
                                    </button>
                                </div>
                                <div className="pull-right">
                                    <button className="btn-link"
                                        onClick={() => app.redirect(siteMap.nodes.user_login)}>
                                        {siteMap.nodes.user_login.title}
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