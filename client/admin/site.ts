import { default as Service } from 'admin/services/service'
export { default as app } from 'admin/application';
export { default as siteMap } from 'admin/siteMap';

// let bootbox = window['bootbox'];

class Site {
    constructor() {
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
        let { protocol, host, pathname } = location;
        pathname = pathname.replace('admin', 'user');
        let url = `${protocol}//${host}${pathname}?appKey=${Service.appToken}#home_index`;
        return url;
    }
}





let site = new Site();
export default site; 