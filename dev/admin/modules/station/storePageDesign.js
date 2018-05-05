var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/mobilePageDesigner", "admin/services/station", "user/services/stationService"], function (require, exports, mobilePageDesigner_1, station_1, stationService_1) {
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
            ReactDOM.render(h(mobilePageDesigner_1.MobilePageDesigner, Object.assign({}, props)), page.element);
        });
    }
    exports.default = default_1;
});
