export interface ComponentDefine {
    name: string, displayName: string, icon: string, introduce: string
}
// type T = { [propName:string]: Array<ComponentDefine> };
// let a: T;
// let b = a['a']
let componets: Array<ComponentDefine> = [
    {
        name: 'carousel',
        displayName: '轮播',
        icon: "",
        introduce: ''
    },
    {
        name: "towColumnProduct",
        displayName: "两列商品",
        icon: "",
        introduce: ""
    },
    {
        name: "singleColumnProduct",
        displayName: "单列商品",
        icon: "",
        introduce: ""
    }
];

export default componets;