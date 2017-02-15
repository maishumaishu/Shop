chitu.action(['sv/Shopping', 'knockout.mapping'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    function ProductGroup() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.ProductPropertyDefeineId = ko.observable(),
        this.ProductArgumentId = ko.observable(),
        this.DefineName = ko.observable(),
        this.ArgumentName = ko.observable()
    }

    var $dlg_productGroup = $(page.node()).find('[name="dlg_productGroup"]');
    var model = {
        item: new ProductGroup(),
        add: function () {
            var item = new ProductGroup();
            //services.shopping.productGroupDataSource.insert\
            $dlg_productGroup.modal();
        },
        edit: function (item) {
            ko.mapping.fromJS(ko.mapping.toJS(item), {}, model.item);
            model.item._source = item;
            $dlg_productGroup.modal();
        },
        save: function () {
            var item = model.item;
            if (item.Id()) {
                return services.shopping.productGroups.update(ko.mapping.toJS(item)).done(function (data) {
                    ko.mapping.fromJS(data, {}, model.item);
                    $dlg_productGroup.modal('hide');
                });
            }
            else {
                var obj = { Name: item.Name() };
                if (item.ProductPropertyDefeineId()) {
                    obj.ProductPropertyDefeineId = item.ProductPropertyDefeineId();
                }

                if (item.ProductArgumentId()) {
                    obj.ProductArgumentId = item.ProductArgumentId();
                }

                return services.shopping.productGroups.insert(obj).done(function (data) {
                    ko.mapping.fromJS(data, {}, model.item);
                    model.items.push(model.item);
                    $dlg_productGroup.modal('hide');
                });
            }

        },
        remove: function (item) {
            return services.shopping.productGroups.delete(ko.mapping.toJS(item)).done(function () {
                model.items.remove(item);
            });
        },
        items: ko.observableArray(),
        productDefines: ko.observableArray(),
        productArguments: ko.observableArray(),
        on_defineChange: function (item) {
            model.item.DefineName(ko.unwrap(item.Name));
        },
        on_argumentChange: function (item) {
            model.item.ArgumentName(ko.unwrap(item.Name));
        }
    }

    //model.item.ProductArgumentId.subscribe()

    page.load.add(function () {
        return services.shopping.productGroups.select().done(function (data) {
            ko.mapping.fromJS(data, {}, model.items);
        });
    });

    $.when(services.shopping.getProductDefines(), services.shopping.productArguments.select())
     .done(function (product_defines, product_arguments) {
         //product_defines.unshift({ Name: '请选择产品属性' });
         //product_arguments.unshift({ Name: '请选择产品参数' });
         model.productDefines(product_defines);
         model.productArguments(product_arguments);
     });

    ko.applyBindings(model, page.node());

});