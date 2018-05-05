define(["require", "exports", "user/site", "user/services/shoppingService", "user/services/accountService", "ui", "user/siteMap"], function (require, exports, site_1, shoppingService_1, accountService_1, ui, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shoppingService_1.ShoppingService);
        let accout = page.createService(accountService_1.AccountService);
        class PurchasePage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { payType: 'balance' };
            }
            balancePurchase(order) {
                console.assert(order.Sum != null);
                console.assert(order.Sum == order.Amount + order.Freight);
                return accout.payOrder(order.Id, order.Sum);
            }
            render() {
                let order = this.props.order;
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '订单概况' })),
                    h("section", { key: "v" },
                        h("div", { className: "container" },
                            h("div", { className: "row", style: { paddingBottom: 10 } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u8BA2\u5355\u72B6\u6001"),
                                h("div", { className: "col-xs-9", style: { color: '#f70' } }, shopping.orderStatusText(order.Status))),
                            h("div", { className: "row", style: { paddingBottom: 10 } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u8BA2\u5355\u7F16\u53F7"),
                                h("div", { className: "col-xs-9" }, order.Serial)),
                            h("div", { className: "row", style: { paddingBottom: 10 } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u8BA2\u5355\u603B\u8BA1"),
                                h("div", { className: "col-xs-9 price" },
                                    "\uFFE5",
                                    order.Sum.toFixed(2))),
                            h("div", { className: "row", style: { paddingBottom: 10 } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u6536\u8D27\u4FE1\u606F"),
                                h("div", { className: "col-xs-9" }, order.ReceiptAddress)),
                            h("div", { className: "row", style: { paddingBottom: 10 } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u53D1\u7968\u4FE1\u606F"),
                                h("div", { className: "col-xs-9" }, order.Invoice)),
                            h("div", { className: "row", style: { paddingBottom: 10 } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u4E0B\u5355\u65F6\u95F4"),
                                h("div", { className: "col-xs-9", "data-bind": "text:['{0:g}', order.OrderDate]" }, site_1.formatDate(order.OrderDate))),
                            order.Remark ?
                                h("div", { "data-bind": "visible:ko.unwrap(order.Remark)", className: "row", style: { paddingBottom: 10 } },
                                    h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u8BA2\u5355\u5907\u6CE8"),
                                    h("div", { className: "col-xs-9" }, order.Remark)) : null,
                            h("div", { style: { marginBottom: 10 } }, "\u63D0\u793A\uFF1A\u8BF7\u5728\u4E0B\u535524\u5C0F\u65F6\u5185\u4ED8\u6B3E\uFF0C\u8FC7\u671F\u540E\u8BA2\u5355\u5C06\u81EA\u52A8\u53D6\u6D88\u3002"),
                            h("hr", { className: "row" }),
                            h("button", { className: "cust-prop selected" }, "\u4F59\u989D\u652F\u4ED8"),
                            h("button", { className: "cust-prop" }, "\u5FAE\u4FE1\u652F\u4ED8"))),
                    h("footer", { key: "f" }, order.Status == 'WaitingForPayment' ?
                        h("div", { className: "container" },
                            h("div", { className: "form-group" },
                                h("button", { className: "btn btn-block btn-primary", ref: (o) => {
                                        if (!o)
                                            return;
                                        o.onclick = ui.buttonOnClick(() => {
                                            return this.balancePurchase(order).then(() => {
                                                site_1.app.redirect(siteMap_1.default.nodes.shopping_orderList); //'shopping_orderList'
                                            });
                                        });
                                    } }, "\u7ACB\u5373\u652F\u4ED8"))) : null)
                ];
            }
        }
        shopping.order(page.data.id).then(order => {
            ReactDOM.render(h(PurchasePage, { order: order }), page.element);
        });
    }
    exports.default = default_1;
});
