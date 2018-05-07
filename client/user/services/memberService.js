var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.userInfo = new chitu.ValueStore();
    class MemberService extends service_1.Service {
        constructor() {
            super();
        }
        url(path) {
            return `UserShop/${path}`;
        }
        userInfo() {
            let url1 = this.url('User/CurrentUserInfo');
            // let url2 = `user/userInfo`;
            // return Promise.all([this.getByJson<UserInfo>(url1), this.getByJson<{ mobile }>(url2)])
            //     .then((data) => {
            //         data[0].Mobile = data[1].mobile;
            //         return data[0];
            //     });
            return Promise.resolve({});
        }
        saveUserInfo(userInfo) {
            let url = this.url('Member/SaveUserInfo');
            return this.putByJson(url, userInfo);
        }
        // logout() {
        //     userData.userToken.value = '';
        // }
        sentVerifyCode(mobile, type) {
            console.assert(mobile != null);
            let url = `sms/sendVerifyCode`;
            return this.putByJson(url, { mobile, type });
        }
        checkVerifyCode(smsId, verifyCode) {
            let url = `sms/checkVerifyCode`;
            return this.getByJson(url, { smsId, verifyCode });
        }
        /** 发送验证码到指定的手机 */
        sentRegisterVerifyCode(mobile) {
            console.assert(mobile != null);
            let url = `UserMember/SMS/SendRegisterVerifyCode`;
            return this.postByJson(url, { mobile, type: 'register' });
            // return this.sentVerifyCode(mobile, 'reigster');
        }
        /** 用户注册 */
        register(data) {
            console.assert(data != null);
            let url = `UserMember/User/Register`;
            // let { mobile, password } = data;
            let { smsId, verifyCode } = data;
            // let obj = { username: mobile, password, smsId, verifyCode };
            return this.postByJson(url, data).then((data) => {
                service_1.tokens.userToken.value = data.token;
                return data;
            });
        }
        login(username, password) {
            let url = `UserMember/User/Login`;
            return this.postByJson(url, { username, password }).then((result) => {
                service_1.tokens.userToken.value = result.token;
                return result;
            });
        }
        resetPassword(mobile, password, smsId, verifyCode) {
            let url = `user/resetPassword`;
            return this.putByJson(url, { mobile, password, smsId, verifyCode }).then(data => {
                debugger;
                return data;
            });
        }
        changePassword(password, smsId, verifyCode) {
            let url = `user/changePassword`;
            return this.putByJson(url, { password, smsId, verifyCode }).then(data => {
                debugger;
                return data;
            });
        }
        changeMobile(mobile, smsId, verifyCode) {
            let url = `user/changeMobile`;
            return this.putByJson(url, { mobile, smsId, verifyCode });
        }
        store() {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `UserMember/User/GetApplication`; //this.url('Store/Get');
                let app = yield this.getByJson(url);
                app.Data = app.Data || {};
                return app;
            });
        }
    }
    exports.MemberService = MemberService;
});
// let member = Service.createService(MemberService);
// member.userInfo().then((o: UserInfo) => {
//     // userData.toEvaluateCount.value = o.ToEvaluateCount;
//     // userData.sendCount.value = o.SendCount;
//     // userData.notPaidCount.value = o.NotPaidCount;
//     // userData.balance.value = 0;
//     userData.nickName.value = o.NickName;
//     userData.score.value = 0;
// }) 
