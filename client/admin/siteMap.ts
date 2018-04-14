let dir = 'modules';
let siteMap = {
    nodes: {
        "home/index": {
            action: `${dir}/home/index`
        },
        "coupon/couponList": {
            action: `${dir}/coupon/couponList`
        },
        "coupon/couponCodeList": {
            action: `${dir}/coupon/couponCodeList`
        },
        "user/login": {
            action: 'modules/user/login'
        },
        "shopping/productList": {
            action: `${dir}/shopping/productList`
        },
        "shopping/orderList": {
            action: `${dir}/shopping/orderList`,
        },
        "shopping/promotion/activities": {
            action: `${dir}/shopping/promotion/activities`
        },
        "station/index": {
            title: '店铺设置',
            action: `${dir}/station/index`
        },
        "station/pages/home": {
            title: '店铺首页',
            action: `${dir}/station/pages/home`
        },
        "station/shoppingCart": {
            action: `${dir}/station/shoppingCart`
        },
        "station/storeMember": {
            title: '会员主页',
            action: `${dir}/station/storeMember`
        },
        "station/storeCategories": {
            action: `${dir}/station/storeCategories`,
        },
        "station/storeMenu": {
            title: '店铺导航',
            action: `${dir}/station/storeMenu`
        },
        "station/storeStyle": {
            title: '店铺风格',
            action: `${dir}/station/storeStyle`
        },
        "user/myStores": {
            title: '我的店铺',
            action: `${dir}/user/myStores`
        },
        "shopping/promotion/activityEdit": { action: "modules/shopping/promotion/activityEdit" },
        "shopping/product/productEdit": { action: "modules/shopping/product/productEdit" },
        productEdit: { action: "modules/shopping/product/productEdit" },
        couponEdit: { action: 'coupon/couponEdit' }
    }
}

export default siteMap;