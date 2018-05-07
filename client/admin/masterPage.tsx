import * as React from 'react';
import { Service, imageUrl } from 'admin/services/service';
import { siteMap, menuData, MenuNode } from 'admin/pageNodes';
import { Application as App } from 'admin/Application';
import { StationService } from 'admin/services/station';
import { MemberService } from 'admin/services/member';

let h = React.createElement;
interface State {
    currentNode: MenuNode,
    username: string,
    hideExistsButton: boolean,
    hideStoreButton: boolean,
    store: Store,
    allStores: Store[],
    menuShown: boolean
}

interface Props {
    app: App
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
            hideExistsButton: true, hideStoreButton: true,
            store: null, allStores: [], menuShown: false
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

        let member = this.props.app.createService(MemberService);
        if (Service.appToken != null) {
            member.store().then(store => {
                this.state.store = store;
                this.setState(this.state);
            })
        }
        member.stores().then(items => {
            this.state.allStores = items;
            this.setState(this.state);
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


        let { hideExistsButton, hideStoreButton, store, allStores, menuShown } = this.state;
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
                    <nav className="navbar navbar-default" style={{ padding: "10px 10px 10px 10px" }}>
                        <div className="pull-left">
                            {store != null && !hideStoreButton ?
                                <div key={10} className="btn-link"
                                    ref={(e: HTMLElement) => {
                                        if (!e) return;

                                        e.onclick = () => {
                                            this.state.menuShown = !this.state.menuShown;
                                            this.setState(this.state);
                                        }
                                        window.addEventListener('click', (event) => {
                                            let target = event.target as HTMLElement;
                                            if (target.parentElement == e || this.state.menuShown == false) {
                                                return;
                                            }
                                            this.state.menuShown = false;
                                            this.setState(this.state);
                                        })
                                    }}>
                                    <img key={10} src={imageUrl(store.Data.ImageId)}
                                        ref={(e: HTMLImageElement) => {
                                            if (!e) return;
                                            ui.renderImage(e, { imageSize: { width: 100, height: 100 } });

                                        }} />
                                    <span key={20} style={{ padding: "2px 0px 0px 10px", color: 'white' }}>
                                        {store.Name}
                                    </span>
                                    <i key={30} className="icon-caret-down"
                                        style={{ padding: "2px 0px 0px 4px", fontSize: '14px', color: 'white' }} />
                                </div> : null}
                            <ul key={40} className="dropdown-menu" aria-labelledby="dropdownMenu1"
                                style={{ display: menuShown ? 'block' : null }}>
                                {allStores.map((o, i) => [
                                    <li key={o.Id}
                                        style={{
                                            paddingTop: i == 0 ? 14 : null,
                                            paddingBottom: i == allStores.length - 1 ? 14 : null
                                        }}>
                                        <a href="#">{o.Name}</a>
                                    </li>,
                                    i != allStores.length - 1 ? <li key={o.Id + "S"} role="separator" className="divider"></li> : null
                                ])}
                            </ul>
                        </div>
                        <ul className="nav navbar-nav pull-right" >
                            {!hideExistsButton ?
                                <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                                    onClick={() => app.redirect(siteMap.nodes.user_login)}>
                                    <i className="icon-off"></i>
                                    <span style={{ paddingLeft: 4 }}>退出</span>
                                </li> : null
                            }
                            {!hideStoreButton ?
                                <li className="light-blue pull-right" style={{ color: 'white', paddingTop: 4, cursor: 'pointer' }}
                                    onClick={() => app.redirect(siteMap.nodes.user_myStores)}>
                                    <i className="icon-building"></i>
                                    <span style={{ paddingLeft: 4, paddingRight: 10 }}>店铺管理</span>
                                </li> : null
                            }
                        </ul>
                    </nav>
                    <div style={{ padding: 20 }}
                        ref={(e: HTMLElement) => this.viewContainer = e || this.viewContainer}>
                    </div>
                </div>
            </div >
        );
    }
}