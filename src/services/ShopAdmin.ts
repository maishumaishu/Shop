
import Service = require('services/Service');

class ShopAdmin extends Service {
    login(username, password) {
        debugger;
        return $.ajax({ url: 'User/GetAppToken', method: 'post' }).pipe(function (appToken) {
            debugger;
            $.cookie('AppToken', appToken);
            var url = Service.config.memberUrl + 'Admin/GetAdminToken';
            return $.ajax({
                url: url,
                dataType: "json",
                data: { appToken: appToken, username: username, password: password }
            });
        }).done(function (userToken) {
            $.cookie('Token', userToken);
        })
    }
    logout() {
        Service.appToken = '';
        Service.token = '';
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


