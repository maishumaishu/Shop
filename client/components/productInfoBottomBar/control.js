define(["require", "exports", "../common", "user/services/shoppingCartService", "share/common", "../productInfo/control"], function (require, exports, common_1, shoppingCartService_1, common_2, control_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProductInfoBottomBarControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.shoppingCart = this.elementPage.createService(shoppingCartService_1.ShoppingCartService);
            this.subscribe(shoppingCartService_1.ShoppingCartService.productsCount, (value) => {
                this.state.productsCount = value;
                this.setState(this.state);
            });
            this.loadControlCSS();
            setTimeout(() => {
                let c = this.mobilePage.controls.filter(o => o instanceof control_1.default)[0];
                console.assert(c != null);
                this.state = {
                    productsCount: shoppingCartService_1.ShoppingCartService.productsCount.value,
                    product: c.state.product
                };
                let self = this;
                let componentDidUpdate = c['componentDidUpdate'];
                c['componentDidUpdate'] = function () {
                    self.state.product = c.state.product;
                    self.setState(self.state);
                    if (componentDidUpdate)
                        componentDidUpdate();
                };
            }, 100);
        }
        get persistentMembers() {
            return [];
        }
        get hasEditor() {
            return false;
        }
        addToShoppingCart() {
            let c = this.mobilePage.controls.filter(o => o instanceof control_1.default)[0];
            let shoppingCart = this.elementPage.createService(shoppingCartService_1.ShoppingCartService); //this.props.shoppingCart;
            let product = c.state.product;
            let id = product.Id;
            let count;
            let shoppingCartItem = shoppingCartService_1.ShoppingCartService.items.value.filter(o => o.ProductId == product.Id)[0];
            if (shoppingCartItem == null) {
                shoppingCartItem = {
                    Id: common_2.guid(),
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
        }
        _render(h) {
            let { productsCount } = this.state;
            let p = this.state.product;
            let allowBuy = p != null && (p.Stock == null || p.Stock > 0) && p.OffShelve != true;
            let buttonText = "加入购物车";
            if (p != null && p.Stock == 0) {
                buttonText = "商品已售罄";
            }
            else if (p != null && p.OffShelve == true) {
                buttonText = "商品已下架";
            }
            return (h("nav", { className: "settlement" },
                h("a", { href: '#shopping_shoppingCart', className: "pull-left" },
                    h("i", { className: "icon-shopping-cart" }),
                    productsCount ?
                        h("span", { className: "badge bg-primary" }, productsCount)
                        : null),
                h("button", { disabled: !allowBuy, style: { width: 120 }, ref: (e) => e ? e.onclick = ui.buttonOnClick(() => this.addToShoppingCart()) : null, className: "btn btn-primary pull-right" }, buttonText)));
        }
    }
    exports.default = ProductInfoBottomBarControl;
});
