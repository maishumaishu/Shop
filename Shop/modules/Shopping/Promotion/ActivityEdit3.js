chitu.action(['sv/Activity', 'sv/Shopping', 'JData', 'ko.val'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    var types = {
        givenByProduct: 'GivenByProduct',
        discountByProduct: 'DiscountByProduct',
        discountByCategory: 'DiscountByCategory',
        givenByAmount: 'GivenByAmount'
    }

    var $dlg_product = $(page.node()).find('[name="dlg_product"]');
    var $dlg_amount = $(page.node()).find('[name="dlg_amount"]');
    var model = {
        type: ko.observable(types.givenByProduct),
        givenByProductPromotions: ko.observableArray(),
        givenByAmountPromotions: ko.observableArray(),
        discountByProductPromotions: ko.observableArray(),
        discountByCategoryPromotions: ko.observableArray(),
        amountGivenPromotion: {
            minAmount: ko.observable(),
            maxAmount: ko.observable()
        },
        productDiscountPromotion: {
            productId: ko.observable().extend({ required: true }),
            pricePercent: ko.observable().extend({ required: true })
        },
        categoryDiscountPromotion: {
            categoryId: ko.observable({ required: true }),
            pricePercent: ko.observable().extend({ required: true })
        },
        addGivenByProductPromotion: function () {
            model.type(types.givenByProduct);
            var promotion = {
                beginDate: ko.observable(model.activity.BeginDate()),
                endDate: ko.observable(model.activity.EndDate()),
                buyProducts: ko.observableArray(),
                givenProducts: ko.observableArray(),
                showDialogToBuy: function (item, element) {
                    /// <summary>添加要购买的商品</summary>
                    model.currentPromotion = item;
                    model.showProductDialog($.proxy(function () {
                        this.addBuyProduct();
                    }, item));
                },
                showDialogToGiven: function (item, element) {
                    /// <summary>添加要购买的商品</summary>
                    //debugger;
                    model.currentPromotion = item;
                    model.showProductDialog($.proxy(function () {
                        this.addGivenProduct();
                    }, item));
                },
                addBuyProduct: function () {
                    if (!model.product.isValid())
                        return val.showAllMessages();

                    var self = this;
                    return services.shopping.getProduct(model.product.Id()).done(function (product) {
                        model.product.Name(ko.unwrap(product.Name));
                        model.product.Price(ko.unwrap(product.Price));
                        model.product.NewPrice(new Number(model.product.NewPrice() || ko.unwrap(product.Price)).valueOf());

                        self.buyProducts.push(ko.mapping.toJS(model.product));
                        $dlg_product.modal('hide');
                    })
                },
                addGivenProduct: function () {
                    if (!model.product.isValid())
                        return val.showAllMessages();

                    var self = this;
                    return services.shopping.getProduct(model.product.Id()).done(function (product) {
                        model.product.Name(ko.unwrap(product.Name));
                        model.product.Price(ko.unwrap(product.Price));
                        model.product.NewPrice(new Number(model.product.NewPrice()).valueOf());

                        self.givenProducts.push(ko.mapping.toJS(model.product));
                        $dlg_product.modal('hide');
                    })
                },
                remove: function (item, element) {
                    model.givenByProductPromotions.remove(item);
                }
            };
            model.givenByProductPromotions.push(promotion);
        },
        newGivenByAmountPromotion: function () {
            model.type(types.givenByAmount);
            model.showInputDialog('dlg_amount', '请入金额范围', function () {
                return model.addGivenByAmountPromotion();
            });
        },
        newDiscountByProductPromotion: function () {
            model.type(types.discountByProduct);
            model.showInputDialog('dlg_product_discount', '请输入商品信息', function () {

                return model.addDiscountByProductPromotion();
            });
        },
        addDiscountByProductPromotion: function () {
            var p = model.productDiscountPromotion;
            var promotion = {
                beginDate: ko.observable(model.activity.BeginDate()),
                endDate: ko.observable(model.activity.EndDate()),
                //productId: ko.observable(p.productId()),
                pricePercent: ko.observable(p.pricePercent()),
                discountProducts: ko.observableArray()
            };
            //return services.shopping.getProduct(p.productId()).done(function (product) {
            //product.PricePercent = ko.observable(p.pricePercent());
            model.discountByProductPromotions.push(promotion);
            //});
            //model.discountByProductPromotions.push(promotion);
        },
        addGivenByAmountPromotion: function () {
            var p = model.amountGivenPromotion;
            var promotion = {
                beginDate: ko.observable(model.activity.BeginDate()),
                endDate: ko.observable(model.activity.EndDate()),
                minAmount: ko.observable(new Number(p.minAmount()).valueOf()),
                maxAmount: ko.observable(new Number(p.maxAmount()).valueOf()),
                givenProducts: ko.observableArray(),
                newGivenProduct: function (item, element) {
                    model.showProductDialog(function () {
                        return services.shopping.getProduct(model.product.Id()).done(function (product) {
                            model.product.Name(ko.unwrap(product.Name));
                            model.product.Price(ko.unwrap(product.Price));
                            model.product.NewPrice(new Number(model.product.NewPrice() || ko.unwrap(product.Price)).valueOf());

                            item.givenProducts.push(ko.mapping.toJS(model.product));
                            $dlg_product.modal('hide');
                        })

                    });
                },
                remove: function (item, element) {
                    model.givenByAmountPromotions.remove(item);
                }
            };
            model.givenByAmountPromotions.push(promotion);
            return $.Deferred().resolve();
        },
        currentPromotion: {},
        back: function () {
            app.back({}).fail(function () {
                location.href = '#Shopping/Promotion/Activities';
            });
        },
        add: function () {

        },
        activity: {
            BeginDate: ko.observable(),
            EndDate: ko.observable()
        },
        product: {
            Id: ko.observable().extend({ required: true }),
            Quantity: ko.observable().extend({ required: true }),
            Price: ko.observable(),
            NewPrice: ko.observable(),
            Name: ko.observable()
        },
        amount: ko.observable().extend({ required: true }),
        switchPromotionType: function (type) {
            return $.proxy(function () {
                model.type(this._type);
            }, { _type: type });
        },
        showProductDialog: function (ok_callback) {
            $dlg_product.find('input').val('');
            $dlg_product.find('[name="btnOK"]')[0].onclick = function () {
                ok_callback();
                $dlg_product.modal('hide');
            };
            $dlg_product.modal();
        },
        showAmountDialog: function (ok_callback) {
            $dlg_amount.find('input').val('');
            $dlg_amount.find('[name="btnOK"]')[0].onclick = function () {
                ok_callback();
                $dlg_amount.modal('hide');
            };
            $dlg_amount.modal();
        },
        showInputDialog: function (name, title, ok_callback) {
            var $dlg = $(page.node()).find('[name="' + name + '"]');
            if (title)
                $dlg.find('.modal-title').text(title);

            $dlg.find('[name="btnOK"]')[0].onclick = function () {
                var result = ok_callback();
                if (result != null && $.isFunction(result.done)) {
                    result.done(function () {
                        $dlg.modal('hide')
                    });
                }
                else {
                    $dlg.modal('hide')
                }
            };
            $dlg.modal();
        }
    }

    ko.applyBindings(model, page.node());
    var val = ko.validation.group(model.product);

    page.load.add(function (sender, args) {
        return services.activity.getActivity(args.id).done(function (data) {
            ko.mapping.fromJS(data, {}, model.activity);
        });
    });

    //$dlg_product.find('[name="btnBuyProduct"]').click(function () {
    //    model.currentPromotion.addBuyProduct();
    //});

    //$dlg_product.find('[name="btnGivenProduct"]').click(function () {
    //    model.currentPromotion.addGivenProduct();
    //});

    //$dlg_amount.find('[name="btnOK"]').click(function () {
    //    model.addGivenByAmountPromotion(model.amount());
    //});

});