/// <reference path="service.ts"/>
namespace userServices {
    export type VerifyCodeType = 'reigster' | 'changeMobile';

    export interface UserInfo {
        Id: string;
        NickName: string;
        Country: string;
        Province: string;
        City: string;
        HeadImageUrl: string;
        Gender: string;
        UserId: string;
        CreateDateTime: string;
        Mobile: string
    }

    export interface RegisterModel {
        user: { mobile: string, password: string },
        smsId: string,
        verifyCode: string
    }

    export class MemberService extends Service {
        constructor() {
            super();
        }

        private url(path: string) {
            return `${config.service.member}${path}`;
        }

        userInfo(): Promise<UserInfo> {
            let url1 = this.url('Member/CurrentUserInfo');
            let url2 = `http://${config.service.host}/user/userInfo`;
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

        logout() {
            tokens.userToken = '';
        }

        sentVerifyCode(mobile: string, type: VerifyCodeType): Promise<{ smsId: string }> {
            console.assert(mobile != null);
            let url = `http://${config.service.host}/sms/sendVerifyCode`;
            return this.get(url, { mobile, type });
        }

        checkVerifyCode(smsId: string, verifyCode: string) {
            let url = `http://${config.service.host}/sms/checkVerifyCode`;
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
            let url = `http://${config.service.host}/user/register`;
            return this.post<{ token: string, userId: string }>(url, data).then((data) => {
                tokens.userToken = data.token;
                return data;
            });
        }

        login(username: string, password: string): Promise<{ token: string, userId: string }> {
            let url = `http://${config.service.host}/user/login`;
            return this.post<{ token: string, userId: string }>(url, { username, password }).then((result) => {
                tokens.userToken = result.token;
                return result;
            });
        }

        resetPassword(mobile: string, password: string, smsId: string, verifyCode: string) {
            let url = `http://${config.service.host}/user/resetPassword`;
            return this.put(url, { mobile, password, smsId, verifyCode }).then(data => {
                debugger;
                return data;
            });
        }

        changePassword(password: string, smsId: string, verifyCode: string) {
            let url = `http://${config.service.host}/user/changePassword`;
            return this.put(url, { password, smsId, verifyCode }).then(data => {
                debugger;
                return data;
            });
        }

        changeMobile(mobile: string, smsId: string, verifyCode: string) {
            let url = `http://${config.service.host}/user/changeMobile`;
            return this.put(url, { mobile, smsId, verifyCode });
        }

    }

}