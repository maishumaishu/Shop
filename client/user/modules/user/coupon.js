define(["require", "exports", "site", "user/services/shoppingService", "user/controls/tabs", "user/controls/dataList"], function (require, exports, site_1, shoppingService_1, tabs_1, dataList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shoppingService_1.ShoppingService);
        let defaultIndex = 0;
        let statuses = ['available', 'used', 'expired'];
        class CouponPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { status: statuses[defaultIndex] };
            }
            activeItem(index) {
                this.state.status = statuses[index];
                this.setState(this.state);
            }
            loadData(pageIndex, status) {
                return shopping.myCoupons(pageIndex, status);
            }
            componentDidUpdate() {
                this.dataList.reset();
                this.dataList.loadData();
            }
            render() {
                let status = this.state.status;
                return [
                    h("header", null,
                        site_1.defaultNavBar(page, { title: '我的优惠券' }),
                        h(tabs_1.Tabs, { className: "tabs", defaultActiveIndex: defaultIndex, onItemClick: (index) => this.activeItem(index), scroller: () => this.dataView }, statuses.map(o => (h("span", { key: o }, shopping.couponStatusText(o)))))),
                    h("section", { ref: o => this.dataView = o },
                        h("hr", null),
                        h(dataList_1.DataList, { ref: o => this.dataList = o, loadData: (pageIndex) => this.loadData(pageIndex, status), dataItem: (o) => (h("div", { key: o.Id },
                                h("div", { className: "coupon" },
                                    h("div", { className: `pull-left ${status}` },
                                        "\uFFE5",
                                        h("span", { className: "text" }, o.Discount)),
                                    h("div", { className: "main" },
                                        h("div", null, o.Title),
                                        h("div", { className: "date" }, `有效期 ${o.ValidBegin.toLocaleDateString()} 至 ${o.ValidEnd.toLocaleDateString()}`))),
                                h("hr", null))), emptyItem: h("div", { className: "norecords" },
                                h("div", { className: "icon" },
                                    h("i", { className: "icon-money" })),
                                h("h4", { className: "text" },
                                    "\u6682\u65E0",
                                    shopping.couponStatusText(status),
                                    "\u7684\u4F18\u60E0\u5238")) }))
                ];
            }
        }
        ReactDOM.render(h(CouponPage, null), page.element);
    }
    exports.default = default_1;
});
