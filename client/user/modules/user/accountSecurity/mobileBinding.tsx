import { defaultNavBar } from 'site';
import { MemberService } from 'user/services/memberService';
import * as ui from 'ui';
import { FormValidator, rules } from 'dilu';
import WizardComponent from 'modules/user/accountSecurity/wizard';
import VerifyCodeButton from 'controls/verifyCodeButton';
import { Page } from 'user/application';

export interface MobileBindingPageArguments {
    mobileChanged: (mobile: string) => void
}

export default function (page: Page) {
    page.loadCSS();
    let args: MobileBindingPageArguments = page.data as MobileBindingPageArguments;
    let member = page.createService(MemberService);

    class MobileBindingPage extends React.Component<{ userInfo: UserInfo }, {}>{
        private mobileInput: HTMLInputElement;
        private verifyCodeInput: HTMLInputElement;
        private smsId: string;
        private validator: FormValidator;

        constructor(props) {
            super(props);
        }
        componentDidMount() {

        }
        changeMobile() {
            let mobile = this.mobileInput.value;
            let verifyCode = this.verifyCodeInput.value;
            return member.changeMobile(mobile, this.smsId, verifyCode).then(() => {
                if (args.mobileChanged) {
                    args.mobileChanged(mobile);
                }
            });
        }
        render() {
            return [
                <header key="h">
                    {defaultNavBar(page, { title: '手机绑定' })}
                </header>,
                <section key="v">
                    <WizardComponent userInfo={this.props.userInfo}>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <input className="form-control" type="text" placeholder="请输入手机号码"
                                    ref={(e: HTMLInputElement) => this.mobileInput = e || this.mobileInput} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-6">
                                <input name="VerifyCode" type="text" className="form-control" placeholder="验证码"
                                    ref={(e: HTMLInputElement) => this.verifyCodeInput = e || this.verifyCodeInput} />
                            </div>
                            <div className="col-xs-6">
                                <VerifyCodeButton get_mobile={() => this.mobileInput.value} set_smsId={(value) => this.smsId = value} type="changeMobile" />
                            </div>
                            <div className="col-xs-12">
                                <span className="verifyCode validationMessage"></span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <button type="button" className="btn btn-success btn-block"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.changeMobile(), { toast: '设置手机号码成功' })
                                    }}>立即设置</button>
                            </div>
                        </div>
                    </WizardComponent>
                </section>
            ];
        }
    }

    member.userInfo().then(userInfo => {
        ReactDOM.render(<MobileBindingPage userInfo={userInfo} />, page.element);
    });
}