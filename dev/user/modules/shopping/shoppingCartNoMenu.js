define(["require", "exports", "user/siteMap"], function (require, exports, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        page.element.className = page.element.className.replace('shoppingCartNoMenu', 'shoppingCart');
        siteMap_1.default.nodes.shopping_shoppingCart.action(page, false);
    }
    exports.default = default_1;
});
