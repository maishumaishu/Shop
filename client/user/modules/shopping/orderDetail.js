define(["require", "exports", "site", "user/services/shoppingService", "ui"], function (require, exports, site_1, shoppingService_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shoppingService_1.ShoppingService);
        class OrderDetailPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { order: this.props.order };
            }
            purchase() {
                return Promise.reject(null);
            }
            confirmReceived() {
                return Promise.reject(null);
            }
            cancelOrder(order) {
                return shopping.cancelOrder(order.Id).then((data) => {
                    order.Status = data.Status;
                    this.setState(this.state);
                });
            }
            render() {
                let order = this.state.order;
                return [
                    h("header", null, site_1.defaultNavBar(page, { title: '订单详情' })),
                    h("section", null,
                        h("div", { className: "container order", style: { paddingTop: 10 } },
                            h("div", { className: "list" },
                                h("div", { className: "form-group" },
                                    h("label", null, "\u8BA2\u5355\u72B6\u6001\uFF1A"),
                                    h("span", { style: { color: '#f70' } }, shopping.orderStatusText(order.Status))),
                                h("div", { className: "form-group" },
                                    h("label", null, "\u8BA2\u5355\u7F16\u53F7\uFF1A"),
                                    h("span", null, order.Serial)),
                                h("div", { className: "form-group" },
                                    h("label", { className: "pull-left" }, "\u8BA2\u5355\u603B\u8BA1\uFF1A"),
                                    h("div", null,
                                        h("span", { className: "price" },
                                            "\u00A5",
                                            order.Sum.toFixed(2)),
                                        h("span", { style: { paddingLeft: 10 } },
                                            "(\u8FD0\u8D39\uFF1A\u00A5",
                                            order.Freight.toFixed(2),
                                            ")")),
                                    h("div", { className: "clearfix" })),
                                h("div", { className: "form-group" },
                                    h("label", { className: "pull-left" }, "\u6536\u8D27\u4FE1\u606F\uFF1A"),
                                    h("div", { style: { marginLeft: 70 } }, order.ReceiptAddress),
                                    h("div", { className: "clearfix" })),
                                h("div", { className: "form-group" },
                                    h("label", null, "\u4E0B\u5355\u65F6\u95F4\uFF1A"),
                                    h("span", null, site_1.formatDate(order.OrderDate))),
                                order.Status == 'WaitingForPayment' ?
                                    h("div", { className: "form-group" },
                                        h("button", { className: "btn btn-block btn-primary", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => this.purchase());
                                            } }, "\u5FAE\u4FE1\u652F\u4ED8")) : null,
                                order.Status == 'Send' ?
                                    h("div", { className: "form-group" },
                                        h("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => this.confirmReceived(), { confirm: '你确定收到货了吗？' });
                                            } }, "\u786E\u8BA4\u6536\u8D27")) : null)),
                        h("div", { "data-bind": "visible:expressCompany", className: "container order", style: { display: 'none' } },
                            h("h4", { className: "light" }, "\u7269\u6D41\u4FE1\u606F"),
                            h("div", { className: "list" },
                                h("div", { className: "box padding-lr-15" },
                                    h("p", null,
                                        "\u5FEB\u9012\u516C\u53F8\uFF1A",
                                        h("span", { "data-bind": "text:expressCompany" })),
                                    h("p", null,
                                        "\u5FEB\u9012\u5355\u53F7\uFF1A",
                                        h("span", { "data-bind": "text:expressBillNo" }))))),
                        h("div", { "data-bind": "with:order", className: "container order" },
                            h("div", null,
                                h("h4", { className: "text-primary", style: { fontWeight: 'bold' } }, "\u8D2D\u7269\u6E05\u5355")),
                            h("div", { name: "orderDetails", className: "list" }, order.OrderDetails.map((o, i) => (h("div", { key: o.ProductId },
                                h("hr", { className: "row" }),
                                h("div", { className: "row" },
                                    h("div", { className: "col-xs-4", style: { paddingRight: 0 } },
                                        h("a", { href: `#home_product?id=${o.ProductId}` },
                                            h("img", { src: o.ImageUrl, className: "img-responsive", ref: (e) => e ? ui.renderImage(e) : null }))),
                                    h("div", { className: "col-xs-8" },
                                        h("a", { href: "#", className: "title" }, o.ProductName),
                                        h("div", null,
                                            "\u4EF7\u683C\uFF1A",
                                            h("span", { className: "price", "data-bind": "money:Price" },
                                                "\u00A5",
                                                o.Price.toFixed(2))),
                                        h("div", null,
                                            "\u6570\u91CF\uFF1A",
                                            h("span", { className: "price", "data-bind": "text:Quantity" }, o.Quantity))))))))),
                        order.Status == 'WaitingForPayment' ?
                            h("div", { "data-bind": "with:order", className: "container", style: { paddingTop: 10, paddingBottom: 20 } },
                                h("button", { onClick: () => this.cancelOrder(order), ref: (o) => {
                                        if (!o)
                                            return;
                                        o.onclick = ui.buttonOnClick(() => {
                                            return shopping.cancelOrder(order.Id);
                                        }, { confirm: '确定取消该定单吗', toast: '订单已经取消' });
                                    }, className: "btn btn-block btn-default" }, "\u53D6\u6D88\u8BA2\u5355")) : null)
                ];
            }
        }
        let shop = page.createService(shoppingService_1.ShoppingService);
        shop.order(page.data.id).then(order => {
            ReactDOM.render(h(OrderDetailPage, { order: order }), page.element);
        });
    }
    exports.default = default_1;
});
