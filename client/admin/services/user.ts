import { default as Service } from 'services/service';
import { userInfo } from 'userServices/memberService';
// import { LoginResult } from 'adminServices/weixin';

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
    // user: { mobile: string, password: string },
    username: string,
    password: string,
    smsId: string,
    verifyCode: string
}

export interface Application {
    Id: string,
    Name: string
}

export interface Seller {
    Id: string,
    UserName: string,
    OpenId: string,
    Mobile: string,
    Email: string,
}

let { protocol } = location;
export class UserService extends Service {
    private url(path: string) {
        let url = `${protocol}//${Service.config.serviceHost}/${path}`;
        return url;
    }
    login(username: string, password: string) {
        let url = `${Service.config.memberUrl}Seller/Login`;
        return this.ajax<LoginResult>(url, { data: { username, password }, method: 'post' })
            .then(d => {
                Service.token.value = d.token;
            });
    }
    async register(model: RegisterModel) {
        let url = `${Service.config.memberUrl}/Seller/Register`;
        let result = await this.postByJson<{ token: string, userId: string, appToken: string }>(url, model)
        Service.token.value = result.token;
        return result;
    }
    async registerById(sellerId: string) {
        console.assert(sellerId != null);
        let url = `${Service.config.memberUrl}/Seller/RegisterById`;
        let result = await this.postByJson<LoginResult>(url, { sellerId });
        Service.token.value = result.token;
        return result;
    }
    private createApplication() {
        let url = `${protocol}//${Service.config.serviceHost}/application/add`;
        return this.postByJson<{ token: string }>(url, { name: guid() });
    }
    isMobileRegister(mobile: string) {
        let url = `${protocol}//${Service.config.serviceHost}/admin/isMobileRegister`;
        return this.get<boolean>(url, { mobile });
    }
    sendVerifyCode(mobile: string) {
        let url = `${protocol}//${Service.config.serviceHost}/sms/sendVerifyCode`;
        return this.putByJson<{ smsId: string }>(url, { mobile, type: 'register' });
    }
    applications(): Promise<Array<Application>> {
        let url = `${Service.config.memberUrl}Seller/GetApplications`;
        return this.get<Application[]>(url);
    }
    addApplication(app: Application) {
        let url = `${Service.config.memberUrl}Seller/AddApplication`;
        return this.postByJson(url, { name: app.Name }).then(data => {
            Object.assign(app, data);
            return data;
        });
    }
    updateApplication(app: Application) {
        let url = this.url('application/update');
        return this.putByJson(url, { app });
    }
    deleteApplication(app: Application) {
        console.assert(app != null)
        let url = `${Service.config.memberUrl}Seller/DeleteApplication`;
        return this.deleteByJson(url, { applicationId: app.Id });
    }
    recharge(userId: string, amount: number): Promise<{ Balance: number }> {
        let url = Service.config.accountUrl + 'Account/Recharge';
        return this.putByJson(url, { userId, amount });
    }
    async members(args: wuzhui.DataSourceSelectArguments) {

        let url = `${Service.config.memberUrl}Member/List`;
        let users = await this.getByJson<wuzhui.DataSourceSelectResult<UserInfo>>(url, args);
        let userIds = users.dataItems.map(o => o.Id)
        let url1 = `${Service.config.accountUrl}Account/GetAccountBalances`;
        let accounts = await this.getByJson<Account[]>(url1, { userIds });
        for (let i = 0; i < users.dataItems.length; i++) {
            let account = accounts[i];
            if (account == null)
                continue;

            users.dataItems[i].Balance = account.Balance;
        }

        return users;
    }
    me(): Promise<Seller> {
        let url = `${Service.config.memberUrl}Seller/Me`;

        let url1 = `${Service.config.weixinUrl}Member/GetSeller`;
        return Promise.all([this.get<Seller>(url), this.get<{ OpenId }>(url1)]).then(args => {
            args[1] = args[1] || {} as any;
            args[0].OpenId = args[1].OpenId;
            return args[0];
        })
    }
    // weixinBind(openId: string) {
    //     let url = `${Service.config.memberUrl}Seller/Bind`;
    //     return this.put(url, { openId });
    // }
    // weixinUnbind(openId: string) {
    //     let url = `${Service.config.memberUrl}Seller/Unbind`;
    //     return this.put(url, { openId });
    // }
}

// export default new UserService();