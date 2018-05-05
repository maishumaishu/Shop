var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/user", "admin/site", "admin/siteMap", "dilu", "ui"], function (require, exports, user_1, site_1, siteMap_1, dilu_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            // requirejs([`css!${page.name}.css`]);
            site_1.app.loadCSS(page.name);
            let userService = page.createService(user_1.UserService);
            let apps = yield userService.applications();
            class MyStoresPage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { stores: apps };
                }
                componentDidMount() {
                    // this.validator = new FormValidator(this.dialogElement, {
                    //     name: { rules: ['required'], display: '店铺名称' }
                    // })
                    let nameElement = this.dialogElement.querySelector('[name="name"]');
                    this.validator = new dilu_1.FormValidator(this.dialogElement, { name: "name", rules: [dilu_1.rules.required('店铺名称')] });
                }
                save(app) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let isValid = yield this.validator.check();
                        if (!isValid) {
                            return Promise.resolve();
                        }
                        let p;
                        if (!app.Id) {
                            p = userService.addApplication(app).then(data => {
                                this.state.stores.push(app);
                            });
                        }
                        else {
                            p = userService.updateApplication(app).then(data => {
                                this.setState(this.state);
                            });
                        }
                        p.then(() => {
                            ui.hideDialog(this.dialogElement);
                            this.setState(this.state);
                        });
                        return p;
                    });
                }
                delete(app) {
                    return userService.deleteApplication(app).then(data => {
                        this.state.stores = this.state.stores.filter(o => o != app);
                        this.setState(this.state);
                        return data;
                    });
                }
                showDialog(app) {
                    let msg = app.Id == null ? '创建店铺成功' : '更新店铺成功';
                    ReactDOM.render(h("div", { className: "modal-dialog", role: "document" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7")),
                                h("h4", { className: "modal-title" }, "\u521B\u5EFA\u5E97\u94FA")),
                            h("div", { className: "modal-body form-horizontal" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2" }, "\u540D\u79F0"),
                                    h("div", { className: "col-sm-10" },
                                        h("input", { name: "name", type: "text", className: "form-control", autoFocus: true, ref: (e) => {
                                                if (!e)
                                                    return;
                                                this.nameInput = e;
                                                e.value = app.Name || '';
                                            } })))),
                            h("div", { className: "modal-footer" },
                                h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = () => ui.hideDialog(this.dialogElement);
                                    } }, "\u53D6\u6D88"),
                                h("button", { type: "button", className: "btn btn-primary", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => {
                                            app.Name = this.nameInput.value;
                                            return this.save(app);
                                        }, { toast: msg });
                                    } }, "\u786E\u5B9A")))), this.dialogElement);
                    ui.showDialog(this.dialogElement);
                }
                edit(app) {
                    this.nameInput.value = app.Name;
                    ui.showDialog(this.dialogElement);
                }
                render() {
                    let stores = this.state.stores || [];
                    return (h("div", null,
                        h("div", { className: "modal fade", role: "dialog", ref: (e) => this.dialogElement = e || this.dialogElement }),
                        h("ul", null,
                            stores.map(o => h("li", { key: o.Id },
                                h("div", { className: "header" },
                                    h("p", null,
                                        h("span", { className: "smaller lighter green interception" }, o.Name),
                                        h("i", { className: "icon-remove pull-right", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => this.delete(o), { confirm: `你确定要删除店铺'${o.Name}'?` });
                                            } }))),
                                h("div", { className: "body" },
                                    h("div", null,
                                        h("div", { className: "pull-left" }, "\u540D\u79F0"),
                                        h("div", { className: "text interception" }, o.Name))),
                                h("div", { className: "footer" },
                                    h("div", { className: "col-xs-6" },
                                        h("button", { className: "btn btn-primary btn-block", onClick: () => this.showDialog(o) }, "\u7F16\u8F91")),
                                    h("div", { className: "col-xs-6" },
                                        h("button", { className: "btn btn-success btn-block", onClick: () => {
                                                let pageName = siteMap_1.siteMap.nodes.home_index.name;
                                                console.assert(pageName != null);
                                                location.href = `?appKey=${o.Id}#${pageName}`;
                                            } }, "\u8FDB\u5165"))))),
                            h("li", null,
                                h("div", { className: "header" },
                                    h("p", { className: "smaller lighter green" }, "\u521B\u5EFA\u5E97\u94FA")),
                                h("div", { onClick: () => this.showDialog({}), className: "add" },
                                    h("i", { className: "icon-plus", style: { fontSize: 120 } }))))));
                }
            }
            ReactDOM.render(h(MyStoresPage, null), page.element);
        });
    }
    exports.default = default_1;
});
