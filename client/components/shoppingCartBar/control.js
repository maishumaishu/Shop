define(["require", "exports", "components/common", "../../user/site", "../../user/siteMap"], function (require, exports, common_1, site_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs([`css!${common_1.componentsDir}/shoppingCartBar/control`]);
    class ShoppingCartBarControl extends common_1.Control {
        constructor(props) {
            super(props);
        }
        get persistentMembers() {
            return null;
        }
        _render() {
            return (h("div", { className: "settlement" },
                h("div", { className: "pull-left btn-link", onClick: () => site_1.app.redirect(siteMap_1.siteMap.nodes.shopping_shoppingCart) },
                    h("i", { className: "icon-shopping-cart" })),
                h("div", { className: "pull-right" },
                    h("label", null,
                        "\u603B\u8BA1\uFF1A",
                        h("span", { className: "price" }, "\uFFE50.00")),
                    h("button", { className: "btn btn-primary", disabled: true }, "\u7ED3\u7B97"))));
        }
    }
    exports.default = ShoppingCartBarControl;
});
