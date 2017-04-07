let menuData = [
    {
        "Title": "微店管理",
        "Icon": "icon-home",
        "Children": [
            // { "Url": "#Station/AdvertItemList", "Title": "首页广告" },
            {
                Title: '页面管理',
                Icon: "icon-bullhorn",
                Url: '#Station/PageList'
            },
            {
                "Url": "javascript:",
                "Title": "运费管理",
                "Children": [
                    { "Url": "#Freight/SolutionList", "Title": "运费模板" },
                    { "Url": "#Freight/ProductFreightList", "Title": "产品运费" }
                ]
            },
            { "Url": "#Shopping/OrderList", "Title": "订单管理" },
            {
                "Url": "javascript:",
                "Title": "优惠券管理",
                "Children": [
                    { "Url": "#Coupon/CouponList", "Title": "优惠券" },
                    { "Url": "#Coupon/CouponCodeList", "Title": "优惠码" },
                    { "Url": "#Coupon/CouponSetting", "Title": "设置" }
                ]
            },
            { "Url": "#Shopping/OutletList", "Title": "门店管理", "Visible": false }
        ]
    },
    {
        "Title": "商品管理",
        "Icon": "icon-bullhorn",
        "Children": [
            { "Url": "#Shopping/ProductCategoryList", "Title": "商品类别" },
            { "Url": "#Shopping/BrandList", "Title": "品牌管理" },
            { "Url": "#Shopping/ProductList", "Title": "商品列表" }
        ]
    },
    {
        "Title": "促销活动",
        "Icon": "icon-bullhorn",
        "Url": "#Shopping/Promotion/Activities",
        "Children": [
            {
                "Url": "#Shopping/Promotion/ActivityEdit",
                "Title": "编辑活动",
                "Visible": false,
                "Children": [
                    { "Url": "#Shopping/Promotion/ProductGiven", "Title": "产品：买就送" }
                ]
            }
        ]
    },
    {
        "Title": "会员管理",
        "Icon": "icon-group",
        "Children": [
            { "Url": "#Member/MemberList", "Title": "会员列表" }
        ]
    },
    {
        "Title": "密码修改",
        "Icon": "icon-key",
        "Url": "#User/ChangePassword"
    },
    {
        "Title": "系统管理",
        "Icon": "icon-hdd",
        "Children": [
            { "Url": "#Member/OperatorList", "Title": "操作人员", "Visible": false },
            { "Url": "#WeiXin/Setting", "Title": "微信设置" },
            { "Url": "#System/EventCallback", "Title": "事件回调" },
            { "Url": "#WeiXin/MessageTemplates", "Title": "消息模版" }
        ]

    }
];
export = menuData;