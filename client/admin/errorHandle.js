define(["require", "exports", "admin/services/service", "admin/application", "admin/siteMap"], function (require, exports, service_1, application_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    service_1.Service.error.add((sender, err) => {
        //724
        switch (err.name) {
            case '600': //600 为未知异常
            default:
                ui.alert({ title: '错误', message: err.message });
                console.log(err);
                break;
            case '724': //724 为 token 失效
            case '601'://601 为用户未登录异常
                if (err.name == '724') {
                    service_1.Service.token.value = '';
                }
                var currentPage = application_1.app.currentPage;
                let isLoginPage = currentPage.name == 'user.login';
                if (isLoginPage) {
                    return;
                }
                // //========================================================
                // // 1. 如果在打开页面的过程中页面出现未登录，就关掉打开的页面    
                // // 2. 如果是点击按钮的时候出现未登录，就调转登录页面       
                // if ((err.method || 'get') == 'get') {
                //     app.showPage('user_login', { return: currentPage.routeData.routeString });
                //     currentPage.close()
                //     // setTimeout(() => currentPage.close(), 100);
                // }
                // else {
                //     app.redirect('user_login', { return: currentPage.routeData.routeString });
                // }
                //========================================================
                application_1.app.redirect(siteMap_1.siteMap.nodes.user_login, { return: currentPage.name });
                break;
            case '725':
                ui.alert({ title: '错误', message: 'application-key 配置错误' });
                break;
        }
        //========================================
        // 延迟处理错误，让其它模块先处理
        let timeoutId = setTimeout(() => {
            if (!err['handled']) {
                ui.alert({
                    title: '错误',
                    message: err.message
                });
            }
            clearTimeout(timeoutId);
        }, 100);
        //========================================
    });
});
