import { parseUrlParams } from 'share/common';
import { socket_url, loadjs } from 'common'
import { WeiXinService } from 'services/weixin'
import app from 'application';
export default async function (page: chitu.Page) {
    let weixin = page.createService(WeiXinService);

    let q = location.search ? parseUrlParams(location.search) : {};
    let openId: string = "";
    if (q.code) {
        weixin.openId(q.code).then(o => openId = o);
        console.log(openId);
    }

    class BindingPage extends React.Component<any, { status: 'success' | 'fail' | 'normal' }> {
        constructor(props) {
            super(props);

            this.state = { status: 'normal' };
            document.title = '解绑微信';
            loadjs<any>('socket.io').then((io) => {
                let socket = io(socket_url);
                socket.on('connect', () => {
                    socket.emit('weixin', { to: q.from, form: socket.id, action: 'qrcode_scan' });
                })
            })
        }
        async bind() {
            return new Promise(async (resolve, reject) => {
                let io = await loadjs<any>('socket.io');
                let socket = io(socket_url);
                socket.on('connect', () => {
                    socket.emit('weixin', { to: q.from, form: socket.id, action: 'unbind', openId });
                })

                socket.on('weixin', (data) => {
                    data = data || {};
                    if (data.action == 'unbind_success') {
                        // alert('success');
                        this.state.status = 'success';
                        this.setState(this.state);
                        resolve()
                    }
                    else if (data.action == 'unbind_fail') {
                        // alert('fail');
                        this.state.status = 'fail';
                        this.setState(this.state);
                        reject();
                    }
                })
            })
        }
        cancel() {
            app.back();
        }
        render() {
            let { status } = this.state;
            let text: string;
            switch (status) {
                default:
                case 'normal':
                    text = '确定要解绑微信号吗';
                    break;
                case 'success':
                    text = '已成功解绑微信号';
                    break;
                case 'fail':
                    text = '解绑失败，请重新扫描二维码';
                    break;
            }
            let buttonBar = status == 'normal' ?
                <div key={20} className="container" style={{ bottom: 0, position: 'absolute', width: '100%' }}>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                ui.buttonOnClick(e, () => this.bind())
                            }}>确定解绑</button>
                    </div>
                </div> : null;

            return [
                <div key={10} style={{ paddingTop: 200, textAlign: 'center' }} className="container">
                    <div></div>
                    <h3>
                        {text}
                    </h3>
                </div>,
                buttonBar
            ]
        }
    }

    ReactDOM.render(<BindingPage />, page.element);
}