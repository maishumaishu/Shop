import * as chitu from 'maishu-chitu';
import { guid } from 'components/editor';
import { urlParams, serviceHost } from 'share/common';
import BaseService from 'share/service';
export { guid, imageUrl, parseUrlParams, urlParams } from 'share/common';

let appToken: string;
// let _userToken: chitu.ValueStore<string>;
// let USER_TOKEN = `${tokens.appToken}_userToken`;
export let tokens = (function () {

    let appId = urlParams.appKey;
    let USER_TOKEN = `${appId}_userToken`;
    let userToken = new chitu.ValueStore(localStorage.getItem(USER_TOKEN));

    userToken.add((value) => {
        if (!value) {
            localStorage.removeItem(USER_TOKEN);
            return;
        }
        localStorage.setItem(USER_TOKEN, value);
    })

    return {
        appId,
        userToken
    }

    // {
    //     get appToken() {
    //         if (appToken == null) {
    //             let search = location.search;
    //             console.assert(search != null, 'search cannt null.');
    //             appToken = urlParams.appKey;
    //         }

    //         return appToken;
    //     },
    //     // get userToken(): chitu.ValueStore<string> {
    //     //     if (_userToken == null) {
    //     //         let USER_TOKEN = `${tokens.appToken}_userToken`;
    //     //         //=========================================
    //     //         //FOR TEST
    //     //         // var a = 1;
    //     //         // localStorage.setItem(USER_TOKEN, '5a45dc610645b4047cde18f9')
    //     //         //=========================================
    //     //         _userToken = new chitu.ValueStore<string>(localStorage.getItem(USER_TOKEN));

    //     //         _userToken.add((value) => {
    //     //             if (!value) {
    //     //                 localStorage.removeItem(USER_TOKEN);
    //     //                 return;
    //     //             }
    //     //             localStorage.setItem(USER_TOKEN, value);
    //     //         })

    //     //     }
    //     //     return _userToken;
    //     // }
    //     userToken:new chitu.ValueStore<string>(localStorage.getItem())
    // }


})();





export let config = {
    pageSize: 10
}


let protocol = location.protocol;

let service_domain = serviceHost;

export abstract class Service extends BaseService {
    static error = chitu.Callbacks<Service, Error>();
    async ajax<T>(url: string, options: chitu.AjaxOptions) {

        let host = service_domain; //Ping.optimumServer ||
        url = `${protocol}//${host}/${url}`;

        options = options || {};
        options.headers = options.headers || {};

        let self = this;
        if (!tokens.appId) {
            let err = new Error("app token error");
            Service.error.fire(self, err);
            return;
        }

        options.headers['application-id'] = tokens.appId;
        if (tokens.userToken.value)
            options.headers['token'] = tokens.userToken.value;

        return super.ajax<T>(url, options);
    }

    static get storeName() {
        let key = `${urlParams.appKey}`;
        return "";
    }
}

