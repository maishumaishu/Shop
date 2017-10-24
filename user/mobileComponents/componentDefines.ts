export interface ComponentDefine {
    name: string, displayName: string, icon: string, introduce: string,
}
// type T = { [propName:string]: Array<ComponentDefine> };
// let a: T;
// let b = a['a']


let componets: Array<ComponentDefine> = [
    // {
    //     name: 'carousel',
    //     displayName: '轮播',
    //     icon: "",
    //     introduce: ''
    // },
    // {
    //     name: "towColumnProduct",
    //     displayName: "两列商品",
    //     icon: "",
    //     introduce: ""
    // },
    {
        name: "singleColumnProduct",
        displayName: "商品列表",
        icon: "icon-list",
        introduce: ""
    },
    {
        name: "summaryHeader",
        displayName: "店铺信息",
        icon: "icon-edit",
        introduce: "显示店铺相关信息，包括店铺图标，店铺名称，商品数量，订单数量等等，一般放置在首页顶部。"
    }
];

function controlPath(name: string) {
    return `mobileComponents/${name}/control`;
}
function editorPath(name: string) {
    return `mobileComponents/${name}/control`;
}

export default componets;