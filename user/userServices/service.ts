// import { userData} from 'user/services/userData'

export interface DataSourceSelectArguments {
    startRowIndex: number;
    totalRowCount: number;
    maximumRows: number;
    sortExpression: string;
    filter: string;
}

//==========================================================
// 错误处理模块
export class AjaxError implements Error {
    name: string;
    message: string;
    method: 'get' | 'post';

    constructor(method) {
        this.name = 'ajaxError';
        this.message = 'Ajax Error';
        this.method = method;
    }
}

/** 
 * 判断服务端返回的数据是否为错误信息 
 * @param responseData 服务端返回的数据
 */
function isError(responseData: any): Error {
    if (responseData == null)
        return null;

    if (responseData.Type == 'ErrorObject') {
        if (responseData.Code == 'Success') {
            return null;
        }
        let err = new Error(responseData.Message);
        err.name = responseData.Code;
        return err;
    }

    let err: Error = responseData;
    if (err.name !== undefined && err.message !== undefined && err['stack'] !== undefined) {
        return err;
    }

    return null;
}

let userToken = new chitu.ValueStore<string>();
userToken.value = localStorage.getItem('userToken');
export let tokens = {
    get appToken() {
        let search = location.search;
        console.assert(search != null, 'search cannt null.');
        let value = search.substr(1);
        return value;
    },
    get userToken(): chitu.ValueStore<string> {
        return userToken;
    }
}

const REMOTE_HOST = 'service.alinq.cn';
export let config = {
    service: {
        host: REMOTE_HOST,
        shop: `https://${REMOTE_HOST}/UserShop/`,
        site: `https://${REMOTE_HOST}/UserSite/`,
        member: `https://${REMOTE_HOST}/UserMember/`,
        weixin: `https://${REMOTE_HOST}/UserWeiXin/`,
        account: `https://${REMOTE_HOST}/UserAccount/`,
    },
    /** 调用服务接口超时时间，单位为秒 */
    ajaxTimeout: 30,
    pageSize: 10
}

// export abstract class Service {
//     error = chitu.Callbacks<Service, Error>();
//     ajax<T>(url: string, options: RequestInit): Promise<T> {

//         let _ajax = async (url: string, options: RequestInit): Promise<T> => {
//             let user_token = tokens.userToken;
//             if (user_token) {
//                 options.headers['user-token'] = user_token;
//             }

//             // try {
//             let response = await fetch(url, options);
//             let responseText = response.text();
//             let p: Promise<string>;
//             if (typeof responseText == 'string') {
//                 p = new Promise<string>((reslove, reject) => {
//                     reslove(responseText);
//                 })
//             }
//             else {
//                 p = responseText as Promise<string>;
//             }

//             let text = await responseText;
//             let contentType = response.headers.get('Content-Type') || '';
//             let textObject: any;
//             if (contentType.indexOf('json') >= 0) {
//                 textObject = JSON.parse(text);
//             }
//             else {
//                 textObject = text;
//             }

//             let err = response.status >= 300 ? textObject : isError(textObject);
//             if (typeof err == 'string') {
//                 let ajaxError = new AjaxError(options.method);
//                 ajaxError.name = `${response.status}`;
//                 ajaxError.message = response.statusText;
//                 err = ajaxError;
//             }
//             if (err)
//                 throw err;

//             textObject = this.travelJSON(textObject);
//             return textObject;
//         }


//         return new Promise<T>((reslove, reject) => {
//             let timeId: number;
//             if (options.method == 'get') {
//                 timeId = window.setTimeout(() => {
//                     let err = new AjaxError(options.method);
//                     err.name = 'timeout';
//                     reject(err);
//                     this.error.fire(this, err);
//                     clearTimeout(timeId);

//                 }, config.ajaxTimeout * 1000)
//             }

//             _ajax(url, options)
//                 .then(data => {
//                     reslove(data);
//                     if (timeId)
//                         clearTimeout(timeId);
//                 })
//                 .catch(err => {
//                     reject(err);
//                     this.error.fire(this, err);

//                     if (timeId)
//                         clearTimeout(timeId);
//                 });

//         })
//     }

