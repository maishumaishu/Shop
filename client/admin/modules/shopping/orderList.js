var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "myWuZhui", "admin/services/shopping", "admin/services/account", "dilu"], function (require, exports, wz, shopping_1, account_1, dilu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        let account = page.createService(account_1.AccountService);
        /**
         * 订单发货窗口
         */
        class OrderSendDialog extends React.Component {
            constructor(props) {
                super(props);
                this.state = { order: null };
            }
            show() {
                ui.showDialog(this.element);
            }
            componentDidMount() {
                let { required } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(page.element, { name: "expressBillNo", rules: [required("请输入快递单号")] }, { name: "expressCompany", rules: [required("请输入快递公民名称")] });
            }
            render() {
                let order = this.state.order;
                let shipInfo = this.state.shipInfo;
                let orderStatus = order ? order.Status : null;
                return [
                    h("div", { key: 10, className: "modal fade", ref: (e) => this.element = e || this.element },
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u53D1\u8D27\u4FE1\u606F")),
                                h("div", { className: "modal-body form-horizontal" },
                                    h("input", { name: "orderId", type: "hidden" }),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u8BA2\u5355\u65F6\u95F4"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "createDateTime", type: "text", className: "form-control", readOnly: true, value: order ? order.OrderDate.toLocaleString() : '' }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u6536\u8D27\u4EBA"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "consignee", type: "text", className: "form-control", readOnly: true, value: order ? order.Consignee : "" }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u6536\u8D27\u5730\u5740"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "receiptAddress", type: "text", className: "form-control", readOnly: true, value: order ? order.ReceiptAddress : "" }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u5FEB\u9012\u5355\u53F7"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "expressBillNo", type: "text", className: "form-control", value: shipInfo ? shipInfo.ExpressBillNo : "", readOnly: orderStatus == "Send", ref: (e) => this.expressBillNoInput = e || this.expressBillNoInput }))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u5FEB\u9012\u516C\u53F8"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "expressCompany", type: "text", className: "form-control", value: shipInfo ? shipInfo.ExpressCompany : "", readOnly: orderStatus == "Send", ref: (e) => this.expressCompanyInput = e || this.expressCompanyInput })))),
                                h("div", { className: "modal-footer" },
                                    h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                    h("button", { type: "submit", className: "btn btn-primary", disabled: orderStatus == "Send" }, "\u4FDD\u5B58"))))),
                ];
            }
        }
        class OrderDetailDialog extends React.Component {
            constructor(props) {
                super(props);
                this.state = { order: null };
            }
            show() {
                ui.showDialog(this.element);
            }
            hide() {
                ui.hideDialog(this.element);
            }
            showReceiveDialog() {
                this.dialog.state.order = this.state.order;
                this.dialog.setState(this.dialog.state);
                this.dialog.show();
            }
            render() {
                let order = this.state.order;
                return [
                    h("div", { key: 10, className: "modal fade", style: { display: 'none' }, ref: (e) => this.element = e || this.element },
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u8BA2\u5355\u4FE1\u606F")),
                                h("div", { className: "modal-body" },
                                    h("table", { className: "table table-striped table-bordered", style: { textAlign: 'left' } },
                                        h("tbody", null,
                                            h("tr", null,
                                                h("td", { className: "fieldHeader", style: { width: 80 } }, "\u8BA2\u5355\u65E5\u671F"),
                                                h("td", { "data-bind": "text: OrderDate" }, order ? order.OrderDate.toLocaleDateString() : ""),
                                                h("td", null, "\u4ED8\u6B3E\u4EBA"),
                                                h("td", { "data-bind": "text: Consignee" }, order ? order.Consignee : "")),
                                            h("tr", null,
                                                h("td", null, "\u53D1\u7968\u4FE1\u606F"),
                                                h("td", { colSpan: 3, "data-bind": "text: Invoice" }, order ? order.Invoice : "")),
                                            h("tr", null,
                                                h("td", null, "\u5907\u6CE8\u4FE1\u606F"),
                                                h("td", { colSpan: 3, "data-bind": "text: Remark" }, order ? order.Remark : "")),
                                            h("tr", null,
                                                h("td", null, "\u6536\u8D27\u5730\u5740"),
                                                h("td", { colSpan: 3, "data-bind": "text: ReceiptAddress" }, order ? order.ReceiptAddress : "")))),
                                    h("table", { className: "table table-striped table-bordered table-hover" },
                                        h("thead", null,
                                            h("tr", null,
                                                h("th", null, "\u540D\u79F0"),
                                                h("th", null, "\u4EF7\u683C"),
                                                h("th", { style: { width: 60 } }, "\u6570\u91CF"))),
                                        h("tbody", { "data-bind": "foreach: OrderDetails" }, (order ? order.OrderDetails : []).filter(o => o != null).map(orderDetail => h("tr", { key: orderDetail.Id },
                                            h("td", { "data-bind": "text: ProductName" }, orderDetail.ProductName),
                                            h("td", { style: { textAlign: 'right' } },
                                                h("span", null,
                                                    "\u00A5",
                                                    orderDetail.Price.toFixed(2))),
                                            h("td", { style: { textAlign: 'right' } }, orderDetail.Quantity)))),
                                        h("tfoot", null,
                                            h("tr", null,
                                                h("td", { colSpan: 3, style: { textAlign: 'right', fontWeight: 'bold' } },
                                                    h("div", { style: { float: 'left' } }, `邮费：¥${order ? order.Freight.toFixed(2) : ''}`),
                                                    h("div", { style: { float: 'right' } }, `小计：¥${order ? order.Amount.toFixed(2) : ''}`),
                                                    h("div", { className: "clearfix" }),
                                                    h("div", { style: { textAlign: 'right' } }, `合计：¥${order ? order.Sum.toFixed(2) : ''}`)))))),
                                h("div", { className: "modal-footer" },
                                    h("button", { type: "button", className: "btn btn-primary", onClick: () => this.showReceiveDialog() }, "\u6536\u6B3E"),
                                    h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"))))),
                    order ? h(ReceivablesDialog, { key: 20, ref: (e) => this.dialog = e }) : null
                ];
            }
        }
        /**
         * 订单收款窗口
         */
        class ReceivablesDialog extends React.Component {
            constructor(props) {
                super(props);
                this.state = { order: null, paymentType: 'weixin' };
            }
            receive() {
                let order = this.state.order;
                console.assert(order != null);
                let amount = order.Sum;
                let paymentType = this.state.paymentType;
                return account.offlinePayOrder(order.Id, order.CustomerId, paymentType, amount)
                    .then(() => {
                    if (this.props.paid)
                        this.props.paid(order);
                    this.hide();
                });
            }
            show() {
                ui.showDialog(this.element);
            }
            hide() {
                ui.hideDialog(this.element);
            }
            render() {
                let order = this.state.order || { Sum: 0 };
                let { paymentType } = this.state;
                return (h("div", { className: "modal fade", ref: (e) => this.element = e || this.element },
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7"),
                                    h("span", { className: "sr-only" }, "Close")),
                                h("h4", { className: "modal-title" }, "\u8BA2\u5355\u6536\u6B3E")),
                            h("form", { className: "modal-body" },
                                h("div", { className: "form-group row" },
                                    h("div", { className: "col-xs-2" }, "\u5E94\u6536\u6B3E"),
                                    h("div", { className: "col-xs-10" },
                                        h("div", { className: "input-group" },
                                            h("div", { className: "input-group-addon" }, "\u00A5"),
                                            h("input", { name: "shouldPay", type: "text", className: "form-control", value: order.Sum, readOnly: true })))),
                                h("div", { className: "form-group row" },
                                    h("div", { className: "col-xs-2" }, "\u5B9E\u6536\u6B3E"),
                                    h("div", { className: "col-xs-10" },
                                        h("input", { name: "actualPay", type: "text", className: "form-control", value: order.Sum, readOnly: true }))),
                                h("div", { className: "from-group row" },
                                    h("div", { className: "col-xs-10 col-xs-offset-2" },
                                        h("label", { className: "radio-inline" },
                                            h("input", { name: "paymentType", type: "radio", checked: paymentType == 'weixin', onChange: () => {
                                                    this.state.paymentType = 'weixin';
                                                    this.setState(this.state);
                                                } }),
                                            "\u5FAE\u4FE1\u6536\u6B3E"),
                                        h("label", { className: "radio-inline" },
                                            h("input", { name: "paymentType", type: "radio", checked: paymentType == 'alipay', onChange: () => {
                                                    this.state.paymentType = 'alipay';
                                                    this.setState(this.state);
                                                } }),
                                            "\u652F\u4ED8\u5B9D\u6536\u6B3E")))),
                            h("div", { className: "modal-footer" },
                                h("button", { type: "button", className: "btn btn-primary", ref: (e) => e ? ui.buttonOnClick(e, () => this.receive(), { toast: "收款成功" }) : null }, "\u786E\u5B9A"),
                                h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"))))));
            }
        }
        class OrderListPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { current_status: "" };
            }
            activeTab(status) {
                if (this.state.current_status == status)
                    return;
                if (status)
                    this.dataSource.selectArguments.filter = `Status = "${status}"`;
                this.state.current_status = status;
                this.dataSource.selectArguments.startRowIndex = 0;
                this.dataSource.select();
                this.setState(this.state);
                // renderTabs(status)
            }
            exportData() {
            }
            showOrderDetailDialog(order) {
                this.orderDetailDialog.state.order = order;
                this.orderDetailDialog.setState(this.orderDetailDialog.state);
                this.orderDetailDialog.show();
            }
            showSendDialog(order) {
                return __awaiter(this, void 0, void 0, function* () {
                    let shipInfo = order.Status == 'Send' ? yield shopping.shipInfo(order.Id) : null;
                    this.orderSendDialog.state.shipInfo = shipInfo;
                    this.orderSendDialog.state.order = order;
                    this.orderSendDialog.setState(this.orderSendDialog.state);
                    this.orderSendDialog.show();
                });
            }
            createCommandCell(dataItem) {
                let self = this;
                let cell = new wuzhui.GridViewDataCell({
                    dataField: 'Status',
                    render(value) {
                        ReactDOM.render([
                            h("button", { key: "toSend", className: "btn btn-success btn-minier", ref: (e) => e ? e.onclick = ui.buttonOnClick(() => self.showSendDialog(dataItem)) : null },
                                h("i", { className: "icon-truck" }),
                                h("span", null, value == 'Send' ? '已发货' : '待发货')),
                            h("button", { key: "detail", className: "btn btn-info btn-minier", style: { marginLeft: 4 }, ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = (e) => self.showOrderDetailDialog(dataItem);
                                } },
                                h("i", { className: "icon-cog" }),
                                h("span", null, "\u8BE6\u7EC6"))
                        ], cell.element);
                    }
                });
                return cell;
            }
            createStatusCell(dataItem) {
                let self = this;
                let cell = new wuzhui.GridViewDataCell({
                    dataField: 'Status',
                    render(value) {
                        ReactDOM.render(value == 'WaitingForPayment' ?
                            h("button", { className: "btn btn-purple btn-minier", onClick: () => {
                                    self.receivablesDialog.state.order = dataItem;
                                    self.receivablesDialog.setState(self.receivablesDialog.state);
                                    self.receivablesDialog.show();
                                } }, shopping_1.ShoppingService.orderStatusText(value)) :
                            h("span", null, shopping_1.ShoppingService.orderStatusText(value)), cell.element);
                    }
                });
                return cell;
            }
            componentDidMount() {
                this.dataSource = new wuzhui.DataSource({
                    select: (args) => shopping.orders(args)
                });
                wz.appendGridView(page.element, {
                    dataSource: this.dataSource,
                    columns: [
                        new wz.BoundField({
                            dataField: 'OrderDate', headerText: '订单日期', dataFormatString: '{G}',
                            headerStyle: { width: '100px' },
                            sortExpression: 'OrderDate'
                        }),
                        new wz.BoundField({
                            dataField: 'Serial', headerText: '订单号', sortExpression: 'Serial',
                            headerStyle: { width: '120px' }
                        }),
                        new wz.BoundField({
                            dataField: 'Consignee', headerText: '收货人',
                            headerStyle: { width: '100px' }
                        }),
                        new wz.BoundField({
                            dataField: 'ReceiptAddress', headerText: '收货地址'
                        }),
                        new wz.CustomField({
                            headerText: '状态',
                            itemStyle: { textAlign: 'center', width: '80px' },
                            createItemCell: (order) => this.createStatusCell(order)
                        }),
                        new wz.BoundField({
                            dataField: 'Amount', headerText: '金额', dataFormatString: '￥{C2}',
                            itemStyle: { textAlign: 'right' }
                        }),
                        new wz.CustomField({
                            createItemCell: (order) => this.createCommandCell(order),
                            headerText: '操作',
                            headerStyle: { width: '140px' },
                            itemStyle: { textAlign: 'center' },
                        })
                    ],
                    pageSize: 10
                });
            }
            on_paid(order) {
                order.Status = 'Paid';
                this.dataSource.updated.fire(this.dataSource, order);
            }
            render() {
                let status = this.state.current_status;
                return [
                    h("ul", { key: "tabs", id: "myTab", className: "nav nav-tabs" },
                        h("li", { className: !status ? "active" : "", onClick: () => this.activeTab('') },
                            h("a", { href: "javascript:" }, "\u5168\u90E8")),
                        h("li", { className: status == 'WaitingForPayment' ? 'active' : '', onClick: () => this.activeTab('WaitingForPayment') },
                            h("a", { href: "javascript:" }, "\u5F85\u4ED8\u6B3E")),
                        h("li", { className: status == 'Canceled' ? 'active' : '', onClick: () => this.activeTab('Canceled') },
                            h("a", { href: "javascript:" }, "\u5DF2\u53D6\u6D88")),
                        h("li", { className: status == 'Paid' ? 'active' : '', onClick: () => this.activeTab('Paid') },
                            h("a", { href: "javascript:" }, "\u5DF2\u4ED8\u6B3E")),
                        h("li", { className: status == 'Send' ? 'active' : '', onClick: () => this.activeTab('Send') },
                            h("a", { href: "javascript:", "data-bind": "click: send" }, "\u5DF2\u53D1\u8D27")),
                        h("li", { className: status == 'Received' ? 'active' : '', onClick: () => this.activeTab('Received') },
                            h("a", { href: "javascript:" }, "\u5DF2\u6536\u8D27")),
                        h("li", { className: "pull-right" },
                            h("button", { onClick: () => this.exportData(), className: "btn btn-sm btn-primary", "data-toggle": "dropdown" },
                                h("i", { className: "icon-download-alt" }),
                                h("span", null, "\u5BFC\u51FA\u53D1\u8D27\u5355")),
                            h("div", { className: "form-horizontal", style: { display: 'none' }, "data-role": "export" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-3 control-label" }, "\u5F00\u59CB\u65F6\u95F4"),
                                    h("div", { className: "col-sm-9" },
                                        h("input", { "data-bind": "value: beginDate", name: "begin", className: "form-control", type: "text", placeholder: "填写订单的下单日期" }))),
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-3 control-label" }, "\u7ED3\u675F\u65F6\u95F4"),
                                    h("div", { className: "col-sm-9" },
                                        h("input", { "data-bind": "value: endDate", name: "end", className: "form-control", type: "text", placeholder: "填写订单的下单日期" }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-sm-12" },
                                        h("a", { "data-bind": "attr: { href: exportUrl }", className: "btn btn-sm btn-primary btn-block" }, "\u786E\u5B9A"))))),
                        h("li", { className: "pull-right" },
                            h("button", { "data-bind": "click: search", className: "btn btn-primary btn-sm" },
                                h("i", { className: "icon-search" }),
                                h("span", null, "\u641C\u7D22"))),
                        h("li", { className: "pull-right" },
                            h("input", { type: "text", "data-bind": "value: searchText", className: "form-control", style: { width: 300 }, placeholder: "请输入系统订单号或微信订单号或付款人" }))),
                    h("table", { key: "orders", ref: (e) => this.ordersTable = e || this.ordersTable }),
                    h(OrderSendDialog, { key: "orderSend", ref: (e) => this.orderSendDialog = e || this.orderSendDialog }),
                    h(OrderDetailDialog, { key: "orderDetail", ref: (e) => this.orderDetailDialog = e || this.orderDetailDialog }),
                    h(ReceivablesDialog, { key: "receivablesDialog", paid: (o) => this.on_paid(o), ref: (e) => this.receivablesDialog = e || this.receivablesDialog })
                ];
            }
        }
        ReactDOM.render(h(OrderListPage, null), page.element);
    }
    exports.default = default_1;
});
