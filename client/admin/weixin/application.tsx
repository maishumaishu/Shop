import * as chitu from 'maishu-chitu';
import * as ui from 'ui';
import { parseUrlParams, shopName } from 'share/common';
import { loadjs } from 'common'
import { WeiXinService } from 'admin/services/weixin'
import { Props as OpenIdPageProps, OpenIdPage } from 'weixin/modules/openid'

export type SiteMapNodes = {
    binding: chitu.PageNode,
    unbinding: chitu.PageNode,
    adminLogin: chitu.PageNode,
    userLogin: chitu.PageNode,
}

export class Application extends chitu.Application {

    static siteMap: { nodes: SiteMapNodes } = {
        nodes: {
            binding: { action: binding_action },
            unbinding: { action: unbinding_action },
            adminLogin: { action: adminLogin_action },
            userLogin: { action: userLogin_action }
        }
    }

    constructor() {
        super(Application.siteMap)

        this.error.add((app, err) => this.on_error(app, err));
    }

    on_error(arg0: any, err: Error): any {
        ui.alert(err.message);
    }
}

function binding_action(page: chitu.Page) {
    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '绑定微信',
        buttonText: '确定绑定',
        content: {
            normal: `确定要绑定微信号到${shopName}商家后台系统吗`,
            success: '已成功绑定微信号',
            fail: '绑定微信号失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}

function adminLogin_action(page: chitu.Page) {
    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '商家登录',
        buttonText: '确定登录',
        content: {
            normal: `确定要登录到${shopName}商家后台系统吗`,
            success: '已成功登录',
            fail: '登录号失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}

function userLogin_action(page: chitu.Page) {
    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '客户端登录',
        buttonText: '确定登录',
        content: {
            normal: `确定要登录到${shopName}客户端吗`,
            success: '已成功登录',
            fail: '登录号失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}

function unbinding_action(page: chitu.Page) {
    let props: OpenIdPageProps = {
        weixin: page.createService(WeiXinService),
        title: '解绑微信',
        buttonText: '确定解绑',
        content: {
            normal: '确定要解绑微信号吗',
            success: '已成功解绑微信号',
            fail: '解绑失败，请重新扫描二维码'
        }
    }

    ReactDOM.render(<OpenIdPage {...props} />, page.element);
}

window['app'] = window['app'] || new Application();
let app: Application = window['app'];
export default app;