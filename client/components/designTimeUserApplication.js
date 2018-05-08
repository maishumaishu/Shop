var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/application", "user/siteMap", "weixin/modules/openid", "user/services/weixinService", "user/services/mockData", "user/services/shoppingCartService", "user/services/memberService", "share/common"], function (require, exports, application_1, siteMap_1, openid_1, weixinService_1, mockData, shoppingCartService_1, memberService_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DesignTimeUserPage extends application_1.UserPage {
        createService(type) {
            let service = super.createService(type);
            console.assert(this._app instanceof DesignTimeUserApplication);
            if (this._app.enableMock) {
                service = mockService(service);
            }
            return service;
        }
    }
    class DesignTimeUserApplication extends application_1.UserApplication {
        constructor(screenElement, enableMock) {
            super();
            this.screenElement = screenElement;
            this.pageType = DesignTimeUserPage;
            this._enableMock = enableMock == null ? false : enableMock;
            let pageName = siteMap_1.default.nodes.user_login.name;
            console.assert(pageName != null);
            let app = this;
            this.nodes[pageName].action = function (page) {
                ReactDOM.render([
                    h("div", { key: 10, className: "text-center", style: { paddingTop: 100 } },
                        h("b", null, "\u8BE5\u9875\u9762\u9700\u8981\u767B\u5F55\u540E\u624D\u80FD\u663E\u793A"),
                        h("br", null),
                        h("b", null, "\u8BF7\u4F7F\u7528\u5FAE\u4FE1\u626B\u63CF\u4E8C\u7EF4\u767B\u5F55\u5BA2\u6237\u7AEF")),
                    h("div", { key: 20, className: "text-center", style: { paddingTop: 20 }, ref: (e) => {
                            if (!e)
                                return;
                            openid_1.renderQRCode({
                                element: e,
                                mobilePageName: 'userLogin',
                                callback(code) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        let weixin = page.createService(weixinService_1.WeiXinService);
                                        let result = yield weixin.login(code);
                                        page.close();
                                        app.currentPage.show();
                                        app.currentPage.reload();
                                        return result;
                                    });
                                }
                            });
                        } })
                ], page.element);
            };
        }
        get designPageNode() {
            return siteMap_1.default.nodes.emtpy;
        }
        get enableMock() {
            return this._enableMock;
        }
        showDesignPage() {
            this.showPage(siteMap_1.default.nodes.emtpy);
        }
        createPageElement(pageName) {
            let element = super.createPageElement(pageName);
            this.screenElement.appendChild(element);
            return element;
        }
        createService(type) {
            let service = super.createService(type);
            if (this._enableMock) {
                service = mockService(service);
            }
            return service;
        }
    }
    exports.DesignTimeUserApplication = DesignTimeUserApplication;
    function mockService(service) {
        if (service instanceof shoppingCartService_1.ShoppingCartService) {
            service.items = () => __awaiter(this, void 0, void 0, function* () {
                return mockData.shoppingCartItems;
            });
            service.calculateShoppingCartItems = () => __awaiter(this, void 0, void 0, function* () {
                return mockData.shoppingCartItems;
            });
        }
        else if (service instanceof memberService_1.MemberService) {
            service.store = () => __awaiter(this, void 0, void 0, function* () {
                let store = { Id: common_1.guid(), Name: '', Data: { ImageId: '' } };
                return store;
            });
        }
        return service;
    }
});
