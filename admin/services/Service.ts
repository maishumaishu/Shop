
import $ = require('jquery');

function ajax<T>(settings: JQueryAjaxSettings) {
    settings.headers = settings.headers || {};
    settings.data = settings.data || {}

    let options = settings;
    if (Service.appToken) {
        options.headers['application-key'] = Service.appToken;
    }
    if (Service.token) {
        options.headers['user-token'] = Service.token;
    }

    if (settings.method != 'get') {
        if ((options.url as string).indexOf('?') < 0)
            options.url = options.url + `?storeId=${Service.storeId}`;
        else
            options.url = options.url + `&storeId=${Service.storeId}`;
    }
    else {
        options.data.storeId = Service.storeId;
    }

    return new Promise<T>((resolve, reject) => {
        $.ajax(settings)
            .then(data => {
                if (data.Type == 'ErrorObject' && data.Code != 'Success') {
                    Service.error.fire(data);
                    reject(data);
                    return;
                }
                else if (data.name !== undefined && data.message !== undefined && data.stack !== undefined) {
                    let err = { Code: data.name, Message: data.message };
                    Service.error.fire(err);
                    reject(err);
                    return;
                }
                if (data.Type == 'DataSourceSelectResult') {
                    var selectResult = {} as wuzhui.DataSourceSelectResult<any>;
                    selectResult.dataItems = data['DataItems'];
                    selectResult.totalRowCount = data['TotalRowCount'];
                    resolve(selectResult as any);
                    return;
                }
                resolve(data);
            })
            // .done((o) => resolve(o))
            .fail((o) => reject(o))
    });
}

wuzhui.ajax = function (url: string, options: FetchOptions) {
    options = options || {};
    var q: Promise<any>;
    if (!options.method || options.method == 'get')
        q = ajax({ url, data: options.body });
    else
        q = ajax({ url, method: options.method, data: options.body });

    q.then((data: any) => {
        if (data.DataItems) {
            data.dataItems = data.DataItems;
            data.totalRowCount = data.TotalRowCount;
        }
        return data;
    });

    return q;
}


window['ObjectId'] = function (value) {
    return value;
}

/** 实现数据的存储，以及数据修改的通知 */
export class ValueStore<T> {
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


let local_service_host = '192.168.1.9:2800'; //'192.168.1.9:2800';// 'service.alinq.cn:2800';// 
let remote_service_host = 'shop.alinq.cn:2800';
let urlConfigs = {
    local: {
        serviceHost: local_service_host,
        shopUrl: `http://${local_service_host}/AdminShopTest/`,
        weixinUrl: `http://${local_service_host}/AdminWeiXinTest/`,
        siteUrl: `http://${local_service_host}/AdminSiteTest/`,
        memberUrl: `http://${local_service_host}/AdminMemberTest/`,
        accountUrl: `http://${local_service_host}/AdminAccountTest/`,
        imageUrl: `http://${local_service_host}/AdminSiteTest/`
    },
    remote: {
        serviceHost: remote_service_host,
        shopUrl: `http://${remote_service_host}/AdminShop/`,
        weixinUrl: `http://${remote_service_host}/AdminWeiXin/`,
        siteUrl: `http://${remote_service_host}/AdminSite/`,
        memberUrl: `http://${remote_service_host}/AdminMember/`,
        accountUrl: `http://${local_service_host}/AdminAccountTest/`,
        imageUrl: `http://${remote_service_host}/UserServices/Site/`
    }
}

export class Service {
    static error = $.Callbacks()
    static config = urlConfigs.local
    static callMethod(path: string, data?): JQueryPromise<any> {
        data = data || {};
        var url = Service.config.shopUrl + path;
        return $.ajax({ url: url, data: data, method: 'post' });
    }

    static get<T>(url: string, data?) {
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

    static put<T>(url: string, data) {
        return ajax<T>({
            url: url, data,
            method: 'put'
        });
    }

    static delete(url: string, data) {
        return ajax({
            url, data, method: 'delete'
        })
    }

    ajax<T>(options: JQueryAjaxSettings) {
        return ajax<T>(options);
    }

    static get appToken() {
        let search = window.location.search || '';
        return search.substr(1);
    }
    // static set appToken(value: string) {
    //     if (value === undefined)
    //         localStorage.removeItem('appToken');

    //     localStorage.setItem('appToken', value);
    // }

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

