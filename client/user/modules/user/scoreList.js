define(["require", "exports", "site", "user/controls/dataList"], function (require, exports, site_1, dataList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        class ScroeListComponent extends React.Component {
            loadData() {
                return Promise.resolve([]);
            }
            typeText(item) {
                switch (item.Type) {
                    case 'OrderPurchase':
                        return '兑换商品';
                    case 'OrderConsume':
                        return '消费获得积分';
                }
                return item.Type;
            }
            render() {
                return [
                    h("header", { key: "header" }, site_1.defaultNavBar(page, { title: '我的积分' })),
                    h("section", { key: "view" },
                        h("div", { className: "container" },
                            h(dataList_1.DataList, { loadData: () => this.loadData(), pageSize: 10000, dataItem: (o) => h("div", { style: { marginTop: 10 } },
                                    h("div", { className: "row", style: { padding: '0px 10px 0px 10px' } },
                                        h("div", { className: "pull-left" }, site_1.formatDate(o.CreateDateTime)),
                                        h("div", { className: "pull-right" },
                                            "\u7ED3\u4F59\uFF1A",
                                            h("span", { "data-bind": "text: Balance" }, o.Balance))),
                                    h("div", { className: "row", style: { padding: '6px 10px 0px 10px' } },
                                        h("div", { className: "pull-left" }, this.typeText(o)),
                                        h("div", { className: "pull-right" }, o.Score)),
                                    h("hr", { className: "row", style: { marginTop: '10px; margin-bottom: 10px' } })), emptyItem: h("div", { className: "norecords" },
                                    h("div", { className: "icon" },
                                        h("i", { className: "icon-money", style: { fontSize: 100, top: 34 } })),
                                    h("h4", { className: "text" }, "\u6682\u65E0\u79EF\u5206\u8BB0\u5F55")) })))
                ];
            }
        }
        ReactDOM.render(h(ScroeListComponent, null), page.element);
    }
    exports.default = default_1;
});
