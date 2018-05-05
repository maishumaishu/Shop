define(["require", "exports", "components/common", "user/services/shoppingService", "user/services/service"], function (require, exports, common_1, shoppingService_1, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CategoriesControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.state = { showIcons: false };
            this.loadControlCSS();
            let shopping = this.elementPage.createService(shoppingService_1.ShoppingService);
            this.elementPage.showLoading();
            shopping.categories().then(categories => {
                this.state.categories = categories;
                this.setState(this.state);
                this.elementPage.hideLoading();
            });
        }
        get persistentMembers() {
            return ["showSecondLevel", "showIcons"];
        }
        _render() {
            var result = this.state.showIcons ?
                this.renderWithIcons() : this.renderWithoutIcons();
            return result;
        }
        renderWithIcons() {
            var categories = this.state.categories;
            return (h("div", { className: "categories-control" }, categories ? categories.map(item => (h("a", { key: item.Id, href: `#home_productList?categoryId=${item.Id}`, className: "col-xs-4" },
                h("img", { src: service_1.imageUrl(item.ImagePath), className: "img-responsive", ref: (e) => e ? ui.renderImage(e) : null }),
                h("span", { className: "mini interception" }, item.Name)))) : null));
        }
        renderWithoutIcons() {
            var categories = this.state.categories;
            return (h("div", { className: "categories-control" }, categories ? categories.map(item => (h("div", { key: item.Id, className: "col-xs-6" },
                h("div", { className: "well" },
                    h("a", { href: `#home_productList?categoryId=${item.Id}` },
                        h("span", { className: "mini interception" }, item.Name)))))) : null));
        }
    }
    exports.default = CategoriesControl;
});
