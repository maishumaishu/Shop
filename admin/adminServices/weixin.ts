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

import { Service } from 'adminServices/service';

let headers = {};
if (Service.token)
    headers['user-token'] = Service.token;

if (location.search) {
    headers['application-key'] = location.search.substr(1);
}

$.ajaxSettings.headers = headers;

export class WebXinService extends Service {
    getSetting() {
        return $.ajax({
            url: Service.config.weixinUrl + 'WeiXin/GetSetting'
        });
    }
    saveSetting(setting) {
        return $.ajax({
            url: Service.config.weixinUrl + 'WeiXin/SaveSetting',
            data: setting
        });
    }
    getMessageTemplateTypes() {
        return $.ajax({
            url: Service.config.weixinUrl + 'WeiXin/GetMessageTemplateTypes'
        });
    }
}

export default new WebXinService();