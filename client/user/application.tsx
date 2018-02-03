import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Service, urlParams } from 'userServices/service';
import { StationService } from 'userServices/stationService';
import { WeiXinService } from 'userServices/weiXinService';
import { Application as BaseApplication, Page as BasePage } from 'chitu.mobile';
import { MobilePage } from 'mobileComponents/mobilePage'
import * as ui from 'ui';

window['h'] = window['h'] || React.createElement;

export let config = {
    defaultUrl: 'home_index'
}

interface MySiteMapNode extends chitu.SiteMapNode {
    title?: string
}

export class Page extends BasePage {
    constructor(params: chitu.PageParams) {
        super(params);

        this.showLoading();
    }

    showLoading() {
        let loadingView = this.element.querySelector('section.loading') as HTMLElement;
        if (loadingView == null) {
            loadingView = document.createElement('section');
            this.element.appendChild(loadingView);
        }
        else {
            loadingView.style.removeProperty('display');
        }

        loadingView.className = 'loading';
        loadingView.innerHTML = "数据正在加载中...";
        loadingView.style.textAlign = "center";
        loadingView.style.fontWeight = 'blod';
    }
    hideLoading() {
        let loadingView = this.element.querySelector('section.loading') as HTMLElement;
        if (loadingView != null) {
            loadingView.style.display = 'none';
        }
    }
}

export class Application extends BaseApplication {
    private topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];

    constructor(args?: { siteMap?: chitu.SiteMap<chitu.SiteMapNode> }) {
        super(args);

        chitu.Page.tagName = "article";
        this.pageType = Page;
    }

    public parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    private emtpyPageElement: HTMLElement;
    createEmptyPage(element: HTMLElement) {
        if (!element) throw new Error("argument element is null.");

        this.emtpyPageElement = element;
        define("modules/empty", ["exports"], function (exports) {
            exports.default = function (page: Page) {
                page.hideLoading();
            }
        })

        let routeData = this.parseRouteString("empty");
        let page = super.createPage(routeData) as Page;
        return page;
    }

    private styleloaded: boolean;
    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as BasePage;
        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!modules` + path;
        requirejs([cssPath]);

        page.displayStatic = this.topLevelPages.indexOf(page.name) >= 0;
        //===================================================
        // 生成样式
        if (!this.styleloaded) {
            let element = document.createElement('div');
            document.body.appendChild(element);
            let station = page.createService(StationService);
            station.pages.style().then(pageData => {
                ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, element);
            })
            this.styleloaded = true;
        }
        //===================================================

        page.active.add(Application.on_pageActived);
        page.closed.add(Application.on_pageClosed);

        return page;
    }
    
    protected createPageElement(routeData: chitu.RouteData) {
        if (routeData.routeString == 'empty')
            return this.emtpyPageElement;

        let element = document.createElement(chitu.Page.tagName);
        element.className = routeData.pageName.split('.').join('-') + " mobile-page";
        if (location.pathname.endsWith('preview.html')) {
            let container = document.querySelector('.screen');
            console.assert(container != null, 'screen is not exists.');
            container.appendChild(element);
        }
        else {
            document.body.appendChild(element);
        }

        return element;
    }

    private static on_pageClosed(sender: chitu.Page) {
        sender.active.remove(Application.on_pageActived);
    }

    private static on_pageActived(page: chitu.Page) {
        let stack = new Array<MySiteMapNode>();

        let pageNode: MySiteMapNode;
        stack.push(root);
        while (stack.length > 0) {
            let item = stack.pop();
            if (item.pageName == page.name) {
                pageNode = item;
                break;
            }
            (item.children || []).forEach(c => stack.push(c));
        }

        if (pageNode)
            document.title = pageNode.title || '';
        else
            document.title = storeName;
    }
}




let storeName = localStorage.getItem(`${urlParams.appKey}_storeName`) || '';
ui.loadImageConfig.imageDisaplyText = storeName;

var root: MySiteMapNode = {
    pageName: 'home.index',
    title: storeName,
    children: [
        {
            pageName: 'home.class',
            children: [
                {
                    pageName: 'home.productList',
                    children: [{ pageName: 'home.product', title: '商品详情' }]
                }
            ]
        },
        { pageName: 'shopping.shoppingCart', title: '购物车' },
        { pageName: 'home.class', title: '商品类别' },
        {
            pageName: 'user.index',
            title: '用户中心',
            children: [
                {
                    pageName: 'user.receiptList',
                    children: [
                        { pageName: 'user.receiptEdit' }
                    ]
                },
                { pageName: 'user.favors', title: '我的收藏' },
                { pageName: 'user.coupon', title: '优惠券' },
                {
                    pageName: 'user.accountSecurity.index', title: '账户安全',
                    children: [
                        { pageName: 'user.accountSecurity.loginPassword', title: '登录密码' },
                        { pageName: 'user.accountSecurity.mobileBinding', title: '手机绑定' },
                        { pageName: 'user.accountSecurity.paymentPassword', title: '支付密码' }
                    ]
                }
            ]
        }
    ]
}


export let app: Application = window["user-app"] = window["user-app"] || new Application({
    siteMap: { root }
});