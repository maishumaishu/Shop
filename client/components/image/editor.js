define(["require", "exports", "components/editor", "admin/services/station", "admin/controls/imageInput"], function (require, exports, editor_1, station_1, imageInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ImageEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.loadEditorCSS();
            this.state = { uploading: false };
            this.station = this.props.elementPage.createService(station_1.StationService);
        }
        bindTextElement(e, member) {
            if (!e)
                return;
            e.value = this.state.source || '';
            e.onchange = () => {
                this.state.source = e.value || "";
                this.setState(this.state);
            };
        }
        render() {
            let { source } = this.state;
            return (h("div", { className: "image-editor form-horizontal" },
                h("div", { className: "form-group" },
                    h("label", { className: "col-sm-4" }, "\u56FE\u7247\u94FE\u63A5"),
                    h("div", { className: "col-sm-8" },
                        h(imageInput_1.ImageInput, { station: this.station, imageId: source, onChange: (imageId) => {
                                debugger;
                                this.state.source = imageId;
                                this.setState(this.state);
                            } }))),
                h("div", { className: "form-group" },
                    h("label", { className: "col-sm-4" }, "\u9875\u9762\u94FE\u63A5"),
                    h("div", { className: "col-sm-8" },
                        h("input", { className: "form-control", placeholder: "点击图片打开的页面链接" })))));
        }
    }
    exports.default = ImageEditor;
});
