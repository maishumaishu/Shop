import * as wz from 'myWuZhui';
import * as ui from 'ui';
import { default as shopping, Order, OrderDetail } from 'services/Shopping';

export default function (page: chitu.Page) {
    page.element.className = 'admin-pc';
    let tabbable = document.createElement('div');
    page.element.appendChild(tabbable);
    renderTabs();

    let dataSource = new wuzhui.WebDataSource({
        select: (args) => shopping.orders(args)
    });
    wz.appendGridView(page.element, {
        dataSource,
        columns: [
            new wz.BoundField({
                dataField: 'OrderDate', headerText: '订单日期', dataFormatString: '{0:G}',
                headerStyle: { width: '100px' } as CSSStyleDeclaration,
                sortExpression: 'OrderDate'
            }),
            new wz.BoundField({
                dataField: 'Serial', headerText: '订单号', sortExpression: 'Serial',
                headerStyle: { width: '120px' } as CSSStyleDeclaration
            }),
            new wz.BoundField({
                dataField: 'Consignee', headerText: '收款人',
                headerStyle: { width: '100px' } as CSSStyleDeclaration
            }),
            new wz.BoundField({
                dataField: 'ReceiptAddress', headerText: '收货地址'
            }),
            new wz.BoundField({
                dataField: 'StatusText', headerText: '状态',
                itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
            }),
            new wz.BoundField({
                dataField: 'Amount', headerText: '金额', dataFormatString: '￥{0:C2}',
                itemStyle: { textAlign: 'right' } as CSSStyleDeclaration
            }),
            new wz.CustomField({
                createItemCell: createCommandCell,
                headerText: '操作',
                headerStyle: { width: '110px' } as CSSStyleDeclaration,
                itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
            })
        ],
        pageSize: 10
    });

    function createCommandCell(dataItem: Order) {
        let cell = new wuzhui.GridViewDataCell({
            dataItem,
            dataField: 'Status',
            render(element, value) {
                ReactDOM.render(
                    <div>
                        {value == 'Send' ?
                            <button className="btn btn-minier" style={{ width: 50 }}>已发货</button> :
                            <button className="btn btn-primary btn-minier" style={{ width: 50 }}
                                onClick={() => showSendDialog()}>发&nbsp;&nbsp;货</button>}
                        <button className="btn btn-default btn-minier" style={{ marginLeft: 4 }}
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                e.onclick = (e) => showOrderDetailDialog(dataItem);
                            }}>详细</button>
                    </div>
                    , element)
            }
        });
        return cell;
    }

    let current_status: string;
    function activeTab(status: string) {
        if (current_status == status)
            return;

        if (status)
            dataSource.selectArguments.filter = `Status = "${status}"`;

        current_status = status;
        dataSource.selectArguments.startRowIndex = 0;
        dataSource.select();
        renderTabs(status)
    }

    function renderTabs(status?: string) {
        ReactDOM.render(<ul id="myTab" className="nav nav-tabs">
            <li className={!status ? "active" : ""}
                onClick={() => activeTab('')}>
                <a href="javascript:">全部</a>
            </li>
            <li className={status == 'WaitingForPayment' ? 'active' : ''}
                onClick={() => activeTab('WaitingForPayment')} >
                <a href="javascript:">待付款</a>
            </li>
            <li className={status == 'Canceled' ? 'active' : ''}
                onClick={() => activeTab('Canceled')}>
                <a href="javascript:">已取消</a>
            </li>
            <li className={status == 'Paid' ? 'active' : ''}
                onClick={() => activeTab('Paid')}>
                <a href="javascript:">已付款</a>
            </li>
            <li className={status == 'WaitingForSend' ? 'active' : ''}
                onClick={() => activeTab('WaitingForSend')}>
                <a href="javascript:">待发货</a>
            </li>
            <li className={status == 'Send' ? 'active' : ''}
                onClick={() => activeTab('Send')}>
                <a href="javascript:" data-bind="click: send">已发货</a>
            </li>
            <li className={status == 'Received' ? 'active' : ''}
                onClick={() => activeTab('Received')}>
                <a href="javascript:">已收货</a>
            </li>
            <li className="pull-right">
                <a data-bind="click: exportData" href="javascript:" className="btn btn-sm btn-primary" data-toggle="dropdown">导出发货单</a>
                <div className="form-horizontal" style={{ display: 'none' }} data-role="export">
                    <div className="form-group">
                        <label className="col-sm-3 control-label">开始时间</label>
                        <div className="col-sm-9">
                            <input data-bind="value: beginDate" name="begin" className="form-control" type="text" placeholder="填写订单的下单日期" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-3 control-label">结束时间</label>
                        <div className="col-sm-9">
                            <input data-bind="value: endDate" name="end" className="form-control" type="text" placeholder="填写订单的下单日期" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-12">
                            <a data-bind="attr: { href: exportUrl }" className="btn btn-sm btn-primary btn-block">确定</a>
                        </div>
                    </div>
                </div>
            </li>
            <li className="pull-right">
                <button data-bind="click: search" className="btn btn-primary btn-sm">搜索</button>
            </li>
            <li className="pull-right">
                <input type="text" data-bind="value: searchText" className="form-control" style={{ width: 300 }} placeholder="请输入系统订单号或微信订单号或付款人" />
            </li>
        </ul>, tabbable);
    }


    let sendDialogElement = document.createElement('form');
    sendDialogElement.className = "modal fade";
    page.element.appendChild(sendDialogElement);

    /**
     * 显示发货窗口
     */
    function showSendDialog() {
        ReactDOM.render(
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title">发货信息</h4>
                    </div>
                    <div className="modal-body form-horizontal">
                        <input name="orderId" type="hidden" />
                        <div className="form-group">
                            <label className="col-sm-2 control-label">订单时间</label>
                            <div className="col-sm-10">
                                <input name="createDateTime" type="text" className="form-control" disabled={true} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">收货人</label>
                            <div className="col-sm-10">
                                <input name="consignee" type="text" className="form-control" disabled={true} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">收货地址</label>
                            <div className="col-sm-10">
                                <input name="receiptAddress" type="text" className="form-control" disabled={true} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">快递单号</label>
                            <div className="col-sm-10">
                                <input name="expressBillNo" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">快递公司</label>
                            <div className="col-sm-10">
                                <input name="expressCompany" type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                        <button type="submit" className="btn btn-primary">保存</button>
                    </div>
                </div>
            </div>
            , sendDialogElement);

        setTimeout(() => {
            $(sendDialogElement).modal('show');
        }, 200);
    }

    let orderDetailDialogElement = document.createElement('div');
    orderDetailDialogElement.className = "modal fade";
    page.element.appendChild(orderDetailDialogElement);
    function showOrderDetailDialog(dataItem: Order) {
        ReactDOM.render(
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title">订单详情</h4>
                    </div>
                    <div className="modal-body">
                        <table className="table table-striped table-bordered" style={{ textAlign: 'left' }}>
                            <tbody>
                                <tr>
                                    <td className="fieldHeader first" style={{ width: 80 }}>订单日期</td>
                                    <td>{dataItem.OrderDate.toLocaleDateString()}</td>
                                    <td>付款人</td>
                                    <td>{dataItem.Consignee}</td>
                                </tr>
                                <tr>
                                    <td>发票信息</td>
                                    <td colSpan={3}>{dataItem.Invoice}</td>
                                </tr>
                                <tr>
                                    <td>备注信息</td>
                                    <td colSpan={3}>{dataItem.Remark}</td>
                                </tr>
                                <tr>
                                    <td>收货地址</td>
                                    <td colSpan={3}>{dataItem.ReceiptAddress}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>名称</th>
                                    <td style={{ textAlign: 'center' }}>价格</td>
                                    <td style={{ textAlign: 'center' }}>数量</td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataItem.OrderDetails.map(o =>
                                    <tr key={o.Id}>
                                        <td data-bind="text: ProductName">{o.ProductName}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span>{o.Price.toFixed(2)}</span>
                                            <span>元/</span>
                                            <span>{o.Unit}</span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>{o.Quantity}</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        <div style={{ float: 'left' }}>
                                            邮费：￥{dataItem.Freight.toFixed(2)}
                                        </div>
                                        <div style={{ float: 'right' }}>
                                            小计：￥{(function () {
                                                let total = 0;
                                                dataItem.OrderDetails.forEach(o => total = total + o.Price * o.Quantity);
                                                return total.toFixed(2);
                                            })()}
                                        </div>
                                        <div className="clearfix"></div>
                                        <div style={{ textAlign: 'right' }}>
                                            ￥{dataItem.Sum.toFixed(2)}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                        <button type="submit" className="btn btn-primary">保存</button>
                    </div>
                </div>
            </div>
            , orderDetailDialogElement);

        $(orderDetailDialogElement).modal();
    }

}

