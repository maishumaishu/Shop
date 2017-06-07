
export let buttonOnClick = (function () {
    let confirmDialogElment = document.createElement('div');
    confirmDialogElment.className = 'modal fade';
    confirmDialogElment.style.marginTop = '20px'
    document.body.appendChild(confirmDialogElment);

    let toastDialogElement = document.createElement('div');
    toastDialogElement.className = 'modal fade';
    toastDialogElement.style.marginTop = '20px';
    document.body.appendChild(toastDialogElement);

    type Callback = (event: MouseEvent) => Promise<any>;
    type Arguments = { confirm?: string, toast?: string | JSX.Element };
    return (callback: Callback, args?: Arguments) => {
        args = args || {};
        let execute = async (event) => {
            let button = (event.target as HTMLButtonElement);
            button.setAttribute('disabled', '');
            try {
                await callback(event);
            }
            catch (exc) {
                console.error(exc);
                throw exc;
            }
            finally {
                button.removeAttribute('disabled')
            }
        }

        return function (event) {
            let confirmPromise: Promise<any>;
            if (!args.confirm) {
                confirmPromise = Promise.resolve();
            }
            else {
                confirmPromise = new Promise((reslove, reject) => {
                    ReactDOM.render(
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">&nbsp;</h4>
                                </div>
                                <div className="modal-body form-horizontal">
                                    <h5>{args.confirm}</h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal"
                                        ref={(o: HTMLButtonElement) => {
                                            if (!o) return;
                                            o.onclick = () => {
                                                reject();
                                            }
                                        }} >取消</button>
                                    <button type="button" className="btn btn-primary"
                                        ref={(o: HTMLButtonElement) => {
                                            if (!o) return;
                                            o.onclick = () => {
                                                reslove();
                                            };
                                        }}>确认</button>
                                </div>
                            </div>
                        </div>,
                        confirmDialogElment);
                });
            }

            confirmPromise.then(() => execute(event).then(() => {
                if (args.toast) {
                    ReactDOM.render(
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-body form-horizontal">
                                    {typeof args.toast == 'string' ?
                                        <h5>{args.toast}</h5> :
                                        args.toast
                                    }
                                </div>
                            </div>
                        </div>,
                        toastDialogElement);
                    toastDialogElement.style.display = 'block';
                    toastDialogElement.className = 'modal fade in';
                    setTimeout(() => {
                        toastDialogElement.className = 'modal fade out';
                        setTimeout(() => {
                            toastDialogElement.className = 'modal fade';
                            toastDialogElement.style.removeProperty('display');
                        }, 500);
                    }, 1500);
                }
            }));
        }
    }

})();

export let alert = (function () {
    return function (msg: string) {
        let element = document.createElement('div');
        ReactDOM.render(
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        <h5>{msg}</h5>
                    </div>
                </div>
            </div>,
            element
        );
        $(element).modal();
        $(element).on('hidden.bs.moda', () => {
            $(element).remove();
        });
    }
})();

export let loadImage = (function () {

    let imageBoxConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',

        /** 图片显示的文字 */
        imageDisaplyText: '',
    }

    let config = imageBoxConfig;

    /** 加载图片到 HTMLImageElement */
    return function loadImage(element: HTMLImageElement): Promise<string> {
        // imageText = imageText || config.imageDisaplyText;
        //, imageUrl: string, imageText?: string

        let imageUrl = element.src || '';
        let imageText = element.title || '';

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

        // element.setAttribute('width', img_width + 'px');
        // element.setAttribute('height', img_height + 'px');

        function getPreviewImage(imageText: string, img_width: number, img_height: number) {

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
            var image: HTMLImageElement = new Image();
            image.onload = function () {
                element.src = (this as HTMLImageElement).src;
                resolve(element.src);
            };
            image.src = src;
        })
    }
})();