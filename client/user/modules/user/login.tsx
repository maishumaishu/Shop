import { defaultNavBar } from 'user/site';
import { MemberService } from 'user/services/memberService';
import { app } from 'user/site';
import { FormValidator, rules } from 'dilu';
import { UserPage } from 'user/application';
import siteMap from 'user/siteMap';

export default function (page: UserPage) {
    let member = page.createService(MemberService);
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let formElement: HTMLFormElement;

    page.loadCSS();

    class UserLoginPage extends React.Component<any, any> {
        private validator: FormValidator;
        async login() {
            let isValid = await this.validator.check();
            if (!isValid)
                return;

            await member.login(usernameInput.value, passwordInput.value);
            app().redirect(siteMap.nodes[returnPage]);
        }
        componentDidMount() {
            let { required } = rules;
            this.validator = new FormValidator(formElement,
                { name: "username", rules: [required("请输入手机号码")] },
                { name: "password", rules: [required("请输入密码")] }
            )
        }
        render() {
            return [
                <header key="header">
                    {defaultNavBar(page, { title: "登录" })}
                </header>,
                <section key="view">
                    <form className="form-horizontal container"
                        ref={(e: HTMLFormElement) => formElement = e || formElement}>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <input type="text" name="username" className="form-control" placeholder="手机号码"
                                    ref={(e: HTMLInputElement) => usernameInput = e || usernameInput} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <input type="password" name="password" className="form-control" placeholder="密码"
                                    ref={(e: HTMLInputElement) => passwordInput = e || passwordInput} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-xs-12">
                                <button id="Login" type="button" className="btn btn-primary btn-block"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.login());
                                    }}>立即登录</button>
                            </div>
                            <div className="col-xs-12 text-center" style={{ marginTop: 10 }}>
                                <a href="#user_register" className="pull-left">我要注册</a>
                                <a href="#user_resetPassword" className="pull-right">忘记密码</a>
                            </div>
                        </div>
                    </form>
                </section>
            ];
        }
    }

    let returnPage: string = page.data.reutrn || 'user_index';

    ReactDOM.render(<UserLoginPage />, page.element);
}