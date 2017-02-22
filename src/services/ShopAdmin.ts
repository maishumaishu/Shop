
import Service = require('services/Service');

class ShopAdmin extends Service {
    login(username, password) {
        let url = `http://${Service.config.serviceHost}/user/login`;
        return Service.getAsJson<{ token: string, userId: string }>(url, { username, password }).then((o) => {
            Service.token = o.token;
            Service.userId = o.userId;
        })

    }
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


