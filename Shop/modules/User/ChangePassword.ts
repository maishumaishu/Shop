// chitu.action(['ko.val','sv/ShopAdmin'], function (page) {
//     /// <param name="page" type="chitu.Page"/>
//     //services.shopping. modifyPassword



// });

import adminService = require('services/ShopAdmin');

class PageModel {
    private validation: KnockoutValidationErrors;

    password = ko.observable();
    confirmPassword = ko.observable();

    constructor() {
        this.password.extend({ required: true });
        this.confirmPassword.extend({
            equal: {
                onlyIf: () => {
                    return this.password() != null;
                },
                params: this.password,
                message: '两次输入的密码不同'
            }
        });

        this.validation = ko.validation.group(this);
    }


    changePassword(model: PageModel) {
        if (!(<any>model).isValid()) {
            this.validation.showAllMessages();
            return;
        }

        return adminService.changePassword(model.password());
    }
}

class ChangePasswordPage extends chitu.Page {
    constructor(params) {
        super(params);
    }

    private page_load(page: ChangePasswordPage, args) {
        var model = new PageModel();
        ko.applyBindings(model, page.element);
    }
}

export = ChangePasswordPage;