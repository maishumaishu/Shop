define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const imageThumbSize = 112;
    requirejs(['css!admin/controls/imageThumber']);
    class ImageThumber extends React.Component {
        constructor(props) {
            super(props);
            this.state = { selectedText: '' };
        }
        setDeleteButton(e, imagePath) {
            if (!e)
                return;
            if (this.props.remove) {
                ui.buttonOnClick(e, (e) => {
                    e.stopPropagation();
                    e.cancelBubble = true;
                    return this.props.remove(imagePath);
                }, {
                    confirm: '确定删除该图片吗？'
                });
            }
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
                    h("div", { className: "top" },
                        selectedText,
                        h("div", { className: "remove" },
                            h("i", { className: "icon-remove", ref: (e) => this.setDeleteButton(e, imagePath) }))),
                    h("img", { className: "img-responsive", src: imagePath, ref: (e) => e ? ui.renderImage(e) : null }),
                    h("div", { className: "bottom" }, text))));
        }
    }
    exports.default = ImageThumber;
});
