define(["require", "exports", "../common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProductInfoControl extends common_1.Control {
        get persistentMembers() {
            return ['product', 'hideProperties'];
        }
        constructor(props) {
            super(props);
            this.loadControlCSS();
            this.state = {
                product: {}, hideProperties: false,
                count: 1,
                productSelectedText: this.productSelectedText({})
            };
        }
        productSelectedText(product) {
            var str = '';
            var props = product.Fields || [];
            for (var i = 0; i < props.length; i++) {
                // var options = props[i].Options;
                // for (var j = 0; j < options.length; j++) {
                //     if (options[j].Selected) {
                //         str = str + options[j].Name + ' ';
                //         break;
                //     }
                // }
                str = str + props[i].value + ' ';
            }
            str = str + (this.state == null ? 1 : this.state.count) + '件';
            return str;
        }
        _render(h) {
            let { product, hideProperties } = this.state;
            let selectedText = this.productSelectedText(product);
            return [
                h("ul", { key: 10, className: "list-group" },
                    h("li", { className: "list-group-item product-name" }, product.Name),
                    h("li", { className: "list-group-item" },
                        h("span", null, "\u7C7B\u522B\uFF1A"),
                        h("span", null, product.ProductCategoryName)),
                    h("li", { className: "list-group-item" },
                        h("span", null, "\u4EF7\u683C\uFF1A"),
                        h("span", { className: "price" }, product.Price != null ? '￥' + product.Price.toFixed(2) : '')),
                    h("li", { className: "list-group-item" },
                        h("span", null,
                            "\u5DF2\u9009\uFF1A",
                            selectedText),
                        h("span", { className: "pull-right" },
                            h("i", { className: "icon-chevron-right" })))),
                h("hr", { key: 20 }),
                !hideProperties ?
                    h("div", { key: 30, className: "container" },
                        h("h4", { style: { fontWeight: 'bold', width: '100%' } }, "\u5546\u54C1\u4FE1\u606F"),
                        (product.Arguments || []).map(o => (h("div", { key: o.key, style: { marginBottom: '10px' } },
                            h("div", { className: "pull-left", style: { width: '100px' } }, o.key),
                            h("div", { style: { marginLeft: '100px' } }, o.value),
                            h("div", { className: "clearfix" })))),
                        h("div", { className: "empty-info", style: { display: (product.Arguments || []).length == 0 ? 'block' : 'none' } }, "\u6682\u65E0\u5546\u54C1\u4FE1\u606F")) : null,
                !hideProperties ?
                    h("hr", { key: 40 }) : null,
            ];
        }
    }
    exports.default = ProductInfoControl;
});
