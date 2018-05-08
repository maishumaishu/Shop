import { default as Service, parseUrlParams } from 'admin/services/service'
import { siteMap } from 'admin/pageNodes';

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
    get userClientUrl() {
        let { protocol, host, pathname } = location;
        pathname = pathname.replace('admin', 'user');
        let url = `${protocol}//${host}${pathname}?appKey=${Service.appToken}#home_index`;
        return url;
    }
    loadCSS(path: string) {

    }
    storeUrl(stroeId: string) {
        let pageName = (siteMap.nodes.home_index as chitu.PageNode).name;
        console.assert(pageName != null);
        return `?appKey=${stroeId}#${pageName}`;
    }
    appIdFromLocation() {
        let url = location.search;
        let params = parseUrlParams(url);
        return params.appKey;
    }
}





let site = new Site();
export default site; 