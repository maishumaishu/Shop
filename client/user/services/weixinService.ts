import { Service, tokens } from 'userServices/service';

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
    openid() {
        return localStorage.getItem('openid');
    }
    jsSignature(noncestr, url) {
        var data = { noncestr: noncestr, url: url };
        let u = this.url('WeiXin/GetJsSignature');
        return this.getByJson(u, data);
    }
    async login(code: string): Promise<LoginResult> {
        let url = this.url('Member/Login');
        let result = await this.postByJson<LoginResult | { UserId: string }>(url, { code });
        let userId = (result as { UserId: string }).UserId;
        if (userId) {
            let url = `UserMember/User/RegisterById`;
            result = await this.postByJson<LoginResult>(url, { userId });
        }

        tokens.userToken.value = (result as LoginResult).token;
        return result as LoginResult;
    }
}


