
import site = require('Site');
import Service = require('services/Service');


let JData = window['JData'];

class OrderListPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add((s, a) => this.page_load(<OrderListPage>s, a));
    }

    page_load(page: OrderListPage, args: any) {
        var confirm_text = '待付款';
        var send_text = '已发货';
        var status_col_index = 4;

        var $shippingInfo = $(page.element).find('[name="shippingInfo"]');
        var $orderDetail = $(page.element).find('[name="orderDetail"]');

        //$shippingInfo.find(':submit').addClass('disabled', 'disabled');
        //$.Deferred().always
        var select_url = site.config.shopUrl + 'ShoppingData/Select?source=Orders&selection=Id, OrderDate,Invoice,Remark, Consignee, Status.ToString() as Status, ReceiptAddress, Amount, Serial, Freight';
        var dataSource = new JData.WebDataSource();
        dataSource.set_selectUrl(select_url);
        (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: dataSource,
            columns: [
                { dataField: 'OrderDate', headerText: '订单日期', dataFormatString: '{0:G}', itemStyle: { width: '100px' }, sortExpression: 'OrderDate' },
                { dataField: 'Serial', headerText: '订单号', sortExpression: 'Serial', itemStyle: { width: '120px' } },
                { dataField: 'Consignee', headerText: '付款人', itemStyle: { width: '100px' }, sortExpression: 'Consignee' },
                { dataField: 'ReceiptAddress', headerText: '收货地址', sortExpression: 'ReceiptAddress' },
                {
                    dataField: 'Status', headerText: '状态', sortExpression: 'Status',
                    displayValue: function (container, value) {
                        var text = GetStatusText(value);
                        $(container).append(text);
                    }
                },
                {
                    dataField: 'Amount', dataFormatString: '￥{0:C2}', headerText: '金额', itemStyle: { textAlign: 'right', width: '100px' },
                    sortExpression: 'Amount',
                    displayValue: function (container, value) {
                        var order = $(container).parents('tr').first().data('dataItem');
                        var summary = order.Amount + order.Freight;
                        $(container).append('￥' + summary.toFixed(2));
                    }
                },
                { type: JData.CommandField, headerText: '操作', itemStyle: { textAlign: 'center', width: '110px' } }
            ],
            allowPaging: true,
            rowCreated: function (sender, args) {
                if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                    return;

                var order = args.row.get_dataItem();
                var row = args.row.get_element();
                var cell = row.cells[row.cells.length - 1];
                var $btn_send = $('<button>')
                    .attr('class', 'btn btn-primary btn-minier')
                    .html('发货')
                    .appendTo(cell)
                    .click(function () {

                        $('#orderId').val(order.Id);
                        $('#createDateTime').val(chitu.Utility.format('{0:d}', order.OrderDate));
                        $('#consignee').val(order.Consignee);
                        $('#receiptAddress').val(order.ReceiptAddress);

                        if ($(this).html() == '已发货') {
                            $('#expressBillNo').attr('disabled', 'disabled');
                            $('#expressCompany').attr('disabled', 'disabled');
                            $shippingInfo.find('button[type="submit"]')
                                .attr('disabled', 'disabled')
                                .addClass('disabled');

                            var url = '/Order/GetShipInfo?orderId=' + order.Id;
                            $.ajax({ url: url })
                                .done(function (data) {
                                    if (!data) return;

                                    $('#expressBillNo').val(data.ExpressBillNo);
                                    $('#expressCompany').val(data.ExpressCompany);
                                });
                        }
                        else {
                            $('#expressBillNo').removeAttr('disabled');
                            $('#expressCompany').removeAttr('disabled');
                            $shippingInfo.find('button[type="submit"]').removeAttr('disabled').removeClass('disabled');
                        }

                        (<any>$shippingInfo).dialog('open');

                        var self = this;

                        $shippingInfo.find('button[type="submit"]').removeClass('disabled');
                        $shippingInfo.unbind('submit');
                        $shippingInfo.submit(function () {
                            if ((<any>!$shippingInfo).valid())
                                return false;

                            $shippingInfo.find('button[type="submit"]').addClass('disabled');
                            $.ajax({
                                url: site.config.shopUrl + 'Order/OrderSend',
                                data: $shippingInfo.serialize()
                            })
                                .done(function () {
                                    (<any>$shippingInfo).dialog('close');
                                    order.Status = 'Send';
                                    $(row.cells[status_col_index]).html(send_text);
                                    $(self).attr('class', 'btn btn-minier');
                                    $(self).html('已发货');
                                })
                                .always(function () {
                                    $shippingInfo.find('button[type="submit"]').removeClass('disabled');
                                });

                            return false;
                        });
                    });

                if (order.Status == 'Send' || order.Status == 'Received') {
                    $btn_send.html(send_text).attr('class', 'btn btn-minier');
                }



                var $btn_detail = $('<button style="margin-left:4px;">')
                    .attr('class', 'btn btn-default btn-minier')
                    .html('详细')
                    .appendTo(cell)
                    .click(function () {
                        var url = chitu.Utility.format(site.config.shopUrl + 'ShoppingData/Select?source=OrderDetails&filter=OrderId%3dGuid"{0}"&selection=Price,ProductName,Quantity,Unit', order.Id);
                        $.ajax(url).done(function (data) {

                            $.extend(order, {
                                //DeliveryTypeText: GetDeliveryTypeText(order.DeliveryType),
                                StatusText: GetStatusText(order.Status)
                            });

                            currentOrder.Consignee(order.Consignee);
                            currentOrder.DeliveryType(order.DeliveryType);
                            currentOrder.OrderDate(chitu.Utility.format('{0:G}', order.OrderDate));
                            currentOrder.Status(order.Status);
                            currentOrder.ReceiptAddress(order.ReceiptAddress);
                            currentOrder.OrderDetails.removeAll();
                            currentOrder.Invoice(!order.Invoice ? '无' : order.Invoice);
                            currentOrder.Remark(!order.Remark ? '无' : order.Remark);
                            currentOrder.Freight(order.Freight.toFixed(2));

                            var amount = 0;
                            for (var i = 0; i < data.DataItems.length; i++) {
                                currentOrder.OrderDetails.push(data.DataItems[i]);
                                amount = amount + data.DataItems[i].Price * data.DataItems[i].Quantity;
                            }

                            currentOrder.Amount(amount.toFixed(2));

                            (<any>$orderDetail).dialog({
                                width: 'auto',
                                title: chitu.Utility.format("<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>{0}</h5></div>", '订单详情'),
                                title_html: true,
                                close: function () {

                                }
                            });
                        })


                    });
            }
        });

        requirejs(['jquery.validate'], function () {
            var shippingInfo_validator = (<any>$shippingInfo).validate({
                rules: {
                    expressBillNo: { required: true },
                    expressCompany: { required: true }
                },
                messages: {
                    expressBillNo: { required: '请输入快递单号' },
                    expressCompany: { required: '请输入快递公司' }
                }
            });

            (<any>$shippingInfo).dialog({
                title: chitu.Utility.format("<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>{0}</h5></div>", '发货信息'),
                title_html: true,
                width: 500,
                autoOpen: false,
                beforeClose: function () {
                    //==========================================
                    // 清理表单
                    shippingInfo_validator.resetForm();
                    $shippingInfo.find(':input').val('');
                    //==========================================
                }
            });
        });

        $shippingInfo.find('[name="cancel"]').click(function () {
            (<any>$shippingInfo).dialog('close');
        });

        function GetStatusText(value) {
            switch (value) {
                case 'Confirmed':
                    return confirm_text;
                case 'Send':
                    return send_text;
                case 'WaitingForPayment':
                    return '待付款';
                case 'Canceled':
                    return '已取消';
                case 'Paid':
                    return '已付款';
                case 'Received':
                    return '已收货';
            }
            return value;
        }

        var currentOrder = {
            OrderDate: ko.observable(),
            Consignee: ko.observable(),
            DeliveryType: ko.observable(),
            Status: ko.observable(),
            OrderDetails: ko.observableArray(),
            ReceiptAddress: ko.observable(),
            Invoice: ko.observable(),
            Remark: ko.observable(),
            Amount: ko.observable(),
            Freight: ko.observable(),
            Summary: <KnockoutComputed<string>>null,
            StatusText: <KnockoutComputed<string>>null,
        };
        currentOrder.Summary = ko.computed(function () {
            return (new Number(this.Amount()).valueOf() + new Number(this.Freight()).valueOf()).toFixed(2);

        }, currentOrder);

        currentOrder.StatusText = ko.computed(function () {
            var text = GetStatusText(this.Status());
            return text;
        }, currentOrder);

        var now = new Date();
        var tabs = {
            searchText: ko.observable<string>(),
            current: ko.observable(''),
            beginDate: ko.observable((<any>$).datepicker.formatDate('yy-mm-dd', new Date(now.getFullYear(), now.getMonth(), 1))),
            endDate: ko.observable((<any>$).datepicker.formatDate('yy-mm-dd', new Date(now.getFullYear(), now.getMonth() + 1, 0))),
            exportData: function (sender, event) {
                if (!event.target.dlg_element) {
                    event.target.dlg_element = $(event.target).next('[data-role="export"]');
                    (<any>$(event.target.dlg_element)).dialog({
                        title: chitu.Utility.format("<div class='widget-header widget-header-small' style='padding-top:6px;'><h5>{0}</h5></div>", '订单导出'),
                        title_html: true,
                        position: {
                            my: 'right top',
                            at: 'right bottom',
                            of: event.target
                        },
                        width: '340px'
                    });
                    (<any>$(event.target.dlg_element).find('[name="begin"], [name="end"]')).datepicker({ dateFormat: 'yy-mm-dd' });
                }
                else {
                    (<any>$(event.target.dlg_element)).dialog('open');
                }
            },
            all: function () {
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                dataSource.set_selectUrl(select_url);
                dataSource.select(arg);
                tabs.current('');
            },
            send: function () {     //已发货
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                //arg.set_filter('Status=UICRM.Shopping.OrderStatus.Send');
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Send"'));
                dataSource.select(arg);
                tabs.current('Send');
            },
            toSend: function () {     //待发货
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                //arg.set_filter('Status=UICRM.Shopping.OrderStatus.Send');
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="WaitingForSend"'));
                dataSource.select(arg);
                tabs.current('WaitingForSend');
            },
            toPay: function () {    //待付款
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                //arg.set_filter('Status=UICRM.Shopping.OrderStatus.WaitingForPayment');
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="WaitingForPayment"'));
                dataSource.select(arg);
                tabs.current('WaitingForPayment');
            },
            paid: function () {     //已付款
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Paid"'));
                dataSource.select(arg);
                tabs.current('Paid');
            },
            received: function () {
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Received"'));
                dataSource.select(arg);
                tabs.current('Received');
            },
            cancel: function () {
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);
                dataSource.set_selectUrl(select_url + '&filter=' + encodeURI('Status=="Canceled"'));
                dataSource.select(arg);
                tabs.current('Canceled');
            },
            search: function () {
                var searchText: string = tabs.searchText() || '';
                var arg = new JData.DataSourceSelectArguments();
                arg.set_startRowIndex(0);
                arg.set_maximumRows(10);

                var deferred: JQueryPromise<any> = $.Deferred();
                if (searchText.length == 28) {
                    deferred = $.ajax({
                        url: site.config.shopUrl + 'Order/GetOrderSerial',
                        data: {
                            wxOrderNO: searchText
                        }
                    });
                }
                else {
                    (<JQueryDeferred<any>>deferred).resolve(searchText);
                }

                deferred.done(function (searchText) {
                    if (searchText)
                        arg.set_filter(chitu.Utility.format('Serial == "{0}" or Member.Name == "{0}"', searchText));
                    else
                        arg.set_filter(null);

                    dataSource.set_selectUrl(select_url);
                    dataSource.select(arg);
                    tabs.current('');
                });
            }
        };


        tabs['exportUrl'] = ko.computed(function () {
            return site.config.shopUrl + 'Order/ExportInvoice?begin=' + this.beginDate() + '&end=' + this.endDate() +
                '&$appToken=' + Service.appToken + '&$token=' + Service.token;
        }, tabs);

        ko.applyBindings(currentOrder, $(page.element).find('[name="orderDetail"]')[0])
        ko.applyBindings(tabs, $(page.element).find('[name="categories"]')[0]);

        var arg = new JData.DataSourceSelectArguments();
        arg.set_maximumRows(10);
        dataSource.select(arg);
    }
}

export = OrderListPage;