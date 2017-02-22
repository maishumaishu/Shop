import Validation = require('core/validate');
import smsService = require('services/SMS');
import userService = require('services/User');

var $ctrls = $('#sidebar, #breadcrumbs, #navbar-container > [role="navigation"]');
$ctrls.hide();

export default function (page: chitu.Page) {
    // let style = {
    //     label: {
    //         float: 'left',
    //         width: 100
    //     } as React.CSSProperties,
    //     input: {
    //         marginLeft: 110
    //     } as React.CSSProperties,
    //     form: {
    //         width: 400,
    //         marginLeft: -220,
    //         left: '50%',
    //         position: 'absolute'
    //     } as React.CSSProperties
    // }

    requirejs([`css!${page.routeData.actionPath}.css`]);

    class RegisterPage extends React.Component<{}, { buttonText: string, buttonEnable: boolean }>{
        private formElement: HTMLFormElement;
        private registerValidation: Validation;
        private verifyCodeValidation: Validation;
        private intervalId: number;
        private mobileInput: HTMLInputElement;
        private passwordInput: HTMLInputElement;
        private verifyCodeInput: HTMLInputElement;

        private smsId: string;

        constructor(props) {
            super(props);
            this.state = { buttonText: '发送验证码', buttonEnable: true };
        }

        componentDidMount() {
            this.registerValidation =
                new Validation(this.formElement, [
                    { name: 'mobile', rules: 'required|callback_mobile' },
                    { name: 'verifyCode', rules: 'required' },
                    { name: 'password', rules: 'required' },
                    { name: 'confirmPassword', rules: 'required|matches[password]' }
                ]).registerCallback('mobile', function (value) {
                    value = value || '';
                    return value.length == 11 && /^1[34578]\d{9}$/.test(value);
                }).setMessage('mobile', '手机号码不正确')
                    .setMessage('confirmPassword.matches', '两次输入的密码不正确');

            this.verifyCodeValidation = new Validation(this.formElement, [
                { name: 'mobile', rules: 'required|callback_mobile' }
            ]).registerCallback('mobile', function (value) {
                value = value || '';
                return value.length == 11 && /^1[34578]\d{9}$/.test(value);
            }).setMessage('mobile', '手机号码不正确');
        }

        register() {
            this.registerValidation.clearErrors();
            this.verifyCodeValidation.clearErrors();
            if (!this.registerValidation.validateForm()) {
                return;
            }

            let user = {
                mobile: this.mobileInput.value,
                password: this.passwordInput.value
            };

            let verifyCode = this.verifyCodeInput.value;
            userService.register({ smsId: this.smsId, user, verifyCode }).then((result) => {

            });
        }
        async sendVerifyCode() {
            this.registerValidation.clearErrors();
            this.verifyCodeValidation.clearErrors();
            if (!this.verifyCodeValidation.validateForm()) {
                return;
            }

            smsService.sendVerifyCode(this.mobileInput.value).then((result) => {
                this.smsId = result.smsId;
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
                        <div className="form-group">
                            <label className="col-sm-2 control-label">手机号码</label>
                            <div className="col-sm-10">
                                <input ref={(o: HTMLInputElement) => this.mobileInput = o} name="mobile" type="text" className="form-control" />
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
                                <span className="verifyCode validationMessage" style={{ display: 'none' }}></span>
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
                                <button onClick={() => this.register()} className="btn btn-primary btn-block">
                                    <i className="icon-key"></i>
                                    立即注册
                            </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <div className="pull-left">
                                    <a href="#User/ForgetPassword">忘记密码</a>
                                </div>
                                <div className="pull-right">
                                    <a href="#User/Login">登录</a>
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