// import site = require('Site');
// import { default as Service } from 'services/Service';
// // import Utility = require('Utility');
// let JData = window['JData'];

// export default function (page: chitu.Page) {
//     requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
//         page.element.innerHTML = html;
//         page_load(page, page.routeData.values);
//     });
// }

// function page_load(page: chitu.Page, args: any) {
//     var confirm_text = '待付款';
//     var send_text = '已发货';
//     var status_col_index = 4;

//     var $shippingInfo = $(page.element).find('[name="shippingInfo"]');
//     var $orderDetail = $(page.element).find('[name="orderDetail"]');

//     var select_url = site.config.shopUrl + 'ShoppingData/Select?source=Orders&selection=Id, OrderDate,Invoice,Remark, Consignee, Status.ToString() as Status, ReceiptAddress, Amount, Serial, Freight';
//     var dataSource = new JData.WebDataSource();
//     dataSource.set_selectUrl(select_url);
//     ($('<table>').appendTo(page.element)).gridView({
//         dataSource: dataSource,
//         columns: [
//             { dataField: 'OrderDate', headerText: '订单日期', dataFormatString: '{0:G}', itemStyle: { width: '100px' }, sortExpression: 'OrderDate' },
//             { dataField: 'Serial', headerText: '订单号', sortExpression: 'Serial', itemStyle: { width: '120px' } },
//             { dataField: 'Consignee', headerText: '付款人', itemStyle: { width: '100px' }, sortExpression: 'Consignee' },
//             { dataField: 'ReceiptAddress', headerText: '收货地址', sortExpression: 'ReceiptAddress' },
//             {
//                 dataField: 'Status', headerText: '状态', sortExpression: 'Status',
//                 displayValue: function (container, value) {
//                     var text = GetStatusText(value);
//                     $(container).append(text);
//                 }
//             },
//             {
//                 dataField: 'Amount', dataFormatString: '￥{0:C2}', headerText: '金额', itemStyle: { textAlign: 'right', width: '100px' },
//                 sortExpression: 'Amount',
//                 displayValue: function (container, value) {
//                     var order = $(container).parents('tr').first().data('dataItem');
//                     var summary = order.Amount + order.Freight;
//                     $(container).append('￥' + summary.toFixed(2));
//                 }
//             },
//             { type: JData.CommandField, headerText: '操作', itemStyle: { textAlign: 'center', width: '110px' } }
//         ],
//         allowPaging: true,
//         rowCreated: function (sender, args) {
//             if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
//                 return;

