var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ua = navigator.userAgent.toLowerCase();
    exports.isWeixin = ua.match(/MicroMessenger/i) == 'micromessenger';
    function createWeixinClient(weixin) {
        return new Promise((resolve, reject) => {
            var config = {
                debug: false,
                nonceStr: 'mystore',
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'getLocation', 'chooseImage', 'getLocalImgData']
            };
            requirejs(['jweixin'], function (wx) {
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
            });
        });
    }
    exports.createWeixinClient = createWeixinClient;
    class WeiXinService extends service_1.Service {
        constructor() {
            super();
        }
        url(path) {
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
        login(code) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('Member/Login');
                let result = yield this.postByJson(url, { code });
                let userId = result.UserId;
                if (userId) {
                    let url = `UserMember/User/RegisterById`;
                    result = yield this.postByJson(url, { userId });
                }
                service_1.tokens.userToken.value = result.token;
                return result;
            });
        }
    }
    exports.WeiXinService = WeiXinService;
});
