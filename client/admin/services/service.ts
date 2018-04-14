// import $ = require('jquery');
import * as chitu from 'maishu-chitu';
import { urlParams, parseUrlParams, serviceHost } from 'share/common';
export { guid, imageUrl, parseUrlParams, formatDate, formatDateTime } from 'share/common';
export let systemWeiXinAppId = 'wx30ac5294d9f38751';

let username = new chitu.ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})


let remote_service_host = serviceHost;


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
    }

    ajax<T>(url: string, options: chitu.AjaxOptions): Promise<T> {
        options = options || {} as chitu.AjaxOptions;
        options.headers = options.headers || {};
        if (Service.token)
            options.headers['token'] = Service.token;

        if (location.search) {
            let query = parseUrlParams(location.search.substr(1));
            if (query['appKey']) {
                options.headers['application-id'] = query['appKey'];
            }
        }


        return super.ajax(url, options).then(data => {
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

    getByJson<T>(url: string, data?: any) {
        data = data || {};
        url = `${url}?${JSON.stringify(data)}`;
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, method: 'get' })
    }

    putByJson<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'put' });
    }

    postByJson<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'post' });
    }

    deleteByJson<T>(url: string, data: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'delete' });
    }


    get<T>(url: string, data?: any) {
        return this.ajax<T>(url, { data, method: 'get' })
    }

    put<T>(url: string, data?: any) {
        return this.ajax<T>(url, { method: 'put' });
    }

    post<T>(url: string, data?: any) {
        return this.ajax<T>(url, { method: 'post' });
    }


    static get appToken() {
        return urlParams.appKey;
    }

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
    static get adminName() {
        return username;
    }
}





export default Service;

