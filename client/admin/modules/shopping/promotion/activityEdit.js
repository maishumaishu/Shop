var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/service", "admin/services/activity", "admin/controls/productSelectDialog", "admin/services/shopping", "application", "dilu"], function (require, exports, service_1, activity_1, productSelectDialog_1, shopping_1, application_1, dilu) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    dilu.FormValidator.errorClassName = "validationMessage";
    var promotionTypeTexts = {
        Reduce: '满减',
        Given: '满赠',
        Discount: '满折'
    };
    var promotionMethodTexts = {
        Amount: '按商品总金额',
        Count: '按商品总数量'
    };
    var objectTypeTexts = {
        Brand: '品牌',
        Category: '类别',
        Product: '商品'
    };
    var promotionTypes = {
        amount: 'Reduce',
        product: 'Given',
        discount: 'Discount'
    };
    var promotionMethods = {
        amount: 'Amount',
        count: 'Count'
    };
    var objectNames = {};
    function getConditionText(promotion, promotionRule) {
        var condition_text;
        if (promotion.Method == promotionMethods.count) {
            condition_text = `购买指定商品任意 ${promotionRule.LevelValue} 件, `;
        }
        else if (promotion.Method == promotionMethods.amount) {
            condition_text = `购买指定商品满 ￥${new Number(promotionRule.LevelValue).toFixed(2)} 元, `;
        }
        return condition_text;
    }
    function description(promotion, contentRule) {
        if (promotion.Type == promotionTypes.product) {
            var str = '即可获赠'; // chitu.Utility
            let items = contentRule.GivenValue.split(",").map(o => {
                let arr = o.split(":");
                let id = arr[0];
                let quantity = Number.parseInt(arr[1]);
                return { id, quantity };
            });
            for (var i = 0; i < items.length; i++) {
                if (i > 0)
                    str = str + "，";
                str = str + ` “${objectNames[items[i].id]}” ${items[i].quantity} 件`;
            }
            let description = getConditionText(promotion, contentRule) + str;
            return description;
        }
        else if (promotion.Type == promotionTypes.amount) {
            let str = `￥${new Number(contentRule.GivenValue).toFixed(2)}`;
            var given_text = `即减 ${str} 元`;
            return getConditionText(promotion, contentRule) + given_text;
        }
        else if (promotion.Type == promotionTypes.discount) {
            var given_text = `打 ${contentRule.GivenValue} 折`;
            return getConditionText(promotion, contentRule) + given_text;
        }
    }
    class ActivityEditPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = { promotions: props.promotions };
            this.page = this.props.page;
        }
        newProductRule(promotion) {
            this.productInputDialog.show((product, isInclude) => {
                let rule = {
                    Id: service_1.guid(),
                    ObjectName: product.Name,
                    ObjectId: product.Id,
                    ObjectType: 'Product',
                    PromotionId: promotion.Id,
                    CollectionType: isInclude ? 'Include' : 'Exclude',
                    CreateDateTime: new Date(Date.now())
                };
                promotion.PromotionRangeRules.push(rule);
                this.setState(this.state);
            });
        }
        newBrandRule(promotion) {
            this.brandInputDialog.show((brand, isInclude) => {
                let rule = {
                    Id: service_1.guid(),
                    ObjectName: brand.Name,
                    ObjectId: brand.Id,
                    ObjectType: 'Brand',
                    PromotionId: promotion.Id,
                    CollectionType: isInclude ? 'Include' : 'Exclude',
                    CreateDateTime: new Date(Date.now())
                };
                promotion.PromotionRangeRules.push(rule);
                this.setState(this.state);
            });
        }
        newCategoryRule(promotion) {
            this.categoryInputDialog.show((category, isInclude) => {
                let rule = {
                    Id: service_1.guid(),
                    ObjectName: category.Name,
                    ObjectId: category.Id,
                    ObjectType: 'Category',
                    PromotionId: promotion.Id,
                    CollectionType: isInclude ? 'Include' : 'Exclude',
                    CreateDateTime: new Date(Date.now())
                };
                promotion.PromotionRangeRules.push(rule);
                this.setState(this.state);
            });
        }
        showNewRuleDialog(promotion) {
            switch (promotion.Type) {
                case promotionTypes.amount:
                    this.newBuyReduce(promotion);
                    break;
                case promotionTypes.discount:
                    this.newBuyDiscount(promotion);
                    break;
                case promotionTypes.product:
                    this.newBuyGiven(promotion);
                    break;
            }
        }
        newBuyReduce(promotion) {
            this.buyReduceDialog.show(promotion, (rule) => {
                rule.Description = description(promotion, rule);
                promotion.PromotionContentRules.push(rule);
                this.setState(this.state);
            });
        }
        newBuyDiscount(promotion) {
            this.buyDiscountDialog.show(promotion, (rule) => {
                rule.Description = description(promotion, rule);
                promotion.PromotionContentRules.push(rule);
                this.setState(this.state);
            });
        }
        newBuyGiven(promotion) {
            this.buyGivenDialog.show(promotion, (rule) => {
                rule.Description = description(promotion, rule);
                promotion.PromotionContentRules.push(rule);
                this.setState(this.state);
            });
        }
        removeContentRule(promotion, contentRule) {
            let contentRules = promotion.PromotionContentRules.filter(o => o != contentRule);
            promotion.PromotionContentRules = contentRules;
            this.setState(this.state);
        }
        save() {
        }
        removePromotion(p) {
            this.state.promotions = this.state.promotions.filter(o => o != p);
            this.setState(this.state);
            return Promise.resolve();
        }
        createPromotion() {
            var $dlg = this.page.element.querySelector('[name="dlg_promotion"]');
            let sv_activity = this.page.createService(activity_1.ActivityService);
            let activityId = this.page.data.id;
            // let { promotion } = this.state;
            showDialog($dlg, '添加优惠', () => {
                // return sv_activity.addPromotion(activityId, promotion.type(), this.promotion.method())
                //     .then((data) => {
                //         var p = new Promotion();
                //         p.id = data.Id;
                //         p.content = new PromotionContent(data.Id, page);
                //         p.content.method(this.promotion.method());
                //         p.content.type(this.promotion.type());
                //         p.range = new PromotionRange(data.Id, this);
                //         this.promotions.push(p);
                //     });
            });
            return Promise.resolve();
        }
        render() {
            let activity = this.page.createService(activity_1.ActivityService);
            let topbar = (h("ul", { key: "topbar", className: "nav nav-tabs" },
                h("li", { key: "back", className: "pull-right" },
                    h("button", { className: "btn btn-sm btn-primary", onClick: () => application_1.default.back() },
                        h("i", { className: "icon-reply" }),
                        h("span", null, "\u8FD4\u56DE"))),
                h("li", { key: "save", className: "pull-right" },
                    h("button", { className: "btn btn-sm btn-primary", ref: (e) => {
                            if (!e)
                                return;
                            e.onclick = ui.buttonOnClick(() => {
                                return activity.updateActivityPromotions(this.props.activityId, this.state.promotions);
                            }, { toast: '保存成功' });
                        } },
                        h("i", { className: "icon-save" }),
                        h("span", null, "\u4FDD\u5B58"))),
                h("li", { key: "add", className: "pull-right" },
                    h("button", { href: "javascript:", className: "btn btn-sm btn-primary", ref: (e) => {
                            // ui.buttonOnClick(e,()=>this.cre)
                            ui.buttonOnClick(e, () => this.createPromotion());
                        } },
                        h("i", { className: "icon-plus" }),
                        h("span", null, "\u6DFB\u52A0")))));
            let result = [topbar];
            let promotions = this.state.promotions;
            if (promotions == null || promotions == []) {
                result.push(h("div", { style: { textAlign: 'center', padding: '50px 0px 50px 0px' } }, "\u6682\u65E0\u4F18\u60E0\u4FE1\u606F\uFF0C\u4F60\u53EF\u4EE5\u70B9\u51FB\u5DE6\u4E0A\u89D2\u7684\u201C\u6DFB\u52A0\u201D\u6309\u94AE\u8FDB\u884C\u6DFB\u52A0\uFF0C\u6DFB\u52A0\u5B8C\u6210\u540E\uFF0C\u8BF7\u70B9\u51FB\u201C\u4FDD\u5B58\u201D\u6309\u94AE\u3002"));
            }
            else {
                promotions.map((o, i) => h("div", { key: i, className: "row" },
                    h("div", { className: "col-md-6" },
                        h(PromotionRangeComponent, { page: this.page, rules: o.PromotionRangeRules })),
                    h("div", { className: "col-md-6" },
                        h("table", { border: 1, className: "table table-striped table-bordered table-hover", style: { borderCollapse: 'collapse' } },
                            h("thead", null,
                                h("tr", null,
                                    h("th", { colSpan: 4 },
                                        "\u4F18\u60E0\u5185\u5BB9",
                                        h("button", { className: "btn-link pull-right", title: "点击删除该优惠", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => this.removePromotion(o), {
                                                    confirm: '确定要删除该优惠吗'
                                                });
                                            } },
                                            h("i", { className: "icon-remove pull-right text-danger" })))),
                                h("tr", null,
                                    h("th", { style: { textAlign: 'center' } }, "\u540D\u79F0"),
                                    h("th", { style: { textAlign: 'center', width: 100 } }, o.Method == "Amount" ? '金额' : '数量'),
                                    h("th", { style: { textAlign: 'center', width: 80 } }, "\u64CD\u4F5C"))),
                            h("tbody", null,
                                h("tr", { style: { display: o.PromotionContentRules.length > 0 ? 'none' : null } },
                                    h("td", { colSpan: 4, style: { border: "0px", textAlign: 'center' } },
                                        h("div", { style: { padding: '50px 0px 50px 0px' } }, "\u6682\u65E0\u6570\u636E"))),
                                o.PromotionContentRules.sort((a, b) => a.LevelValue - b.LevelValue).map((r, i) => h("tr", { key: `content${i}` },
                                    h("td", null, r.Description),
                                    h("td", { style: { textAlign: 'right' } }, o.Method == 'Amount' ?
                                        `￥${r.LevelValue.toFixed(2)}` :
                                        r.LevelValue),
                                    h("td", { style: { textAlign: 'center' } },
                                        h("button", { className: "btn btn-minier btn-danger", onClick: () => this.removeContentRule(o, r) },
                                            h("i", { className: "icon-trash" })))))),
                            h("tfoot", null,
                                h("tr", null,
                                    h("td", { colSpan: 4 },
                                        h("div", { className: "pull-left" },
                                            h("div", null,
                                                h("label", null,
                                                    h("span", { style: { fontWeight: 'bold' } }, "\u4F18\u60E0\u65B9\u5F0F\uFF1A"),
                                                    h("span", { "data-bind": "text:methodText" }, promotionMethodTexts[o.Method])),
                                                h("label", { style: { paddingLeft: 10 } },
                                                    h("span", { style: { fontWeight: 'bold' } }, "\u4F18\u60E0\u7C7B\u578B\uFF1A"),
                                                    h("span", { "data-bind": "text:typeText" }, promotionTypeTexts[o.Type])))),
                                        h("div", { className: "pull-right" },
                                            h("button", { className: "btn btn-primary btn-sm", onClick: () => this.showNewRuleDialog(o) }, "\u6DFB\u52A0\u4F18\u60E0\u5185\u5BB9"))))))))).forEach(e => result.push(e));
            }
            let shopping = this.page.createService(shopping_1.ShoppingService);
            let dialogs = [
                h(ProductInputDialog, { key: "productInputDialog", page: this.page, ref: (e) => this.productInputDialog = e || this.productInputDialog }),
                h(BrandInputDialog, { key: "brandInputDialog", page: this.page, ref: (e) => this.brandInputDialog = e || this.brandInputDialog }),
                h(CategoryInputDialog, { key: "categoryInputDialog", page: this.page, ref: (e) => this.categoryInputDialog = e || this.categoryInputDialog }),
                h(BuyGivenDialog, { key: "buyGivenDialog", page: this.props.page, ref: (e) => this.buyGivenDialog = e || this.buyGivenDialog }),
                h(BuyReduceDialog, { key: "buyReduceDialog", ref: (e) => this.buyReduceDialog = e || this.buyReduceDialog }),
                h(BuyDiscountDialog, { key: "buyDiscountDialog", ref: (e) => this.buyDiscountDialog = e || this.buyDiscountDialog })
            ];
            dialogs.forEach(o => result.push(o));
            return result;
        }
    }
    function showDialog(dlg, title, ok_callback) {
        if (title)
            dlg.querySelector('.modal-title').innerHTML = title;
        dlg.querySelector('[name="btnOK"]').onclick = function () {
            var result = ok_callback(dlg);
            if (result instanceof Promise) {
                result.then(function () {
                    ui.hideDialog(dlg);
                });
            }
            else {
                ui.hideDialog(dlg);
            }
        };
        ui.showDialog(dlg);
    }
    class ProductInputDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { isInclude: true };
        }
        showProductSelector() {
            this.productSelectDialog.show((product) => {
                this.state.product = product;
                this.setState(this.state);
            });
        }
        show(onProductSelected) {
            this.state.product = null;
            this.setState(this.state);
            ui.showDialog(this.element);
            this.onProductSelected = onProductSelected;
        }
        confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                let isValid = yield this.validator.check();
                if (!isValid)
                    return;
                console.assert(this.state.product != null, "product is null");
                this.onProductSelected(this.state.product, this.state.isInclude);
                ui.hideDialog(this.element);
            });
        }
        componentDidMount() {
            let { required } = dilu.rules;
            this.validator = new dilu.FormValidator(this.element, {
                name: "Name",
                rules: [required("请选择商品")],
                errorElement: this.nameError
            });
        }
        render() {
            let { isInclude } = this.state;
            let productId = "", productName = "";
            if (this.state.product) {
                productId = this.state.product.Id;
                productName = this.state.product.Name;
            }
            let shopping = this.props.page.createService(shopping_1.ShoppingService);
            return [
                h("form", { key: "dlg_product", name: "dlg_product", className: "modal fade", ref: (e) => this.element = e || this.element },
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7"),
                                    h("span", { className: "sr-only" }, "Close")),
                                h("h4", { className: "modal-title" }, "\u6DFB\u52A0\u5546\u54C1")),
                            h("div", { className: "modal-body form-horizontal" },
                                h("div", { className: "form-group", style: { display: 'none' } },
                                    h("label", { className: "control-label col-sm-2" }, "*\u4EA7\u54C1\u7F16\u53F7"),
                                    h("div", { className: "col-sm-10" },
                                        h("div", { className: "input-group" },
                                            h("input", { className: "form-control", placeholder: "请输入产品编号", value: productId || '', readOnly: true }),
                                            h("span", { className: "input-group-btn" },
                                                h("button", { name: "btnSelectProduct", className: "btn btn-default", type: "button", onClick: () => this.showProductSelector() },
                                                    h("i", { className: "icon-cog" })))))),
                                h("div", { className: "form-group" },
                                    h("label", { className: "control-label col-sm-2" }, "*\u5546\u54C1\u540D\u79F0"),
                                    h("div", { className: "col-sm-10" },
                                        h("div", { className: "input-group" },
                                            h("input", { className: "form-control", placeholder: "请选择商品", value: productName || '', readOnly: true, ref: (e) => this.nameInput = e || this.nameInput }),
                                            h("span", { className: "input-group-btn" },
                                                h("button", { name: "btnSelectProduct", className: "btn btn-default", type: "button", onClick: () => this.showProductSelector() },
                                                    h("i", { className: "icon-cog" })))),
                                        h("span", { className: "validationMessage", ref: (e) => this.nameError = e || this.nameError }))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-sm-10 col-sm-offset-2" },
                                        h("label", { className: "radio-inline" },
                                            h("input", { type: "radio", value: "Include", checked: isInclude, onChange: (e) => {
                                                    this.state.isInclude = e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            "\u5305\u542B"),
                                        h("label", { className: "radio-inline" },
                                            h("input", { type: "radio", value: "Exclude", checked: !isInclude, onChange: (e) => {
                                                    this.state.isInclude = !e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            "\u6392\u9664")))),
                            h("div", { className: "modal-footer" },
                                h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                h("button", { name: "btnOK", type: "button", className: "btn btn-primary", onClick: () => this.confirm() }, "\u786E\u5B9A"))))),
                h(productSelectDialog_1.ProductSelectDialog, { key: "productSelectDialog", shopping: shopping, ref: (e) => this.productSelectDialog = e || this.productSelectDialog })
            ];
        }
    }
    class BrandInputDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { brands: BrandInputDialog.brands || [], selectedBrand: null, isInclude: true };
            let args = {
                maximumRows: 1000
            };
            if (BrandInputDialog.brands == null) {
                let shopping = this.props.page.createService(shopping_1.ShoppingService);
                shopping.brands(args).then(brands => {
                    BrandInputDialog.brands = brands.dataItems;
                    this.state.brands = BrandInputDialog.brands;
                    this.setState(this.state);
                });
            }
        }
        show(onBrandSelected) {
            this.state.isInclude = true;
            this.state.selectedBrand = null;
            this.setState(this.state);
            this.onBrandSelected = onBrandSelected;
            ui.showDialog(this.element);
        }
        confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                let isValid = yield this.validator.check();
                if (isValid == false)
                    return;
                this.onBrandSelected(this.state.selectedBrand, this.state.isInclude);
                ui.hideDialog(this.element);
            });
        }
        componentDidMount() {
            let { required } = dilu.rules;
            this.validator = new dilu.FormValidator(this.element, { name: "Brand", rules: [required("请选择品牌")] });
        }
        render() {
            let brand = this.state.selectedBrand;
            let isInclude = this.state.isInclude;
            let selectedBrandId = brand == null ? "" : brand.Id;
            return (h("form", { name: "dlg_brand", className: "modal fade", ref: (e) => this.element = e || this.element },
                h("div", { "data-bind": "with:brand", className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                h("span", { "aria-hidden": "true" }, "\u00D7"),
                                h("span", { className: "sr-only" }, "Close")),
                            h("h4", { className: "modal-title" }, "\u6DFB\u52A0\u54C1\u724C")),
                        h("div", { className: "modal-body" },
                            h("div", { className: "form-horizontal" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "control-label col-sm-2" }, "*\u54C1\u724C"),
                                    h("div", { className: "col-sm-10" },
                                        h("select", { name: "Brand", className: "form-control", value: selectedBrandId, ref: (e) => this.brandSelect = e || this.brandSelect, onChange: (e) => {
                                                let brandId = e.target.value;
                                                this.state.selectedBrand = this.state.brands.filter(o => o.Id == brandId)[0];
                                                this.setState(this.state);
                                            } },
                                            h("option", { key: "empty", value: "" }, "\u8BF7\u9009\u62E9\u54C1\u724C"),
                                            this.state.brands.map(o => h("option", { key: o.Id, value: o.Id }, o.Name))))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-sm-10 col-sm-offset-2" },
                                        h("label", { className: "radio-inline" },
                                            h("input", { type: "radio", checked: isInclude, onChange: (e) => {
                                                    this.state.isInclude = e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            "\u5305\u542B"),
                                        h("label", { className: "radio-inline" },
                                            h("input", { type: "radio", checked: !isInclude, onChange: (e) => {
                                                    this.state.isInclude = !e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            "\u6392\u9664"))))),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { name: "btnOK", type: "button", className: "btn btn-primary", onClick: () => this.confirm() }, "\u786E\u5B9A"))))));
        }
    }
    class CategoryInputDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                categories: CategoryInputDialog.categories || [],
                selectedCategory: null, isInclude: true
            };
            let shopping = this.props.page.createService(shopping_1.ShoppingService);
            let args = {
                maximumRows: 1000
            };
            if (CategoryInputDialog.categories == null) {
                shopping.categories().then(categories => {
                    CategoryInputDialog.categories = categories;
                    this.state.categories = categories;
                    this.setState(this.state);
                });
            }
        }
        show(onBrandSelected) {
            this.state.isInclude = true;
            this.state.selectedCategory = null;
            this.setState(this.state);
            this.onCategorySelected = onBrandSelected;
            ui.showDialog(this.element);
        }
        confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                let isValid = yield this.validator.check();
                if (!isValid)
                    return;
                this.onCategorySelected(this.state.selectedCategory, this.state.isInclude);
                ui.hideDialog(this.element);
            });
        }
        componentDidMount() {
            let { required } = dilu.rules;
            this.validator = new dilu.FormValidator(this.element, { name: "Category", rules: [required("请选择类别")] });
        }
        render() {
            let category = this.state.selectedCategory;
            let isInclude = this.state.isInclude;
            let categories = this.state.categories;
            let selectedBrandId = category == null ? "" : category.Id;
            return (h("form", { name: "dlg_brand", className: "modal fade", ref: (e) => this.element = e || this.element },
                h("div", { "data-bind": "with:brand", className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                h("span", { "aria-hidden": "true" }, "\u00D7"),
                                h("span", { className: "sr-only" }, "Close")),
                            h("h4", { className: "modal-title" }, "\u6DFB\u52A0\u7C7B\u522B")),
                        h("div", { className: "modal-body" },
                            h("div", { className: "form-horizontal" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "control-label col-sm-2" }, "*\u7C7B\u522B"),
                                    h("div", { className: "col-sm-10" },
                                        h("select", { name: "Category", className: "form-control", value: selectedBrandId, ref: (e) => this.categorySelect = e || this.categorySelect, onChange: (e) => {
                                                let categoryId = e.target.value;
                                                this.state.selectedCategory = categories.filter(o => o.Id == categoryId)[0];
                                                this.setState(this.state);
                                            } },
                                            h("option", { key: "empty", value: "" }, "\u8BF7\u9009\u62E9\u7C7B\u522B"),
                                            categories.map(o => h("option", { key: o.Id, value: o.Id }, o.Name))))),
                                h("div", { className: "form-group" },
                                    h("div", { className: "col-sm-10 col-sm-offset-2" },
                                        h("label", { className: "radio-inline" },
                                            h("input", { type: "radio", checked: isInclude, onChange: (e) => {
                                                    this.state.isInclude = e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            "\u5305\u542B"),
                                        h("label", { className: "radio-inline" },
                                            h("input", { type: "radio", checked: !isInclude, onChange: (e) => {
                                                    this.state.isInclude = !e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            "\u6392\u9664"))))),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { name: "btnOK", type: "button", className: "btn btn-primary", onClick: () => this.confirm() }, "\u786E\u5B9A"))))));
        }
    }
    class ContentRuleDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        show(promotion, onConfirm) {
            this.onConfirm = onConfirm;
            this.state.promotion = promotion;
            this.countSelect.value = "";
            this.amountInput.value = "";
            this.setState(this.state);
            ui.showDialog(this.element);
        }
        hide() {
            ui.hideDialog(this.element);
        }
        confirm() {
            return __awaiter(this, void 0, void 0, function* () {
                let r = dilu.rules;
                this.validator.clearErrors();
                let checkResult = yield this.validator.check();
                if (!checkResult) {
                    return;
                }
                let { promotion } = this.state;
                let contentRule = {
                    Id: service_1.guid(),
                    LevelValue: promotion.Method == "Count" ?
                        Number.parseFloat(this.countSelect.value) :
                        Number.parseFloat(this.amountInput.value),
                    GivenValue: this.givenValue,
                    CreateDateTime: new Date(Date.now())
                };
                contentRule.Description = description(promotion, contentRule);
                this.onConfirm(contentRule);
                ui.hideDialog(this.element);
            });
        }
        componentDidMount() {
            let { required, numeric } = dilu.rules;
            dilu.FormValidator.errorClassName = "validationMessage";
            this.validator = new dilu.FormValidator(this.element, {
                name: "BuyCount", rules: [required()],
                condition: () => this.state.promotion.Method == "Count"
            }, {
                name: "BuyAmount", rules: [required(), numeric()],
                condition: () => this.state.promotion.Method == "Amount",
                errorElement: this.amountInputError
            });
            // this.validator.addFields(...this.validatorFields);
        }
        render() {
            let { promotion } = this.state;
            let method = promotion != null ? promotion.Method : "";
            return (h("form", { className: "modal fade", ref: (e) => this.element = e || this.element },
                h("div", { className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                h("span", { "aria-hidden": "true" }, "\u00D7"),
                                h("span", { className: "sr-only" }, "Close")),
                            h("h4", { className: "modal-title" }, this.title || '')),
                        h("div", { className: "modal-body form-horizontal" },
                            h("div", { className: "form-group", style: { display: method == "Count" ? null : 'none' } },
                                h("label", { className: "control-label col-sm-2" }, "*\u8D2D\u4E70\u6570\u91CF"),
                                h("div", { className: "col-sm-10" },
                                    h("select", { name: "BuyCount", "data-bind": "value: buyCount", className: "form-control", ref: (e) => this.countSelect = e || this.countSelect },
                                        h("option", { value: "" }, "\u8D2D\u4E70\u6570\u91CF"),
                                        h("option", { value: "1" }, "\u4EFB\u610F1\u4EF6"),
                                        h("option", { value: "2" }, "\u4EFB\u610F2\u4EF6"),
                                        h("option", { value: "3" }, "\u4EFB\u610F3\u4EF6"),
                                        h("option", { value: "4" }, "\u4EFB\u610F4\u4EF6"),
                                        h("option", { value: "5" }, "\u4EFB\u610F5\u4EF6"),
                                        h("option", { value: "6" }, "\u4EFB\u610F6\u4EF6"),
                                        h("option", { value: "7" }, "\u4EFB\u610F7\u4EF6"),
                                        h("option", { value: "8" }, "\u4EFB\u610F8\u4EF6")))),
                            h("div", { className: "form-group", style: { display: method == "Amount" ? null : 'none' } },
                                h("label", { className: "control-label col-sm-2" }, "*\u6D88\u8D39\u91D1\u989D"),
                                h("div", { className: "col-sm-10" },
                                    h("div", { className: "input-group" },
                                        h("input", { name: "BuyAmount", "data-bind": "value:buyAmount", className: "form-control", placeholder: "请输入消费金额", ref: (e) => this.amountInput = e || this.amountInput }),
                                        h("div", { className: "input-group-addon" }, "\u5143")),
                                    h("span", { className: dilu.FormValidator.errorClassName, ref: (e) => this.amountInputError = e || this.amountInputError }))),
                            this.givenValueElements),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { name: "btnOK", "data-bind": "", type: "button", className: "btn btn-primary", onClick: () => this.confirm() }, "\u786E\u5B9A"))))));
        }
    }
    /** 满赠优惠对话框 */
    class BuyGivenDialog extends ContentRuleDialog {
        constructor(props) {
            super(props);
            this.title = "满赠";
            this.state.givenProducts = [];
        }
        show(promotion, onConfirm) {
            this.state.givenProducts = [];
            super.show(promotion, onConfirm);
        }
        showProductSelector() {
            this.productSelectDialog.show((product) => {
                objectNames[product.Id] = product.Name;
                this.productNameInput.value = product.Name;
                this.productIdInput.value = product.Id;
            });
        }
        onGiveProductChanged() {
            if (this.productIdInput.value && this.productCountSelect.value) {
                this.addGivenProduct();
                this.productNameInput.value = "";
                this.productIdInput.value = "";
                this.productCountSelect.value = "";
            }
        }
        addGivenProduct() {
            let id = this.productIdInput.value;
            let quantity = Number.parseInt(this.productCountSelect.value);
            this.state.givenProducts.push({ id, quantity });
            this.setState(this.state);
        }
        removeGivenProduct(item) {
            let givenProducts = this.state.givenProducts.filter(o => o != item);
            this.state.givenProducts = givenProducts;
            this.setState(this.state);
        }
        get givenValue() {
            let givenValue = "";
            for (let i = 0; i < this.state.givenProducts.length; i++) {
                if (i > 0)
                    givenValue = givenValue + ",";
                var p = this.state.givenProducts[i];
                givenValue = givenValue + `${p.id}:${p.quantity}`;
            }
            return givenValue;
        }
        get validatorFields() {
            let r = dilu.rules;
            return [
                {
                    name: "ProductId",
                    errorElement: this.productNameError,
                    rules: [
                        r.custom(() => {
                            return this.state.givenProducts.length > 0;
                        }, "至少输入一个赠送商品")
                    ]
                }
            ];
        }
        get givenValueElements() {
            let givenProducts = this.state.givenProducts;
            let shopping = this.props.page.createService(shopping_1.ShoppingService);
            return [
                h("div", { key: "buyGivenElements", className: "form-group" },
                    h("label", { "data-bind": "text:ko.unwrap($index) == 0 ? '*赠送商品' : ''", className: "control-label col-sm-2" }, "*\u8D60\u9001\u5546\u54C1"),
                    givenProducts.map((o, i) => h("div", { key: o.id, className: i == 0 ? "col-sm-10" : 'col-sm-10 col-sm-offset-2' },
                        h("div", { className: "row", style: { paddingTop: 8, paddingBottom: 12 } },
                            h("div", { className: "col-sm-8", style: { paddingRight: 0 } },
                                h("input", { className: "form-control", readOnly: true, value: objectNames[o.id] })),
                            h("div", { className: "col-sm-4", style: { paddingLeft: 0 } },
                                h("div", { className: "input-group" },
                                    h("input", { className: "form-control", value: `${o.quantity}件`, readOnly: true, ref: (e) => this.quantityInput = e || this.quantityInput }),
                                    h("span", { className: "input-group-btn" },
                                        h("button", { className: "btn btn-default", type: "button", onClick: () => this.removeGivenProduct(o) },
                                            h("i", { className: "icon-minus" })))))))),
                    h("div", { className: givenProducts.length == 0 ? "col-sm-10" : 'col-sm-10 col-sm-offset-2' },
                        h("div", { className: "row" },
                            h("div", { className: "col-sm-8", style: { paddingRight: 0 } },
                                h("div", { className: "input-group" },
                                    h("input", { placeholder: "请选择赠送的商品", className: "form-control", readOnly: true, ref: (e) => this.productNameInput = e || this.productNameInput }),
                                    h("input", { type: "hidden", placeholder: "请输入赠送的商品编号", onChange: () => this.onGiveProductChanged(), readOnly: true, ref: (e) => this.productIdInput = e || this.productIdInput }),
                                    h("span", { className: "input-group-btn" },
                                        h("button", { className: "btn btn-default", type: "button", onClick: () => this.showProductSelector() },
                                            h("i", { className: "icon-cog" })))),
                                h("span", { className: "validationMessage", ref: (e) => this.productNameError = e || this.productNameError })),
                            h("div", { className: "col-sm-4", style: { paddingLeft: 0 } },
                                h("select", { "data-bind": "value:quantity", className: "form-control", style: { height: 34 }, onChange: () => this.onGiveProductChanged(), ref: (e) => this.productCountSelect = e || this.productCountSelect },
                                    h("option", { value: "" }, "\u8D60\u9001\u6570\u91CF"),
                                    h("option", { value: "1" }, "1\u4EF6"),
                                    h("option", { value: "2" }, "2\u4EF6"),
                                    h("option", { value: "3" }, "3\u4EF6"),
                                    h("option", { value: "4" }, "4\u4EF6"),
                                    h("option", { value: "5" }, "5\u4EF6")))))),
                h(productSelectDialog_1.ProductSelectDialog, { key: "productSelectDialog", shopping: shopping, ref: (e) => this.productSelectDialog = e || this.productSelectDialog })
            ];
        }
    }
    class BuyReduceDialog extends ContentRuleDialog {
        get validatorFields() {
            let { required } = dilu.rules;
            return [
                { name: "ReduceAmount", rules: [required()], errorElement: this.reduceInputError }
            ];
        }
        get givenValue() {
            return this.reduceInput.value;
        }
        constructor(props) {
            super(props);
            this.givenValueElements = [
                h("div", { key: "reduceAmount", className: "form-group" },
                    h("label", { className: "control-label col-sm-2" }, "*\u51CF\u514D\u91D1\u989D"),
                    h("div", { className: "col-sm-10" },
                        h("div", { className: "input-group" },
                            h("input", { name: "ReduceAmount", "data-bind": "value:reduceAmount", className: "form-control", placeholder: "请输入减免金额", ref: (e) => this.reduceInput = e || this.reduceInput }),
                            h("div", { className: "input-group-addon" }, "\u5143")),
                        h("span", { className: "validationMessage", ref: (e) => this.reduceInputError = e || this.reduceInputError })))
            ];
        }
    }
    class BuyDiscountDialog extends ContentRuleDialog {
        get validatorFields() {
            return [];
        }
        get givenValue() {
            return `${this.mainSelect.value}.${this.minorSelect.value}`;
        }
        get givenValueElements() {
            return [
                h("div", { key: "buyDiscountElement", className: "form-group" },
                    h("label", { className: "control-label col-sm-2" }, "*\u6253\u6298"),
                    h("div", { className: "col-sm-10" },
                        h("div", { className: "row" },
                            h("div", { className: "col-xs-6", style: { paddingRight: 0 } },
                                h("select", { "data-bind": "value:pricePercentMain", className: "form-control", ref: (e) => this.mainSelect = e || this.mainSelect },
                                    h("option", { value: "9" }, "9"),
                                    h("option", { value: "8" }, "8"),
                                    h("option", { value: "7" }, "7"),
                                    h("option", { value: "6" }, "6"),
                                    h("option", { value: "5" }, "5"),
                                    h("option", { value: "4" }, "4"),
                                    h("option", { value: "3" }, "3"),
                                    h("option", { value: "2" }, "2"),
                                    h("option", { value: "1" }, "1"))),
                            h("div", { className: "col-xs-6", style: { paddingLeft: 0 } },
                                h("div", { className: "input-group" },
                                    h("select", { "data-bind": "value:pricePercentMinor", className: "form-control", ref: (e) => this.minorSelect = e || this.minorSelect },
                                        h("option", { value: "0" }, "0"),
                                        h("option", { value: "1" }, "1"),
                                        h("option", { value: "2" }, "2"),
                                        h("option", { value: "3" }, "3"),
                                        h("option", { value: "4" }, "4"),
                                        h("option", { value: "5" }, "5"),
                                        h("option", { value: "6" }, "6"),
                                        h("option", { value: "7" }, "7"),
                                        h("option", { value: "8" }, "8"),
                                        h("option", { value: "9" }, "9")),
                                    h("div", { className: "input-group-addon" }, "\u6298"))))))
            ];
        }
    }
    class PromotionRangeComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { rules: this.props.rules || [] };
        }
        newCategoryRule() {
            this.categoryInputDialog.show((category, isInclude) => {
                let rule = {
                    Id: service_1.guid(),
                    ObjectName: category.Name,
                    ObjectId: category.Id,
                    ObjectType: 'Category',
                    // PromotionId: promotion.Id,
                    CollectionType: isInclude ? 'Include' : 'Exclude',
                    CreateDateTime: new Date(Date.now())
                };
                // promotion.PromotionRangeRules.push(rule);
                this.state.rules.push(rule);
                this.setState(this.state);
            });
        }
        newBrandRule() {
            this.brandInputDialog.show((brand, isInclude) => {
                let rule = {
                    Id: service_1.guid(),
                    ObjectName: brand.Name,
                    ObjectId: brand.Id,
                    ObjectType: 'Brand',
                    // PromotionId: promotion.Id,
                    CollectionType: isInclude ? 'Include' : 'Exclude',
                    CreateDateTime: new Date(Date.now())
                };
                this.state.rules.push(rule);
                this.setState(this.state);
            });
        }
        newProductRule() {
            this.productInputDialog.show((product, isInclude) => {
                let rule = {
                    Id: service_1.guid(),
                    ObjectName: product.Name,
                    ObjectId: product.Id,
                    ObjectType: 'Product',
                    // PromotionId: promotion.Id,
                    CollectionType: isInclude ? 'Include' : 'Exclude',
                    CreateDateTime: new Date(Date.now())
                };
                this.state.rules.push(rule);
                this.setState(this.state);
            });
        }
        render() {
            let { isAll, rules } = this.state;
            let page = this.props.page;
            let shopping = page.createService(shopping_1.ShoppingService);
            return [
                h("table", { key: "main", border: 1, className: "table table-striped table-bordered table-hover", style: { borderCollapse: 'collapse' } },
                    h("thead", null,
                        h("tr", null,
                            h("th", { colSpan: 4 }, "\u4F18\u60E0\u8303\u56F4")),
                        h("tr", null,
                            h("th", { style: { textAlign: 'center', width: 60 } }, "\u7C7B\u578B"),
                            h("th", { style: { textAlign: 'center' } }, "\u540D\u79F0"),
                            h("th", { style: { textAlign: 'center', width: 160 } }, "\u64CD\u4F5C"))),
                    h("tbody", null,
                        h("tr", { style: { display: rules.length > 0 ? 'none' : null } },
                            h("td", { colSpan: 4, style: { border: "0px", textAlign: 'center' } },
                                h("div", { style: { padding: '50px 0px 50px 0px' } }, "\u6682\u65E0\u6570\u636E"))),
                        rules.map((r, i) => h("tr", { key: `range${i}` },
                            h("td", null, objectTypeTexts[r.ObjectType] || r.ObjectType),
                            h("td", null, r.ObjectName),
                            h("td", { style: { textAlign: 'center' } },
                                h("label", { className: "switch" },
                                    h("input", { checked: r.CollectionType == "Include", type: "checkbox", className: "ace ace-switch ace-switch-5", onChange: (e) => {
                                            e.target.checked ? r.CollectionType = "Include" : r.CollectionType = "Exclude";
                                            this.setState(this.state);
                                        } }),
                                    h("span", { className: "lbl middle", "data-lbl": "\u5305\u62EC \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 \u6392\u9664" })),
                                h("button", { className: "btn btn-minier btn-danger", style: { marginLeft: 8 }, onClick: () => {
                                        this.state.rules = rules.filter(item => item != r);
                                        this.setState(this.state);
                                    } },
                                    h("i", { className: "icon-trash" })))))),
                    h("tfoot", null,
                        h("tr", null,
                            h("td", { colSpan: 3 },
                                h("div", { className: "pull-left" },
                                    h("label", null,
                                        h("input", { checked: isAll, type: "checkbox", onChange: (e) => isAll = e.target.checked }),
                                        "\u00A0 \u5168\u573A\u4F18\u60E0")),
                                h("div", { className: "pull-right" },
                                    h("button", { className: "btn btn-primary btn-sm", onClick: () => this.newProductRule() }, "\u6DFB\u52A0\u5546\u54C1"),
                                    h("button", { className: "btn btn-primary btn-sm", onClick: () => this.newBrandRule() }, "\u6DFB\u52A0\u54C1\u724C"),
                                    h("button", { className: "btn btn-primary btn-sm", onClick: () => this.newCategoryRule() }, "\u6DFB\u52A0\u54C1\u7C7B")))))),
                h(ProductInputDialog, { key: "productInputDialog", page: page, ref: (e) => this.productInputDialog = e || this.productInputDialog }),
                h(BrandInputDialog, { key: "brandInputDialog", page: page, ref: (e) => this.brandInputDialog = e || this.brandInputDialog }),
                h(CategoryInputDialog, { key: "categoryInputDialog", page: page, ref: (e) => this.categoryInputDialog = e || this.categoryInputDialog }),
                h(productSelectDialog_1.ProductSelectDialog, { key: "productSelectDialog", shopping: shopping, ref: (e) => this.productSelectDialog = e || this.productSelectDialog })
            ];
        }
    }
    exports.PromotionRangeComponent = PromotionRangeComponent;
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            application_1.default.loadCSS(page.name);
            let activityId = page.data.id;
            let activity = page.createService(activity_1.ActivityService);
            let { promotions } = yield Promise.all([activity.promotions(activityId)])
                .then(arr => ({
                promotions: arr[0]
            }));
            ReactDOM.render(h(ActivityEditPage, { activityId: activityId, promotions: promotions, page: page }), page.element);
        });
    }
    exports.default = default_1;
});
