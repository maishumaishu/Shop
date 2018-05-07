import { Application as UserApplication } from 'user/application';
import { MobilePage } from 'components/mobilePage';
import userSiteMap from 'user/siteMap';
import { renderQRCode } from 'weixin/modules/openid';
import { WeiXinService } from 'user/services/weixinService';

export class DesignTimeUserApplication extends UserApplication {
    private screenElement: HTMLElement;
    constructor(screenElement: HTMLElement) {
        super();
        this.screenElement = screenElement;

        let pageName = userSiteMap.nodes.user_login.name;
        console.assert(pageName != null);

        let app = this;
        this.nodes[pageName].action = function (page: chitu.Page) {
            ReactDOM.render([
                <div key={10} className="text-center" style={{ paddingTop: 100 }}>
                    <b>该页面需要登录后才能操作</b>
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
    showDesignPage() {
        this.showPage(userSiteMap.nodes.emtpy);
    }
    createPageElement(pageName: string) {
        let element = super.createPageElement(pageName);
        this.screenElement.appendChild(element);
        return element;
    }
    // protected on_error(app: chitu.Application, err: Error, page?: chitu.Page) {
    //     debugger;
    // }
}
