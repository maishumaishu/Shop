define(["require", "exports", "components/common", "user/site", "user/services/shoppingCartService", "siteMap"], function (require, exports, common_1, site_1, shoppingCartService_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const EMPTY_ICON = 'icon-check-empty';
    class MenuControl extends common_1.Control {
        get persistentMembers() {
            return ["menuNodes", "showIcon"];
        }
        constructor(props) {
            super(props);
            let productsCount = shoppingCartService_1.ShoppingCartService.productsCount.value;
            this.state = { menuNodes: [], showIcon: false, productsCount };
            this.subscribe(shoppingCartService_1.ShoppingCartService.productsCount, (value) => {
                this.state.productsCount = value;
                this.setState(this.state);
            });
            this.loadControlCSS();
        }
        _render(h) {
            let menuNodes = this.state.menuNodes || [];
            let showIcon = this.state.showIcon || false;
            return [
                h("div", { key: "menuControl", className: "menuControl" }, menuNodes.length <= 0 ?
                    h("ul", { className: "menu noicon" }) :
                    showIcon ? this.renderMenuWithIcon(h, menuNodes) : this.renderMenuWithoutIcon(h, menuNodes))
            ];
        }
        isShoppingCart(routeString) {
            var routeData = site_1.app.parseUrl(routeString);
            if (routeData.pageName == 'shopping.shoppingCart') {
                return true;
            }
            return false;
        }
        renderMenuWithoutIcon(h, menuNodes) {
            return (h("ul", { className: "menu noicon" }, menuNodes.map((o, i) => {
                let itemWidth = 100 / menuNodes.length;
                return (h("li", { key: i, style: { width: `${itemWidth}%` } },
                    h("a", { href: o.url }, o.name)));
            })));
        }
        renderMenuWithIcon(h, menuNodes) {
            let productsCount = this.state.productsCount || 0;
            return [
                h("ul", { className: "menu" }, menuNodes.map((o, i) => {
                    let itemWidth = 100 / menuNodes.length;
                    // let routeString = o.url.startsWith('#') ? o.url.substr(1) : o.url;
                    var routeData = site_1.app.parseUrl(o.url);
                    let isShoppingCart = routeData.pageName == 'shopping.shoppingCart';
                    let isActive = this.elementPage.name == routeData.pageName; //app.currentPage != null && app.currentPage.name == routeData.pageName;
                    return (h("li", { key: i, style: { width: `${itemWidth}%` } },
                        h("div", { onClick: () => site_1.app.redirect(siteMap_1.default.nodes[routeData.pageName]), className: isActive ? 'text-primary' : null },
                            h("i", { className: o.icon ? o.icon : EMPTY_ICON }),
                            o.name),
                        isShoppingCart && productsCount > 0 ? h("div", { className: "badge bg-primary" }, productsCount) : null));
                }))
            ];
        }
    }
    exports.default = MenuControl;
});
