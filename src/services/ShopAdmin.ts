
import Service = require('services/Service');

class ShopAdmin extends Service {

    logout() {
        Service.token = undefined;
        Service.userId = undefined;
        return $.Deferred().resolve();
    }
    changePassword(password) {
        let url = Service.config.memberUrl + 'Admin/ChangePassword';
        let data = {
            newPassword: password
        };

        return this.ajax({ url, data });
    }
}

export = new ShopAdmin();


