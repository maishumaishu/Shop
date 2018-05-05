var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/site", "user/services/shoppingService", "dilu", "ui", "user/siteMap"], function (require, exports, site_1, shoppingService_1, dilu_1, ui, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let shop = page.createService(shoppingService_1.ShoppingService);
            let routeValues = page.data;
            let receiptInfo = yield getReceiptInfo(routeValues, shop);
            let receiptEditPage;
            ReactDOM.render(h(ReceiptEditPage, { receiptInfo: receiptInfo, elementPage: page, ref: (e) => receiptEditPage = e || receiptEditPage }), page.element);
            // let id = routeValues.id;
            // page.showing.add(async () => {
            //     let changed = page.data.id != id;
            //     id = page.data.id;
            //     if (!changed) {
            //         return;
            //     }
            //     receiptEditPage.validator.clearErrors();
            //     let receiptInfo: ReceiptInfo = await getReceiptInfo(page.data as ReceiptEditPageArguments, shop);
            //     receiptEditPage.state.receiptInfo = receiptInfo;
            //     receiptEditPage.setState(receiptEditPage.state);
            // })
        });
    }
    exports.default = default_1;
    function getReceiptInfo(args, shop) {
        return __awaiter(this, void 0, void 0, function* () {
            let receiptInfo;
            let routeValues = args;
            let id = routeValues.id;
            if (id) {
                receiptInfo = yield shop.receiptInfo(id);
            }
            else {
                receiptInfo = {};
            }
            return receiptInfo;
        });
    }
    class ReceiptEditPage extends React.Component {
        constructor(props) {
            super(props);
            let receiptInfo = this.props.receiptInfo || {};
            this.state = { receiptInfo: receiptInfo };
        }
        componentDidMount() {
            let { required } = dilu_1.rules;
            let e = (name) => this.formElement.querySelector(`[name='${name}']`);
            this.validator = new dilu_1.FormValidator(this.formElement, { name: "Name", rules: [required("请输入地址名称")] }, { name: "Consignee", rules: [required('请输入收货人姓名')] }, { name: "Mobile", rules: [required('请输入手机号码')] }, { name: "Address", rules: [required('请输入详细地址')] }, { name: "RegionId", rules: [required('请选择地区')] });
        }
        onInputChange(event) {
            let input = event.target;
            let value;
            if (input.type == 'checkbox') {
                value = input.checked;
            }
            else {
                value = input.value;
            }
            this.state.receiptInfo[input.name] = value;
            this.setState(this.state);
        }
        saveReceipt() {
            return __awaiter(this, void 0, void 0, function* () {
                let isValid = yield this.validator.check();
                if (isValid == false) {
                    return Promise.reject(null);
                }
                let shop = this.props.elementPage.createService(shoppingService_1.ShoppingService); //this.props.shop;
                return shop.saveReceiptInfo(this.state.receiptInfo).then(data => {
                    // Object.assign(this.state.receiptInfo, data);
                    this.setState(this.state);
                    let routeValues = this.props.elementPage.data;
                    if (routeValues.onSaved) {
                        routeValues.onSaved(this.state.receiptInfo);
                    }
                    return data;
                });
            });
        }
        changeRegion() {
            let r = this.state.receiptInfo;
            let routeValues = {
                provinceId: r.ProvinceId,
                provinceName: r.ProvinceName,
                cityId: r.CityId,
                cityName: r.CityName,
                countyId: r.CountyId,
                countyName: r.CountyName,
                selecteRegion: (province, city, county) => {
                    r.ProvinceName = province.Name;
                    r.ProvinceId = province.Id;
                    r.CityName = city.Name;
                    r.CityId = city.Id;
                    r.CountyName = county.Name;
                    r.CountyId = county.Id;
                    r.RegionId = county.Id;
                    this.setState(this.state);
                }
            };
            site_1.app.redirect(siteMap_1.default.nodes.user_regions, routeValues);
        }
        clear() {
            this.state.receiptInfo = {};
            this.setState(this.state);
        }
        render() {
            let receiptInfo = this.state.receiptInfo; //请选择地区
            let region = "";
            if (receiptInfo.ProvinceName && receiptInfo.CityName && receiptInfo.CountyName) {
                region = `${receiptInfo.ProvinceName} ${receiptInfo.CityName} ${receiptInfo.CountyName}`;
            }
            let province = { Id: receiptInfo.ProvinceId, Name: receiptInfo.ProvinceName };
            let city = { Id: receiptInfo.CityId, Name: receiptInfo.CityName };
            let county = { Id: receiptInfo.CountyId, Name: receiptInfo.CountyName };
            return [
                h("header", { key: "header" }, site_1.defaultNavBar(this.props.elementPage, { title: '编辑地址' })),
                h("section", { key: "view0" },
                    h("div", { className: "container" },
                        h("form", { "data-bind": "with:receipt", ref: (e) => this.formElement = e || this.formElement, className: "form-horizontal" },
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } },
                                    h("span", { className: "color-red" }, "*"),
                                    " \u5730\u5740\u540D\u79F0"),
                                h("div", { className: "col-xs-9" },
                                    h("input", { type: "text", name: "Name", className: "form-control", value: receiptInfo.Name || '', onChange: (e) => this.onInputChange(e), placeholder: "方便区分收货地址，例如：公司、家" }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } },
                                    h("span", { className: "color-red" }, "*"),
                                    " \u6536\u8D27\u4EBA"),
                                h("div", { className: "col-xs-9" },
                                    h("input", { type: "text", name: "Consignee", className: "form-control", value: receiptInfo.Consignee || '', onChange: (e) => this.onInputChange(e), placeholder: "请填写收货人的姓名" }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } },
                                    h("span", { className: "color-red" }, "*"),
                                    " \u624B\u673A\u53F7\u7801"),
                                h("div", { className: "col-xs-9" },
                                    h("input", { type: "text", name: "Mobile", className: "form-control", value: receiptInfo.Mobile || '', onChange: (e) => this.onInputChange(e), placeholder: "请填写收货人手机号码" }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } },
                                    h("span", { className: "color-red" }, "*"),
                                    " \u6240\u5728\u5730\u533A"),
                                h("div", { className: "col-xs-9", onClick: () => this.changeRegion() },
                                    h("div", { type: "text", className: "form-control", style: { color: !region ? '#aaaaaa' : null } }, region ? region : '请选择地区'),
                                    h("input", { type: "hidden", name: "RegionId", value: receiptInfo.RegionId || '', readOnly: true }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } },
                                    h("span", { className: "color-red" }, "*"),
                                    " \u8BE6\u7EC6\u5730\u5740"),
                                h("div", { className: "col-xs-9" },
                                    h("input", { type: "text", name: "Address", className: "form-control", value: receiptInfo.Address || '', onChange: (e) => this.onInputChange(e), "data-bind": "value:Address,textInput:Address", placeholder: "请填写收货地址" }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u90AE\u7F16"),
                                h("div", { className: "col-xs-9" },
                                    h("input", { type: "text", name: "PostalCode", className: "form-control", placeholder: "请输入邮政编码", value: receiptInfo.PostalCode || '', onChange: (e) => this.onInputChange(e) }))),
                            h("div", { className: "form-group" },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u56FA\u5B9A\u7535\u8BDD"),
                                h("div", { className: "col-xs-9" },
                                    h("input", { name: "Phone", className: "form-control", placeholder: "请输入固定电话号码", value: receiptInfo.Phone || '', onChange: (e) => this.onInputChange(e) }))),
                            h("div", { className: "form-group", style: { display: 'block' } },
                                h("label", { className: "col-xs-3", style: { paddingRight: 0 } }, "\u8BBE\u4E3A\u9ED8\u8BA4"),
                                h("div", { className: "col-xs-9 pull-right", style: { textAlign: 'right' } },
                                    h("input", { type: "checkbox", name: "IsDefault", onChange: (e) => this.onInputChange(e), ref: (e) => {
                                            if (!e)
                                                return;
                                            e.checked = receiptInfo.IsDefault;
                                        } })))),
                        h("div", { className: "form-group" },
                            h("span", { className: "color-red" }, "*"),
                            "\u4E3A\u5FC5\u586B\u9879\u76EE"),
                        h("div", { className: "form-group" },
                            h("button", { className: "btn btn-primary btn-block", ref: (o) => {
                                    if (!o)
                                        return;
                                    o.onclick = ui.buttonOnClick(() => {
                                        return this.saveReceipt();
                                    }, { toast: '保存地址成功' });
                                } }, "\u4FDD\u5B58"))))
            ];
        }
    }
});
