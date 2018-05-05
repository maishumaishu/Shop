var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/stationService", "user/services/shoppingService", "user/services/service", "components/mobilePage"], function (require, exports, stationService_1, shoppingService_1, service_1, mobilePage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let dir = 'user/modules';
    exports.siteMap = {
        nodes: {
            emtpy: { action: (page) => null },
            page: { action: `${dir}/page` },
            home_index: { action: home_index_action, cache: true },
            home_class: { action: home_class_action, cache: true },
            home_product: { action: home_product_action, cache: false },
            home_productList: { action: `${dir}/home/productList`, cache: true },
            shopping_invoice: { action: `${dir}/shopping/invoice` },
            shopping_purchase: { action: `${dir}/shopping/purchase` },
            shopping_orderList: { action: `${dir}/shopping/orderList`, cache: true },
            shopping_orderProducts: { action: `${dir}/shopping/orderProducts`, cache: true },
            shopping_shoppingCart: { action: shopping_shoppingCart_action, cache: true },
            user_coupon: { action: `${dir}/user/coupon` },
            user_index: { action: user_index_action },
            user_favors: { action: `${dir}/user/favors`, cache: true },
            user_forgetPassword: { action: `${dir}/user/forgetPassword` },
            user_login: { action: `${dir}/user/login` },
            user_regions: { action: `${dir}/user/regions`, cache: true },
            // user_provinces: { action: `${dir}/user/regions`, cache: true },
            // user_cities: { action: `${dir}/user/regions`, cache: true },
            // user_countries: { action: `${dir}/user/regions`, cache: true },
            user_register: { action: `${dir}/user/register`, cache: true },
            user_receiptEdit: { action: `${dir}/user/receiptEdit`, cache: true },
            user_receiptList: { action: `${dir}/user/receiptList`, cache: true },
            user_userInfo: { action: `${dir}/user/userInfo` },
            user_accountSecurity_index: { action: `${dir}/user/accountSecurity/index` },
            user_accountSecurity_loginPassword: { action: `${dir}/user/accountSecurity/loginPassword` },
            user_accountSecurity_paymentPassword: { action: `${dir}/user/accountSecurity/paymentPassword` },
            user_accountSecurity_mobileBinding: { action: `${dir}/user/accountSecurity/mobileBinding` }
        },
        default: null
    };
    if (window['userSiteMap']) {
        exports.siteMap = window['userSiteMap'];
    }
    else {
        window['userSiteMap'] = exports.siteMap;
    }
    exports.siteMap.default = exports.siteMap.nodes.home_index;
    function shopping_shoppingCart_action(page, showMenu) {
        return __awaiter(this, void 0, void 0, function* () {
            page.loadCSS();
            let station = page.createService(stationService_1.StationService);
            let pageData = yield station.pages.shoppingCart();
            if (showMenu != null) {
                page.data.showBackButton = false;
                pageData.showMenu = showMenu;
            }
            pageData = yield station.fullPage(() => Promise.resolve(pageData));
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page }), page.element);
        });
    }
    function home_index_action(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let station = page.createService(stationService_1.StationService);
            let pageData = yield station.fullPage(() => station.pages.home());
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page }), page.element);
        });
    }
    function home_class_action(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let station = page.createService(stationService_1.StationService);
            let pageData = yield station.fullPage(() => station.pages.categories());
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page }), page.element);
        });
    }
    function user_index_action(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let station = page.createService(stationService_1.StationService);
            let pageData = yield station.fullPage(() => station.pages.member());
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page }), page.element);
        });
    }
    function home_product_action(page) {
        return __awaiter(this, void 0, void 0, function* () {
            var shopping = page.createService(shoppingService_1.ShoppingService);
            let product = yield shopping.product(page.data.id);
            let mobilePage;
            let pageData = yield createPageData(shopping, page.data.id);
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page, ref: e => mobilePage = e || mobilePage }), page.element);
            // page.showing.add(async (sender: Page, args) => {
            //     sender.showLoading();
            //     let pageData = await createPageData(shopping, page.data.id);
            //     mobilePage.state.pageData = pageData;
            //     mobilePage.setState(mobilePage.state);
            //     page.hideLoading();
            // })
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
    }
    exports.default = exports.siteMap;
});
// var root: MySiteMapNode = {
//     pageName: 'home.index',
//     title: storeName,
//     children: [
//         {
//             pageName: 'home.class',
//             children: [
//                 {
//                     pageName: 'home.productList',
//                     children: [{ pageName: 'home.product', title: '商品详情' }]
//                 }
//             ]
//         },
//         { pageName: 'shopping.shoppingCart', title: '购物车' },
//         { pageName: 'home.class', title: '商品类别' },
//         {
//             pageName: 'user.index',
//             title: '用户中心',
//             children: [
//                 {
//                     pageName: 'user.receiptList',
//                     children: [
//                         { pageName: 'user.receiptEdit' }
//                     ]
//                 },
//                 { pageName: 'user.favors', title: '我的收藏' },
//                 { pageName: 'user.coupon', title: '优惠券' },
//                 {
//                     pageName: 'user.accountSecurity.index', title: '账户安全',
//                     children: [
//                         { pageName: 'user.accountSecurity.loginPassword', title: '登录密码' },
//                         { pageName: 'user.accountSecurity.mobileBinding', title: '手机绑定' },
//                         { pageName: 'user.accountSecurity.paymentPassword', title: '支付密码' }
//                     ]
//                 }
//             ]
//         }
//     ]
// }
