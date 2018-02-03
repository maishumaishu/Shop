import { MemberService } from 'userServices/memberService';
import { Service } from 'userServices/Service';
import { default as adminApp } from 'application'
export class UserLoginDialog extends React.Component<any, any>{
    private _element: HTMLElement;
    private static _instance: UserLoginDialog;

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
    login() {
        console.assert(adminApp.currentPage != null);
        let memberService = adminApp.currentPage.createService(MemberService);
        memberService.login("18502146746", "1").then(o => {
            location.reload();
        });
    }
    render() {
        return (
            <div className="modal fade" ref={(e: HTMLElement) => this._element = e}>
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
                                    <input className="form-control" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="control-label col-sm-2">
                                    *密码
                                </label>
                                <div className="col-sm-10">
                                    <input className="form-control" />
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}