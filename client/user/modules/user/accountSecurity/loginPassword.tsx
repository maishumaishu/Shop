import { defaultNavBar } from 'site';
import { FormValidator, rules } from 'dilu';
import WizardComponent from 'modules/user/accountSecurity/wizard';
import { MemberService } from 'userServices/memberService';
import * as ui from 'ui';
import { Page } from 'user/application';

export default function (page: Page) {
    page.loadCSS();
    class LoginPasswordPage extends React.Component<{ userInfo: UserInfo }, { step: number }>{
        private validator: FormValidator;
        private form: HTMLElement;
        private passwordInput: HTMLInputElement;
        private confirmPasswordInput: HTMLInputElement;
        private wizard: WizardComponent;

        constructor(props) {
            super(props);
            this.state = { step: 0 };
        }
        componentDidMount() {
            // this.validator = new FormValidator(this.form, {
            //     password: { rules: ['required'] },
            //     confirmPassword: {
            //         rules: [
            //             'required',
            //             { name: 'matches', params: ['password'] }
            //         ],
            //         messages: {
            //             matches: '两次输入的密码不正确'
            //         }
            //     }
            // })
            let { required } = rules;
            this.validator = new FormValidator(
                { element: this.passwordInput, rules: [required()] },
                { element: this.confirmPasswordInput, rules: [required()] }
            )
        }
        async changePassword(): Promise<any> {
            let isValid = await this.validator.check();
            if (!isValid) {
                return Promise.reject({});
            }

            let { smsId, verifyCode } = this.wizard;
            return member.changePassword(this.passwordInput.value, smsId, verifyCode);
        }
        render() {
            let userInfo = this.props.userInfo;
            let { step } = this.state;
            return [
                <header key="header">
                    {defaultNavBar(page, { title: '登录密码' })}
                </header>,
                <section key="section">
                    <WizardComponent userInfo={this.props.userInfo} ref={(e) => this.wizard = e || this.wizard}>
                        <div className="form-group" ref={(e: HTMLElement) => this.form = e ? e.parentElement : this.form}>
                            <div className="col-xs-12">
                                <input name="password" type="password" className="form-control" placeholder="请输入新的登录密码"
                                    ref={e => this.passwordInput = (e as HTMLInputElement) || this.passwordInput} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <input name="confirmPassword" type="password" className="form-control" placeholder="请再次输入登录密码"
                                    ref={(e => this.confirmPasswordInput = e as HTMLInputElement || this.confirmPasswordInput)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <button className="btn btn-block btn-primary"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.changePassword(), { toast: '修改密码成功' });

                                    }}>修改密码</button>
                            </div>
                        </div>
                    </WizardComponent>
                </section>
            ]
        }
    }

    let member = page.createService(MemberService);
    member.userInfo().then(userInfo => {
        ReactDOM.render(<LoginPasswordPage userInfo={userInfo} />, page.element);
    })
}