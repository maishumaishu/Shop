define(["require", "exports", "site", "user/services/shoppingService"], function (require, exports, site_1, shoppingService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let orderId = page.data.orderId;
        if (!orderId)
            throw new Error('orderId cannt be empty.');
        let shopping = page.createService(shoppingService_1.ShoppingService);
        class OrderCouponsPage extends React.Component {
            render() {
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '请选择优惠劵' })),
                    h("section", { key: "v" },
                        h("hr", null),
                        this.props.couponCodes.map(o => h("div", { key: o.Code },
                            h("div", { className: "coupon" },
                                h("div", { className: `pull-left available` },
                                    "\uFFE5",
                                    h("span", { className: "text" }, o.Discount)),
                                h("div", { className: "main" },
                                    h("div", null, o.Title),
                                    h("div", { className: "date" }, `有效期 ${o.ValidBegin.toLocaleDateString()} 至 ${o.ValidEnd.toLocaleDateString()}`))),
                            h("hr", null))))
                ];
            }
        }
        shopping.orderAvailableCoupons(orderId).then(items => {
            ReactDOM.render(h(OrderCouponsPage, { couponCodes: items }), page.element);
        });
    }
    exports.default = default_1;
});
