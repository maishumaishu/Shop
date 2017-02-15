chitu.action(['sv/Shopping', 'knockout.mapping'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    function ProductArguments() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Fields = ko.observable();
    }

    var $dlg_edit = $(page.node()).find('[name="dlg_edit"]');
    var model = {
        item: new ProductArguments(),
        items: ko.observableArray(),
        add: function () {
            $dlg_edit.modal();
        },
        edit: function (item) {
            ko.mapping.fromJS(ko.mapping.toJS(item), {}, model.item);
            item._source = model.item;
        },
        remove: function (item) {
            services.shopping.productArguments.delete(ko.mapping.toJS(item)).done(function () {
                model.items.remove(item);
            });
        },
        save: function () {
            if (model.item.Id()) {
                services.shopping.productArguments.update(ko.mapping.toJS(model.item)).done(function (data) {
                    ko.mapping.fromJS(data, {}, model.item._source);
                });
            }
            else {
                services.shopping.productArguments.insert(ko.mapping.toJS(model.item)).done(function (data) {
                    model.items.push(ko.mapping.fromJS(data));
                });
            }
        }
    };

    page.load.add(function () {
        return services.shopping.productArguments.select().done(function (data) {
            //model.items(ko.mapping.fromJS(data));
            ko.mapping.fromJS(data, {}, model.items);
        });
    });

    ko.applyBindings(model, page.node());
});