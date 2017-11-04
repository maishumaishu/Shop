import * as React from 'react';
import * as ReactDOM from 'react-dom';
window['h'] = window['h'] || React.createElement;

import { StationService } from 'userServices/stationService';

import { Application as BaseApplication } from 'chitu.mobile';
import { MobilePage } from 'mobileComponents/mobilePage'

/** 是否为 APP */
let isCordovaApp = location.protocol === 'file:';
/** 是否为安卓系统 */
export let isAndroid = navigator.userAgent.indexOf('Android') > -1;
/** 是否允浸入式头 */
let allowImmersionHeader = false;
let topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];

const loadingClassName = 'loading';

if (isCordovaApp && !isAndroid) {
    allowImmersionHeader = true;
}

export let config = {
    defaultUrl: 'home_index'
}

let station = new StationService();

export class Menu extends React.Component<{ pageName?: string }, { itemsCount?: number }>{
    render() {
        return (
            <div ref={async (e: HTMLElement) => {
                if (!e) return;
                // let menuControlData = await station.menuControlData();
                // let menuElement = MobilePage.createControlInstance(menuControlData, e);
            }}></div>
        );
    }
}

export class Page extends chitu.Page {
    private allowSwipeBackGestrue;
    private displayStatic;

    constructor(params) {
        super(params);


        let className = this.routeData.pageName.split('.').join('-');
        this.element.className = (allowImmersionHeader ? 'mobile-page immersion ' : 'mobile-page ') + className;
        this.displayStatic = topLevelPages.indexOf(this.name) >= 0 || this.name == 'home.search';

        //=========================================
        // 在 shown 加入转动，而不是一开始加，避免闪烁
        this.shown.add((sender: Page, args) => {
            let i = sender.element.querySelector('section.loading i') as HTMLElement;
            if (i)
                i.className = i.className + ' icon-spin';
        })
        //=========================================

        //===================================================
        // IOS WEB 浏览器自带滑动返回
        this.allowSwipeBackGestrue = (isCordovaApp || isAndroid) && topLevelPages.indexOf(this.routeData.pageName) < 0;
        //===================================================readonly

        this.renderLoading();
    }

    private renderLoading() {
        ReactDOM.render(
            <div>
                {this.createHeader()}
                <section className={loadingClassName}>
                    <div className="spin">
                        <i className="icon-spinner icon-spin"></i>
                    </div>
                </section>
                {topLevelPages.indexOf(this.routeData.pageName) >= 0 ?
                    <footer>
                        <Menu pageName={this.name} />
                    </footer>
                    : null
                }
            </div>,
            this.element
        );
    }

    private renderError() {
        ReactDOM.render(
            <div>
                {this.createHeader()}

                <div className="norecords">
                    <div className="icon">
                        <i className="icon-rss">
                        </i>
                    </div>
                    <h4 className="text"></h4>
                    <button onClick={() => this.reload()} className="btn btn-default">点击重新加载页面</button>
                </div>

            </div>, this.element
        );
    }

    private createHeader() {
        let noneHeaderPages = ['user.index'];
        if (noneHeaderPages.indexOf(this.routeData.pageName) >= 0) {
            return;
        }

        let navBar;
        switch (this.routeData.pageName) {
            case 'home.product':
                navBar = productNavBar();
                break;
            case 'home.search':
                navBar = searchNavBar();
                break;
            default:
                let isTopPage = topLevelPages.indexOf(this.routeData.pageName) >= 0;
                navBar = defaultNavBar({ showBackButton: !isTopPage });
                break;
        }

        return <header>{(navBar)}</header>;
    }

    // createService<T extends Service>(serviceType: { new (): T }): T {
    //     let result = new serviceType();
    //     result.error.add((sender, error) => {
    //         this.processError(error);
    //     })
    //     return result;
    // }

    private showLoginPage = false;
    private processError(err: Error) {
        if (err.name == 'HeaderRequiredExeption' && err.message.indexOf('user-id') > 0) {
            // app.pages.pop();
            if (this.showLoginPage) {
                return;
            }

            this.showLoginPage = true;
            var currentPage = app.currentPage;
            app.showPage('user_login', { return: currentPage.routeData.routeString });
            setTimeout(() => {
                this.showLoginPage = false;
                currentPage.close();
            }, 800);
            return;
        }
        let loadingElement = this.element.querySelector(`.${loadingClassName}`) as HTMLElement;
        if (loadingElement) {
            this.renderError();
        }
        else {
            alert(err.message);
            console.log(err);
        }
    }

    /** 判断主视图是否为活动状态 */
    private dataViewIsActive() {
        // 选取主视图后面的视图，如果有显示的，则说明为非活动状态
        let views = this.element.querySelectorAll('section[class="main"] + section');
        for (let i = 0; i < views.length; i++) {
            let view = views[i] as HTMLElement;
            let display = !view.style.display || view.style.display == 'block';
            if (display)
                return false;
        }

        return true;
    }

    reload() {
        let result = super.reload();
        this.renderLoading();
        return result;
    }
}

export class Application extends BaseApplication {
    private topLevelPages = ['home.index', 'home.class', 'shopping.shoppingCart', 'home.newsList', 'user.index'];
    constructor() {
        super();
        this.pageType = Page;

        //==================================================
        // 添加样式
        // let styleElement = document.createElement("div");
        // document.body.appendChild(styleElement);
        // station.styleControlData().then(controlData => {
        //     MobilePage.createControlInstance(controlData, styleElement);
        // })
        //==================================================


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
            station.pages.style().then(pageData => {
                ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, element);
            })
            this.styleloaded = true;
        }
        //===================================================

        return page;
    }

    protected createPageElement(routeData: chitu.RouteData) {
        let element = document.createElement('div');
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

export let app = new Application();
app.backFail.add(() => {
    app.redirect(config.defaultUrl);
});


if (!location.hash) {
    app.redirect(config.defaultUrl);
}


//============================================================
// ui
export function defaultNavBar(options?: { title?: string, showBackButton?: boolean, right?: JSX.Element, back?: () => void, left?: JSX.Element }) {
    options = options || {};
    let title = options.title || '';
    let showBackButton = options.showBackButton == null ? true : options.showBackButton;
    let back = options.back || (() => app.back());

    if (showBackButton && options.left == null) {
        options.left = <button name="back-button" onClick={() => back()} className="left-button" style={{ opacity: 1 }}>
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

export function productNavBar() {
    return (
        <nav style={{ opacity: 1, backgroundColor: 'unset' }}>
            <button onClick={() => app.back()} className="leftButton">
                <i className="icon-chevron-left"></i>
            </button>
        </nav>
    );
}

export function searchNavBar() {
    return (
        <nav style={{ backgroundColor: 'white', borderBottom: 'solid 1px #ccc' }}>
            <button onClick={() => window['app'].back()} className="leftButton">
                <i className="icon-chevron-left"></i>
            </button>
        </nav>
    );
}

//===================================================
// 生成样式
// let element = document.createElement('div');
// document.body.appendChild(element);
// let stylePage = app.stylePage;
// station.stylePage().then(pageData => {
//     ReactDOM.render(<MobilePage pageData={pageData} elementPage={stylePage} />, element);
// })

//===================================================