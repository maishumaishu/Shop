define(["require", "exports", "admin/services/shopping", "myWuZhui"], function (require, exports, shopping_1, wz) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        class Page extends React.Component {
            constructor(props) {
                super(props);
            }
            componentDidMount() {
                let dataSource = this.dataSource = new wuzhui.DataSource({
                    select: () => shopping.freightSolutions(),
                    delete: (dataItem) => shopping.deleteFreightSolution(dataItem),
                    update: (dataItem) => shopping.updateFreightSolution(dataItem),
                    primaryKeys: ['Id']
                });
                let it = this;
                let gridView = wz.createGridView({
                    element: this.gridViewElement,
                    columns: [
                        new wz.BoundField({
                            dataField: 'Id', headerText: '编号',
                            headerStyle: { width: '300px' }
                        }),
                        new wz.BoundField({
                            dataField: 'Name', headerText: '名称',
                        }),
                        new wz.CustomField({
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                ReactDOM.render(h("div", null,
                                    h("button", { className: "btn btn-info btn-minier", style: { marginRight: 4 }, onClick: () => it.showDialog(dataItem) },
                                        h("i", { className: "icon-pencil" })),
                                    h("button", { className: "btn btn-minier btn-danger", style: { marginRight: 4 }, ref: (e) => {
                                            if (!e)
                                                return;
                                            e.onclick = ui.buttonOnClick(() => dataSource.delete(dataItem), { confirm: `确定要删除'${dataItem.Name}'运费方案吗` });
                                        } },
                                        h("i", { className: "icon-trash" })),
                                    h("a", { className: "btn btn-info btn-minier", style: { marginRight: 4 }, href: `#freight/freightList?id=${dataItem.Id}&name=${encodeURI(dataItem.Name)}` }, "\u8BBE\u7F6E\u8FD0\u8D39")), cell.element);
                                return cell;
                            },
                            headerText: '操作',
                            headerStyle: { width: '180px' },
                            itemStyle: { textAlign: 'center' },
                        })
                    ],
                    dataSource,
                    pageSize: null
                });
            }
            showDialog(dataItem) {
                let name = dataItem.Name;
                ReactDOM.render(h("div", { className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                h("span", { "aria-hidden": "true" }, "\u00D7"),
                                h("span", { className: "sr-only" }, "Close")),
                            h("h4", { "data-bind": "text:title", className: "modal-title" }, "\u7F16\u8F91\u65B9\u6848")),
                        h("div", { className: "modal-body form-horizontal" },
                            h("div", { className: "form-group" },
                                h("label", { className: "col-sm-2 control-label" }, "\u65B9\u6848\u540D\u79F0"),
                                h("div", { className: "col-sm-10" },
                                    h("input", { type: "text", className: "form-control", placeholder: "请输入运费方案的名称", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.value = name || '';
                                        }, onChange: (e) => name = e.target.value }))),
                            h("div", { className: "modal-footer" },
                                h("button", { name: "btn_cancel", type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                h("button", { name: "btn_confirm", type: "button", className: "btn btn-primary", onClick: () => {
                                        dataItem.Name = name;
                                        this.dataSource.update(dataItem).then(() => {
                                            ui.hideDialog(this.dialogElement);
                                        });
                                    } }, "\u786E\u8BA4"))))), this.dialogElement);
                ui.showDialog(this.dialogElement);
            }
            render() {
                return (h("div", null,
                    h("div", { id: "news", className: "tabbable" },
                        h("ul", { id: "myTab", className: "nav nav-tabs" },
                            h("li", { className: "pull-right" },
                                h("button", { "data-bind": "click:newItem", className: "btn btn-primary btn-sm", onClick: () => this.showDialog({}) },
                                    h("i", { className: "icon-plus" }),
                                    h("span", null, "\u65B0\u5EFA\u8FD0\u8D39\u6A21\u677F"))))),
                    h("table", { ref: (e) => this.gridViewElement = e || this.gridViewElement }),
                    h("div", { className: "modal fade", ref: (e) => this.dialogElement = e || this.dialogElement })));
            }
        }
        ReactDOM.render(h(Page, null), page.element);
        // let dialogElement = document.createElement('form');
        // dialogElement.name = 'dlg_solution';
        // dialogElement.className = 'modal fade';
        // page.element.appendChild(dialogElement);
    }
    exports.default = default_1;
});
