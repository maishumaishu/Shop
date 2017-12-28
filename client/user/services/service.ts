import * as chitu from 'maishu-chitu';
import { urlParams } from 'share/common';
export { guid, imageUrl, urlParams, parseUrlParams } from 'share/common';

let userToken = new chitu.ValueStore<string>(localStorage.getItem('userToken'));




let appToken: string;
export let tokens = {
    get appToken() {
        if (appToken == null) {
            let search = location.search;
            console.assert(search != null, 'search cannt null.');
            appToken = urlParams.appKey;
        }

        return appToken;
    },
    get userToken(): chitu.ValueStore<string> {
        return userToken;
    }
}

userToken.add((value) => {
    if (!value) {
        localStorage.removeItem('userToken');
        return;
    }
    localStorage.setItem('userToken', value);
})

export let config = {
    pageSize: 10
}


let protocol = location.protocol;
let defaultHost = 'service.alinq.cn';


export abstract class Service extends chitu.Service {
    static error = new chitu.Callback<Service, Error>();
    async ajax<T>(url: string, options: RequestInit) {

        let host = defaultHost; //Ping.optimumServer ||
        url = `${protocol}//${host}/${url}`;

        options = options || {};
        options.headers = options.headers || {};

        let self = this;
        if (!tokens.appToken) {
            let err = new Error("app token error");
            Service.error.fire(self, err);
            return;
        }

        options.headers['application-key'] = tokens.appToken;
        if (tokens.userToken.value)
            options.headers['user-token'] = tokens.userToken.value;

        return super.ajax<T>(url, options).catch(err => {
            Service.error.fire(self, err);
            return Promise.reject(err);
        });
    }

    static get storeName() {
        let key = `${urlParams.appKey}`;
        return "";
    }
}

// export function imageUrl(path: string, width?: number, height?: number) {
//     if (!path) return path;
//     if (path.startsWith('data:image'))
//         return path;

//     let HTTP = 'http://'
//     if (path.startsWith(HTTP)) {
//         path = path.substr(HTTP.length);
//         let index = path.indexOf('/');
//         console.assert(index > 0);
//         path = path.substr(index);
//     }
//     else if (path[0] != '/') {
//         path = '/' + path;
//     }

//     let urlParams = new Array<{ name: string, value: string }>();
//     let url = `${protocol}//image.alinq.cn` + path;
//     if (width) {
//         // url = url + '?width=' + width;
//         urlParams.push({ name: 'width', value: width.toString() });
//     }

//     if (navigator.userAgent.indexOf('chrome') < 0) {
//         urlParams.push({ name: 'type', value: 'jpeg' })
//     }

//     if (urlParams.length > 0) {
//         url = url + '?' + urlParams.map(o => `${o.name}=${o.value}`).join('&');
//     }

//     return url;
// }

// export function guid() {
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000)
//             .toString(16)
//             .substring(1);
//     }
//     return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//         s4() + '-' + s4() + s4() + s4();
// }