define(["require", "exports", "admin/services/service", "admin/pageNodes", "admin/application"], function (require, exports, service_1, pageNodes_1, application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.app = application_1.default;
    // let bootbox = window['bootbox'];
    class Site {
        constructor() {
            this.config = {
                shopUrl: service_1.default.config.shopUrl,
                weixinUrl: service_1.default.config.weixinUrl,
                siteUrl: service_1.default.config.siteUrl,
                memberUrl: service_1.default.config.memberUrl,
            };
            this.style = {
                tableClassName: 'table table-striped table-bordered table-hover'
            };
        }
        get userClientUrl() {
            let { protocol, host, pathname } = location;
            pathname = pathname.replace('admin', 'user');
            let url = `${protocol}//${host}${pathname}?appKey=${service_1.default.appToken}#home_index`;
            return url;
        }
        loadCSS(path) {
        }
        storeUrl(stroeId) {
            let pageName = pageNodes_1.siteMap.nodes.home_index.name;
            console.assert(pageName != null);
            return `?appKey=${stroeId}#${pageName}`;
        }
        appIdFromLocation() {
            let url = location.search;
            let params = service_1.parseUrlParams(url);
            return params.appKey;
        }
    }
    let site = new Site();
    exports.default = site;
});
