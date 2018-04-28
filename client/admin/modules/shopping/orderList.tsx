import * as wz from 'myWuZhui';
import { ShoppingService } from 'services/shopping';
import { AccountService } from 'services/account';

import { FormValidator, rules } from 'dilu';

export default function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);
    let account = page.createService(AccountService);

    /**
     * 订单发货窗口
     */
    class OrderSendDialog extends React.Component<{} & React.Props<OrderSendDialog>,
        { order: Order, shipInfo?: ShipInfo }>{
        private element: HTMLElement;
        private expressBillNoInput: HTMLInputElement;
        private expressCompanyInput: HTMLInputElement;
        private validator: FormValidator;
        constructor(props) {
            super(props);
            this.state = { order: null };
        }
        show() {
            ui.showDialog(this.element);
        }
        componentDidMount() {
            let { required } = rules;
            this.validator = new FormValidator(page.element,
                { name: "expressBillNo", rules: [required("请输入快递单号")] },
                { name: "expressCompany", rules: [required("请输入快递公民名称")] }
            )
        }
        render() {
            let order = this.state.order;
            let shipInfo = this.state.shipInfo;
            let orderStatus = order ? order.Status : null;
            return [
                <div key={10} className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
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
                                        <input name="createDateTime" type="text" className="form-control" readOnly={true}
                                            value={order ? order.OrderDate.toLocaleString() : ''} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">收货人</label>
                                    <div className="col-sm-10">
                                        <input name="consignee" type="text" className="form-control" readOnly={true}
                                            value={order ? order.Consignee : ""} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">收货地址</label>
                                    <div className="col-sm-10">
                                        <input name="receiptAddress" type="text" className="form-control" readOnly={true}
                                            value={order ? order.ReceiptAddress : ""} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">快递单号</label>
                                    <div className="col-sm-10">
                                        <input name="expressBillNo" type="text" className="form-control"
                                            value={shipInfo ? shipInfo.ExpressBillNo : ""}
                                            readOnly={orderStatus == "Send"}
                                            ref={(e: HTMLInputElement) => this.expressBillNoInput = e || this.expressBillNoInput}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">快递公司</label>
                                    <div className="col-sm-10">
                                        <input name="expressCompany" type="text" className="form-control"
                                            value={shipInfo ? shipInfo.ExpressCompany : ""}
                                            readOnly={orderStatus == "Send"}
                                            ref={(e: HTMLInputElement) => this.expressCompanyInput = e || this.expressCompanyInput} />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="submit" className="btn btn-primary" disabled={orderStatus == "Send"}>保存</button>
                            </div>
                        </div>
                    </div>
                </div>,

            ];
        }
    }

    class OrderDetailDialog extends React.Component<any, { order: Order }> {
        private element: HTMLElement;
        private dialog: ReceivablesDialog;

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
                <div key={10} className="modal fade" style={{ display: 'none' }}
                    ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">订单信息</h4>
                            </div>
                            <div className="modal-body">
                                <table className="table table-striped table-bordered" style={{ textAlign: 'left' }}>
                                    <tbody>
                                        <tr>
                                            <td className="fieldHeader" style={{ width: 80 }}>订单日期</td>
                                            <td data-bind="text: OrderDate">{order ? order.OrderDate.toLocaleDateString() : ""}</td>
                                            <td>付款人</td>
                                            <td data-bind="text: Consignee">{order ? order.Consignee : ""}</td>
                                        </tr>
                                        <tr>
                                            <td>发票信息</td>
                                            <td colSpan={3} data-bind="text: Invoice">{order ? order.Invoice : ""}</td>
                                        </tr>
                                        <tr>
                                            <td>备注信息</td>
                                            <td colSpan={3} data-bind="text: Remark">{order ? order.Remark : ""}</td>
                                        </tr>
                                        <tr>
                                            <td>收货地址</td>
                                            <td colSpan={3} data-bind="text: ReceiptAddress">{order ? order.ReceiptAddress : ""}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>名称</th>
                                            <th>价格</th>
                                            <th style={{ width: 60 }}>数量</th>
                                        </tr>
                                    </thead>
                                    <tbody data-bind="foreach: OrderDetails">
                                        {(order ? order.OrderDetails : []).filter(o => o != null).map(orderDetail =>
                                            <tr key={orderDetail.Id}>
                                                <td data-bind="text: ProductName">{orderDetail.ProductName}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <span>
                                                        ¥{orderDetail.Price.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {orderDetail.Quantity}
                                                </td>

                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                <div style={{ float: 'left' }}>
                                                    {`邮费：¥${order ? order.Freight.toFixed(2) : ''}`}
                                                </div>
                                                <div style={{ float: 'right' }}>
                                                    {`小计：¥${order ? order.Amount.toFixed(2) : ''}`}
                                                </div>
                                                <div className="clearfix"></div>
                                                <div style={{ textAlign: 'right' }}>
                                                    {`合计：¥${order ? order.Sum.toFixed(2) : ''}`}
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => this.showReceiveDialog()}>收款</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            </div>
                        </div>

                    </div>
                </div>,
                order ? <ReceivablesDialog key={20} ref={(e) => this.dialog = e} /> : null
            ];
        }
    }

    /**
     * 订单收款窗口
     */
    class ReceivablesDialog extends React.Component<
        { paid?: (order: Order) => void } & React.Props<ReceivablesDialog>, { order: Order, paymentType: 'weixin' | 'alipay' }>{

        private element: HTMLElement;
        private acutalAmount: number;

        constructor(props) {
            super(props);
            this.state = { order: null, paymentType: 'weixin' };
        }
        private receive() {
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
            let order = this.state.order || { Sum: 0 } as Order;
            let { paymentType } = this.state;
            return (
                <div className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">订单收款</h4>
                            </div>
                            <form className="modal-body">
                                <div className="form-group row">
                                    <div className="col-xs-2">
                                        应收款
                                    </div>
                                    <div className="col-xs-10">
                                        <div className="input-group">
                                            <div className="input-group-addon">¥</div>
                                            <input name="shouldPay" type="text" className="form-control" value={order.Sum as any} readOnly={true} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-xs-2">
                                        实收款
                                    </div>
                                    <div className="col-xs-10">
                                        <input name="actualPay" type="text" className="form-control" value={order.Sum as any} readOnly={true} />
                                    </div>
                                </div>
                                <div className="from-group row">
                                    <div className="col-xs-10 col-xs-offset-2">
                                        <label className="radio-inline">
                                            <input name="paymentType" type="radio" checked={paymentType == 'weixin'}
                                                onChange={() => {
                                                    this.state.paymentType = 'weixin';
                                                    this.setState(this.state);
                                                }} />
                                            微信收款
                                        </label>
                                        <label className="radio-inline">
                                            <input name="paymentType" type="radio" checked={paymentType == 'alipay'}
                                                onChange={() => {
                                                    this.state.paymentType = 'alipay';
                                                    this.setState(this.state);
                                                }} />
                                            支付宝收款
                                        </label>
                                    </div>
                                </div>
                            </form>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary"
                                    ref={(e: HTMLButtonElement) => e ? ui.buttonOnClick(e, () => this.receive(), { toast: "收款成功" }) : null}>确定</button>
                                <button type="button" className="btn btn-default" data-dismiss="modal">
                                    取消
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    class OrderListPage extends React.Component<any,
        { current_status: string }>{
        orderSendDialog: OrderSendDialog;
        orderDetailDialog: OrderDetailDialog;
        receivablesDialog: ReceivablesDialog;

        private dataSource: wuzhui.DataSource<Order>;
        private ordersTable: HTMLTableElement;

        constructor(props) {
            super(props);
            this.state = { current_status: "" }
        }
        activeTab(status: string) {
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
        showOrderDetailDialog(order: Order) {
            this.orderDetailDialog.state.order = order;
            this.orderDetailDialog.setState(this.orderDetailDialog.state);
            this.orderDetailDialog.show();
        }
        async showSendDialog(order: Order) {
            let shipInfo = order.Status == 'Send' ? await shopping.shipInfo(order.Id) : null
            this.orderSendDialog.state.shipInfo = shipInfo;
            this.orderSendDialog.state.order = order;
            this.orderSendDialog.setState(this.orderSendDialog.state);
            this.orderSendDialog.show();
        }
        createCommandCell(dataItem: Order) {
            let self = this;
            let cell = new wuzhui.GridViewDataCell({
                dataField: 'Status',
                render(value) {
                    ReactDOM.render(
                        [
                            <button key="toSend" className="btn btn-success btn-minier"
                                ref={(e: HTMLButtonElement) => e ? e.onclick = ui.buttonOnClick(() => self.showSendDialog(dataItem)) : null}>
                                <i className="icon-truck"></i>
                                <span>{value == 'Send' ? '已发货' : '待发货'}</span>
                            </button>,
                            <button key="detail" className="btn btn-info btn-minier" style={{ marginLeft: 4 }}
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = (e) => self.showOrderDetailDialog(dataItem);
                                }}>
                                <i className="icon-cog"></i>
                                <span>详细</span>
                            </button>
                        ]
                        , cell.element)
                }
            });
            return cell;
        }
        createStatusCell(dataItem: Order) {
            let self = this;
            let cell = new wuzhui.GridViewDataCell({
                dataField: 'Status',
                render(value) {
                    ReactDOM.render(
                        value == 'WaitingForPayment' ?
                            <button className="btn btn-purple btn-minier"
                                onClick={() => {
                                    self.receivablesDialog.state.order = dataItem;
                                    self.receivablesDialog.setState(self.receivablesDialog.state);
                                    self.receivablesDialog.show();
                                }}>{ShoppingService.orderStatusText(value)}</button> :
                            <span>{ShoppingService.orderStatusText(value)}</span>,
                        cell.element);
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
                        headerStyle: { width: '100px' } as CSSStyleDeclaration,
                        sortExpression: 'OrderDate'
                    }),
                    new wz.BoundField({
                        dataField: 'Serial', headerText: '订单号', sortExpression: 'Serial',
                        headerStyle: { width: '120px' } as CSSStyleDeclaration
                    }),
                    new wz.BoundField({
                        dataField: 'Consignee', headerText: '收货人',
                        headerStyle: { width: '100px' } as CSSStyleDeclaration
                    }),
                    new wz.BoundField({
                        dataField: 'ReceiptAddress', headerText: '收货地址'
                    }),
                    new wz.CustomField({
                        headerText: '状态',//dataField: 'StatusText',
                        itemStyle: { textAlign: 'center', width: '80px' } as CSSStyleDeclaration,
                        createItemCell: (order: Order) => this.createStatusCell(order)
                    }),
                    new wz.BoundField({
                        dataField: 'Amount', headerText: '金额', dataFormatString: '￥{C2}',
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration
                    }),
                    new wz.CustomField({
                        createItemCell: (order: Order) => this.createCommandCell(order),
                        headerText: '操作',
                        headerStyle: { width: '140px' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                    })
                ],
                pageSize: 10
            });
        }
        on_paid(order: Order) {
            order.Status = 'Paid';
            this.dataSource.updated.fire(this.dataSource, order)
        }
        render() {
            let status = this.state.current_status;
            return [
                <ul key="tabs" id="myTab" className="nav nav-tabs">
                    <li className={!status ? "active" : ""}
                        onClick={() => this.activeTab('')}>
                        <a href="javascript:">全部</a>
                    </li>
                    <li className={status == 'WaitingForPayment' ? 'active' : ''}
                        onClick={() => this.activeTab('WaitingForPayment')} >
                        <a href="javascript:">待付款</a>
                    </li>
                    <li className={status == 'Canceled' ? 'active' : ''}
                        onClick={() => this.activeTab('Canceled')}>
                        <a href="javascript:">已取消</a>
                    </li>
                    <li className={status == 'Paid' ? 'active' : ''}
                        onClick={() => this.activeTab('Paid')}>
                        <a href="javascript:">已付款</a>
                    </li>
                    {/* <li className={status == 'WaitingForSend' ? 'active' : ''}
                        onClick={() => this.activeTab('WaitingForSend')}>
                        <a href="javascript:">待发货</a>
                    </li> */}
                    <li className={status == 'Send' ? 'active' : ''}
                        onClick={() => this.activeTab('Send')}>
                        <a href="javascript:" data-bind="click: send">已发货</a>
                    </li>
                    <li className={status == 'Received' ? 'active' : ''}
                        onClick={() => this.activeTab('Received')}>
                        <a href="javascript:">已收货</a>
                    </li>
                    <li className="pull-right">
                        <button onClick={() => this.exportData()} className="btn btn-sm btn-primary" data-toggle="dropdown">
                            <i className="icon-download-alt" />
                            <span>导出发货单</span>
                        </button>
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
                        <button data-bind="click: search" className="btn btn-primary btn-sm">
                            <i className="icon-search" />
                            <span>搜索</span>
                        </button>
                    </li>
                    <li className="pull-right">
                        <input type="text" data-bind="value: searchText" className="form-control" style={{ width: 300 }} placeholder="请输入系统订单号或微信订单号或付款人" />
                    </li>
                </ul>,
                <table key="orders" ref={(e: HTMLTableElement) => this.ordersTable = e || this.ordersTable}>
                </table>,
                <OrderSendDialog key="orderSend" ref={(e) => this.orderSendDialog = e || this.orderSendDialog} />,
                <OrderDetailDialog key="orderDetail" ref={(e) => this.orderDetailDialog = e || this.orderDetailDialog} />,
                <ReceivablesDialog key="receivablesDialog" paid={(o) => this.on_paid(o)} ref={(e) => this.receivablesDialog = e || this.receivablesDialog} />
            ];
        }
    }

    ReactDOM.render(<OrderListPage />, page.element);



}



