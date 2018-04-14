import * as chitu from 'maishu-chitu';
import { guid } from 'mobileComponents/editor';
import { urlParams, serviceHost } from 'share/common';
export { guid, imageUrl, parseUrlParams, urlParams } from 'share/common';

let appToken: string;
let _userToken: chitu.ValueStore<string>;
export let tokens = {
    get appToken() {
        if (appToken == null) {
            let search = location.search;
            console.assert(search != null, 'search cannt null.');
            appToken = urlParams.appKey;
        }

        return appToken;
    },
    get userToken(): chitu.ValueStore<string> {
        if (_userToken == null) {
            let USER_TOKEN = `${tokens.appToken}_userToken`;
            //=========================================
            //FOR TEST
            // var a = 1;
            // localStorage.setItem(USER_TOKEN, '5a45dc610645b4047cde18f9')
            //=========================================
            _userToken = new chitu.ValueStore<string>(localStorage.getItem(USER_TOKEN));

            _userToken.add((value) => {
                if (!value) {
                    localStorage.removeItem(USER_TOKEN);
                    return;
                }
                localStorage.setItem(USER_TOKEN, value);
            })

        }
        return _userToken;
    }
}





export let config = {
    pageSize: 10
}


let protocol = location.protocol;
let service_domain = serviceHost;

export abstract class Service extends chitu.Service {
    static error = chitu.Callbacks<Service, Error>();
    async ajax<T>(url: string, options: chitu.AjaxOptions) {

        let host = service_domain; //Ping.optimumServer ||
        url = `${protocol}//${host}/${url}`;

        options = options || {};
        options.headers = options.headers || {};

        let self = this;
        if (!tokens.appToken) {
            let err = new Error("app token error");
            Service.error.fire(self, err);
            return;
        }

        options.headers['application-id'] = tokens.appToken;
        if (tokens.userToken.value)
            options.headers['token'] = tokens.userToken.value;

        return super.ajax<T>(url, options).catch(err => {
            Service.error.fire(self, err);
            return Promise.reject(err);
        });
    }

    static get storeName() {
        let key = `${urlParams.appKey}`;
        return "";
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

    get<T>(url: string, data: any) {
        return this.ajax<T>(url, { method: 'get' })
    }
}

