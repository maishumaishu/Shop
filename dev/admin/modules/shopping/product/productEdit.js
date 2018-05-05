var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "application", "admin/services/shopping", "admin/services/station", "admin/services/service", "admin/services/dataSource", "ue.ext", "modules/shopping/product/properties", "dilu", "admin/tips", "admin/controls/imageUpload", "jquery-ui"], function (require, exports, application_1, shopping_1, station_1, service_1, dataSource_1, UE, properties_1, dilu_1, tips_1, imageUpload_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        let station = page.createService(station_1.StationService);
        var editorId = service_1.guid();
        application_1.default.loadCSS(page.name);
        class ProductEditPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    categories: [], brands: [],
                    product: this.props.product
                };
                shopping.categories().then(o => {
                    this.state.categories = o;
                    this.setState(this.state);
                });
                let args = { maximumRows: 100 };
                shopping.brands(args).then(o => {
                    this.state.brands = o.dataItems;
                    this.setState(this.state);
                });
            }
            componentDidMount() {
                UE.createEditor(editorId, this.introduceInput);
                let nameElement = this.element.querySelector('[name="name"]');
                let priceElement = this.element.querySelector('[name="price"]');
                this.validator = new dilu_1.FormValidator(this.element, { name: "categoryId", rules: [dilu_1.rules.required("类别不能为空")], errorElement: this.categoryError }, { name: "name", rules: [dilu_1.rules.required("名称不能为空")] }, { name: "price", rules: [dilu_1.rules.required("价格不能为空")], errorElement: this.priceError }, { name: 'introduce', rules: [dilu_1.rules.required("商品详请不能为空")], errorElement: this.introduceError });
                setTimeout(() => {
                    $(this.productThumbers).sortable({
                        items: 'li[product-id]',
                        update: () => {
                            let productIds = [];
                            let thumberElements = this.productThumbers.querySelectorAll('[product-id]');
                            for (let i = 0; i < thumberElements.length; i++) {
                                productIds.push(thumberElements.item(i).getAttribute('product-id'));
                            }
                            // this.state.product.ImagePaths = productIds;
                            this.setState(this.state);
                        }
                    });
                }, 100);
            }
            save() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (!isValid) {
                        throw new Error("validate fail.");
                    }
                    this.state.product.Introduce = this.introduceInput.value;
                    this.state.product.Fields = this.fieldPropertiies.state.properties;
                    this.state.product.Arguments = this.argumentsProperties.state.properties;
                    // return shopping.saveProduct({ product: this.state.product, parentId: page.data.parentId }).then(data => {
                    //     this.state.product.Id = data.Id;
                    //     return data;
                    // })
                    return dataSource_1.product.update(this.state.product, { parentId: page.data.parentId });
                });
            }
            updloadImage(imageFile) {
                ui.imageFileToBase64(imageFile)
                    .then(data => {
                    return station.saveImage(data.base64).then(o => `${o.id}`);
                })
                    .then(name => {
                    // this.state.product.ImagePaths.push(name);
                    this.setState(this.state);
                });
            }
            deleteImage(imageName) {
                let arr = imageName.split('_');
                console.assert(arr.length == 3);
                return station.removeImage(arr[0]).then(data => {
                    // var imagePaths = this.state.product.ImagePaths.filter(o => o != imageName);
                    // this.state.product.ImagePaths = imagePaths;
                    this.setState(this.state);
                    return data;
                });
            }
            saveContentImage(data) {
                return station.saveImage(data.base64).then(o => {
                    let name = `${o.id}`;
                    // this.state.product.ImagePaths.push(name);
                    this.setState(this.state);
                });
            }
            saveCoverImage(data) {
                return station.saveImage(data.base64).then(o => {
                    let name = `${o.id}`;
                    this.state.product.ImagePath = name;
                    this.setState(this.state);
                });
            }
            render() {
                let product = this.state.product;
                // let imagePaths = this.state.product.ImagePaths || [];
                let imagePath = this.state.product.ImagePath;
                return [
                    h("div", { key: "main", className: "Shopping-ProductEdit", ref: (e) => this.element = e || this.element },
                        h("div", { className: "tabbable" },
                            h("ul", { className: "nav nav-tabs" },
                                h("li", { className: "pull-right" },
                                    h("button", { className: "btn btn-sm btn-primary", onClick: () => history.back() },
                                        h("i", { className: "icon-reply" }),
                                        h("span", null, "\u8FD4\u56DE"))),
                                h("li", { className: "pull-right" },
                                    h("button", { className: "btn btn-sm btn-primary", ref: (e) => {
                                            if (!e)
                                                return;
                                            ui.buttonOnClick(e, () => this.save(), { toast: '保存商品成功' });
                                        } },
                                        h("i", { className: "icon-save" }),
                                        h("span", null, "\u4FDD\u5B58"))))),
                        h("br", null),
                        h("div", { className: "row" },
                            h("div", { className: "col-sm-12" },
                                h("h4", null, "\u57FA\u672C\u4FE1\u606F"))),
                        h("div", { className: "row form-group" },
                            h("div", { className: "col-lg-4 col-md-4" },
                                h("label", { className: "col-lg-3" }, "\u7C7B\u522B*"),
                                h("div", { className: "col-lg-9" },
                                    h("div", { className: "input-group" },
                                        h("select", { name: "categoryId", className: "form-control", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.value = product.ProductCategoryId || '';
                                                e.onchange = () => {
                                                    product.ProductCategoryId = e.value;
                                                };
                                            } },
                                            h("option", { value: "" }, "\u8BF7\u9009\u62E9\u7C7B\u522B"),
                                            this.state.categories.map(o => h("option", { key: o.Id, value: o.Id }, o.Name))),
                                        h("span", { className: "input-group-addon", onClick: () => this.categoryDialog.show() },
                                            h("i", { className: "icon-plus" }))),
                                    h("span", { className: dilu.FormValidator.errorClassName, style: { display: 'none' }, ref: (e) => this.categoryError = e || this.categoryError }))),
                            h("div", { className: "col-lg-4 col-md-4" },
                                h("label", { className: "col-lg-3" }, "\u540D\u79F0*"),
                                h("div", { className: "col-lg-9" },
                                    h("input", { name: "name", className: "form-control", placeholder: "请输入产品的名称", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.value = product.Name || '';
                                            e.onchange = () => {
                                                product.Name = e.value;
                                            };
                                        } }))),
                            h("div", { className: "col-lg-4 col-md-4" },
                                h("label", { className: "col-lg-3" }, "\u4EF7\u683C*"),
                                h("div", { className: "col-lg-9" },
                                    h("div", { className: "input-group" },
                                        h("input", { name: "price", className: "form-control", placeholder: "请输入产品价格", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.value = product.Price || '';
                                                e.onchange = () => {
                                                    product.Price = Number.parseFloat(e.value);
                                                };
                                            } }),
                                        h("span", { className: "input-group-addon" }, "\u5143")),
                                    h("span", { className: dilu.FormValidator.errorClassName, style: { display: 'none' }, ref: (e) => this.priceError = e || this.priceError })))),
                        h("div", { className: "row form-group" },
                            h("div", { className: "col-lg-4 col-md-4" },
                                h("label", { className: "col-lg-3" }, "\u6807\u9898"),
                                h("div", { className: "col-lg-9" },
                                    h("input", { name: "unit", className: "form-control", placeholder: "请输入产品标题", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.value = product.Title || '';
                                            e.onchange = () => {
                                                product.Title = e.value;
                                            };
                                        } }),
                                    h("span", { className: "price validationMessage", style: { display: 'none' } }))),
                            h("div", { className: "col-lg-4 col-md-4" },
                                h("label", { className: "col-lg-3" }, "SKU"),
                                h("div", { className: "col-lg-9" },
                                    h("input", { className: "form-control", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.value = product.SKU || '';
                                            e.onchange = () => {
                                                product.SKU = e.value;
                                            };
                                        } }))),
                            h("div", { className: "col-lg-4  col-md-4" },
                                h("label", { className: "col-lg-3" }, "\u54C1\u724C"),
                                h("div", { className: "col-lg-9" },
                                    h("select", { className: "form-control", ref: (e) => {
                                            if (!e)
                                                return;
                                            e.value = product.BrandId || '';
                                            e.onchange = () => {
                                                product.BrandId = e.value;
                                            };
                                        } },
                                        h("option", null, "\u8BF7\u9009\u62E9\u54C1\u724C"),
                                        this.state.brands.map(o => h("option", { key: o.Id, value: o.Id }, o.Name)))))),
                        h("hr", null),
                        h(properties_1.PropertiesComponent, { ref: (e) => this.fieldPropertiies = e || this.fieldPropertiies, name: "商品规格", properties: product.Fields, emptyText: tips_1.default.noProductRegular }),
                        h("hr", null),
                        h(properties_1.PropertiesComponent, { ref: (e => this.argumentsProperties = e || this.argumentsProperties), name: "商品属性", properties: product.Arguments, emptyText: tips_1.default.noProductProperty }),
                        h("hr", null),
                        h("div", { className: "row" },
                            h("div", { className: "col-sm-12" },
                                h("h4", null, "\u5546\u54C1\u56FE\u7247"))),
                        h("div", { className: "row form-group" },
                            h("div", { className: "col-sm-12" },
                                h("ul", { className: "images", ref: (e) => this.productThumbers = e || this.productThumbers },
                                    h("li", null,
                                        h(imageUpload_1.default, { title: "内容图片", style: { width: 114, height: 114 }, saveImage: (data) => this.saveContentImage(data) })),
                                    imagePath ?
                                        h("li", null,
                                            h(ImageThumber, { imagePath: imagePath, station: station, removed: () => {
                                                    this.state.product.ImagePath = '', this.setState(this.state);
                                                } })) :
                                        h("li", null,
                                            h(imageUpload_1.default, { title: '封面图片', style: { width: 114, height: 114 }, saveImage: (data) => this.saveCoverImage(data) }))))),
                        h("hr", null),
                        h("div", { className: "row" },
                            h("div", { className: "col-sm-12" },
                                h("h4", null, "\u5546\u54C1\u8BE6\u60C5*"))),
                        h("div", { className: "row form-group" },
                            h("div", { className: "col-sm-12" },
                                h("span", { className: dilu.FormValidator.errorClassName, style: { display: 'none' }, ref: (e) => this.introduceError = e || this.introduceError }),
                                h("script", { id: editorId, type: "text/html", dangerouslySetInnerHTML: { __html: product.Introduce || '' } }),
                                h("span", { className: "introduce validationMessage", style: { display: 'none' } }),
                                h("input", { name: "introduce", type: "hidden", ref: (e) => {
                                        if (!e)
                                            return;
                                        this.introduceInput = e;
                                        e.value = product.Introduce || '';
                                        e.onchange = (event) => {
                                            product.Introduce = event.target.value || '';
                                        };
                                    } })))),
                    h(CategoryDialog, { key: "categoryDialog", container: this, ref: (e) => this.categoryDialog = e || this.categoryDialog })
                ];
            }
        }
        var element = document.createElement('div');
        page.element.appendChild(element);
        var productId = page.data.id || page.data.parentId;
        let p;
        if (productId) {
            p = shopping.product(productId);
        }
        else {
            // p = Promise.resolve({
            //     ImagePaths: []
            // } as Product);
        }
        p.then((product) => {
            if (page.data.parentId)
                product.Id = undefined;
            ReactDOM.render(h(ProductEditPage, { product: product }), element);
        });
        class CategoryDialog extends React.Component {
            constructor(props) {
                super(props);
            }
            show() {
                ui.showDialog(this.element);
            }
            confirm() {
                return __awaiter(this, void 0, void 0, function* () {
                    let shop = page.createService(shopping_1.ShoppingService);
                    let category = { Name: this.nameElement.value };
                    let result = yield shop.addCategory(category);
                    Object.assign(category, result);
                    let c = this.props.container;
                    c.state.categories.push(category);
                    c.state.product.ProductCategoryId = category.Id;
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
    }
    exports.default = default_1;
    {
    }
    class ImageThumber extends React.Component {
        setDeleteButton(e, imagePath) {
            if (!e)
                return;
            let arr = imagePath.split('_');
            let { station } = this.props;
            e.onclick = ui.buttonOnClick(() => station.removeImage(arr[0]).then(o => this.props.removed(this)), {
                confirm: '确定删除该图片吗？'
            });
        }
        render() {
            let imagePath = this.props.imagePath;
            return (h("div", { className: "text-center", style: { border: 'solid 1px #ccc' } },
                h("img", { src: service_1.imageUrl(imagePath, 100), style: { width: '100%', height: '100%' } }),
                h("div", { style: { position: 'relative', marginTop: -24, backgroundColor: 'rgba(0, 0, 0, 0.55)', color: 'white' } },
                    h("button", { href: "javascript:", style: { color: 'white' }, className: "btn-link", ref: (e) => this.setDeleteButton(e, imagePath) }, "\u5220\u9664"))));
        }
    }
});