//             var order = args.row.get_dataItem();
//             var row = args.row.get_element();
//             var cell = row.cells[row.cells.length - 1];
//             var $btn_send = $('<button>')
//                 .attr('class', 'btn btn-primary btn-minier')
//                 .html('发货')
//                 .appendTo(cell)
//                 .click(function () {

//                     $('#orderId').val(order.Id);
//                     $('#createDateTime').val((order.OrderDate as Date).toLocaleString());
//                     $('#consignee').val(order.Consignee);
//                     $('#receiptAddress').val(order.ReceiptAddress);

//                     if ($(this).html() == '已发货') {
//                         $('#expressBillNo').attr('disabled', 'disabled');
//                         $('#expressCompany').attr('disabled', 'disabled');
//                         $shippingInfo.find('button[type="submit"]')
//                             .attr('disabled', 'disabled')
//                             .addClass('disabled');

//                         var url = '/Order/GetShipInfo?orderId=' + order.Id;
//                         $.ajax({ url: url })
//                             .done(function (data) {
//                                 if (!data) return;

//                                 $('#expressBillNo').val(data.ExpressBillNo);
//                                 $('#expressCompany').val(data.ExpressCompany);
//                             });
//                     }
//                     else {
//                         $('#expressBillNo').removeAttr('disabled');
//                         $('#expressCompany').removeAttr('disabled');
//                         $shippingInfo.find('button[type="submit"]').removeAttr('disabled').removeClass('disabled');
//                     }

//                     ($shippingInfo).dialog('open');

//                     var self = this;

//                     $shippingInfo.find('button[type="submit"]').removeClass('disabled');
//                     $shippingInfo.unbind('submit');
//                     $shippingInfo.submit(function () {
//                         if ((!$shippingInfo as any).valid())
//                             return false;

