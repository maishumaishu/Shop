import { MemberService } from 'userServices/memberService';
import * as ui from 'ui';

import { FormValidator, rules } from 'dilu';
import VerifyCodeButton from 'components/verifyCodeButton';

let member = new MemberService();
// requirejs(['css!content/app/user/accountSecurity/wizard']);
class WizardComponent extends React.Component<{ userInfo: UserInfo } & React.Props<WizardComponent>, { step: number }>{
    smsId: string;
    verifyCode: string;

    private validator: FormValidator;
    private stepOneForm: HTMLFormElement;
    private verifyCodeInput: HTMLInputElement;
    private verifyCodeErrorElement: HTMLElement;

    constructor(props) {
        super(props);
        this.state = { step: 0 };
    }
    async nextStep(): Promise<any> {
        let isValid = await this.validator.check();
        if (isValid == false) {
            return;
        }

        if (!this.smsId) {
            this.verifyCodeErrorElement.innerHTML = '验证码不正确';
            this.verifyCodeErrorElement.style.display = 'block';
            return;
        }

        let checkResult = await member.checkVerifyCode(this.smsId, this.verifyCodeInput.value);
        if (!checkResult) {
            this.verifyCodeErrorElement.innerHTML = '验证码不正确';
            this.verifyCodeErrorElement.style.display = 'block';
            return;
        }

        this.state.step = 1;
        this.setState(this.state);

        return Promise.resolve({});
    }

    nextStepControl: JSX.Element;
    componentDidMount() {
        this.validator = new FormValidator(
            { element: this.verifyCodeInput, rules: [rules.required()] }
        );
        // this.validator.registerCallback('verifyCodeCheck', (value) => {

        // })

    }
    render() {
        let userInfo = this.props.userInfo;
        let { step } = this.state;

        return (
            <div className="wizard container">
                <div className="step">
                    <div className={step == 0 ? "step1 active" : 'step1'} >
                        <span>1</span>
                        <div className="name">身份验证</div>
                    </div>
                    <div className={step == 1 ? "step2 active" : 'step2'}>
                        <span>2</span>
                        <div data-bind="text:stepTwoName" className="name"></div>
                    </div>
                    <hr />
                    <div className="clearfix"></div>
                </div>
                <hr className="row" />
                <div name="stepOne" className="form-horizontal" style={{ display: step == 0 ? 'block' : 'none' }}
                    ref={(e: HTMLFormElement) => this.stepOneForm = e || this.stepOneForm}>
                    {/* {userInfo.Mobile ? */}
                    <div style={{ display: userInfo.Mobile ? null : 'none' }}>
                        <div className="form-group">
                            <div className="col-xs-12">你当前的手机号码是<span>{userInfo.Mobile}</span></div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-6">
                                <input type="text" name="verifyCode" className="form-control" placeholder="验证码"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        this.verifyCodeInput = e;
                                        this.verifyCodeInput.onchange = () => {
                                            this.verifyCode = this.verifyCodeInput.value;
                                        }
                                    }} />
                            </div>
                            <div className="col-xs-6">
                                <VerifyCodeButton get_mobile={() => userInfo.Mobile} set_smsId={(value: string) => this.smsId = value} type='changeMobile' />
                            </div>
                            <div className="col-xs-12">
                                <span className="verifyCode validationMessage"
                                    ref={(e: HTMLSpanElement) => this.verifyCodeErrorElement = e || this.verifyCodeErrorElement}></span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <button type="button" className="btn btn-success btn-block"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.nextStep());
                                    }}>下一步</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: userInfo.Mobile ? 'none' : null }}>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <div className="alert alert-danger">需要绑定手机号码，才能进行设置，请先绑定手机号码。</div>
                            </div>
                        </div>
                    </div>
                    {/* } */}
                </div>

                <div name="stepTwo" className="form-horizontal" style={{ display: step == 1 ? 'block' : 'none' }}>
                    {this.props.children}
                </div>

            </div>
        );
    }
}

export default WizardComponent;