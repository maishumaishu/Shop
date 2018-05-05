var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/site", "myWuZhui", "dilu", "admin/services/shopping", "ui"], function (require, exports, site_1, myWuZhui_1, dilu_1, shopping_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        class Page extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
                this.dataSource = new wuzhui.DataSource({
                    primaryKeys: ['Id'],
                    select: () => shopping.categories(),
                    insert: (item) => shopping.addCategory(item),
                    update: (item) => shopping.updateCategory(item),
                    delete: (item) => shopping.deleteCategory(item.Id)
                });
                this.dataSource.selected.add((sender, args) => {
                    this.state.rows = args.dataItems;
                    this.setState(this.state);
                });
            }
            createGridView(tableElement) {
                var gridView = new wuzhui.GridView({
                    element: tableElement,
                    dataSource: this.dataSource,
                    columns: [
                        new wuzhui.CustomField({
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewDataCell({
                                    dataField: 'SortNumber',
                                    render(value) {
                                        cell.element.innerHTML = `${value + 1}`;
                                    }
                                });
                                return cell;
                            },
                            headerText: '序号',
                            headerStyle: { textAlign: 'center', width: '100px' }
                        }),
                        new wuzhui.BoundField({ dataField: 'Name', headerText: '名称', headerStyle: { textAlign: 'center' } }),
                        new wuzhui.BoundField({ dataField: 'Remark', headerText: '备注', headerStyle: { textAlign: 'center' } }),
                        new wuzhui.CustomField({
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewDataCell({
                                    dataField: 'Hidden',
                                    render(value) {
                                        if (value == true)
                                            cell.element.innerHTML = '是';
                                        else
                                            cell.element.innerHTML = '否';
                                    }
                                });
                                return cell;
                            },
                            headerText: '隐藏', headerStyle: { textAlign: 'center' },
                            itemStyle: { textAlign: 'center' }
                        }),
                        myWuZhui_1.customField({
                            headerText: '图片',
                            itemStyle: { textAlign: 'center' },
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                ReactDOM.render(h("img", { src: dataItem.ImagePath, style: { height: 36, width: 36 } }), cell.element);
                                return cell;
                            }
                        }),
                        myWuZhui_1.customField({
                            // itemEditor: null,
                            headerText: '操作',
                            headerStyle: { textAlign: 'center', width: '120px' },
                            itemStyle: { textAlign: 'center' },
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                ReactDOM.render(h(CommandCell, { category: dataItem, dataSource: gridView.dataSource }), cell.element);
                                return cell;
                            }
                        })
                    ]
                });
            }
            createValidator(formElement) {
                let { required } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(page.element, { name: "SortNumber", rules: [required()] }, { name: "Name", rules: [required()] });
            }
            save() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (!isValid) {
                        return;
                    }
                    let id = this.dialogElement['Id'].value;
                    var dataItem = {
                        SortNumber: this.dialogElement['SortNumber'].value,
                        Name: this.dialogElement['Name'].value,
                        Remark: this.dialogElement['Remark'].value,
                        ImagePath: this.dialogElement['ImagePath'].value,
                        Hidden: this.dialogElement['Hidden'].checked,
                    };
                    if (id) {
                        dataItem.Id = id;
                    }
                    let p;
                    if (id) {
                        p = this.dataSource.update(dataItem);
                    }
                    else {
                        p = this.dataSource.insert(dataItem);
                    }
                    // p.then(() => $(this.dialogElement).modal('hide'));
                    p.then(() => ui.hideDialog(this.dialogElement));
                });
            }
            add() {
                this.validator.clearErrors();
                $(this.dialogElement).find('input').val('');
                // $(this.dialogElement).modal();
                ui.showDialog(this.dialogElement);
            }
            edit(dataItem) {
                this.dialogElement['Id'].value = dataItem.Id;
                this.dialogElement['SortNumber'].value = dataItem.SortNumber;
                this.dialogElement['Name'].value = dataItem.Name;
                this.dialogElement['Remark'].value = dataItem.Remark;
                this.dialogElement['ImagePath'].value = dataItem.ImagePath;
                this.dialogElement['Hidden'].checked = dataItem.Hidden;
                // $(this.dialogElement).modal();
                ui.showDialog(this.dialogElement);
            }
            componentDidMount() {
                this.createGridView(this.tableElement);
                this.createValidator(this.dialogElement);
            }
            render() {
                var rows = this.state.rows || [];
                return (h("div", null,
                    h("div", { className: "tabbable" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "pull-right" },
                                h("button", { className: "btn btn-sm btn-primary", onClick: () => this.add() },
                                    h("i", { className: "icon-plus" }),
                                    h("span", null, "\u6DFB\u52A0"))))),
                    h("form", { name: "dlg_edit", className: "modal fade", ref: (o) => this.dialogElement = this.dialogElement || o },
                        h("input", { name: "Id", type: "hidden" }),
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u7F16\u8F91")),
                                h("div", { className: "modal-body" },
                                    h("div", { className: "form-horizontal" },
                                        h("div", { className: "form-group" },
                                            h("label", { className: "control-label col-sm-2" }, "\u5E8F\u53F7"),
                                            h("div", { className: "col-sm-10" },
                                                h("select", { name: "SortNumber", className: "form-control" },
                                                    rows.map((o, i) => (h("option", { key: i, value: `${i}` }, i + 1))),
                                                    h("option", { value: `${rows.length}` }, rows.length + 1)))),
                                        h("div", { className: "form-group" },
                                            h("label", { className: "control-label col-sm-2" }, "\u540D\u79F0"),
                                            h("div", { className: "col-sm-10" },
                                                h("input", { name: "Name", className: "form-control" }))),
                                        h("div", { className: "form-group" },
                                            h("label", { className: "control-label col-sm-2" }, "\u5907\u6CE8"),
                                            h("div", { className: "col-sm-10" },
                                                h("input", { name: "Remark", className: "form-control" }))),
                                        h("div", { className: "form-group" },
                                            h("label", { className: "control-label col-sm-2" }, "\u56FE\u7247"),
                                            h("div", { className: "col-sm-10" },
                                                h("div", { className: "input-group" },
                                                    h("span", { className: "input-group-addon" },
                                                        h("a", { href: "#", className: "fileinput-button" },
                                                            h("span", { className: "icon-upload-alt" }),
                                                            h("input", { name: "ImageUpload", type: "file", id: "ImageUpload", multiple: true }))),
                                                    h("input", { name: "ImagePath", className: "form-control" })))),
                                        h("div", { className: "form-group" },
                                            h("div", { className: "col-sm-offset-2 col-sm-10" },
                                                h("div", { className: "checkbox" },
                                                    h("label", null,
                                                        h("input", { name: "Hidden", type: "checkbox" }),
                                                        "\u5728\u524D\u53F0\u9690\u85CF\u8BE5\u7C7B\u522B")))))),
                                h("div", { className: "modal-footer", style: { marginTop: 0 } },
                                    h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                    h("button", { type: "button", className: "btn btn-primary", onClick: () => this.save() }, "\u4FDD\u5B58"))))),
                    h("table", { className: site_1.default.style.tableClassName, ref: (o) => { this.tableElement = this.tableElement || o; } })));
            }
        }
        ReactDOM.render(h(Page, null), page.element);
    }
    exports.default = default_1;
    class CommandCell extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (h("div", null,
                h("button", { className: "btn btn-minier btn-info" },
                    h("i", { className: "icon-pencil" })),
                h("button", { className: "btn btn-minier btn-danger", ref: (e) => {
                        if (!e)
                            return;
                        e.onclick = ui.buttonOnClick(() => {
                            return this.props.dataSource.delete(this.props.category);
                        }, { confirm: `确定要删除品类'${this.props.category.Name}'吗` });
                    } },
                    h("i", { className: "icon-trash" }))));
        }
    }
});
