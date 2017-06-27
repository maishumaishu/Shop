var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var controls;
(function (controls) {
    class ImageFileResizeResult {
    }
    class ImageFileLoader {
        constructor(fileUploadElement) {
            this.fileLoad = new controls.Callback();
            fileUploadElement.onchange = () => __awaiter(this, void 0, void 0, function* () {
                if (!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob'])) {
                    alert('The File APIs are not fully supported in this browser.');
                    return false;
                }
                for (var i = 0; i < fileUploadElement.files.length; i++) {
                    let imageData = yield this.processfile(fileUploadElement.files[i]);
                    this.fileLoad.fire(imageData);
                }
            });
        }
        processfile(file) {
            return new Promise((resolve, reject) => {
                if (!(/image/i).test(file.type)) {
                    console.log("File " + file.name + " is not an image.");
                    reject();
                }
                var reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = (ev) => {
                    var blob = new Blob([event.target['result']]);
                    window['URL'] = window['URL'] || window['webkitURL'];
                    var blobURL = window['URL'].createObjectURL(blob);
                    var image = new Image();
                    image.src = blobURL;
                    image.onload = () => {
                        var canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);
                        let data = canvas.toDataURL("/jpeg", 0.7);
                        resolve(data);
                    };
                };
            });
        }
    }
    class ImageFileSelector extends React.Component {
        constructor() {
            super();
            this.state = { images: [] };
        }
        componentDidMount() {
            this.imageFileLoader = new ImageFileLoader(this.inputElement);
            this.imageFileLoader.fileLoad.add((data) => {
                this.state.images.push(data);
                this.setState(this.state);
            });
        }
        get imageDatas() {
            return this.state.images;
        }
        render() {
            return (React.createElement("div", null,
                this.state.images.map((o, i) => React.createElement("div", { key: i, "data-bind": "click:$parent.showImagePage,tap:$parent.showImagePage", className: "pull-left item" },
                    React.createElement("img", { src: o, width: '100%', height: "100%" }))),
                React.createElement("div", { className: "pull-left item" },
                    React.createElement("input", { ref: (o) => this.inputElement = o, type: "file", accept: "images/*", multiple: true }),
                    React.createElement("i", { className: "icon-camera" }))));
        }
    }
    controls.ImageFileSelector = ImageFileSelector;
})(controls || (controls = {}));
var controls;
(function (controls) {
    function getChildren(props) {
        props = props || {};
        let children = [];
        if (props.children instanceof Array) {
            children = props.children;
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }
    controls.getChildren = getChildren;
    function createHammerManager(element) {
        let manager = new Hammer.Manager(element, { touchAction: 'auto' });
        return manager;
    }
    controls.createHammerManager = createHammerManager;
    class Callback {
        constructor() {
            this.funcs = new Array();
        }
        add(func) {
            this.funcs.push(func);
            return func;
        }
        remove(func) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(args) {
            this.funcs.forEach(o => o(args));
        }
    }
    controls.Callback = Callback;
    controls.isAndroid = navigator.userAgent.indexOf('Android') > -1;
    controls.isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0;
    controls.isCordovaApp = location.protocol === 'file:';
    controls.isWeb = location.protocol === 'http:' || location.protocol === 'https:';
})(controls || (controls = {}));
var controls;
(function (controls) {
    class DataList extends React.Component {
        constructor(props) {
            super(props);
            this.pageIndex = 0;
            this.state = { items: [] };
            this.loadData();
        }
        loadData() {
            if (this.status == 'complted' || this.status == 'loading') {
                return;
            }
            this.status = 'loading';
            this.props.loadData(this.pageIndex).then(items => {
                this.status = 'finish';
                if (items.length < this.props.pageSize)
                    this.status = 'complted';
                this.pageIndex = this.pageIndex + 1;
                this.state.items = this.state.items.concat(items);
                this.setState(this.state);
            }).catch(() => {
                this.status = 'fail';
            });
        }
        reset() {
            this.pageIndex = 0;
            this.status = null;
            this.state.items = [];
            this.setState(this.state);
        }
        componentDidMount() {
            // let isEmpty = this.state.items.length == 0;
            // if (isEmpty)
            //     return;
            let scroller;
            if (this.props.scroller)
                scroller = this.props.scroller();
            if (scroller == null) {
                scroller = this.element.parentElement;
            }
            scrollOnBottom(scroller, this.loadData.bind(this));
        }
        createDataItem(data, index) {
            try {
                return this.props.dataItem(data, index);
            }
            catch (e) {
                let error = e;
                return React.createElement("div", null, error.message);
            }
        }
        render() {
            let indicator;
            switch (this.status) {
                case 'complted':
                    indicator = this.props.showCompleteText ?
                        React.createElement("div", null,
                            React.createElement("span", null, "\u6570\u636E\u5DF2\u5168\u90E8\u52A0\u8F7D\u5B8C"))
                        :
                            null;
                    break;
                case 'fail':
                    indicator =
                        React.createElement("button", { className: "btn btn-default btn-block", onClick: this.loadData }, "\u70B9\u51FB\u52A0\u8F7D\u6570\u636E");
                    break;
                default:
                    indicator =
                        React.createElement("div", null,
                            React.createElement("i", { className: "icon-spinner icon-spin" }),
                            React.createElement("span", null, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D..."));
                    break;
            }
            return (React.createElement("div", { ref: (o) => this.element = o, className: this.props.className },
                this.state.items.map((o, i) => this.createDataItem(o, i)),
                this.props.emptyItem != null && this.state.items.length == 0 ?
                    this.props.emptyItem
                    :
                        React.createElement("div", { className: "data-loading col-xs-12" }, indicator)));
        }
    }
    controls.DataList = DataList;
    let dataListDefaultProps = {};
    dataListDefaultProps.pageSize = 10;
    DataList.defaultProps = dataListDefaultProps;
    /**
     * 滚动到底部触发回调事件
     */
    function scrollOnBottom(element, callback, deltaHeight) {
        console.assert(element != null);
        console.assert(callback != null);
        deltaHeight = deltaHeight || 10;
        element.addEventListener('scroll', function () {
            let maxScrollTop = element.scrollHeight - element.clientHeight;
            //let deltaHeight = 10;
            if (element.scrollTop + deltaHeight >= maxScrollTop) {
                callback();
            }
        });
    }
})(controls || (controls = {}));
var controls;
(function (controls) {
    class Dialog extends React.Component {
        constructor(props) {
            super(props);
            this.animateTime = 400; //ms
            this.state = { content: this.props.content };
        }
        get content() {
            return this.state.content;
        }
        set content(value) {
            this.state.content = value;
            this.setState(this.state);
        }
        show() {
            this.element.style.display = 'block';
            this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
            setTimeout(() => this.dialogElement.style.transform = `translateY(${100}px)`, 50);
        }
        hide() {
            this.dialogElement.style.transform = `translateY(-${this.dialogElement.getBoundingClientRect().height}px)`;
            setTimeout(() => this.element.style.display = 'none', this.animateTime);
        }
        componentDidMount() {
            this.dialogElement.style.transition = `${this.animateTime / 1000}s`;
        }
        render() {
            return (React.createElement("div", { ref: (o) => this.element = o, style: { display: 'none' } },
                React.createElement("div", { ref: (o) => this.dialogElement = o, className: "modal", style: { display: 'block', transform: 'translateY(-10000px)' } },
                    React.createElement("div", { className: "modal-dialog" },
                        React.createElement("div", { className: "modal-content" },
                            React.createElement("div", { className: "modal-body" },
                                React.createElement("h5", { dangerouslySetInnerHTML: { __html: this.state.content } })),
                            (this.props.footer ?
                                React.createElement("div", { className: "modal-footer" }, this.props.footer) : null)))),
                React.createElement("div", { className: "modal-backdrop in" })));
        }
    }
    controls.Dialog = Dialog;
    class ConfirmDialog extends React.Component {
        constructor(props) {
            super(props);
        }
        // get content() {
        //     return this.dialog.content;
        // }
        // set content(value: string) {
        //     this.dialog.content = value;
        // }
        show() {
            this.dialog.show();
            return new Promise((reslove, reject) => {
                this.cancel = () => {
                    this.dialog.hide();
                    reject();
                };
                this.ok = () => {
                    this.dialog.hide();
                    reslove();
                };
            });
        }
        hide() {
            this.dialog.hide();
        }
        render() {
            return (React.createElement(Dialog, { ref: (o) => this.dialog = o, content: this.props.content, footer: React.createElement("div", null,
                    React.createElement("button", { type: "button", onClick: () => this.cancel(), className: "btn btn-default" }, "\u53D6\u6D88"),
                    React.createElement("button", { type: "button", onClick: () => this.ok(), className: "btn btn-primary" }, "\u786E\u8BA4")) }));
        }
    }
    controls.ConfirmDialog = ConfirmDialog;
})(controls || (controls = {}));
var controls;
(function (controls) {
    class HtmlView extends React.Component {
        componentDidMount() {
            let imgs = this.refs['content'].querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                controls.loadImage(imgs[i], this.props.imageText);
            }
        }
        render() {
            return (React.createElement("div", { ref: "content", className: this.props.className, dangerouslySetInnerHTML: { __html: this.props.content } }));
        }
    }
    controls.HtmlView = HtmlView;
})(controls || (controls = {}));
var controls;
(function (controls) {
    controls.imageBoxConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',
        /** 图片显示的文字 */
        imageDisaplyText: '',
    };
    let config = controls.imageBoxConfig;
    /** 加载图片到 HTMLImageElement */
    function loadImage(element, imageUrl, imageText) {
        // imageText = imageText || config.imageDisaplyText;
        var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
        var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;
        let src = imageUrl;
        var img_width = PREVIEW_IMAGE_DEFAULT_WIDTH;
        var img_height = PREVIEW_IMAGE_DEFAULT_HEIGHT;
        var match = src.match(/_\d+_\d+/);
        if (match && match.length > 0) {
            var arr = match[0].split('_');
            img_width = new Number(arr[1]).valueOf();
            img_height = new Number(arr[2]).valueOf();
        }
        element.setAttribute('width', img_width + 'px');
        element.setAttribute('height', img_height + 'px');
        function getPreviewImage(imageText, img_width, img_height) {
            var scale = (img_height / img_width).toFixed(2);
            var img_name = 'img_log' + scale;
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
            var img_src = canvas.toDataURL('/png');
            // localStorage.setItem(img_name, img_src);
            return img_src;
        }
        //设置默认的图片
        var src_replace = getPreviewImage(imageText || config.imageDisaplyText, img_width, img_height);
        element.setAttribute('src', src_replace);
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.onload = function () {
                element.src = this.src;
                resolve(element.src);
            };
            image.src = src;
        });
    }
    controls.loadImage = loadImage;
    class ImageBox extends React.Component {
        constructor(props) {
            super(props);
            this.unmount = false;
            this.state = { src: this.props.src };
        }
        componentWillUnmount() {
            this.unmount = true;
        }
        render() {
            return (React.createElement("img", { className: this.props.className, style: this.props.style, ref: (o) => {
                    if (!o)
                        return;
                    loadImage(o, this.state.src || '', this.props.text || config.imageDisaplyText)
                        .then(data => {
                        if (!this.props.onChange)
                            return;
                        this.props.onChange(data);
                    });
                } }));
        }
    }
    controls.ImageBox = ImageBox;
})(controls || (controls = {}));
var controls;
(function (controls) {
    let isAndroid = navigator.userAgent.indexOf('Android') > -1;
    let defaultIndicatorProps = {};
    defaultIndicatorProps.distance = 50;
    class PullUpIndicator extends React.Component {
        constructor(props) {
            super(props);
            this.state = {}; //
        }
        get status() {
            if (!this.initElement.style.display || this.initElement.style.display == 'block') {
                return 'init';
            }
            return 'ready';
        }
        set status(value) {
            if (this._status == value)
                return;
            this._status = value;
            if (this._status == 'init') {
                this.initElement.style.display = 'block';
                this.readyElement.style.display = 'none';
            }
            else {
                this.initElement.style.display = 'none';
                this.readyElement.style.display = 'block';
            }
        }
        componentDidMount() {
            let indicator = this.element; //this.refs['pull-up-indicator'] as HTMLElement;
            let viewElement = this.element.parentElement;
            console.assert(viewElement != null);
            this.status = 'init';
            let preventDefault = false;
            let start = false;
            let startY;
            let manager = controls.createHammerManager(viewElement); //new Hammer.Manager(viewElement, { touchAction: 'auto' });
            manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
            manager.on('panstart', (event) => {
                if (viewElement.scrollTop + viewElement.clientHeight >= viewElement.scrollHeight)
                    start = true;
                else
                    start = false;
            });
            viewElement.addEventListener('touchmove', (event) => {
                if (!start) {
                    return;
                }
                if (preventDefault) {
                    event.preventDefault();
                    return;
                }
                let currentY = indicator.getBoundingClientRect().top;
                if (startY == null) {
                    startY = currentY;
                    return;
                }
                let status = null;
                let deltaY = currentY - startY;
                let distance = 0 - Math.abs(this.props.distance);
                if (deltaY < distance && this.status != 'ready') {
                    status = 'ready';
                }
                else if (deltaY > distance && this.status != 'init') {
                    status = 'init';
                }
                if (status != null) {
                    //=================================
                    // 延时设置，避免卡
                    //window.setTimeout(() => {
                    preventDefault = true;
                    this.status = status;
                    //this.setState(this.state);
                    //}, 100);
                    //=================================
                    // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                    window.setTimeout(() => preventDefault = false, 200);
                    //=================================
                }
            });
            manager.on('panend', () => {
                // if (this.onBottom) {
                //     if (this.status == 'ready' && this.props.onRelease != null) {
                //         this.props.onRelease();
                //     }
                //     else if (this.status == 'init' && this.props.onCancel != null) {
                //         this.props.onCancel();
                //     }
                // }
                //=================================
                // 延时避免在 IOS 下闪烁
                window.setTimeout(() => {
                    preventDefault = false;
                    startY = null;
                    start = false;
                    this.status = 'init';
                    //     this.setState(this.state);
                }, 100);
                //=================================
            });
        }
        get onBottom() {
            return this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight;
        }
        //style={{ display: this.state.status == 'init' ? 'block' : 'none' }}
        //style={{ display: this.state.status == 'ready' ? 'block' : 'none' }}
        render() {
            return (React.createElement("div", { className: "pull-up-indicator", ref: (o) => this.element = o },
                React.createElement("div", { className: "init", ref: (o) => this.initElement = o },
                    React.createElement("i", { className: "icon-chevron-up" }),
                    React.createElement("span", null, this.props.initText)),
                React.createElement("div", { className: "ready", ref: (o) => this.readyElement = o },
                    React.createElement("i", { className: "icon-chevron-down" }),
                    React.createElement("span", null, this.props.readyText))));
        }
    }
    controls.PullUpIndicator = PullUpIndicator;
    PullUpIndicator.defaultProps = defaultIndicatorProps;
    //{ status: IndicatorStatus }
    class PullDownIndicator extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        get status() {
            if (!this.initElement.style.display || this.initElement.style.display == 'block') {
                return 'init';
            }
            return 'ready';
        }
        set status(value) {
            if (this._status == value)
                return;
            this._status = value;
            if (this._status == 'init') {
                this.initElement.style.display = 'block';
                this.readyElement.style.display = 'none';
            }
            else {
                this.initElement.style.display = 'none';
                this.readyElement.style.display = 'block';
            }
        }
        componentDidMount() {
            let indicator = this.element;
            let viewElement = this.element.parentElement;
            console.assert(viewElement != null);
            this.status = 'init';
            let preventDefault = false;
            let manager = controls.createHammerManager(viewElement); //new Hammer.Manager(viewElement);
            manager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
            viewElement.addEventListener('touchmove', (event) => {
                let scrollTopString = viewElement.getAttribute('data-scrolltop');
                let scrollTop = scrollTopString ? Number.parseInt(scrollTopString) : viewElement.scrollTop;
                if (scrollTop >= 0) {
                    return;
                }
                if (preventDefault) {
                    event.preventDefault();
                    return;
                }
                let currentY = indicator.getBoundingClientRect().top;
                let status = null;
                let distance = 0 - Math.abs(this.props.distance);
                if (scrollTop < distance && this.status != 'ready') {
                    status = 'ready';
                }
                else if (scrollTop > distance && this.status != 'init') {
                    status = 'init';
                }
                if (status != null) {
                    //=================================
                    // 延时设置，避免卡
                    // window.setTimeout(() => {
                    preventDefault = true;
                    this.status = status;
                    //     //this.setState(this.state);
                    // }, 100);
                    //=================================
                    // 因为更新 DOM 需要时间，一定时间内，不要移动，否则会闪
                    window.setTimeout(() => preventDefault = false, 200);
                    //=================================
                }
            });
            manager.on('panend', () => {
                //=================================
                // 延时避免在 IOS 下闪烁
                window.setTimeout(() => {
                    //     preventDefault = false;
                    this.status = 'init';
                    //this.setState(this.state);
                }, 100);
                //=================================
            });
        }
        get onTop() {
            return this.element.scrollTop <= 0;
        }
        render() {
            return (React.createElement("div", { className: "pull-down-indicator", ref: (o) => this.element = o },
                React.createElement("div", { className: "init", ref: (o) => this.initElement = o },
                    React.createElement("i", { className: "icon-chevron-down" }),
                    React.createElement("span", null, this.props.initText)),
                React.createElement("div", { className: "ready", ref: (o) => this.readyElement = o },
                    React.createElement("i", { className: "icon-chevron-up" }),
                    React.createElement("span", null, this.props.readyText))));
        }
    }
    controls.PullDownIndicator = PullDownIndicator;
    PullDownIndicator.defaultProps = defaultIndicatorProps;
})(controls || (controls = {}));
var controls;
(function (controls) {
    function getChildren(props) {
        props = props || {};
        let children = [];
        if (props['children'] instanceof Array) {
            children = props['children'];
        }
        else if (props['children'] != null) {
            children = [props['children']];
        }
        return children;
    }
    class Page extends React.Component {
        constructor(props) {
            super(props);
        }
        get element() {
            return this._element;
        }
        render() {
            let className = this.props.className;
            let children = getChildren(this.props);
            let header = children.filter(o => o instanceof PageHeader)[0];
            let footer = children.filter(o => o instanceof PageFooter)[0];
            let bodies = children.filter(o => !(o instanceof PageHeader) && !(o instanceof PageFooter));
            let views = children.filter(o => o instanceof PageView);
            return (React.createElement("div", { className: className, ref: (e) => this._element = e || this._element },
                header != null ? (header) : null,
                bodies.map(o => (o)),
                footer != null ? (footer) : null));
        }
    }
    controls.Page = Page;
    class PageComponent extends Page {
    }
    controls.PageComponent = PageComponent;
    class PageHeader extends React.Component {
        render() {
            let children = getChildren(this.props);
            return (React.createElement("header", { ref: (o) => this.element = o, style: this.props.style }, children.map(o => (o))));
        }
    }
    PageHeader.tagName = 'HEADER';
    controls.PageHeader = PageHeader;
    class PageFooter extends React.Component {
        render() {
            let children = getChildren(this.props);
            return (React.createElement("footer", { ref: (o) => this.element = o, style: this.props.style }, children.map(o => (o))));
        }
    }
    PageFooter.tagName = 'FOOTER';
    controls.PageFooter = PageFooter;
    let easing = BezierEasing(0, 0, 1, 0.5);
    /** 是否为安卓系统 */
    class PageView extends React.Component {
        iosAppComponentDidMount() {
        }
        componentDidMount() {
            if (controls.isIOS && controls.isCordovaApp) {
                this.iosAppComponentDidMount();
                return;
            }
            let start;
            //======================================
            let scroller = this.element;
            scroller.style.transition = '0';
            let hammer = controls.createHammerManager(scroller);
            ;
            var pan = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL });
            let moving = null;
            hammer.add(pan);
            hammer.on('panstart', (event) => {
                scroller.style.transition = '0s';
            });
            let panVertical = (event) => {
                console.log('deltaY:' + event.deltaY);
                if (scroller.scrollTop == 0 && (event.direction & Hammer.DIRECTION_DOWN) == Hammer.DIRECTION_DOWN) {
                    moving = 'movedown';
                }
                else if (scroller.scrollTop + scroller.clientHeight == scroller.scrollHeight &&
                    (event.direction & Hammer.DIRECTION_UP) == Hammer.DIRECTION_UP) {
                    moving = 'moveup';
                }
                else if ((scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight) || scroller.scrollTop < 0) {
                    moving = 'overscroll';
                }
                if (moving) {
                    let distance = easing(event.distance / 1000) * 1000;
                    if (moving == 'movedown') {
                        scroller.style.transform = `translateY(${distance}px)`;
                        scroller.setAttribute('data-scrolltop', `${0 - distance}`);
                    }
                    else if (moving == 'moveup') {
                        scroller.style.transform = `translateY(-${distance}px)`;
                        scroller.setAttribute('data-scrolltop', `${scroller.scrollTop + distance}`);
                    }
                    else if (moving == 'overscroll') {
                        scroller.setAttribute('data-scrolltop', `${scroller.scrollTop}`);
                    }
                }
            };
            hammer.on('panup', panVertical);
            hammer.on('pandown', panVertical);
            let end = () => {
                if (!moving) {
                    return;
                }
                this.element.style.touchAction = 'auto';
                scroller.removeAttribute('data-scrolltop');
                // let pullDownRelease: () => void;
                // let pullUpRelease: () => void;
                // if (moving == 'movedown' && this.props.pullDownIndicator) {
                //     pullDownRelease = this.props.pullDownIndicator.onRelease;
                // }
                // else if (moving == 'moveup' && this.props.pullUpIndicator) {
                //     pullUpRelease = this.props.pullUpIndicator.onRelease;
                // }
                if (moving == 'movedown' && this.pullDownIndicator != null && this.pullDownIndicator.status == 'ready') {
                    this.onRelease('pullDown');
                }
                else if (moving == 'moveup' && this.pullUpIndicator != null && this.pullUpIndicator.status == 'ready') {
                    this.onRelease('pullUp');
                }
                else {
                    this.resetPosition();
                }
                moving = null;
            };
            hammer.on('pancancel', end);
            hammer.on('panend', end);
            let startY;
            scroller.addEventListener('touchstart', (event) => {
                startY = event.touches[0].clientY;
            });
            scroller.addEventListener('touchmove', (event) => {
                let deltaY = event.touches[0].clientY - startY;
                if (deltaY < 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
                    event.preventDefault();
                }
                else if (deltaY > 0 && scroller.scrollTop <= 0) {
                    event.preventDefault();
                }
            });
        }
        onRelease(action) {
            if (action == 'pullDown' && this.props.pullDownIndicator.onRelease != null) {
                this.props.pullDownIndicator.onRelease();
            }
            else if (action == 'pullUp' && this.props.pullUpIndicator.onRelease != null) {
                this.props.pullUpIndicator.onRelease();
            }
            else {
                this.resetPosition();
            }
        }
        resetPosition() {
            this.element.style.removeProperty('transform');
        }
        slide(direction) {
            this.element.style.transition = `0.4s`;
            if (direction == 'down') {
                this.element.style.transform = `translateY(100%)`;
            }
            else if (direction == 'up') {
                this.element.style.transform = `translateY(-100%)`;
            }
            else if (direction == 'origin') {
                this.element.style.transform = `translateY(0)`;
            }
        }
        render() {
            let children = getChildren(this.props);
            let pullDownIndicator = null;
            let pullUpIndicator = null;
            if (this.props.pullDownIndicator) {
                let p = this.props.pullDownIndicator;
                pullDownIndicator =
                    React.createElement(controls.PullDownIndicator, { initText: p.initText, readyText: p.readyText, distance: p.distance, ref: (o) => this.pullDownIndicator = o });
            }
            if (this.props.pullUpIndicator) {
                let p = this.props.pullUpIndicator;
                pullUpIndicator =
                    React.createElement(controls.PullUpIndicator, { initText: p.initText, readyText: p.readyText, distance: p.distance, ref: (o) => this.pullUpIndicator = o });
            }
            return (React.createElement("section", { ref: (o) => this.element = o, className: this.props.className, style: this.props.style },
                pullDownIndicator,
                children.map(o => (o)),
                pullUpIndicator));
        }
    }
    PageView.tagName = 'SECTION';
    controls.PageView = PageView;
})(controls || (controls = {}));
var controls;
(function (controls) {
    let isIOS = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0;
    class Panel extends React.Component {
        constructor(props) {
            super(props);
        }
        get element() {
            return this.panel;
        }
        show(from) {
            let header = this.header; //this.refs['header'] as HTMLElement;
            let body = this.body; //this.refs['body'] as HTMLElement;
            let footer = this.footer; //this.refs['footer'] as HTMLElement;
            let panel = this.panel; //this.refs['panel'] as HTMLElement;
            let modal = this.modal; //this.refs['modal'] as HTMLElement;
            let backdrop = this.backdrop; //this.refs['backdrop'] as HTMLElement;
            panel.style.display = 'block';
            modal.style.display = 'block';
            window.setTimeout(() => {
                modal.style.transform = 'translateX(0)';
                backdrop.style.opacity = '0.5';
            }, 50);
            console.assert(header != null && body != null && footer != null);
            let setBodyHeight = () => {
                let headerHeight = header.getBoundingClientRect().height;
                let footerHeight = footer.getBoundingClientRect().height;
                let bodyHeight = window.innerHeight - headerHeight - footerHeight;
                body.style.height = `${bodyHeight}px`;
            };
            window.addEventListener('resize', () => setBodyHeight());
            setBodyHeight();
        }
        hide() {
            this.modal.style.removeProperty('transform');
            this.backdrop.style.opacity = '0';
            window.setTimeout(() => {
                this.panel.style.display = 'none';
            }, 500);
        }
        componentDidMount() {
            //=====================================================================
            // 点击非窗口区域，关窗口。并禁用上级元素的 touch 操作。
            let panel = this.panel; //this.refs['panel'] as HTMLElement;
            let modalDialog = this.modalDialog; //this.refs['modalDialog'] as HTMLElement;
            panel.addEventListener('touchstart', (event) => {
                let dialogRect = modalDialog.getBoundingClientRect();
                for (let i = 0; i < event.touches.length; i++) {
                    let { clientX } = event.touches[i];
                    if (clientX < dialogRect.left) {
                        this.hide();
                        return;
                    }
                }
            });
            if (isIOS) {
                panel.addEventListener('touchstart', (event) => {
                    let tagName = event.target.tagName;
                    if (tagName == 'BUTTON' || tagName == 'INPUT' || tagName == 'A') {
                        return;
                    }
                    event.stopPropagation();
                    event.preventDefault();
                });
            }
        }
        render() {
            return React.createElement("div", { ref: (o) => this.panel = o || this.panel, className: "product-panel" },
                React.createElement("div", { ref: (o) => this.modal = o, className: "modal" },
                    React.createElement("div", { ref: (o) => this.modalDialog = o, className: "modal-dialog" },
                        React.createElement("div", { className: "modal-content" },
                            this.props.header ?
                                React.createElement("div", { ref: (o) => this.header = o, className: "modal-header" }, this.props.header)
                                : null,
                            this.props.body ?
                                React.createElement("div", { ref: (o) => this.body = o, className: "modal-body" }, this.props.body)
                                : null,
                            this.props.footer ?
                                React.createElement("div", { ref: (o) => this.footer = o, className: "modal-footer" }, this.props.footer)
                                : null))),
                React.createElement("div", { ref: (o) => this.backdrop = o, className: "modal-backdrop in" }));
        }
        render1() {
            return React.createElement("div", { ref: "panel", className: "product-panel" },
                React.createElement("div", { ref: "modal", className: "modal" },
                    React.createElement("div", { ref: "modalDialog", className: "modal-dialog" },
                        React.createElement("div", { className: "modal-content" },
                            React.createElement("div", { ref: "header", className: "modal-header" }, this.props.header),
                            React.createElement("div", { ref: "body", className: "modal-body" }, this.props.body),
                            React.createElement("div", { ref: "footer", className: "modal-footer" }, this.props.footer)))),
                React.createElement("div", { ref: "backdrop", className: "modal-backdrop in" }));
        }
    }
    controls.Panel = Panel;
})(controls || (controls = {}));
var controls;
(function (controls) {
    class Tabs extends React.Component {
        constructor(props) {
            super(props);
            this.state = { activeIndex: this.props.defaultActiveIndex || 0 };
        }
        componentDidMount() {
            setTimeout(() => {
                let scroller;
                if (this.props.scroller != null) {
                    scroller = this.props.scroller();
                }
                if (scroller == null) {
                    return;
                }
                let scrollTop;
                scroller.addEventListener('scroll', (event) => {
                    if (scrollTop == null) {
                        scrollTop = scroller.scrollTop;
                        return;
                    }
                    if (scroller.scrollTop - scrollTop > 0) {
                        if (scroller.scrollTop > 100)
                            this.element.style.top = '0px';
                    }
                    else {
                        this.element.style.removeProperty('top');
                    }
                    scrollTop = scroller.scrollTop;
                });
            }, 500);
        }
        activeItem(index) {
            this.state.activeIndex = index;
            this.setState(this.state);
            if (this.props.onItemClick) {
                this.props.onItemClick(index);
            }
        }
        render() {
            let children = controls.getChildren(this.props);
            let itemWidth = 100 / children.length;
            return (React.createElement("ul", { ref: (o) => this.element = o, className: this.props.className, style: { transition: '0.4s' } }, children.map((o, i) => (React.createElement("li", { key: i, onClick: () => this.activeItem(i), className: i == this.state.activeIndex ? 'active' : '', style: { width: `${itemWidth}%` } }, (o))))));
        }
    }
    controls.Tabs = Tabs;
})(controls || (controls = {}));
