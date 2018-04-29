import { defaultNavBar, app, formatDate } from 'site';
import { ShoppingService } from 'user/services/shoppingService';
import { AccountService } from 'user/services/accountService';
import * as ui from 'ui';
import siteMap from 'siteMap';


export default function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);
    let accout = page.createService(AccountService);
    type PayType = 'balance' | 'weixin' | 'alipay';
    class PurchasePage extends React.Component<{ order: Order }, { payType: PayType }> {
        constructor(props) {
            super(props);
            this.state = { payType: 'balance' };
        }
        private balancePurchase(order: Order) {
            console.assert(order.Sum != null);
            console.assert(order.Sum == order.Amount + order.Freight);
            return accout.payOrder(order.Id, order.Sum);
        }
        render() {
            let order = this.props.order;
            return [
                <header key="h">
                    {defaultNavBar(page, { title: '订单概况' })}
                </header>,
                <section key="v">
                    <div className="container">
                        <div className="row" style={{ paddingBottom: 10 }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>订单状态</label>
                            <div className="col-xs-9" style={{ color: '#f70' }}>
                                {shopping.orderStatusText(order.Status)}
                            </div>
                        </div>
                        <div className="row" style={{ paddingBottom: 10 }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>订单编号</label>
                            <div className="col-xs-9">{order.Serial}</div>
                        </div>
                        <div className="row" style={{ paddingBottom: 10 }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>订单总计</label>
                            <div className="col-xs-9 price">￥{order.Sum.toFixed(2)}</div>
                        </div>
                        <div className="row" style={{ paddingBottom: 10 }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>收货信息</label>
                            <div className="col-xs-9">{order.ReceiptAddress}</div>
                        </div>
                        <div className="row" style={{ paddingBottom: 10 }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>发票信息</label>
                            <div className="col-xs-9">{order.Invoice}</div>
                        </div>
                        <div className="row" style={{ paddingBottom: 10 }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>下单时间</label>
                            <div className="col-xs-9" data-bind="text:['{0:g}', order.OrderDate]">
                                {formatDate(order.OrderDate)}
                            </div>
                        </div>
                        {order.Remark ?
                            <div data-bind="visible:ko.unwrap(order.Remark)" className="row" style={{ paddingBottom: 10 }}>
                                <label className="col-xs-3" style={{ paddingRight: 0 }}>订单备注</label>
                                <div className="col-xs-9">
                                    {order.Remark}
                                </div>
                            </div> : null}
                        <div style={{ marginBottom: 10 }}>
                            提示：请在下单24小时内付款，过期后订单将自动取消。
                    </div>
                        <hr className="row" />
                        <button className="cust-prop selected">
                            余额支付
                    </button>
                        <button className="cust-prop">
                            微信支付
                    </button>
                    </div>
                </section>,
                <footer key="f">
                    {order.Status == 'WaitingForPayment' ?
                        <div className="container">
                            <div className="form-group">
                                <button className="btn btn-block btn-primary"
                                    ref={(o: HTMLButtonElement) => {
                                        if (!o) return;
                                        o.onclick = ui.buttonOnClick(() => {
                                            return this.balancePurchase(order).then(() => {
                                                app.redirect(siteMap.nodes.shopping_orderList);//'shopping_orderList'
                                            });
                                        })
                                    }}>立即支付</button>
                            </div>
                        </div> : null}
                </footer>
            ];
        }
    }

    shopping.order(page.data.id).then(order => {
        ReactDOM.render(<PurchasePage order={order} />, page.element);
    })
}