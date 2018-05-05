var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "site", "user/services/shoppingService", "user/controls/dataList", "user/controls/productImage"], function (require, exports, site_1, shoppingService_1, dataList_1, productImage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            page.loadCSS();
            class ProductListHeader extends React.Component {
                render() {
                    return (h("div", null,
                        site_1.defaultNavBar(page, { title: this.props.title }),
                        h("ul", { className: "tabs", style: { margin: '0px' } },
                            h("li", null,
                                h("a", { className: "active" }, "\u7EFC\u5408")),
                            h("li", null,
                                h("a", { className: "" }, "\u9500\u91CF")),
                            h("li", null,
                                h("span", null, "\u4EF7\u683C"),
                                h("span", { className: "icon-angle-up" })))));
                }
            }
            class ProductListView extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { categoryId: this.props.categoryId, title: '' };
                    shop.category(this.props.categoryId).then(c => {
                        this.state.title = c.Name;
                        this.setState(this.state);
                    });
                }
                componentDidMount() {
                    this.dataList = dataList_1.dataList({
                        element: this.dataListElement,
                        loadData: (pageIndex) => {
                            return this.props.shop.products(categoryId, pageIndex);
                        },
                        item: (o) => {
                            let element = document.createElement('a');
                            element.href = `#home_product?id=${o.Id}`;
                            element.className = "col-xs-6 text-center item";
                            ReactDOM.render([
                                h(productImage_1.ProductImage, { key: o.Id, product: o }),
                                h("div", { key: "name", className: "bottom" },
                                    h("div", { className: "interception", style: { textAlign: 'left' } }, o.Name),
                                    h("div", null,
                                        h("div", { className: "price pull-left" },
                                            "\uFFE5",
                                            o.Price.toFixed(2))))
                            ], element);
                            return element;
                        }
                    });
                }
                render() {
                    if (this.dataList != null) {
                        let categoryId = this.state.categoryId;
                        this.dataList.reset((pageIndex) => this.props.shop.products(categoryId, pageIndex));
                    }
                    return [
                        h("header", { key: "header" }, site_1.defaultNavBar(page, { title: this.state.title })),
                        h("section", { key: "view0", ref: (e) => this.dataView = e || this.dataView },
                            h("div", { className: "products", ref: (e) => this.dataListElement = e || this.dataListElement, style: { paddingTop: 10 } }))
                    ];
                }
            }
            let shop = page.createService(shoppingService_1.ShoppingService);
            let categoryId = page.data.categoryId;
            let productListView;
            ReactDOM.render(h(ProductListView, { shop: shop, categoryId: categoryId, ref: e => productListView = e || productListView }), page.element);
            page.showing.add((sender, args) => __awaiter(this, void 0, void 0, function* () {
                categoryId = args.categoryId;
                if (productListView.state.categoryId == categoryId)
                    return;
                sender.showLoading();
                let category = yield shop.category(categoryId);
                productListView.state.title = category.Name;
                productListView.state.categoryId = categoryId;
                productListView.setState(productListView.state);
                sender.hideLoading();
            }));
        });
    }
    exports.default = default_1;
});
