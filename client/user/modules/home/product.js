var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/service", "user/services/shoppingService", "components/mobilePage"], function (require, exports, service_1, shoppingService_1, mobilePage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            var shopping = page.createService(shoppingService_1.ShoppingService);
            let product = yield shopping.product(page.data.id);
            let mobilePage;
            let pageData = yield createPageData(shopping, page.data.id);
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page, ref: e => mobilePage = e || mobilePage }), page.element);
            page.showing.add((sender, args) => __awaiter(this, void 0, void 0, function* () {
                sender.showLoading();
                let pageData = yield createPageData(shopping, page.data.id);
                mobilePage.state.pageData = pageData;
                mobilePage.setState(mobilePage.state);
                page.hideLoading();
            }));
        });
    }
    exports.default = default_1;
    function createPageData(shopping, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield shopping.product(productId);
            let pageData = {
                header: {
                    controls: [
                        { controlId: service_1.guid(), controlName: 'product:Header' }
                    ]
                },
                view: {
                    controls: [
                        { controlId: service_1.guid(), controlName: 'product', data: { product } }
                    ]
                },
                footer: {
                    controls: [
                        { controlId: service_1.guid(), controlName: 'product:Footer', data: { product } }
                    ]
                }
            };
            return pageData;
        });
    }
});
