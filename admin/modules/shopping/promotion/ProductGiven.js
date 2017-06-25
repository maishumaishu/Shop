chitu.action(['sv/Activity', 'sv/Shopping'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    var $dlg_product_input = $(page.node()).find('[name="dlg_product_input"]');
    var $dlg_product_confirm = $(page.node()).find('[name="dlg_product_confirm"]');
    var model = {
        back: function () {
            app.back({}).fail(function () {
                location.href = '#Shopping/Promotion/ActivityEdit';
            });
        },
        product: {
            Id: ko.observable(),
            Name: ko.observable(),
            Price: ko.observable(),
            NewPrice: ko.observable()
        },
        add: function () {
            $dlg_product_input.modal();
        },
        ok: function () {
            services.shopping.getProduct(model.product.Id()).then(function (data) {
                return ko.mapping.toJS(data);
            }).done(function (data) {
                ko.mapping.fromJS(data, {}, model.product);
                model.product.NewPrice(new Number(model.product.NewPrice()).valueOf());
                $dlg_product_input.modal('hide');
                $dlg_product_confirm.modal();
            });

        },
        confirm: function () {
            $dlg_product_confirm.modal('hide');
        }
    }
    //services.shopping.
    ko.applyBindings(model, page.node());

});