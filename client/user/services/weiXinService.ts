import { Service, parseUrlParams } from 'userServices/service';

var ua = navigator.userAgent.toLowerCase();
export let isWeixin = (ua.match(/MicroMessenger/i) as any) == 'micromessenger';

export function createWeixinClient(weixin: WeiXinService) {
    return new Promise<jweixin>((resolve, reject) => {
        var config = {
            debug: false,
            nonceStr: 'mystore',
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'getLocation', 'chooseImage', 'getLocalImgData']
        };

        requirejs(['jweixin'], function (wx: jweixin) {
            var url = encodeURIComponent(location.href.split('#')[0]);
            weixin.jsSignature(config.nonceStr, url).then(function (obj) {
                config = Object.assign(config, obj);
                wx.config(config);
                wx.ready(function () {
                    resolve(wx);
                });
                wx.error((res) => {
                    let error = new Error();
                    error.message = res.errMsg;
                    reject(error);
                });
            });
        }, function (err) {
            reject(err);
        })
    })
}

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
    jsSignature = (noncestr, url) => {
        var data = { noncestr: noncestr, url: url };
        let u = this.url('WeiXin/GetJsSignature');
        return this.get(u, data);
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
