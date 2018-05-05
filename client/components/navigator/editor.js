var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/editor", "dilu", "user/services/stationService", "admin/services/station", "admin/application", "../../admin/siteMap", "../../admin/controls/pageSelectDialog", "wuzhui"], function (require, exports, editor_1, dilu_1, stationService_1, station_1, application_1, siteMap_1, pageSelectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NavigatorEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.loadEditorCSS();
        }
        showDialog(item) {
            this.editItem = item;
            this.validator.clearErrors();
            if (item) {
                this.value('name', item.name);
                this.value('pageId', item.pageId);
                this.value('pageName', item.pageName);
            }
            else {
                this.value('name', '');
                this.value('pageId', '');
                this.value('pageName', '');
            }
            ui.showDialog(this.dialog, (button) => __awaiter(this, void 0, void 0, function* () {
                if (button.name != 'ok')
                    return;
                this.validator.clearErrors();
                let isVaid = yield this.validator.check();
                if (!isVaid) {
                    return Promise.resolve('validate fail');
                }
                if (item == null)
                    this.addItem();
                else
                    this.updateItem(item);
                ui.hideDialog(this.dialog);
            }));
        }
        addItem() {
            return __awaiter(this, void 0, void 0, function* () {
                let name = this.value('name');
                let pageId = this.value('pageId');
                let pageName = this.value('pageName');
                this.state.items.push({ name, pageId });
                this.setState(this.state);
                ui.hideDialog(this.dialog);
            });
        }
        updateItem(item) {
            let name = this.value('name');
            let pageId = this.value('pageId');
            let pageName = this.value('pageName');
            Object.assign(item, { name, pageId, pageName });
            this.setState(this.state);
        }
        removeItem(item) {
            this.state.items = this.state.items.filter(o => o != item);
            this.setState(this.state);
            return Promise.resolve();
        }
        value(name, value) {
            let element = this.dialog.querySelector(`[name="${name}"]`);
            if (element == null)
                throw new Error(`Element ${name} not exists.`);
            if (value != null) {
                element.value = value;
            }
            return element.value;
        }
        showPageSelectDialog() {
            this.pageSelectDialog.show((item) => {
                if (this.editItem) {
                    this.value('pageName', item.name);
                    this.value('pageId', item.id);
                }
            });
        }
        componentDidMount() {
            this.validator = new dilu_1.FormValidator(this.dialog, { name: 'pageId', rules: [dilu_1.rules.required('请选择页面')] });
            this.bindInputElement(this.marginTopElement, 'marginTop');
            this.bindInputElement(this.marginBootomElement, 'marginBottom');
        }
        render() {
            let { items } = this.state;
            let station = this.props.elementPage.createService(station_1.StationService);
            return [
                h("div", { key: "form", className: "form-horizontal" },
                    h("div", { className: "form-group" },
                        h("label", { className: "col-sm-2" }, "\u8FB9\u8DDD"),
                        h("div", { className: "col-sm-5" },
                            h("div", { className: "input-group" },
                                h("input", { className: "form-control", placeholder: "导航栏的上边距", ref: (e) => this.marginTopElement = e || this.marginTopElement }),
                                h("span", { className: "input-group-addon" }, "px"))),
                        h("div", { className: "col-sm-5" },
                            h("div", { className: "input-group" },
                                h("input", { className: "form-control", placeholder: "导航栏的下边距", ref: (e) => this.marginBootomElement = e || this.marginBootomElement }),
                                h("span", { className: "input-group-addon" }, "px"))))),
                h("ul", { key: "items" }, items.length > 0 ?
                    items.map((o, i) => h("li", { key: i },
                        h("div", { className: "name" }, o.name),
                        h("div", { className: "page-name btn-link", onClick: () => null, title: "点击修改导航页面", ref: (e) => __awaiter(this, void 0, void 0, function* () {
                                if (!e)
                                    return;
                                let station = this.elementPage.createService(stationService_1.StationService);
                                if (!o.pageId)
                                    return;
                                let pageData = yield station.pages.pageDataById(o.pageId);
                                if (pageData != null) {
                                    e.innerHTML = pageData.name;
                                }
                                e.onclick = () => {
                                    application_1.default.redirect(siteMap_1.siteMap.nodes.station_page, { pageId: o.pageId });
                                };
                            }) }, o.pageId),
                        h("button", { className: "btn-link pull-right", type: "button", ref: (e) => e ?
                                ui.buttonOnClick(e, () => this.removeItem(o), { confirm: `确定要删除"${o.name}"吗` }) : null }, "\u5220\u9664"),
                        h("button", { className: "btn-link pull-right", type: "button", onClick: () => this.showDialog(o) }, "\u7F16\u8F91"),
                        h("div", { className: "clearfix" }))) :
                    h("li", { className: "text-center no-records" }, "\u6682\u65E0\u6570\u636E,\u70B9\u51FB\"\u6DFB\u52A0\u5BFC\u822A\u83DC\u5355\u9879\"\u6309\u94AE\u6DFB\u52A0")),
                h("div", { key: "button", className: "text-center" },
                    h("button", { className: "btn btn-primary", onClick: () => this.showDialog() }, "\u6DFB\u52A0\u5BFC\u822A\u83DC\u5355\u9879")),
                h("div", { key: "dialog", className: "modal fade", ref: (e) => this.dialog = e || this.dialog },
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(this.dialog) },
                                    h("span", { "aria-hidden": "true" }, "\u00D7")),
                                h("h4", { className: "modal-title" }, "\u5BFC\u822A\u83DC\u5355\u9879")),
                            h("div", { className: "modal-body form-horizontal" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-lg-3 control-label" }, "\u540D\u79F0"),
                                    h("div", { className: "col-lg-9" },
                                        h("input", { name: "name", type: "text", className: "form-control", placeholder: "请输名称" }))),
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-lg-3 control-label" }, "\u663E\u793A\u9875\u9762"),
                                    h("div", { className: "col-lg-9" },
                                        h("div", { className: "input-group" },
                                            h("input", { name: "pageName", type: "text", className: "form-control", placeholder: "请选择要显示的页面", readOnly: true }),
                                            h("span", { className: "input-group-addon" },
                                                h("i", { className: " icon-cog", style: { cursor: 'pointer' }, onClick: () => this.showPageSelectDialog() }))),
                                        h("input", { name: "pageId", type: "hidden", className: "form-control", placeholder: "pageId" })))),
                            h("div", { className: "modal-footer" },
                                h("button", { name: "cancel", type: "button", className: "btn btn-default", onClick: () => ui.hideDialog(this.dialog) }, "\u53D6\u6D88"),
                                h("button", { name: "ok", type: "button", className: "btn btn-primary" }, "\u786E\u5B9A"))))),
                ReactDOM.createPortal([
                    h(pageSelectDialog_1.PageSelectDialog, { key: "pageSelectDialog", station: station, ref: (e) => this.pageSelectDialog = e || this.pageSelectDialog })
                ], document.body)
            ];
        }
    }
    exports.default = NavigatorEditor;
});
