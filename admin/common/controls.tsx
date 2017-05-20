function getChildren(props: React.Props<any>): Array<any> {
    props = props || {};
    let children = [];
    if (props.children instanceof Array) {
        children = props.children as Array<any>;
    }
    else if (props['children'] != null) {
        children = [props['children']];
    }
    return children;
}

export class Callback<T> {
    private funcs = new Array<(args: T) => void>();
    private _value: T;

    constructor() {
    }
    add(func: (args: T) => any): (args: T) => any {
        this.funcs.push(func);
        return func;
    }
    remove(func: (args: T) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(args: T) {
        this.funcs.forEach(o => o(args));
    }
}

//============================================================
// 按钮
type CinfirmDelegate = () => string;
interface ButtonProps extends React.Props<Button> {
    onClick?: (event: React.MouseEvent) => Promise<any>,
    /**
     * 确定框文本
     */
    confirm?: string | CinfirmDelegate,
    className?: string,
    style?: React.CSSProperties,
    disabled?: boolean,
    /**
     * 弹窗文本
     */
    toast?: string | JSX.Element
}

function findPageView(p: HTMLElement): HTMLElement {
    while (p) {
        let attr = p.getAttribute('data-reactroot');
        if (attr != null) {
            return p;
        }

        p = p.parentElement;
    }

    return null;
}

export class Dialog {
    private static _toastDialogElement: HTMLElement;
    private static _confirmDialogElement: HTMLElement;
    static toast(options: { content: string | JSX.Element }) {
        var contentElement: JSX.Element;
        if (typeof options.content == 'string')
            contentElement = <h5>{options.content}</h5>;
        else
            contentElement = options.content as JSX.Element;

        var toastDialogElement = document.createElement('div');
        toastDialogElement.className = 'modal fade';
        document.body.appendChild(toastDialogElement);
        ReactDOM.render(
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        {contentElement}
                    </div>
                </div>
            </div>, toastDialogElement);

        $(toastDialogElement).modal();
        window.setTimeout(() => {
            $(toastDialogElement).modal('hide');
            setTimeout(() => {
                $(toastDialogElement).remove();
            }, 1000);
        }, 1200);
    }
    static confirm(options: { content: string | JSX.Element, onconfirm: () => Promise<any> }) {
        var contentElement: JSX.Element;
        if (typeof options.content == 'string')
            contentElement = <h5>{options.content}</h5>;
        else
            contentElement = options.content as JSX.Element;

        let dialogElement = document.createElement('div');
        dialogElement.className = 'modal fade';
        document.body.appendChild(dialogElement);
        ReactDOM.render(<div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-body text-left">
                    {contentElement}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default"
                        onClick={() => {
                            closeDialog();
                        }}>取消</button>
                    <button type="button" className="btn btn-primary"
                        onClick={() => {
                            closeDialog();
                        }}>确认</button>
                </div>
            </div>
        </div>, dialogElement);
        $(dialogElement).modal();

        var closing = false;
        var closeDialog = () => {
            if (closing)
                return;

            closing = true;
            $(dialogElement).modal('hide');
            window.setTimeout(() => {
                $(dialogElement).remove();
            }, 1000);
        }
    }
    private static get toastDialogElement() {
        if (!Dialog._toastDialogElement) {
            Dialog._toastDialogElement = document.createElement('div');
            Dialog._toastDialogElement.className = 'modal fade';
            document.body.appendChild(Dialog._toastDialogElement);
            ReactDOM.render(
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body alert-success">
                            <h5></h5>
                        </div>
                    </div>
                </div>, Dialog._toastDialogElement);
        }
        return Dialog._toastDialogElement;
    }
}

export class Button extends React.Component<ButtonProps, {}>{

    private buttonElement: HTMLButtonElement;
    private _doing: boolean;
    //private confirmDialog: ConfirmDialog;
    private dialogElement: HTMLElement;
    private animateTime: number;
    private currentClickEvent: React.MouseEvent;

    private onClick(e: React.MouseEvent) {
        this.currentClickEvent = e;
        if (this.doing)
            return;

        if (this.props.confirm) {
            Dialog.confirm({ content: this.confirmText(), onconfirm: (() => Promise.resolve()) });
        }
        else {
            this.execute(e);
        }
    }

    private showDialog() {
        this.dialogElement.parentElement.style.display = 'block';
        this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
        setTimeout(() => this.dialogElement.style.transform = `translateY(${100}px)`, 50);
    }

    private hideDialog() {
        this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
        setTimeout(() => this.dialogElement.parentElement.style.display = 'none', this.animateTime);
    }

