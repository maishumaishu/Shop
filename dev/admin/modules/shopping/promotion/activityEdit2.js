define(["require", "exports", "knockout", "knockout.validation", "admin/services/activity", "admin/services/shopping", "admin/controls/productSelectDialog", "application"], function (require, exports, ko, validation, activity_1, shopping_1, productSelectDialog_1, application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let productSelectorDialog;
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        let activity = page.createService(activity_1.ActivityService);
        requirejs([`text!modules/shopping/promotion/activityEdit.html`], (html) => {
            page.element.innerHTML = html;
            let dlg_product = page.element.querySelector('[name="dlg_product"]');
            renderProductRuleDialog(dlg_product, page);
            let topbarElement = page.element.querySelector('.nav-tabs');
            renderTopbar(topbarElement);
            //renderTopbar
            let productSelectorElement = document.createElement('div');
            page.element.appendChild(productSelectorElement);
            ReactDOM.render(h(productSelectDialog_1.ProductSelectDialog, { ref: (e) => productSelectorDialog = e || productSelectorDialog, shopping: shopping }), productSelectorElement);
            page_load(page, page.data);
        });
        function page_load(page, args) {
            var activityId = args.id;
            var model = new Model(page, activityId);
            Promise.all([shopping.categories(), shopping.brands()]).then(result => {
                result[0].unshift({ Name: '请选择类别', Id: '' });
                result[1].dataItems.unshift({ Name: '请选择品牌', Id: '' });
                model.categories(result[0]);
                model.brands(result[1].dataItems);
                ko.applyBindings(model, page.element);
            });
            activity.promotions(activityId).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    var content = new PromotionContent(data[i].Id, page);
                    content.type(data[i].Type);
                    content.method(data[i].Method);
                    for (var j = 0; j < data[i].PromotionContentRules.length; j++) {
                        var item = data[i].PromotionContentRules[j];
                        var content_rule = content.newRule(data[i].Type, data[i].Method, item.Description);
                        content_rule.id = item.Id;
                        content_rule.levelValue(item.LevelValue);
                        content.rules.push(content_rule);
                    }
                    var range = new PromotionRange(data[i].Id, model);
                    for (var j = 0; j < data[i].PromotionRangeRules.length; j++) {
                        let item = data[i].PromotionRangeRules[j];
                        var range_rule = range.newRule(item.Id, item.ObjectType, item.ObjectId, item.ObjectName, item.CollectionType, item.PromotionId);
                        range.rules.push(range_rule);
                    }
                    range.allProducts(data[i].IsAll);
                    model.promotions.push({ id: data[i].Id, content: content, range: range, createDateTime: data[i].CreateDateTime });
                }
            });
        }
    }
    exports.default = default_1;
    var promotionMethods = {
        amount: 'Amount',
        count: 'Count'
    };
    var promotionMethodTexts = {
        Amount: '按商品总金额',
        Count: '按商品总数量'
    };
    var promotionTypes = {
        amount: 'Reduce',
        product: 'Given',
        discount: 'Discount'
    };
    var promotionTypeTexts = {
        Reduce: '满减',
        Given: '满赠',
        Discount: '满折'
    };
    class PromotionContentRule {
        constructor(promotion, givenType) {
            this.givenValue = ko.observable();
            this.promotion = promotion;
            this.buyCount = ko.observable().extend({
                required: {
                    onlyIf: $.proxy(function () {
                        return ko.unwrap(this.type) == promotionMethods.count;
                    }, promotion)
                }
            });
            this.buyAmount = ko.observable().extend({
                required: {
                    onlyIf: $.proxy(function () {
                        return ko.unwrap(this.type) == promotionMethods.amount;
                    }, promotion)
                }
            });
            ///this.method() == promotionMethods.amount ? promotionRule.buyAmount() : promotionRule.buyCount();
            this.levelValue = ko.computed({
                read: () => this.promotion.method() == promotionMethods.amount ? this.buyAmount() : this.buyCount(),
                write: (value) => {
                    this.promotion.method() == promotionMethods.amount ? this.buyAmount(value) : this.buyCount(value);
                }
            });
            this.givenType = givenType;
            this.typeText = ko.computed(() => promotionTypeTexts[this.givenType]);
        }
    }
    class PromotionContent {
        constructor(promotionId, page) {
            this['type'] = ko.observable(promotionTypes.product);
            this.typeText = ko.computed(() => promotionTypeTexts[this.type()]);
            this.rules = ko.observableArray();
            this.newRule = (method, givenType, description) => {
                var rule = new PromotionContentRule(this, givenType);
                rule.givenType = givenType;
                rule.method = method;
                rule.description = ko.unwrap(description);
                return rule;
            };
            this.removeRule = (item) => {
                this.sv_activity.deleteContentRule(item.id).then(function () {
                    item.promotion.rules.remove(item);
                });
            };
            this.method = ko.observable(promotionMethods.amount);
            this.methodText = ko.computed(() => promotionMethodTexts[this.method()]);
            this.promotionId = promotionId;
            this.productGivenVals = [];
            var p = this;
            p.productGivenRule = this.createPromotionRule(promotionTypes.product);
            p.amountReduceRule = this.createPromotionRule(promotionTypes.amount);
            p.amountDiscountRule = this.createPromotionRule(promotionTypes.discount);
            //TODO:改名
            this.val1 = validation.group(p.productGivenRule);
            this.val2 = validation.group(p.amountReduceRule);
            this.val3 = validation.group(p.amountDiscountRule);
            this.sv_activity = page.createService(activity_1.ActivityService);
            this.shopping = page.createService(shopping_1.ShoppingService);
            this.page = page;
        }
        addRule(promotionRule) {
            /// <param name="promotionRule" type="PromotionContentRule"/>
            var method = ko.unwrap(promotionRule.method);
            var rule = this.newRule(method, ko.unwrap(promotionRule.givenType), ko.unwrap(promotionRule.description));
            var value = ko.unwrap(promotionRule.givenValue);
            var levelValue = ko.unwrap(promotionRule.levelValue);
            var givenType = ko.unwrap(promotionRule.givenType);
            var givenValue = ko.unwrap(promotionRule.givenValue);
            rule.levelValue(levelValue);
            var self = this;
            this.sv_activity.addContentRule(levelValue, givenType, givenValue, this.promotionId, rule.description)
                .then((data) => {
                rule['id'] = data.Id;
                self.rules.push(rule);
            });
        }
        createPromotionRule(type) {
            var obj = createPromotionRule(this, type);
            return obj;
        }
        /**
         * 满赠
         * @param promotion
         */
        newBuyGiven(promotion) {
            promotion.val1.showAllMessages(false);
            showInputDialog(this.page, 'dlg_productGiven', '满赠', () => {
                if (!promotion.productGivenRule['isValid']()) {
                    promotion.val1.showAllMessages();
                    for (var i = 0; i < promotion.productGivenVals.length; i++) {
                        promotion.productGivenVals[i].showAllMessages();
                    }
                    return Promise.reject({});
                }
                var ids = '';
                var products = promotion.productGivenRule.givenProducts();
                for (var i = 0; i < products.length; i++) {
                    if (i > 0)
                        ids = ids + ',';
                    ids = ids + "G'" + ko.unwrap(products[i].id) + "'";
                }
                let args = new wuzhui.DataSourceSelectArguments();
                args.filter = 'Id in {' + ids + '}';
                return this.shopping.products(args).then((data) => {
                    return data.dataItems;
                }).then(data => {
                    var names = {};
                    for (var i = 0; i < data.length; i++) {
                        names[data[i].Id] = data[i].Name;
                    }
                    for (var i = 0; i < products.length; i++) {
                        var id = ko.unwrap(products[i].id);
                        products[i].name(names[id]);
                    }
                    promotion.addRule(promotion.productGivenRule);
                });
            });
        }
        /**
         * 满减
         * @param promotion
         */
        newBuyReduce(promotion) {
            promotion.val2.showAllMessages(false);
            showInputDialog(this.page, 'dlg_amountReduce', '满减', () => {
                if (!this.amountReduceRule['isValid']()) {
                    promotion.val2.showAllMessages();
                    return Promise.reject({});
                }
                promotion.addRule(promotion.amountReduceRule);
                return Promise.resolve();
            });
        }
        newBuyDiscount(promotion) {
            promotion.val3.showAllMessages(false);
            showInputDialog(this.page, 'dlg_amountDiscount', '满折', function () {
                if (!promotion.amountDiscountRule.isValid()) {
                    promotion.val3.showAllMessages();
                    return Promise.reject({});
                }
                promotion.addRule(promotion.amountDiscountRule);
                return Promise.resolve();
            });
        }
        showNewRuleDialog() {
            switch (this.type()) {
                case promotionTypes.amount:
                    this.newBuyReduce(this);
                    break;
                case promotionTypes.discount:
                    this.newBuyDiscount(this);
                    break;
                case promotionTypes.product:
                    this.newBuyGiven(this);
                    break;
            }
        }
    }
    class ProductPromotionContentRule extends PromotionContentRule {
        constructor(promotion, givenType) {
            super(promotion, givenType);
            this.addGivenProduct = () => {
                var item = {
                    id: ko.observable().extend({ required: true }),
                    name: ko.observable(),
                    quantity: ko.observable()
                };
                this.givenProducts.push(item);
                var val = validation.group(item);
                this.promotion.productGivenVals.push(val);
            };
            this.removeGivenProduct = (item) => {
                this.givenProducts.remove(item);
            };
            this.givenProducts = ko.observableArray();
            this.description = ko.computed(() => {
                var str = '即可获赠'; // chitu.Utility.format('即可获赠 “{0}” {1} 件', ko.unwrap(this.givenProduct.name()), ko.unwrap(this.givenProduct.quantity()));
                var products = this.givenProducts();
                for (var i = 0; i < products.length; i++) {
                    if (i > 0)
                        str = str + "，";
                    let name = ko.unwrap(products[i].name);
                    let count = ko.unwrap(products[i].quantity);
                    str = str + ` “${name}” ${count} 件`;
                }
                return getConditionText(this) + str;
            });
            this.givenValue = ko.computed(() => {
                var str = '';
                var products = this.givenProducts();
                for (var i = 0; i < products.length; i++) {
                    if (i > 0)
                        str = str + ',';
                    str = str + ko.unwrap(products[i].id) + ':' + ko.unwrap(products[i].quantity);
                }
                return str;
            });
            this.addGivenProduct();
        }
    }
    class AmountPromotionContentRule extends PromotionContentRule {
        constructor(promotion, givenType) {
            super(promotion, givenType);
            this.reduceAmount = ko.observable().extend({ required: true });
            this.givenValue = ko.computed(() => this.reduceAmount() == null ? '' : this.reduceAmount().toString());
            this.description = ko.computed(() => {
                // let str = new Number(this.reduceAmount())['toFormattedString']('￥{0:C2}');
                let str = `￥${new Number(this.reduceAmount()).toFixed(2)}`;
                var given_text = `即减 ${str} 元`;
                return getConditionText(this) + given_text;
            });
        }
    }
    class DiscountPromotionContentRule extends PromotionContentRule {
        constructor(promotion, givenType) {
            super(promotion, givenType);
            this.pricePercentMain = ko.observable();
            this.pricePercentMinor = ko.observable();
            this.description = ko.computed(() => {
                var given_text = '打 ' + this.pricePercentMain();
                if (this.pricePercentMinor())
                    given_text = given_text + '.' + this.pricePercentMinor();
                return getConditionText(this) + given_text + '折';
            });
            this.givenValue = ko.computed(() => this.pricePercentMain() + '.' + this.pricePercentMinor());
        }
    }
    function createPromotionRule(promotion, type1) {
        var baseRule = new PromotionContentRule(promotion, type1);
        var extend = {};
        switch (type1) {
            case promotionTypes.product:
                extend = new ProductPromotionContentRule(promotion, type1);
                break;
            case promotionTypes.amount:
                extend = new AmountPromotionContentRule(promotion, type1);
                break;
            case promotionTypes.discount:
                extend = new DiscountPromotionContentRule(promotion, type1);
                break;
        }
        return extend;
    }
    function getConditionText(promotionRule) {
        var promotion = promotionRule.promotion;
        var condition_text;
        if (promotion.method() == promotionMethods.count) {
            condition_text = `购买指定商品任意 ${ko.unwrap(promotionRule.buyCount)} 件`;
        }
        else if (promotion.method() == promotionMethods.amount) {
            condition_text = `购买指定商品满 ￥${new Number(promotionRule.buyAmount()).toFixed(2)} 元,`;
        }
        return condition_text;
    }
    class PromotionRange {
        constructor(promotionId, model) {
            this.addRule = (type, name, id, collectionType, promotionId) => {
                var self = this;
                return this.sv_activity.addRangeRule(id, name, type, collectionType, promotionId)
                    .then((data) => {
                    var rule = this.newRule(data.Id, type, id, name, collectionType, promotionId);
                    self.rules.push(rule);
                });
            };
            this.removeRule = (item) => {
                return this.sv_activity.deleteRangeRule(ko.unwrap(item.id))
                    .then(() => {
                    this.rules.remove(item);
                });
            };
            this.newProductRule = (self) => {
                this.product_val.showAllMessages(false);
                showInputDialog(this.page, 'dlg_product', '添加商品', () => {
                    if (!self.product.isValid()) {
                        self.product_val.showAllMessages();
                        return Promise.reject({});
                    }
                    return this.shopping.product(self.product.id()).then((product) => {
                        var name = ko.unwrap(product.Name);
                        var productId = ko.unwrap(product.Id);
                        var collectionType = ko.unwrap(self.product.collectionType);
                        self.addRule('Product', name, productId, collectionType, self.promotionId);
                    });
                });
            };
            this.newBrandRule = () => {
                this.brand_val.showAllMessages(false);
                showInputDialog(this.page, 'dlg_brand', '添加品牌', () => {
                    if (!this.brand.isValid()) {
                        this.brand_val.showAllMessages();
                        return Promise.reject({});
                    }
                    var brandName;
                    var brandId = this.brand.id();
                    var brands = this.model.brands();
                    for (var i = 0; i < brands.length; i++) {
                        if (brandId == brands[i].Id) {
                            brandName = brands[i].Name;
                            break;
                        }
                    }
                    this.addRule('Brand', brandName, brandId, ko.unwrap(this.brand.collectionType), this.promotionId);
                });
            };
            this.newCategoryRule = (self) => {
                this.category_val['showAllMessages'](false);
                showInputDialog(this.page, 'dlg_category', '添加类别', () => {
                    if (!this.category.isValid()) {
                        this.category_val.showAllMessages();
                        return Promise.reject({});
                    }
                    var categoryName;
                    var categoryId = self.category.id();
                    debugger;
                    var categories = this.model.categories();
                    for (var i = 0; i < categories.length; i++) {
                        if (categoryId == categories[i].Id) {
                            categoryName = categories[i].Name;
                            break;
                        }
                    }
                    this.addRule('Category', categoryName, categoryId, ko.unwrap(self.category.collectionType), self.promotionId);
                });
            };
            this.promotionId = promotionId;
            this.rules = ko.observableArray();
            this.allProducts = ko.observable(false);
            this.product = {
                id: ko.observable().extend({ required: true }),
                collectionType: ko.observable('Include'),
                showDialog: () => {
                    let productSelected = (product) => {
                        this.product.id(product.Id);
                    };
                    // selected={(product: Product) => Promise.resolve(true)}
                    productSelectorDialog.show(productSelected);
                }
            };
            this.brand = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') };
            this.category = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') };
            this.product_val = validation.group(this.product);
            this.brand_val = validation.group(this.brand);
            this.category_val = validation.group(this.category);
            this.model = model;
            var self = this;
            this.allProducts.subscribe((value) => {
                this.sv_activity.changeIsAll(self.promotionId, value);
            });
            this.page = model.page;
            this.sv_activity = this.page.createService(activity_1.ActivityService);
            this.shopping = this.page.createService(shopping_1.ShoppingService);
        }
        newRule(id, _type, objectId, objectName, collectionType, promotionId) {
            var rule = new PromotionRangeRule(id, _type, objectId, objectName, collectionType, this.sv_activity);
            return rule;
        }
    }
    class PromotionRangeRule {
        constructor(id, _type, objectId, objectName, collectionType, sv_activity) {
            this.id = id;
            this.objectId = objectId;
            this.type = _type;
            this.objectId = objectId;
            this.objectName = objectName;
            this.typeText = _type == 'Product' ? '商品' : _type == 'Brand' ? '品牌' : '类别',
                this.isInclude = ko.observable(collectionType == 'Include');
            this.collectionType = ko.observable(collectionType);
            this.isInclude.subscribe((value) => {
                var type = value ? 'Include' : 'Exclude';
                this.collectionType(value ? 'Include' : 'Exclude');
                sv_activity.changeCollectionType(ko.unwrap(this.id), type);
            }, this);
        }
    }
    class Promotion {
    }
    class Model {
        constructor(page, activityId) {
            this.promotions = ko.observableArray();
            this.categories = ko.observableArray();
            this.brands = ko.observableArray();
            this.promotion = {
                method: ko.observable('Amount'),
                type: ko.observable('Given')
            };
            if (page == null)
                throw new Error('Argument "page" is null.');
            this.page = page;
            this.activityId = activityId;
            let sv_activity = page.createService(activity_1.ActivityService);
            this.createPromotion = () => {
                var $dlg = this.page.element.querySelector('[name="dlg_promotion"]');
                showDialog($dlg, '添加优惠', () => {
                    return sv_activity.addPromotion(this.activityId, this.promotion.type(), this.promotion.method())
                        .then((data) => {
                        var p = new Promotion();
                        p.id = data.Id;
                        p.content = new PromotionContent(data.Id, page);
                        p.content.method(this.promotion.method());
                        p.content.type(this.promotion.type());
                        p.range = new PromotionRange(data.Id, this);
                        this.promotions.push(p);
                    });
                });
            };
            this.removePromotion = (item) => {
                return sv_activity.deletePromotion(ko.unwrap(item.id)).then(() => {
                    this.promotions.remove(item);
                });
            };
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
    function showInputDialog(page, name, title, ok_callback) {
        let dialogElement = page.element.querySelector(`[name=${name}]`);
        showDialog(dialogElement, title, ok_callback);
    }
    function renderProductRuleDialog(element, page) {
        let productSelector;
        let shopping = page.createService(shopping_1.ShoppingService);
        ReactDOM.render([
            h("div", { key: "productRuleDialog", className: "modal-dialog" },
                h("div", { className: "modal-content" },
                    h("div", { className: "modal-header" },
                        h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                            h("span", { "aria-hidden": "true" }, "\u00D7"),
                            h("span", { className: "sr-only" }, "Close")),
                        h("h4", { className: "modal-title" }, "\u00A0")),
                    h("div", { className: "modal-body" },
                        h("div", { className: "form-horizontal" },
                            h("div", { className: "form-group" },
                                h("label", { className: "control-label col-sm-2" }, "*\u4EA7\u54C1\u7F16\u53F7"),
                                h("div", { className: "col-sm-10" },
                                    h("div", { className: "input-group" },
                                        h("input", { "data-bind": "value:id", className: "form-control", placeholder: "请输入产品编号" }),
                                        h("span", { className: "input-group-btn" },
                                            h("button", { name: "btnSelectProduct", className: "btn btn-default", type: "button", "data-bind": "click:showDialog" },
                                                h("i", { className: "icon-cog" })))))),
                            h("div", { className: "form-group" },
                                h("div", { className: "col-sm-10 col-sm-offset-2" },
                                    h("label", { className: "radio-inline" },
                                        h("input", { "data-bind": "checked:collectionType,attr:{name:'productType'+ ($index())}", type: "radio", value: "Include" }),
                                        "\u5305\u542B"),
                                    h("label", { className: "radio-inline" },
                                        h("input", { "data-bind": "checked:collectionType,attr:{name:'productType'+ ($index())}", type: "radio", value: "Exclude" }),
                                        "\u6392\u9664"))))),
                    h("div", { className: "modal-footer" },
                        h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                        h("button", { name: "btnOK", "data-bind": "", type: "button", className: "btn btn-primary" }, "\u786E\u5B9A")))),
            h(productSelectDialog_1.ProductSelectDialog, { key: "productSelectorDialog", ref: (e) => productSelector = e || productSelector, shopping: shopping })
        ], element);
        // setTimeout(() => {
        //     let btn = element.querySelector('[name="btnSelectProduct"]') as HTMLButtonElement;
        //     debugger;
        //     btn.onclick = function () {
        //         alert('hello');
        //     }
        // }, 1000);
    }
    function renderTopbar(element) {
        ReactDOM.render([
            h("li", { key: "back", className: "pull-right" },
                h("button", { className: "btn btn-sm btn-primary", onClick: () => application_1.default.back() },
                    h("i", { className: "icon-reply" }),
                    h("span", null, "\u8FD4\u56DE"))),
            h("li", { key: "delete", className: "pull-right" },
                h("div", { className: "btn-group" },
                    h("button", { type: "button", className: "btn btn-sm btn-primary dropdown-toggle", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" },
                        h("i", { className: "icon-remove" }),
                        h("span", { style: { paddingRight: 4 } }, "\u5220\u9664"),
                        h("i", { className: "caret" })),
                    h("ul", { "data-bind": "foreach:promotions", className: "dropdown-menu" },
                        h("li", null,
                            h("a", { "data-bind": "click:$parent.removePromotion, text:'第' + (ko.unwrap($index) + 1) + '条' ", href: "#" }))))),
            h("li", { key: "add", className: "pull-right" },
                h("button", { "data-bind": "click:createPromotion", href: "javascript:", className: "btn btn-sm btn-primary" },
                    h("i", { className: "icon-plus" }),
                    h("span", null, "\u6DFB\u52A0")))
        ], element);
    }
});
