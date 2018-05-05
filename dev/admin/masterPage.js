define(["require", "exports", "react", "admin/services/service", "admin/siteMap"], function (require, exports, React, service_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let h = React.createElement;
    class MasterPage extends React.Component {
        constructor(props) {
            super(props);
            service_1.Service.adminName.add((value) => {
                this.state.username = value;
                this.setState(this.state);
            });
            this.state = {
                currentNode: null, username: service_1.Service.adminName.value,
                hideExistsButton: true, hideStoreButton: true
            };
            this.props.app.pageCreated.add((sender, page) => {
                page.shown.add(() => {
                    this.state.currentNode = this.findNodeByName(page.name);
                    this.setState(this.state);
                    console.log(`page '${page.name}' shown`);
                    let names = siteMap_1.siteMap.anonymous.map(o => o.name);
                    this.state.hideStoreButton = [...names, siteMap_1.siteMap.nodes.user_myStores.name].indexOf(page.name) >= 0;
                    this.state.hideExistsButton = [...names].indexOf(page.name) >= 0;
                    this.setState(this.state);
                });
            });
        }
        updateMenu(page) {
            let url = page.name.replace(/\./, '/');
            let currentNode = this.findNodeByName(url);
            this.state.currentNode = currentNode;
            this.state.username = service_1.Service.adminName.value;
            this.setState(this.state);
        }
        findNodeByName(name) {
            let stack = new Array();
            for (let i = 0; i < siteMap_1.menuData.length; i++) {
                stack.push(siteMap_1.menuData[i]);
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
        showPageByNode(node) {
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
                this.props.app.redirect(siteMap_1.siteMap.nodes[url]);
            }
            this.state.currentNode = node;
            this.setState(this.state);
        }
        render() {
            let currentNode = this.state.currentNode;
            let firstLevelNode;
            let secondLevelNode;
            let thirdLevelNode;
            // if (currentNode == null) {
            //     return (
            //         <div ref={(e: HTMLElement) => viewContainer = e || viewContainer}>
            //         </div>
            //     );
            // }
            let firstLevelNodes = siteMap_1.menuData.filter(o => o.visible == null || o.visible == true);
            let secondLevelNodes = [];
            let thirdLevelNodes = [];
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
                    throw new Error('not implement');
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
            return (h("div", { className: nodeClassName },
                h("div", { className: "first" },
                    h("ul", { className: "list-group", style: { margin: 0 } }, firstLevelNodes.map((o, i) => h("li", { key: i, className: o == firstLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.visible == false ? "none" : null }, onClick: () => this.showPageByNode(o) },
                        h("i", { className: o.icon, style: { fontSize: 16 } }),
                        h("span", { style: { paddingLeft: 8, fontSize: 14 } }, o.title))))),
                h("div", { className: "second" },
                    h("ul", { className: "list-group", style: { margin: 0 } }, secondLevelNodes.map((o, i) => h("li", { key: i, className: o == secondLevelNode ? "list-group-item active" : "list-group-item", style: { cursor: 'pointer', display: o.visible == false ? "none" : null }, onClick: () => this.showPageByNode(o) },
                        h("span", { style: { paddingLeft: 8, fontSize: 14 } }, o.title))))),
                h("div", { className: secondLevelNodes.length == 0 ? "main hideSecond" : 'main' },
                    h("nav", { className: "navbar navbar-default" },
                        h("div", { className: "container-fluid" },
                            h("div", { className: "collapse navbar-collapse", id: "bs-example-navbar-collapse-6" },
                                h("ul", { className: "nav navbar-nav", style: { width: '100%' } },
                                    !hideExistsButton ?
                                        h("li", { className: "light-blue pull-right", style: { color: 'white', paddingTop: 12, cursor: 'pointer' }, onClick: () => app.redirect(siteMap_1.siteMap.nodes.user_login) },
                                            h("i", { className: "icon-off" }),
                                            h("span", { style: { paddingLeft: 4 } }, "\u9000\u51FA")) : null,
                                    !hideStoreButton ?
                                        h("li", { className: "light-blue pull-right", style: { color: 'white', paddingTop: 12, cursor: 'pointer' }, onClick: () => app.redirect(siteMap_1.siteMap.nodes.user_myStores) },
                                            h("i", { className: "icon-building" }),
                                            h("span", { style: { paddingLeft: 4, paddingRight: 10 } }, "\u5E97\u94FA\u7BA1\u7406")) : null)))),
                    h("div", { style: { padding: 20 }, ref: (e) => this.viewContainer = e || this.viewContainer }))));
        }
    }
    exports.MasterPage = MasterPage;
});
