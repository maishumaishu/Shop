define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['css!user/controls/productImage']);
    class ProductImage extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            let o = this.props.product;
            return [
                h("img", { key: "img", className: "product-image", src: service_1.imageUrl(o.ImagePath, 200), ref: (e) => {
                        if (!e)
                            return;
                        ui.renderImage(e, { imageSize: { width: 200, height: 200 } });
                    } }),
                o.OffShelve || o.Stock == 0 ? [
                    h("div", { key: "mask", className: "product-image-mask" }),
                    h("div", { key: "text", className: "product-image-text" }, o.OffShelve ? '已下架' : '已售罄')
                ] : null
            ];
        }
    }
    exports.ProductImage = ProductImage;
});
