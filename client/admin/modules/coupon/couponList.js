define(["require", "exports", "admin/services/shopping", "admin/site", "myWuZhui", "admin/siteMap"], function (require, exports, shopping_1, site_1, wz, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        class CouponListPage extends React.Component {
            componentDidMount() {
                let dataSource = new wuzhui.DataSource({
                    primaryKeys: ['Id'],
                    select: () => shopping.coupons(),
                    delete: (dataItem) => shopping.deleteCoupon(dataItem)
                });
                let gridView = wz.createGridView({
                    element: this.couponsTable,
                    dataSource,
                    columns: [
                        new wz.BoundField({ dataField: 'Title', headerText: '标题' }),
                        // new ui.BoundField({ dataField: 'Title', headerText: '标题' }),
                        new wz.CustomField({
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                ReactDOM.render(h("div", null,
                                    h("span", null, dataItem.ValidBegin.toLocaleDateString()),
                                    h("span", null, " \u81F3 "),
                                    h("span", null, dataItem.ValidEnd.toLocaleDateString())), cell.element);
                                return cell;
                            },
                            headerText: '有效期'
                        }),
                        new wz.BoundField({
                            dataField: 'Discount', headerText: '折扣金额', dataFormatString: '￥{C2}',
                            itemStyle: { textAlign: 'right' }
                        }),
                        new wz.BoundField({
                            dataField: 'Amount', headerText: '使用金额', dataFormatString: '￥{C2}',
                            itemStyle: { textAlign: 'right' }
                        }),
                        new wz.CommandField({
                            // itemEditor: this.itemEditor,
                            leftButtons: (dataItem) => [
                                h("button", { className: "btn btn-minier btn-info", onClick: () => site_1.app.redirect(siteMap_1.siteMap.nodes.coupon_couponEdit, { id: dataItem.Id }) },
                                    h("i", { className: "icon-pencil" }))
                            ],
                            headerStyle: { width: '100px' },
                        })
                    ]
                });
            }
            render() {
                return (h("div", null,
                    h("div", { className: "tabbable" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "pull-left active" },
                                h("a", null, "\u5168\u90E8")),
                            h("li", { "data-bind": "visible:currentIndex()==0", className: "pull-right" },
                                h("button", { onClick: () => site_1.app.redirect(siteMap_1.siteMap.nodes.coupon_couponEdit), className: "btn btn-sm btn-primary", title: "点击添加优惠券" },
                                    h("i", { className: "icon-plus" }),
                                    h("span", null, "\u6DFB\u52A0"))))),
                    h("table", { ref: (o) => this.couponsTable = this.couponsTable || o }),
                    h(wz.GridViewItemPopupEditor, { name: "优惠劵", saveDataItem: (dataItem) => Promise.resolve({}) })));
            }
        }
        ReactDOM.render(h(CouponListPage, null), page.element);
    }
    exports.default = default_1;
});
// let JData = window['JData'];
// export default function (page: chitu.Page) {
//     requirejs([`text!${page.name}.html`], (html) => {
//         page.element.innerHTML = html;
//         page_load(page, page.data);
//     })
// }
// function page_load(page: chitu.Page, args: any) {
//     function Tab(name, current, index) {
//         this.name = ko.observable(name)
//         this.current = ko.observable(current),
//             this.index = ko.observable(index)
//     }
//     var tabs = [new Tab("优惠券", true, 0), new Tab("赠券设置", false, 1)];
//     var model = {
//         tabs: tabs,
//         currentIndex: ko.observable(0),
//         on_tabSelected: function (item, event) {
//             var index = $.inArray(item, model.tabs);
//             model.currentIndex(index);
//             for (var i = 0; i < tabs.length; i++) {
//                 tabs[i].current(false);
//             }
//             item.current(true);
//         },
//         config: {
//             registerCouponIds: ko.observable(),
//             sendCouponDate: ko.observable(),
//             sendCouponIds: ko.observable()
//         },
//         save: function () {
//         }
//     };
//     var $table = (<any>$('<table data-bind="visible:currentIndex()==0">').appendTo(page.element)).gridView({
//         dataSource: shopping.couponDataSource,
//         columns: [
//             { dataField: 'Id', headerText: '编号', width: '280px' },
//             { dataField: 'Title', headerText: '名称', width: '180px' },
//             { dataField: 'Amount', headerText: '消费金额', width: '100px', dataFormatString: '￥{0:C2}', itemStyle: { textAlign: 'right' } },
//             { dataField: 'Discount', headerText: '面值', width: '100px', dataFormatString: '￥{0:C2}', itemStyle: { textAlign: 'right' } },
//             { type: JData.DateTimeField, dataField: 'ValidBegin', headerText: '有效期开始' },
//             { type: JData.DateTimeField, dataField: 'ValidEnd', headerText: '有效期结束' },
//             { type: JData.CommandField, width: '80px', showDeleteButton: true, showEditButton: false, showCancelButton: true }
//         ],
//         allowPaging: true,
//         rowCreated: function (sender, args) {
//             if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
//                 return;
//             var cmd_cell = <any>$(args.row.get_cells()).last()[0];
//             site.createEditCommand(cmd_cell.get_element(), '#Coupon/CouponEdit?id=' + args.row.get_dataItem()['Id']);
//         }
//     });
//     // page.load.add(function () {
//     shopping.couponDataSource.select($table.data('JData.GridView').get_selectArguments());
//     // });
//     ko.applyBindings(model, page.element);
// }
