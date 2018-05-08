import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Service, urlParams, tokens } from 'user/services/service';
import { StationService } from 'user/services/stationService';
import { WeiXinService } from 'user/services/weixinService';
import { userData } from 'user/services/userData';
import { MobilePage } from 'components/mobilePage'
import * as ui from 'ui';
import siteMap from 'user/siteMap';
import { AppError, ErrorCodes, guid } from 'share/common';
import { ShoppingCartService } from 'user/services/shoppingCartService';
import { MemberService, userInfo } from 'user/services/memberService';

window['h'] = window['h'] || React.createElement;


siteMap.nodes["empty"] = {
    action(page: UserPage) {
        page.hideLoading();
    }
}

export class UserPage extends chitu.Page {
    constructor(params: chitu.PageParams) {
        super(params);
        console.assert(this._app instanceof UserApplication);
        this.showLoading();
    }
    loadCSS() {
        let path = this.name.split('_').join('/');
        requirejs([`css!user/modules/${path}`])
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
    get app(): UserApplication {
        return this._app as UserApplication;
    }

}

let link: HTMLLinkElement;

export class UserApplication extends chitu.Application {
    private emtpyPageElement: HTMLElement;

    constructor() {
        super(siteMap);

        chitu.Page.tagName = "article";
        this.pageType = UserPage;
        this.error.add((s, e: AppError, p) => this.on_error(s, e, p));
        this.init();
        if (link == null) {
            link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet";
            let member = this.createService(MemberService);
            member.store().then(store => {
                if (store.Data.Style)
                    this.loadCSS(store.Data.Style)
            })

            document.head.appendChild(link);
        }
    }

    loadCSS(color: StyleColor) {
        let href = `../components/style/style_${color}.css`;
        if (link.href == href) {
            return;
        }

        link.href = href;
    }

    createEmptyPage(element: HTMLElement) {
        if (!element) throw new Error("argument element is null.");

        this.emtpyPageElement = element;
        let page = this.createPage("empty") as UserPage;
        return page;
    }

    createUrl(node: chitu.PageNode, args?: any)
    createUrl(pageName: string, args?: any)
    createUrl(obj: any, args?: any) {
        let pageName: string;
        if (typeof obj == 'string')
            pageName = obj;
        else {
            pageName = (obj as chitu.PageNode).name;
            console.assert(pageName != null);
        }

        let url = super.createUrl(pageName, args);
        let { protocol, port, host } = location;
        let baseUrl = `${protocol}//${host}/user/?appKey=${tokens.appId}`;
        url = baseUrl + url;
        return url;
    }

    // private styleloaded: boolean;
    protected createPage(pageName: string, value?: any) {
        let page = super.createPage(pageName, value) as UserPage;
        //===================================================
        // 生成样式
        // if (!this.styleloaded) {
        //     let element = document.createElement('div');
        //     document.body.appendChild(element);
        //     let station = page.createService(StationService);
        //     station.pages.style().then(pageData => {
        //         ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, element);
        //     })
        //     this.styleloaded = true;
        // }
        //===================================================
        return page;
    }

    protected createPageElement(pageName: string) {
        if (pageName == 'empty')
            return this.emtpyPageElement;

        let element = document.createElement(chitu.Page.tagName);
        element.className = pageName.split('_').join('-') + " mobile-page";
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

    protected on_error(app: chitu.Application, err: AppError, page?: chitu.Page) {
        if (err.handled)
            return;

        switch (err.name) {
            case ErrorCodes.Unkonwn:     //600 为未知异常
            default:
                ui.alert({ title: '错误', message: err.message });
                console.log(err);
                break;
            case ErrorCodes.TokenInvalid:     //724 为 token 失效
            case ErrorCodes.UserNotLogin:     //601 为用户未登录异常
                if (err.name == '724') {
                    userData.userToken.value = '';
                }
                // var currentPage = app.currentPage;
                let pageName = page ? page.name : '';
                let isLoginPage = pageName == 'user_login';
                if (isLoginPage) {
                    return;
                }
                //========================================================
                app.showPage(siteMap.nodes.user_login, { return: pageName });
                let url = location.href;
                url = url.replace(location.hash, '#user_login');
                break;
            case '725':
                ui.alert({ title: '错误', message: 'application-key 配置错误' });
                break;
        }
    }

    createService<T extends chitu.Service>(type?: chitu.ServiceConstructor<T>): T {
        let service = new type();
        service.error.add((sender, err) => {
            this.error.fire(this, err, this.currentPage);
        })
        return service;
    }

    init() {
        let loadUserInfo = () => {
            let member = this.createService(MemberService);
            member.userInfo().then(data => {
                userInfo.value = data;
            });
        }
        if (tokens.userToken.value) {
            loadUserInfo();
        }

        tokens.userToken.add(() => loadUserInfo());

        if (tokens.userToken.value) {
            let shoppingCart = this.createService(ShoppingCartService);
            shoppingCart.items().then(items => {
                ShoppingCartService.items.value = items;
            });
        }
    }
}




let storeName = localStorage.getItem(`${urlParams.appKey}_storeName`) || '';
ui.loadImageConfig.imageDisaplyText = storeName;



export function app(): UserApplication {
    return window["user-app"];
}



// = window["user-app"];// = window["user-app"] || new Application();