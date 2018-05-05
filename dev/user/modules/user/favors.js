define(["require", "exports", "site", "user/services/shoppingService", "site", "user/controls/dataList", "user/siteMap"], function (require, exports, site_1, shoppingService_1, site_2, dataList_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shop = page.createService(shoppingService_1.ShoppingService);
        class FavorPage extends React.Component {
            constructor() {
                super();
                this.unfavor = (event, item) => {
                    let btn = event.target;
                    return shop.unfavorProduct(item.ProductId).then(() => {
                        btn.style.opacity = '0';
                        setTimeout(() => {
                            btn.style.display = 'none';
                            btn.nextSibling.style.opacity = '1';
                        }, 400);
                    });
                };
            }
            showProduct(productId) {
                site_2.app.redirect(siteMap_1.default.nodes.home_product, { id: productId });
            }
            loadFavorProducts(pageIndex) {
                if (pageIndex > 0) {
                    return Promise.resolve([]);
                }
                return shop.favorProducts().then(items => {
                    return items;
                });
            }
            render() {
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '我的收藏' })),
                    h("section", { key: "v", ref: o => o ? this.dataView = o : null },
                        h(dataList_1.DataList, { className: "container", loadData: this.loadFavorProducts, dataItem: (o) => (h("div", { key: o.ProductId },
                                h("div", { className: "item row" },
                                    h("div", { onClick: () => this.showProduct(o.ProductId), className: "col-xs-4" },
                                        h("img", { src: o.ImageUrl, className: "img-responsive", ref: (e) => e ? ui.renderImage(e) : null })),
                                    h("div", { className: "col-xs-8" },
                                        h("div", { onClick: () => this.showProduct(o.ProductId), className: "name" },
                                            h("div", null, o.ProductName)),
                                        h("button", { ref: `btn_${o.Id}`, onClick: (event) => this.unfavor(event, o), className: "pull-right btn btn-primary" },
                                            h("i", { className: "icon-heart" }),
                                            h("span", null, "\u53D6\u6D88\u6536\u85CF")),
                                        h("label", { className: "pull-right" }, "\u5DF2\u53D6\u6D88"))),
                                h("hr", { className: "row" }))), emptyItem: h("div", { className: "norecords" },
                                h("div", { className: "icon" },
                                    h("i", { className: "icon-heart-empty" })),
                                h("h4", { className: "text" }, "\u4F60\u8FD8\u6CA1\u6709\u6DFB\u52A0\u6536\u85CF\u54E6")) }))
                ];
            }
        }
        ReactDOM.render(h(FavorPage, null), page.element);
    }
    exports.default = default_1;
});