    private execute(e) {
        let onClick = this.props.onClick || (() => Promise.resolve());
        let result = onClick(e);
        this.doing = true;
        if (result == null || result.catch == null || result.then == null) {
            this.doing = false;
            return;
        }

        result.then(o => {
            this.doing = false;
            if (this.props.toast) {
                Dialog.toast({ content: this.props.toast });
            }
        }).catch(o => {
            this.doing = false;
        })

        return result;
    }

    private get doing() {
        return this._doing;
    }
    private set doing(value: boolean) {
        this._doing = value;
        if (value) {
            this.buttonElement.disabled = true;
        }
        else {
            this.buttonElement.disabled = false;
        }
    }
    private componentDidMount() {
    }

    private cancel() {
        this.hideDialog();
    }

    private ok() {
        let result = this.execute(this.currentClickEvent);
        if (result instanceof Promise) {
            result.then(() => this.hideDialog())
        }
        else {
            this.hideDialog();
        }
    }

    private renderConfirmDialog() {

    }

    private confirmText(): string {
        if (typeof this.props.confirm == 'function') {
            return (this.props.confirm as () => string)();
        }

        return this.props.confirm as string;
    }

    render() {
        // debugger;
        let children = getChildren(this.props);
        return (
            <span>
                <button ref={(o: HTMLButtonElement) => this.buttonElement = this.buttonElement || o}
                    onClick={(e) => this.onClick(e)} className={this.props.className}
                    style={this.props.style} disabled={this.props.disabled}>
                    {children.map(o => (o))}
                </button>
                <div style={{ display: 'none' }}>
                    <div ref={(o: HTMLElement) => this.dialogElement = this.dialogElement || o} className="modal"
                        style={{ display: 'block', transform: 'translateY(-10000px)', transition: `${this.animateTime / 1000}s` }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body text-left">
                                    <h5 dangerouslySetInnerHTML={{ __html: this.confirmText() }}></h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={() => this.cancel()} className="btn btn-default">取消</button>
                                    <button type="button" onClick={() => this.ok()} className="btn btn-primary">确认</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop in"></div>
                </div>
            </span>
        );
    }
}
//============================================================
class ImageFileResizeResult {
    ImageData: string
}

interface FileData {
    index: number
    url: string
    data: string
    thumb: string
}

interface ImageFileResizeCallback {
    (urls: string[], base64: string[], thumbs: string[]): void;
}

interface ImageThumb {
    maxWidth: number,
    maxHeight: number
}

class ImageFileLoader {
    private thumb2: ImageThumb;
    private size: { width: number, height: number };

    fileLoad = new Callback<string>();

    constructor(fileUploadElement: HTMLInputElement, size?: { width: number, height: number }) {
        this.size = size;
        fileUploadElement.onchange = async () => {
            if (!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob'])) {
                alert('The File APIs are not fully supported in this browser.');
                return false;
            }

            for (var i = 0; i < fileUploadElement.files.length; i++) {
                let imageData = await this.processfile(fileUploadElement.files[i]);
                this.fileLoad.fire(imageData);
            }
        }
    }

    private processfile(file: File): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            if (!(/image/i).test(file.type)) {
                console.log("File " + file.name + " is not an image.");
                reject();
            }

            var reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (ev: Event) => {
                var blob = new Blob([event.target['result']]);
                window['URL'] = window['URL'] || window['webkitURL'];
                var blobURL = window['URL'].createObjectURL(blob);
                var image = new Image();

                image.src = blobURL;
                image.onload = () => {
                    var canvas = document.createElement('canvas');
                    if (this.size) {
                        canvas.width = this.size.width;
                        canvas.height = this.size.height;
                    }
                    else {
                        canvas.width = image.width;
                        canvas.height = image.height;
                    }

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                    let data = canvas.toDataURL("/jpeg", 0.7);
                    resolve(data);
                }
            }
        })
    }
}

interface ImageFileSelectorProps extends React.Props<ImageFileSelector> {
    multiple?: boolean,
    allowRemove?: boolean,
    size?: { width: number, height: number },
    imageLoaded?: (data: string) => void;
}

import bootbox = require('bootbox');
export class ImageFileSelector extends React.Component<ImageFileSelectorProps, { images: string[] }>{

    constructor() {
        super();
        this.state = { images: [] };
    }

    removeImage(imageIndex: number) {
        bootbox.confirm('要删除这张图片吗？', (result) => {
            if (!result)
                return;

            this.state.images = this.state.images.filter((o, i) => i != imageIndex);
            this.setState(this.state);
        });
    }

    get imageDatas() {
        return this.state.images;
    }

