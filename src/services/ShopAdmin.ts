
import Service = require('services/Service');

class ShopAdmin extends Service {

    logout() {
        Service.set_token(undefined);
        Service.set_userId(undefined);
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


