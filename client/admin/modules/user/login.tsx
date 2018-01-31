import { Service } from 'services/service';
import { UserService } from 'adminServices/user';
import app from 'application';
import { default as site } from 'site';
import { FormValidator, rules } from 'dilu';
import * as wz from 'myWuZhui';
import * as ui from 'ui';

export default async function (page: chitu.Page) {

    let userService = page.createService(UserService);
    class LoginPage extends React.Component<{}, {}>{
        validator: FormValidator;
        element: HTMLElement;
        usernameInput: HTMLInputElement;
        passwordInput: HTMLInputElement;

        constructor(props) {
            super(props);
            Service.token = '';
        }

        componentDidMount() {
            let usernameElement = this.element.querySelector('[name="username"]') as HTMLInputElement;
            let passwordElement = this.element.querySelector('[name="password"]') as HTMLInputElement;
            this.validator = new FormValidator(
                { element: usernameElement, rules: [rules.required()] },
                { element: passwordElement, rules: [rules.required()] }
            )
        }
        async login() {
            let isValid = await this.validator.check();
            if (!isValid) {
                return Promise.resolve();
            }
            return userService.login(this.usernameInput.value, this.passwordInput.value)
                .then(function () {
                    app.redirect(`user/myStores`);
                });
        }
        render() {
            return (
                <div className="form-horizontal container" style={{ maxWidth: 500 }}
                    ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="form-group" >
                        <label className="col-sm-2 control-label">用户名</label>
                        <div className="col-sm-10" >
                            <input name="username" type="text" className="form-control"
                                ref={(e: HTMLInputElement) => this.usernameInput = e || this.usernameInput} />
                        </div>
                    </div>
                    <div className="form-group" >
                        <label className="col-sm-2 control-label">密码</label>
                        <div className="col-sm-10">
                            <input type="password" name="password" className="form-control"
                                ref={(e: HTMLInputElement) => this.passwordInput = e || this.passwordInput} />
                        </div>
                    </div>
                    <div className="form-group" >
                        <div className="col-sm-offset-2 col-sm-10" >
                            <button type="button" className="btn btn-primary btn-block"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(() => this.login());
                                }}>
                                <i className="icon-key"></i>
                                立即登录
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10" >
                            <div className="pull-left" >
                                <a href="#user/forgetPassword" > 忘记密码 </a>
                            </div>
                            <div className="pull-right" >
                                <a href="#user/register" > 注册 </a>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<LoginPage />, page.element);
}

// function page_load(page: chitu.Page) {
//     var $ctrls = $('#sidebar, #breadcrumbs, #navbar-container > [role="navigation"]');
//     var model = {
//         username: ko.observable(''),//admin
//         password: ko.observable(''),
//         login: function () {
//             if (!(model as any).isValid()) {
//                 val.showAllMessages();
//                 return Promise.resolve();
//             }
//             return shopAdmin.login(model.username(), model.password())
//                 .then(function () {
//                     //$('#navbar').find('[name="username"]').text(model.username());
//                     app.redirect(site.config.startUrl);
//                     $ctrls.show();
//                 });
//         }
//     };

//     model.username.extend({ required: true });
//     model.password.extend({ required: true });
//     var val = validation.group(model);

//     ko.applyBindings(model, page.element);
//     $ctrls.hide();
// }