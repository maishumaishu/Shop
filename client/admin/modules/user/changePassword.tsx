import { Service, systemWeiXinAppId } from 'admin/services/service';
import { UserService, Seller } from 'admin/services/user';
import { WeiXinService } from 'admin/services/weixin';
import site from 'site';
import QRCode = require('qrcode');
import { WebSockentMessage } from 'weixin/common';
import { websocketUrl } from 'share/common';
import { showQRCodeDialog } from 'weixin/modules/openid';
import app from 'application';

const label_max_width = 80;
const input_max_width = 300;

export default async function (page: chitu.Page) {

    app.loadCSS(page.name);

    let userService = page.createService(UserService);
    let seller = await userService.me()
    let weixin = page.createService(WeiXinService);

    class AccountSettingPage extends React.Component<
        { seller: Seller }, { scaned: boolean, seller: Seller }>{

        private weixinBinding: HTMLElement;
        private qrcodeElement: HTMLElement;

        constructor(props) {
            super(props);
            this.state = { seller: this.props.seller, scaned: false };
        }
        showWeiXinBinding() {
            let it = this;
            let seller = this.state.seller;

            let isUnbind = seller.OpenId != null;
            if (isUnbind && (seller.Mobile == null && seller.UserName == null && seller.Email == null)) {
                ui.alert({ title: '不允许解绑', message: '手机，用户名，邮箱必须有一个不为空才能解绑' })
                return;
            }
            isUnbind ?
                showQRCodeDialog({
                    title: '解绑微信',
                    tips: '扫描二维码解绑微信号',
                    element: this.weixinBinding,
                    mobilePageName: 'unbinding',
                    async callback(code: string) {
                        let result = await weixin.unbind(code);
                        seller.OpenId = null;
                        it.setState(it.state);
                    }
                }) :
                showQRCodeDialog({
                    title: '微信绑定',
                    tips: '扫描二维码绑定微信号',
                    element: this.weixinBinding,
                    mobilePageName: 'binding',
                    async callback(code: string) {
                        console.assert(code != null);
                        let result = await weixin.bind(code);
                        seller.OpenId = result.OpenId;
                        it.setState(it.state);
                    }
                })
        }
        render() {
            let { seller, scaned } = this.state;
            return [
                <div key={20} className="well">
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            用户名
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <div className="input-group">
                                <input type="text" className="form-control" readOnly={true}
                                    placeholder={!seller.UserName ? '未设置用户名' : seller.UserName} />
                                <div className="input-group-addon">
                                    <i className="icon-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            手机号
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <div className="input-group">
                                <input type="text" className="form-control" readOnly={true}
                                    placeholder={!seller.Mobile ? '未绑定手机号' : seller.Mobile} />
                                <div className="input-group-addon">
                                    <i className="icon-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            微信号
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <div className="input-group">
                                <input type="text" className="form-control" readOnly={true}
                                    placeholder={!seller.OpenId ? '未绑定微信号' : '已绑定'} />
                                <div className="input-group-addon" onClick={() => this.showWeiXinBinding()}
                                    style={{ cursor: 'pointer' }}>
                                    <i className="icon-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                <div key={30} ref={(e: HTMLElement) => this.weixinBinding = e}>

                </div>
            ]
        }
    }

    ReactDOM.render(<AccountSettingPage seller={seller} />, page.element);


}


class ChangePasswordPage extends React.Component<any, any>{
    changePassword() {
        return Promise.resolve();
    }
    render() {
        return (

            <div className="form-horizontal col-md-6 col-lg-5" style={{ marginTop: 20 }}>
                <div className="form-group">
                    <label className="col-md-3 control-label">新密码</label>
                    <div className="col-md-9">
                        <input data-bind="value:password" type="password" className="form-control" placeholder="请输入新密码" />
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-md-3 control-label">确认密码</label>
                    <div className="col-md-9">
                        <input data-bind="value:confirmPassword" type="password" className="form-control" placeholder="请再一次输入新密码" />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-9 col-md-offset-3">
                        <button data-bind="click:changePassword" data-dialog="type:'flash',content:'修改密码成功'" className="btn btn-primary"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                e.onclick = ui.buttonOnClick(this.changePassword, { toast: '修改密码成功！' });
                            }}>
                            <span className="icon-ok"></span>确定
                        </button>
                    </div>
                </div>
            </div>

        );
    }
}