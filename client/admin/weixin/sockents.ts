// import { parseUrlParams, websocketUrl } from 'share/common';
// import { loadjs, WebSockentMessage } from 'weixin/common'
// import { Service, systemWeiXinAppId } from 'services/service';

// export function getPCSocket() {
//     return new Promise((resolve, reject) => {
//         requirejs(['socket.io'],
//             (io) => {
//                 var socket = io(websocketUrl);
//                 resolve(socket);


//                 let { protocol, hostname, pathname, port } = location;
//                 socket.on('connect', () => {
//                     console.log(socket.id);
//                     let appid = systemWeiXinAppId;
//                     let redirect_uri = encodeURIComponent(`${protocol}//${hostname}${pathname}weixin/?from=${socket.id}#${options.mobilePageName}`);
//                     let auth_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`
//                     // qrcodeDialog.setUrl(auth_url);

//                 })
//                 socket.on('weixin', (msg: WebSockentMessage) => {
//                     let data: any = msg.data;
//                     switch (msg.action) {
//                         case `${action}_execute`:
//                             options.callback(data.code)
//                                 .then(() => {
//                                     // 发送消息，告诉手机端执行成功
//                                     console.assert(msg.from != socket.id)
//                                     qrcodeDialog.hide();
//                                     let success_msg: WebSockentMessage = {
//                                         to: msg.from, from: socket.id, action: `${action}_success`
//                                     };
//                                     socket.emit("weixin", success_msg);
//                                 })
//                                 .catch((err: Error) => {
//                                     // 发送消息，告诉手机端执行失败
//                                     console.assert(msg.from != socket.id);
//                                     qrcodeDialog.hide();
//                                     let fail_msg: WebSockentMessage = {
//                                         to: msg.from, from: socket.id, action: `${action}_fail`, data: err.message
//                                     };
//                                     socket.emit("weixin", fail_msg);
//                                 });
//                             break;
//                         case `${action}_scan`:
//                             qrcodeDialog.state.scaned = true;
//                             qrcodeDialog.setState(qrcodeDialog.state);
//                             break;
//                     }
//                 })
//                 socket.on('error', (err) => {
//                     reject(err)
//                 })
//             },
//             (err) => reject(err)
//         )
//     })
// }