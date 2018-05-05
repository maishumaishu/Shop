var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "site", "user/services/memberService", "user/services/userData", "user/services/weixinService", "ui", "user/siteMap"], function (require, exports, site_1, memberService_1, userData_1, weixinService_1, ui, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let member = page.createService(memberService_1.MemberService);
            let userInfo = userData_1.userData.userInfo.value || {}; //await member.userInfo();
            class ValueSelector extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { value: this.props.value };
                }
                changeValue(item) {
                    this.state.value = item.value;
                    this.setState(this.state);
                    if (this.valueChanged != null) {
                        this.valueChanged(item);
                    }
                }
                show() {
                    this.element.style.removeProperty('display');
                }
                hide() {
                    this.element.style.display = 'none';
                }
                render() {
                    let value = this.state.value;
                    let items = this.props.items;
                    let title = this.props.title || '';
                    return (h("div", { ref: (o) => this.element = this.element || o, style: { display: 'none' } },
                        h("div", { className: "modal fade in", style: { display: 'block' }, onClick: () => { this.hide(); } },
                            h("div", { className: "list-group ", style: { position: 'absolute', bottom: 0, width: '100%' }, onClick: (e) => {
                                    e.stopPropagation();
                                } },
                                h("div", { className: "list-group-item" },
                                    h("span", { style: { fontWeight: '700' } }, title),
                                    h("i", { className: "icon-remove pull-right", onClick: () => this.hide() })),
                                items.map(item => h("div", { key: item.name, className: "list-group-item", onClick: () => {
                                        this.changeValue(item);
                                        setTimeout(() => this.hide(), 200);
                                    } },
                                    h("span", null, item.name),
                                    h("i", { className: "pull-right icon-ok", style: { display: value == item.value ? 'block' : 'none' } }))))),
                        h("div", { className: "modal-backdrop fade in" })));
                }
            }
            class UserInfoPage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { userInfo };
                }
                showGenderSelector() {
                    this.genderSelector.show();
                }
                saveUserInfo() {
                    this.state.userInfo.HeadImageUrl = this.imageBox.state.imageSource;
                    return member.saveUserInfo(this.state.userInfo).then(() => {
                        userData_1.userData.userInfo.value = this.state.userInfo;
                    });
                }
                /** 将图片文件转换为 base64 字符串 */
                imageFileToBase64(file) {
                    return new Promise((resolve, reject) => {
                        if (!(/image/i).test(file.type)) {
                            console.log("File " + file.name + " is not an image.");
                            reject();
                        }
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = (ev) => {
                            var blob = new Blob([event.target['result']]);
                            var blobURL = URL.createObjectURL(blob);
                            var image = new Image();
                            let width = 100;
                            let height = 100;
                            image.style.width = `${width}px`;
                            image.style.height = `${height}px`;
                            image.src = blobURL;
                            image.onload = () => {
                                var canvas = document.createElement('canvas');
                                canvas.width = width;
                                canvas.height = height;
                                var ctx = canvas.getContext("2d");
                                ctx.drawImage(image, 0, 0, width, height);
                                let data = canvas.toDataURL("/jpeg", 0.1);
                                resolve(data);
                            };
                        };
                    });
                }
                regionText(userInfo) {
                    let region = "";
                    // let userInfo = this.state.userInfo;
                    if (userInfo.County) {
                        region = userInfo.County;
                    }
                    if (userInfo.City) {
                        region = userInfo.City + " " + region;
                    }
                    if (userInfo.Province) {
                        region = userInfo.Province + " " + region;
                    }
                    return region;
                }
                showRegions() {
                    // let r = this.state.receiptInfo;
                    let userInfo = this.state.userInfo;
                    let routeValues = {
                        // province: { Id: userInfo.ProvinceId, Name: userInfo.Province },
                        // county: { Id: userInfo.CountyId, Name: userInfo.CountyId },
                        // city: { Id: userInfo.CityId, Name: userInfo.City },
                        provinceId: userInfo.ProvinceId,
                        provinceName: userInfo.Province,
                        cityId: userInfo.CityId,
                        cityName: userInfo.City,
                        countyId: userInfo.CountyId,
                        countyName: userInfo.County,
                        selecteRegion: (province, city, county) => {
                            userInfo.City = city.Name;
                            userInfo.County = county.Name;
                            userInfo.Province = province.Name;
                            userInfo.CityId = city.Id;
                            userInfo.CountyId = county.Id;
                            userInfo.ProvinceId = province.Id;
                            this.setState(this.state);
                        }
                    };
                    site_1.app.showPage(siteMap_1.default.nodes.user_regions, routeValues);
                }
                componentDidMount() {
                    this.genderSelector.valueChanged = (item) => {
                        this.state.userInfo.Gender = item.value;
                        this.setState(this.state);
                    };
                    // ui.renderImage(this.userImage);
                }
                render() {
                    let userInfo = this.state.userInfo;
                    let regionText = this.regionText(userInfo);
                    return (h("div", null,
                        h("header", null, site_1.defaultNavBar(page, { title: '用户信息' })),
                        h("section", { className: "container" },
                            h("div", { className: "form-group" },
                                h("div", { className: "list-group" },
                                    h("div", { className: "list-group-item row" },
                                        h("div", { className: "col-xs-3" },
                                            h("label", { style: { position: 'relative', top: 30 } }, "\u5934\u50CF")),
                                        h("div", { className: "col-xs-9" },
                                            h("div", { className: "pull-right", style: { paddingLeft: 10, position: 'relative', top: 30 } },
                                                h("i", { className: "icon-chevron-right" })),
                                            h(ImageBox, { ref: (e) => this.imageBox = e || this.imageBox, page: page, imageSource: userInfo.HeadImageUrl, imageText: "上传头像", imageClassName: "img-circle pull-right" }))),
                                    h("div", { className: "list-group-item row" },
                                        h("label", { className: "col-xs-3" }, "\u6635\u79F0"),
                                        h("div", { "data-bind": "click:$root.edit('NickName'),tap:$root.edit('NickName')", className: "col-xs-9", style: { paddingLeft: 0 } },
                                            h("input", { className: "form-control", placeholder: "请输入昵称", style: { textAlign: 'right' }, value: userInfo.NickName || '', onChange: (e) => {
                                                    this.state.userInfo.NickName = e.target.value;
                                                    this.setState(this.state);
                                                } }))),
                                    h("div", { className: "list-group-item row" },
                                        h("label", { className: "col-xs-3" }, "\u6027\u522B"),
                                        h("div", { className: "col-xs-9", style: { paddingLeft: 0, textAlign: 'right' } },
                                            h("span", { style: { color: 'gray' }, className: "form-control", onClick: () => {
                                                    this.showGenderSelector();
                                                } },
                                                userInfo.Gender == 'Male' ? '男' : null,
                                                userInfo.Gender == 'Female' ? '女' : null,
                                                userInfo.Gender == 'None' || !userInfo.Gender ? '请选择性别' : null))),
                                    h("div", { className: "list-group-item row" },
                                        h("label", { className: "col-xs-3" }, "\u5730\u533A"),
                                        h("div", { className: "col-xs-9", style: { paddingLeft: 0 }, onClick: () => this.showRegions() },
                                            h("div", { className: "pull-right", style: { paddingLeft: 10 } },
                                                h("i", { className: "icon-chevron-right" })),
                                            h("div", { className: "pull-right" }),
                                            h("div", { className: "pull-right text-danger pull-right" }, regionText ? regionText : "未填写"))))),
                            h("div", { className: "form-group" },
                                h("button", { className: "btn btn-success btn-block", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = ui.buttonOnClick(() => this.saveUserInfo(), { toast: '用户信息保存成功' });
                                    } }, "\u4FDD\u5B58")),
                            h(ValueSelector, { ref: (o) => this.genderSelector = o || this.genderSelector, items: [{ name: '男', value: 'Male' }, { name: '女', value: 'Female' }], value: userInfo.Gender, title: "请选择性别" }))));
                }
            }
            ReactDOM.render(h(UserInfoPage, null), page.element);
        });
    }
    exports.default = default_1;
    class ImageBox extends React.Component {
        // private isWeixin: boolean;
        constructor(props) {
            super(props);
            this.state = { imageSource: this.props.imageSource };
            // var ua = navigator.userAgent.toLowerCase();
            // this.c
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                ui.renderImage(this.imageElement);
                if (weixinService_1.isWeixin) {
                    let weixin = this.props.page.createService(weixinService_1.WeiXinService);
                    let wx = yield weixinService_1.createWeixinClient(weixin);
                    this.element.onclick = () => {
                        wx.chooseImage({
                            count: 1,
                            sizeType: ['compressed'],
                            sourceType: ["album"],
                            success: (res) => {
                                wx.getLocalImgData({
                                    localId: res.localIds[0],
                                    success: (res) => {
                                        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                        this.state.imageSource = localData;
                                        ;
                                        this.setState(this.state);
                                    }
                                });
                            }
                        });
                    };
                }
            });
        }
        render() {
            let imageSource = this.state.imageSource;
            let imageText = this.props.imageText || '';
            return (h("div", { ref: (e) => this.element = e || this.element },
                h("img", { className: this.props.imageClassName, style: { width: 70, height: 70 }, src: imageSource, title: "上传头像", ref: (e) => this.imageElement = e || this.imageElement }),
                !weixinService_1.isWeixin ?
                    h("input", { type: "file", style: { position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: 90 }, accept: "images/*", multiple: false, onChange: (e) => {
                            let file = e.target.files[0];
                            if (!file)
                                return;
                            ui.imageFileToBase64(file, { width: 100, height: 100 }).then(data => {
                                this.state.imageSource = data.base64;
                                this.setState(this.state);
                            });
                        } }) : null));
        }
    }
});
