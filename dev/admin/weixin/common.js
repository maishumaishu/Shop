// export let socket_url = 'http://maishu.alinq.cn:8015';
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function loadjs(url) {
        return new Promise((resolve, reject) => {
            requirejs([url], function (obj) {
                resolve(obj);
            }, function (err) {
                reject(err);
            });
        });
    }
    exports.loadjs = loadjs;
    // export class WeiXinEvent {
    //      name = 'weixin'
    //     static WeiXinBinding = 'weixin_binding'
    //     static WeiXinUnbind = 'weixin_unbind'
    // }
    // export const WeiXinEvent = {
    //     name: 'weixin',
    //     bind: 'bind',
    //     qrcodeScan: 'qrcode_scan'
    // }
    function getOpenId(code) {
    }
    exports.getOpenId = getOpenId;
});
