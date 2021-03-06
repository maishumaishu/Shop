import * as chitu from 'chitu';

export default class Service extends chitu.Service {
    constructor() {
        super();
    }

    ajax<T>(url: string, options?: chitu.AjaxOptions): Promise<T> {
        return super.ajax<T>(url, options).then((data) => {
            if (data != null && data['DataItems'] != null && data['TotalRowCount'] != null) {
                let d: any = {};
                let keys = Object.keys(data);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let k = (key as string)[0].toLowerCase() + (key as string).substr(1);
                    d[k] = data[key];
                }

                data = d;
            }

            this.travelJSON(data);
            return data;
        });
    }

    /**
     * 遍历 JSON 对象各个字段，将日期字符串转换为 Date 对象
     * @param obj 要转换的 JSON 对象
     */
    private travelJSON(obj: any) {
        const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        if (typeof obj === 'string' && obj.match(datePattern)) {
            return new Date(obj);
        }
        else if (typeof obj === 'string') {
            return obj;
        }
        var stack = new Array();
        stack.push(obj);
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
        return obj;
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
        data = data || {};
        let params = "";
        for (let key in data) {
            params = params ? `${params}&${key}=${data[key]}` : `${key}=${data[key]}`;
        }

        if (params) {
            url = `${url}?${params}`;
        }

        return this.ajax<T>(url, { method: 'get' })
    }

    put<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/x-www-form-urlencoded' };
        return this.ajax<T>(url, { headers, data, method: 'put' });
    }

    post<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/x-www-form-urlencoded' };
        return this.ajax<T>(url, { headers, data, method: 'post', });
    }

    delete<T>(url: string, data: any) {
        let headers = { "content-type": 'application/x-www-form-urlencoded' };
        return this.ajax<T>(url, { headers, data, method: 'delete' });
    }
}