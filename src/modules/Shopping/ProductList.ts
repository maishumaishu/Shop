import shopping = require('services/Shopping');
import station = require('services/Station');
import app = require('Application');
import bootbox = require('bootbox');

let JData = window['JData']
export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    })
}

function page_load(page: chitu.Page, args) {
    var g_pageIndex = 0;

    var PagingModel = function () {

        this.pageIndex = ko.observable(0);
        this.pageSize = ko.observable(10);
        this.recordCount = ko.observable(1000);
        this.pageButtonCount = ko.observable(10);
        this.previousPageText = ko.observable('...');
        this.nextPageText = ko.observable('...');
        this.previousPageIndex = ko.observable();
        this.nextPageIndex = ko.observable();

        this.pageCount = ko.computed(function () {
            var pageCount = Math.ceil(this.recordCount() / this.pageSize());
            return pageCount;
        }, this);

        this.numbers = ko.computed(function () {
            var pagingBarIndex = Math.floor(this.pageIndex() / this.pageButtonCount());
            var start = pagingBarIndex * this.pageButtonCount();

            this.nextPageIndex(null);
            this.previousPageIndex(null);

            var numbers = [];
            for (var i = 0; i < this.pageButtonCount(); i++) {
                var number = start + i;
                if (number > this.pageCount() - 1)
                    break;

                if (i == this.pageButtonCount() - 1) {
                    if (number < this.pageCount() - 1)
                        this.nextPageIndex(number + 1);
                }

                if (i == 0 && pagingBarIndex > 0) {
                    this.previousPageIndex((pagingBarIndex - 1) * this.pageButtonCount());
                }

                numbers.push(number);
            }
            return numbers;
        }, this);
    };

    var model = {
        searchText: ko.observable<string>(),
        search: function () {
            model.handlePage(0);
        },
        products: ko.observableArray<any>(),
        homeProducts: ko.observableArray<any>(),
        paging: new PagingModel(),
        offShelve: function (item) {
            return shopping.offShelve(item.Id()).done($.proxy(
                function () {
                    this._item.OffShelve(true);

                    var sel_args = new JData.DataSourceSelectArguments();
                    sel_args.set_filter('ProductId=Guid"' + this._item.Id() + '"');
                    station.homeProduct.select(sel_args).done(function (result) {
                        if (result.length > 0)
                            station.homeProduct.delete(result[0]);

                    })
                },
                { _item: item })
            );
        },
        onShelve: function (item) {
            return shopping.onShelve(item.Id()).done(function () {
                item.OffShelve(false);
            })
        },
        handlePage: function (pageIndex) {
            g_pageIndex = pageIndex;
            return shopping.getProductList(pageIndex, model.searchText()).pipe(function (result) {
                model.paging.pageIndex(pageIndex);
                model.paging.recordCount(result.TotalRowCount);
                model.products.removeAll();
                var productIds = [];
                for (var i = 0; i < result.DataItems.length; i++) {
                    var obj = result.DataItems[i]
                    model.products.push(obj);
                    productIds.push(ko.unwrap(result.DataItems[i].Id));
                }
                return $.when(shopping.getProductStocks(productIds),
                    shopping.getBuyLimitedNumbers(productIds));
            }).done(function (stocks, limitedNumbers) {
                var products = model.products();
                for (var j = 0; j < stocks.length; j++) {
                    for (var i = 0; i < products.length; i++) {
                        if (ko.unwrap(products[i].Id) == ko.unwrap(stocks[j].ProductId)) {
                            products[i].Stock(ko.unwrap(stocks[j].Quantity));
                        }
                    }
                }

                for (var j = 0; j < limitedNumbers.length; j++) {
                    for (var i = 0; i < products.length; i++) {
                        if (ko.unwrap(products[i].Id) == ko.unwrap(limitedNumbers[j].ProductId)) {
                            products[i].BuyLimitedNumber(ko.unwrap(limitedNumbers[j].LimitedNumber));
                        }
                    }
                }
            });
        },
        handleNextPage: function () {
            model.handlePage(model.paging.nextPageIndex());
        },
        handlePreviousPage: function () {
            model.handlePage(model.paging.previousPageIndex());
        },
        productEdit: function (item) {
            var url = `Shopping/ProductEdit/id=${ko.unwrap(item.Id)}&method=edit`;//, ko.unwrap(item.Id));
            app.redirect(url, { product: item });
        },
        productAdd: function (item) {
            if (item)
                app.showPage('Shopping/ProductEdit', { product: item, sourceId: ko.unwrap(item.Id), products: model.products, method: 'add' });// 'add'
            else
                app.showPage('Shopping/ProductEdit', { products: model.products, method: 'add' });//'add'
        },
        productRemove: function (item) {
            return shopping.removeProduct(ko.unwrap(item.Id)).done($.proxy(
                function () {
                    model.products.remove(this._item);
                    station.homeProduct.delete({ Id: ko.unwrap(item.Id) })
                },
                { _item: item })
            );
        },
        homeProductRemove: function (item) {
            return station.homeProduct
                .delete(item)
                .done($.proxy(
                    function () {
                        model.homeProducts.remove(this._item);
                    }, { _item: item })
                );
        },
        productTop: function (item) {
            return shopping.topProduct(item.Id()).pipe(function () {
                return model.handlePage(0);
            });
        },
        productRecommend: function (item) {
            /// <summary>将产品推荐到首页</summary>
            var obj = ko.mapping.toJS(item);
            obj.ProductId = obj.Id;
            return station.homeProduct
                .insert(obj)
                .done(function () {
                    var msg = Utility.format('推荐产品"{0}"成功', item.Name())
                    bootbox.alert(msg);
                });
        },
        tabs: {
            current: ko.observable('all'),
            all: function () {
                $(event.target).parents('ul').find('li').removeClass('active');
                $(event.target).parents('li').first().addClass('active');
                model.tabs.current('all');
            },
            recommend: function (item, event) {
                $(event.target).parents('ul').find('li').removeClass('active');
                $(event.target).parents('li').first().addClass('active');
                model.tabs.current('recommend');
                model.homeProducts.removeAll();
                station.homeProduct.select().done(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        model.homeProducts.push(result[i]);
                    }
                });
            }
        },
        restriction: {      // 产品限购，对产品的限购数进行修改
            quantity: ko.observable(),
            unlimit: ko.observable(),
            productName: ko.observable(),
            currentProduct: null,
            show: function (item) {
                /// <param name="item" type="models.Product"/>
                /// <param name="fieldUpdate" type="jQuery.Deferred"/>

                model.restriction.currentProduct = item;
                model.restriction.productName(ko.unwrap(item.Name) + '(' + item.Unit() + ')');
                model.restriction.quantity(ko.unwrap(item.BuyLimitedNumber));

                if (model.restriction.quantity() == null)
                    model.restriction.unlimit(true);
                else
                    model.restriction.unlimit(false);

                var validation = ko.validation.group(model.restriction);
                validation.showAllMessages(false);

                (<any>$(page.element).find('[name="restriction"]')).modal();
            },
            confirm: function () {
                var validation = ko.validation.group(model.restriction);
                if (!(<any>model.restriction).isValid()) {
                    validation.showAllMessages();
                    return;
                }

                var quantity;
                if (model.restriction.unlimit())
                    quantity = null;
                else
                    quantity = model.restriction.quantity();

                shopping.buyLimited(model.restriction.currentProduct.Id(), quantity).done(function (result) {
                    model.restriction.currentProduct.BuyLimitedNumber(quantity);
                    (<any>$(page.element).find('[name="restriction"]')).modal('hide');
                });
            }
        },
        productStock: {        // 产品库存，对产品的库存进行修改
            stock: ko.observable(),
            unlimit: ko.observable(),
            productName: ko.observable(),
            currentProduct: null,
            show: function (item) {
                model.productStock.currentProduct = item;
                model.productStock.productName(ko.unwrap(item.Name) + '(' + item.Unit() + ')');
                model.productStock.stock(ko.unwrap(item.Stock));

                if (model.productStock.stock() == null)
                    model.productStock.unlimit(true);
                else
                    model.productStock.unlimit(false);

                var validation = ko.validation.group(model.productStock);
                validation.showAllMessages(false);

                (<any>$(page.element).find('[name="productStock"]')).modal();
            },
            confirm: function () {
                var validation = ko.validation.group(model.productStock);
                if (!(<any>model.productStock).isValid()) {
                    validation.showAllMessages();
                    return;
                }

                var quantity;
                if (model.productStock.unlimit())
                    quantity = null;
                else
                    quantity = model.productStock.stock();

                shopping.setStock(model.productStock.currentProduct.Id(), quantity).done(function (result) {
                    model.productStock.currentProduct.Stock(quantity);
                    (<any>$(page.element).find('[name="productStock"]')).modal('hide');
                });
            }
        }
    };

    model.restriction.quantity.extend({
        required: {
            onlyIf: function () {
                return !model.restriction.unlimit();
            }
        }
    });
    model.productStock.stock.extend({
        required: {
            onlyIf: function () {
                return !model.productStock.unlimit();
            }
        }
    });

    ko.applyBindings(model, page.element);
    // page.load.add(function () {
    model.handlePage(g_pageIndex);
    // });

}