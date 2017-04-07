chitu.action(['ko.val', 'sv/Shopping', 'sv/Activity'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    var promotionTypes = {
        amount: 'Amount',
        product: 'Product'
    };
    var givenTypes = {
        amount: 'Amount',
        product: 'Product',
        discount: 'Discount'
    };
    var givenTexts = {
        Amount: '满减',
        Product: '满赠',
        Discount: '满折'
    };

    var PromotionContent = function (promotionId) {
        this.type = ko.observable(promotionTypes.amount);
        this.rules = ko.observableArray();
        this.promotionId = promotionId;

        this.productGivenVals = [];

        var p = this;
        p.productGivenRule = this.createPromotionRule(givenTypes.product);
        p.amountReduceRule = this.createPromotionRule(givenTypes.amount);
        p.amountDiscountRule = this.createPromotionRule(givenTypes.discount);

        //TODO:改名
        this.val1 = ko.validation.group(p.productGivenRule);
        this.val2 = ko.validation.group(p.amountReduceRule);
        this.val3 = ko.validation.group(p.amountDiscountRule);
    };

    PromotionContent.prototype = {
        addRule: function (promotionRule) {
            /// <param name="promotionRule" type="PromotionContentRule"/>
            var rule = this.newRule(ko.unwrap(promotionRule.givenType), ko.unwrap(promotionRule.description));

            var value = ko.unwrap(promotionRule.givenValue);
            var levelValue = this.type() == promotionTypes.amount ? promotionRule.buyAmount() : promotionRule.buyCount();
            var givenType = ko.unwrap(promotionRule.givenType);
            var givenValue = ko.unwrap(promotionRule.givenValue);

            var self = this;
            services.activity.addContentRule(levelValue, givenType, givenValue, this.promotionId, rule.description)
                    .done(function (data) {
                        rule.id = data.Id;
                        self.rules.push(rule);
                    });

        },
        newRule: function (method, givenType, description) {
            var rule = {
                method: method,
                givenType: givenType,
                typeText: givenTexts[givenType],
                description: ko.unwrap(description),
                promotion: this
            };
            return rule;
        },
        removeRule: function (item) {
            services.activity.deleteContentRule(item.id).done(function () {
                item.promotion.rules.remove(item);
            });
        },
        createPromotionRule: function (type) {
            var obj = createPromotionRule(this, type);
            return obj;
        },
        newBuyGiven: function (promotion) {
            /// <param name="promotion" type="PromotionContent"/>
            /// <summary>满赠</summary>

            promotion.val1.showAllMessages(false);
            showInputDialog('dlg_productGiven', '满赠', function () {

                if (!promotion.productGivenRule.isValid()) {
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
                })
                .then(function (data) {
                    return data.DataItems;
                })
                .done(function (data) {
                    debugger;
                    names = {};
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
        },
        newBuyReduce: function (promotion) {
            /// <param name="promotion" type="PromotionContent"/>
            /// <summary>满减</summary>
            promotion.val2.showAllMessages(false);
            showInputDialog('dlg_amountReduce', '满减', function () {
                if (!promotion.amountReduceRule.isValid()) {
                    promotion.val2.showAllMessages();
                    return $.Deferred().reject();
                }

                promotion.addRule(promotion.amountReduceRule);
                return $.Deferred().resolve();
            });
        },
        newBuyDiscount: function (promotion) {
            promotion.val3.showAllMessages(false);
            showInputDialog('dlg_amountDiscount', '满折', function () {
                if (!promotion.amountDiscountRule.isValid()) {
                    promotion.val3.showAllMessages();
                    return $.Deferred().reject();
                }

                promotion.addRule(promotion.amountDiscountRule);
                return $.Deferred().resolve();
            });
        },
        changeCollectionType: function (item) {
            debugger;
        }
    }

    var PromotionContentRule = function (promotion, givenType) {
        /// <param name="promotion" type="PromotionContent"/>

        this.promotion = promotion;
        this.minValue = ko.observable();
        this.maxValue = ko.observable();
        this.buyCount = ko.observable().extend({
            required: {
                onlyIf: $.proxy(function () {
                    return ko.unwrap(this.type) == promotionTypes.product;
                }, promotion)
            }
        });
        this.buyAmount = ko.observable().extend({
            required: {
                onlyIf: $.proxy(function () {
                    return ko.unwrap(this.type) == promotionTypes.amount;
                }, promotion)
            }
        });
        this.givenType = givenType;
        this.description = '';
    };

    function getConditionText(promotionRule) {
        /// <param name="promotionRule" type="PromotionContentRule"/>
        var promotion = promotionRule.promotion;
        var condition_text;
        if (promotion.type() == promotionTypes.product) {
            condition_text = chitu.Utility.format('购买指定商品任意 {0} 件,', ko.unwrap(promotionRule.buyCount));
        }
        else if (promotion.type() == promotionTypes.amount) {
            condition_text = chitu.Utility.format('购买指定商品满 {0} 元,', new Number(promotionRule.buyAmount()).toFormattedString('￥{0:C2}'));
        }
        return condition_text;
    }

    function createPromotionRule(promotion, type) {
        /// <param name="promotion" type="PromotionContent"/>

        var baseRule = new PromotionContentRule(promotion, type);
        var extend = {
        };
        switch (type) {
            case givenTypes.product:
                extend = $.extend(baseRule, {
                    givenProducts: ko.observableArray()
                });
                extend.addGivenProduct = $.proxy(function () {
                    var item = {
                        id: ko.observable().extend({ required: true }),
                        name: ko.observable(),
                        quantity: ko.observable()
                    };
                    this.givenProducts.push(item);

                    var val = ko.validation.group(item);
                    promotion.productGivenVals.push(val);

                }, extend);

                extend.removeGivenProduct = $.proxy(function (item) {
                    this.givenProducts.remove(item);

                }, extend);

                extend.addGivenProduct(extend);

                extend.description = ko.computed(function () {
                    var str = '即可获赠';// chitu.Utility.format('即可获赠 “{0}” {1} 件', ko.unwrap(this.givenProduct.name()), ko.unwrap(this.givenProduct.quantity()));
                    var products = this.givenProducts();
                    for (var i = 0; i < products.length; i++) {
                        if (i > 0)
                            str = str + "，";

                        str = str + chitu.Utility.format(' “{0}” {1} 件', ko.unwrap(products[i].name), ko.unwrap(products[i].quantity));
                    }
                    return getConditionText(this) + str;
                }, extend);

                extend.givenValue = ko.computed(function () {
                    var str = '';
                    var products = this.givenProducts();
                    for (var i = 0; i < products.length; i++) {
                        if (i > 0)
                            str = str + ',';

                        str = str + ko.unwrap(products[i].id) + ':' + ko.unwrap(products[i].quantity);
                    }
                    return str;

                }, extend);

                break;
            case givenTypes.amount:
                extend = $.extend(baseRule, {
                    reduceAmount: ko.observable().extend({ required: true })
                });

                extend.description = ko.computed(function () {
                    var given_text = chitu.Utility.format('即减 {0} 元', new Number(this.reduceAmount()).toFormattedString('￥{0:C2}'));
                    return getConditionText(this) + given_text;

                }, extend);

                extend.givenValue = extend.reduceAmount;

                break;
            case givenTypes.discount:
                extend = $.extend(baseRule, {
                    pricePercentMain: ko.observable(),
                    pricePercentMinor: ko.observable()
                });

                extend.description = ko.computed(function () {
                    var given_text = '打 ' + this.pricePercentMain();
                    if (this.pricePercentMinor())
                        given_text = given_text + '.' + this.pricePercentMinor();

                    return getConditionText(this) + given_text + '折';

                }, extend);

                extend.givenValue = ko.computed(function () {
                    return this.pricePercentMain() + '.' + this.pricePercentMinor();
                }, extend);

                break;
        }
        return extend;
    }


    var PromotionRange = function (promotionId) {
        this.promotionId = promotionId;
        this.rules = new ko.observableArray();
        this.allProducts = ko.observable(false);
        this.product = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') };
        this.category = { id: ko.observable().extend({ required: true }), collectionType: ko.observable('Include') };
        this.product_val = ko.validation.group(this.product);
        this.category_val = ko.validation.group(this.category);

        var self = this;
        this.allProducts.subscribe(function (value) {
            services.activity.changeIsAll(self.promotionId, value);
        });
    };

    PromotionRange.prototype = {
        addRule: function (type, name, id, collectionType, promotionId) {
            var self = this;
            return services.activity.addRangeRule(id, name, type, collectionType, promotionId).done(function (data) {
                var rule = self.newRule(data.Id, type, id, name, collectionType, promotionId);
                self.rules.push(rule);
            });
        },
        removeRule: function (item) {
            /// <param name="item" type="PromotionRangeRule"/>
            return services.activity.deleteRangeRule(ko.unwrap(item.id)).done(function () {
                item.range.rules.remove(item);
            });
        },
        newRule: function (id, type, objectId, objectName, collectionType, promotionId) {
            var rule = {
                id: id,
                type: type,
                typeText: type == 'Product' ? '商品' : '类别',
                objectName: objectName,
                objectId: objectId,
                isInclude: ko.observable(collectionType == 'Include'),
                range: this
            };
            rule.collectionType = ko.computed(function () {
                if (this.isInclude())
                    return 'Include';

                return 'Exclude';
            }, rule);

            rule.isInclude.subscribe(function (value) {
                var type = value ? 'Include' : 'Exclude';
                services.activity.changeCollectionType(ko.unwrap(this.id), type);
            }, rule);

            return rule;
        },
        newProductRule: function (self) {
            /// <param name="self" type="PromotionRange"/>
            self.product_val.showAllMessages(false);
            showInputDialog('dlg_product', '添加商品', function () {
                if (!self.product.isValid()) {
                    self.product_val.showAllMessages();
                    return $.Deferred().reject();
                }
                return services.shopping.getProduct(self.product.id()).done(function (product) {
                    self.addRule('Product', ko.unwrap(product.Name), ko.unwrap(product.Id), ko.unwrap(self.product.collectionType), self.promotionId);
                });
            });
        },
        newCategoryRule: function (self) {
            /// <param name="self" type="PromotionRange"/>
            self.category_val.showAllMessages(false);
            showInputDialog('dlg_category', '添加类别', function () {
                if (!self.category.isValid()) {
                    self.category_val.showAllMessages();
                    return $.Deferred().reject();
                }

                var categoryName;
                var categoryId = self.category.id();
                var categories = model.categories();
                for (var i = 0; i < categories.length; i++) {
                    if (categoryId == categories[i].Id) {
                        categoryName = categories[i].Name;
                        break;
                    }
                }

                self.addRule('Category', categoryName, categoryId, ko.unwrap(self.category.collectionType), self.promotionId);
            });
        }
    };

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


    var activityId = page.context().routeData().values().id;
    var model = {
        promotions: ko.observableArray(),
        createPromotion: function () {
            var $dlg = $(page.node()).find('[name="dlg_promotion"]');
            showDialog($dlg, '添加优惠', function () {

                return services.activity.addPromotion(activityId, model.promotion.type(), model.promotion.method())
                        .done(function (data) {
                            var content = new PromotionContent(data.Id);
                            var range = new PromotionRange(data.Id);
                            model.promotions.push({ id: data.Id, content: content, range: range });
                        });
            })
        },
        removePromotion: function (item) {
            return services.activity.deletePromotion(ko.unwrap(item.id)).done(function () {
                model.promotions.remove(item);
            });
        },
        categories: ko.observableArray(),
        promotion: {
            method: ko.observable('Amount'),
            type: ko.observable('Given')
        }
    };

    ko.applyBindings(model, page.node());

    services.shopping.getCategories().done(function (data) {
        data.unshift({ Name: '请选择类别', Id: '' })
        model.categories(data);
    });

    services.activity.getPromotions(activityId).done(function (data) {
        /// <param name="data" type="Array"/>
        for (var i = 0; i < data.length; i++) {
            var content = new PromotionContent(data[i].Id);
            for (var j = 0; j < data[i].PromotionContentRules.length; j++) {
                var item = data[i].PromotionContentRules[j];
                var rule = content.newRule(item.Type, item.Method, item.Description);
                rule.id = item.Id;

                content.rules.push(rule);
            }

            var range = new PromotionRange(data[i].Id);
            for (var j = 0; j < data[i].PromotionRangeRules.length; j++) {
                var item = data[i].PromotionRangeRules[j];
                var rule = range.newRule(item.Id, item.ObjectType, item.ObjectId, item.ObjectName, item.CollectionType, item.PromotionId);
                range.rules.push(rule);
            }

            range.allProducts(data[i].IsAll);

            model.promotions.push({ id: data[i].Id, content: content, range: range, createDateTime: data[i].CreateDateTime });
        }
    });



});