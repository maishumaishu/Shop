import { default as Service } from 'services/service';
import { userInfo } from 'userServices/memberService';

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
    Id: string,
    Name: string
}

let { protocol } = location;
export class UserService extends Service {
    private url(path: string) {
        let url = `${protocol}//${Service.config.serviceHost}/${path}`;
        return url;
    }
    login(username, password) {
        let url = `${Service.config.memberUrl}Seller/Login`;
        return this.ajaxByForm<{ token: string }>(url, { username, password }, 'post')
            .then(d => {
                Service.token = d.token;
            });
    }
    async register(model: RegisterModel) {
        (model.user as any).group = 'owner';
        let url = `${Service.config.serviceHost}/admin/register`;
        return this.postByJson<{ token: string, userId: string, appToken: string }>(url, model)
            .then((result) => {
                // Service.appToken = result.appToken;
                Service.token = result.token;
                // Service.userId = result.userId;
            });
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
        // let url = this.url(`application/list`);
        let url = `${Service.config.memberUrl}Seller/GetApplications`;//this.url('admin/applications')
        return this.get<Application[]>(url);
    }
    addApplication(app: Application) {
        let url = this.url('admin/addApplication');
        return this.postByJson(url, { app }).then(data => {
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
        let url = this.url('admin/deleteApplication');
        return this.deleteByJson(url, { appId: app.Id });
    }
    recharge(userId: string, amount: number): Promise<{ Balance: number }> {
        let url = Service.config.accountUrl + 'Account/Recharge';
        return this.putByJson(url, { userId, amount });
    }
    async members(args: wuzhui.DataSourceSelectArguments) {

        let url = `${location.protocol}//${Service.config.serviceHost}/user/list`;
        let users = await this.get<User[]>(url, args);

        let ids = users.map(o => o._id);
        let memberBalances = await this.get<{ Id: string, Balance: number }[]>(
            Service.config.accountUrl + 'Account/GetAccountBalances',
            { userIds: ids.join(',') }
        );

        let members = new Array<UserInfo>();//.dataItems;
        for (let i = 0; i < users.length; i++) {
            console.assert(users.length == memberBalances.length);

            let u = {} as UserInfo;
            let r = memberBalances[i];
            if (r) {
                u.Balance = r.Balance;
                u.Id = r.Id;
            }

            u.Id = u.Id || users[i]._id;
            u.Mobile = users[i].mobile;
            u.Balance = u.Balance || 0;
            members.push(u);
        }

        return members;
        // let url = this.url('AdminMember/Member/GetUserInfos');
        // return this.get<wuzhui.DataSourceSelectResult<UserInfo>>(url, args);
    }


}

export default new UserService();