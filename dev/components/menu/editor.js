var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/editor", "dilu"], function (require, exports, editor_1, dilu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['css!components/menu/editor.css']);
    let h = React.createElement;
    // let station = new StationService();
    let links = [
        { text: '请选择链接', url: '' },
        { text: '店铺主页', url: '#home_index' },
        { text: '购物车', url: '#shopping_shoppingCart' },
        { text: '会员主页', url: '#user_index' },
        { text: '商品类别', url: '#home_class' }
    ];
    let icons = [
        "icon-home", "icon-shopping-cart", "icon-user", "icon-comment",
        "icon-rss", "icon-truck", "icon-reorder", "icon-calendar",
        "icon-th-large"
    ];
    class MenuEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.state = { currentItem: {} };
        }
        editItem(menuItem) {
            this.state.currentItem = menuItem;
            this.setState(this.state);
            this.validator.clearErrors();
            ui.showDialog(this.itemDialogELement);
        }
        deleteItem(menuItem) {
            let menuNodes = this.state.menuNodes.filter(o => o != menuItem);
            this.state.menuNodes = menuNodes;
            this.setState(this.state);
            return Promise.resolve();
        }
        newItem() {
            this.state.currentItem = { url: '' };
            this.setState(this.state);
            this.validator.clearErrors();
            ui.showDialog(this.itemDialogELement);
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                let isValid = yield this.validator.check();
                if (!isValid) {
                    return;
                }
                let currentItem = this.state.currentItem;
                if (this.state.menuNodes.indexOf(currentItem) < 0) {
                    this.state.menuNodes.push(currentItem);
                }
                this.setState(this.state);
                ui.hideDialog(this.itemDialogELement);
                return Promise.resolve();
            });
        }
        isCustomUrl() {
            if (this.state.currentItem == null)
                return false;
            let currentUrl = this.state.currentItem.url;
            let containsUrl = links.map(o => o.url).indexOf(currentUrl) >= 0;
            return !(containsUrl);
        }
        linkName(url) {
            let link = links.filter(o => o.url == url)[0];
            return link ? link.text : '';
        }
        toggleDisplayIcon() {
            this.state.showIcon = this.state.showIcon ? false : true;
            this.setState(this.state);
        }
        toggleIconsPanel() {
            this.iconsElement.style.display ?
                this.iconsElement.style.removeProperty('display') :
                this.iconsElement.style.display = 'none';
        }
        componentDidMount() {
            let { required } = dilu_1.rules;
            this.validator = new dilu_1.FormValidator(this.itemDialogELement, { name: "name", rules: [required()] }, { name: "url", rules: [required()], condition: () => this.isCustomUrl() });
        }
        render() {
            let menuNodes = this.state.menuNodes || [];
            menuNodes.sort((a, b) => {
                return (a.sortNumber || 0) - (b.sortNumber || 0);
            });
            let currentItem = this.state.currentItem;
            return (h("div", { className: "menuEditor" },
                h("div", { className: "menu-apply" },
                    h("div", { className: "pull-left" },
                        h("label", { className: "pull-right" },
                            h("input", { type: "checkbox", className: "ace ace-switch ace-switch-5", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.checked = this.state.showIcon;
                                    e.onchange = () => {
                                        this.toggleDisplayIcon();
                                    };
                                } }),
                            h("span", { className: "lbl middle" })),
                        h("div", { className: "pull-right", style: { padding: '4px 10px 0 0' } }, "\u83DC\u5355\u9879\u663E\u793A\u56FE\u6807")),
                    h("div", { className: "clear-fix" })),
                h("ul", { className: "menu" },
                    menuNodes.map((o, i) => h("li", { key: i },
                        h("div", { className: "pull-left", style: { width: 60 } }, o.sortNumber),
                        h("div", { className: "pull-left", style: { width: 100 } }, o.name),
                        h("div", { className: "pull-left" },
                            o.url,
                            " ",
                            this.linkName(o.url) ? `(${this.linkName(o.url)})` : ''),
                        h("div", { className: "pull-right" },
                            h("button", { className: "btn btn-danger btn-sm pull-right", style: { marginLeft: 4 }, ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = ui.buttonOnClick(() => this.deleteItem(o), { confirm: `确定要删除菜单项 "${o.name}" 吗?` });
                                } },
                                h("i", { className: "icon-remove" }),
                                h("span", { style: { paddingLeft: 4 } }, "\u5220\u9664")),
                            h("button", { className: "btn btn-info btn-sm pull-right", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = () => this.editItem(o);
                                } },
                                h("i", { className: "icon-pencil" }),
                                h("span", { style: { paddingLeft: 4 } }, "\u4FEE\u6539"))),
                        h("div", { className: "clearfix" }))),
                    h("li", { onClick: () => ui.showDialog(this.itemDialogELement) },
                        h("button", { className: "btn btn-primary", onClick: (e) => {
                                this.newItem();
                            } },
                            h("i", { className: "icon-plus" }),
                            "\u70B9\u51FB\u6DFB\u52A0\u83DC\u5355\u9879"))),
                h("div", { className: "modal fade", ref: (e) => {
                        if (!e)
                            return;
                        this.itemDialogELement = e;
                    } },
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7"),
                                    h("span", { className: "sr-only" }, "Close")),
                                h("h4", { className: "modal-title" }, "\u6DFB\u52A0\u83DC\u5355\u9879")),
                            h("div", { className: "modal-body form-horizontal" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2 control-label" }, "\u540D\u79F0*"),
                                    h("div", { className: "col-sm-10" },
                                        h("input", { name: "name", type: "text", className: "form-control", placeholder: "请输入菜单项名称", ref: (e) => {
                                                if (!e)
                                                    return;
                                                this.nameInput = e || this.nameInput;
                                                e.value = currentItem.name || '';
                                                e.onchange = () => {
                                                    currentItem.name = e.value;
                                                };
                                            } }))),
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2 control-label" }, "\u5E8F\u53F7"),
                                    h("div", { className: "col-sm-10" },
                                        h("input", { name: "sortNumber", type: "text", className: "form-control", placeholder: "请输入菜单项序号", ref: (e) => {
                                                if (!e)
                                                    return;
                                                { }
                                                e.value = currentItem.sortNumber || '';
                                                e.onchange = () => {
                                                    currentItem.sortNumber = Number.parseInt(e.value);
                                                };
                                            } }))),
                                this.state.showIcon ?
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u56FE\u6807"),
                                        h("div", { className: "col-sm-10" },
                                            h("div", { className: "input-group" },
                                                h("input", { name: "icon", type: "text", className: "form-control", placeholder: "请输入菜单项图标", ref: (e) => {
                                                        if (!e)
                                                            return;
                                                        e.value = currentItem.icon || '';
                                                        e.onchange = () => {
                                                            currentItem.icon = e.value;
                                                        };
                                                    } }),
                                                h("div", { className: "input-group-addon", onClick: () => this.toggleIconsPanel() },
                                                    h("i", { className: "icon-cog", style: { cursor: 'pointer' } })),
                                                h("div", { ref: (e) => this.iconsElement = e || this.iconsElement, style: {
                                                        position: 'absolute', height: 100, width: '100%', background: 'white',
                                                        zIndex: 10, left: 0, top: 35, border: 'solid 1px #ccc', overflowY: 'auto',
                                                        display: 'none'
                                                    } },
                                                    h("div", { style: { position: 'absolute', width: '100%', borderBottom: 'solid 1px #ccc', padding: '4px 6px', background: 'white' } },
                                                        h("span", null, "\u8BF7\u9009\u62E9\u56FE\u6807"),
                                                        h("i", { className: "icon-remove", style: { position: 'absolute', right: 6, top: 6 }, onClick: () => this.toggleIconsPanel() })),
                                                    h("div", { style: { padding: '30px 6px 6px 6px' } }, icons.map(o => h("i", { key: o, className: o, style: { display: 'table-cell', padding: 10, fontSize: 20 }, onClick: () => {
                                                            currentItem.icon = o;
                                                            this.toggleIconsPanel();
                                                            this.setState(this.state);
                                                        } }))))))) : null,
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2 control-label" }, "\u94FE\u63A5*"),
                                    h("div", { className: "col-sm-10" },
                                        h("input", { name: "url", className: "form-control", style: { display: this.isCustomUrl() ? null : 'none' }, ref: (e) => {
                                                if (!e)
                                                    return;
                                                this.urlInput = e;
                                                e.value = currentItem.url || '';
                                                e.onchange = () => {
                                                    currentItem.url = e.value;
                                                };
                                            } }),
                                        h("select", { className: "form-control", style: { display: this.isCustomUrl() ? 'none' : null }, ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.value = currentItem.url;
                                                e.onchange = () => {
                                                    let option = e.options[e.selectedIndex];
                                                    currentItem.url = option.value;
                                                };
                                            } }, links.map((o, i) => h("option", { key: i, value: o.url }, o.text))))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-sm-offset-2 col-sm-10" },
                                        h("input", { type: "checkbox", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.value = currentItem.url || '';
                                                e.checked = this.isCustomUrl();
                                                e.onchange = () => {
                                                    if (e.checked) {
                                                        this.state.currentItem.url = null;
                                                        this.setState(this.state);
                                                    }
                                                    else {
                                                        this.state.currentItem.url = '';
                                                        this.setState(this.state);
                                                    }
                                                };
                                            } }),
                                        " \u81EA\u5B9A\u4E49\u94FE\u63A5"))),
                            h("div", { className: "modal-footer" },
                                h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                h("button", { type: "button", className: "btn btn-primary", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.save());
                                    } }, "\u786E\u5B9A")))))));
        }
    }
    exports.default = MenuEditor;
});
