
import $ = require('jquery');

let service_host = 'localhost:2800'; //'192.168.1.9:2800';// 'service.alinq.cn:2800';// 

function ajax<T>(settings: JQueryAjaxSettings) {
    settings.headers = settings.headers || {};
    let options = settings;
    if (Service.appToken) {
        options.headers['application-token'] = Service.appToken;
    }
    if (Service.token) {
        options.headers['user-token'] = Service.token;
    }

    if ((options.url as string).indexOf('?') < 0)
        options.url = options.url + `?storeId=${Service.storeId}`;
    else
        options.url = options.url + `&storeId=${Service.storeId}`;

    return new Promise<T>((resolve, reject) => {
        $.ajax(settings)
            // .done(function (data) {
            //     if (data.Type == 'ErrorObject') {
            //         if (data.Code == 'Success') {
            //             resolve(data);
            //             return;
            //         }

            //         reject(data);
            //         Service.error.fire(data);
            //         return;
            //     }
            //     else if (data.name !== undefined && data.message !== undefined && data.stack !== undefined) {
            //         let err = { Code: data.name, Message: data.message };
            //         reject(err);
            //         Service.error.fire(err);
            //         return;
            //     }

            //     resolve(data);
            // })
            // .fail(function (error) {
            //     //debugger;
            //     var obj = { Code: error.status, Message: error.statusText };
            //     Service.error.fire(obj);
            // });
        .done((o) => resolve(o))
        .fail((o) => reject(o))
    });
}

/** 实现数据的存储，以及数据修改的通知 */
class ValueStore<T> {
    private funcs = new Array<(args: T) => void>();
    private _value: T;

    constructor() {
    }
    add(func: (value: T) => any): (args: T) => any {
        this.funcs.push(func);
        return func;
    }
    remove(func: (value: T) => any) {
        this.funcs = this.funcs.filter(o => o != func);
    }
    fire(value: T) {
        this.funcs.forEach(o => o(value));
    }
    get value(): T {
        return this._value;
    }
    set value(value: T) {
        if (this._value == value)
            return;

        this._value = value;
        this.fire(value);
    }
}

let username = new ValueStore<string>();
username.value = localStorage['username'];
username.add((value) => {
    localStorage['username'] = value;
})

class Service {
    static error = $.Callbacks()
    static config = {
        serviceHost: service_host,
        shopUrl: `http://${service_host}/ShopTest/`,
        weixinUrl: `http://${service_host}/WeiXinTest/`,
        siteUrl: `http://${service_host}/SiteTest/`,
        memberUrl: `http://${service_host}/MemberTest/`,
        imageUrl: `http://${service_host}/UserServices/Site/`
    }
    static callMethod(path: string, data?): JQueryPromise<any> {
        data = data || {};
        var url = Service.config.shopUrl + path;
        return $.ajax({ url: url, data: data, method: 'post' });
    }

    static get<T>(url: string, data?) {
        //data = data || {};
        //var url = Service.config.shopUrl + path;
        //return $.ajax({ url: url, data: data, method: 'get' });
        return ajax<T>({ url: url, data: data, method: 'get' });
    }

    static putByJson<T>(url: string, data) {
        return ajax<T>({
            headers: {
                'content-type': 'application/json'
            },
            url: url, data: JSON.stringify(data),
            method: 'put'
        });
    }

    static postByJson<T>(url: string, data) {
        return ajax<T>({
            headers: {
                'content-type': 'application/json'
            },
            url: url, data: JSON.stringify(data),
            method: 'post'
        });
    }

    static post<T>(url: string, data) {
        return ajax<T>({
            url: url, data,
            method: 'post'
        });
    }

    ajax<T>(options: JQueryAjaxSettings) {
        return ajax<T>(options);
    }

    static appToken = "58424776034ff82470d06d3d";
    static storeId = '58401d1906c02a2b8877bd13';
    static get token() {
        return localStorage['token'];
    };
    static set_token(value: string) {
        if (value === undefined) {
            localStorage.removeItem('token');
            return;
        }
        localStorage.setItem('token', value);
    }
    static get userId() {
        return localStorage['userId'];
    };
    static set_userId(value: string) {
        if (value === undefined) {
            localStorage.removeItem('userId');
            return;
        }
        localStorage.setItem('userId', value);
    }
    static get username() {
        return username;
    }
    // static set username(value: string) {
    //     localStorage.setItem('username', value);
    // }
}



window['models'] = {};
window['translators'] = window['translators'] || {};
window['services'] = window['services'] || {};
export = Service;

