import * as React from 'react';
import * as ReactDOM from 'react-dom';
window['h'] = window['h'] || React.createElement;

import { StationService } from 'userServices/stationService';
import { WeiXinService } from 'userServices/weiXinService';
import { Application as BaseApplication } from 'chitu.mobile';
import { MobilePage } from 'mobileComponents/mobilePage'

export let config = {
    defaultUrl: 'home_index'
}


chitu.Page.tagName = "article";

export class Application extends BaseApplication {
    constructor() {
        super();
    }

    public parseRouteString(routeString: string) {
        let routeData = new chitu.RouteData(this.fileBasePath, routeString, '_');
        return routeData;
    }

    private styleloaded: boolean;
    protected createPage(routeData: chitu.RouteData, actionArguments) {
        let page = super.createPage(routeData, actionArguments);// as Page;
        let path = routeData.actionPath.substr(routeData.basePath.length);
        let cssPath = `css!modules` + path;
        requirejs([cssPath]);

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
        element.className = "mobile-page " + routeData.pageName.split('.').join('-');
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

export let app = window["app"] = window["app"] || new Application();


// (async function () {

var ua = navigator.userAgent.toLowerCase();
let isWeixin = (ua.match(/MicroMessenger/i) as any) == 'micromessenger';
let weixin = new WeiXinService(); //app.currentPage.createService(WeiXinService);


if (isWeixin && weixin.openid == null) {
    weixin.weixinSetting().then(setting => {
        if (setting == null) {
            return;
        }

        let appid = setting.AppId;
        let { protocol, pathname, search, hash } = location;
        var redirect_uri = `${protocol}//${location.pathname}${search}`;
        var state = hash ? hash.substr(1) : '';

        var url =
            `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`
        location.href = url;
    })

}
else if (!location.hash) {
    debugger;
    app.redirect(config.defaultUrl);
}

// })();


app.error.add((page, error) => {
    alert(error.message);
})

//============================================================
// ui
export function defaultNavBar(options?: { title?: string, showBackButton?: boolean, right?: JSX.Element, left?: JSX.Element }) {
    options = options || {};
    let title = options.title || '';
    let showBackButton = options.showBackButton == null ? true : options.showBackButton;
    // let back = options.back || (() => app.back());

    if (showBackButton && options.left == null) {
        options.left = <button name="back-button" className="left-button" style={{ opacity: 1 }}>
            <i className="icon-chevron-left"></i>
        </button>;
    }

    return (
        <nav className="bg-primary">
            <div className="col-xs-3" style={{ padding: 0 }}>
                {options.left ? options.left : null}
            </div>
            <div className="col-xs-6" style={{ padding: 0 }}>
                <h4>
                    {title}
                </h4>
            </div>
            <div className="col-xs-3" style={{ padding: 0 }}>
                {options.right ? (options.right) : null}
            </div>
        </nav>
    );
}


