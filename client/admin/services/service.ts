// import $ = require('jquery');
import * as chitu from 'maishu-chitu';
import { urlParams, parseUrlParams } from 'share/common';
export { guid, imageUrl, parseUrlParams, formatDate, formatDateTime } from 'share/common';
export let systemWeiXinAppId = 'wx30ac5294d9f38751';

let username = new chitu.ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})


let remote_service_host = 'service1.alinq.cn';//'userservices.alinq.cn' //'service.alinq.cn';


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




export default Service;