//     private datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
//     private travelJSON(result: any) {
//         // var prefix = this.datePrefix;
//         if (typeof result === 'string' && value.match(this.datePattern)) {
//             // if (result.substr(0, prefix.length) == prefix)
//             //     result = this.parseStringToDate(result);
//             // return result;
//             return new Date(result);
//         }
//         var stack = new Array();
//         stack.push(result);
//         while (stack.length > 0) {
//             var item = stack.pop();
//             for (var key in item) {
//                 var value = item[key];
//                 if (value == null)
//                     continue;

//                 if (value instanceof Array) {
//                     for (var i = 0; i < value.length; i++) {
//                         stack.push(value[i]);
//                     }
//                     continue;
//                 }
//                 if (typeof value == 'object') {
//                     stack.push(value);
//                     continue;
//                 }
//                 if (typeof value == 'string' && value.match(this.datePattern)) {
//                     item[key] = new Date(value);
//                 }
//             }
//         }
//         return result;
//     }

//     get<T>(url: string, data?: any) {

//         data = data || {};
//         let headers = {
//             'application-key': tokens.appToken,
//         };

//         if (tokens.userToken) {
//             headers['user-token'] = tokens.userToken;
//         }

//         let urlParams = '';
//         for (let key in data) {
//             urlParams = urlParams + `&${key}=${data[key]}`;
//         }

//         if (urlParams)
//             url = url.indexOf('?') < 0 ? url + '?' + urlParams : url + '&' + urlParams;

//         let options = {
//             headers,
//             method: 'get',
//         }
//         return this.ajax<T>(url, options);
//     }

//     getByJson<T>(url: string, data?: any) {

//         data = data || {};
//         let headers = {
//             'application-key': tokens.appToken,
//             'content-type': 'application/json'
//         };

//         if (tokens.userToken) {
//             headers['user-token'] = tokens.userToken;
//         }

//         console.assert(url.indexOf('?') < 0);
//         url = url + '?' + JSON.stringify(data);

//         let options = {
//             headers,
//             method: 'get',
//         }
//         return this.ajax<T>(url, options);
//     }

//     post<T>(url: string, data?: Object) {
//         return this.ajaxByJSON<T>(url, data, 'post');
//     }
//     delete<T>(url: string, data?: Object) {
//         return this.ajaxByJSON<T>(url, data, 'delete');
//     }
//     put<T>(url: string, data?: Object): Promise<T> {
//         return this.ajaxByJSON<T>(url, data, 'put');
//     }
//     private ajaxByJSON<T>(url: string, data?: Object, method?: string): Promise<T> {

//         data = data || {};
//         let headers = {
//             'application-key': tokens.appToken,
//         };

//         if (tokens.userToken)
//             headers['user-token'] = tokens.userToken;

//         headers['content-type'] = 'application/json';
//         let body: any;
//         body = JSON.stringify(data);
//         let options = {
//             headers,
//             body,
//             method
//         }
//         return this.ajax<T>(url, options);
//     }

//     static createService<T extends Service>(serviceType: { new(): T }): T {
//         let result = new serviceType();
//         return result;
//     }
// }

//             'application-key': tokens.appToken,
//             'content-type': 'application/json'
chitu.Service.settings.headers = {
    'application-key': tokens.appToken,
    'content-type': 'application/json',
    'user-token': tokens.userToken.value
}

tokens.userToken.add((value) => {
    chitu.Service.settings.headers['user-token'] = value;
})
//user-token
export abstract class Service extends chitu.Service {
    get<T>(url: string, data?: any): Promise<T> {
        return super.getByJson(url, data);
    }
    post<T>(url: string, data?: any): Promise<T> {
        return super.postByJson(url, data);
    }
    put<T>(url: string, data?: any): Promise<T> {
        return super.putByJson(url, data);
    }
    delete<T>(url: string, data?: any): Promise<T> {
        return super.deleteByJson(url, data);
    }
}

export function imageUrl(path: string, width?: number) {
    if (!path) return path;

    let HTTP = 'http://'
    if (path.startsWith(HTTP)) {
        path = path.substr(HTTP.length);
        let index = path.indexOf('/');
        console.assert(index > 0);
        path = path.substr(index);
    }
    else if (path[0] != '/') {
        path = '/' + path;
    }

    let url = 'https://image.alinq.cn' + path;
    if (width) {
        url = url + '?width=' + width;
    }
    return url;
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}