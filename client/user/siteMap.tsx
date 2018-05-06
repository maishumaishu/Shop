import { StationService } from 'user/services/stationService';
import { ShoppingService } from 'user/services/shoppingService';
import { guid } from 'user/services/service';
import { MobilePage } from 'components/mobilePage';
import { default as ProductControl } from 'components/product/control';

import * as React from 'react';
import { Page } from 'user/application';

let dir = 'user/modules'
export let siteMap = {
    nodes: {
        emtpy: { action: (page: chitu.Page) => null },
        page: { action: `${dir}/page` } as chitu.PageNode,
        home_index: { action: home_index_action, cache: true } as chitu.PageNode,
        home_class: { action: home_class_action, cache: true },
        home_product: { action: home_product_action, cache: false } as chitu.PageNode,
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
        user_login: { action: `${dir}/user/login` } as chitu.PageNode,
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
    default: null as chitu.PageNode
}

if (window['userSiteMap']) {
    siteMap = window['userSiteMap']
}
else {
    window['userSiteMap'] = siteMap;
}

siteMap.default = siteMap.nodes.home_index


async function shopping_shoppingCart_action(page: Page, showMenu?: boolean) {
    page.loadCSS();
    let station = page.createService(StationService);
    let pageData = await station.pages.shoppingCart();
    if (showMenu != null) {
        page.data.showBackButton = false;
        pageData.showMenu = showMenu;
    }

    // pageData = await station.fullPage(() => Promise.resolve(pageData));
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ></MobilePage>, page.element);
}

async function home_index_action(page: chitu.Page) {
    let station = page.createService(StationService);
    let pageData = await station.pages.home();// await station.fullPage(() => station.pages.home());

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, page.element);
}

async function home_class_action(page: chitu.Page) {
    let station = page.createService(StationService);
    let pageData = await station.pages.categories(); //await station.fullPage(() => station.pages.categories());

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, page.element);
}

async function user_index_action(page: chitu.Page) {
    let station = page.createService(StationService);
    let pageData = await station.pages.member();//await station.fullPage(() => station.pages.member());
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, page.element);
}

async function home_product_action(page: chitu.Page) {
    let station = page.createService(StationService);
    // let product = await shopping.product(page.data.id);

    let mobilePage: MobilePage;

    let pageData = await station.pages.pageDataById(page.data.id || page.data.pageId || page.data.productId);
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ref={e => mobilePage = e || mobilePage} />, page.element);

    // page.showing.add(async (sender: Page, args) => {
    //     sender.showLoading();
    //     let pageData = await createPageData(shopping, page.data.id);
    //     mobilePage.state.pageData = pageData;
    //     mobilePage.setState(mobilePage.state);
    //     page.hideLoading();
    // })

    async function createPageData(shopping: ShoppingService, productId: string) {
        let product = await shopping.product(productId);
        let pageData = {
            // header: {
            controls: [
                { controlId: guid(), controlName: 'product:Header', position: 'header' },
                { controlId: guid(), controlName: 'product', data: { product }, position: 'view' },
                { controlId: guid(), controlName: 'product:Footer', data: { product }, position: 'footer' }
            ]
            // },
            // view: {
            //     controls: [
            //     ]
            // },
            // footer: {
            //     controls: [
            //     ]
            // }
        } as PageData;
        return pageData;
    }
}


export default siteMap;

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
