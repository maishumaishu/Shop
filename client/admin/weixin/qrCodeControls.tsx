
interface QRCodeDialogProps {
    title: string,
    tips: string
}

interface QRCodeDialogState {
    scaned: boolean
}

export class QRCodeDialog extends React.Component<QRCodeDialogProps, QRCodeDialogState>{
    private dialogContainer: HTMLElement;
    private dialogElement: HTMLElement;
    private qrcodeElement: HTMLElement;
    private img: HTMLImageElement;

    constructor(props) {
        super(props)
        this.state = { scaned: false }
    }

    componentDidMount() {
        ui.renderImage(this.img, { imageText: '正在生成二维码' });
        this.dialogContainer = this.dialogElement.parentElement;
    }

    render() {
        let { title, tips } = this.props;
        let { scaned } = this.state;
        return (
            <div className="modal-dialog" style={{ width: 400 }}
                ref={(e: HTMLElement) => this.dialogElement = e || this.dialogElement}>
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close"
                            onClick={() => {
                                this.hide();
                            }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body form-horizontal">
                        <div className="qrcodeElement" ref={(e: HTMLElement) => this.qrcodeElement = e}>
                            <img style={{ width: '100%' }} ref={(e: HTMLImageElement) => this.img = e || this.img} />

                        </div>

                    </div>
                    <div className="modal-footer" style={{ textAlign: 'center' }}>
                        {scaned ?
                            <h4>
                                <i className="icon-ok text-success" style={{ fontSize: 'larger' }} />
                                <span style={{ paddingLeft: 8 }}>已扫描二维码</span>
                            </h4> :
                            <h4>
                                {tips}
                            </h4>
                        }

                    </div>
                </div>
            </div>
        )
    }

    show() {
        ui.renderImage(this.img, { imageText: '正在生成二维码' });
        ui.showDialog(this.dialogContainer);
    }

    hide() {
        ui.hideDialog(this.dialogContainer);
    }

    setUrl(url: string) {
        console.assert(this.qrcodeElement != null);
        let qrcode = new QRCode(this.qrcodeElement.parentElement, { width: 200, height: 200, text: "" });
        let q = qrcode as any;
        q._oDrawing._elImage = this.qrcodeElement.querySelector('img');
        console.log(url);
        qrcode.makeCode(url);
        this.state.scaned = false;
        this.setState(this.state);
    }
}

export class QRCodeImage extends React.Component<{ tips: string } & React.Props<QRCodeImage>, QRCodeDialogState>{
    private element: HTMLElement;
    private img: HTMLImageElement;

    constructor(props) {
        super(props)
        this.state = { scaned: false }
    }

    componentDidMount() {
        this.clear();
    }

    render() {
        let { tips } = this.props;
        let { scaned } = this.state;
        return (
            <div key={10} className="qrcodeElement" ref={(e: HTMLElement) => this.element = e}>
                <div>
                    <img style={{ width: '80%' }} ref={(e: HTMLImageElement) => this.img = e || this.img} />
                </div>
                <div key={20} style={{ textAlign: 'center' }}>
                    {scaned ?
                        <h4>
                            <i className="icon-ok text-success" style={{ fontSize: 'larger' }} />
                            <span style={{ paddingLeft: 8 }}>已扫描二维码</span>
                        </h4> :
                        <h4>
                            {tips}
                        </h4>
                    }

                </div>
            </div>
        )
    }

    clear() {
        ui.renderImage(this.img, { imageText: '正在生成二维码' });
    }

    setUrl(url: string) {
        console.assert(this.element != null);
        let qrcode = new QRCode(this.element, { width: 200, height: 200, text: "" });
        let q = qrcode as any;
        q._oDrawing._elImage = this.img; //this.element.querySelector('img');
        console.log(url);
        qrcode.makeCode(url);
        this.state.scaned = false;
        this.setState(this.state);
    }

    show() {
        this.element.style.removeProperty('display');
    }

    hide() {
        this.element.style.display = "none";
    }
}
