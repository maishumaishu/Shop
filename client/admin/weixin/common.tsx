export let socket_url = 'http://maishu.alinq.cn:8015';

export function loadjs<T>(url) {
    return new Promise<T>((resolve, reject) => {
        requirejs([url],
            function (obj: T) {
                resolve(obj);
            },
            function (err) {
                reject(err);
            }
        )
    })
}


type MessageAction = "bind" | "bind_success" | "bind_fail" |
    "unbind" | "unbind_success" | "unbind_fail" | "qrcode_scan"

export interface WebSockentMessage {
    to: string,
    from: string,
    action: string,
    data?: any,
}


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

export function getOpenId(code: string) {

}