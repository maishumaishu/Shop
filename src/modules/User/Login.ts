
import shopAdmin = require('services/ShopAdmin');
import app = require('Application');
import site = require('Site');
import validation = require('knockout.validation');

export default async function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page);
    })
}

function page_load(page: chitu.Page) {
    var $ctrls = $('#sidebar, #breadcrumbs, #navbar-container > [role="navigation"]');
    var model = {
        username: ko.observable(''),//admin
        password: ko.observable(''),
        login: function () {
            if (!(model as any).isValid())
                return val.showAllMessages();

            return shopAdmin.login(model.username(), model.password())
                .done(function () {
                    $('#navbar').find('[name="username"]').text(model.username());
                    app.redirect(site.config.startUrl);
                    $ctrls.show();
                });
        }
    };

    model.username.extend({ required: true });
    model.password.extend({ required: true });
    var val = validation.group(model);

    ko.applyBindings(model, page.element);
    $ctrls.hide();
}