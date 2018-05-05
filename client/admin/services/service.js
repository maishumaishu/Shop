define(["require", "exports", "maishu-chitu", "share/common", "share/service", "share/common"], function (require, exports, chitu, common_1, service_1, common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.guid = common_2.guid;
    exports.imageUrl = common_2.imageUrl;
    exports.parseUrlParams = common_2.parseUrlParams;
    exports.formatDate = common_2.formatDate;
    exports.formatDateTime = common_2.formatDateTime;
    exports.systemWeiXinAppId = 'wx30ac5294d9f38751';
    let username = new chitu.ValueStore();
    username.value = localStorage['username'];
    username.add((value) => {
        localStorage['username'] = value;
    });
    let remote_service_host = common_1.serviceHost;
    let { protocol } = location;
    class Service extends service_1.default {
        constructor() {
            super();
        }
        ajax(url, options) {
            options = options || {};
            options.headers = options.headers || {};
            console.assert(Service.token != null);
            if (Service.token.value)
                options.headers['token'] = Service.token.value;
            if (location.search) {
                let query = common_1.parseUrlParams(location.search.substr(1));
                if (query['appKey']) {
                    options.headers['application-id'] = query['appKey'];
                }
            }
            return super.ajax(url, options);
        }
        static get appToken() {
            return common_1.urlParams.appKey;
        }
        static get adminName() {
            return username;
        }
    }
    Service.error = chitu.Callbacks();
    Service.config = {
        serviceHost: remote_service_host,
        shopUrl: `${protocol}//${remote_service_host}/AdminShop/`,
        weixinUrl: `${protocol}//${remote_service_host}/AdminWeiXin/`,
        siteUrl: `${protocol}//${remote_service_host}/AdminSite/`,
        memberUrl: `${protocol}//${remote_service_host}/AdminMember/`,
        accountUrl: `${protocol}//${remote_service_host}/AdminAccount/`,
    };
    // static get token() {
    //     return localStorage['adminToken'];
    // };
    // static set token(value: string) {
    //     if (value === undefined) {
    //         localStorage.removeItem('adminToken');
    //         return;
    //     }
    //     localStorage.setItem('adminToken', value);
    // }
    Service.token = new chitu.ValueStore(localStorage['adminToken']);
    exports.Service = Service;
    Service.token.add((value) => {
        debugger;
        localStorage.setItem("adminToken", value);
    });
    exports.default = Service;
});
