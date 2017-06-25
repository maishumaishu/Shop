import { default as Service } from 'service';

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export interface RegisterModel {
    user: { mobile: string, password: string },
    smsId: string,
    verifyCode: string
}

export interface Application {
    _id: string,
    name: string,
    token: string,
}

export interface UserInfo {
    Id: string,
    Balance: number,
    Gender: string,
    UserId: string,
}

export class UserService {
    private url(path: string) {
        let url = `http://${Service.config.serviceHost}/${path}`;
        return url;
    }
    login(username, password) {
        let url = `http://${Service.config.serviceHost}/admin/login`;
        return Service.get<{ token: string, userId: string, appToken: string }>(url, { username, password }).then((o) => {
            Service.token = o.token;
            Service.userId = o.userId;
            Service.username.value = username;
            // Service.appToken = o.appToken;
        })
    }
    async register(model: RegisterModel) {
        (model.user as any).group = 'owner';
        let url = `http://${Service.config.serviceHost}/admin/register`;
        return Service.postByJson<{ token: string, userId: string, appToken: string }>(url, model)
            .then((result) => {
                // Service.appToken = result.appToken;
                Service.token = result.token;
                Service.userId = result.userId;
            });
    }
    private createApplication() {
        let url = `http://${Service.config.serviceHost}/application/add`;
        return Service.postByJson<{ token: string }>(url, { name: guid() });
    }
    isMobileRegister(mobile: string) {
        let url = `http://${Service.config.serviceHost}/admin/isMobileRegister`;
        return Service.get<boolean>(url, { mobile });
    }
    sendVerifyCode(mobile: string) {
        let url = `http://${Service.config.serviceHost}/sms/sendVerifyCode`;
        return Service.putByJson<{ smsId: string }>(url, { mobile, type: 'register' });
    }
    applications(): Promise<Array<Application>> {
        let url = this.url(`application/list`);
        return Service.get<Application[]>(url);
    }
    addApplication(app: Application) {
        let url = this.url('application/add');
        return Service.postByJson(url, { app }).then(data => {
            Object.assign(app, data);
            return data;
        });
    }
    updateApplication(app: Application) {
        let url = this.url('application/update');
        return Service.putByJson(url, { app });
    }
    deleteApplication(app: Application) {
        let url = this.url('application/delete');
        return Service.delete(url, { id: app._id });
    }
    recharge(userId: string, amount: number) {
        let url = Service.config.accountUrl + 'Account/Recharge';
        return Service.put(url, { userId, amount });
    }
    async members(args: wuzhui.DataSourceSelectArguments) {

        let membersResult = await Service.get<wuzhui.DataSourceSelectResult<UserInfo>>(
            Service.config.memberUrl + 'Member/List',
            args
        );

        let members = membersResult.dataItems;
        let ids = members.map(o => o.Id);
        let memberBalances = await Service.get<Array<{ MemberId: string, Balance: number }>>(
            Service.config.accountUrl + 'Account/GetAccountBalances',
            { userIds: ids.concat(',') }
        );

        for (let i = 0; i < members.length; i++) {
            members[i].Balance = (memberBalances.filter(o => o.MemberId == members[i].Id)[0] || { Balance: 0 } as UserInfo).Balance;
        }

        return members;
    }
}

export default new UserService();