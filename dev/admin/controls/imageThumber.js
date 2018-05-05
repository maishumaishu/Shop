define(["require", "exports", "../images"], function (require, exports, images_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const imageThumbSize = 112;
    requirejs(['less!admin/controls/imageThumber']);
    class ImageThumber extends React.Component {
        constructor(props) {
            super(props);
            this.state = { selectedText: '' };
        }
        setDeleteButton(e, imagePath) {
            if (!e)
                return;
            // if (this.props.remove) {
            ui.buttonOnClick(e, (e) => {
                e.stopPropagation();
                e.cancelBubble = true;
                return this.props.remove(imagePath);
            }, {
                confirm: '确定删除该图片吗？'
            });
            // }
        }
        render() {
            let { imagePath, className, onClick, selectedText, text, title } = this.props;
            className = className || '';
            text = text || '';
            return (h("div", { className: `image-thumber ${className}`, title: title, onClick: (e) => {
                    this.props.onClick ? this.props.onClick(this, e) : null;
                } },
                h("div", { className: `item text-center  ${selectedText ? 'selected' : ''}` },
                    h("div", { className: "triangle" }),
                    h("div", { className: "top" }, selectedText),
                    this.props.remove ?
                        h("div", { className: "remove" },
                            h("i", { className: "icon-remove", ref: (e) => this.setDeleteButton(e, imagePath) })) : null,
                    h("img", { className: "img-responsive", src: images_1.imageUrl(imagePath, 150, 150), ref: (e) => e ? ui.renderImage(e, { imageSize: { width: 150, height: 150 } }) : null }),
                    h("div", { className: "bottom" }, text))));
        }
    }
    exports.default = ImageThumber;
});
