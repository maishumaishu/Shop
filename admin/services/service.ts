import $ = require('jquery');


function ajax<T>(url: string, options: RequestInit): Promise<T> {

    let config = {
        /** 调用服务接口超时时间，单位为秒 */
        ajaxTimeout: 30,
        pageSize: 10
    }

    //==========================================================
    // 错误处理模块
    class AjaxError implements Error {
        name: string;
        message: string;
        method: 'get' | 'post';

        constructor(method) {
            this.name = 'ajaxError';
            this.message = 'Ajax Error';
            this.method = method;
        }
    }

    //==============================================================
    // 将 json 对象格式化
    let datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;;
    function travelJSON(result: any) {
        // var prefix = this.datePrefix;
        if (typeof result === 'string' && result.match(datePattern)) {
            return new Date(result);
        }
        var stack = new Array();
        stack.push(result);
        while (stack.length > 0) {
            var item = stack.pop();
            for (var key in item) {
                var value = item[key];
                if (value == null)
                    continue;

                if (value instanceof Array) {
                    for (var i = 0; i < value.length; i++) {
                        stack.push(value[i]);
                    }
                    continue;
                }
                if (typeof value == 'object') {
                    stack.push(value);
                    continue;
                }
                if (typeof value == 'string' && value.match(datePattern)) {
                    item[key] = new Date(value);
                }
            }
        }
        return result;
    }
    //==============================================================

    let _ajax = async (url: string, options: RequestInit): Promise<T> => {

        options = options || {};
        options.method = options.method || 'get';

        let response = await fetch(url, options);
        let responseText = response.text();
        let p: Promise<string>;
        if (typeof responseText == 'string') {
            p = new Promise<string>((reslove, reject) => {
                reslove(responseText);
            })
        }
        else {
            p = responseText as Promise<string>;
        }

        let text = await responseText;
        let contentType = response.headers.get('Content-Type') || '';
        let textObject: any;
        if (contentType.indexOf('json') >= 0) {
            textObject = JSON.parse(text);
        }
        else {
            textObject = text;
        }

        let err = response.status >= 300 ? textObject : null;
        if (typeof err == 'string') {
            let ajaxError = new AjaxError(options.method);
            ajaxError.name = `${response.status}`;
            ajaxError.message = response.statusText;
            err = ajaxError;
        }
        if (err)
            throw err;

        textObject = travelJSON(textObject);
        return textObject;
    }


    return new Promise<T>((reslove, reject) => {
        let timeId: number;
        if (options.method == 'get') {
            timeId = window.setTimeout(() => {
                let err = new AjaxError(options.method);
                err.name = 'timeout';
                reject(err);
                // this.error.fire(this, err);
                clearTimeout(timeId);

            }, config.ajaxTimeout * 1000)
        }

        _ajax(url, options)
            .then(data => {
                reslove(data);
                if (timeId)
                    clearTimeout(timeId);
            })
            .catch(err => {
                reject(err);

                if (timeId)
                    clearTimeout(timeId);
            });

    })
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

export class Service {
    static error = $.Callbacks()
    static config = {
        serviceHost: remote_service_host,
        shopUrl: `https://${remote_service_host}/AdminShop/`,
        weixinUrl: `https://${remote_service_host}/AdminWeiXin/`,
        siteUrl: `https://${remote_service_host}/AdminSite/`,
        memberUrl: `https://${remote_service_host}/AdminMember/`,
        accountUrl: `https://${remote_service_host}/AdminAccountTest/`,
        imageUrl: `https://${remote_service_host}/UserServices/Site/`
    }

    private static ajax<T>(options: { url: string, data?: any, method?: string, headers?: any }): Promise<T> {
        let { data, method, headers, url } = options;

        headers = headers || {};
        if (Service.token)
            headers['user-token'] = Service.token;

        if (location.search) {
            headers['application-key'] = location.search.substr(1);
        }

        return ajax<T>(url, { body: data, method, headers })
            .then(data => {
                if (data != null && data['Type'] == 'DataSourceSelectResult') {
                    let result = {};
                    for (let key in data) {
                        let name = key[0].toLowerCase() + key.substr(1);
                        result[name] = data[key];
                    }
                    return result as T;
                }
                return data as T;
            })
            .catch((error) => {
                Service.error.fire(this, error);
                throw error;
            });
    }

    static get<T>(url: string, data?) {
        let urlParams = '';
        for (let key in data) {
            urlParams = urlParams + `&${key}=${data[key]}`;
        }
        if (urlParams)
            urlParams = urlParams.substr(1);

        if (urlParams)
            url = url.indexOf('?') < 0 ? url + '?' + urlParams : url + '&' + urlParams;

        return Service.ajax<T>({ url: url, data: data, method: 'get' });
    }

    static getByJson<T>(url: string, data?) {
        // let _url = url + '?' + JSON.stringify(data);
        data = data || {};

        // let _data = {};
        // for (let key in data) {
        //     _data[key] = JSON.stringify(data[key]);
        // }
        console.assert(url.indexOf('?') < 0);
        if (data) {
            url = url + '?' + JSON.stringify(data);
        }
        return Service.ajax<T>({
            headers: {
                'content-type': 'application/json'
            },
            url: url, method: 'get'
        });
    }

    static putByJson<T>(url: string, data) {
        return Service.ajax<T>({
            headers: {
                'content-type': 'application/json'
            },
            url: url, data: JSON.stringify(data),
            method: 'put'
        });
    }

    static postByJson<T>(url: string, data) {
        return Service.ajax<T>({
            headers: {
                'content-type': 'application/json'
            },
            url: url, data: JSON.stringify(data),
            method: 'post'
        });
    }

    // static post<T>(url: string, data) {
    //     return Service.ajax<T>({
    //         url: url, data,
    //         method: 'post'
    //     });
    // }

    // static put<T>(url: string, data) {
    //     return Service.ajax<T>({
    //         url: url, data,
    //         method: 'put'
    //     });
    // }

    static delete(url: string, data) {
        return Service.ajax({
            url, data, method: 'delete'
        })
    }

    static deleteByJson(url: string, data) {
        return Service.ajax({
            headers: {
                'content-type': 'application/json'
            },
            url, data: JSON.stringify(data), method: 'delete'
        })
    }

    ajax<T>(options: { url: string, data: any, method?: string, headers?: any }) {
        return Service.ajax<T>(options);
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