//                         $shippingInfo.find('button[type="submit"]').addClass('disabled');
//                         $.ajax({
//                             url: site.config.shopUrl + 'Order/OrderSend',
//                             data: $shippingInfo.serialize()
//                         })
//                             .done(function () {
//                                 ($shippingInfo).dialog('close');
//                                 order.Status = 'Send';
//                                 $(row.cells[status_col_index]).html(send_text);
//                                 $(self).attr('class', 'btn btn-minier');
//                                 $(self).html('已发货');
//                             })
//                             .always(function () {
//                                 $shippingInfo.find('button[type="submit"]').removeClass('disabled');
//                             });

//                         return false;
//                     });
//                 });

//             if (order.Status == 'Send' || order.Status == 'Received') {
//                 $btn_send.html(send_text).attr('class', 'btn btn-minier');
//             }



//             var $btn_detail = $('<button style="margin-left:4px;">')
//                 .attr('class', 'btn btn-default btn-minier')
//                 .html('详细')
//                 .appendTo(cell)
//                 .click(function () {
//                     var url = `${site.config.shopUrl}ShoppingData/Select?source=OrderDetails&filter=OrderId%3dGuid"${order.Id}"&selection=Price,ProductName,Quantity,Unit`;
//                     $.ajax(url).done(function (data) {

//                         $.extend(order, {
//                             //DeliveryTypeText: GetDeliveryTypeText(order.DeliveryType),
//                             StatusText: GetStatusText(order.Status)
//                         });

//                         currentOrder.Consignee(order.Consignee);
//                         currentOrder.DeliveryType(order.DeliveryType);
//                         currentOrder.OrderDate((order.OrderDate as Date).toLocaleString());
//                         currentOrder.Status(order.Status);
//                         currentOrder.ReceiptAddress(order.ReceiptAddress);
//                         currentOrder.OrderDetails.removeAll();
//                         currentOrder.Invoice(!order.Invoice ? '无' : order.Invoice);
//                         currentOrder.Remark(!order.Remark ? '无' : order.Remark);
//                         currentOrder.Freight(order.Freight.toFixed(2));

//                         var amount = 0;
//                         for (var i = 0; i < data.DataItems.length; i++) {
//                             currentOrder.OrderDetails.push(data.DataItems[i]);
//                             amount = amount + data.DataItems[i].Price * data.DataItems[i].Quantity;
//                         }

//                         currentOrder.Amount(amount.toFixed(2));

//                         ($orderDetail).dialog({
//                             width: 'auto',
//                             title: "<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>订单详情</h5></div>", 
//                             title_html: true,
//                             close: function () {

//                             }
//                         });
//                     })


//                 });
//         }
//     });

//     requirejs(['jquery.validate'], function () {
//         var shippingInfo_validator = ($shippingInfo).validate({
//             rules: {
//                 expressBillNo: { required: true },
//                 expressCompany: { required: true }
//             },
//             messages: {
//                 expressBillNo: { required: '请输入快递单号' },
//                 expressCompany: { required: '请输入快递公司' }
//             }
//         });

//         ($shippingInfo).dialog({
//             title: `<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>发货信息</h5></div>`,
//             title_html: true,
//             width: 500,
//             autoOpen: false,
//             beforeClose: function () {
//                 //==========================================
//                 // 清理表单
//                 shippingInfo_validator.resetForm();
//                 $shippingInfo.find(':input').val('');
//                 //==========================================
//             }
//         });
//     });

//     $shippingInfo.find('[name="cancel"]').click(function () {
//         ($shippingInfo).dialog('close');
//     });

//     function GetStatusText(value) {
//         switch (value) {
//             case 'Confirmed':
//                 return confirm_text;
//             case 'Send':
//                 return send_text;
//             case 'WaitingForPayment':
//                 return '待付款';
//             case 'Canceled':
//                 return '已取消';
//             case 'Paid':
//                 return '已付款';
//             case 'Received':
//                 return '已收货';
//         }
//         return value;
//     }

//     var currentOrder = {
//         OrderDate: ko.observable(),
//         Consignee: ko.observable(),
//         DeliveryType: ko.observable(),
//         Status: ko.observable(),
//         OrderDetails: ko.observableArray(),
//         ReceiptAddress: ko.observable(),
//         Invoice: ko.observable(),
//         Remark: ko.observable(),
//         Amount: ko.observable(),
//         Freight: ko.observable(),
//         Summary: null as KnockoutComputed<string>,
//         StatusText:null as KnockoutComputed<string>,
//     };
//     currentOrder.Summary = ko.computed(function () {
//         return (new Number(this.Amount()).valueOf() + new Number(this.Freight()).valueOf()).toFixed(2);

