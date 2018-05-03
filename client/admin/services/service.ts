// import $ = require('jquery');
import * as chitu from 'maishu-chitu';
import { urlParams, parseUrlParams, serviceHost, imageServiceBaseUrl } from 'share/common';
import BaseService from 'share/service';
export { guid, imageUrl, parseUrlParams, formatDate, formatDateTime } from 'share/common';
export let systemWeiXinAppId = 'wx30ac5294d9f38751';

let username = new chitu.ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})


let remote_service_host = serviceHost;


let { protocol } = location;
export class Service extends BaseService {
    static error = chitu.Callbacks<Service, ServiceError>()
    static config = {
        serviceHost: remote_service_host,
        shopUrl: `${protocol}//${remote_service_host}/AdminShop/`,
        weixinUrl: `${protocol}//${remote_service_host}/AdminWeiXin/`,
        siteUrl: `${protocol}//${remote_service_host}/AdminSite/`,
        memberUrl: `${protocol}//${remote_service_host}/AdminMember/`,
        accountUrl: `${protocol}//${remote_service_host}/AdminAccount/`,
        // imageUrl: imageServiceBaseUrl,
    }

    constructor() {
        super();
    }

    ajax<T>(url: string, options: chitu.AjaxOptions): Promise<T> {
        options = options || {} as chitu.AjaxOptions;
        options.headers = options.headers || {};
        if (Service.token)
            options.headers['token'] = Service.token.value;

        if (location.search) {
            let query = parseUrlParams(location.search.substr(1));
            if (query['appKey']) {
                options.headers['application-id'] = query['appKey'];
            }
        }


        return super.ajax(url, options);
    }

    static get appToken() {
        return urlParams.appKey;
    }

    // static get token() {
    //     return localStorage['adminToken'];
    // };
    // static set token(value: string) {
    //     if (value === undefined) {
    //         localStorage.removeItem('adminToken');
    //         return;
    //     }
    //     localStorage.setItem('adminToken', value);
    // }
    static token = new chitu.ValueStore(localStorage['adminToken']);
    static get adminName() {
        return username;
    }
}

Service.token.add((value) => {
    debugger;
    localStorage.setItem("adminToken", value);
});




export default Service;

