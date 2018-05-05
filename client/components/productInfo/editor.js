var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../editor", "admin/modules/shopping/product/properties", "admin/tips", "admin/services/shopping", "dilu", "../../admin/controls/imageInput", "../../admin/services/station"], function (require, exports, editor_1, properties_1, tips_1, shopping_1, dilu_1, imageInput_1, station_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let styles = {
        convertImageFile: {
            position: 'relative',
            left: 0,
            top: 0,
            width: 14,
            height: 30,
            marginTop: -30,
            opacity: 0
        }
    };
    class ProductInfoEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.loadEditorCSS();
            this.station = this.props.elementPage.createService(station_1.StationService);
        }
        componentDidMount() {
            let shopping = this.props.elementPage.createService(shopping_1.ShoppingService);
            shopping.categories().then(o => {
                this.state.categories = o;
                this.setState(this.state);
            });
            shopping.brands().then(o => {
                this.state.brands = o.dataItems;
                this.setState(this.state);
            });
            this.validator = new dilu_1.FormValidator(this.element, { name: "categoryId", rules: [dilu_1.rules.required("类别不能为空")], errorElement: this.categoryError }, { name: "name", rules: [dilu_1.rules.required("名称不能为空")] }, { name: "price", rules: [dilu_1.rules.required("价格不能为空")], errorElement: this.priceError });
            //  c.state.product.Fields = this.fieldPropertiies.state.properties;
            //
            this.validate = () => __awaiter(this, void 0, void 0, function* () {
                this.state.product.Fields = this.fieldPropertiies.state.properties;
                this.state.product.Arguments = this.argumentsProperties.state.properties;
                let result = yield this.validator.check();
                return result;
            });
        }
        bindCategoryId(e, product, categories) {
            if (!e)
                return;
            this.bindInputElement(e, product, 'ProductCategoryId');
            let _onchange = e.onchange;
            e.onchange = (event) => {
                if (_onchange)
                    _onchange.apply(e, event);
                let category = categories.filter(o => o.Id == e.value)[0];
                if (category) {
                    this.state.product.ProductCategoryName = category.Name;
                    this.setState(this.state);
                }
            };
        }
        render() {
            let { product, categories, brands } = this.state;
            categories = categories || [];
            brands = brands || [];
            return h("div", { ref: (e) => this.element = e || this.element },
                h("div", { key: 10, className: "row" },
                    h("div", { className: "col-sm-12" },
                        h("h4", null, "\u57FA\u672C\u4FE1\u606F"))),
                h("div", { key: 20, className: "row form-group" },
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-md-3" }, "\u7C7B\u522B*"),
                        h("div", { className: "col-md-9" },
                            h("div", { className: "input-group" },
                                h("select", { name: "categoryId", className: "form-control", ref: (e) => this.bindCategoryId(e, product, categories) },
                                    h("option", { value: "" }, "\u8BF7\u9009\u62E9\u7C7B\u522B"),
                                    categories.map(o => h("option", { key: o.Id, value: o.Id }, o.Name))),
                                h("span", { className: "input-group-addon", onClick: () => this.categoryDialog.show() },
                                    h("i", { className: "icon-plus" }))),
                            h("span", { className: dilu.FormValidator.errorClassName, style: { display: 'none' }, ref: (e) => this.categoryError = e || this.categoryError }))),
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-md-3" }, "\u540D\u79F0*"),
                        h("div", { className: "col-md-9" },
                            h("input", { name: "name", className: "form-control", placeholder: "请输入商品的名称", ref: (e) => e ? this.bindInputElement(e, product, 'Name') : null })))),
                h("div", { key: 30, className: "row form-group" },
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-lg-3" }, "\u4EF7\u683C*"),
                        h("div", { className: "col-lg-9" },
                            h("div", { className: "input-group" },
                                h("input", { name: "price", className: "form-control", placeholder: "请输入商品价格", ref: (e) => this.bindInputElement(e, product, 'Price', 'number') }),
                                h("span", { className: "input-group-addon" }, "\u5143")),
                            h("span", { className: dilu.FormValidator.errorClassName, style: { display: 'none' }, ref: (e) => this.priceError = e || this.priceError }))),
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-lg-3" }, "SKU"),
                        h("div", { className: "col-lg-9" },
                            h("input", { name: "sku", className: "form-control", placeholder: "请输入商品SKU", ref: (e) => this.bindInputElement(e, product, 'SKU') })))),
                h("div", { key: 40, className: "row form-group" },
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-lg-3" }, "\u54C1\u724C"),
                        h("div", { className: "col-lg-9" },
                            h("div", { className: "input-group" },
                                h("select", { className: "form-control", ref: (e) => e ? this.bindInputElement(e, product, 'BrandId') : null },
                                    h("option", { value: "" }, "\u8BF7\u9009\u62E9\u54C1\u724C"),
                                    brands.map(o => h("option", { key: o.Id, value: o.Id }, o.Name))),
                                h("span", { className: "input-group-addon", onClick: () => this.brandDialog.show() },
                                    h("i", { className: "icon-plus" }))))),
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-lg-3" }, "\u6807\u9898"),
                        h("div", { className: "col-lg-9" },
                            h("input", { className: "form-control" })))),
                h("div", { key: "convertImage", className: "row form-group" },
                    h("div", { className: "col-md-6" },
                        h("label", { className: "col-lg-3" }, "\u5C01\u9762\u56FE\u7247"),
                        h("div", { className: "col-lg-9" },
                            h(imageInput_1.ImageInput, { station: this.station, imageId: product.ImagePath, ref: (e) => {
                                    if (!e)
                                        return;
                                    e['componentDidUpdate'] = () => {
                                        product.ImagePath = e.state.imageId;
                                    };
                                } })))),
                h("hr", null),
                h(properties_1.PropertiesComponent, { ref: (e) => this.fieldPropertiies = e || this.fieldPropertiies, name: "商品规格", properties: product.Fields, emptyText: tips_1.default.noProductRegular, changed: (properties) => {
                        this.state.product.Fields = properties;
                        this.setState(this.state);
                    } }),
                h("hr", null),
                h(properties_1.PropertiesComponent, { ref: (e => this.argumentsProperties = e || this.argumentsProperties), name: "商品属性", properties: product.Arguments, emptyText: tips_1.default.noProductProperty, changed: (properties) => {
                        this.state.product.Arguments = properties;
                        this.setState(this.state);
                    } }),
                h("hr", null),
                h(CategoryDialog, { key: "categoryDialog", container: this, shop: this.props.elementPage.createService(shopping_1.ShoppingService), ref: (e) => this.categoryDialog = e || this.categoryDialog }),
                h(BrandDialog, { key: "brandDialog", container: this, shop: this.props.elementPage.createService(shopping_1.ShoppingService), ref: (e) => this.brandDialog = e || this.brandDialog }),
                h("div", { key: 50, className: "row form-group" },
                    h("div", { className: "col-md-12" },
                        h("input", { type: "checkbox", checked: this.state.hideProperties, onChange: () => {
                                this.state.hideProperties = !this.state.hideProperties;
                                this.setState(this.state);
                            } }),
                        h("span", null, "\u9690\u85CF\u5546\u54C1\u5C5E\u6027"))));
        }
    }
    exports.default = ProductInfoEditor;
    class CategoryDialog extends React.Component {
        constructor(props) {
            super(props);
        }
        show() {
            ui.showDialog(this.element);
        }
        confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                let shop = this.props.shop;
                let category = { Name: this.nameElement.value };
                let result = yield shop.addCategory(category);
                Object.assign(category, result);
                let c = this.props.container;
                c.state.categories.push(category);
                c.state.product.ProductCategoryId = category.Id;
                c.state.product.ProductCategoryName = category.Name;
                c.setState(c.state);
                return result;
            });
        }
        render() {
            return (h("div", { className: "modal fade", ref: (e) => this.element = e || this.element },
                h("div", { className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(this.element) },
                                h("span", { "aria-hidden": "true" }, "\u00D7")),
                            h("h4", { className: "modal-title" }, "\u6DFB\u52A0\u54C1\u7C7B")),
                        h("div", { className: "modal-body form-horizontal" },
                            h("div", { className: "form-group" },
                                h("label", { className: "col-sm-2 control-label" }, "\u540D\u79F0"),
                                h("div", { className: "col-sm-10" },
                                    h("input", { name: "name", type: "text", className: "form-control", placeholder: "请输入品类名称", ref: (e) => this.nameElement = e || this.nameElement })))),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { type: "button", className: "btn btn-primary", ref: (e) => __awaiter(this, void 0, void 0, function* () {
                                    if (!e)
                                        return;
                                    ui.buttonOnClick(e, () => __awaiter(this, void 0, void 0, function* () {
                                        yield this.confirm();
                                        ui.hideDialog(this.element);
                                    }));
                                }) }, "\u786E\u5B9A"))))));
        }
    }
    class BrandDialog extends React.Component {
        constructor(props) {
            super(props);
        }
        show() {
            ui.showDialog(this.element);
        }
        confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                let shop = this.props.shop;
                let brand = { Name: this.nameElement.value };
                let result = yield shop.addBrand(brand);
                Object.assign(brand, result);
                let c = this.props.container;
                c.state.brands.push(brand);
                c.state.product.BrandId = brand.Id;
                c.setState(c.state);
                return result;
            });
        }
        render() {
            return (h("div", { className: "modal fade", ref: (e) => this.element = e || this.element },
                h("div", { className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(this.element) },
                                h("span", { "aria-hidden": "true" }, "\u00D7")),
                            h("h4", { className: "modal-title" }, "\u6DFB\u52A0\u54C1\u724C")),
                        h("div", { className: "modal-body form-horizontal" },
                            h("div", { className: "form-group" },
                                h("label", { className: "col-sm-2 control-label" }, "\u540D\u79F0"),
                                h("div", { className: "col-sm-10" },
                                    h("input", { name: "name", type: "text", className: "form-control", placeholder: "请输入品牌名称", ref: (e) => this.nameElement = e || this.nameElement })))),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { type: "button", className: "btn btn-primary", ref: (e) => __awaiter(this, void 0, void 0, function* () {
                                    if (!e)
                                        return;
                                    ui.buttonOnClick(e, () => __awaiter(this, void 0, void 0, function* () {
                                        yield this.confirm();
                                        ui.hideDialog(this.element);
                                    }));
                                }) }, "\u786E\u5B9A"))))));
        }
    }
});
