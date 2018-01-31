// import $ = require('jquery');
import * as chitu from 'maishu-chitu';
import { urlParams } from 'share/common';
export { guid, imageUrl, parseUrlParams } from 'share/common';
export let systemWeiXinAppId = 'wx30ac5294d9f38751';

let username = new chitu.ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})


let remote_service_host = 'userservices.alinq.cn' //'service.alinq.cn';
function parseUrlParams(query: string) {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    let urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}

let { protocol } = location;
export class Service extends chitu.Service {
    static error = chitu.Callbacks<Service, ServiceError>()
    static config = {
        serviceHost: remote_service_host,
        shopUrl: `${protocol}//${remote_service_host}/AdminShop/`,
        weixinUrl: `${protocol}//${remote_service_host}/AdminWeiXin/`,
        siteUrl: `${protocol}//${remote_service_host}/AdminSite/`,
        memberUrl: `${protocol}//${remote_service_host}/AdminMember/`,
        accountUrl: `${protocol}//${remote_service_host}/AdminAccount/`,
        imageUrl: `${protocol}//image.alinq.cn/`
    }

    constructor() {
        super();

        // this.error.add((sender, error) => {
        //     Service.error.fire(sender, error);
        // })
    }

    ajax<T>(url: string, options: RequestInit): Promise<T> {
        options = options || {} as RequestInit;
        options.headers = options.headers || {} as Headers;
        if (Service.token)
            options.headers['token'] = Service.token;

        if (location.search) {
            let query = parseUrlParams(location.search.substr(1));
            if (query['appKey']) {
                options.headers['application-id'] = query['appKey'];
            }
        }


        return super.ajax<T>(url, options).then(data => {
            if (data != null && data['DataItems'] != null && data['TotalRowCount'] != null) {
                let d: any = {};
                let keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let k = (key as string)[0].toLowerCase() + (key as string).substr(1);
                    d[k] = data[key];
                }

                return d;
            }

            return data;
        });
    }


    static get appToken() {
        return urlParams.appKey;
    }

    // static get storeId() {
    //     return Service.userId;
    // }
    static get token() {
        return localStorage['adminToken'];
    };
    static set token(value: string) {
        if (value === undefined) {
            localStorage.removeItem('adminToken');
            return;
        }
        localStorage.setItem('adminToken', value);
    }
    // static get userId() {
    //     return localStorage['userId'];
    // };
    // static set userId(value: string) {
    //     if (value === undefined) {
    //         localStorage.removeItem('userId');
    //         return;
    //     }
    //     localStorage.setItem('userId', value);
    // }
    static get adminName() {
        return username;
    }
}

export function formatDate(date: Date | string): string {
    if (date == null)
        return null;

    if (typeof date == 'string')
        return date;

    let d = date as Date;
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    return `${d.getFullYear()}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;
}

export function formatDateTime(date: Date | string): string {
    if (date == null)
        return null;

    if (typeof date == 'string')
        return date;

    let d = date as Date;
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
}


export default Service;

