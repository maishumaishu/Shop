var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/tips", "./imageManager", "../images"], function (require, exports, tips_1, imageManager_1, images_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //TODO 缩略图使用小图
    requirejs(['less!admin/controls/imageInput']);
    class ImageInput extends React.Component {
        constructor(props) {
            super(props);
            this.state = { imageId: this.props.imageId, url: '' };
        }
        bindTextElement(e, member) {
            if (!e)
                return;
            e.value = this.state[member] || '';
            e.onchange = () => {
                this.state[member] = e.value || "";
                this.setState(this.state);
            };
        }
        showImageDialog() {
            imageManager_1.default.show((images) => {
                debugger;
                if (this.state.imageId == images[0])
                    return;
                this.state.imageId = images[0]; //imageUrl(images[0], 100);
                this.setState(this.state);
                if (this.props.onChange)
                    this.props.onChange(images[0]);
            });
        }
        uploadImage(file) {
            return __awaiter(this, void 0, void 0, function* () {
                let { station } = this.props;
                let data = yield ui.fileToBase64(file);
                let result = yield station.saveImage(data);
                this.state.imageId = result.id;
                this.setState(this.state);
            });
        }
        render() {
            let { station } = this.props;
            let { imageId } = this.state;
            return [
                h("div", { key: 10, className: "image-input input-group" },
                    h("input", { className: "form-control", readOnly: true, value: images_1.imageUrl(imageId) }),
                    h("span", { className: "input-group-addon", title: tips_1.default.imageFromAlbum, onClick: () => this.showImageDialog() },
                        h("i", { className: "icon-picture" })),
                    h("span", { className: "input-group-addon", title: tips_1.default.uploadImage },
                        h("i", { className: "icon-plus" }),
                        h("input", { className: "file-upload", type: "file", ref: (e) => {
                                if (!e)
                                    return;
                                e.onchange = () => this.uploadImage(e.files[0]);
                            } }))),
                imageId ? h("img", { key: "image", className: "image-input", src: images_1.imageUrl(imageId, 120) }) : null
            ];
        }
    }
    exports.ImageInput = ImageInput;
});
