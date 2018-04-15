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
        "freight/solutionList": {
            action: `${dir}/freight/solutionList`
        },
        "member/memberList": {
            action: `${dir}/member/memberList`,
        },
        "user/changePassword": {
            action: `${dir}/user/changePassword`
        },
        "user/login": {
            action: `${dir}/user/login`
        },
        "shopping/brandList": {
            action: `${dir}/shopping/brandList`
        },
        "shopping/paymentSetting": {
            action: `${dir}/shopping/paymentSetting`
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
        "shopping/promotion/activityEdit": {
            action: `${dir}/shopping/promotion/activityEdit`
        },
        "shopping/product/productEdit": {
            action: `${dir}/shopping/product/productEdit`
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
        "weixin/setting": {
            action: `${dir}/weixin/setting`
        },
        productEdit: { action: "modules/shopping/product/productEdit" },
        couponEdit: { action: 'coupon/couponEdit' }
    }
}

export default siteMap;