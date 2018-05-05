define(["require", "exports", "site", "user/services/memberService", "user/siteMap"], function (require, exports, site_1, memberService_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        class IndexPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { userInfo: this.props.userInfo };
            }
            showMobileBindingPage() {
                let args = {
                    mobileChanged: (value) => {
                        this.state.userInfo.Mobile = value;
                        this.setState(this.state);
                    }
                };
                site_1.app.redirect(siteMap_1.default.nodes.user_accountSecurity_mobileBinding, args);
            }
            render() {
                let userInfo = this.state.userInfo;
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '账户安全' })),
                    h("section", { key: "v" },
                        h("div", { className: "container" },
                            h("div", { className: "list-group" },
                                h("a", { href: "#user_accountSecurity_loginPassword", className: "list-group-item row" },
                                    h("strong", { className: "name" }, "\u767B\u5F55\u5BC6\u7801"),
                                    h("i", { className: "icon-chevron-right pull-right" }),
                                    h("div", { style: { paddingTop: 10 } }, "\u8BBE\u7F6E\u767B\u5F55\u5BC6\u7801\uFF0C\u53EF\u4EE5\u4F7F\u7528\u624B\u673A\u548C\u5BC6\u7801\u767B\u5F55")),
                                h("a", { href: "javascript:", className: "list-group-item   row", onClick: () => this.showMobileBindingPage() },
                                    h("strong", { className: "name" }, "\u624B\u673A\u7ED1\u5B9A"),
                                    h("i", { className: "icon-chevron-right pull-right" }),
                                    h("span", { className: userInfo.Mobile ? 'pull-right' : "pull-right text-primary", style: { paddingRight: 10 } }, userInfo.Mobile ? userInfo.Mobile : '未设置'),
                                    h("div", { style: { paddingTop: 10 } }, "\u7ED1\u5B9A\u624B\u673A\u540E\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7\u624B\u673A\u627E\u56DE\u5BC6\u7801")),
                                h("a", { href: "#user_accountSecurity_paymentPassword", className: "list-group-item row" },
                                    h("strong", { className: "name" }, "\u652F\u4ED8\u5BC6\u7801"),
                                    h("i", { className: "icon-chevron-right pull-right" }),
                                    h("span", { "data-bind": "visible:!paymentPasswordSetted()", className: "pull-right text-primary", style: { paddingRight: 10 } }, "\u672A\u8BBE\u7F6E"),
                                    h("div", { style: { paddingTop: 10 } }, "\u8BBE\u7F6E\u652F\u4ED8\u5BC6\u7801\u540E\uFF0C\u4F7F\u7528\u4F59\u989D\u652F\u4ED8\u9700\u8981\u5BC6\u7801"))),
                            h("div", { className: "list-group" })))
                ];
            }
        }
        let member = new memberService_1.MemberService();
        member.userInfo().then(userInfo => {
            ReactDOM.render(h(IndexPage, { userInfo: userInfo }), page.element);
        });
    }
    exports.default = default_1;
});
