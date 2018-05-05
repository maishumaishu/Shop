define(["require", "exports", "site", "user/services/shoppingService", "user/controls/dataList", "user/controls/tabs"], function (require, exports, site_1, shoppingService_1, dataList_1, tabs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let orderListView;
        let shop = page.createService(shoppingService_1.ShoppingService);
        let type = page.data.type;
        let defaultActiveIndex = 0;
        if (type == 'WaitingForPayment')
            defaultActiveIndex = 1;
        else if (type == 'Send')
            defaultActiveIndex = 2;
        class OrderListView extends React.Component {
            constructor(props) {
                super(props);
                this.loadData = (pageIndex) => {
                    let type;
                    if (this.state.activeIndex == 1)
                        type = "WaitingForPayment";
                    else if (this.state.activeIndex == 2)
                        type = 'Send';
                    return shop.myOrderList(pageIndex, type);
                };
                this.state = { activeIndex: defaultActiveIndex };
            }
            activeItem(index) {
                this.state.activeIndex = index;
                this.setState(this.state);
                orderListView.state.activeIndex = index;
                orderListView.setState(orderListView.state);
            }
            componentDidUpdate() {
                this.dataList.reset();
                this.dataList.loadData();
            }
            pay() {
                return Promise.resolve();
            }
            confirmReceived() {
                return Promise.resolve();
            }
            /** 评价晒单 */
            evaluate() {
            }
            statusControl(order) {
                let control;
                let btnClassName = 'btn btn-small btn-primary pull-right';
                switch (order.Status) {
                    case 'WaitingForPayment':
                        control = h("a", { href: `#shopping_purchase?id=${order.Id}`, className: btnClassName }, "\u7ACB\u5373\u4ED8\u6B3E");
                        break;
                    case 'Send':
                        control =
                            h("button", { className: btnClassName, ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = ui.buttonOnClick(() => this.confirmReceived(), { confirm: '你确定收到货了吗？' });
                                } }, "\u786E\u8BA4\u6536\u8D27");
                        break;
                    case 'ToEvaluate':
                        control = h("a", { href: '#shopping_evaluation', className: btnClassName }, "\u8BC4\u4EF7\u6652\u5355");
                        break;
                    case 'Canceled':
                        control = h("label", { className: "pull-right" }, "\u5DF2\u53D6\u6D88");
                        break;
                    case 'Paid':
                        control = h("label", { className: "pull-right" }, "\u5DF2\u4ED8\u6B3E");
                        break;
                    case 'Evaluated':
                        control = h("label", { className: "pull-right" }, "\u5DF2\u8BC4\u4EF7");
                        break;
                    case 'Received':
                        control = h("label", { className: "pull-right" }, "\u5DF2\u6536\u8D27");
                        break;
                    default:
                        return null;
                }
                return control;
            }
            render() {
                return [
                    h("header", null,
                        site_1.defaultNavBar(page, { title: '我的订单' }),
                        h(tabs_1.Tabs, { className: "tabs", defaultActiveIndex: defaultActiveIndex, onItemClick: (index) => this.activeItem(index), scroller: () => this.dataView },
                            h("span", null, "\u5168\u90E8"),
                            h("span", null, "\u5F85\u4ED8\u6B3E"),
                            h("span", null, "\u5F85\u6536\u8D27"))),
                    h("section", { ref: (o) => this.dataView = o },
                        h(dataList_1.DataList, { ref: o => this.dataList = o, loadData: (pageIndex) => this.loadData(pageIndex), dataItem: (o) => (h("div", { key: o.Id, className: "order-item" },
                                h("hr", null),
                                h("div", { className: "header" },
                                    h("a", { href: `#shopping_orderDetail?id=${o.Id}` },
                                        h("h4", null,
                                            "\u8BA2\u5355\u7F16\u53F7\uFF1A",
                                            o.Serial),
                                        h("div", { className: "pull-right" },
                                            h("i", { className: "icon-chevron-right" })))),
                                h("div", { className: "body" },
                                    h("ul", null, o.OrderDetails.map((c, i) => (h("li", { key: i },
                                        h("img", { src: c.ImageUrl, className: "img-responsive img-thumbnail img-full", ref: (e) => e ? ui.renderImage(e) : null }))))),
                                    o.OrderDetails.length == 1 ?
                                        h("div", { className: "pull-right", style: { width: '75%', fontSize: '16px', paddingLeft: '16px', paddingTop: '4px' } }, o.OrderDetails[0].ProductName)
                                        : null,
                                    h("div", { className: "clearfix" })),
                                h("div", { className: "footer" },
                                    h("h4", { className: "pull-left" },
                                        "\u5B9E\u4ED8\u6B3E\uFF1A",
                                        h("span", { className: "price" },
                                            "\uFFE5",
                                            o.Amount.toFixed(2))),
                                    h("div", { className: "pull-right" }, this.statusControl(o))))), emptyItem: h("div", { className: "norecords" },
                                h("div", { className: "icon" },
                                    h("i", { className: "icon-list" })),
                                h("h4", { className: "text" }, "\u6682\u65E0\u6B64\u7C7B\u8BA2\u5355")) }))
                ];
            }
        }
        orderListView = ReactDOM.render(h(OrderListView, null), page.element);
    }
    exports.default = default_1;
});
