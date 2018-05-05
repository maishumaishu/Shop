define(["require", "exports", "user/services/shoppingService", "user/controls/tabs", "user/controls/dataList"], function (require, exports, shoppingService_1, tabs_1, dataList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shop = page.createService(shoppingService_1.ShoppingService);
        const commented = 1, toComment = 0;
        class EvaluationComponent extends React.Component {
            constructor(props) {
                super(props);
                this.state = { activeTab: 0 };
            }
            loadData() {
                if (this.state.activeTab == commented)
                    return shop.commentedProducts();
                else
                    return shop.toCommentProducts();
            }
            render() {
                return [
                    h("header", null,
                        h(tabs_1.Tabs, { className: "tabs", onItemClick: (i) => {
                                this.state.activeTab = i;
                                this.setState(this.state);
                                this.dataList.reset();
                                this.dataList.loadData();
                            }, children: [
                                h("span", null, "\u5F85\u8BC4\u4EF7"),
                                h("span", null, "\u5DF2\u8BC4\u4EF7")
                            ] })),
                    h("section", { className: "container" },
                        h(dataList_1.DataList, { ref: (o) => this.dataList = o, loadData: () => this.loadData(), dataItem: (o) => h("div", { key: o.Id, className: "products" },
                                h("div", { className: "item" },
                                    h("div", { "data-bind": "click:$parent.showProduct,tap:$parent.showProduct", className: "image pull-left" },
                                        h("img", { src: o.ImageUrl, className: "img-responsive img-thumbnail", ref: (e) => e ? ui.renderImage(e) : null })),
                                    h("div", { className: "name" }, o.Name),
                                    o.Status == 'Evaluated' ?
                                        h("label", { "data-bind": "visible:Status()=='Evaluated'", className: "pull-right" }, "\u5DF2\u8BC4\u4EF7")
                                        :
                                            h("a", { href: `#shopping_productEvaluate?orderDetailId=${o.OrderDetailId}&productImageUrl=${encodeURIComponent(o.ImageUrl)}`, className: "pull-right" },
                                                h("i", { className: "icon-pencil" }),
                                                "\u8BC4\u4EF7\u6652\u5355"),
                                    h("div", { className: "clearfix" })),
                                h("hr", { className: "row" })), emptyItem: h("div", { className: "norecords" },
                                h("div", { className: "icon" },
                                    h("i", { className: "icon-star" })),
                                h("h4", { className: "text" }, this.state.activeTab == toComment ? '暂无待评价商品' : '暂无已评价商品')) }))
                ];
            }
        }
        ReactDOM.render(h(EvaluationComponent, null), page.element);
    }
    exports.default = default_1;
});
