// (function (factory) {
//     var references = ['sv/Services'];
//     if (typeof define === 'function' && define.amd) {
//         define(references, factory);
//     } else if (typeof module !== 'undefined' && module.exports) {
//         module.exports = factory(require(references));
//     } else {
//         factory(services);
//     }
define(["require", "exports", "admin/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let headers = {};
    if (service_1.Service.token)
        headers['user-token'] = service_1.Service.token;
    if (location.search) {
        headers['application-id'] = location.search.substr(1);
    }
    // export type LoginResult = { token: string, userId: string };
    class WeiXinService extends service_1.Service {
        url(path) {
            return `${service_1.Service.config.weixinUrl}${path}`;
        }
        getSetting() {
            let url = this.url('WeiXin/GetSetting');
            return this.get(url);
        }
        saveSetting(setting) {
            let url = this.url('WeiXin/SaveSetting');
            return this.putByJson(url, { model: setting });
        }
        getMessageTemplateTypes() {
            let url = this.url('WeiXin/GetMessageTemplateTypes');
            return this.get(url);
        }
        openId(code) {
            let url = this.url('WeiXin/GetOpenId');
            return this.get(url, { code });
        }
        /**
         * 通过 OpenId 登录
         * @param code 用于获取 OpenId 的 code
         *
         */
        login(code) {
            let url = this.url('Member/Login');
            return this.postByJson(url, { code }).then(result => {
                //token 为空表示 openid 没有绑定
                debugger;
                if (result.token != null) {
                    service_1.Service.token.value = result.token;
                }
                return result;
            });
        }
        bind(code) {
            let url = this.url('Member/Bind');
            return this.put(url, { code });
        }
        unbind(code) {
            let url = this.url('Member/Unbind');
            return this.put(url, { code });
        }
    }
    exports.WeiXinService = WeiXinService;
    exports.default = new WeiXinService();
});
