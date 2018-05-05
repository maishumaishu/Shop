var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/site", "user/services/shoppingService", "user/siteMap"], function (require, exports, site_1, shoppingService_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shop = page.createService(shoppingService_1.ShoppingService);
        let routeValue = (page.data || {});
        class ReceiptListPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { items: this.props.items || [] };
            }
            detail(item) {
                var result = `${item.ProvinceName} ${item.CityName} ${item.CountyName} ${item.Address}`;
                result = result + ` 联系人: ${item.Consignee}`;
                if (item.Phone != null || item.Mobile != null)
                    result = result + ` 电话：${item.Phone || ''} ${item.Mobile || ''}`;
                return result;
            }
            newReceipt() {
                let routeValues = {
                    onSaved: (receipt) => {
                        if (receipt.IsDefault) {
                            this.state.items.forEach(o => o.IsDefault = false);
                        }
                        this.state.items.unshift(receipt);
                        this.setState(this.state);
                        site_1.app.back();
                    }
                };
                site_1.app.redirect(siteMap_1.default.nodes.user_receiptEdit, true, routeValues); //'user_receiptEdit',
            }
            editReceipt(receipt) {
                let routeValues = {
                    id: receipt.Id,
                    receipt,
                    onSaved: (receipt) => {
                        var index = this.state.items.findIndex((o) => o.Id == receipt.Id);
                        this.state.items[index] = receipt;
                        if (receipt.IsDefault) {
                            this.state.items
                                .filter((o, i) => i != index)
                                .forEach(o => o.IsDefault = false);
                        }
                        this.setState(this.state);
                        site_1.app.back();
                    }
                };
                site_1.app.redirect(siteMap_1.default.nodes.user_receiptEdit, routeValues);
            }
            setDefaultReceipt(receipt) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield shop.setDefaultReceiptInfo(receipt.Id);
                    let index = this.state.items.indexOf(receipt);
                    receipt.IsDefault = true;
                    this.state.items
                        .filter((o, i) => i != index)
                        .forEach(o => o.IsDefault = false);
                    this.setState(this.state);
                });
            }
            deleteReceipt(receipt) {
                return shop.deleteReceiptInfo(receipt.Id).then(() => {
                    this.state.items = this.state.items.filter(o => o != receipt);
                    this.setState(this.state);
                });
            }
            setAddress(receipt) {
                shop.changeReceipt(routeValue.orderId, receipt.Id)
                    .then((order) => {
                    routeValue.callback(this.detail(receipt), order);
                    site_1.app.back();
                });
            }
            render() {
                let items = [];
                this.state.items.filter(o => o.IsDefault).forEach((o) => items.push(o));
                this.state.items.filter(o => !o.IsDefault).forEach((o) => items.push(o));
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: routeValue.callback ? '选择收货地址' : '收货地址' })),
                    h("section", { key: "v" },
                        items.map(receipt => (h("div", { key: receipt.Id, style: { marginBottom: 14 } },
                            h("div", { className: "container" },
                                h("h5", { "data-bind": "text:Name" }, receipt.Name),
                                routeValue.callback ?
                                    h("div", { onClick: () => this.setAddress(receipt), className: "small" }, this.detail(receipt))
                                    :
                                        h("div", { className: "small" }, this.detail(receipt))),
                            h("div", { style: { marginTop: 6 } },
                                h("hr", { style: { marginBottom: 8 } }),
                                h("div", { className: "container" },
                                    h("div", { className: "pull-left" },
                                        h("a", { href: "javascript:", onClick: () => this.setDefaultReceipt(receipt) },
                                            (receipt.IsDefault ?
                                                h("i", { className: "icon-ok-sign", style: { fontSize: 20 } }) :
                                                h("i", { className: "icon-circle-blank", style: { fontSize: 20 } })),
                                            h("span", { style: { marginLeft: 8 } }, "\u9ED8\u8BA4\u5730\u5740"))),
                                    h("div", { className: "pull-right" },
                                        h("a", { href: "javascript:", onClick: () => this.editReceipt(receipt) },
                                            h("span", { className: "icon-pencil", style: { fontSize: 20 } }),
                                            h("span", { style: { marginLeft: 4 } }, "\u7F16\u8F91")),
                                        h("button", { ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => this.deleteReceipt(receipt), { confirm: '你删除该收货地址吗？' });
                                            }, style: { marginLeft: 12, border: 'none', background: 'none' } },
                                            h("span", { className: "icon-remove", style: { fontSize: 20 } }),
                                            h("span", { style: { marginLeft: 4 } }, "\u5220\u9664")))),
                                h("div", { className: "clearfix" }),
                                h("hr", { style: { marginTop: 8, borderTopWidth: 12 } }))))),
                        items.length == 0 ?
                            h("div", { className: "norecords" },
                                h("div", { className: "icon" },
                                    h("i", { className: "icon-inbox" })),
                                h("h4", { className: "text" }, "\u6682\u65E0\u6536\u8D27\u5730\u5740")) : null),
                    h("footer", { key: "f" },
                        h("div", { className: "form-group" },
                            h("button", { onClick: () => this.newReceipt(), className: "btn btn-primary btn-block" }, "\u6DFB\u52A0\u65B0\u7684\u6536\u8D27\u5730\u5740")))
                ];
            }
        }
        shop.receiptInfos().then(items => {
            ReactDOM.render(h(ReceiptListPage, { items: items }), page.element);
        });
    }
    exports.default = default_1;
});
