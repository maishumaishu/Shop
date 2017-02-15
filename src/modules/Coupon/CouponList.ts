
import shoppingService = require('services/Shopping');
import site = require('Site');

let JData = window['JData'];

export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    })
}

function page_load(page: chitu.Page, args: any) {
    function Tab(name, current, index) {
        this.name = ko.observable(name)
        this.current = ko.observable(current),
            this.index = ko.observable(index)
    }

    var tabs = [new Tab("优惠券", true, 0), new Tab("赠券设置", false, 1)];

    var model = {
        tabs: tabs,
        currentIndex: ko.observable(0),
        on_tabSelected: function (item, event) {
            var index = $.inArray(item, model.tabs);
            model.currentIndex(index);
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].current(false);
            }
            item.current(true);
        },
        config: {
            registerCouponIds: ko.observable(),
            sendCouponDate: ko.observable(),
            sendCouponIds: ko.observable()
        },
        save: function () {

        }
    };

    var $table = (<any>$('<table data-bind="visible:currentIndex()==0">').appendTo(page.element)).gridView({
        dataSource: shoppingService.couponDataSource,
        columns: [
            { dataField: 'Id', headerText: '编号', width: '280px' },
            { dataField: 'Title', headerText: '名称', width: '180px' },
            { dataField: 'Amount', headerText: '消费金额', width: '100px', dataFormatString: '￥{0:C2}', itemStyle: { textAlign: 'right' } },
            { dataField: 'Discount', headerText: '面值', width: '100px', dataFormatString: '￥{0:C2}', itemStyle: { textAlign: 'right' } },
            { type: JData.DateTimeField, dataField: 'ValidBegin', headerText: '有效期开始' },
            { type: JData.DateTimeField, dataField: 'ValidEnd', headerText: '有效期结束' },
            { type: JData.CommandField, width: '80px', showDeleteButton: true, showEditButton: false, showCancelButton: true }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var cmd_cell = <any>$(args.row.get_cells()).last()[0];
            site.createEditCommand(cmd_cell.get_element(), '#Coupon/CouponEdit?id=' + args.row.get_dataItem()['Id']);
        }
    });

    // page.load.add(function () {
    shoppingService.couponDataSource.select($table.data('JData.GridView').get_selectArguments());
    // });

    ko.applyBindings(model, page.element);
}

