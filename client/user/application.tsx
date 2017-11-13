import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StationService } from 'userServices/stationService';
import { WeiXinService } from 'userServices/weiXinService';
import { Application as BaseApplication, Page as BasePage } from 'chitu.mobile';
import { MobilePage } from 'mobileComponents/mobilePage'

window['h'] = window['h'] || React.createElement;

export let config = {
    defaultUrl: 'home_index'
}


chitu.Page.tagName = "article";
let topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];

export class Application extends BaseApplication {
    constructor(args?: { siteMap?: chitu.SiteMap<chitu.SiteMapNode> }) {
        super(args);
    }

    public parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    private styleloaded: boolean;
    protected createPage(routeData: chitu.RouteData) {
        let page = super.createPage(routeData) as BasePage;
        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!modules` + path;
        requirejs([cssPath]);

        page.displayStatic = topLevelPages.indexOf(page.name) >= 0;

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

        return page;
    }

    protected createPageElement(routeData: chitu.RouteData) {
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
}

export let app: Application = window["app"] = window["app"] || new Application({
    siteMap: {
        root: {
            pageName: 'home.index',
            children: [
                {
                    pageName: 'home.class',
                    children: [
                        {
                            pageName: 'home.productList',
                            children: [{ pageName: 'home.product' }]
                        }
                    ]
                },
                { pageName: 'shopping.shoppingCart' },
                {
                    pageName: 'user.index',
                    children: [
                        {
                            pageName: 'user.receiptList',
                            children: [
                                { pageName: 'user.receiptEdit' }
                            ]
                        },
                        { pageName: 'user.favors' },
                        { pageName: 'user.coupon' },
                        { pageName: 'user.accountSecurity.index' }
                    ]
                }
            ]
        }
    }
});
let weixin = new WeiXinService();
weixin.openid().then(data => {
    let openid = data;
})