//     }, currentOrder);

//     currentOrder.StatusText = ko.computed(function () {
//         var text = GetStatusText(this.Status());
//         return text;
//     }, currentOrder);

//     var now = new Date();
//     var tabs = {
//         searchText: ko.observable<string>(),
//         current: ko.observable(''),
//         beginDate: ko.observable(($ as any).datepicker.formatDate('yy-mm-dd', new Date(now.getFullYear(), now.getMonth(), 1))),
//         endDate: ko.observable(($ as any).datepicker.formatDate('yy-mm-dd', new Date(now.getFullYear(), now.getMonth() + 1, 0))),
//         exportData: function (sender, event) {
//             if (!event.target.dlg_element) {
//                 event.target.dlg_element = $(event.target).next('[data-role="export"]');
//                 ($(event.target.dlg_element) as any).dialog({
//                     title: "<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>订单导出</h5></div>",
//                     title_html: true,
//                     position: {
//                         my: 'right top',
//                         at: 'right bottom',
//                         of: event.target
//                     },
//                     width: '340px'
//                 });
//                 ($(event.target.dlg_element).find('[name="begin"], [name="end"]')).datepicker({ dateFormat: 'yy-mm-dd' });
//             }
//             else {
//                 ($(event.target.dlg_element)).dialog('open');
//             }
//         },
//         all: function () {
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             dataSource.set_selectUrl(select_url);
//             dataSource.select(arg);
//             tabs.current('');
//         },
//         send: function () {     //已发货
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             //arg.set_filter('Status=UICRM.Shopping.OrderStatus.Send');
//             dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Send"'));
//             dataSource.select(arg);
//             tabs.current('Send');
//         },
//         toSend: function () {     //待发货
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             //arg.set_filter('Status=UICRM.Shopping.OrderStatus.Send');
//             dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="WaitingForSend"'));
//             dataSource.select(arg);
//             tabs.current('WaitingForSend');
//         },
//         toPay: function () {    //待付款
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             //arg.set_filter('Status=UICRM.Shopping.OrderStatus.WaitingForPayment');
//             dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="WaitingForPayment"'));
//             dataSource.select(arg);
//             tabs.current('WaitingForPayment');
//         },
//         paid: function () {     //已付款
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Paid"'));
//             dataSource.select(arg);
//             tabs.current('Paid');
//         },
//         received: function () {
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Received"'));
//             dataSource.select(arg);
//             tabs.current('Received');
//         },
//         cancel: function () {
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);
//             dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Canceled"'));
//             dataSource.select(arg);
//             tabs.current('Canceled');
//         },
//         search: function () {
//             var searchText: string = tabs.searchText() || '';
//             var arg = new JData.DataSourceSelectArguments();
//             arg.set_startRowIndex(0);
//             arg.set_maximumRows(10);

//             var deferred: JQueryPromise<any> = $.Deferred();
//             if (searchText.length == 28) {
//                 deferred = $.ajax({
//                     url: site.config.shopUrl + 'Order/GetOrderSerial',
//                     data: {
//                         wxOrderNO: searchText
//                     }
//                 });
//             }
//             else {
//                 (deferred as JQueryDeferred<any>).resolve(searchText);
//             }

//             deferred.done(function (searchText) {
//                 if (searchText)
//                     arg.set_filter(`Serial == "${searchText}" or Member.Name == "${searchText}"`);
//                 else
//                     arg.set_filter(null);

//                 dataSource.set_selectUrl(select_url);
//                 dataSource.select(arg);
//                 tabs.current('');
//             });
//         }
//     };


//     tabs['exportUrl'] = ko.computed(function () {
//         return site.config.shopUrl + 'Order/ExportInvoice?begin=' + this.beginDate() + '&end=' + this.endDate() +
//             '&$appToken=' + Service.appToken + '&$token=' + Service.token;
//     }, tabs);

//     ko.applyBindings(currentOrder, $(page.element).find('[name="orderDetail"]')[0])
//     ko.applyBindings(tabs, $(page.element).find('[name="categories"]')[0]);

//     var arg = new JData.DataSourceSelectArguments();
//     arg.set_maximumRows(10);
//     dataSource.select(arg);
// }
