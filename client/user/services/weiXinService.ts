import { Service, parseUrlParams } from 'userServices/service';
export class WeiXinService extends Service {
    constructor() {
        super();
    }
    private url(path) {
        return `UserWeiXin/${path}`;
    }
    async openid() {
        return localStorage.getItem('openid');
    }
}


// let urlParams = {};
// if (location.search)
//     urlParams = parseUrlParams(location.search.substr(1));


// if (isWeixin && weixin.openid == null && urlParams.code == null) {
//     weixin.weixinSetting().then(setting => {
//         if (setting == null) {
//             return;
//         }

//         let appid = setting.AppId;
//         let { protocol, pathname, search, hash } = location;
//         var redirect_uri = `${protocol}//${location.pathname}${search}`;
//         var state = hash ? hash.substr(1) : '';

//         var url =
//             `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`
//         location.href = url;
//     })
// }
// else if (urlParams.code) {

// }
