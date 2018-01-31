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
            document.title = '绑定微信';
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
                    socket.emit('weixin', { to: q.from, form: socket.id, action: 'bind', openId });
                })

                socket.on('weixin', (data) => {
                    data = data || {};
                    if (data.action == 'bind_success') {
                        this.state.status = 'success';
                        this.setState(this.state);
                        resolve()
                    }
                    else if (data.action == 'bind_fail') {
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
                case 'normal':
                    text = '确定要绑定微信号到百伦美商家后台系统吗';
                    break;
                case 'success':
                    text = '已成功绑定微信号';
                    break;
                case 'fail':
                    text = '绑定微信号失败，请重新扫描二维码';
                    break;
            }

            let buttonBar = status == 'normal' ?
                <div key={20} className="container" style={{ bottom: 0, position: 'absolute', width: '100%' }}>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                ui.buttonOnClick(e, () => this.bind(), { toast: '绑定成功' })
                            }}>确定绑定</button>
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