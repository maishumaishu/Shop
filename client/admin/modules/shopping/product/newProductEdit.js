var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/mobilePageDesigner", "user/services/stationService", "admin/services/station", "admin/services/shopping", "admin/services/dataSource"], function (require, exports, mobilePageDesigner_1, stationService_1, station_1, shopping_1, dataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            class ProductEditPage extends React.Component {
                saveProduct(pageData) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let station = page.createService(station_1.StationService);
                        yield station.savePageData(pageData);
                        console.assert(pageData.id != null);
                        let shop = page.createService(shopping_1.ShoppingService);
                        let product = productFromPageData(pageData);
                        console.assert(product != null);
                        let parentId = page.data.parentId;
                        // return shop.saveProduct({ product, parentId, id: pageData.id });
                        return dataSource_1.product.update(product, { parentId, id: pageData.id });
                    });
                }
                render() {
                    let { pageData } = this.props;
                    let adminStation = page.createService(station_1.StationService);
                    let userStation = page.createService(stationService_1.StationService);
                    let shop = page.createService(shopping_1.ShoppingService);
                    return (h(mobilePageDesigner_1.MobilePageDesigner, { pageData: pageData, save: (pageData) => this.saveProduct(pageData), pageDatas: userStation.pages, showComponentPanel: true, buttons: [
                            h("button", { key: 100, className: "btn btn-sm btn-primary", onClick: () => history.back() },
                                h("i", { className: "icon-reply" }),
                                h("span", null, "\u8FD4\u56DE"))
                        ], ref: e => this.designer = e || this.designer }));
                }
            }
            let productId = page.data.id || page.data.parentId;
            let pageData;
            let product;
            if (productId) {
                let station = page.createService(station_1.StationService);
                // pageData 的 id 和 商品 一样
                let userStation = page.createService(stationService_1.StationService);
                pageData = yield userStation.pages.pageDataById(productId);
                let product = productFromPageData(pageData);
                // parentId 不为空，是要复制一份商品，源 id 为 parentId
                if (page.data.parentId) {
                    pageData.id = null;
                    console.assert(product.Id == null);
                }
                else {
                    product.Id = productId;
                }
            }
            else {
                pageData = {
                    name: '*product',
                    // view: {
                    controls: [
                        { controlName: 'carousel', controlId: station_1.guid(), data: { autoplay: false }, position: 'view' },
                        { controlName: 'productInfo', controlId: station_1.guid(), selected: true, position: 'view' },
                        { controlName: 'html', controlId: station_1.guid(), data: { emptyText: '暂无商品简介，点击设置商品简介，还可以添加其他组件。' }, position: 'view' },
                        { controlName: 'productInfoBottomBar', controlId: station_1.guid(), position: 'footer' }
                    ]
                    // },
                    // footer: {
                    //     controls: [
                    //         { controlName: 'productInfoBottomBar', controlId: guid() }
                    //     ]
                    // }
                };
            }
            //===========================================================
            // 通过 itemWidth 设置列表项的宽
            let carousel = pageData.controls.filter(o => o.controlName == 'carousel')[0];
            console.assert(carousel != null);
            let carouselState = carousel.data;
            carouselState.itemScale = 1;
            carouselState.clickType = 'showImage';
            //===========================================================
            ReactDOM.render(h(ProductEditPage, Object.assign({}, { pageData })), page.element);
        });
    }
    exports.default = default_1;
    function productFromPageData(pageData) {
        let productInfo = pageData.controls.filter(o => o.controlName == 'productInfo')[0];
        console.assert(productInfo != null);
        let product = productInfo.data.product;
        return product;
    }
});
