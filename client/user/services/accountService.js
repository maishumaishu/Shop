define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AccountService extends service_1.Service {
        url(path) {
            return `UserAccount/${path}`;
        }
        // /**
        //  * 获取用户账户的余额
        //  */
        // balance = () => {
        //     return userData.balance;
        // }
        balanceDetails() {
            return this.getByJson(this.url('Account/GetBalanceDetails'), {});
        }
        scoreDetails() {
            return this.getByJson(this.url('Account/GetScoreDetails'), {});
        }
        account() {
            return this.getByJson(this.url('Account/GetAccount'));
        }
        payOrder(orderId, amount) {
            let url = this.url('Account/PayOrder');
            return this.putByJson(url, { orderId, amount });
        }
    }
    exports.AccountService = AccountService;
});
