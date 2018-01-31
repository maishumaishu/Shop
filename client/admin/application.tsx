import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { menuData, MenuNode } from 'menuData';
import * as ui from 'ui';
import { Service } from 'services/service';

ui.dialogConfig.dialogContainer = document.querySelector('.dialog-container') as HTMLElement;

let viewContainer: HTMLElement;

var h = React.createElement;
class Page extends React.Component<any, {
    currentNode: MenuNode, username: string
}> {
    constructor(props) {
        super(props);
        Service.adminName.add((value) => {
            this.state.username = value;
            this.setState(this.state);
        })

        let url = (window.location.hash.substr(1) || '').split('?')[0];
        this.state = { currentNode: this.findNodeByUrl(url), username: Service.adminName.value };
        window.addEventListener('hashchange', () => {
            url = (window.location.hash.substr(1) || '').split('?')[0];
            let currentNode = this.findNodeByUrl(url);
            if (currentNode == this.state.currentNode)
                return;

            this.state.currentNode = currentNode;
            this.state.username = Service.adminName.value;
            this.setState(this.state);
        })
    }
    findNodeByUrl(url: string): MenuNode {
        let stack = new Array<MenuNode>();
        for (let i = 0; i < menuData.length; i++) {
            stack.push(menuData[i]);
        }
        while (stack.length > 0) {
            let node = stack.pop();
            if (node.Url == url) {
                return node;
            }
            let children = node.Children || [];
            for (let j = 0; j < children.length; j++) {
                stack.push(children[j]);
            }
        }
        return null;
    }
    showPageByNode(node: MenuNode) {
        let url = node.Url;
        if (url == null && node.Children.length > 0) {
            node = node.Children[0];
            url = node.Url;
        }

        if (url == null && node.Children.length > 0) {
            node = node.Children[0];
            url = node.Url;
        }

        if (url) {
            app.redirect(url);
        }

        this.state.currentNode = node;
        this.setState(this.state);
    }
    render() {
        let currentNode = this.state.currentNode;
        let firstLevelNode: MenuNode;
        let secondLevelNode: MenuNode;
        let thirdLevelNode: MenuNode;

        if (currentNode == null) {
            return (
                <div ref={(e: HTMLElement) => viewContainer = e || viewContainer}>

                </div>
            );
        }

        let firstLevelNodes = menuData.filter(o => o.Visible == null || o.Visible == true);
        let secondLevelNodes: Array<MenuNode> = [];
        let thirdLevelNodes: Array<MenuNode> = [];
        if (currentNode != null) {
            if (currentNode.Parent == null) {
                firstLevelNode = currentNode;
                secondLevelNode = currentNode;
            }
            else if (currentNode.Parent.Parent == null) {
                firstLevelNode = currentNode.Parent;
                secondLevelNode = currentNode;
            }
            else if (currentNode.Parent.Parent.Parent == null) {
                thirdLevelNode = currentNode;
                secondLevelNode = thirdLevelNode.Parent;
                firstLevelNode = secondLevelNode.Parent;
            }
            else if (currentNode.Parent.Parent.Parent.Parent == null) {
                thirdLevelNode = currentNode.Parent;
                secondLevelNode = thirdLevelNode.Parent;
                firstLevelNode = secondLevelNode.Parent;
            }
            else {
                throw new Error('not implement')
            }
        }

        secondLevelNodes = firstLevelNode.Children || [].filter(o => o.Visible == null || o.Visible == true);;
        thirdLevelNodes = (secondLevelNode.Children || []).filter(o => o.Visible == null || o.Visible == true);
        if (thirdLevelNodes.length == 0) {
            thirdLevelNodes.push(secondLevelNode);
            thirdLevelNode = secondLevelNode;
        }

        let nodeClassName = '';
        if (firstLevelNode.Title == 'Others') {
            nodeClassName = 'hideFirst';
        }
        else if (secondLevelNodes.length == 0) {
            nodeClassName = 'hideSecond';
        }

        return (
            <div className={nodeClassName}>
                <div className="first admin-pc">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {firstLevelNodes.map((o, i) =>
                            <li key={i} className={o == firstLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.Visible == false ? "none" : null }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.Icon} style={{ fontSize: 16 }}></i>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.Title}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="second admin-pc">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {secondLevelNodes.map((o, i) =>
                            <li key={i} className={o == secondLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.Visible == false ? "none" : null }}
                                onClick={() => this.showPageByNode(o)}>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.Title}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={secondLevelNodes.length == 0 ? "main hideSecond" : 'main'} >
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-6">
                                <ul className="nav navbar-nav" style={{ width: '100%' }}>
                                    {Service.token ?
                                        <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 12, cursor: 'pointer' }}
                                            onClick={() => location.hash = '#user/login'}>
                                            <i className="icon-off"></i>
                                            <span style={{ paddingLeft: 4 }}>退出</span>
                                        </li> : null
                                    }
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div style={{ padding: 20 }}
                        ref={(e: HTMLElement) => viewContainer = e || viewContainer}>
                    </div>
                </div>
            </div >
        );
    }
}

let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
ReactDOM.render(<Page />, element);

class Application extends chitu.Application {

    constructor() {
        super();

        if (Service.token == null && location.hash != '#user/register' && location.hash != '#user/login') {
            this.redirect('user/login');
        }

        this.pageCreated.add((app, page) => {
            page.load.add((sender, args) => {
                let element = sender.element.querySelector('admin-pc');
                if (element == null) {
                    sender.element.className = (sender.element.className || '') + ' admin-pc';
                }
            });
        })

        this.error.add((app, err) => this.errorHandle(err));
    }

    protected createPageElement(routeData: chitu.RouteData): HTMLElement {
        let element = document.createElement('div');
        console.assert(viewContainer != null, 'view container cannt be null.');
        let className = routeData.pageName.split('.').join('-');
        element.className = className;
        viewContainer.appendChild(element);

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
                var currentPage = app.currentPage;
                let isLoginPage = currentPage.name == 'user.login';
                if (isLoginPage) {
                    return;
                }
                app.redirect('user_login', { return: currentPage.routeData.routeString });
                break;
            case '725':
                ui.alert({ title: '错误', message: 'application-key 配置错误' });
                break;
        }
    }
}

let app: Application = window['admin-app'] = window['admin-app'] || new Application();
export default app;





