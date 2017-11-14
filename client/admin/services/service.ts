// import $ = require('jquery');
import * as chitu from 'maishu-chitu';

let username = new chitu.ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})


// let local_service_host = 'service.alinq.cn'; //'192.168.1.9:2800';// 'service.alinq.cn:2800';// 
let remote_service_host = 'service.alinq.cn';

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export function imageUrl(path: string, width?: number) {
    if (!path) return path;
    if (path.startsWith("data:image")) {
        return path;
    }
    
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

    constructor() {
        super();

        this.error.add((sender, error) => {
            Service.error.fire(sender, error);
        })
    }

    ajax<T>(url: string, options: RequestInit): Promise<T> {
        options = options || {} as RequestInit;
        options.headers = options.headers || {} as Headers;
        if (Service.token)
            options.headers['user-token'] = Service.token;

        if (location.search) {
            let query = parseUrlParams(location.search.substr(1));
            if (query['appKey']) {
                options.headers['application-key'] = query['appKey'];
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
        let search = window.location.search || '';
        return search.substr(1);
    }

    static get storeId() {
        return Service.userId;
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

