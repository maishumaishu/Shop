define(["require", "exports", "components/common", "user/services/memberService", "user/services/userData", "user/services/service"], function (require, exports, common_1, memberService_1, userData_1, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let member = new memberService_1.MemberService();
    requirejs([`css!${common_1.componentsDir}/member/control`]);
    class MemberControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.state = {
                balance: userData_1.userData.balance.value,
                score: userData_1.userData.score.value,
                userInfo: {},
                sellsCenter: 'showToMember'
            };
            this.state.balance = userData_1.userData.balance.value;
            userData_1.userData.balance.add((value) => {
                this.state.balance = value;
                this.setState(this.state);
            });
            // member.userInfo().then(userInfo => {
            //     this.state.userInfo = userInfo;
            //     this.setState(this.state);
            // });
            this.state.userInfo = userData_1.userData.userInfo.value;
            this.subscribe(userData_1.userData.userInfo, (value) => {
                this.state.userInfo = value;
                this.setState(this.state);
            });
        }
        get persistentMembers() {
            return ["showBalance", "showLevel", "showScore", "sellsCenter", "bg"];
        }
        _render(h) {
            let { balance, userInfo, showBalance, showLevel, sellsCenter, showScore, bg, score } = this.state;
            let bg_url = bg ? service_1.imageUrl(bg) : MemberControl.default_bg;
            userInfo = userInfo || {};
            return (h("div", { className: "memberControl" },
                h("div", { className: "mobile-user-info text-center", style: { backgroundImage: `url(${bg_url})` } },
                    h("a", { href: "#user_userInfo" },
                        h("img", { src: userInfo.HeadImageUrl, className: "img-circle img-full", title: "上传头像", ref: (e) => e ?
                                ui.renderImage(e, {
                                    imageSize: { width: 100, height: 100 }
                                }) : null })),
                    h("div", { className: "nick-name" }, userInfo.NickName == null ? '未填写' : userInfo.NickName),
                    showBalance ?
                        h("div", { className: "balance text-right" },
                            h("span", null, "\u4F59\u989D"),
                            h("span", { className: "price" },
                                "\uFFE5",
                                (balance || 0).toFixed(2))) : null),
                h("div", { className: "order-bar" },
                    h("div", { className: "col-xs-3" },
                        h("a", { href: "#shopping_orderList", style: { color: 'black' } },
                            h("i", { className: "icon-list icon-3x" }),
                            h("div", { className: "name" }, "\u5168\u90E8\u8BA2\u5355"))),
                    h("div", { className: "col-xs-3 " },
                        h("a", { href: "#shopping_orderList?type=WaitingForPayment", style: { color: 'black' } },
                            h("i", { className: "icon-credit-card icon-3x" }),
                            h("div", { className: "name" }, "\u5F85\u4ED8\u6B3E"))),
                    h("div", { className: "col-xs-3" },
                        h("a", { href: "#shopping_orderList?type=Send", style: { color: 'black' } },
                            h("i", { className: "icon-truck icon-3x" }),
                            h("div", { className: "name" }, "\u5F85\u6536\u8D27"))),
                    h("div", { className: "col-xs-3" },
                        h("a", { href: "#shopping_evaluation", style: { color: 'black' } },
                            h("i", { className: "icon-star icon-3x" }),
                            h("div", { className: "name" }, "\u5F85\u8BC4\u4EF7"))),
                    h("div", { className: "clearfix" })),
                h("div", { className: "list-group" },
                    h("a", { className: "list-group-item", href: "#user_receiptList" },
                        h("span", { className: "icon-chevron-right pull-right" }),
                        h("span", { className: "pull-right value", style: { display: 'none' } }),
                        h("strong", null, "\u6536\u8D27\u5730\u5740")),
                    h("a", { className: "list-group-item", href: "#user_favors" },
                        h("span", { className: "icon-chevron-right pull-right" }),
                        h("span", { className: "pull-right value", style: { display: 'none' } }),
                        h("strong", null, "\u6211\u7684\u6536\u85CF")),
                    h("a", { className: "list-group-item", href: "#user_coupon" },
                        h("span", { className: "icon-chevron-right pull-right" }),
                        h("span", { className: "pull-right value", style: { display: 'none' } }, "undefined"),
                        h("strong", null, "\u6211\u7684\u4F18\u60E0\u5238")),
                    showScore ?
                        h("a", { className: "list-group-item", href: "#user_scoreList" },
                            h("span", { className: "icon-chevron-right pull-right" }),
                            h("span", { className: "pull-right value price", style: { paddingRight: 8, display: score ? null : 'none' } }, score || 0),
                            h("strong", null, "\u6211\u7684\u79EF\u5206")) : null),
                sellsCenter ?
                    h("div", { className: "list-group" },
                        h("a", { className: "list-group-item" },
                            h("span", { className: "icon-chevron-right pull-right" }),
                            h("strong", null, "\u9500\u552E\u5458\u4E2D\u5FC3"))) : null,
                h("div", { className: "list-group" },
                    h("a", { className: "list-group-item", href: "#user_accountSecurity_index" },
                        h("span", { className: "icon-chevron-right pull-right" }),
                        h("span", { "data-bind": "text: value,visible:value", className: "pull-right value", style: { display: 'none' } }),
                        h("strong", null, "\u8D26\u6237\u5B89\u5168")),
                    h("a", { className: "list-group-item", href: "javascript:", onClick: () => null },
                        h("span", { className: "icon-chevron-right pull-right" }),
                        h("span", { className: "pull-right value", style: { display: 'none' } }),
                        h("strong", null, "\u9000\u51FA")))));
        }
    }
    MemberControl.default_bg = '../components/member/images/bg_user.png';
    exports.default = MemberControl;
});
