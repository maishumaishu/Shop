import chitu = require('chitu');

// const SERVICE_HOST = 'service.alinq.cn:2800/UserServices';
const SERVICE_HOST = 'localhost:2800/UserServices';
let config = {
    service: {
        shop: `http://${SERVICE_HOST}/Shop/`,
        site: `http://${SERVICE_HOST}/Site/`,
        member: `http://${SERVICE_HOST}/Member/`,
        weixin: `http://${SERVICE_HOST}/WeiXin/`,
        account: `http://${SERVICE_HOST}/Account/`,
    },
    appToken: '58424776034ff82470d06d3d',
    storeId: '58401d1906c02a2b8877bd13',
    get userToken() {
        return '584cfabb4918e4186a77ff1e';
    },
    /** 调用服务接口超时时间，单位为秒 */
    ajaxTimeout: 30,
    pageSize: 10
}

//==========================================================
// 错误处理模块
export class AjaxError implements Error {
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

//==========================================================
// 公用函数 模块开始

function userToken(value?: string) {
    /** ------ 测试代码 ------- */
    if (config.userToken) {
        return config.userToken;
    }
    //==========================

    if (value !== undefined) {
        localStorage.setItem('userToken', value);
        return;
    }
    return localStorage.getItem('userToken');
}

function storeId() {
    return '58401d1906c02a2b8877bd13';
}

function parseDate(value: string): Date {
    const prefix = '/Date(';
    if (value.startsWith(prefix)) {
        let star = prefix.length;
        let len = value.length - prefix.length - ')/'.length;
        let str = value.substr(star, len);
        let num = parseInt(str);
        let date = new Date(num);
        return date;
    }

    throw new Error('not implment.');

}

function imageUrl(path: string) {
    if (path.startsWith(`http://localhost:${location.port}`)) {
        path = path.substr(`http://localhost:${location.port}`.length);
    }
    else if (path.startsWith('http://localhost')) {
        path = path.substr('http://localhost'.length);
    }
    else if (path.startsWith('file://')) {
        path = path.substr('file://'.length);
    }
    const imageBasePath = 'http://service.alinq.cn:2800/AdminServices/Shop';
    let url: string;
    if (!path.startsWith('http')) {
        url = imageBasePath + path;
    }
    else {
        url = path;
    }
    url = url + `?application-token=${config.appToken}&storeId=${storeId()}`;
    return url;
}

// 公用函数 模块结束
//==========================================================
// 服务以及实体类模块 开始

interface DataSourceSelectArguments {
    startRowIndex?: number,
    maximumRows?: number,
    filter?: string
}

interface DataSourceSelectResult<T> {
    DataItems: T[],
    MaximumRows?: number,
    StartRowIndex?: number,
    TotalRowCount: number
}

export abstract class Service {
    private datePrefix = '/Date(';
    error = chitu.Callbacks<Service, Error>();
    ajax<T>(url: string, options: FetchOptions): Promise<T> {
        return new Promise<T>((reslove, reject) => {
            let timeId: number;
            if (options.method == 'get') {
                timeId = window.setTimeout(() => {
                    let err = new AjaxError(options.method);
                    err.name = 'timeout';
                    reject(err);
                    this.error.fire(this, err);
                    clearTimeout(timeId);

                }, config.ajaxTimeout * 1000)
            }

            this._ajax<T>(url, options)
                .then(data => {
                    reslove(data);
                    if (timeId)
                        clearTimeout(timeId);
                })
                .catch(err => {
                    reject(err);
                    this.error.fire(this, err);

                    if (timeId)
                        clearTimeout(timeId);
                });

        })
    }

    private parseStringToDate(value: string) {
        let prefix = this.datePrefix;
        var star = prefix.length;
        var len = value.length - prefix.length - ')/'.length;
        var str = value.substr(star, len);
        var num = parseInt(str);
        var date = new Date(num);
        return date;
    }
    private travelJSON(result: any) {
        var prefix = this.datePrefix;
        if (typeof result === 'string') {
            if (result.substr(0, prefix.length) == prefix)
                result = this.parseStringToDate(result);
            return result;
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
                if (typeof value == 'string' && value.substr(0, prefix.length) == prefix) {
                    item[key] = this.parseStringToDate(value);
                }
            }
        }
        return result;
    }

    private async _ajax<T>(url: string, options: FetchOptions): Promise<T> {
        let user_token = userToken();
        if (user_token) {
            options.headers['user-token'] = user_token;
        }

        try {
            let response = await fetch(url, options);
            if (response.status >= 300) {
                let err = new AjaxError(options.method);
                err.name = `${response.status}`;
                err.message = response.statusText;
                throw err
            }
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
            let textObject = JSON.parse(text);
            let err = isError(textObject);
            if (err)
                throw err;

            textObject = this.travelJSON(textObject);
            return textObject;
        }
        catch (err) {
            this.error.fire(this, err);
            throw err;
        }
    }

    get<T>(url: string, data?: any) {

        console.assert(storeId() != null);

        data = data || {};
        let headers = {
            'application-token': config.appToken,
        };

        if (userToken()) {
            headers['user-token'] = userToken();
        }

        let urlParams = '';
        for (let key in data) {
            urlParams = urlParams + `&${key}=${data[key]}`;
        }

        if (urlParams)
            url = url.indexOf('?') < 0 ? url + '?' + urlParams : url + '&' + urlParams;

        let options = {
            headers,
            method: 'get',
        }
        return this.ajax<T>(url, options);
    }

    post<T>(url: string, data?: Object) {

        console.assert(userToken() != null);
        console.assert(storeId() != null);

        data = data || {};
        let headers = {
            'application-token': config.appToken,
            'user-token': userToken(),
        };

        headers['content-type'] = 'application/json';

        let body: any;
        body = JSON.stringify(data);
        let options = {
            headers,
            body,
            method: 'post'
        }
        return this.ajax<T>(url, options);
    }
}

export interface ControlData {
    controlId: string, controlName: string, data: any
}

export interface PageData {
    _id: string,
    name: string,
    controls: Array<ControlData>
}

export class PageService extends Service {
    pageData() {
        let data = {
            storeId: '58401d1906c02a2b8877bd13',
            pageId: '58cbed9a5debc30bb867dfb2'
        }
        return this.get<PageData>('http://localhost:2800/SiteTest/Page/GetPageData', data).then(o => {
            return o;
        });
    }
}