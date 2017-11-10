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

import { Service } from 'services/service';

let headers = {};
if (Service.token)
    headers['user-token'] = Service.token;

if (location.search) {
    headers['application-key'] = location.search.substr(1);
}
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
}

export default new WeiXinService();