import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ui from 'ui';
import { menuData, MenuNode } from 'menuData';
import { Service } from 'services/service';
import { shopName } from 'share/common';
import { MasterPage } from 'masterPage';


let h = React.createElement;

class Application extends chitu.Application {

    private masterPage: MasterPage;
    constructor() {
        super();

        if (Service.token == null && location.hash != '#user/register' && location.hash != '#user/login') {
            this.redirect('user/login');
        }

        ui.dialogConfig.dialogContainer = document.querySelector('.dialog-container') as HTMLElement;
        this.createMasterPage();
        this.error.add((app, err) => this.errorHandle(err));
    }

    createMasterPage() {
        let element = document.createElement('div');
        document.body.insertBefore(element, document.body.children[0]);
        this.masterPage = ReactDOM.render(<MasterPage app={this} />, element);
        document.title = shopName;

        this.pageCreated.add((sender, page) => {
            page.showing.add((sender) => this.masterPage.updateMenu(sender));
            page.hiding.add((sender) => this.masterPage.updateMenu(sender));

            page.load.add((sender, args) => {
                let element = sender.element.querySelector('admin-pc');
                if (element == null) {
                    sender.element.className = (sender.element.className || '') + ' admin-pc';
                }
            });
        })
    }

    protected createPageElement(routeData: chitu.RouteData): HTMLElement {
        let element = document.createElement('div');
        console.assert(this.masterPage.viewContainer != null, 'view container cannt be null.');
        let className = routeData.pageName.split('.').join('-');
        element.className = className;
        this.masterPage.viewContainer.appendChild(element);

        return element;
    }

    private errorHandle(err: Error) {
        switch (err.name) {
            case '600':     //600 为未知异常
            default:
                ui.alert({ title: '错误', message: err.message });
                console.log(err);
                break;

            case '710':
            case '724':     //724 为 token 失效
            case '601':     //601 为用户未登录异常
                var currentPage = this.currentPage;
                let isLoginPage = currentPage.name == 'user.login';
                if (isLoginPage) {
                    return;
                }
                this.redirect('user_login', { return: currentPage.routeData.routeString });
                break;
            case '725':
                ui.alert({ title: '错误', message: 'application-key 配置错误' });
                break;
        }
    }
}






let app: Application = window['admin-app'] = window['admin-app'] || new Application();

export default app;