var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageFileResizeResult {
    }
    class ImageFileLoader {
        constructor(fileUploadElement) {
            this.fileLoad = chitu.Callbacks();
            fileUploadElement.onchange = () => __awaiter(this, void 0, void 0, function* () {
                if (!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob'])) {
                    alert('The File APIs are not fully supported in this browser.');
                    return false;
                }
                for (var i = 0; i < fileUploadElement.files.length; i++) {
                    let imageData = yield this.processfile(fileUploadElement.files[i]);
                    this.fileLoad.fire(this, imageData);
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
            this.imageFileLoader.fileLoad.add((sender, data) => {
                this.state.images.push(data);
                this.setState(this.state);
            });
        }
        get imageDatas() {
            return this.state.images;
        }
        render() {
            return (h("div", null,
                this.state.images.map((o, i) => h("div", { key: i, "data-bind": "click:$parent.showImagePage,tap:$parent.showImagePage", className: "pull-left item" },
                    h("img", { src: o, width: '100%', height: "100%" }))),
                h("div", { className: "pull-left item" },
                    h("input", { ref: (o) => this.inputElement = o, type: "file", accept: "images/*", multiple: true }),
                    h("i", { className: "icon-camera" }))));
        }
    }
    exports.ImageFileSelector = ImageFileSelector;
});
