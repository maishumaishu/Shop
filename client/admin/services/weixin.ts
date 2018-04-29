// (function (factory) {
//     var references = ['sv/Services'];
//     if (typeof define === 'function' && define.amd) {
//         define(references, factory);
//     } else if (typeof module !== 'undefined' && module.exports) {
//         module.exports = factory(require(references));
//     } else {
//         factory(services);
//     }

// })(function () {

//     if (arguments.length > 0 && window.services == null) {
//         window.services = arguments[0];
//     }

//     services.weixin = {

//     };

//     return services;
// });

import { Service } from 'admin/services/service';
import { tokens } from 'user/services/service';

let headers = {};
if (Service.token)
    headers['user-token'] = Service.token;

if (location.search) {
    headers['application-id'] = location.search.substr(1);
}

// export type LoginResult = { token: string, userId: string };
export class WeiXinService extends Service {
    url(path) {
        return `${Service.config.weixinUrl}${path}`;
    }
    getSetting() {
        let url = this.url('WeiXin/GetSetting');
        return this.get<WeiXinSetting>(url);
    }
    saveSetting(setting: WeiXinSetting) {
        let url = this.url('WeiXin/SaveSetting');
        return this.putByJson(url, { model: setting });
    }
    getMessageTemplateTypes() {
        let url = this.url('WeiXin/GetMessageTemplateTypes');
        return this.get<any[]>(url);
    }
    openId(code: string): Promise<string> {
        let url = this.url('WeiXin/GetOpenId');
        return this.get<string>(url, { code });
    }

    /**
     * 通过 OpenId 登录
     * @param code 用于获取 OpenId 的 code
     * 
     */
    login(code: string): Promise<LoginResult | { SellerId: string }> {
        let url = this.url('Member/Login');
        return this.postByJson<LoginResult | { SellerId: string }>(url, { code }).then(result => {
            //token 为空表示 openid 没有绑定
            debugger;
            if ((result as LoginResult).token != null) {
                Service.token.value = (result as LoginResult).token;
            }
            return result;
        });
    }
    bind(code: string) {
        let url = this.url('Member/Bind');
        return this.put<{ OpenId }>(url, { code });
    }
    unbind(code: string) {
        let url = this.url('Member/Unbind');
        return this.put<any>(url, { code });
    }
}

export default new WeiXinService();