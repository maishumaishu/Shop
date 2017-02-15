chitu.action(['sv/ShopAdmin'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    page.load.add(function () {
        services.shopAdmin.logout().done(function () {
            app.redirect('User/Login')
        });
    })

});