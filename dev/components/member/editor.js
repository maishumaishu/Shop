var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/editor", "components/member/control", "admin/services/station", "user/services/service"], function (require, exports, editor_1, control_1, station_1, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let station = new station_1.StationService();
    //station.saveImage()
    class MemberEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.loadEditorCSS();
            this.state = {};
        }
        render() {
            let bg = this.state.bg ? service_1.imageUrl(this.state.bg) :
                control_1.default.default_bg;
            return (h("div", { className: "member-editor well" },
                h("div", { className: "bg", style: { height: 66 } },
                    h("label", { style: { display: 'table-cell' } }, "\u80CC\u666F\u56FE"),
                    h("span", { style: { display: 'table-cell', width: 120, height: 66, textAlign: 'center', cursor: 'pointer' } },
                        h("img", { src: bg, style: { width: '100%', height: '100%' } }),
                        h("input", { type: "file", title: "点击修改背景图", multiple: false, style: {
                                display: 'table-cell', width: 120, height: 66,
                                position: 'relative', top: -66, opacity: 0
                            }, ref: (e) => {
                                if (!e)
                                    return;
                                e.onchange = () => __awaiter(this, void 0, void 0, function* () {
                                    if (e.files[0]) {
                                        let { base64, width, height } = yield ui.imageFileToBase64(e.files[0], { width: 316, height: 184 });
                                        let { id } = yield station.saveImage(base64);
                                        this.state.bg = `${id}_${width}_${height}`;
                                        this.setState(this.state);
                                    }
                                });
                            } }))),
                h("div", null,
                    h("label", { style: { display: 'table-cell' } }, "\u4F59\u989D"),
                    h("span", { style: { display: 'table-cell' } },
                        h("input", { type: "checkbox", ref: (e) => {
                                if (!e)
                                    return;
                                e.checked = this.state.showBalance == true;
                                e.onchange = () => {
                                    this.state.showBalance = e.checked;
                                    this.setState(this.state);
                                };
                            } }),
                        "\u663E\u793A\u4F59\u989D")),
                h("div", null,
                    h("label", { style: { display: 'table-cell' } }, "\u79EF\u5206"),
                    h("span", { style: { display: 'table-cell' } },
                        h("input", { type: "checkbox", ref: (e) => {
                                if (!e)
                                    return;
                                e.checked = this.state.showScore == true;
                                e.onchange = () => {
                                    this.state.showScore = e.checked;
                                    this.setState(this.state);
                                };
                            } }),
                        "\u663E\u793A\u79EF\u5206")),
                h("div", null,
                    h("label", null, "\u9500\u552E\u5458\u4E2D\u5FC3"),
                    h("span", null,
                        h("label", null,
                            h("input", { name: "sells-center", type: "radio", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.checked = this.state.sellsCenter == 'showToMember';
                                    e.onchange = () => {
                                        this.state.sellsCenter = e.checked ? 'showToMember' : 'showToSells';
                                        this.setState(this.state);
                                    };
                                } }),
                            "\u5BF9\u6240\u6709\u4F1A\u5458\u663E\u793A"),
                        h("label", null,
                            h("input", { name: "sells-center", type: "radio", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.checked = this.state.sellsCenter == 'showToSells';
                                    e.onchange = () => {
                                        this.state.sellsCenter = e.checked ? 'showToSells' : 'showToMember';
                                        this.setState(this.state);
                                    };
                                } }),
                            "\u53EA\u5BF9\u9500\u552E\u5458\u663E\u793A")))));
        }
    }
    exports.default = MemberEditor;
});
