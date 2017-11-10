import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { menuData, MenuNode } from 'menuData';

import { default as service } from 'adminServices/service';
import * as ui from 'ui';

ui.setDialogContainer(document.querySelector('.dialog-container') as HTMLElement);

let viewContainer: HTMLElement;

var h = React.createElement;
class Page extends React.Component<any, {
    currentNode: MenuNode, username: string
}> {
    constructor(props) {
        super(props);
        // window.addEventListener('hashchange', () => {
        //     let url = (window.location.hash.substr(1) || '').split('?')[0];
        //     this.state.currentNode = this.findNodeByUrl(url);
        //     this.setState(this.state);
        // });

        service.username.add((value) => {
            this.state.username = value;
            this.setState(this.state);
        })

        let url = (window.location.hash.substr(1) || '').split('?')[0];
        this.state = { currentNode: this.findNodeByUrl(url), username: service.username.value };
    }
    hideSecond() {

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
                // secondLevelNodes = currentNode.Children || [];
                firstLevelNode = currentNode;
                secondLevelNode = currentNode;
            }
            else if (currentNode.Parent.Parent == null) {
                // secondLevelNodes = currentNode.Parent.Children || [];
                firstLevelNode = currentNode.Parent;
                secondLevelNode = currentNode;
            }
            else if (currentNode.Parent.Parent.Parent == null) {
                // secondLevelNodes = currentNode.Parent.Parent.Children || [];
                thirdLevelNode = currentNode;
                secondLevelNode = thirdLevelNode.Parent;
                firstLevelNode = secondLevelNode.Parent;
            }
            else if (currentNode.Parent.Parent.Parent.Parent == null) {
                // secondLevelNodes = currentNode.Parent.Parent.Children || [];
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
                                    <li className="light-blue pull-right">
                                        <a data-toggle="dropdown" href="#" className="dropdown-toggle">
                                            <span name="username" style={{ paddingRight: 10 }}>{this.state.username}</span>
                                            <i className="icon-caret-down"></i>
                                        </a>
                                        <ul className="user-menu pull-right dropdown-menu dropdown-yellow dropdown-caret dropdown-close">
                                            <li>
                                                <a href="#User/Logout">
                                                    <i className="icon-off"></i>退出
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div style={{ padding: 20 }}
                        ref={(e: HTMLElement) => viewContainer = e || viewContainer}>
                    </div>
                </div>
            </div>
        );
    }
}

let element = document.createElement('div');
document.body.insertBefore(element, document.body.children[0]);
ReactDOM.render(<Page />, element);

class Application extends chitu.Application {

    constructor() {
        super();

        this.pageCreated.add((app, page) => {
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
        console.assert(viewContainer != null, 'view container cannt be null.');
        let className = routeData.pageName.split('.').join('-');
        element.className = className;
        viewContainer.appendChild(element);

        return element;
    }

    run() {



        super.run();
    }
}

var app = new Application();
app.error.add((sender, error) => {
    if (error.name == 'NotLogin' || error.name == `724`) {
        service.token = '';
        // location.search = '';
        // app.redirect('user/login');
        location.href = 'index.html#user/login';
        return;
    };

    //========================================
    // 延迟处理错误，让其它模块先处理
    let timeoutId = setTimeout(() => {
        if (!error['handled']) {
            ui.alert({
                title: '错误',
                message: error.message
            });
        }

        clearTimeout(timeoutId);

    }, 100);
    //========================================
})

if (service.token == null && location.hash != '#user/register' && location.hash != '#user/login') {
    app.redirect('user/login');
}

window['app'] = app;
export default app;





