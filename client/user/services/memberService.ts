import { Service, config, tokens } from 'user/services/service';
export type VerifyCodeType = 'reigster' | 'changeMobile';

export let userInfo = new chitu.ValueStore<UserInfo>();
export class MemberService extends Service {

    constructor() {
        super();
    }

    private url(path: string) {
        return `UserShop/${path}`;
    }

    userInfo(): Promise<UserInfo> {
        let url1 = this.url('User/CurrentUserInfo');
        // let url2 = `user/userInfo`;
        // return Promise.all([this.getByJson<UserInfo>(url1), this.getByJson<{ mobile }>(url2)])
        //     .then((data) => {
        //         data[0].Mobile = data[1].mobile;
        //         return data[0];
        //     });
        return Promise.resolve({} as UserInfo);
    }

    saveUserInfo(userInfo): Promise<any> {
        let url = this.url('Member/SaveUserInfo');
        return this.putByJson(url, userInfo);
    }

    // logout() {
    //     userData.userToken.value = '';
    // }

    sentVerifyCode(mobile: string, type: VerifyCodeType): Promise<{ smsId: string }> {
        console.assert(mobile != null);
        let url = `sms/sendVerifyCode`;
        return this.putByJson(url, { mobile, type });
    }

    checkVerifyCode(smsId: string, verifyCode: string) {
        let url = `sms/checkVerifyCode`;
        return this.getByJson(url, { smsId, verifyCode });
    }


    /** 发送验证码到指定的手机 */
    sentRegisterVerifyCode(mobile: string): Promise<{ SmsId: string }> {
        console.assert(mobile != null);
        let url = `UserMember/SMS/SendRegisterVerifyCode`;
        return this.postByJson(url, { mobile, type: 'register' });
        // return this.sentVerifyCode(mobile, 'reigster');
    }

    /** 用户注册 */
    register(data: RegisterModel) {
        console.assert(data != null);
        let url = `UserMember/User/Register`;
        // let { mobile, password } = data;
        let { smsId, verifyCode } = data;

        // let obj = { username: mobile, password, smsId, verifyCode };
        return this.postByJson<{ token: string }>(url, data).then((data) => {
            tokens.userToken.value = data.token;
            return data;
        });
    }

    login(username: string, password: string): Promise<LoginResult> {
        let url = `UserMember/User/Login`;
        return this.postByJson<LoginResult>(url, { username, password }).then((result) => {
            tokens.userToken.value = result.token;
            return result;
        });
    }

    resetPassword(mobile: string, password: string, smsId: string, verifyCode: string) {
        let url = `user/resetPassword`;
        return this.putByJson(url, { mobile, password, smsId, verifyCode }).then(data => {
            debugger;
            return data;
        });
    }

    changePassword(password: string, smsId: string, verifyCode: string) {
        let url = `user/changePassword`;
        return this.putByJson(url, { password, smsId, verifyCode }).then(data => {
            debugger;
            return data;
        });
    }

    changeMobile(mobile: string, smsId: string, verifyCode: string) {
        let url = `user/changeMobile`;
        return this.putByJson(url, { mobile, smsId, verifyCode });
    }

    private _store: Store;
    async store() {
        if (this._store) {
            return this._store;
        }
        let url = `UserMember/User/GetApplication`;
        let app = await this.getByJson<Store>(url);
        app.Data = app.Data || {} as any;
        this._store = app;
        return this._store;
    }
}

