chitu.action(['sv/ShopAdmin', 'site', 'ko.val'], function (page) {
    /// <param name="page" type="chitu.Page"/>
    var $ctrls = $('#sidebar, #breadcrumbs, #navbar-container > [role="navigation"]');
    var model = {
        username: ko.observable(''),//admin
        password: ko.observable(''),
        login: function () {
            if (!model.isValid())
                return val.showAllMessages();

            return services.shopAdmin.login(model.username(), model.password())
                           .done(function () {
                               $('#navbar').find('[name="username"]').text(model.username());
                               app.redirect(site.config.startUrl);
                               $ctrls.show();
                           });
        }
    };

    model.username.extend({ required: true });
    model.password.extend({ required: true });
    var val = ko.validation.group(model);

    ko.applyBindings(model, page.node());
    page.load.add(function () {
        $ctrls.hide();
    });
});