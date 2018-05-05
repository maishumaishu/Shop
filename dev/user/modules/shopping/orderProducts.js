var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/site", "user/services/shoppingService", "user/services/shoppingCartService", "user/services/accountService", "user/services/userData", "user/siteMap"], function (require, exports, site_1, shoppingService_1, shoppingCartService_1, accountService_1, userData_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let shop = page.createService(shoppingService_1.ShoppingService);
            let shoppingCart = page.createService(shoppingCartService_1.ShoppingCartService);
            let account = page.createService(accountService_1.AccountService);
            class OrderPage extends React.Component {
                constructor(props) {
                    super(props);
                    // this.setStateByOrder(this.props.order);
                    this.state = { order: this.props.order };
                    this.setAddress = (address, order) => {
                        Object.assign(this.state.order, order);
                        this.state.order.ReceiptAddress = address;
                        this.setState(this.state);
                    };
                }
                showCoupons() {
                }
                showInvoice() {
                }
                confirmOrder() {
                    let order = this.props.order;
                    let orderId = order.Id;
                    let remark = order.Remark;
                    let invoice = order.Invoice;
                    return shop.confirmOrder(orderId, remark, invoice).then(() => {
                        let productIds = order.OrderDetails.map(o => o.ProductId);
                        shoppingCart.removeItems(productIds);
                        site_1.app.redirect(siteMap_1.default.nodes.shopping_purchase, { id: orderId }); // `shopping_purchase?id=${order.Id}`);
                    });
                }
                showReceiptList() {
                    let routeValue = { callback: this.setAddress, orderId: this.state.order.Id };
                    site_1.app.redirect(siteMap_1.default.nodes.user_receiptList, routeValue); //'user_receiptList'
                }
                render() {
                    let order = this.state.order;
                    // let balance = this.props.balance;
                    return [
                        h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '确认订单' })),
                        h("footer", { key: "f" },
                            h("div", { className: "container", style: { paddingTop: 10, paddingBottom: 10 } },
                                h("button", { onClick: () => this.confirmOrder(), className: "btn btn-block btn-primary", disabled: (order.ReceiptAddress || "") == "" }, "\u63D0\u4EA4\u8BA2\u5355"))),
                        h("section", { key: "v" },
                            h("div", { className: "container" },
                                h("h4", { className: "text-primary" }, "\u6536\u8D27\u4FE1\u606F"),
                                h("a", { style: { minHeight: 40, display: order.ReceiptAddress ? 'none' : 'block' }, onClick: () => this.showReceiptList() },
                                    h("div", { className: "alert alert-danger text-center" }, "\u70B9\u51FB\u8FD9\u91CC\u8BBE\u7F6E\u6536\u8D27\u4FE1\u606F")),
                                h("a", { onClick: () => this.showReceiptList(), className: "address", style: { minHeight: 40, display: order.ReceiptAddress ? 'block' : 'none' } },
                                    h("div", { className: "pull-left", style: { paddingRight: 20 } },
                                        h("span", { className: "small" }, order.ReceiptAddress)),
                                    h("div", { className: "pull-right" },
                                        h("i", { className: "icon-chevron-right" })))),
                            h("hr", { style: { margin: 0, borderTopWidth: 10 } }),
                            h("div", { className: "container" },
                                h("h4", { className: "text-primary" }, "\u8D2D\u7269\u6E05\u5355")),
                            h("div", { className: "container" },
                                h("ul", { "data-bind": "foreach: order.OrderDetails", className: "list-group row", style: { marginBottom: 0 } }, order.OrderDetails.map((o, i) => (h("li", { key: i, "data-bind": "visible:ko.unwrap(Price) >= 0", className: "list-group-item" },
                                    h("div", { className: "pull-left", style: { width: 60, height: 60 } },
                                        h("img", { src: o.ImageUrl, className: "img-responsive", ref: (e) => e ? ui.renderImage(e) : null })),
                                    h("div", { style: { marginLeft: 70 } },
                                        h("div", { style: { marginBottom: 10 } },
                                            h("a", { href: `#home_product?id=${o.ProductId}`, className: "title" }, o.ProductName)),
                                        h("div", { className: "pull-left" },
                                            h("span", { className: "price" },
                                                "\uFFE5",
                                                o.Price.toFixed(2)),
                                            (o.Score ? h("span", null,
                                                " + ",
                                                o.Score,
                                                " \u79EF\u5206") : null)),
                                        h("div", { className: "pull-right" },
                                            h("span", { style: { paddingLeft: 10 } },
                                                "X ",
                                                o.Quantity))),
                                    h("div", { className: "clearfix" })))))),
                            h("hr", { style: { margin: 0, borderTopWidth: 10 } }),
                            h("div", { className: "container" },
                                h("h4", { className: "pull-left" }, "\u914D\u9001\u65B9\u5F0F"),
                                h("div", { className: "pull-right", style: { paddingTop: 6 } },
                                    h("span", null,
                                        "\u5FEB\u9012 \u8FD0\u8D39\uFF1A",
                                        h("span", { className: "price" },
                                            "\uFFE5",
                                            order.Freight.toFixed(2))))),
                            h("hr", { style: { margin: 0, borderTopWidth: 10 } }),
                            order.CouponTitle ?
                                h("div", { onClick: () => this.showCoupons(), className: "container" },
                                    h("h4", { className: "pull-left" }, "\u4F18\u60E0\u5238"),
                                    h("div", { className: "pull-right", style: { paddingTop: 6 } },
                                        h("span", { style: { paddingRight: 4 } }, order.CouponTitle),
                                        h("i", { className: "icon-chevron-right" }))) : null,
                            order.CouponTitle ?
                                h("hr", { "data-bind": "visible:order.CouponTitle", style: { margin: 0, borderTopWidth: 10 } })
                                : null,
                            h("div", { className: "container", onClick: () => site_1.app.showPage(siteMap_1.default.nodes.shopping_invoice, {
                                    callback: (invoice) => {
                                        this.state.order.Invoice = invoice;
                                        this.setState(this.state);
                                    }
                                }) },
                                h("h4", { className: "pull-left" }, "\u53D1\u7968\u4FE1\u606F"),
                                h("div", { className: "pull-right", style: { paddingTop: 6 } },
                                    h("span", { style: { paddingRight: 10 } }, order.Invoice),
                                    h("i", { className: "icon-chevron-right" }))),
                            h("hr", { style: { margin: 0, borderTopWidth: 10 } }),
                            h("div", { className: "container", style: { padding: 10 } },
                                h("input", { name: "remark", type: "text", multiple: true, style: { width: '100%', height: 40, border: '1px solid #dddddd' }, placeholder: " 若你对订单有特殊性要求，可以在此备注" })),
                            h("div", { className: "container" },
                                h("div", { className: "row" },
                                    h("div", { className: "col-xs-4" }, "\u5546\u54C1"),
                                    h("div", { className: "col-xs-8 text-right" },
                                        h("span", { style: { paddingRight: 4 } }, "+"),
                                        h("span", { className: "price" },
                                            "\uFFE5",
                                            order.Amount.toFixed(2)))),
                                h("div", { className: "row" },
                                    h("div", { className: "col-xs-4" }, "\u8FD0\u8D39"),
                                    h("div", { className: "col-xs-8 text-right" },
                                        h("span", { style: { paddingRight: 4 } }, "+"),
                                        h("span", { className: "price" },
                                            "\uFFE5",
                                            order.Freight.toFixed(2)))),
                                h("div", { className: "row" },
                                    h("div", { className: "col-xs-4" }, "\u4F18\u60E0"),
                                    h("div", { className: "col-xs-8 text-right" },
                                        h("span", { style: { paddingRight: 6 } }, "-"),
                                        h("span", { className: "price" },
                                            "\uFFE5",
                                            (order.Discount || 0).toFixed(2)))),
                                h("div", { className: "col-xs-12", style: { padding: 0, paddingTop: 8 } },
                                    h("div", { className: "pull-right" },
                                        h("span", null,
                                            "\u603B\u8BA1\uFF1A",
                                            h("span", { className: "price" },
                                                h("strong", null,
                                                    "\uFFE5",
                                                    order.Sum.toFixed(2))))))))
                    ];
                }
            }
            let id = page.data.id;
            let order = yield shop.order(id);
            ReactDOM.render(h(OrderPage, { order: order, balance: userData_1.userData.balance.value }), page.element);
        });
    }
    exports.default = default_1;
});
