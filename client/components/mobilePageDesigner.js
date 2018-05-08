var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/componentDefines", "components/virtualMobile", "components/mobilePage", "components/designTimeUserApplication", "components/editor", "user/site", "user/application", "prop-types", "dilu", "ui", "jquery-ui"], function (require, exports, componentDefines_1, virtualMobile_1, mobilePage_1, designTimeUserApplication_1, editor_1, site_1, application_1, prop_types_1, dilu_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MobilePageDesigner extends React.Component {
        constructor(props) {
            super(props);
            this.hasChanged = false;
            this.editors = new Array();
            if (this.props.pageData == null)
                throw new Error("Property of pageData cannt be null.");
            let pageData = JSON.parse(JSON.stringify(this.props.pageData));
            // if (!pageData.footer)
            //     pageData.footer = { controls: [] };
            // console.assert(pageData.footer.controls != null, 'footer controls is null.');
            this.state = { editors: [], pageData };
            let existsStyleControl = pageData.controls.filter(o => o.controlName == 'style').length > 0;
            console.assert(!existsStyleControl);
            // if (!existsStyleControl) {
            //     this.props.pageDatas.style().then(stylePageData => {
            //         let styleControl = stylePageData.controls[0];
            //         console.assert(styleControl != null && styleControl.controlName == 'style');
            //         styleControl.selected = 'disabled';
            //         this.state.pageData.controls.push(styleControl);
            //         this.setState(this.state);
            //     })
            // }
            let existsMenuControl = pageData.controls.filter(o => o.controlName == 'menu').length > 0;
            if (!existsMenuControl && pageData.showMenu) {
                this.loadMenu();
            }
            this.saved = chitu.Callbacks();
        }
        loadMenu() {
            return __awaiter(this, void 0, void 0, function* () {
                let menuPageData = yield this.props.pageDatas.menu();
                let menuControlData = menuPageData.controls.filter(o => o.controlName == 'menu')[0];
                console.assert(menuControlData != null);
                menuControlData.selected = 'disabled';
                this.state.pageData.controls.push(menuControlData);
                this.setState(this.state);
            });
        }
        unloadMenu() {
            var controls = this.state.pageData.controls.filter(o => o.controlName != 'menu');
            this.state.pageData.controls = controls;
            this.setState(this.state);
        }
        getChildContext() {
            return { designer: this };
        }
        get element() {
            return this._element;
        }
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.validator != null) {
                    this.validator.clearErrors();
                    let isValid = yield this.validator.check();
                    if (!isValid) {
                        return Promise.reject('validate fail');
                    }
                }
                for (let i = 0; i < this.editors.length; i++) {
                    if (this.editors[i].validate) {
                        let result = yield this.editors[i].validate();
                        if (!result) {
                            this.selecteControl(this.editors[i].props.control);
                            return Promise.reject(`Editor validate fail`);
                        }
                    }
                }
                let pageData = this.state.pageData;
                pageData.name = this.nameInput.value;
                // if (pageData.view && pageData.view.controls)
                //     setControlValues(this.mobilePage, pageData.view.controls);
                // if (pageData.header && pageData.header.controls) {
                //     setControlValues(this.mobilePage, pageData.header.controls);
                // }
                // if (pageData.footer && pageData.footer.controls) {
                //     setControlValues(this.mobilePage, pageData.footer.controls);
                // }
                setControlValues(this.mobilePage, pageData.controls);
                /**
                 * 件页面上控件的值，写进 pageData
                 */
                function setControlValues(mobilePage, controls) {
                    for (let i = 0; i < controls.length; i++) {
                        let componet = (mobilePage.controls.filter(c => c.controlId == controls[i].controlId)[0]);
                        console.assert(componet != null);
                        let keys = componet.persistentMembers || [];
                        let data = {};
                        for (let i = 0; i < keys.length; i++) {
                            let key = keys[i];
                            data[key] = componet.state[key];
                        }
                        controls[i].data = data;
                    }
                }
                let save = this.props.save;
                return save(pageData).then(data => {
                    this.saved.fire(this, { pageData });
                    this.hasChanged = false;
                    return data;
                });
            });
        }
        selecteControl(control) {
            console.assert(control.id != null);
            let controlName = control.controlName;
            let editorPathName = editor_1.Editor.path(controlName);
            let editorId = `editor-${control.id}`;
            let editorElement = this.editorsElement.querySelector(`[id='${editorId}']`);
            console.assert(editorElement != null);
            this.selectedControlId = control.id;
            this.editorName =
                componentDefines_1.default.filter(o => o.name == controlName).map(o => o.displayName)[0] || controlName;
            if (this.editorNameElement)
                this.editorNameElement.innerHTML = this.editorName;
            if (this.currentEditor == editorElement && editorElement != null) {
                return;
            }
            if (this.currentEditor)
                this.currentEditor.style.display = 'none';
            editorElement.style.display = 'block';
            // if (this.currentEditor)
            //     this.currentEditor.style.display = 'none';
            this.currentEditor = editorElement;
        }
        loadControlEditor(control) {
            // if (!control.id)
            //     control.id = guid();
            console.assert(control.id != null && control.id != '');
            if (!control.hasEditor) {
                return;
            }
            let controlName = control.controlName;
            let editorPathName = editor_1.Editor.path(controlName);
            let editorId = `editor-${control.id}`;
            let editorElement = this.editorsElement.querySelector(`[id='${editorId}']`);
            if (editorElement != null) {
                return;
            }
            editorElement = document.createElement('div');
            editorElement.className = `${controlName}-editor`;
            editorElement.id = editorId;
            editorElement.style.display = 'none';
            this.editorsElement.appendChild(editorElement);
            requirejs([editorPathName], (exports) => {
                let editorType = exports.default;
                console.assert(editorType != null, 'editor type is null');
                console.assert(control.elementPage != null, 'element page is null');
                let editorReactElement = React.createElement(editorType, { control, elementPage: control.elementPage });
                let editor = ReactDOM.render(editorReactElement, editorElement);
                this.editors.push(editor);
                control.stateChanged.add(() => {
                    this.hasChanged = true;
                });
            });
        }
        removeControl(controlId) {
            let pageData = this.state.pageData;
            // if (pageData.header != null && pageData.header.controls) {
            //     pageData.header.controls = pageData.header.controls.filter(o => o.controlId != controlId);
            // }
            // if (pageData.view != null) {
            //     pageData.view.controls = pageData.view.controls.filter(o => o.controlId != controlId);
            // }
            // if (pageData.footer != null && pageData.footer.controls != null) {
            //     pageData.footer.controls = pageData.footer.controls.filter(o => o.controlId != controlId);
            // }
            pageData.controls = pageData.controls.filter(o => o.controlId != controlId);
            this.setState(this.state);
            return Promise.resolve();
        }
        preview() {
            let { pageData } = this.state;
            console.assert(pageData != null);
            if (this.hasChanged || !pageData.id) {
                ui.alert({ title: '提示', message: `预览前必须先保存页面, 请点击"保存"按钮保存页面` });
                return;
            }
            let url = application_1.app.createUrl(site_1.siteMap.nodes.page, { pageId: pageData.id });
            open(url, '_blank');
        }
        renederVirtualMobile(screenElement, pageData) {
            console.assert(screenElement != null);
            if (this.userApp == null) {
                this.userApp = new designTimeUserApplication_1.DesignTimeUserApplication(screenElement);
                this.userApp.designPageNode.action = (page) => {
                    ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page, ref: (e) => this.mobilePage = e || this.mobilePage, controlCreated: (c) => {
                            this.loadControlEditor(c);
                        }, designTime: {
                            controlSelected: (a, b) => {
                                let controlName = a.controlName;
                                console.assert(controlName != null);
                                this.selecteControl(a);
                            }
                        } }), page.element);
                    $(this.allContainer).find('li').draggable({
                        connectToSortable: $(page.element).find("section"),
                        helper: "clone",
                        revert: "invalid"
                    });
                };
                this.userApp.showDesignPage();
            }
            else {
                this.userApp.currentPage.reload();
            }
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.props.showPageEditor) {
                    this.validator = new dilu_1.FormValidator(this.form, { name: 'name', rules: [dilu_1.rules.required('请输入页面名称')] });
                }
            });
        }
        render() {
            let h = React.createElement;
            let children = (React.Children.toArray(this.props.children) || []);
            let { pageData } = this.state;
            let { showComponentPanel, buttons } = this.props;
            buttons = buttons || [];
            return (h("div", { ref: (e) => this._element = e || this._element },
                h("div", { style: { position: 'absolute' } },
                    h(virtualMobile_1.VirtualMobile, { ref: (e) => {
                            this.virtualMobile = e || this.virtualMobile;
                            setTimeout(() => {
                                this.renederVirtualMobile(this.virtualMobile.screenElement, pageData);
                            }, 100);
                        } }, children)),
                h("div", { style: { paddingLeft: 390 } },
                    h("ul", { style: { margin: 0 } },
                        this.props.showMenuSwitch ? h("li", { className: "pull-left" },
                            h("div", { className: "pull-left", style: { paddingTop: 4, paddingRight: 10 } }, "\u663E\u793A\u5BFC\u822A\u83DC\u5355"),
                            h("label", { className: "pull-left switch" },
                                h("input", { type: "checkbox", className: "ace ace-switch ace-switch-5", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.checked = pageData.showMenu;
                                        e.onchange = () => __awaiter(this, void 0, void 0, function* () {
                                            this.props.pageData.showMenu = pageData.showMenu = e.checked;
                                            if (e.checked)
                                                this.loadMenu();
                                            else
                                                this.unloadMenu();
                                        });
                                    } }),
                                h("span", { className: "lbl middle" }))) : null,
                        h("li", { className: "pull-right" },
                            h("button", { className: "btn btn-sm btn-primary", onClick: () => this.preview() },
                                h("i", { className: "icon-eye-open" }),
                                h("span", null, "\u9884\u89C8")),
                            h("button", { className: "btn btn-sm btn-primary", ref: (e) => e != null ? ui.buttonOnClick(e, () => this.save(), { toast: '保存页面成功' }) : null },
                                h("i", { className: "icon-save" }),
                                h("span", null, "\u4FDD\u5B58")),
                            buttons),
                        h("li", { className: "clearfix" })),
                    h("div", { className: "clear-fix" }),
                    h("hr", { style: { margin: 0 } }),
                    h("div", { className: "form-group", ref: (e) => this.form = e || this.form, style: { height: 40, display: this.props.showPageEditor == true ? 'block' : 'none', marginTop: 20 } },
                        h("div", { className: "row" },
                            h("div", { className: "col-sm-4" },
                                h("label", { className: "control-label pull-left", style: { paddingTop: 8 } }, "\u540D\u79F0"),
                                h("div", { style: { paddingLeft: 40 } },
                                    h("input", { name: "name", className: "form-control", placeholder: "请输入页面名称（必填）", ref: (e) => {
                                            this.nameInput = e || this.nameInput;
                                            this.nameInput.value = pageData.name || '';
                                        } }))),
                            h("div", { className: "col-sm-8" },
                                h("label", { className: "control-label pull-left", style: { paddingTop: 8 } }, "\u5907\u6CE8"),
                                h("div", { style: { paddingLeft: 40 } },
                                    h("input", { name: "remark", className: "form-control pull-left", placeholder: "请输入页面备注（选填）", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.value = pageData.remark || '';
                                            e.onchange = () => {
                                                pageData.remark = e.value;
                                            };
                                        } }))))),
                    h("div", { className: "form-group" },
                        h("hr", { style: { display: this.props.showPageEditor == true ? 'block' : 'none' } }),
                        h("h5", { style: { display: showComponentPanel == true ? 'block' : 'none' } }, "\u9875\u9762\u7EC4\u4EF6"),
                        h("ul", { ref: (e) => this.allContainer = e || this.allContainer, style: {
                                padding: 0, listStyle: 'none',
                                display: showComponentPanel == true ? 'block' : 'none'
                            } },
                            componentDefines_1.default.filter(o => o.visible != false).map((c, i) => h("li", { key: c.name, "data-control-name": c.name, "data-target": c.target, style: {
                                    float: 'left', height: 80, width: 80, border: 'solid 1px #ccc', marginLeft: 4,
                                    textAlign: 'center', paddingTop: 8, backgroundColor: 'white', zIndex: 100
                                } },
                                h("div", { className: "btn-link" },
                                    h("i", { className: c.icon, style: { fontSize: 44, color: 'black' } })),
                                h("div", null, c.displayName))),
                            h("li", { className: "clearfix" }))),
                    showComponentPanel ?
                        h("div", { className: "form-group" },
                            h("div", { className: "well" },
                                h("i", { className: "icon-remove", style: { cursor: 'pointer' }, ref: (e) => {
                                        if (e == null)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.removeControl(this.selectedControlId), {
                                            confirm: () => {
                                                return `确定要移除控件'${this.editorNameElement.innerHTML}'吗？`;
                                            }
                                        });
                                    } }),
                                h("span", { style: { paddingLeft: 8 }, ref: (e) => this.editorNameElement = e || this.editorNameElement }),
                                h("hr", { style: { marginTop: 14 } }),
                                h("div", { ref: (e) => this.editorsElement = e || this.editorsElement }))) :
                        h("div", { ref: (e) => this.editorsElement = e || this.editorsElement })),
                h("div", { className: "clearfix" })));
        }
    }
    MobilePageDesigner.childContextTypes = { designer: prop_types_1.PropTypes.object };
    exports.MobilePageDesigner = MobilePageDesigner;
});
