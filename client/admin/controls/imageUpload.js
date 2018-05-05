define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['less!admin/controls/imageUpload']);
    class ImageUpload extends React.Component {
        updloadImage(imageFile) {
            let { width, height } = this.props;
            ui.imageFileToBase64(imageFile)
                .then(data => {
                this.props.saveImage(data);
            });
        }
        setFileInput(e) {
            if (!e || e.onchange)
                return;
            this.file = e;
            e.onchange = () => {
                if (e.files.length > 0)
                    this.updloadImage(e.files[0]);
            };
        }
        componentDidMount() {
            this.setSizes();
        }
        setSizes() {
            let width = this.itemElement.offsetWidth;
            //==========================================
            // 获取元素的宽带，作为高度，如果小于一个很小的数值，
            // 比如 10，则认为元素没有渲染完成，稍后再获取
            if (width < 10) {
                setTimeout(() => {
                    this.setSizes();
                }, 100);
            }
            //==========================================
            let height = width;
            let itemPaddingTop;
            this.itemElement.style.height = `${height}px`;
            if (height > 80) {
                itemPaddingTop = (height - 80) / 2;
                this.itemElement.style.paddingTop = `${itemPaddingTop}px`;
            }
            this.file.style.marginTop = `-${height - itemPaddingTop}px`;
            this.file.style.width = `${width}px`;
            this.file.style.height = `${height}px`;
        }
        render() {
            let { title, className } = this.props;
            title = title || '图片上传';
            className = className || '';
            return (h("div", { className: `image-upload ${className}`, style: this.props.style },
                h("div", { className: "item", ref: (e) => this.itemElement = e || this.itemElement },
                    h("i", { className: "icon-plus icon-4x" }),
                    h("div", null, title),
                    h("input", { type: "file", style: { width: 0, height: 0 }, ref: (e) => this.setFileInput(e) }))));
        }
    }
    exports.default = ImageUpload;
});
