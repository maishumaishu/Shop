
import $ = require('jquery');

let service_host = 'service.alinq.cn:2800'
export = class Service {
    static error = $.Callbacks()
    static config = {
        shopUrl: `http://${service_host}/AdminServices/Shop/`,
        weixinUrl: `http://${service_host}/AdminServices/WeiXin/`,
        siteUrl: `http://${service_host}/AdminServices/Site/`,
        memberUrl: `http://${service_host}/AdminServices/Member/`,
    }
    static callMethod(path: string, data?): JQueryPromise<any> {
        data = data || {};
        var url = Service.config.shopUrl + path;
        return $.ajax({ url: url, data: data, method: 'post' });
    }

    static get(path: string, data?): JQueryPromise<any> {
        data = data || {};
        var url = Service.config.shopUrl + path;
        return $.ajax({ url: url, data: data, method: 'get' });
    }

    static putAsJson(path: string, data) {
        var url = Service.config.shopUrl + path;
        return $.ajax({
            headers: {
                'content-type': 'application/json'
            },
            url: url, data: JSON.stringify(data),
            method: 'put'
        });
    }

    static postAsJson(path: string, data) {
        var url = Service.config.shopUrl + path;
        return $.ajax({
            headers: {
                'content-type': 'application/json'
            },
            url: url, data: JSON.stringify(data),
            method: 'post'
        });
    }

    ajax(options: { url: string, data?, method?: string }) {
        // data = data || {};
        // return $.ajax({ url, data, method: 'post' });
        return $.ajax(options);
    }

    static appToken = "58424776034ff82470d06d3d";
    static token = '';
    static storeId = '58401d1906c02a2b8877bd13';
}

window['models'] = {};
window['translators'] = window['translators'] || {};
window['services'] = window['services'] || {};

// export = <Services>window['services'];


