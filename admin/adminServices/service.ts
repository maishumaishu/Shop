// import $ = require('jquery');
import * as chitu from 'maishu-chitu';

let username = new chitu.ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})


// let local_service_host = 'service.alinq.cn'; //'192.168.1.9:2800';// 'service.alinq.cn:2800';// 
let remote_service_host = 'service.alinq.cn';

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

export class Service extends chitu.Service {
    static error = chitu.Callbacks<Service, ServiceError>()
    static config = {
        serviceHost: remote_service_host,
        shopUrl: `https://${remote_service_host}/AdminShop/`,
        weixinUrl: `https://${remote_service_host}/AdminWeiXin/`,
        siteUrl: `https://${remote_service_host}/AdminSite/`,
        memberUrl: `https://${remote_service_host}/AdminMember/`,
        accountUrl: `https://${remote_service_host}/AdminAccount/`,
        imageUrl: `https://${remote_service_host}/UserServices/Site/`
    }

    ajax<T>(url: string, options: RequestInit): Promise<T> {
        options = options || {} as RequestInit;
        options.headers = options.headers || {};
        if (Service.token)
            options.headers['user-token'] = Service.token;

        if (location.search)
            options.headers['application-key'] = location.search.substr(1);


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
        let search = window.location.search || '';
        return search.substr(1);
    }

    static get storeId() {
        return Service.userId;
    }
    static get token() {
        return localStorage['token'];
    };
    static set token(value: string) {
        if (value === undefined) {
            localStorage.removeItem('token');
            return;
        }
        localStorage.setItem('token', value);
    }
    static get userId() {
        return localStorage['userId'];
    };
    static set userId(value: string) {
        if (value === undefined) {
            localStorage.removeItem('userId');
            return;
        }
        localStorage.setItem('userId', value);
    }
    static get username() {
        return username;
    }
}


export default Service;

