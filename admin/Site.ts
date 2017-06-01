import { default as Service } from 'services/Service';

let bootbox = window['bootbox'];

// class SiteCookies {
//     private site: Site;

//     constructor(site: Site) {
//         this.site = site;
//     }
//     name(name) {
//         return 'CookiePrefix' + "_" + name;
//     }
//     value(name, value?) {
//         var cookie_name = this.name(name);
//         if (value === undefined)
//             return $.cookie(cookie_name);

//         $.cookie(cookie_name, value);
//     }
//     appToken() {
//         return "E26297B41339791C2F79EA9F5D66CC090C47F8265F984EA7239322642C0B333D65E49B0DDC581C3C";//this.value('appToken');
//     }
//     shopUrl() {
//         return this.value('shopUrl');
//     }
//     siteUrl() {
//         return this.value('siteUrl');
//     }
//     weixinUrl() {
//         return this.value('weixinUrl');
//     }
//     memberUrl() {
//         return this.value('memberUrl');
//     }
// }
class Site {
    constructor() {
    }
    showInfo(info) {
        return bootbox.alert('提示', info);
    }
    config = {
        shopUrl: Service.config.shopUrl,
        weixinUrl: Service.config.weixinUrl,
        siteUrl: Service.config.siteUrl,
        memberUrl: Service.config.memberUrl,
        // startUrl: 'Home/Index'
    }
    style = {
        tableClassName: 'table table-striped table-bordered table-hover'
    }
    startUrl: 'Home/Index';
    get userClientUrl() {
        let url = `../user/?${Service.appToken}#home_index`;
        // let url = `http://192.168.1.9/shop/user/#home/index?appToken=${Service.appToken}`;
        return url;
    }

}



let site = new Site();
export default site; 