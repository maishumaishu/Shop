define(["require", "exports", "admin/site", "myWuZhui", "dilu", "admin/services/shopping", "admin/services/activity", "wuzhui"], function (require, exports, site_1, myWuZhui_1, dilu_1, shopping_1, activity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        let activity = page.createService(activity_1.ActivityService);
        class BrandListPage extends React.Component {
            componentDidMount() {
                let self = this;
                var baseUrl = site_1.default.config.shopUrl + 'ShoppingData/';
                var tableElement = document.createElement('table');
                tableElement.className = 'table table-striped table-bordered table-hover';
                page.element.appendChild(tableElement);
                var dataSource = this.dataSource = new wuzhui.DataSource({
                    primaryKeys: ['Id'],
                    select: (args) => shopping.brands(args),
                    update: (dataItem) => shopping.updateBrand(dataItem),
                    insert: (dataItem) => shopping.addBrand(dataItem),
                    delete: (dataItem) => shopping.deleteBrand(dataItem)
                });
                var gridView = myWuZhui_1.createGridView({
                    element: tableElement, dataSource, columns: [
                        new wuzhui.BoundField({
                            dataField: 'Name', sortExpression: 'Name', headerText: '名称',
                            itemStyle: { width: '200px' },
                            headerStyle: { textAlign: 'center' }
                        }),
                        new wuzhui.BoundField({
                            dataField: 'Image', headerText: '图片',
                            headerStyle: { textAlign: 'center' }
                        }),
                        new myWuZhui_1.CommandField({
                            headerText: '操作',
                            headerStyle: { textAlign: 'center', width: '100px' },
                            itemStyle: { textAlign: 'center' },
                            itemEditor: this.itemEditor
                        })
                    ]
                });
            }
            render() {
                return (h("div", null,
                    h("div", { className: "tabbable" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "pull-right" },
                                h("button", { href: "#Shopping/BrandEdit", className: "btn btn-sm btn-primary", onClick: () => this.itemEditor.show() },
                                    h("i", { className: "icon-plus" }),
                                    h("span", null, "\u6DFB\u52A0"))))),
                    h(myWuZhui_1.GridViewItemPopupEditor, { name: "品牌", ref: (e) => {
                            if (!e)
                                return;
                            this.itemEditor = e;
                            e.validator = new dilu_1.FormValidator(e.element, { name: "Name", rules: [dilu_1.rules.required()] });
                        }, saveDataItem: (dataItem) => {
                            if (dataItem.Id == null)
                                return this.dataSource.insert(dataItem);
                            else
                                return this.dataSource.update(dataItem);
                        } },
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2" }, "\u540D\u79F0"),
                            h("div", { className: "col-sm-10" },
                                h("input", { name: "Name", type: "text", className: "form-control" }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2" }, "\u56FE\u7247"),
                            h("div", { className: "col-sm-10" },
                                h("input", { name: "Image", type: "text", className: "form-control" }))))));
            }
        }
        ReactDOM.render(h(BrandListPage, null), page.element);
    }
    exports.default = default_1;
});
