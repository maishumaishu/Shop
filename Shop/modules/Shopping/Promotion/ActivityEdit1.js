chitu.action(['ko.val', 'sv/Shopping'], function (page) {
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

    var promotion = {
        productsCount: ko.observable(),
        buyAmount: ko.observable(),
        type: ko.observable(promotionTypes.product),
        givenProduct: {
            id: ko.observable().extend({
                required: true
            }),
            name: ko.observable(),
            quantity: ko.observable()
        },
        givenProducts: ko.observableArray(),
        reduceAmount: ko.observable(),
        pricePercent: ko.observable(),
        pricePercentMain: ko.observable(9),
        pricePercentMinor: ko.observable(9),
        givenType: ko.observable(givenTypes.product),
        reset: function () {
            promotion.buyAmount('');
            promotion.givenProduct.id('');
            promotion.givenProducts.removeAll();
        },
        addGivenProduct: function () {
            if (!promotion.givenProduct.isValid()) {
                return givenProduct_val.showAllMessages();
            }

            function clearGivenProduct() {
                promotion.givenProduct.id('');
                givenProduct_val.showAllMessages(false);
            }

            var givenProducts = promotion.givenProducts();
            for (var i = 0; i < givenProducts.length; i++) {
                var item = givenProducts[i];
                if (ko.unwrap(item.id) == ko.unwrap(promotion.givenProduct.id)) {
                    item.quantity(ko.unwrap(item.quantity) + 1);
                    clearGivenProduct();
                    return $.Deferred().resolve();
                }
            }

            return services.shopping.getProduct(promotion.givenProduct.id()).done(function (product) {
                var name = ko.unwrap(product.Name);
                promotion.givenProduct.name(name);
                promotion.givenProduct.quantity(1);

                var obj = ko.mapping.toJS(promotion.givenProduct);
                obj.remove = function (item) {
                    promotion.givenProducts.remove(item);
                }
                promotion.givenProducts.push(ko.mapping.fromJS(obj));
                clearGivenProduct();
            });
        }
    };

    promotion.text = ko.computed(function () {
        var condition_text;
        if (promotion.type() == promotionTypes.product) {
            condition_text = chitu.Utility.format('购买指定商品任意 {0} 件,', promotion.productsCount());
        }
        else if (promotion.type() == promotionTypes.amount) {
            condition_text = chitu.Utility.format('购买指定商品满 {0} 元,', new Number(promotion.buyAmount()).toFormattedString('￥{0:C2}'));
        }

        var given_text;
        if (promotion.givenType() == givenTypes.amount) {
            given_text = chitu.Utility.format('即减 {0} 元', new Number(promotion.reduceAmount()).toFormattedString('￥{0:C2}'));
        }
        else if (promotion.givenType() == givenTypes.product) {
            var str = '即可获赠';
            var givenProducts = promotion.givenProducts();
            for (var i = 0; i < givenProducts.length; i++) {
                if (i > 0)
                    str = str + '，';

                str = str + chitu.Utility.format(' “{0}” {1} 件', ko.unwrap(givenProducts[0].name), ko.unwrap(givenProducts[0].quantity));
            }
            given_text = str;
        }
        else if (promotion.givenType() == givenTypes.discount) {
            given_text = '打 ' + promotion.pricePercentMain();
            if (promotion.pricePercentMinor)
                given_text = given_text + '.' + promotion.pricePercentMinor();

            given_text = given_text + '折';
        }

        var text = condition_text + given_text;
        return text;

    }, promotion);

    promotion.buyAmount.extend({
        required: {
            onlyIf: function () {
                return ko.unwrap(promotion.type) == promotionTypes.amount;
            }
        }
    });

    promotion.givenProducts.extend({
        validation: [{
            validator: function (value, params) {
                return promotion.givenProducts().length > 0;
            },
            message: '请添加赠送产品'
        }]
    });


    var model = {
        newBuyGiven: function () {
            model.promotion.reset();
            model.promotion.givenType(givenTypes.product);
            model.showInputDialog('dlg_promotion', '满赠', function () {
                if (!model.promotion.isValid()) {
                    promotion_val.showAllMessages();
                    return $.Deferred().reject();
                }
                var obj = ko.mapping.toJS(promotion);
                obj.givenTypeText = '满赠';

                //var str = chitu.Utility.format('购买指定商品任意 {0} 件，即可赠', obj.productsCount);
                //var givenProducts = promotion.givenProducts();
                //for (var i = 0; i < givenProducts.length; i++) {
                //    if (i > 0)
                //        str = str + '，';

                //    str = str + chitu.Utility.format(' “{0}” {1} 件', ko.unwrap(givenProducts[0].name), ko.unwrap(givenProducts[0].quantity));
                //}
                //obj.text = str;
                obj.remove = function (item) {
                    model.promotions.remove(item);
                }
                model.promotions.push(obj);
            });
        },
        newBuyReduce: function () {
            model.promotion.reset();
            model.promotion.givenType(givenTypes.amount);
            model.showInputDialog('dlg_promotion', '满减', function () {
                if (!model.promotion.isValid()) {
                    promotion_val.showAllMessages();
                    return $.Deferred().reject();
                }

                var obj = ko.mapping.toJS(promotion);
                obj.givenTypeText = '满减';

                //obj.text = chitu.Utility.format('购买指定商品满 ￥{0:c} 元，即减 ￥{1:c} 元',
                //    new Number(obj.buyAmount).valueOf(), new Number(obj.reduceAmount).valueOf());
                obj.remove = function (item) {
                    model.promotions.remove(item);
                }
                model.promotions.push(obj);
            });
        },
        newBuyDiscount: function () {
            model.promotion.reset();
            model.promotion.givenType(givenTypes.discount);
            model.showInputDialog('dlg_promotion', '满折', function () {
                if (!model.promotion.isValid()) {
                    promotion_val.showAllMessages();
                    return $.Deferred().reject();
                }

                //var obj = ko.mapping.toJS(promotion);
                //obj.givenTypeText = '满折';

                //var str = chitu.Utility.format('购买指定商品任意 {0} 件，打 {1}', obj.productsCount, obj.pricePercentMain);
                //if (obj.pricePercentMinor) {
                //    str = str + '.' + obj.pricePercentMinor + ' 折';
                //}
                //obj.text = str;
                obj.remove = function (item) {
                    model.promotions.remove(item);
                }
                model.promotions.push(obj);
            });
        },
        showProductDialog: function () {
            model.showInputDialog('dlg_product', '添加商品', function () {
                if (!model.productInput.isValid()) {
                    product_val.showAllMessages();
                    return $.Deferred().reject();
                }

                return services.shopping.getProduct(model.productInput.productId()).done(function (product) {
                    var range = {
                        typeText: '商品',
                        name: ko.unwrap(product.Name),
                        collectionType: ko.observable('Include'),
                        remove: function (item) {
                            model.ranges.remove(item);
                        }
                    }
                    model.ranges.push(range);
                });
            });
        },
        showCategoryDialog: function () {
            model.showInputDialog('dlg_category', '添加类别', function () {
                if (!model.categoryInput.isValid()) {
                    category_val.showAllMessages();
                    return $.Deferred().reject();
                }

                var categoryName;
                var categoryId = model.categoryInput.categoryId();
                var categories = model.categories();
                for (var i = 0; i < categories.length; i++) {
                    if (categoryId == categories[i].Id) {
                        categoryName = categories[i].Name
                        break;
                    }
                }

                var range = {
                    typeText: '类别',
                    name: categoryName,
                    collectionType: ko.observable('Include'),
                    remove: function (item) {
                        model.ranges.remove(item);
                    }
                }
                model.ranges.push(range);
            });
        },
        showInputDialog: function (name, title, ok_callback) {
            var $dlg = $(page.node()).find('[name="' + name + '"]');
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

            promotion_val.showAllMessages(false);
            givenProduct_val.showAllMessages(false);
            product_val.showAllMessages(false);
            category_val.showAllMessages(false);

            $dlg.modal();
            window.setTimeout(function () {
                $dlg.find('input:visible,select:visible').first().focus();
            }, 500);
        },
        promotion: promotion,
        promotions: ko.observableArray(),
        ranges: ko.observableArray(),
        productInput: {
            productId: ko.observable().extend({ required: true })
        },
        categoryInput: {
            categoryId: ko.observable().extend({ required: true })
        },
        categories: ko.observableArray()
    };

    services.shopping.getCategories().done(function (data) {
        data.unshift({ Name: '请选择类别', Id: '' })
        model.ranges.categories(data);
    });

    var promotion_val = ko.validation.group(model.promotion);
    var givenProduct_val = ko.validation.group(model.promotion.givenProduct);
    var product_val = ko.validation.group(model.productInput);
    var category_val = ko.validation.group(model.categoryInput);

    ko.applyBindings(model, page.node());

});