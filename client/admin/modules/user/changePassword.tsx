import { Service, systemWeiXinAppId } from 'services/service';
import { UserService, Seller } from 'adminServices/user';
import site from 'site';
import QRCode = require('qrcode');

const label_max_width = 80;
const input_max_width = 300;

interface WebSockentMessage {
    to: string,
    form: string,
    action: string
}

export default async function (page: chitu.Page) {

    requirejs([`css!${page.routeData.actionPath}.css`]);

    var userService = page.createService(UserService);
    let seller = await userService.me()
    class AccountSettingPage extends React.Component<
        { seller: Seller }, { scaned: boolean, seller: Seller }>{

        private weixinBinding: HTMLElement;
        private qrcodeElement: HTMLElement;

        constructor(props) {
            super(props);
            this.state = { seller: this.props.seller, scaned: false };
        }
        showWeiXinBinding() {
            ui.showDialog(this.weixinBinding);
            ui.renderImage(this.qrcodeElement.querySelector('img'), { imageText: '正在生成二维码' });

            this.state.scaned = false;
            this.setState(this.state);

            requirejs(['socket.io'], (io) => {
                var socket = io('http://maishu.alinq.cn:8015');
                let { protocol, hostname, pathname, port } = location;
                socket.on('connect', () => {
                    console.log(socket.id); // 'G5p5...'
                    let appid = systemWeiXinAppId;
                    let page = seller.OpenId ? 'unbinding' : 'binding';
                    let redirect_uri = encodeURIComponent(`${protocol}//${hostname}${pathname}weixin/?from=${socket.id}#${page}`);
                    let auth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`
                    let qrcode = new QRCode(this.qrcodeElement.parentElement, { width: 200, height: 200, text: "" });
                    let q = qrcode as any;
                    q._oDrawing._elImage = this.qrcodeElement.querySelector('img');
                    console.log(auth_url);
                    qrcode.makeCode(auth_url);
                })
                socket.on('weixin', (msg: WebSockentMessage) => {
                    let data: any = msg;

                    switch (msg.action) {

                        case 'bind':
                            console.assert(data.openId);
                            userService.weixinBind(data.openId)
                                .then(o => {

                                    this.state.seller.OpenId = data.openId;
                                    this.setState(this.state);

                                    let m = { form: socket.id, to: msg.form, action: 'bind_success' } as WebSockentMessage;
                                    ui.hideDialog(this.weixinBinding);
                                    socket.emit('weixin', m);
                                })
                                .catch(o => {

                                    let m = { form: socket.id, to: msg.form, action: 'bind_fail' } as WebSockentMessage;
                                    socket.emit('weixin', m);
                                })
                            break;
                        case 'unbind':
                            console.assert(data.openId);
                            userService.weixinUnbind(data.openId)
                                .then(o => {
                                    this.state.seller.OpenId = null;
                                    this.setState(this.state);

                                    let m = { form: socket.id, to: msg.form, action: 'unbind_success' } as WebSockentMessage;
                                    ui.hideDialog(this.weixinBinding);
                                    socket.emit('weixin', m);
                                })
                                .catch(o => {
                                    let m = { form: socket.id, to: msg.form, action: 'unbind_fail' } as WebSockentMessage;
                                    ui.hideDialog(this.weixinBinding);
                                    socket.emit('weixin', m);
                                });

                            break;
                        case 'qrcode_scan':
                            this.state.scaned = true;
                            this.setState(this.state);
                            break;
                    }





                });
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
                <div key={30} className="modal" ref={(e: HTMLElement) => this.weixinBinding = e}>
                    <div className="modal-dialog" style={{ width: 400 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={() => ui.hideDialog(this.weixinBinding)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title">{seller.OpenId ? '解绑微信' : '微信绑定'}</h4>
                            </div>
                            <div className="modal-body form-horizontal">
                                <div className="qrcodeElement" ref={(e: HTMLElement) => this.qrcodeElement = e}>
                                    <img />
                                </div>

                            </div>
                            <div className="modal-footer" style={{ textAlign: 'center' }}>
                                {scaned ?
                                    <h4>
                                        <i className="icon-ok text-success" style={{ fontSize: 'larger' }} />
                                        <span style={{ paddingLeft: 8 }}>已扫描二维码</span>
                                    </h4> :
                                    <h4>
                                        {seller.OpenId ? '扫描二维码解绑微信号' : '扫描二维码绑定微信号'}
                                    </h4>
                                }

                            </div>
                        </div>
                    </div>
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