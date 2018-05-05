var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/stationService", "components/mobilePage"], function (require, exports, stationService_1, mobilePage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let { pageId } = page.data;
            let station = page.createService(stationService_1.StationService);
            let result = yield Promise.all([station.pages.pageDataById(pageId), station.pages.style(), station.pages.menu()]);
            let pageData = result[0];
            let stylePageData = result[1];
            let menuPageData = result[2];
            let existsStyleControl = pageData.footer.controls.filter(o => o.controlName == 'style').length > 0;
            if (!existsStyleControl) {
                let styleControl = stylePageData.footer.controls[0];
                console.assert(styleControl != null && styleControl.controlName == 'style');
                pageData.footer.controls.push(styleControl);
            }
            let existsMenuControl = pageData.footer.controls.filter(o => o.controlName == 'menu').length > 0;
            if (!existsMenuControl && pageData.showMenu) {
                let menuControlData = menuPageData.footer.controls.filter(o => o.controlName == 'menu')[0];
                console.assert(menuControlData != null);
                pageData.footer.controls.push(menuControlData);
            }
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page }), page.element);
        });
    }
    exports.default = default_1;
});
