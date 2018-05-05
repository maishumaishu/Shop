var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/stationService", "components/mobilePage", "react-dom"], function (require, exports, stationService_1, mobilePage_1, ReactDOM) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let station = page.createService(stationService_1.StationService);
            let pageData = yield station.pages.style();
            ReactDOM.render(h(mobilePage_1.MobilePage, { pageData: pageData, elementPage: page }), page.element);
        });
    }
    exports.default = default_1;
});
