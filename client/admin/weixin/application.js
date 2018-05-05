define(["require", "exports", "maishu-chitu", "ui", "share/common", "admin/services/weixin", "weixin/modules/openid"], function (require, exports, chitu, ui, common_1, weixin_1, openid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Application extends chitu.Application {
        constructor() {
            super(Application.siteMap);
            this.error.add((app, err) => this.on_error(app, err));
        }
        on_error(arg0, err) {
            ui.alert(err.message);
        }
    }
    Application.siteMap = {
        nodes: {
            binding: { action: binding_action },
            unbinding: { action: unbinding_action },
            adminLogin: { action: adminLogin_action },
            userLogin: { action: userLogin_action }
        }
    };
    exports.Application = Application;
    function binding_action(page) {
        let props = {
            weixin: page.createService(weixin_1.WeiXinService),
            title: '绑定微信',
            buttonText: '确定绑定',
            content: {
                normal: `确定要绑定微信号到${common_1.shopName}商家后台系统吗`,
                success: '已成功绑定微信号',
                fail: '绑定微信号失败，请重新扫描二维码'
            }
        };
        ReactDOM.render(h(openid_1.OpenIdPage, Object.assign({}, props)), page.element);
    }
    function adminLogin_action(page) {
        let props = {
            weixin: page.createService(weixin_1.WeiXinService),
            title: '商家登录',
            buttonText: '确定登录',
            content: {
                normal: `确定要登录到${common_1.shopName}商家后台系统吗`,
                success: '已成功登录',
                fail: '登录号失败，请重新扫描二维码'
            }
        };
        ReactDOM.render(h(openid_1.OpenIdPage, Object.assign({}, props)), page.element);
    }
    function userLogin_action(page) {
        let props = {
            weixin: page.createService(weixin_1.WeiXinService),
            title: '客户端登录',
            buttonText: '确定登录',
            content: {
                normal: `确定要登录到${common_1.shopName}客户端吗`,
                success: '已成功登录',
                fail: '登录号失败，请重新扫描二维码'
            }
        };
        ReactDOM.render(h(openid_1.OpenIdPage, Object.assign({}, props)), page.element);
    }
    function unbinding_action(page) {
        let props = {
            weixin: page.createService(weixin_1.WeiXinService),
            title: '解绑微信',
            buttonText: '确定解绑',
            content: {
                normal: '确定要解绑微信号吗',
                success: '已成功解绑微信号',
                fail: '解绑失败，请重新扫描二维码'
            }
        };
        ReactDOM.render(h(openid_1.OpenIdPage, Object.assign({}, props)), page.element);
    }
    window['app'] = window['app'] || new Application();
    let app = window['app'];
    exports.default = app;
});
