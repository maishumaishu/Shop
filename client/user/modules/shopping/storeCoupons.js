define(["require", "exports", "site", "user/services/shoppingService", "ui"], function (require, exports, site_1, shoppingService_1, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shoppingService_1.ShoppingService);
        class StoreCouponsPage extends React.Component {
            receiveCoupon(coupon) {
                return shopping.receiveCoupon(coupon.Id);
            }
            render() {
                let coupons = this.props.coupons;
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '店铺优惠劵' })),
                    h("section", { key: "v" },
                        coupons.length > 0 ?
                            h("hr", null)
                            :
                                h("div", { className: "norecords" },
                                    h("div", { className: "icon" },
                                        h("i", { className: "icon-money" })),
                                    h("h4", { className: "text" }, "\u6682\u65E0\u53EF\u9886\u53D6\u7684\u4F18\u60E0\u5238")),
                        coupons.map(o => h("div", { key: o.Id },
                            h("div", { className: "coupon" },
                                h("button", { className: `pull-right receive available`, ref: (btn) => {
                                        if (!btn)
                                            return;
                                        btn.onclick = ui.buttonOnClick(() => {
                                            return this.receiveCoupon(o);
                                        }, { toast: '领取优惠劵成功' });
                                    } }, "\u7ACB\u5373\u9886\u53D6"),
                                h("div", { className: "main" },
                                    h("div", null,
                                        "\uFFE5",
                                        o.Discount),
                                    h("div", { className: "date" },
                                        `有效期 ${o.ValidBegin.toLocaleDateString()} 至 ${o.ValidEnd.toLocaleDateString()}`,
                                        h("div", null, o.Amount ? h("span", null,
                                            "\u6EE1",
                                            o.Amount,
                                            "\u5143\u53EF\u4EE5\u4F7F\u7528") : h("span", null, "\u4EFB\u610F\u91D1\u989D\u53EF\u7528\u4F7F\u7528"))))),
                            h("hr", null))))
                ];
            }
        }
        shopping.storeCoupons().then(coupons => {
            // coupons = [];
            ReactDOM.render(h(StoreCouponsPage, { coupons: coupons }), page.element);
        });
    }
    exports.default = default_1;
});
