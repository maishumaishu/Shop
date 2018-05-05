define(["require", "exports", "admin/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AccountService extends service_1.default {
        url(path) {
            return `${service_1.default.config.accountUrl}Account/${path}`;
        }
        offlinePayOrder(orderId, userId, paymentType, amount) {
            let url = this.url('OfflinePayOrder');
            return this.put(url, { orderId, userId, paymentType, amount });
        }
    }
    exports.AccountService = AccountService;
});
