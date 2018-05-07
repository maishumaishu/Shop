var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/site", "admin/services/service", "dilu", "qrcode", "clipboard", "admin/controls/imageManager", "admin/services/member", "bootstrap"], function (require, exports, site_1, service_1, dilu_1, QRCode, ClipboardJS, imageManager_1, member_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let { protocol, port, host } = location;
    let storeHomeUrl = `${protocol}//${host}/user/?appKey=${service_1.Service.appToken}`;
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            site_1.app.loadCSS(page.name);
            let member = page.createService(member_1.MemberService);
            class StationIndexPage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { store: this.props.store };
                }
                save() {
                    return __awaiter(this, void 0, void 0, function* () {
                        let isValid = yield this.validator.check();
                        if (!isValid)
                            return Promise.reject({});
                        // if (this.imageUpload.changed) {
                        //     var data = await station.saveImage(this.imageUpload.state.src);
                        //     this.state.store.Data.ImageId = data.id;
                        // }
                        return member.saveStore(this.state.store);
                    });
                }
                componentDidMount() {
                    let { required } = dilu_1.rules;
                    this.validator = new dilu_1.FormValidator(page.element, { name: "name", rules: [required("店铺名称不能为空")] });
                    // let qrcode = new QRCode(this.qrcodeElement, site.userClientUrl);
                    let qrcode = new QRCode(this.qrcodeElement, {
                        text: site_1.default.userClientUrl,
                        width: 160,
                        height: 160,
                    });
                    qrcode.makeCode(site_1.default.userClientUrl);
                }
                render() {
                    let { store } = this.state;
                    return (h("div", { className: "station-index" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "dropdown pull-right" },
                                h("button", { className: "btn btn-sm btn-primary dropdown-toggle", "data-toggle": "dropdown" },
                                    h("i", { className: "icon-sitemap" }),
                                    h("span", null, "\u8BBF\u95EE\u5E97\u94FA")),
                                h("div", { className: "dropdown-menu dropdown-menu-right", style: { padding: 20 } },
                                    h("div", { style: { width: '100%', textAlign: 'center' } }, "\u624B\u673A\u626B\u7801\u8BBF\u95EE"),
                                    h("div", { style: { width: 180, height: 180, padding: 10 }, ref: (e) => this.qrcodeElement = e || this.qrcodeElement }),
                                    h("div", { style: { width: '100%' } },
                                        h("button", { className: "pull-left btn-link", ref: (e) => {
                                                if (!e)
                                                    return;
                                                var clipboard = new ClipboardJS(e, {
                                                    text: function () {
                                                        // let pageName = userSiteMap.nodes.home_index.name;
                                                        // console.assert(pageName != null);
                                                        // let { protocol, port, host } = location;
                                                        // let baseUrl = `${protocol}//${host}/user/?appKey=${Service.appToken}`;
                                                        // return baseUrl;
                                                        return storeHomeUrl;
                                                    }
                                                });
                                                clipboard.on('success', function (e) {
                                                    ui.showToastMessage('商品链接已经成功复制');
                                                });
                                                clipboard.on('error', function (e) {
                                                    ui.alert('商品链接已经成功失败');
                                                });
                                            } }, "\u590D\u5236\u9875\u9762\u94FE\u63A5"),
                                        h("div", { className: "pull-right" },
                                            h("button", { className: "btn-link", onClick: () => {
                                                    // let url = userApp.createUrl(siteMap.nodes.home_index);
                                                    window.open(storeHomeUrl, "_blank");
                                                } }, "\u7535\u8111\u8BBF\u95EE"))))),
                            h("li", { className: "pull-right" },
                                h("button", { className: "btn btn-sm btn-primary", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.save(), { toast: "保存成功" });
                                    } },
                                    h("i", { className: "icon-save" }),
                                    h("span", null, "\u4FDD\u5B58")))),
                        h("div", { className: "clearfix" }),
                        h("div", { className: "well", style: { minHeight: 100 } },
                            h("div", { className: "row form-group" },
                                h("div", { className: "col-lg-12" },
                                    h("label", { className: "col-md-4", style: { width: 120 } }, "\u5E97\u94FA\u540D\u79F0*"),
                                    h("div", { className: "col-md-8", style: { maxWidth: 300 } },
                                        h("input", { name: "name", className: "form-control", value: store.Name, onChange: (e) => {
                                                store.Name = e.target.value;
                                                this.setState(this.state);
                                            }, ref: (e) => this.nameInput = e || this.nameInput })))),
                            h("div", { className: "row form-group" },
                                h("div", { className: "col-lg-12" },
                                    h("label", { className: "col-md-4", style: { width: 120 } }, "\u5E97\u94FA\u56FE\u6807"),
                                    h("div", { className: "col-md-8", style: { maxWidth: 300 } },
                                        h("img", { className: "img-responsive", src: service_1.imageUrl(store.Data.ImageId), title: "点击上传店铺图标", ref: (e) => {
                                                if (!e)
                                                    return;
                                                ui.renderImage(e, { imageSize: { width: 300, height: 300 } });
                                                e.onclick = () => {
                                                    imageManager_1.default.show((imageIds) => {
                                                        store.Data.ImageId = imageIds[0];
                                                        debugger;
                                                        this.setState(this.state);
                                                        // ui.renderImage(e, { imageSize: { width: 300, height: 300 } });
                                                    });
                                                };
                                            } })))))));
                }
            }
            let store = yield member.store();
            ReactDOM.render(h(StationIndexPage, { store: store }), page.element);
        });
    }
    exports.default = default_1;
    class ImageUpload extends React.Component {
        constructor(props) {
            super(props);
            this.width = 200;
            this.height = 200;
            this._chnaged = false;
            let emptyImage = ui.generateImageBase64(this.width, this.height, "请上传图片", { bgColor: 'white' });
            this.state = { src: this.props.src || emptyImage };
        }
        onFileChanged(e) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!e.files[0]) {
                    return;
                }
                let data = yield ui.imageFileToBase64(e.files[0], { width: this.width, height: this.height });
                this.state.src = data.base64;
                this._chnaged = true;
                this.setState(this.state);
            });
        }
        get changed() {
            return this._chnaged;
        }
        render() {
            let src = this.state.src;
            return [
                h("img", { key: "img", style: { width: this.width, height: this.height }, "data-src": src, ref: (e) => {
                        this.imageElement = e || this.imageElement;
                        e ? ui.renderImage(e) : null;
                    }, src: src }),
                h("input", { key: "file", name: "ImageUpload", type: "file", id: "ImageUpload", multiple: true, style: { position: 'absolute', top: 0, opacity: 0, height: this.height, width: this.width }, ref: (e) => {
                        if (!e)
                            return;
                        e.onchange = () => this.onFileChanged(e);
                    } })
            ];
        }
    }
});
