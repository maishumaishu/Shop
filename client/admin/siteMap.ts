let siteMap = {
    nodes: {
        "user/login": { action: 'modules/user/login' },
        "station/index": {
            title: '店铺设置',
            action: 'modules/station/index'
        },
        "station/pages/home": {
            title: '店铺首页',
            action: 'modules/station/pages/home'
        },
        "station/shoppingCart": {
            action: 'modules/station/shoppingCart'
        },
        "station/storeMember": {
            title: '会员主页',
            action: 'modules/station/storeMember'
        },
        "station/storeCategories": {
            action: 'modules/station/storeCategories',
        },
        "station/storeMenu": {
            title: '店铺导航',
            action: 'modules/station/storeMenu'
        },
        "user/myStores": { action: 'modules/user/myStores' },
        "shopping/promotion/activityEdit": { action: "modules/shopping/promotion/activityEdit" },
        "shopping/product/productEdit": { action: "modules/shopping/product/productEdit" },
        productEdit: { action: "modules/shopping/product/productEdit" },
        couponEdit: { action: 'coupon/couponEdit' }
    }
}

export default siteMap;