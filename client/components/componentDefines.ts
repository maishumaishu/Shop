export interface ComponentDefine {
    name: string, displayName: string, icon: string, introduce: string,
    target?: 'view' | 'footer' | 'header',
    visible?: boolean,
}
// type T = { [propName:string]: Array<ComponentDefine> };
// let a: T;
// let b = a['a']


let componets: Array<ComponentDefine> = [
    {
        name: "productList",
        displayName: "商品列表",
        icon: "icon-list",
        introduce: ""
    },
    {
        name: "summaryHeader",
        displayName: "店铺信息",
        icon: "icon-edit",
        introduce: "显示店铺相关信息，包括店铺图标，店铺名称，商品数量，订单数量等等，一般放置在首页顶部。"
    },
    {
        name: "shoppingCartBar",
        displayName: '购物车栏',
        icon: "icon-shopping-cart",
        introduce: "在底部显示购物车图标，以及结算按钮",
        target: 'footer'
    },
    {
        name: "locationBar",
        displayName: '定位顶栏',
        icon: "icon-map-marker",
        introduce: "在顶部显示购物车图标，显示用户位置",
        target: 'header'
    },
    {
        name: "image",
        displayName: '图片',
        icon: "icon-picture",
        introduce: "用于显示图片"
    },
    {
        name: "html",
        displayName: 'HTML',
        icon: "icon-text-width",
        introduce: "用于创建 HTML 元素"
    },
    {
        name: "navigator",
        displayName: '导航栏',
        icon: "icon-sitemap",
        introduce: "导航栏"
    },
    {
        name: "carousel",
        displayName: "轮播",
        icon: "icon-list-alt",
        introduce: "多张图片轮流播放"
    },
    {
        name: "productInfo",
        displayName: "商品信息",
        icon: "",
        introduce: "",
        visible: false,
    }
];

function controlPath(name: string) {
    return `mobileComponents/${name}/control`;
}
function editorPath(name: string) {
    return `mobileComponents/${name}/control`;
}

export default componets;