import { Service, systemWeiXinAppId } from 'services/service';
import { UserService } from 'adminServices/user';
import { WeiXinService } from 'adminServices/weixin';
import app from 'application';
import { default as site } from 'site';
import { FormValidator, rules } from 'dilu';
import * as wz from 'myWuZhui';
import * as ui from 'ui';
import QRCode = require('qrcode');
import { websocketUrl, shopName } from 'share/common'
import { showQRCodeDialog } from 'weixin/modules/openid';
import siteMap from 'siteMap';

export default async function (page: chitu.Page) {
    app.loadCSS(page.name);
    let userService = page.createService(UserService);
    let weixinService = page.createService(WeiXinService);

    class LoginPage extends React.Component<{}, {}>{
        validator: FormValidator;
        element: HTMLElement;
        usernameInput: HTMLInputElement;
        passwordInput: HTMLInputElement;
        private dialogElement: HTMLElement;
        private qrcodeElement: HTMLElement;

        constructor(props) {
            super(props);
            Service.token.value = '';
        }

        componentDidMount() {
            let usernameElement = this.element.querySelector('[name="username"]') as HTMLInputElement;
            let passwordElement = this.element.querySelector('[name="password"]') as HTMLInputElement;
            this.validator = new FormValidator(this.element,
                { name: "username", rules: [rules.required()] },
                { name: "password", rules: [rules.required()] }
            )
        }
        async login() {
            let isValid = await this.validator.check();
            if (!isValid) {
                return Promise.resolve();
            }
            await userService.login(this.usernameInput.value, this.passwordInput.value);
            this.redirectDefaultPage();
        }
        showDialog() {
            let self = this;
            showQRCodeDialog({
                title: '登录',
                tips: '扫描二维码登录',
                element: this.dialogElement,
                mobilePageName: 'adminLogin',
                async callback(openId: string) {
                    let result = await weixinService.login(openId) as { SellerId: string };
                    if (result.SellerId != null) {
                        ui.confirm({
                            message: '微信用户尚未绑定,是否注册新用户?', async confirm() {
                                await userService.registerById(result.SellerId);
                                self.redirectDefaultPage();
                            }
                        })
                        throw new Error("微信用户尚未绑定");
                    }
                    self.redirectDefaultPage();
                }
            }).catch((exc) => {
                app.error.fire(app, exc, page);
            })
        }
        redirectDefaultPage() {
            app.redirect(siteMap.nodes.user_myStores);
        }
        render() {
            return [
                <h1 key={8} className="text-center" style={{ paddingBottom: 50 }}>{shopName}商家后台</h1>,
                <div key={10} className="form-horizontal container" style={{ maxWidth: 500 }}
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
                                <button className="btn-link"
                                    onClick={() => app.redirect(siteMap.nodes.user_forgetPassword)}>
                                    忘记密码
                                </button>
                            </div>
                            <div className="pull-right" >
                                <button className="btn-link"
                                    onClick={() => app.redirect(siteMap.nodes.user_register)} >
                                    注册
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group text-center">
                        <hr />
                        <div className="col-sm-offset-2 col-sm-10">
                            <img src="content/images/weixin_icon.png"
                                onClick={() => this.showDialog()}
                                style={{ width: 80 }} />
                            <h4>使用微信扫描二维码登录</h4>
                        </div>
                    </div>
                </div>,
                <div key={20} className="modal fade"
                    ref={(e: HTMLElement) => this.dialogElement = e}>
                    <div className="modal-dialog" style={{ width: 320 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => ui.hideDialog(this.dialogElement)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">微信扫描二维码</h4>
                            </div>
                            <div className="modal-body">
                                <div className="qrcodeElement" ref={(e: HTMLElement) => this.qrcodeElement = e}>
                                    <img style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div className="modal-footer">
                            </div>
                        </div>
                    </div>
                </div>
            ];
        }
    }

    ReactDOM.render(<LoginPage />, page.element);
}

