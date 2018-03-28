import { MemberService } from 'userServices/memberService';
import { WeiXinService } from 'adminServices/weixin';
import { Service } from 'userServices/Service';
import { default as adminApp } from 'application';
import { showQRCodeDialog } from 'weixin/modules/openid';
import { FormValidator, rules } from 'dilu';

export class UserLoginDialog extends React.Component<any, any>{
    private _element: HTMLElement;
    private static _instance: UserLoginDialog;
    private usernameElement: HTMLInputElement;
    private passwordElement: HTMLInputElement;
    private loginDialogElement: HTMLElement;

    private static get instance(): UserLoginDialog {
        if (!UserLoginDialog._instance) {
            let element = document.createElement('div');
            document.body.appendChild(element);
            UserLoginDialog._instance = ReactDOM.render(<UserLoginDialog />, element) as UserLoginDialog;
        }
        return UserLoginDialog._instance;
    }
    private _show() {
        ui.showDialog(this._element)
    }
    private _hide() {
        ui.hideDialog(this._element);
    }
    static show() {
        this.instance._show();
    }
    static hide() {
        this.instance._hide();
    }
    showDialog(): any {
        let weixin = adminApp.currentPage.createService(WeiXinService);
        showQRCodeDialog({
            title: '',
            tips: '',
            element: null,
            mobilePageName: 'login',
            callback(code: string) {
                return weixin.login(code);
            }
        })
    }
    async login() {
        console.assert(adminApp.currentPage != null);
        let memberService = adminApp.currentPage.createService(MemberService);
        memberService.login
        let username = this.usernameElement.value;
        let password = this.passwordElement.value;
        let validator = new FormValidator(
            { element: this.usernameElement, rules: [rules.required()] },
            { element: this.passwordElement, rules: [rules.required()] }
        )
        if (await !validator.check()) {
            return;
        }
        memberService.login(username, password).then(o => {
            location.reload();
        });
    }
    render() {
        return [
            <div key={10} className="modal fade" ref={(e: HTMLElement) => this._element = e}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">登录用户端</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group row">
                                <label className="control-label col-sm-2">
                                    *用户名
                                </label>
                                <div className="col-sm-10">
                                    <input className="form-control"
                                        ref={(e: HTMLInputElement) => this.usernameElement = e || this.usernameElement} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="control-label col-sm-2">
                                    *密码
                                </label>
                                <div className="col-sm-10">
                                    <input className="form-control" type="password"
                                        ref={(e: HTMLInputElement) => this.passwordElement = e || this.passwordElement} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <span style={{ fontWeight: 'blod' }}>注意：</span>
                                    <span>是商城的账号，不是后台，如果还没有，请点击注册按钮进行注册</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <button className="btn btn-block btn-primary" onClick={() => this.login()} >
                                        登录
                                </button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-12 text-center">
                                    <img src="content/images/weixin_icon.png"
                                        onClick={() => this.showDialog()}
                                        style={{ width: 80 }} />
                                    <h4>使用微信扫描二维码登录</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            <div key={20} className="modal fade" ref={(e: HTMLElement) => this.loginDialogElement = e || this.loginDialogElement}>
            </div>
        ];
    }
}