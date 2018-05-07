var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/mobilePageDesigner", "admin/services/station", "user/services/stationService", "share/common", "components/common"], function (require, exports, mobilePageDesigner_1, station_1, stationService_1, common_1, common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = page.name.split('_');
            let storePage = arr[arr.length - 1];
            let adminStation = page.createService(station_1.StationService);
            let userStation = page.createService(stationService_1.StationService);
            let func = userStation.pages[storePage];
            if (func == null)
                throw new Error(`Store page ${storePage} is not exists.`);
            let showComponentPanel = storePage == 'home';
            let pageData = yield func.apply(userStation.pages);
            let props = {
                pageData,
                pageDatas: userStation.pages,
                save: adminStation.savePageData.bind(adminStation),
                showMenuSwitch: true,
                showComponentPanel
            };
            if (storePage == 'menu') {
                let menuControl = pageData.controls.filter(o => o.controlName == storePage)[0];
                console.assert(menuControl != null);
                define('components/menu_design_body/control', ["require", "exports"], function (require, exports) {
                    exports.default = class MenuBody extends common_2.Control {
                        _render(h) {
                            let msg = h("div", null,
                                h("div", null, "\u70B9\u51FB\u53F3\u8FB9\u64CD\u4F5C\u9762\u677F\u7684"),
                                h("b", null, "\"\u70B9\u51FB\u6DFB\u52A0\u83DC\u5355\u9879\""),
                                h("div", null, "\u6309\u94AE\u53EF\u4EE5\u6DFB\u52A0\u83DC\u5355\u9879"));
                            return h("h4", { style: { padding: "180px 40px 0px 40px", textAlign: 'center', lineHeight: '180%' } }, msg);
                        }
                        get hasEditor() {
                            return false;
                        }
                    };
                });
                pageData.controls.push({ controlName: 'menu_design_body', controlId: common_1.guid(), position: 'view' });
            }
            ReactDOM.render(h(mobilePageDesigner_1.MobilePageDesigner, Object.assign({}, props)), page.element);
        });
    }
    exports.default = default_1;
});
