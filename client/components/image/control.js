define(["require", "exports", "components/common", "../../share/common"], function (require, exports, common_1, common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.loadControlCSS();
        }
        get persistentMembers() {
            return ["source", "url"];
        }
        _render(h) {
            let { source } = this.state;
            return (h("div", { className: "image-control" },
                h("img", { src: common_2.imageUrl(this.state.source), ref: (e) => {
                        if (!e)
                            return;
                        ui.renderImage(e, { imageText: "暂无图片" });
                    } })));
        }
    }
    exports.default = ImageControl;
});
