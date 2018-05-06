var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/editor", "admin/services/shopping", "admin/services/station", "share/common", "admin/controls/productSelectDialog", "ace_editor/ace"], function (require, exports, editor_1, shopping_1, station_1, common_1, productSelectDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const shopping = new shopping_1.ShoppingService();
    const station = new station_1.StationService();
    class ProductListEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.state = {
                showProductTemplate: false
            };
            this.loadEditorCSS();
        }
        setSourceTypeInput(e) {
            this.setRadioElement(e, "productSourceType");
        }
        setRadioElement(e, member) {
            if (!e || e.onchange)
                return;
            e.checked = (this.state[member] || '').toString() == e.value;
            e.onchange = () => {
                this.state[member] = e.value;
                this.setState(this.state);
            };
        }
        setCheckElement(e, member) {
            if (!e || e.onchange)
                return;
            e.checked = this.state[member];
            e.onchange = () => {
                this.state[member] = e.checked;
                this.setState(this.state);
            };
        }
        setProductsCountInput(e) {
            if (!e || e.onchange)
                return;
            for (let i = 1; i < 9; i++) {
                var option = document.createElement('option');
                option.value = i;
                option.text = i;
                e.appendChild(option);
            }
            e.value = `${this.state.prodcutsCount}`;
            e.onchange = () => {
                this.state.prodcutsCount = Number.parseInt(e.value);
                this.setState(this.state);
            };
            // e.options[0].selected = true;
        }
        setProductCategoryInput(e) {
            if (!e || e.onchange)
                return;
            e.onchange = () => {
                this.state.categoryId = e.value;
                this.setState(this.state);
            };
            shopping.categories().then(categories => {
                for (let i = 0; i < categories.length; i++) {
                    var option = document.createElement('option');
                    option.value = categories[i].Id;
                    option.text = categories[i].Name;
                    e.appendChild(option);
                }
                e.value = this.state.categoryId || '';
            });
        }
        setImageFileInput(e) {
            if (!e || e.onchange != null)
                return;
            e.onchange = () => {
                if (!e.files[0])
                    return;
                ui.imageFileToBase64(e.files[0], { width: 100, height: 100 })
                    .then(r => {
                    // r.base64
                });
            };
        }
        setProductAdd(e) {
            if (!e || e.onclick)
                return;
            e.onclick = () => {
                this.productsDialog.show((product) => this.productSelected(product));
            };
        }
        setProductDelete(e, productId) {
            if (!e || e.onclick)
                return;
            e.onclick = () => {
                this.state.productIds = this.state.productIds.filter(o => o != productId);
                this.setState(this.state);
            };
        }
        // setTemplateInput(e: HTMLTextAreaElement) {
        //     if (!e) return;
        //     let ctrl = this.props.control as ProductListControl;
        //     let tmp = ctrl.state.productTemplate || ctrl.productTemplate();
        //     this.templateInput = e;
        //     e.value = tmp;
        // }
        updateControlTemplate() {
            let ctrl = this.props.control;
            this.state.productTemplate = ctrl.state.productTemplate = this.editor.getValue();
            ctrl.setState(ctrl.state);
        }
        recoverControlTemplate() {
            let ctrl = this.props.control;
            this.state.productTemplate = ctrl.state.productTemplate = '';
            this.editor.setValue(ctrl.productTemplate());
            ctrl.setState(ctrl.state);
        }
        productSelected(product) {
            let productIds = this.state.productIds || [];
            let exists = productIds.indexOf(product.Id) >= 0;
            if (exists) {
                ui.alert({ title: "提示", message: '该商品已选择' });
                return Promise.reject({});
            }
            productIds.push(product.Id);
            this.state.productIds = productIds;
            this.setState(this.state);
            return Promise.resolve();
        }
        loadTextEditor(e) {
            if (!e)
                return;
            let ace = window['ace'];
            this.editor = ace.edit(e);
            // this.editor.setTheme("ace/theme/textmate");
            let ctrl = this.props.control;
            this.editor.session.setMode("ace/mode/html");
            this.editor.setValue(this.state.productTemplate || ctrl.productTemplate());
        }
        renderProducts(container, productIds) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!container)
                    return;
                var products = yield shopping.productsByIds(productIds);
                var reactElement = h("ul", { className: "selected-products", ref: (e) => this.productThumbers = e || this.productThumbers },
                    products.map(o => h("li", { key: o.Id, "product-id": o.Id, title: "拖动图标可以对商品进行排序" },
                        h("img", { src: common_1.imageUrl(o.ImagePath, 100), ref: (e) => e ? ui.renderImage(e) : null }),
                        h("div", { className: "delete" },
                            h("button", { type: "button", className: "btn-link", ref: (e) => this.setProductDelete(e, o.Id) }, "\u5220\u9664")))),
                    h("li", { className: "product-add" },
                        h("i", { className: "icon-plus icon-4x", ref: (e) => this.setProductAdd(e) })));
                ReactDOM.render(reactElement, container, () => {
                    $(this.productThumbers).sortable({
                        update: () => {
                            let productIds = [];
                            this.productThumbers.querySelectorAll("[product-id]").forEach(o => {
                                productIds.push(o.getAttribute('product-id'));
                            });
                            let ctrl = this.props.control;
                            this.state.productIds = productIds;
                            ctrl.state.productIds = productIds;
                            this.setState(this.state);
                            ctrl.setState(ctrl.state);
                        },
                        items: 'li[product-id]'
                    });
                });
            });
        }
        render() {
            let productSourceType = this.state.productSourceType;
            let productIds = this.state.productIds || [];
            let listType = this.state.listType;
            let showProductTemplate = this.state.showProductTemplate;
            let ctrl = this.props.control;
            let tmp = this.state.productTemplate || ctrl.productTemplate();
            return (h("form", { className: "product-list-editor" },
                h("div", { className: "form-group" },
                    h("label", { className: "pull-left" }, "\u6570\u636E\u6765\u6E90"),
                    h("span", null,
                        h("input", { name: "sourceType", type: "radio", value: "category", ref: (e) => this.setRadioElement(e, 'productSourceType') }),
                        "\u5206\u7C7B"),
                    h("span", null,
                        h("input", { name: "sourceType", type: "radio", value: "custom", ref: (e) => this.setRadioElement(e, 'productSourceType') }),
                        "\u624B\u52A8\u6DFB\u52A0")),
                h("div", { className: "form-group" },
                    h("label", { className: "pull-left" }, "\u5217\u8868\u6837\u5F0F"),
                    h("span", null,
                        h("input", { name: "styleType", type: "radio", value: "singleColumn", ref: (e) => this.setRadioElement(e, 'listType') }),
                        "\u5355\u5217"),
                    h("span", null,
                        h("input", { name: "styleType", type: "radio", value: "doubleColumn", ref: (e) => this.setRadioElement(e, 'listType') }),
                        "\u53CC\u5217")),
                listType == 'singleColumn' ? [
                    h("div", { key: 20, className: "form-group" },
                        h("label", { className: "pull-left" }, "\u56FE\u7247\u5927\u5C0F"),
                        h("span", null,
                            h("input", { name: "imageSize", type: "radio", value: "small", ref: (e) => this.setRadioElement(e, 'imageSize') }),
                            "\u5C0F"),
                        h("span", null,
                            h("input", { name: "imageSize", type: "radio", value: "medium", ref: (e) => this.setRadioElement(e, 'imageSize') }),
                            "\u4E2D"),
                        h("span", null,
                            h("input", { name: "imageSize", type: "radio", value: "large", ref: (e) => this.setRadioElement(e, 'imageSize') }),
                            "\u5927"))
                ] : [],
                h("div", { className: "form-group" },
                    h("label", { className: "pull-left" }, "\u89C4\u683C\u578B\u53F7"),
                    h("span", { style: { display: "block" } },
                        h("span", null,
                            h("input", { name: "showFields", type: "radio", value: "independent", ref: (e) => this.setRadioElement(e, 'showFields') }),
                            "\u72EC\u7ACB\u663E\u793A\u89C4\u683C\u578B\u53F7"),
                        h("span", null,
                            h("input", { name: "showFields", type: "radio", value: "append", ref: (e) => this.setRadioElement(e, 'showFields') }),
                            "\u5C06\u89C4\u683C\u578B\u53F7\u8FFD\u52A0\u5230\u54C1\u540D\u540E"))),
                h("div", { className: "form-group" },
                    h("label", { className: "pull-left" }, "\u4F18\u60E0\u6807\u7B7E"),
                    h("span", { style: { display: "block" } },
                        h("input", { type: "checkbox" }),
                        "\u5BF9\u4E8E\u6709\u4F18\u60E0\u7684\u5546\u54C1\u663E\u793A\u4F18\u60E0\u6807\u7B7E")),
                h("div", { key: 10, className: "form-group" },
                    h("label", { className: "pull-left" }, "\u5546\u54C1\u540D\u79F0"),
                    h("span", null,
                        h("input", { name: "productNameLines", type: "radio", value: "singleLine", ref: (e) => this.setRadioElement(e, 'productNameLines') }),
                        "\u5355\u884C\u6587\u5B57"),
                    h("span", null,
                        h("input", { name: "productNameLines", type: "radio", value: "doubleLine", ref: (e) => this.setRadioElement(e, 'productNameLines') }),
                        "\u53CC\u884C\u6587\u5B57")),
                h("div", { style: { display: productSourceType == 'category' ? 'block' : 'none' } },
                    h("div", { className: "form-group" },
                        h("label", { className: "pull-left" }, "\u5546\u54C1\u6570\u91CF"),
                        h("div", null,
                            h("select", { className: "form-control", ref: (e) => this.setProductsCountInput(e) }))),
                    h("div", { className: "form-group" },
                        h("label", { className: "pull-left" }, "\u5546\u54C1\u7C7B\u522B"),
                        h("div", null,
                            h("select", { className: "form-control", ref: (e) => this.setProductCategoryInput(e) },
                                h("option", { value: "" }, "\u6240\u6709\u5546\u54C1"))))),
                h("div", { className: "form-group", style: { display: productSourceType == 'custom' ? 'block' : 'none' } },
                    h("label", { className: "pull-left" }, "\u9009\u53D6\u5546\u54C1"),
                    h("div", { style: { width: 'calc(100% - 100px)', marginLeft: 100 }, ref: (e) => this.renderProducts(e, productIds) })),
                h("div", { className: "form-group" },
                    h(productSelectDialog_1.ProductSelectDialog, { shopping: shopping, ref: (e) => this.productsDialog = e || this.productsDialog }),
                    h("div", { className: "clearfix" })),
                h("div", { className: "form-group" },
                    h("label", null,
                        "\u5546\u54C1\u6A21\u677F",
                        h("button", { type: "button", className: "btn-link", style: { color: 'unset' }, title: "点击显示商品模板", onClick: () => {
                                this.state.showProductTemplate = !showProductTemplate;
                                this.setState(this.state);
                            } }, showProductTemplate ? h("i", { className: "icon-minus" }) : h("i", { className: "icon-plus" }))),
                    !showProductTemplate ?
                        h("span", null, "\u901A\u8FC7\u4FEE\u6539\u5546\u54C1\u6A21\u677F\uFF0C\u53EF\u4EE5\u4F7F\u5F97\u5546\u54C1\u7684\u663E\u793A\u66F4\u4E3A\u4E2A\u6027\u5316") : null),
                showProductTemplate ? [
                    h("pre", { key: 10, style: { height: 260 }, ref: (e) => {
                            setTimeout(() => {
                                this.loadTextEditor(e);
                            });
                        } }),
                    h("div", { key: 20, className: "form-group" },
                        h("button", { className: "btn btn-primary btn-sm", type: "button", onClick: () => this.updateControlTemplate() }, "\u5E94\u7528\u5F53\u524D\u6A21\u677F"),
                        h("button", { className: "btn btn-default btn-sm", type: "button", onClick: () => this.recoverControlTemplate() }, "\u8FD8\u539F\u56DE\u9ED8\u8BA4\u6A21\u677F"))
                ] : null));
        }
    }
    exports.default = ProductListEditor;
});
