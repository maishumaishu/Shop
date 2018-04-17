let dir = 'modules';
let siteMap = {
    nodes: {
        home_index: { action: `${dir}/home/index`, cache: true },
        coupon_couponList: { action: `${dir}/coupon/couponList`, cache: true },
        coupon_couponCodeList: { action: `${dir}/coupon/couponCodeList`, cache: true },
        coupon_couponEdit: { action: `${dir}/coupon/couponEdit`, cache: true },
        coupon_couponSetting: { action: `${dir}/coupon/couponSetting`, cache: true },
        freight_solutionList: { action: `${dir}/freight/solutionList`, cache: true },
        freight_freightList: { action: `${dir}/freight/freightList`, cache: true },
        freight_inCitySend: { action: `${dir}/freight/inCitySend`, cache: true },
        member_memberList: { action: `${dir}/member/memberList`, cache: true },
        user_changePassword: { action: `${dir}/user/changePassword`, cache: true },
        user_login: { action: `${dir}/user/login`, cache: true } as chitu.SiteMapNode,
        user_register: { action: `${dir}/user/register`, cache: true } as chitu.SiteMapNode, 
        shopping_brandList: { action: `${dir}/shopping/brandList`, cache: true },
        shopping_categoryList: { action: `${dir}/shopping/productCategoryList`, cache: true },
        shopping_paymentSetting: { action: `${dir}/shopping/paymentSetting`, cache: true },
        shopping_productList: { action: `${dir}/shopping/productList`, cache: true },
        shopping_orderList: { action: `${dir}/shopping/orderList`, cache: true },
        shopping_promotion_activities: { action: `${dir}/shopping/promotion/activities`, cache: true },
        shopping_promotion_activityEdit: { action: `${dir}/shopping/promotion/activityEdit`, cache: true },
        shopping_product_productEdit: { action: `${dir}/shopping/product/productEdit`, cache: false },
        station_index: { action: `${dir}/station/index`, cache: true },
        station_pages_home: { action: `${dir}/station/pages/home`, cache: true },
        station_page: { action: `${dir}/station/pages/page`, cache: true },
        station_pageList: { action: `${dir}/station/pages/pageList`, cache: true },
        station_shoppingCart: { action: `${dir}/station/shoppingCart`, cache: true },
        station_storeMember: { action: `${dir}/station/storeMember`, cache: true },
        station_storeCategories: { action: `${dir}/station/storeCategories`, cache: true },
        station_storeMenu: { action: `${dir}/station/storeMenu`, cache: true },
        station_storeStyle: { action: `${dir}/station/storeStyle`, cache: true },
        user_myStores: { action: `${dir}/user/myStores`, cache: true } as chitu.SiteMapNode,
        weixin_setting: { action: `${dir}/weixin/setting`, cache: true },
    }
}

export type MenuNode = chitu.SiteMapNode & {
    title?: string, icon?: string, visible?: boolean,
    children?: MenuNode[],
    parent?: MenuNode,
};

export let menuData: MenuNode[] = [
    Object.assign(siteMap.nodes.home_index, { title: '概况', icon: 'icon-dashboard', visible: true }),
    {
        title: "微店",
        icon: "icon-home",
        action: null,
        children: [
            Object.assign(siteMap.nodes.station_index, { title: '店铺设置' }),
            Object.assign(siteMap.nodes.station_pages_home, { title: '店铺首页' }),
            Object.assign(siteMap.nodes.station_storeMember, { title: '会员主页' }),
            Object.assign(siteMap.nodes.station_storeMenu, { title: '店铺导航' }),
            Object.assign(siteMap.nodes.station_shoppingCart, { title: '购物车' }),
            Object.assign(siteMap.nodes.station_storeStyle, { title: '店铺风格' }),
            Object.assign(siteMap.nodes.station_storeCategories, { title: '商品类别' }),
            Object.assign(siteMap.nodes.station_pageList, {
                children: [
                    { title: '页面', action: 'station/page', visible: false },
                    { title: '页面', action: 'station/page1', visible: false }
                ],
                visible: false
            }),
        ]
    },
    {
        title: "商品",
        icon: "icon-gift",
        action: null,
        children: [
            Object.assign(siteMap.nodes.shopping_productList, {
                title: "商品列表",
                children: [
                    Object.assign(siteMap.nodes.shopping_product_productEdit, { title: '', visible: false })
                ]
            }),
            Object.assign(siteMap.nodes.shopping_categoryList, { title: '商品分类' }),
            Object.assign(siteMap.nodes.shopping_brandList, { title: "商品品牌" })
        ]
    },
    {
        title: "订单",
        icon: "icon-list",
        action: null,
        children: [
            Object.assign(siteMap.nodes.shopping_orderList, { title: '订单列表' })
        ]
    },
    {
        title: '营销',
        icon: "icon-bullhorn",
        action: null,
        children: [
            Object.assign(siteMap.nodes.shopping_promotion_activities && {
                title: "促销活动",
                icon: "icon-bullhorn",
                children: [
                    Object.assign(siteMap.nodes.shopping_promotion_activities, { title: "" }),
                ]
            }),
            {
                icon: "icon-bullhorn",
                title: "优惠券",
                action: null,
                children: [
                    Object.assign(siteMap.nodes.coupon_couponList, {
                        title: "优惠券",
                        children: [
                            Object.assign(siteMap.nodes.coupon_couponEdit, { title: "优惠券编辑", visible: false }),
                        ]
                    }),
                    Object.assign(siteMap.nodes.coupon_couponSetting, { title: "赠劵规则" })
                ],

            },
            { action: "coupon/couponCodeList", title: "优惠码" }
        ],
    },
    {
        title: "会员",
        icon: "icon-group",
        action: null,
        children: [
            Object.assign(siteMap.nodes.member_memberList, { title: "会员列表" }),
        ]
    },
    {
        title: "设置",
        icon: " icon-cog",
        action: null,
        children: [
            Object.assign(siteMap.nodes.user_changePassword, { title: "账号设置" }),
            {
                title: "运费设置",
                action: null,
                children: [
                    Object.assign(siteMap.nodes.freight_solutionList, {
                        title: "快递发货",
                        children: [
                            Object.assign(siteMap.nodes.freight_freightList, { title: '运费设置' })
                        ]
                    }),
                    Object.assign(siteMap.nodes.freight_inCitySend, { title: '同城配送' }),
                ]
            },
            Object.assign(siteMap.nodes.shopping_paymentSetting, { title: '支付设置' }),
            Object.assign(siteMap.nodes.weixin_setting, { title: '公众号设置' }),
        ]

    },
    {
        title: 'Others',
        action: null,
        children: [
            Object.assign(siteMap.nodes.user_login, { title: '登录' }),
            Object.assign(siteMap.nodes.user_register, { action: 'user/register', title: '注册' }),
            Object.assign(siteMap.nodes.user_myStores, { title: '我的店铺' })
        ],
        visible: false
    },
];

let stack = new Array<MenuNode>();
for (let i = 0; i < menuData.length; i++) {
    stack.push(menuData[i]);
}
while (stack.length > 0) {
    let node = stack.pop();
    node.children = node.children || [];
    console.log(node.name);
    node.children.forEach((c) => {
        c.parent = node;
        stack.push(c);
    })
}


export default siteMap;