export interface MenuNode {
    Title: string,
    Icon?: string,
    Url?: string,
    Children?: MenuNode[],
    Parent?: MenuNode,
    Visible?: boolean
};

let menuData: MenuNode[] = [
    { Title: '首页', Icon: 'icon-dashboard', Url: 'Home/Index' },
    {
        Title: "微店",
        Icon: "icon-home",
        Children: [
            { Title: '店铺概况', Url: 'Station/Index' },
            {
                Title: '页面管理',
                Icon: "icon-bullhorn",
                Url: 'Station/PageList',
                Children: [
                    { Title: '页面', Url: 'Station/Page', Visible: false }
                ]
            },
            {
                Title: '会员主页',
                Url: 'Station/StoreMember'
            },
            {
                Title: '店铺导航',
                Url: 'Station/StoreMenu'
            },
            {
                Title: '店铺风格',
                Url: 'Station/StoreStyle'
            }
        ]
    },
    {
        Title: "商品",
        Icon: "icon-gift",
        Children: [
            { Url: "Shopping/ProductList", Title: "商品列表" },
            { Url: "Shopping/ProductCategoryList", Title: "商品类别" },
            { Url: "Shopping/BrandList", Title: "品牌管理" },

        ]
    },
    {
        Title: "订单",
        Icon: "icon-list",
        Children: [
            { Title: '订单列表', Url: "Shopping/OrderList", }
        ]
    },
    {
        Title: '营销',
        Icon: "icon-bullhorn",
        Children: [
            {
                Title: "促销活动",
                Icon: "icon-bullhorn",
                Url: "Shopping/Promotion/Activities",
            },
            {
                Icon: "icon-bullhorn",
                Title: "优惠券",
                Children: [
                    {
                        Url: "Coupon/CouponList", Title: "优惠券",
                        Children: [
                            { Url: "Coupon/CouponEdit", Title: "优惠券编辑", Visible: false },
                        ]
                    },
                    { Url: "Coupon/CouponCodeList", Title: "优惠码" },
                    { Url: "Coupon/CouponSetting", Title: "赠劵规则" }
                ]
            },
        ]
    },
    {
        Title: "会员",
        Icon: "icon-group",
        Children: [
            { Url: "Member/MemberList", Title: "会员列表" },
        ]
    },
    {
        Title: '财务',
        Icon: 'icon-money',
        Children: [
            { Title: '我的收入', Url: 'Finance/Income', },
            { Title: '储值资金', Url: 'Finance/RechargeAmount' },
        ]
    },
    {
        Title: "设置",
        Icon: " icon-cog",
        Children: [
            { Title: "修改密码", Url: 'User/ChangePassword' },
            {
                Title: "运费设置",
                Children: [
                    {
                        Url: "Freight/SolutionList", Title: "快递发货",
                        Children: [{ Title: '运费设置', Url: 'Freight/FreightList' }]
                    },
                    // { Url: "Freight/ProductFreightList", Title: "产品运费" },
                    { Url: 'Freight/InCitySend', Title: '同城配送' }
                ]
            },
        ]
    },
    {
        Title: 'Others',
        Children: [
            { Url: "User/Login", Title: '登录' },
            { Url: 'User/Register', Title: '注册' },
            { Url: 'User/MyStores', Title: '我的店铺' }
        ],
        Visible: false
    }
];

let stack = new Array<MenuNode>();
for (let i = 0; i < menuData.length; i++) {
    stack.push(menuData[i]);
}
while (stack.length > 0) {
    let node = stack.pop();
    let children = node.Children || [];
    children.forEach((c) => {
        c.Parent = node;
        stack.push(c);
    })
}


export default menuData;