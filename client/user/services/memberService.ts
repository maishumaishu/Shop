import { Service, config, tokens } from 'userServices/service';
// import { userData } from 'user/services/userData';
export type VerifyCodeType = 'reigster' | 'changeMobile';

export let userInfo = new chitu.ValueStore<UserInfo>();
export class MemberService extends Service {

    private url(path: string) {
        return `UserMember/${path}`;
    }

    userInfo(): Promise<UserInfo> {
        let url1 = this.url('Member/CurrentUserInfo');
        let url2 = `user/userInfo`;
        return Promise.all([this.get<UserInfo>(url1), this.get<{ mobile }>(url2)])
            .then((data) => {
                data[0].Mobile = data[1].mobile;
                return data[0];
            });
    }

    saveUserInfo(userInfo): Promise<any> {
        let url = this.url('Member/SaveUserInfo');
        return this.put(url, { userInfo });
    }

    // logout() {
    //     userData.userToken.value = '';
    // }

    sentVerifyCode(mobile: string, type: VerifyCodeType): Promise<{ smsId: string }> {
        console.assert(mobile != null);
        let url = `sms/sendVerifyCode`;
        return this.get(url, { mobile, type });
    }

    checkVerifyCode(smsId: string, verifyCode: string) {
        let url = `sms/checkVerifyCode`;
        return this.get(url, { smsId, verifyCode });
    }


    /** 发送验证码到指定的手机 */
    sentRegisterVerifyCode(mobile: string): Promise<{ smsId: string }> {
        // console.assert(mobile != null);
        // let url = `http://${config.service.host}/sms/sendVerifyCode`;
        // return this.get(url, { mobile, type: 'register' });
        return this.sentVerifyCode(mobile, 'reigster');
    }

    /** 用户注册 */
    register(data: RegisterModel) {
        console.assert(data != null);
        let url = `user/register`;
        return this.postByJson<{ token: string, userId: string }>(url, data).then((data) => {
            tokens.userToken.value = data.token;
            return data;
        });
    }

    login(username: string, password: string): Promise<{ token: string, userId: string }> {
        let url = `user/login`;
        return this.post<{ token: string, userId: string }>(url, { username, password }).then((result) => {
            tokens.userToken.value = result.token;
            return result;
        });
    }

    resetPassword(mobile: string, password: string, smsId: string, verifyCode: string) {
        let url = `user/resetPassword`;
        return this.put(url, { mobile, password, smsId, verifyCode }).then(data => {
            debugger;
            return data;
        });
    }

    changePassword(password: string, smsId: string, verifyCode: string) {
        let url = `user/changePassword`;
        return this.put(url, { password, smsId, verifyCode }).then(data => {
            debugger;
            return data;
        });
    }

    changeMobile(mobile: string, smsId: string, verifyCode: string) {
        let url = `user/changeMobile`;
        return this.put(url, { mobile, smsId, verifyCode });
    }

}

let loadUserInfo = function () {
    let member = new MemberService();
    member.userInfo().then(data => {
        userInfo.value = data;
    });
}
if (tokens.userToken.value) {
    loadUserInfo();
}

tokens.userToken.add(() => loadUserInfo());

// let member = Service.createService(MemberService);
// member.userInfo().then((o: UserInfo) => {
//     // userData.toEvaluateCount.value = o.ToEvaluateCount;
//     // userData.sendCount.value = o.SendCount;
//     // userData.notPaidCount.value = o.NotPaidCount;
//     // userData.balance.value = 0;
//     userData.nickName.value = o.NickName;
//     userData.score.value = 0;
// })