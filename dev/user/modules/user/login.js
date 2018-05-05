var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/site", "user/services/memberService", "user/site", "dilu", "user/siteMap"], function (require, exports, site_1, memberService_1, site_2, dilu_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let member = page.createService(memberService_1.MemberService);
        let usernameInput;
        let passwordInput;
        let formElement;
        page.loadCSS();
        class UserLoginPage extends React.Component {
            login() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (!isValid)
                        return;
                    yield member.login(usernameInput.value, passwordInput.value);
                    site_2.app.redirect(siteMap_1.default.nodes[returnPage]);
                });
            }
            componentDidMount() {
                let { required } = dilu_1.rules;
                this.validator = new dilu_1.FormValidator(formElement, { name: "username", rules: [required("请输入手机号码")] }, { name: "password", rules: [required("请输入密码")] });
            }
            render() {
                return [
                    h("header", { key: "header" }, site_1.defaultNavBar(page, { title: "登录" })),
                    h("section", { key: "view" },
                        h("form", { className: "form-horizontal container", ref: (e) => formElement = e || formElement },
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("input", { type: "text", name: "username", className: "form-control", placeholder: "手机号码", ref: (e) => usernameInput = e || usernameInput }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("input", { type: "password", name: "password", className: "form-control", placeholder: "密码", ref: (e) => passwordInput = e || passwordInput }))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-xs-12" },
                                    h("button", { id: "Login", type: "button", className: "btn btn-primary btn-block", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.onclick = ui.buttonOnClick(() => this.login());
                                        } }, "\u7ACB\u5373\u767B\u5F55")),
                                h("div", { className: "col-xs-12 text-center", style: { marginTop: 10 } },
                                    h("a", { href: "#user_register", className: "pull-left" }, "\u6211\u8981\u6CE8\u518C"),
                                    h("a", { href: "#user_resetPassword", className: "pull-right" }, "\u5FD8\u8BB0\u5BC6\u7801")))))
                ];
            }
        }
        let returnPage = page.data.reutrn || 'user_index';
        ReactDOM.render(h(UserLoginPage, null), page.element);
    }
    exports.default = default_1;
});
