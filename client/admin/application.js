define(["require", "exports", "react", "react-dom", "ui", "admin/services/service", "share/common", "masterPage", "admin/siteMap"], function (require, exports, React, ReactDOM, ui, service_1, common_1, masterPage_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let h = React.createElement;
    class Application extends chitu.Application {
        constructor() {
            super(siteMap_1.siteMap);
            ui.dialogConfig.dialogContainer = document.querySelector('.dialog-container');
            this.createMasterPage();
            this.error.add((app, err) => this.errorHandle(err));
        }
        run() {
            if (!location.hash)
                this.redirect(siteMap_1.siteMap.nodes.user_login);
            super.run();
        }
        createMasterPage() {
            let element = document.createElement('div');
            document.body.insertBefore(element, document.body.children[0]);
            this.masterPage = ReactDOM.render(h(masterPage_1.MasterPage, { app: this }), element);
            document.title = common_1.shopName;
            this.pageCreated.add((sender, page) => {
                let register = siteMap_1.siteMap.nodes.user_register;
                let login = siteMap_1.siteMap.nodes.user_login;
                console.assert(register.name != null);
                console.assert(login.name != null);
                let anonymousPages = siteMap_1.siteMap.anonymous.map(o => o.name);
                if (!service_1.Service.token.value && anonymousPages.indexOf(page.name) < 0) {
                    this.redirect(siteMap_1.siteMap.nodes.user_login);
                    return;
                }
                page.showing.add((sender) => this.masterPage.updateMenu(sender));
                page.hiding.add((sender) => this.masterPage.updateMenu(sender));
                page.load.add((sender, args) => {
                    let node = siteMap_1.siteMap.nodes.user_login;
                    console.assert(node.name != null);
                    console.assert(app.currentPage != null);
                    this.masterPage.state.hideExistsButton = app.currentPage.name == node.name || !service_1.Service.token.value;
                    this.masterPage.setState(this.masterPage.state);
                });
            });
        }
        createService(type) {
            let service = new type();
            service.error.add((sender, err) => {
                this.error.fire(this, err, this.currentPage);
            });
            return service;
        }
        loadCSS(pageName) {
            let pageNode = siteMap_1.siteMap.nodes[pageName];
            console.assert(pageNode != null);
            console.assert(typeof pageNode.path == 'string');
            requirejs([`less!${pageNode.path}`], function () {
                console.log(`load less!${pageNode.path}`);
            });
        }
        createPageElement(pageName) {
            let element = document.createElement('div');
            console.assert(this.masterPage.viewContainer != null, 'view container cannt be null.');
            let className = pageName.split('_').join('-');
            element.className = className;
            this.masterPage.viewContainer.appendChild(element);
            return element;
        }
        redirect(node, args) {
            return super.redirect(node, args);
        }
        errorHandle(err) {
            switch (err.name) {
                case '600': //600 为未知异常
                default:
                    ui.alert({ title: '错误', message: err.message });
                    console.log(err);
                    break;
                case '710':
                case '724': //724 为 token 失效
                case '601'://601 为用户未登录异常
                    var currentPage = this.currentPage;
                    let isLoginPage = currentPage.name == siteMap_1.siteMap.nodes.user_login.name;
                    if (isLoginPage) {
                        return;
                    }
                    this.redirect(siteMap_1.siteMap.nodes.user_login, { return: app.createUrl(currentPage.name, currentPage.data) });
                    break;
                case '725':
                    ui.alert({ title: '错误', message: 'application-key 配置错误' });
                    break;
            }
        }
    }
    exports.Application = Application;
    let app = window[common_1.ADMIN_APP] = window[common_1.ADMIN_APP] || new Application();
    exports.default = app;
});
