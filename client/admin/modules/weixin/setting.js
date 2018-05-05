var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/weixin"], function (require, exports, weixin_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const label_max_width = 120;
    const input_max_width = 300;
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let weixin = page.createService(weixin_1.WeiXinService);
            class SettingPage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { setting: this.props.setting };
                }
                save() {
                    return weixin.saveSetting(this.state.setting);
                }
                render() {
                    let setting = this.state.setting;
                    return [
                        h("ul", { key: 10, className: "nav nav-tabs" },
                            h("li", { className: "pull-right" },
                                h("button", { className: "btn btn-primary btn-sm", ref: (e) => {
                                        if (!e)
                                            return;
                                        ui.buttonOnClick(e, () => this.save(), {});
                                    } },
                                    h("i", { className: "icon-save" }),
                                    h("span", null, "\u4FDD\u5B58")))),
                        h("div", { key: 20, className: "well" },
                            h("div", { className: "row form-group" },
                                h("label", { className: "col-md-4", style: { width: label_max_width } }, "AppId"),
                                h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                    h("input", { name: "AppId", className: "form-control", value: setting.AppId || '', readOnly: true, onChange: (e) => {
                                            setting.AppId = e.target.value;
                                            this.setState(this.state);
                                        } }))),
                            h("div", { className: "row form-group" },
                                h("label", { className: "col-md-4", style: { width: label_max_width } }, "AppSecret"),
                                h("div", { className: "col-md-8", style: { maxWidth: input_max_width } },
                                    h("input", { name: "AppSecret", className: "form-control", value: setting.AppSecret || '', readOnly: true, onChange: (e) => {
                                            setting.AppSecret = e.target.value;
                                            this.setState(this.state);
                                        } })))),
                    ];
                }
            }
            let setting = yield weixin.getSetting();
            ReactDOM.render(h(SettingPage, { setting: setting }), page.element);
        });
    }
    exports.default = default_1;
});
