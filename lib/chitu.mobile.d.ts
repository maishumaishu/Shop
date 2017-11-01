/// <reference path="chitu.d.ts" />
import * as chitu from 'maishu-chitu';
/**
 * 说明：页面中元素的获取，都是实时 DOM 查询，而不是保存在一个变量中，是因为
 * 某些MVVM框架，可能会用到虚拟 DOM，把页面中的元素改写了。
 */
export declare let isCordovaApp: boolean;
export declare class Page extends chitu.Page {
    displayStatic: boolean;
    allowSwipeBackGestrue: boolean;
    app: Application;
    constructor(params: chitu.PageParams);
}
export declare class Application extends chitu.Application {
    pageShown: chitu.Callback<Application, {
        page: chitu.Page;
    }>;
    constructor();
    protected createPage(routeData: chitu.RouteData, actionArguments: any): chitu.Page;
}
