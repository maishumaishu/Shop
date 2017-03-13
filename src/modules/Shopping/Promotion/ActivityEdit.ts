
import shopping = require('services/Shopping');
import ko = require('knockout');
import validation = require('knockout.validation');
import sv_activity = require('services/Activity');


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

var services = window['services'];
var site = window['site'];

function showDialog($dlg, title, ok_callback) {
    //var $dlg = $(event.target).parents('div[name="promotion"]').find('[name="' + name + '"]');
    //var $dlg = $(page.node()).find('[name="' + name + '"]');
    if (title)
        $dlg.find('.modal-title').text(title);

    $dlg.find('[name="btnOK"]')[0].onclick = function () {
        var result = ok_callback($dlg);
        if (result != null && $.isFunction(result.done)) {
            result.done(function () {
                $dlg.modal('hide');
            });
        }
        else {
            $dlg.modal('hide')
        }
    };

    $dlg.find('.modal-footer').css('margin-top', '0px');

    $dlg.modal();
    window.setTimeout(function () {
        var $ctrl = $dlg.find('input:visible,select:visible').first();
        if ($ctrl.attr('type') != 'radio')
            $ctrl.focus();

    }, 500);
}

function showInputDialog(name, title, ok_callback) {
    var $dlg = $(event.target).parents('div[name="promotion"]').find('[name="' + name + '"]');
    showDialog($dlg, title, ok_callback);
}

function getConditionText(promotionRule: PromotionContentRule) {
    /// <param name="promotionRule" type="PromotionContentRule"/>
    var promotion = promotionRule.promotion;
    var condition_text;
    if (promotion.method() == promotionMethods.count) {
        condition_text = `购买指定商品任意 ${ko.unwrap(promotionRule.buyCount)} 件`//chitu.Utility.format('购买指定商品任意 {0} 件,', <any>ko.unwrap(promotionRule.buyCount));
    }
    else if (promotion.method() == promotionMethods.amount) {
        condition_text = `购买指定商品满 ${new Number(promotionRule.buyAmount())['toFormattedString']('￥{0:C2}')} 元,`;
    }
    return condition_text;
}

