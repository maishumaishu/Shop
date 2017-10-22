var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ui;
(function (ui) {
    ui.dialogContainer = document.body;
    function setDialogContainer(value) {
        if (value == null)
            throw new Error('value can not be null.');
        ui.dialogContainer = value;
    }
    ui.setDialogContainer = setDialogContainer;
    function buttonOnClick(callback, args) {
        args = args || {};
        let execute = (event) => __awaiter(this, void 0, void 0, function* () {
            let button = event.target;
            button.setAttribute('disabled', '');
            try {
                yield callback(event);
                if (args.toast) {
                    showToastMessage(args.toast);
                }
            }
            catch (exc) {
                console.error(exc);
                throw exc;
            }
            finally {
                button.removeAttribute('disabled');
            }
        });
        return function (event) {
            let confirmPromise;
            let confirmDialogElment;
            if (!args.confirm) {
                execute(event);
                return;
            }
            confirmDialogElment = document.createElement('div');
            confirmDialogElment.className = 'modal fade';
            confirmDialogElment.style.marginTop = '20px';
            console.assert(ui.dialogContainer != null, 'dialog container is null');
            ui.dialogContainer.appendChild(confirmDialogElment);
            confirmDialogElment.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                                    </button>
                                    <h4 class="modal-title">确认</h4>
                                </div>
                                <div class="modal-body form-horizontal">
                                   
                                </div>
                                <div class="modal-footer">
                                    <button name="cancel" type="button" class="btn btn-default">
                                        取消
                                    </button>
                                    <button name="ok" type="button" class="btn btn-primary">
                                        确定
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
            let modalHeader = confirmDialogElment.querySelector('.modal-header');
            let modalBody = confirmDialogElment.querySelector('.modal-body');
            let modalFooter = confirmDialogElment.querySelector('.modal-footer');
            modalBody.innerHTML = `<h5>${args.confirm}</h5>`;
            let cancelButton = modalFooter.querySelector('[name="cancel"]');
            let okButton = modalFooter.querySelector('[name="ok"]');
            let closeButton = modalHeader.querySelector('.close');
            closeButton.onclick = cancelButton.onclick = function () {
                ui.hideDialog(confirmDialogElment).then(() => {
                    confirmDialogElment.remove();
                });
            };
            okButton.onclick = function () {
                execute(event)
                    .then(() => ui.hideDialog(confirmDialogElment))
                    .then(() => {
                    confirmDialogElment.remove();
                });
            };
            ui.showDialog(confirmDialogElment);
        };
    }
    ui.buttonOnClick = buttonOnClick;
    function showToastMessage(msg) {
        if (!msg)
            throw new Error('Argument msg is null.');
        let toastDialogElement = document.createElement('div');
        toastDialogElement.className = 'modal fade in';
        toastDialogElement.style.marginTop = '20px';
        console.assert(ui.dialogContainer != null, 'dialog container is null.');
        ui.dialogContainer.appendChild(toastDialogElement);
        toastDialogElement.innerHTML = `
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-body form-horizontal">
                                </div>
                            </div>
                        </div>
                    `;
        let modalBody = toastDialogElement.querySelector('.modal-body');
        console.assert(modalBody != null);
        if (typeof msg == 'string')
            modalBody.innerHTML = `<h5>${msg}</h5>`;
        else
            modalBody.appendChild(msg);
        // let dialog = new Dialog(toastDialogElement);
        // dialog.show();
        ui.showDialog(toastDialogElement);
        setTimeout(() => {
            ui.hideDialog(toastDialogElement).then(() => {
                toastDialogElement.remove();
            });
        }, 500);
    }
})(ui || (ui = {}));
var ui;
(function (ui) {
    function addClassName(element, className) {
        console.assert(className != null, 'class is null');
        let c1 = (element.className || '').split(/\s+/);
        let c2 = className.split(/\s+/);
        var itemsToAdd = c2.filter(o => c1.indexOf(o) < 0);
        c1.push(...itemsToAdd);
        element.className = c1.join(' ');
    }
    function removeClassName(element, className) {
        console.assert(className != null, 'class is null');
        let c1 = (element.className || '').split(/\s+/);
        let c2 = className.split(/\s+/);
        var itemsRemain = c1.filter(o => c2.indexOf(o) < 0);
        element.className = itemsRemain.join(' ');
    }
    class Dialog {
        constructor(element) {
            this.element = element;
        }
        show() {
            this.element.style.display = 'block';
            removeClassName(this.element, 'out');
            addClassName(this.element, 'modal fade in');
        }
        hide() {
            removeClassName(this.element, 'in');
            addClassName(this.element, 'modal fade out');
            this.element.style.removeProperty('display');
            return new Promise((reslove, reject) => {
                setTimeout(() => {
                    reslove();
                }, 1000);
            });
        }
    }
    ui.Dialog = Dialog;
    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    function showDialog(element) {
        removeClassName(element, 'out');
        element.style.display = 'block';
        setTimeout(() => {
            addClassName(element, 'modal fade in');
        }, 100);
        let closeButtons = element.querySelectorAll('[data-dismiss="modal"]') || [];
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].onclick = () => hideDialog(element);
        }
    }
    ui.showDialog = showDialog;
    function hideDialog(element) {
        removeClassName(element, 'in');
        addClassName(element, 'modal fade out');
        return new Promise((reslove, reject) => {
            setTimeout(() => {
                element.style.removeProperty('display');
                reslove();
            }, 1000);
        });
    }
    ui.hideDialog = hideDialog;
    function alert(args) {
        let element = document.createElement('div');
        ui.dialogContainer.appendChild(element);
        if (typeof args == 'string') {
            args = { title: '&nbsp;', message: args };
        }
        element.innerHTML = `
            <div class="modal-dialog">
                
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title">${args.title}</h4>
                    </div>
                    <div class="modal-body">
                        <h5>${args.message}</h5>
                    </div>
                    <div class="modal-footer">
                        <button name="ok" type="button" class="btn btn-primary">
                            确定
                        </button>
                    </div>
                </div>
            </div>
        `;
        // $(element).modal();
        // $(element).on('hidden.bs.modal', () => {
        //     $(element).remove();
        // });
        // var dialog = new Dialog(element);
        // dialog.show();
        ui.showDialog(element);
        let titleElement = element.querySelector('.modal-title');
        let modalFooter = element.querySelector('.modal-footer');
        let cancelButton = modalFooter.querySelector('[name="cancel"]');
        let okButton = modalFooter.querySelector('[name="ok"]');
        okButton.onclick = () => ui.hideDialog(element); //dialog.hide()
    }
    ui.alert = alert;
})(ui || (ui = {}));
var ui;
(function (ui) {
    ui.errors = {
        argumentNull(paramName) {
            let msg = `Argumnet ${paramName} can not be null or empty.`;
            let error = new Error();
            error.message = msg;
            return error;
        }
    };
})(ui || (ui = {}));
var ui;
(function (ui) {
    ui.loadImageConfig = {
        /** 图片的基本路径，图片地址如果不以 http 开头，则加上该路径 */
        imageBaseUrl: '',
        /** 图片显示的文字 */
        imageDisaplyText: '',
    };
    let config = ui.loadImageConfig;
    let draws = {
        text: (imageText, options) => {
            return (ctx, canvasWidth, canvasHeight) => {
                // let fontSize1 = Math.floor(canvasHeight / 3 * 0.8);
                let fontSize = Math.floor((canvasWidth / imageText.length) * 0.6);
                // let fontSize = Math.min(fontSize1, fontSize2);
                options = Object.assign({
                    fontSize
                }, options);
                ctx.fillStyle = 'whitesmoke';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                // 设置字体
                ctx.font = `Bold ${options.fontSize}px Arial`;
                // 设置对齐方式
                ctx.textAlign = "left";
                // 设置填充颜色
                ctx.fillStyle = "#999";
                let textWidth = fontSize * imageText.length;
                let startX = Math.floor((canvasWidth - textWidth) * 0.5);
                let startY = Math.floor((canvasHeight - options.fontSize) * 0.4);
                // 设置字体内容，以及在画布上的位置
                ctx.fillText(imageText, startX, Math.floor(canvasHeight * 0.6));
            };
        }
    };
    function generateImageBase64(width, height, draw) {
        var canvas = document.createElement('canvas');
        canvas.width = width; //img_width;
        canvas.height = height; //img_height;
        var ctx = canvas.getContext('2d');
        draw(ctx, width, height);
        return canvas.toDataURL();
    }
    function loadImageByUrl(url) {
    }
    const PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
    const PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;
    /**
     * 在 IMG 元素上渲染图片
     * @param element 要渲染的 IMG 元素
     * @param options 渲染选项，默认将 IMG 元素的 SRC 属性渲染出来
     */
    function renderImage(element, options) {
        // imageText = imageText || config.imageDisaplyText;
        //, imageUrl: string, imageText?: string
        options = options || {};
        if (!element)
            throw ui.errors.argumentNull('element');
        let imageUrl = element.src || '';
        //====================================================
        // 通过 URL 设置图片大小
        if (imageUrl && !options.imageSize) {
            var match = imageUrl.match(/_\d+_\d+/);
            if (match && match.length > 0) {
                var arr = match[0].split('_');
                if (arr.length >= 2) {
                    var width = new Number(arr[1]).valueOf();
                    var height = new Number(arr[2]).valueOf();
                    options.imageSize = { width, height };
                }
            }
        }
        //====================================================
        options.imageSize = options.imageSize || { width: PREVIEW_IMAGE_DEFAULT_WIDTH, height: PREVIEW_IMAGE_DEFAULT_HEIGHT };
        //====================================================
        if (!options.imageText) {
            options.imageText = element.title || '';
            ;
        }
        let s = options.imageSize;
        //设置默认的图片
        var src_replace = generateImageBase64(s.width, s.height, draws.text(options.imageText || config.imageDisaplyText)); //getPreviewImage(imageText || config.imageDisaplyText, img_width, img_height);
        element.setAttribute('src', src_replace);
        return new Promise((resolve, reject) => {
            if (options.loadImage) {
                options.loadImage()
                    .then(base64 => base64 ? Promise.resolve(base64) : Promise.reject({}))
                    .catch(() => {
                    let base64 = generateImageBase64(s.width, s.height, draws.text('加载图片失败', { fontSize: 24 }));
                    return Promise.resolve(base64);
                })
                    .then((base64) => {
                    element.src = base64;
                });
            }
            else {
                var image = new Image();
                image.onload = function () {
                    element.src = this.src;
                    resolve(element.src);
                };
                image.src = imageUrl;
            }
        });
    }
    ui.renderImage = renderImage;
    function imageFileToBase64(imageFile, size) {
        if (!imageFile)
            throw ui.errors.argumentNull('imageFile');
        // options = options || {} as any;
        return new Promise((resolve, reject) => {
            // if (!(/image/i).test(imageFile.type)) {
            //     console.log("File " + imageFile.name + " is not an image.");
            //     reject();
            // }
            var reader = new FileReader();
            reader.readAsArrayBuffer(imageFile);
            reader.onload = (ev) => {
                var blob = new Blob([event.target['result']]);
                window['URL'] = window['URL'] || window['webkitURL'];
                var blobURL = window['URL'].createObjectURL(blob);
                var image = new Image();
                image.src = blobURL;
                image.onload = () => {
                    var canvas = document.createElement('canvas');
                    let width = image.width;
                    let height = image.height;
                    if (size) {
                        width = size.width;
                        height = size.height;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, width, height);
                    let data = canvas.toDataURL("/jpeg", 0.7);
                    resolve({ base64: data, width, height });
                };
            };
        });
    }
    ui.imageFileToBase64 = imageFileToBase64;
})(ui || (ui = {}));
