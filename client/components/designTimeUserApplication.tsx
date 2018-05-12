import { UserApplication as UserApplication, UserPage as UserPage } from 'user/application';
import { MobilePage } from 'components/mobilePage';
import userSiteMap from 'user/siteMap';
import { renderQRCode } from 'admin/weixin/modules/openid';
import { WeiXinService } from 'user/services/weixinService';
import * as mockData from 'user/services/mockData';
import { ShoppingCartService } from 'user/services/shoppingCartService';
import { MemberService } from 'user/services/memberService';
import { guid } from 'share/common';

class DesignTimeUserPage extends UserPage {
    createService<T extends chitu.Service>(type?: chitu.ServiceConstructor<T>): T {
        let service = super.createService<T>(type);
        console.assert(this._app instanceof DesignTimeUserApplication);
        if ((this._app as DesignTimeUserApplication).enableMock) {
            service = mockService<T>(service);
        }
        return service;
    }
}

export class DesignTimeUserApplication extends UserApplication {
    private screenElement: HTMLElement;

    private _enableMock: boolean;

    constructor(screenElement: HTMLElement, enableMock?: boolean) {
        super();

        this.screenElement = screenElement;
        this.pageType = DesignTimeUserPage;
        this._enableMock = enableMock == null ? false : enableMock;

        let pageName = userSiteMap.nodes.user_login.name;
        console.assert(pageName != null);

        let app = this;
        this.nodes[pageName].action = function (page: chitu.Page) {
            ReactDOM.render([
                <div key={10} className="text-center" style={{ paddingTop: 100 }}>
                    <b>该页面需要登录后才能显示</b>
                    <br />
                    <b>请使用微信扫描二维登录客户端</b>
                </div>,
                <div key={20} className="text-center" style={{ paddingTop: 20 }}
                    ref={(e: HTMLElement) => {
                        if (!e) return;
                        renderQRCode({
                            element: e,
                            mobilePageName: 'userLogin',
                            async  callback(code: string) {
                                let weixin = page.createService(WeiXinService);
                                let result = await weixin.login(code);
                                page.close();

                                app.currentPage.show();
                                app.currentPage.reload();
                                return result;
                            }
                        })
                    }}>
                </div>
            ], page.element);
        }
    }
    get designPageNode() {
        return userSiteMap.nodes.emtpy;
    }
    get enableMock() {
        return this._enableMock;
    }
    showDesignPage() {
        this.showPage(userSiteMap.nodes.emtpy);
    }
    createPageElement(pageName: string) {
        let element = super.createPageElement(pageName);
        this.screenElement.appendChild(element);
        return element;
    }
    createService<T extends chitu.Service>(type?: chitu.ServiceConstructor<T>): T {
        let service = super.createService<T>(type);
        if (this._enableMock) {
            service = mockService<T>(service);
        }
        return service;
    }
}

function mockService<T extends chitu.Service>(service: T): T {
    if (service instanceof ShoppingCartService) {
        service.items = async () => {
            return mockData.shoppingCartItems;
        }
        service.calculateShoppingCartItems = async () => {
            return mockData.shoppingCartItems;
        }
    }
    else if (service instanceof MemberService) {
        service.store = async () => {
            let store: Store = { Id: guid(), Name: '', Data: { ImageId: '' } }
            return store;
        }
    }

    return service;
}
