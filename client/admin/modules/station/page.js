var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/mobilePageDesigner", "admin/services/station", "components/common", "user/services/stationService", "admin/site", "admin/services/dataSource"], function (require, exports, mobilePageDesigner_1, station_1, common_1, stationService_1, site_1, dataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let controlTypes = {};
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let station = page.createService(station_1.StationService);
            class State {
            }
            class MobilePage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { pageData: this.props.pageData };
                }
                loadControlInstance(controlId, controlName, controlHTMLElement, controlData) {
                    return __awaiter(this, void 0, void 0, function* () {
                        controlHTMLElement.setAttribute('data-control-name', controlName);
                        controlHTMLElement.setAttribute('data-control-id', controlId);
                        controlHTMLElement.className = `${controlName}-control`;
                        let controlType = yield this.getControlType(controlName);
                        let controlReactElement = React.createElement(controlType, controlData);
                        let control = ReactDOM.render(controlReactElement, controlHTMLElement);
                        return { control, type: controlType };
                    });
                }
                getControlType(controlName) {
                    if (controlTypes[controlName] != null) {
                        return Promise.resolve(controlTypes[controlName]);
                    }
                    return new Promise((reslove, reject) => {
                        let path = `${common_1.componentsDir}/${controlName}/control`; //Editor.path(controlName);
                        let self = this;
                        requirejs([path], function (obj) {
                            let controlType = (obj || {}).default;
                            console.assert(controlType != null);
                            controlTypes[controlName] = controlType;
                            reslove(controlType);
                        });
                    });
                }
                savePageData(item) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield dataSource_1.pageData.update(item);
                        return item;
                    });
                }
                render() {
                    let userStation = page.createService(stationService_1.StationService);
                    return (h(mobilePageDesigner_1.MobilePageDesigner, { ref: (o) => this.designer = o, pageData: pageData, showComponentPanel: true, showPageEditor: true, save: (pageData) => this.savePageData(pageData), showMenuSwitch: true, buttons: [
                            h("button", { key: "return", className: "btn btn-sm btn-primary", onClick: () => site_1.app.back() },
                                h("i", { className: "icon-reply" }),
                                h("span", null, "\u8FD4\u56DE"))
                        ], pageDatas: userStation.pages }));
                }
            }
            let pageData = yield getPageData(page);
            let mobilePage = ReactDOM.render(h(MobilePage, { pageData: pageData }), page.element);
        });
    }
    exports.default = default_1;
    function checkStyleControl(pageData) {
        if (pageData.view == null) {
        }
    }
    function getPageData(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let station = page.createService(station_1.StationService);
            let userStation = page.createService(stationService_1.StationService);
            let { pageId, templateId } = page.data;
            let pageData;
            if (pageId) {
                pageData = yield userStation.pages.pageDataById(pageId);
            }
            else if (templateId) {
                pageData = yield station.pageDataByTemplate(templateId);
            }
            else {
                pageData = {
                    id: station_1.guid(),
                    view: { controls: [] }
                };
            }
            return pageData;
        });
    }
});
