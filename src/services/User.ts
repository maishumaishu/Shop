import Service = require('services/Service');

interface RegisterModel {
    user: { mobile: string, password: string },
    smsId: string,
    verifyCode: string
}

class UserService {
    login(username, password) {
        let url = `http://${Service.config.serviceHost}/user/login`;
        return Service.get<{ token: string, userId: string }>(url, { username, password }).then((o) => {
            Service.set_token(o.token);
            Service.set_userId(o.userId);
            Service.username.value = username;
        })
    }
    register(model: RegisterModel) {
        (model.user as any).group = 'seller';
        let url = `http://${Service.config.serviceHost}/user/register`;
        return Service.postByJson<{ token: string, userId: string }>(url, model)
            .then((result) => {
                Service.set_token(result.token);
                Service.set_userId(result.userId);
            });
    }
}

export = new UserService();