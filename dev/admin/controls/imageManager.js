var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/controls/imageUpload", "admin/controls/imageThumber", "admin/services/station", "../site", "wuzhui"], function (require, exports, imageUpload_1, imageThumber_1, station_1, site_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['css!admin/controls/imageManager']);
    class ImageManager extends React.Component {
        // private element: HTMLElement;
        constructor(props) {
            super(props);
            this.state = { images: [], selectedItems: [] };
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                let station = new station_1.StationService();
                station.error.add((sender, err) => site_1.app.error.fire(site_1.app, err, site_1.app.currentPage));
                let self = this;
                let dataSource = this.dataSource = new wuzhui.DataSource({
                    primaryKeys: ['id'],
                    select(args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield station.images(args, 140, 140);
                            self.state.images = result.dataItems;
                            self.setState(self.state);
                            return result;
                        });
                    },
                    delete(item) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let result = yield station.removeImage(item.id);
                            self.state.images = self.state.images.filter(o => o.id != item.id);
                            self.setState(self.state);
                            return result;
                        });
                    },
                    insert(item) {
                        return __awaiter(this, void 0, void 0, function* () {
                            console.assert(item.data != null);
                            let result = yield station.saveImage(item.data);
                            // item.id = result.id;
                            Object.assign(item, result);
                            self.state.images.unshift(item);
                            self.setState(self.state);
                            return result;
                        });
                    }
                });
                let pagingBar = new wuzhui.NumberPagingBar({
                    dataSource: dataSource,
                    element: this.pagingBarElement,
                    pagerSettings: {
                        activeButtonClassName: 'active',
                        buttonWrapper: 'li',
                        buttonContainerWraper: 'ul',
                        showTotal: false
                    },
                });
                let ul = this.pagingBarElement.querySelector('ul');
                ul.className = "pagination";
                dataSource.selectArguments.maximumRows = 17;
                dataSource.select();
            });
        }
        show(callback) {
            this.showDialogCallback = callback;
            this.state.selectedItems = [];
            this.setState(this.state);
            ui.showDialog(this.props.element);
        }
        saveImage(data) {
            return __awaiter(this, void 0, void 0, function* () {
                this.dataSource.insert({ data });
            });
        }
        removeImage(item) {
            this.dataSource.delete(item);
        }
        render() {
            let { images, selectedItems } = this.state;
            let element = this.props.element;
            return (
            // <div className="image-manager modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
            h("div", { className: "modal-dialog modal-lg" },
                h("div", { className: "modal-content" },
                    h("div", { className: "modal-header" },
                        h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(element) },
                            h("span", { "aria-hidden": "true" }, "\u00D7")),
                        h("h4", { className: "modal-title" }, "\u9009\u62E9\u56FE\u7247")),
                    h("div", { className: "modal-body" },
                        images.map((o, i) => {
                            let thumber = h(imageThumber_1.default, { key: o.id, imagePath: o.id, className: "col-xs-2", remove: (imagePath) => this.removeImage(o), selectedText: selectedItems.indexOf(o.id) >= 0 ? `${selectedItems.indexOf(o.id) + 1}` : '', text: o.width != null && o.height != null ? `${o.width} X ${o.height}` : " ", onClick: (sender, e) => {
                                    if (selectedItems.indexOf(o.id) >= 0) {
                                        this.state.selectedItems = selectedItems.filter(c => c != o.id);
                                    }
                                    else {
                                        this.state.selectedItems.push(o.id);
                                    }
                                    this.setState(this.state);
                                } });
                            return thumber;
                        }),
                        h(imageUpload_1.default, { className: "col-xs-2", saveImage: (data) => this.saveImage(data.base64), width: 400 }),
                        h("div", { className: "clearfix" })),
                    h("div", { className: "modal-footer" },
                        h("div", { className: "pull-left", ref: (e) => this.pagingBarElement = e || this.pagingBarElement }),
                        h("button", { name: "cancel", type: "button", className: "btn btn-default", onClick: () => ui.hideDialog(element) }, "\u53D6\u6D88"),
                        h("button", { name: "ok", type: "button", className: "btn btn-primary", onClick: () => {
                                if (this.showDialogCallback) {
                                    let imageIds = this.state.selectedItems.map(o => o);
                                    this.showDialogCallback(imageIds);
                                }
                                ui.hideDialog(element);
                            } }, "\u786E\u5B9A")))));
        }
    }
    let element = document.createElement('div');
    element.className = 'image-manager modal fade';
    document.body.appendChild(element);
    let instance = ReactDOM.render(h(ImageManager, { element: element }), element);
    exports.default = {
        show(callback) {
            instance.show(callback);
        }
    };
});
