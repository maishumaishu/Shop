define(["require", "exports", "site", "user/services/accountService", "user/controls/dataList"], function (require, exports, site_1, accountService_1, dataList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // let { PageComponent, PageHeader, PageView, DataList } = controls;
    function default_1(page) {
        let account = page.createService(accountService_1.AccountService);
        class RechargeListComponent extends React.Component {
            constructor(props) {
                super(props);
            }
            loadData(pageIndex) {
                return account.balanceDetails();
            }
            typeText(item) {
                switch (item.Type) {
                    case 'OrderPurchase':
                        return '购物消费';
                    case 'OrderCancel':
                        return '订单退款';
                    case 'OnlineRecharge':
                        return '线上充值';
                    case 'StoreRecharge':
                        return '门店充值';
                }
                return item.Type;
            }
            charge() {
                return Promise.resolve();
            }
            render() {
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, {
                        title: '充值记录',
                        right: h("button", { onClick: () => this.charge(), className: "right-button", style: { width: 'unset' } }, "\u5145\u503C")
                    })),
                    h("section", { key: "v" },
                        h(dataList_1.DataList, { loadData: (i) => this.loadData(i), pageSize: 10000, dataItem: (o, i) => h("div", { key: i, className: "container" },
                                h("div", { className: "row", style: { padding: '0px 10px 0px 10px' } },
                                    h("div", { className: "pull-left" }, site_1.formatDate(o.CreateDateTime)),
                                    h("div", { className: "pull-right" },
                                        "\u7ED3\u4F59\uFF1A",
                                        h("span", null,
                                            "\u00A5",
                                            o.Balance.toFixed(2)))),
                                h("div", { className: "row", style: { padding: '6px 10px 0px 10px' } },
                                    h("div", { className: "pull-left" }, this.typeText(o)),
                                    h("div", { className: "pull-right" },
                                        h("span", null, (o.Amount > 0 ? '+¥' : '-¥') + Math.abs(o.Amount).toFixed(2)))),
                                h("hr", { className: "row", style: { marginTop: 10, marginBottom: 10 } })), emptyItem: h("div", { className: "norecords" },
                                h("div", { className: "icon" },
                                    h("i", { className: "icon-money" })),
                                h("h4", { className: "text" }, "\u6682\u65E0\u5145\u503C\u8BB0\u5F55")) }))
                ];
            }
        }
        ReactDOM.render(h(RechargeListComponent, null), page.element);
    }
    exports.default = default_1;
});
