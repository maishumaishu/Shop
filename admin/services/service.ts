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

    /** 
     * 判断服务端返回的数据是否为错误信息 
     * @param responseData 服务端返回的数据
     */
    function isError(responseData: any): Error {
        if (responseData == null)
            return null;

        if (responseData.Type == 'ErrorObject') {
            if (responseData.Code == 'Success') {
                return null;
            }
            let err = new Error(responseData.Message);
            err.name = responseData.Code;
            return err;
        }

        let err: Error = responseData;
        if (err.name !== undefined && err.message !== undefined && err['stack'] !== undefined) {
            return err;
        }

        return null;
    }

    let datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;;
    function travelJSON(result: any) {
        // var prefix = this.datePrefix;
        if (typeof result === 'string' && value.match(datePattern)) {
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

    let _ajax = async (url: string, options: RequestInit): Promise<T> => {
        // let user_token = tokens.userToken;
        // if (user_token) {
        //     options.headers['user-token'] = user_token;
        // }

        // try {
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

        let err = response.status >= 300 ? textObject : isError(textObject);
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
                // this.error.fire(this, err);

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
        siteUrl: `http://${remote_service_host}/RE/`,
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

    static ajax<T>(options: { url: string, data: any, method?: string, headers?: any }): Promise<T> {
        let { data, method, headers, url } = options;

        headers = headers || {};
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

        let _data = {};
        for (let key in data) {
            _data[key] = JSON.stringify(data[key]);
        }
        return Service.ajax<T>({
            headers: {
                'content-type': 'application/json'
            },
            url: url, method: 'get',
            data: _data
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

