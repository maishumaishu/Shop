var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    let { protocol } = location;
    class UserService extends service_1.default {
        url(path) {
            let url = `${protocol}//${service_1.default.config.serviceHost}/${path}`;
            return url;
        }
        login(username, password) {
            let url = `${service_1.default.config.memberUrl}Seller/Login`;
            return this.postByJson(url, { username, password })
                .then(d => {
                service_1.default.token.value = d.token;
            });
        }
        register(model) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `${service_1.default.config.memberUrl}Seller/Register`;
                let result = yield this.postByJson(url, model);
                service_1.default.token.value = result.token;
                return result;
            });
        }
        registerById(sellerId) {
            return __awaiter(this, void 0, void 0, function* () {
                console.assert(sellerId != null);
                let url = `${service_1.default.config.memberUrl}Seller/RegisterById`;
                let result = yield this.postByJson(url, { sellerId });
                service_1.default.token.value = result.token;
                return result;
            });
        }
        resetPassword(model) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `${service_1.default.config.memberUrl}Seller/resetPassword`;
                let result = yield this.postByJson(url, model);
                service_1.default.token.value = result.token;
                return result;
            });
        }
        createApplication() {
            let url = `${protocol}//${service_1.default.config.serviceHost}/application/add`;
            return this.postByJson(url, { name: guid() });
        }
        isMobileRegister(mobile) {
            let url = `${service_1.default.config.memberUrl}Seller/IsRegister`;
            debugger;
            return this.get(url, { username: mobile });
        }
        sendVerifyCode(mobile) {
            let url = `${service_1.default.config.memberUrl}Seller/SendVerifyCode`;
            return this.postByJson(url, { mobile, type: 'Register' });
        }
        applications() {
            let url = `${service_1.default.config.memberUrl}Seller/GetApplications`;
            return this.get(url);
        }
        addApplication(app) {
            let url = `${service_1.default.config.memberUrl}Seller/AddApplication`;
            return this.postByJson(url, { name: app.Name }).then(data => {
                Object.assign(app, data);
                return data;
            });
        }
        updateApplication(app) {
            let url = this.url('Seller/UpdateApplication');
            return this.putByJson(url, { app });
        }
        deleteApplication(app) {
            console.assert(app != null);
            let url = `${service_1.default.config.memberUrl}Seller/DeleteApplication`;
            return this.deleteByJson(url, { applicationId: app.Id });
        }
        recharge(userId, amount) {
            let url = service_1.default.config.accountUrl + 'Account/Recharge';
            return this.putByJson(url, { userId, amount });
        }
        members(args) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `${service_1.default.config.memberUrl}Member/List`;
                let users = yield this.getByJson(url, args);
                let userIds = users.dataItems.map(o => o.Id);
                let url1 = `${service_1.default.config.accountUrl}Account/GetAccountBalances`;
                let accounts = yield this.getByJson(url1, { userIds });
                for (let i = 0; i < users.dataItems.length; i++) {
                    let account = accounts[i];
                    if (account == null)
                        continue;
                    users.dataItems[i].Balance = account.Balance;
                }
                return users;
            });
        }
        me() {
            let url = `${service_1.default.config.memberUrl}Seller/Me`;
            let url1 = `${service_1.default.config.weixinUrl}Member/GetSeller`;
            return Promise.all([this.get(url), this.get(url1)]).then(args => {
                args[1] = args[1] || {};
                args[0].OpenId = args[1].OpenId;
                return args[0];
            });
        }
    }
    exports.UserService = UserService;
});
// export default new UserService(); 
