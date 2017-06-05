
import { default as shopping, Coupon } from 'services/Shopping';
import site = require('Site');
import * as ui from 'myWuZhui';

export default function (page: chitu.Page) {
    page.element.className = 'admin-pc';
    class CouponListPage extends React.Component<{}, {}>{
        private couponsTable: HTMLTableElement;
        private itemEditor: ui.GridViewItemPopupEditor;

        componentDidMount() {
            let dataSource = new wuzhui.WebDataSource<Coupon>({
                primaryKeys: ['Id'],
                select: () => shopping.coupons(),
                delete: (dataItem) => shopping.deleteCoupon(dataItem)
            });
            let gridView = ui.createGridView({
                element: this.couponsTable,
                dataSource,
                columns: [
                    new ui.BoundField({ dataField: 'Title', headerText: '标题' }),
                    // new ui.BoundField({ dataField: 'Title', headerText: '标题' }),
                    new ui.CustomField({
                        createItemCell(dataItem: Coupon) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(
                                <div>
                                    <span>{dataItem.ValidBegin.toLocaleDateString()}</span>
                                    <span> 至 </span>
                                    <span>{dataItem.ValidEnd.toLocaleDateString()}</span>
                                </div>,
                                cell.element);
                            return cell;
                        },
                        headerText: '有效期'
                    }),
                    new ui.BoundField({
                        dataField: 'Discount', headerText: '折扣金额', dataFormatString: '￥{0:C2}',
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration
                    }),
                    new ui.BoundField({
                        dataField: 'Amount', headerText: '使用金额', dataFormatString: '￥{0:C2}',
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration
                    }),
                    new ui.CommandField({
                        itemEditor: this.itemEditor,
                        headerStyle: { width: '100px' } as CSSStyleDeclaration
                    })
                ]
            })

        }
        render() {
            return (
                <div>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-left active">
                                <a>全部</a>
                            </li>
                            <li data-bind="visible:currentIndex()==0" className="pull-right">
                                <a href="#Coupon/CouponEdit" className="btn btn-sm btn-primary" title="点击添加优惠券">添加</a>
                            </li>
                        </ul>
                    </div>
                    <table ref={(o: HTMLTableElement) => this.couponsTable = this.couponsTable || o}></table>
                    <ui.GridViewItemPopupEditor name="优惠劵" saveDataItem={(dataItem) => Promise.resolve({})}>
                    </ui.GridViewItemPopupEditor>
                </div>
            );
        }
    }

    ReactDOM.render(<CouponListPage />, page.element);
}

// let JData = window['JData'];

// export default function (page: chitu.Page) {
//     requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
//         page.element.innerHTML = html;
//         page_load(page, page.routeData.values);
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