    render() {
        let multiple = this.props.multiple == null ? false : this.props.multiple;
        let allowRemove = this.props.allowRemove == null ? false : this.props.allowRemove;

        let iconContainerStyle = {
            position: 'absolute',
            right: 20, backgroundColor: 'whitesmoke', width: 30,
            height: 30, borderRadius: 15, top: 8,
            zIndex: 100
        } as React.CSSProperties;

        let iconStyle = {
            fontSize: 20, position: 'relative',
            top: -14, left: -1
        } as React.CSSProperties;

        return (
            <div>
                {this.state.images.map((o, i) =>
                    <div key={i} className="pull-left item">
                        {allowRemove ?
                            <div style={iconContainerStyle}
                                onClick={() => this.removeImage(i)}>
                                <i className="icon-trash" style={iconStyle} />
                            </div> : null
                        }
                        <input type="file" accept="images/*" multiple={false}
                            ref={(o: HTMLInputElement) => {
                                if (o == null) {
                                    return;
                                }
                                let imageFileLoader = new ImageFileLoader(o, this.props.size);
                                imageFileLoader.fileLoad.add((data) => {
                                    this.state.images[i] = data;
                                    this.setState(this.state);
                                    if (this.props.imageLoaded)
                                        this.props.imageLoaded(data);
                                })
                            }} />
                        <img src={o} style={{ width: '100%' }} />
                    </div>
                )}
                {this.state.images.length == 0 ?
                    <div className="item">
                        <input type="file" accept="images/*" multiple={false}
                            ref={(o: HTMLInputElement) => {
                                if (o == null) {
                                    return;
                                }
                                let imageFileLoader = new ImageFileLoader(o, this.props.size);
                                imageFileLoader.fileLoad.add((data) => {
                                    this.state.images.push(data);
                                    this.setState(this.state);
                                })
                            }} />
                        <i className="icon-camera"></i>
                    </div> : null
                }

            </div>
        );
    }
}

//============================================================

export let imageBoxConfig = {
    /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
    imageBaseUrl: '',

    /** 图片显示的文字 */
    imageDisaplyText: '',
}

let config = imageBoxConfig;
export function imageDelayLoad(element: HTMLImageElement, imageText?: string) {
    imageText = imageText || config.imageDisaplyText;
    // var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
    // var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;

    var src = element.getAttribute('src') || '';
    var img_width;//= PREVIEW_IMAGE_DEFAULT_WIDTH;
    var img_height;// = PREVIEW_IMAGE_DEFAULT_HEIGHT;
    var match = src.match(/_\d+_\d+/);
    if (match && match.length > 0) {
        var arr = match[0].split('_');
        img_width = new Number(arr[1]).valueOf();
        img_height = new Number(arr[2]).valueOf();
    }

    if (img_width)
        element.setAttribute('width', img_width + 'px');

    if (img_height)
        element.setAttribute('height', img_height + 'px');


    var src_replace = getPreviewImage(imageText, img_width, img_height);
    element.setAttribute('src', src_replace);

    var image: HTMLImageElement = new Image();
    image.onload = function () {
        element.src = (this as HTMLImageElement).src;
    };
    image.src = src;

    function getPreviewImage(imageText: string, img_width, img_height) {

        var scale = (img_height / img_width).toFixed(2);
        var img_name = `${imageText}_${scale}`;//imageText + scale;
        var img_src = localStorage.getItem(img_name);
        if (img_src)
            return img_src;

        var MAX_WIDTH = 320;
        var width = MAX_WIDTH;
        var height = width * new Number(scale).valueOf();

        var canvas = document.createElement('canvas');
        canvas.width = width; //img_width;
        canvas.height = height; //img_height;

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'whitesmoke';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 设置字体
        ctx.font = "Bold 40px Arial";
        // 设置对齐方式
        ctx.textAlign = "left";
        // 设置填充颜色
        ctx.fillStyle = "#999";
        // 设置字体内容，以及在画布上的位置
        ctx.fillText(imageText, canvas.width / 2 - 75, canvas.height / 2);

        img_src = canvas.toDataURL('/png');
        localStorage.setItem(img_name, img_src);
        return img_src;
    }

}


export class ImageBox extends React.Component<
    { src: string, className?: string, imageText?: string } & React.HTMLAttributes,
    { width: string, height: string, src: string }> {

    private unmount = false;

    constructor(props) {
        super(props);
    }

    protected componentDidMount() {
        let img = this.refs['img'] as HTMLImageElement;
        imageDelayLoad(img, this.props.imageText || config.imageDisaplyText);
    }

    private componentWillUnmount() {
        this.unmount = true;
    }

    render() {
        return (
            <img ref="img" src={this.props.src} className={this.props.className} ></img>
        );
    }
}

