import * as React from 'react';
import { Service } from 'admin/services/service';
import { siteMap, menuData, MenuNode } from 'admin/siteMap';

let h = React.createElement;
interface State {
    currentNode: MenuNode,
    username: string,
    hideExistsButton: boolean,
    hideStoreButton: boolean
}

interface Props {
    app: chitu.Application
}

export class MasterPage extends React.Component<Props, State> {
    viewContainer: any;
    constructor(props) {
        super(props);
        Service.adminName.add((value) => {
            this.state.username = value;
            this.setState(this.state);
        })

        this.state = {
            currentNode: null, username: Service.adminName.value,
            hideExistsButton: true, hideStoreButton: true
        };

        this.props.app.pageCreated.add((sender, page) => {
            page.shown.add(() => {
                this.state.currentNode = this.findNodeByName(page.name);
                this.setState(this.state);
                console.log(`page '${page.name}' shown`)

                let names = siteMap.anonymous.map(o => o.name);
                this.state.hideStoreButton = [...names, siteMap.nodes.user_myStores.name].indexOf(page.name) >= 0;
                this.state.hideExistsButton = [...names].indexOf(page.name) >= 0;
                this.setState(this.state);
            })

        })
    }

    updateMenu(page: chitu.Page) {
        let url = page.name.replace(/\./, '/');
        let currentNode = this.findNodeByName(url);

        this.state.currentNode = currentNode;
        this.state.username = Service.adminName.value;
        this.setState(this.state);
    }

    findNodeByName(name: string): MenuNode {
        let stack = new Array<MenuNode>();
        for (let i = 0; i < menuData.length; i++) {
            stack.push(menuData[i]);
        }
        while (stack.length > 0) {
            let node = stack.pop();
            if (node.name == name) {
                return node;
            }
            let children = node.children || [];
            for (let j = 0; j < children.length; j++) {
                stack.push(children[j]);
            }
        }
        return null;
    }
    showPageByNode(node: MenuNode) {
        let url = node.name;
        if (url == null && node.children.length > 0) {
            node = node.children[0];
            url = node.name;
        }

        if (url == null && node.children.length > 0) {
            node = node.children[0];
            url = node.name;
        }

        if (url) {
            this.props.app.redirect(siteMap.nodes[url]);
        }

        this.state.currentNode = node;
        this.setState(this.state);
    }
    render() {
        let currentNode = this.state.currentNode;
        let firstLevelNode: MenuNode;
        let secondLevelNode: MenuNode;
        let thirdLevelNode: MenuNode;

        // if (currentNode == null) {
        //     return (
        //         <div ref={(e: HTMLElement) => viewContainer = e || viewContainer}>

        //         </div>
        //     );
        // }

        let firstLevelNodes = menuData.filter(o => o.visible == null || o.visible == true);
        let secondLevelNodes: Array<MenuNode> = [];
        let thirdLevelNodes: Array<MenuNode> = [];
        if (currentNode != null) {
            if (currentNode.parent == null) {
                firstLevelNode = currentNode;
                secondLevelNode = currentNode;
            }
            else if (currentNode.parent.parent == null) {
                firstLevelNode = currentNode.parent;
                secondLevelNode = currentNode;
            }
            else if (currentNode.parent.parent.parent == null) {
                thirdLevelNode = currentNode;
                secondLevelNode = thirdLevelNode.parent;
                firstLevelNode = secondLevelNode.parent;
            }
            else if (currentNode.parent.parent.parent.parent == null) {
                thirdLevelNode = currentNode.parent;
                secondLevelNode = thirdLevelNode.parent;
                firstLevelNode = secondLevelNode.parent;
            }
            else {
                throw new Error('not implement')
            }
        }

        if (firstLevelNode != null) {
            secondLevelNodes = firstLevelNode.children || [].filter(o => o.Visible == null || o.Visible == true);
            thirdLevelNodes = (secondLevelNode.children || []).filter(o => o.visible == null || o.visible == true);
        }

        if (thirdLevelNodes.length == 0) {
            thirdLevelNodes.push(secondLevelNode);
            thirdLevelNode = secondLevelNode;
        }

        let nodeClassName = '';
        if (firstLevelNode != null && firstLevelNode.title == 'Others') {
            nodeClassName = 'hideFirst';
        }
        else if (secondLevelNodes.length == 0) {
            nodeClassName = 'hideSecond';
        }

        // let currentPageName = app.currentPage != null ? app.currentPage.name : '';
        // let hideExistsButton = location.hash == '#user/login' || !Service.token;
        let { hideExistsButton, hideStoreButton } = this.state;
        let { app } = this.props;

        return (
            <div className={nodeClassName}>
                <div className="first">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {firstLevelNodes.map((o, i) =>
                            <li key={i} className={o == firstLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.visible == false ? "none" : null }}
                                onClick={() => this.showPageByNode(o)}>
                                <i className={o.icon} style={{ fontSize: 16 }}></i>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.title}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="second">
                    <ul className="list-group" style={{ margin: 0 }}>
                        {secondLevelNodes.map((o, i) =>
                            <li key={i} className={o == secondLevelNode ? "list-group-item active" : "list-group-item"}
                                style={{ cursor: 'pointer', display: o.visible == false ? "none" : null }}
                                onClick={() => this.showPageByNode(o)}>
                                <span style={{ paddingLeft: 8, fontSize: 14 }}>{o.title}</span>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={secondLevelNodes.length == 0 ? "main hideSecond" : 'main'} >
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-6">
                                <ul className="nav navbar-nav" style={{ width: '100%' }}>
                                    {!hideExistsButton ?
                                        <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 12, cursor: 'pointer' }}
                                            onClick={() => app.redirect(siteMap.nodes.user_login)}>
                                            <i className="icon-off"></i>
                                            <span style={{ paddingLeft: 4 }}>退出</span>
                                        </li> : null
                                    }
                                    {!hideStoreButton ?
                                        <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 12, cursor: 'pointer' }}
                                            onClick={() => app.redirect(siteMap.nodes.user_myStores)}>
                                            <i className="icon-building"></i>
                                            <span style={{ paddingLeft: 4, paddingRight: 10 }}>店铺管理</span>
                                        </li> : null
                                    }
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div style={{ padding: 20 }}
                        ref={(e: HTMLElement) => this.viewContainer = e || this.viewContainer}>
                    </div>
                </div>
            </div >
        );
    }
}