function createPromotionRule(promotion, type1): PromotionContentRule {
    /// <param name="promotion" type="PromotionContent"/>

    var baseRule = new PromotionContentRule(promotion, type1);
    var extend: any = {
    };
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

class PromotionContent {
    method: KnockoutObservable<string>
    methodText: KnockoutComputed<string>
    'type': KnockoutObservable<string> = ko.observable(promotionTypes.product)
    typeText: KnockoutComputed<string> = ko.computed(() => promotionTypeTexts[this.type()])
    rules: KnockoutObservableArray<PromotionContentRule> = ko.observableArray<PromotionContentRule>()
    promotionId: string
    productGivenVals: Array<any>
    productGivenRule: ProductPromotionContentRule
    amountReduceRule: AmountPromotionContentRule
    amountDiscountRule: DiscountPromotionContentRule
    val1: KnockoutValidationErrors
    val2: KnockoutValidationErrors
    val3: KnockoutValidationErrors

    constructor(promotionId: string) {
        this.method = ko.observable(promotionMethods.amount);
        this.methodText = ko.computed(() => promotionMethodTexts[this.method()]);

        //this.type = ko.observable(promotionTypes.product);
        //this.typeText = ko.computed(() => promotionTypeTexts[this.type()]);

        //this.rules = ko.observableArray<PromotionContentRule>();
        this.promotionId = promotionId;

        this.productGivenVals = [];

        var p = this;
        p.productGivenRule = <ProductPromotionContentRule>this.createPromotionRule(promotionTypes.product);
        p.amountReduceRule = <AmountPromotionContentRule>this.createPromotionRule(promotionTypes.amount);
        p.amountDiscountRule = <DiscountPromotionContentRule>this.createPromotionRule(promotionTypes.discount);

        //TODO:改名
        this.val1 = validation.group(p.productGivenRule);
        this.val2 = validation.group(p.amountReduceRule);
        this.val3 = validation.group(p.amountDiscountRule);
    }

    addRule = (promotionRule: PromotionContentRule) => {
        /// <param name="promotionRule" type="PromotionContentRule"/>
        var method = ko.unwrap(promotionRule.method);
        var rule = this.newRule(method, ko.unwrap(promotionRule.givenType), ko.unwrap(promotionRule.description));

        var value = ko.unwrap(promotionRule.givenValue);
        var levelValue = ko.unwrap(promotionRule.levelValue);
        var givenType = ko.unwrap(promotionRule.givenType);
        var givenValue = ko.unwrap(promotionRule.givenValue);

        rule.levelValue(levelValue);


        var self = this;
        services.activity.addContentRule(levelValue, givenType, givenValue, this.promotionId, rule.description)
            .done((data) => {
                rule['id'] = data.Id;
                self.rules.push(rule);
            });

    }

    newRule = (method: string, givenType: string, description: string): PromotionContentRule => {
        var rule = new PromotionContentRule(this, givenType);
        rule.givenType = givenType;
        rule.method = method;
        rule.description = ko.unwrap(description)
        return rule;
    }

    removeRule = (item) => {
        services.activity.deleteContentRule(item.id).done(function () {
            item.promotion.rules.remove(item);
        });
    }

    createPromotionRule = (type) => {
        var obj = createPromotionRule(this, type);
        return obj;
    }

    newBuyGiven = (promotion: PromotionContent) => {
        /// <param name="promotion" type="PromotionContent"/>
        /// <summary>满赠</summary>

        promotion.val1.showAllMessages(false);
        showInputDialog('dlg_productGiven', '满赠', () => {

            if (!promotion.productGivenRule['isValid']()) {
                promotion.val1.showAllMessages();
                for (var i = 0; i < promotion.productGivenVals.length; i++) {
                    promotion.productGivenVals[i].showAllMessages();
                }
                return $.Deferred().reject();
            }

            var ids = '';
            var products = promotion.productGivenRule.givenProducts();
            for (var i = 0; i < products.length; i++) {
                if (i > 0)
                    ids = ids + ',';

                ids = ids + "G'" + ko.unwrap(products[i].id) + "'";
            }

            //debugger;
            return $.ajax({
                url: site.config.shopUrl + 'Product/GetProducts',
                data: {
                    filter: 'Id in {' + ids + '}'
                }
            }).then((data) => {
                return data.DataItems;
            }).done((data) => {
                var names = {};
                for (var i = 0; i < data.length; i++) {
                    names[data[i].Id] = data[i].Name;
                }
                for (var i = 0; i < products.length; i++) {
                    var id = ko.unwrap(products[i].id);
                    products[i].name(names[id]);
                }

                promotion.addRule(promotion.productGivenRule);
            }).fail(function (err) {
                debugger;
            });


        });
    }

    newBuyReduce = (promotion: PromotionContent) => {
        /// <param name="promotion" type="PromotionContent"/>
        /// <summary>满减</summary>
        promotion.val2.showAllMessages(false);
        showInputDialog('dlg_amountReduce', '满减', () => {
            if (!this.amountReduceRule['isValid']()) {
                promotion.val2.showAllMessages();
                return $.Deferred().reject();
            }

            promotion.addRule(promotion.amountReduceRule);
            return $.Deferred().resolve();
        });
    }

    newBuyDiscount = (promotion) => {
        promotion.val3.showAllMessages(false);
        showInputDialog('dlg_amountDiscount', '满折', function () {
            if (!promotion.amountDiscountRule.isValid()) {
                promotion.val3.showAllMessages();
                return $.Deferred().reject();
            }

            promotion.addRule(promotion.amountDiscountRule);
            return $.Deferred().resolve();
        });
    }

    showNewRuleDialog = () => {
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


class PromotionContentRule {
    id: string
    promotion: PromotionContent
    buyCount: KnockoutObservable<number>
    buyAmount: KnockoutObservable<number>
    levelValue: KnockoutObservable<number>
    givenType: string
    givenValue = ko.observable<string>()
    typeText: KnockoutComputed<string>
    method: string
    description: KnockoutComputed<string> | string

    constructor(promotion: PromotionContent, givenType: string) {
        this.promotion = promotion;

        this.buyCount = ko.observable<number>().extend({
            required: {
                onlyIf: $.proxy(function () {
                    return ko.unwrap(this.type) == promotionMethods.count;
                }, promotion)
            }
        });
        this.buyAmount = ko.observable<number>().extend({
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
                this.promotion.method() == promotionMethods.amount ? this.buyAmount(value) : this.buyCount(value)
            }
        });
        this.givenType = givenType;
        this.typeText = ko.computed(() => promotionTypeTexts[this.givenType]);
    }
}

class ProductPromotionContentRule extends PromotionContentRule {
    givenProducts: KnockoutObservableArray<any>

    constructor(promotion: PromotionContent, givenType: string) {
        super(promotion, givenType);

        this.givenProducts = ko.observableArray();
        this.description = ko.computed(() => {
            var str = '即可获赠';// chitu.Utility.format('即可获赠 “{0}” {1} 件', ko.unwrap(this.givenProduct.name()), ko.unwrap(this.givenProduct.quantity()));
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
    addGivenProduct = () => {
        var item = {
            id: ko.observable().extend({ required: true }),
            name: ko.observable(),
            quantity: ko.observable()
        };
        this.givenProducts.push(item);

        var val = validation.group(item);
        this.promotion.productGivenVals.push(val);
    }
    removeGivenProduct = (item) => {
        this.givenProducts.remove(item);
    }


}

class AmountPromotionContentRule extends PromotionContentRule {
    reduceAmount: KnockoutObservable<number>
    description: KnockoutComputed<string>

    constructor(promotion: PromotionContent, givenType: string) {
        super(promotion, givenType)
        this.reduceAmount = ko.observable<number>().extend({ required: true });
        this.givenValue = ko.computed(() => this.reduceAmount() == null ? '' : this.reduceAmount().toString());
        this.description = ko.computed(() => {
            let str = new Number(this.reduceAmount())['toFormattedString']('￥{0:C2}');
            var given_text = `即减 ${str} 元`;
            return getConditionText(this) + given_text;
        });
    }
}

class DiscountPromotionContentRule extends PromotionContentRule {
    pricePercentMain: KnockoutObservable<number>
    pricePercentMinor: KnockoutObservable<number>
    givenValue: KnockoutComputed<string>

    constructor(promotion: PromotionContent, givenType: string) {
        super(promotion, givenType)

        this.pricePercentMain = ko.observable<number>();
        this.pricePercentMinor = ko.observable<number>();

        this.description = ko.computed(() => {
            var given_text = '打 ' + this.pricePercentMain();
            if (this.pricePercentMinor())
                given_text = given_text + '.' + this.pricePercentMinor();

            return getConditionText(this) + given_text + '折';
        })

        this.givenValue = ko.computed(() => this.pricePercentMain() + '.' + this.pricePercentMinor())
    }
}


class PromotionRange {
    promotionId: string
    rules: KnockoutObservableArray<PromotionRangeRule>
    allProducts: KnockoutObservable<boolean>
    product: any
    brand: any
    category: any
    product_val: KnockoutValidationErrors
    brand_val: KnockoutValidationErrors
    category_val: KnockoutValidationErrors
    model: Model

    constructor(promotionId: string, model: Model) {
        this.promotionId = promotionId;
        this.rules = ko.observableArray<PromotionRangeRule>();
        this.allProducts = ko.observable(false);
        this.product = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') };
        this.brand = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') }
        this.category = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') };
        this.product_val = validation.group(this.product);
        this.brand_val = validation.group(this.brand);
        this.category_val = validation.group(this.category);
        this.model = model;

        var self = this;
        this.allProducts.subscribe((value) => {
            services.activity.changeIsAll(self.promotionId, value);
        });
    }
    addRule = (type, name, id, collectionType, promotionId) => {
        var self = this;
        return services.activity.addRangeRule(id, name, type, collectionType, promotionId)
            .done((data) => {
                var rule = this.newRule(data.Id, type, id, name, collectionType, promotionId);
                self.rules.push(rule);
            });
    }
    removeRule = (item) => {
        /// <param name="item" type="PromotionRangeRule"/>
        return services.activity.deleteRangeRule(ko.unwrap(item.id))
            .done(() => {
                this.rules.remove(item);
            });
    }
    newRule = (id, _type, objectId, objectName, collectionType, promotionId): PromotionRangeRule => {
        var rule = new PromotionRangeRule(id, _type, objectId, objectName, collectionType);
        return rule;
    }
    newProductRule = (self) => {
        /// <param name="self" type="PromotionRange"/>
        this.product_val.showAllMessages(false);
        showInputDialog('dlg_product', '添加商品', () => {
            if (!self.product.isValid()) {
                self.product_val.showAllMessages();
                return $.Deferred().reject();
            }
            return services.shopping.getProduct(self.product.id()).done((product) => {
                var name = ko.unwrap(product.Name)
                var productId = ko.unwrap(product.Id)
                var collectionType = ko.unwrap(self.product.collectionType)

                self.addRule('Product', name, productId, collectionType, self.promotionId);
            });
        });
    }
    newBrandRule = () => {
        this.brand_val.showAllMessages(false);
        showInputDialog('dlg_brand', '添加品牌', () => {
            if (!this.brand.isValid()) {
                this.brand_val.showAllMessages();
                return $.Deferred().reject();
            }

            var brandName;
            var brandId = this.brand.id();
            debugger;
            var brands = this.model.brands();
            for (var i = 0; i < brands.length; i++) {
                if (brandId == brands[i].Id) {
                    brandName = brands[i].Name;
                    break;
                }
            }

            this.addRule('Brand', brandName, brandId, ko.unwrap(this.brand.collectionType), this.promotionId);
        })
    }
    newCategoryRule = (self) => {
        /// <param name="self" type="PromotionRange"/>
        this.category_val['showAllMessages'](false);
        showInputDialog('dlg_category', '添加类别', () => {
            if (!this.category.isValid()) {
                this.category_val.showAllMessages();
                return $.Deferred().reject();
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
    }

}

class PromotionRangeRule {
    id: string
    'type': string
    typeText: string
    objectName: string
    objectId: string
    isInclude: KnockoutObservable<boolean>
    range: PromotionRange
    collectionType: KnockoutObservable<string>

    constructor(id, _type, objectId, objectName, collectionType) {
        this.id = id;
        this.objectId = objectId;
        this.type = _type
        this.objectId = objectId;
        this.objectName = objectName;
        this.typeText = _type == 'Product' ? '商品' : '类别',
            this.isInclude = ko.observable<boolean>(collectionType == 'Include');
        this.collectionType = ko.observable<string>(collectionType);

        this.isInclude.subscribe((value) => {
            var type = value ? 'Include' : 'Exclude';
            this.collectionType(value ? 'Include' : 'Exclude');
            services.activity.changeCollectionType(ko.unwrap(this.id), type);
        }, this);
    }
}

class Promotion {
    id: string
    content: PromotionContent
    range: PromotionRange
}

class Model {
    page: chitu.Page;
    activityId: string
    createPromotion: Function
    removePromotion: Function
    promotions = ko.observableArray()
    categories = ko.observableArray<any>()
    brands = ko.observableArray<any>()

    promotion = {
        method: ko.observable('Amount'),
        type: ko.observable('Given')
    }

    constructor(page: chitu.Page, activityId: string) {
        if (page == null)
            throw new Error('Argument "page" is null.');

        this.page = page
        this.activityId = activityId

        this.createPromotion = () => {
            var $dlg = $(this.page.element).find('[name="dlg_promotion"]');
            showDialog($dlg, '添加优惠', () => {

                return sv_activity.addPromotion(this.activityId, this.promotion.type(), this.promotion.method())
                    .done((data) => {
                        var p = new Promotion();
                        p.id = data.Id;
                        p.content = new PromotionContent(data.Id);
                        p.content.method(this.promotion.method());
                        p.content.type(this.promotion.type());
                        p.range = new PromotionRange(data.Id, this);

                        this.promotions.push(p);
                    });
            })
        }

        this.removePromotion = (item) => {
            return services.activity.deletePromotion(ko.unwrap(item.id)).done(() => {
                this.promotions.remove(item);
            });
        }
    }



}


export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    });
}

function page_load(page: chitu.Page, args) {
    var activityId = args.id;
    var model = new Model(page, activityId);

    ko.applyBindings(model, page.element);

    shopping.getCategories().then(function (data) {
        data.unshift({ Name: '请选择类别', Id: '' })
        model.categories(data);
    });

    shopping.getBrands().then((data: Array<any>) => {
        data.unshift({ Name: '请选择品牌', Id: '' })
        model.brands(data);
    })

    sv_activity.getPromotions(activityId).done(function (data) {
        /// <param name="data" type="Array"/>
        for (var i = 0; i < data.length; i++) {
            var content = new PromotionContent(data[i].Id);
            content.type(data[i].Type);
            content.method(data[i].Method);
            for (var j = 0; j < data[i].PromotionContentRules.length; j++) {
                var item = data[i].PromotionContentRules[j];
                var content_rule = content.newRule(item.Type, item.Method, item.Description);
                content_rule.id = item.Id;
                content_rule.levelValue(item.LevelValue);

                content.rules.push(content_rule);
            }

            var range = new PromotionRange(data[i].Id, model);
            for (var j = 0; j < data[i].PromotionRangeRules.length; j++) {
                var item = data[i].PromotionRangeRules[j];
                var range_rule = range.newRule(item.Id, item.ObjectType, item.ObjectId, item.ObjectName, item.CollectionType, item.PromotionId);

                range.rules.push(range_rule);
            }

            range.allProducts(data[i].IsAll);

            model.promotions.push({ id: data[i].Id, content: content, range: range, createDateTime: data[i].CreateDateTime });
        }
    });
}
// }