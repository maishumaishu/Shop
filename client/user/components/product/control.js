define(["require", "exports", "components/common", "user/services/shoppingCartService", "user/services/shoppingService", "user/services/service", "user/services/userData", "user/services/service", "site", "ui"], function (require, exports, common_1, shoppingCartService_1, shoppingService_1, service_1, userData_1, service_2, site_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Header extends common_1.Control {
        get persistentMembers() {
            return [];
        }
        favor() {
            let shopping = this.elementPage.createService(shoppingService_1.ShoppingService);
            let p;
            if (this.state.isFavored) {
                p = shopping.unfavorProduct;
            }
            else {
                p = shopping.favorProduct;
            }
            return p.bind(shopping)(this.state.product.Id).then(o => {
                this.state.isFavored = !this.state.isFavored;
                this.setState(this.state);
            });
        }
        componentDidMount() {
        }
        _render(h) {
            return site_1.defaultNavBar(this.elementPage, { title: '商品详情' });
        }
    }
    exports.Header = Header;
    class Footer extends common_1.Control {
        constructor(props) {
            super(props);
            this.shoppingCart = this.elementPage.createService(shoppingCartService_1.ShoppingCartService);
            this.state = { productsCount: shoppingCartService_1.ShoppingCartService.productsCount.value };
            this.subscribe(shoppingCartService_1.ShoppingCartService.productsCount, (value) => {
                this.state.productsCount = value;
                this.setState(this.state);
            });
            // this.shoppingCart.productsCount
        }
        get persistentMembers() {
            return [];
        }
        addToShoppingCart() {
            let c = this.mobilePage.controls.filter(o => o instanceof ProductControl)[0];
            let shoppingCart = this.elementPage.createService(shoppingCartService_1.ShoppingCartService); //this.props.shoppingCart;
            let product = c.state.product;
            let id = product.Id;
            let count;
            let shoppingCartItem = shoppingCartService_1.ShoppingCartService.items.value.filter(o => o.ProductId == product.Id)[0];
            if (shoppingCartItem == null) {
                shoppingCartItem = {
                    Id: service_2.guid(),
                    Amount: product.Price * count,
                    Count: count,
                    ImagePath: product.ImagePath,
                    Name: product.Name,
                    ProductId: product.Id,
                    Selected: true,
                    Price: product.Price,
                };
                count = 1;
            }
            else {
                count = shoppingCartItem.Count + 1;
            }
            return shoppingCart.setItemCount(product, count);
        }
        componentDidMount() {
            // this.shoppingCart.onChanged(this, () => {
            //     this.state.productsCount = this.shoppingCart.productsCount;
            //     this.setState(this.state);
            // })
        }
        _render(h) {
            let { productsCount } = this.state;
            let p = this.props.product;
            let allowBuy = (p.Stock == null || p.Stock > 0) && p.OffShelve != true;
            let buttonText = p.Stock == 0 ? "商品已售罄" : p.OffShelve == true ? "商品已下架" : "加入购物车";
            return (h("nav", { className: "product-control-footer" },
                h("a", { href: '#shopping_shoppingCartNoMenu', className: "pull-left" },
                    h("i", { className: "icon-shopping-cart" }),
                    productsCount ?
                        h("span", { className: "badge bg-primary" }, productsCount)
                        : null),
                h("button", { disabled: !allowBuy, style: { width: 120 }, ref: (e) => e ? e.onclick = ui.buttonOnClick(() => this.addToShoppingCart()) : null, className: "btn btn-primary pull-right" }, buttonText)));
        }
    }
    exports.Footer = Footer;
    let productStore = new chitu.ValueStore();
    class ProductControl extends common_1.Control {
        constructor(props) {
            super(props);
            // private productPanel: ProductPanel;
            this.isShowIntroduceView = false;
            this.isShowProductView = false;
            this.loadControlCSS();
            this.state = {
                productSelectedText: this.productSelectedText(this.props.product), content: null,
                pullUpStatus: 'init', isFavored: false, productsCount: userData_1.userData.productsCount.value, count: 1,
                product: this.props.product
            };
            this.shoppingCart = this.elementPage.createService(shoppingCartService_1.ShoppingCartService);
            let shopping = this.shopping = this.elementPage.createService(shoppingService_1.ShoppingService); //this.props.shop;
            shopping.isFavored(this.props.product.Id).then((isFavored) => {
                this.state.isFavored = isFavored;
                this.setState(this.state);
            });
            shopping.storeCouponsCount().then(count => {
                this.state.couponsCount = count;
                this.setState(this.state);
            });
            shopping.productIntroduce(this.state.product.Id).then((content) => {
                this.state.content = content;
                this.setState(this.state);
            });
            // subscribe(this, userData.productsCount, (value: number) => {
            //     this.state.productsCount = value;
            //     this.setState(this.state);
            // });
            // subscribe(this, productStore, (value: Product) => {
            //     this.updateStateByProduct(value);
            // });
            this.panelElement = document.createElement('div');
            this.elementPage.element.appendChild(this.panelElement);
            this.panel = new ui_1.Panel(this.panelElement);
        }
        decrease() {
            let count = this.state.count;
            if (count == 1) {
                return;
            }
            count = count - 1;
            this.state.count = count;
            this.setState(this.state);
            this.updateProductCount(count);
        }
        increase() {
            let count = this.state.count;
            count = count + 1;
            this.state.count = count;
            this.setState(this.state);
            this.updateProductCount(count);
        }
        onFieldSelected(property, name) {
            property.Options.forEach(o => {
                o.Selected = o.Name == name;
            });
            var properties = {};
            this.state.product.CustomProperties.forEach(o => {
                properties[o.Name] = o.Options.filter(c => c.Selected)[0].Value;
            });
            return this.shopping.productByProperies(this.state.product.GroupId, properties)
                .then(o => {
                this.state.product = o;
                this.setState(this.state);
                productStore.value = o;
            });
        }
        onProductsCountInputChanged(event) {
            let value = Number.parseInt(event.target.value);
            if (!value)
                return;
            this.state.count = value;
            this.setState(this.state);
            this.updateProductCount(value);
        }
        get persistentMembers() {
            return [];
        }
        // private showPanel() {
        //     this.panel.show();
        // }
        productSelectedText(product) {
            var str = '';
            var props = product.CustomProperties || [];
            for (var i = 0; i < props.length; i++) {
                var options = props[i].Options;
                for (var j = 0; j < options.length; j++) {
                    if (options[j].Selected) {
                        str = str + options[j].Name + ' ';
                        break;
                    }
                }
            }
            str = str + (this.state == null ? 1 : this.state.count) + '件';
            return str;
        }
        // private showIntroduceView() {
        //     let shopping = this.shopping;
        //     if (this.state.content == null) {
        //         shopping.productIntroduce(this.state.product.Id).then((content) => {
        //             this.state.content = content;
        //             this.setState(this.state);
        //         });
        //     }
        // }
        componentDidMount() {
        }
        addToShoppingCart() {
            let shoppingCart = this.shoppingCart;
            let id = this.props.product.Id;
            let product = this.props.product;
            let count = this.state.count;
            // let shoppingCartItem = {
            //     Id: guid(),
            //     Amount: product.Price * count,
            //     Count: count,
            //     ImagePath: product.ImagePath,
            //     Name: product.Name,
            //     ProductId: product.Id,
            //     Selected: true,
            //     Price: product.Price,
            // };
            return shoppingCart.setItemCount(product, count);
        }
        updateProductCount(value) {
            this.state.count = value;
            this.state.productSelectedText = this.productSelectedText(this.props.product);
            this.state.content = null;
            this.setState(this.state);
        }
        updateStateByProduct(product) {
            this.state.product = product;
            this.state.productSelectedText = this.productSelectedText(this.props.product);
            this.setState(this.state);
        }
        get element() {
            console.assert(this.pageComponent != null);
            return this.element;
        }
        renderPanel(p) {
            ReactDOM.render([
                h("ul", { key: 10, className: "nav nav-tabs bg-primary" },
                    h("li", { className: "text-left", style: { width: '30%' } },
                        h("button", { onClick: () => this.panel.hide() }, "\u5173\u95ED"))),
                h("div", { key: 20, style: { paddingTop: "10px" } },
                    h("div", { className: "pull-left", style: { width: 80, height: 80, marginLeft: 10 } },
                        h("img", { className: "img-responsive", src: service_2.imageUrl(p.ImagePath), ref: (e) => e ? ui.renderImage(e) : null })),
                    h("div", { style: { marginLeft: 100, marginRight: 70 } },
                        h("div", null, p.Name),
                        h("div", { className: "price" },
                            "\uFFE5",
                            p.Price.toFixed(2)))),
                h("div", { key: 30, className: "clearfix" })
            ], this.panel.header);
            ReactDOM.render(p.CustomProperties.map((o) => (h("div", { key: o.Name, className: "container row" },
                h("div", { className: "pull-left", style: { width: 60 } },
                    h("span", null, o.Name)),
                o.Options.map(c => (h("div", { key: c.Name, style: { marginLeft: 60 } },
                    h("button", { className: c.Selected ? 'cust-prop selected' : 'cust-prop', ref: (e) => e != null ? e.onclick = ui.buttonOnClick(() => this.onFieldSelected(o, c.Name)) : null }, c.Name))))))), this.panel.body);
            ReactDOM.render([
                h("div", { key: 10, className: "form-group" },
                    h("div", { style: { width: 50, paddingTop: 8, textAlign: 'left' }, className: "pull-left" },
                        h("span", null, "\u6570\u91CF")),
                    h("div", { className: "input-group" },
                        h("span", { className: "input-group-btn" },
                            h("button", { className: "btn btn-default", onClick: () => this.decrease() },
                                h("span", { className: "icon-minus" }))),
                        h("input", { className: "form-control", type: "number", value: `${this.state.count}`, onChange: (event) => this.onProductsCountInputChanged(event) }),
                        h("span", { className: "input-group-btn" },
                            h("button", { className: "btn btn-default", onClick: () => this.increase() },
                                h("span", { className: "icon-plus" }))))),
                h("div", { key: 20, className: "clearfix" }),
                h("button", { key: 30, className: "btn btn-primary btn-block", ref: (e) => {
                        if (!e)
                            return;
                        e.onclick = ui.buttonOnClick(() => {
                            this.panel.hide();
                            return this.addToShoppingCart();
                        }, { toast: '成功添加到购物车' });
                    } }, "\u52A0\u5165\u8D2D\u7269\u8F66")
            ], this.panel.footer);
        }
        componentDidUpdate() {
            this.renderPanel(this.state.product);
        }
        _render(h) {
            let p = this.state.product;
            let { productsCount, couponsCount } = this.state;
            return [
                h("div", { key: "main", className: "product-control", ref: (e) => this.pageComponent = e || this.pageComponent },
                    h("div", { name: "productImages", className: "carousel slide" },
                        h("div", { className: "carousel-inner" }, p.ImagePaths.map((o, i) => (h("div", { key: i, className: i == 0 ? "item active" : "item", style: { textAlign: "center" } },
                            h("img", { src: service_2.imageUrl(o, 300, 300), className: "img-responsive-100 img-full", ref: (e) => {
                                    if (!e)
                                        return;
                                    ui.renderImage(e);
                                } })))))),
                    h("ul", { className: "list-group" },
                        h("li", { name: "productName", className: "list-group-item" },
                            h("h4", { className: "text-left", style: { fontWeight: 'bold' } }, p.Name)),
                        h("li", { className: "list-group-item" },
                            h("span", null, "\u7C7B\u522B\uFF1A"),
                            h("a", { href: "" }, p.ProductCategoryName)),
                        h("li", { className: "list-group-item" },
                            h("span", { className: "pull-left" },
                                "\u4EF7\u683C\uFF1A",
                                h("strong", { className: "price" },
                                    "\uFFE5",
                                    p.Price.toFixed(2))),
                            h("span", { className: "pull-left", style: { display: p.Score == null ? 'none' : 'block' } },
                                "\u79EF\u5206\uFF1A",
                                h("strong", { className: "price" }, this.props.product.Score)),
                            h("span", { className: "pull-right" }, p.Unit),
                            h("div", { className: "clearfix" })),
                        h("li", { className: "list-group-item", onClick: () => this.panel.show() },
                            h("span", null,
                                "\u5DF2\u9009\uFF1A",
                                this.state.productSelectedText),
                            h("span", { className: "pull-right" },
                                h("i", { className: "icon-chevron-right" }))),
                        p.Promotions.length > 0 ?
                            h("li", { className: "list-group-item" }, p.Promotions.map((o, i) => (h(PromotionComponent, { key: i, promotion: o })))) : null,
                        couponsCount ?
                            h("li", { className: "list-group-item", style: { padding: '0px 0px 10px 0px' }, onClick: () => location.hash = '#shopping_storeCoupons' },
                                h("div", { className: "pull-left" }, "\u5E97\u94FA\u4F18\u60E0\u52B5"),
                                h("div", { className: "pull-right" },
                                    h("span", { className: "badge bg-primary", style: { marginRight: 10 } }, couponsCount),
                                    h("i", { className: "icon-chevron-right" }))) : null),
                    h("hr", null),
                    h("div", { className: "container" },
                        h("h4", { style: { fontWeight: 'bold', width: '100%' } }, "\u5546\u54C1\u4FE1\u606F"),
                        p.Arguments.map(o => (h("div", { key: o.key, style: { marginBottom: '10px' } },
                            h("div", { className: "pull-left", style: { width: '100px' } }, o.key),
                            h("div", { style: { marginLeft: '100px' } }, o.value),
                            h("div", { className: "clearfix" })))),
                        h("div", { style: {
                                height: '120px', paddingTop: '40px', textAlign: 'center',
                                display: p.Arguments == null || p.Arguments.length == 0 ? 'block' : 'none'
                            } },
                            h("h4", null, "\u6682\u65E0\u5546\u54C1\u4FE1\u606F"))),
                    h("hr", null)),
                // <ProductPanel key="panel" ref={(o) => this.productPanel = o} parent={this} product={this.props.product} shop={this.shopping} />,
                h("div", { key: "content", className: "product-control content", style: { background: 'whitesmoke' }, dangerouslySetInnerHTML: { __html: this.state.content }, ref: (e) => {
                        if (!e)
                            return;
                        let imgs = e.querySelectorAll('img');
                        for (let i = 0; i < imgs.length; i++) {
                            ui.renderImage(imgs[i], { imageText: service_1.Service.storeName });
                        }
                    } })
            ];
        }
    }
    exports.default = ProductControl;
    class PromotionComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { status: 'collapse' };
        }
        toggle() {
            if (this.state.status == 'collapse') {
                this.state.status = 'expand';
            }
            else {
                this.state.status = 'collapse';
            }
            this.setState(this.state);
        }
        render() {
            let type = this.props.promotion.Type;
            let contents = this.props.promotion.Contents;
            let status = this.state.status;
            return (h("div", { className: "media" },
                h("div", { className: "media-left" },
                    h("span", { style: { display: type.indexOf('Given') >= 0 ? 'block' : 'none' }, className: "label label-info" }, "\u6EE1\u8D60"),
                    h("span", { style: { display: type.indexOf('Reduce') >= 0 ? 'block' : 'none' }, className: "label label-success" }, "\u6EE1\u51CF"),
                    h("span", { style: { display: type.indexOf('Discount') >= 0 ? 'block' : 'none' }, className: "label label-warning" }, "\u6EE1\u6298")),
                h("div", { onClick: () => this.toggle(), className: "media-body" }, contents.map((o, i) => (h("div", { key: i, style: { display: status == 'expand' || i == 0 ? 'block' : 'none', margin: '0 0 8px 0' } }, o.Description)))),
                contents.length > 1 ?
                    h("div", { onClick: () => this.toggle(), className: "media-right" },
                        h("i", { className: status == 'collapse' ? "icon-chevron-down" : 'icon-chevron-up' })) : null));
        }
    }
});
