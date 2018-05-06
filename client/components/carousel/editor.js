var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/editor", "admin/services/station", "admin/images"], function (require, exports, editor_1, station_1, images_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //========================================
    // 列表项的宽度，这 css 样式设定，要与它相同
    const itemHeight = 120;
    class CarouselEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.loadEditorCSS();
            this.station = this.props.elementPage.createService(station_1.StationService);
        }
        saveContentImage(data) {
            return __awaiter(this, void 0, void 0, function* () {
                let result = yield this.station.saveImage(data.base64);
                let item = { image: images_1.imageUrl(result.id), title: result.id, url: "" };
                this.state.items.push(item);
                this.setState(this.state);
                return result;
            });
        }
        showImageDialog() {
            return __awaiter(this, void 0, void 0, function* () {
                images_1.ImageManager.show((imageIds) => {
                    imageIds.forEach(o => {
                        this.state.items.push({ image: o, url: '', title: '' });
                        this.setState(this.state);
                    });
                });
            });
        }
        render() {
            let { items, autoplay, itemScale, clickType } = this.state;
            let itemWidth;
            if (itemScale) {
                itemWidth = itemHeight / itemScale;
            }
            items = items || [];
            return [
                h("div", { key: 10, className: "form-group" },
                    h("label", { className: "pull-left", style: { width: 100 } }, "\u81EA\u52A8\u64AD\u653E"),
                    h("span", { style: { paddingRight: 10 } },
                        h("input", { type: "radio", name: "autoplay", value: "true", ref: (e) => this.bindCheckElement(e, 'autoplay', 'boolean') }),
                        "\u542F\u7528"),
                    h("span", null,
                        h("input", { type: "radio", name: "autoplay", value: "false", ref: (e) => this.bindCheckElement(e, 'autoplay', 'boolean') }),
                        "\u7981\u7528")),
                h("ul", { key: "ul", className: "carousel-items" },
                    items.map((o, i) => h("li", { key: i, style: { width: itemWidth } },
                        h("div", { className: "form-group" },
                            h("img", { src: images_1.imageUrl(o.image, 100) })),
                        clickType == 'openPage' ?
                            h("div", { className: "form-group" },
                                h("input", { className: "form-control", placeholder: "请输入和图片对应的链接" })) : null,
                        h("div", { className: "form-group" },
                            h("button", { className: "btn btn-block btn-danger", ref: (e) => {
                                    if (!e)
                                        return;
                                    ui.buttonOnClick(e, () => {
                                        items = items.filter(c => c != o);
                                        this.state.items = items;
                                        this.setState(this.state);
                                        return Promise.resolve();
                                    }, { confirm: '确定删除吗' });
                                } }, "\u5220\u9664")))),
                    h("li", { style: { width: itemWidth }, onClick: () => this.showImageDialog() },
                        h("i", { className: "icon-plus icon-4x" }),
                        h("div", null, "\u4ECE\u76F8\u518C\u9009\u53D6\u56FE\u7247"))),
                h("div", { key: "div", className: "clearfix" }),
            ];
        }
    }
    exports.default = CarouselEditor;
});
