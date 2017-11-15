var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var ui;
(function (ui) {
    function buttonOnClick(callback, args) {
        var _this = this;
        args = args || {};
        var execute = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var button, exc_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        button = event.target;
                        button.setAttribute('disabled', '');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, callback(event)];
                    case 2:
                        _a.sent();
                        if (args.toast) {
                            showToastMessage(args.toast);
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        exc_1 = _a.sent();
                        console.error(exc_1);
                        throw exc_1;
                    case 4:
                        button.removeAttribute('disabled');
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        return function (event) {
            if (!args.confirm) {
                execute(event);
                return;
            }
            var text = typeof args.confirm == 'string' ?
                args.confirm :
                args.confirm();
            ui.confirm({ message: text, confirm: function (event) { return execute(event); } });
        };
    }
    ui.buttonOnClick = buttonOnClick;
    function showToastMessage(msg) {
        if (!msg)
            throw new Error('Argument msg is null.');
        var dialogContainer = ui.dialogConfig.dialogContainer || document.body;
        var toastDialogElement = document.createElement('div');
        toastDialogElement.className = 'modal fade in';
        toastDialogElement.style.marginTop = '20px';
        console.assert(dialogContainer != null, 'dialog container is null.');
        dialogContainer.appendChild(toastDialogElement);
        toastDialogElement.innerHTML = "\n                        <div class=\"modal-dialog\">\n                            <div class=\"modal-content\">\n                                <div class=\"modal-body form-horizontal\">\n                                </div>\n                            </div>\n                        </div>\n                    ";
        var modalBody = toastDialogElement.querySelector('.modal-body');
        console.assert(modalBody != null);
        if (typeof msg == 'string')
            modalBody.innerHTML = "<h5>" + msg + "</h5>";
        else
            modalBody.appendChild(msg);
        // let dialog = new Dialog(toastDialogElement);
        // dialog.show();
        ui.showDialog(toastDialogElement);
        setTimeout(function () {
            ui.hideDialog(toastDialogElement).then(function () {
                toastDialogElement.remove();
            });
        }, 500);
    }
})(ui || (ui = {}));
var ui;
(function (ui) {
    function dialogContainer() {
        return ui.dialogConfig.dialogContainer || document.body;
    }
    ui.dialogConfig = {
        dialogContainer: null
    };
    function addClassName(element, className) {
        console.assert(className != null, 'class is null');
        var c1 = (element.className || '').split(/\s+/);
        var c2 = className.split(/\s+/);
        var itemsToAdd = c2.filter(function (o) { return c1.indexOf(o) < 0; });
        c1.push.apply(c1, itemsToAdd);
        element.className = c1.join(' ');
    }
    function removeClassName(element, className) {
        console.assert(className != null, 'class is null');
        var c1 = (element.className || '').split(/\s+/);
        var c2 = className.split(/\s+/);
        var itemsRemain = c1.filter(function (o) { return c2.indexOf(o) < 0; });
        element.className = itemsRemain.join(' ');
    }
    /** 弹窗
     * @param element bootstrap 的 modal 元素
     */
    function showDialog(element) {
        removeClassName(element, 'out');
        element.style.display = 'block';
        setTimeout(function () {
            addClassName(element, 'modal fade in');
        }, 100);
        var closeButtons = element.querySelectorAll('[data-dismiss="modal"]') || [];
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].onclick = function () { return hideDialog(element); };
        }
    }
    ui.showDialog = showDialog;
    function hideDialog(element) {
        removeClassName(element, 'in');
        addClassName(element, 'modal fade out');
        return new Promise(function (reslove, reject) {
            setTimeout(function () {
                element.style.removeProperty('display');
                reslove();
            }, 1000);
        });
    }
    ui.hideDialog = hideDialog;
    function alert(args) {
        var element = document.createElement('div');
        dialogContainer().appendChild(element);
        if (typeof args == 'string') {
            args = { title: '&nbsp;', message: args };
        }
        element.innerHTML = "\n            <div class=\"modal-dialog\">\n                \n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                            <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                        </button>\n                        <h4 class=\"modal-title\">" + args.title + "</h4>\n                    </div>\n                    <div class=\"modal-body\">\n                        <h5>" + args.message + "</h5>\n                    </div>\n                    <div class=\"modal-footer\">\n                        <button name=\"ok\" type=\"button\" class=\"btn btn-primary\">\n                            \u786E\u5B9A\n                        </button>\n                    </div>\n                </div>\n            </div>\n        ";
        // $(element).modal();
        // $(element).on('hidden.bs.modal', () => {
        //     $(element).remove();
        // });
        // var dialog = new Dialog(element);
        // dialog.show();
        ui.showDialog(element);
        var titleElement = element.querySelector('.modal-title');
        var modalFooter = element.querySelector('.modal-footer');
        var cancelButton = modalFooter.querySelector('[name="cancel"]');
        var okButton = modalFooter.querySelector('[name="ok"]');
        okButton.onclick = function () { return ui.hideDialog(element); }; //dialog.hide()
    }
    ui.alert = alert;
    function confirm(args) {
        // if (typeof args == 'string')
        //     args = { title: args };
        var title;
        var message;
        var execute = args.confirm;
        var container = args.container || document.body;
        if (typeof args == 'string') {
            message = args;
        }
        else {
            title = args.title;
            message = args.message;
        }
        var confirmDialogElment;
        confirmDialogElment = document.createElement('div');
        confirmDialogElment.className = 'modal fade';
        confirmDialogElment.style.marginTop = '20px';
        console.assert(dialogContainer != null, 'dialog container is null');
        dialogContainer().appendChild(confirmDialogElment);
        confirmDialogElment.innerHTML = "\n                    <div class=\"modal-dialog\">\n                        <div class=\"modal-content\">\n                            <div class=\"modal-header\">\n                                <button type=\"button\" class=\"close\" data-dismiss=\"modal\">\n                                    <span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span>\n                                </button>\n                                <h4 class=\"modal-title\">\u786E\u8BA4</h4>\n                            </div>\n                            <div class=\"modal-body form-horizontal\">\n                               \n                            </div>\n                            <div class=\"modal-footer\">\n                                <button name=\"cancel\" type=\"button\" class=\"btn btn-default\">\n                                    \u53D6\u6D88\n                                </button>\n                                <button name=\"ok\" type=\"button\" class=\"btn btn-primary\">\n                                    \u786E\u5B9A\n                                </button>\n                            </div>\n                        </div>\n                    </div>\n                ";
        var modalHeader = confirmDialogElment.querySelector('.modal-header');
        var modalBody = confirmDialogElment.querySelector('.modal-body');
        var modalFooter = confirmDialogElment.querySelector('.modal-footer');
        modalBody.innerHTML = "<h5>" + message + "</h5>";
        if (title) {
            modalHeader.querySelector('h4').innerHTML = title;
        }
        var cancelButton = modalFooter.querySelector('[name="cancel"]');
        var okButton = modalFooter.querySelector('[name="ok"]');
        var closeButton = modalHeader.querySelector('.close');
        closeButton.onclick = cancelButton.onclick = function () {
            ui.hideDialog(confirmDialogElment).then(function () {
                confirmDialogElment.remove();
            });
        };
        okButton.onclick = function (event) {
            execute(event)
                .then(function () { return ui.hideDialog(confirmDialogElment); })
                .then(function () {
                confirmDialogElment.remove();
            });
        };
        ui.showDialog(confirmDialogElment);
    }
    ui.confirm = confirm;
})(ui || (ui = {}));
var ui;
(function (ui) {
    ui.errors = {
        argumentNull: function (paramName) {
            var msg = "Argumnet " + paramName + " can not be null or empty.";
            var error = new Error();
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
    var config = ui.loadImageConfig;
    var draws = {
        text: function (imageText, options) {
            return function (ctx, canvasWidth, canvasHeight) {
                // let fontSize1 = Math.floor(canvasHeight / 3 * 0.8);
                var fontSize = Math.floor((canvasWidth / imageText.length) * 0.6);
                var bgColor = 'whitesmoke';
                var textColor = '#999';
                // let fontSize = Math.min(fontSize1, fontSize2);
                options = Object.assign({
                    fontSize: fontSize,
                    bgColor: bgColor,
                    textColor: textColor
                }, options);
                ctx.fillStyle = options.bgColor; //'whitesmoke';
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                // 设置字体
                ctx.font = "Bold " + options.fontSize + "px Arial";
                // 设置对齐方式
                ctx.textAlign = "left";
                // 设置填充颜色
                ctx.fillStyle = options.textColor; //"#999";
                var textWidth = fontSize * imageText.length;
                var startX = Math.floor((canvasWidth - textWidth) * 0.5);
                var startY = Math.floor((canvasHeight - options.fontSize) * 0.3);
                // 设置字体内容，以及在画布上的位置
                ctx.fillText(imageText, startX, Math.floor(canvasHeight * 0.6));
            };
        }
    };
    function generateImageBase64(width, height, obj, options) {
        var canvas = document.createElement('canvas');
        canvas.width = width; //img_width;
        canvas.height = height; //img_height;
        var ctx = canvas.getContext('2d');
        var draw = typeof obj == 'string' ? draws.text(obj, options) : obj;
        draw(ctx, width, height);
        return canvas.toDataURL();
    }
    ui.generateImageBase64 = generateImageBase64;
    function loadImageByUrl(url) {
    }
    var PREVIEW_IMAGE_DEFAULT_WIDTH = 200;
    var PREVIEW_IMAGE_DEFAULT_HEIGHT = 200;
    /**
     * 在 IMG 元素上渲染图片
     * @param element 要渲染的 IMG 元素
     * @param options 渲染选项，默认将 IMG 元素的 SRC 属性渲染出来
     */
    function renderImage(element, options) {
        options = options || {};
        if (!element)
            throw ui.errors.argumentNull('element');
        var imageUrl = element.src || '';
        if (imageUrl.indexOf('data:image/png;base64') == 0 || element['rendered']) {
            return;
        }
        //====================================================
        // 通过 URL 设置图片大小
        if (imageUrl && !options.imageSize) {
            var match = imageUrl.match(/_\d+_\d+/);
            if (match && match.length > 0) {
                var arr = match[0].split('_');
                if (arr.length >= 2) {
                    var width = new Number(arr[1]).valueOf();
                    var height = new Number(arr[2]).valueOf();
                    options.imageSize = { width: width, height: height };
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
        var s = options.imageSize;
        //设置默认的图片
        var src_replace = generateImageBase64(s.width, s.height, draws.text(options.imageText || config.imageDisaplyText)); //getPreviewImage(imageText || config.imageDisaplyText, img_width, img_height);
        element.setAttribute('src', src_replace);
        return new Promise(function (resolve, reject) {
            if (options.loadImage) {
                options.loadImage()
                    .then(function (base64) { return base64 ? Promise.resolve(base64) : Promise.reject({}); })
                    .catch(function () {
                    var base64 = generateImageBase64(s.width, s.height, draws.text('加载图片失败', { fontSize: 24 }));
                    return Promise.resolve(base64);
                })
                    .then(function (base64) {
                    element.src = base64;
                    element['rendered'] = true;
                });
            }
            else {
                var image = new Image();
                image.onload = function () {
                    element.src = this.src;
                    element['rendered'] = true;
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
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.readAsArrayBuffer(imageFile);
            reader.onload = function (ev) {
                var blob = new Blob([event.target['result']]);
                window['URL'] = window['URL'] || window['webkitURL'];
                var blobURL = window['URL'].createObjectURL(blob);
                var image = new Image();
                image.src = blobURL;
                image.onload = function () {
                    var canvas = document.createElement('canvas');
                    var width = image.width;
                    var height = image.height;
                    if (size) {
                        width = size.width;
                        height = size.height;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, width, height);
                    var data = canvas.toDataURL("/jpeg", 0.7);
                    resolve({ base64: data, width: width, height: height });
                };
            };
        });
    }
    ui.imageFileToBase64 = imageFileToBase64;
})(ui || (ui = {}));
