import service = require('services/Service');

interface RegisterModel {
    user: { mobile: string, password: string },
    smsId: string,
    verifyCode: string
}

class UserService {
    register(model: RegisterModel) {
        (model.user as any).group = 'seller';
        let url = `http://${service.config.serviceHost}/user/register`;
        return service.postAsJson<{ token: string, userId: string }>(url, model)
        .then((result)=>{
            service.token = result.token;
            service.userId = result.userId;
        });
    }
}

export = new UserService();