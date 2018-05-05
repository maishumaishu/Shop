define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shopName = '好易微商城';
    exports.serviceHost = 'service.bailunmei.com'; //'service4.alinq.cn'; //'service.bailunmei.com';"192.168.1.24";//
    exports.websocketUrl = "shopws.bailunmei.com"; //"http://maishu.alinq.cn:48015";//
    exports.ADMIN_APP = 'admin-app';
    let protocol = location.protocol;
    let imageServer = "image.bailunmei.com";
    exports.imageServiceBaseUrl = `${protocol}//${imageServer}/`;
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    exports.guid = guid;
    exports.ErrorCodes = {
        Unkonwn: '600',
        UserNotLogin: '601',
        TokenInvalid: '724',
    };
    function imageUrl(path, width, height) {
        if (!path)
            return path;
        if (path.startsWith('data:image'))
            return path;
        if (path.indexOf(',') > 0) {
            path = path.split(',')[0];
        }
        let HTTP = 'http://';
        if (path.startsWith(HTTP)) {
            path = path.substr(HTTP.length);
            let index = path.indexOf('/');
            console.assert(index > 0);
            path = path.substr(index);
        }
        else if (path[0] == '/') {
            path = path.substr(1);
        }
        let urlParams = new Array();
        let protocol = location.protocol;
        let url = `${exports.imageServiceBaseUrl}${path}`;
        if (width) {
            // url = url + '?width=' + width;
            urlParams.push({ name: 'width', value: width.toString() });
            if (height)
                urlParams.push({ name: 'height', value: height.toString() });
        }
        if (navigator.userAgent.indexOf('chrome') < 0) {
            urlParams.push({ name: 'type', value: 'jpeg' });
        }
        if (urlParams.length > 0) {
            url = url + '?' + urlParams.map(o => `${o.name}=${o.value}`).join('&');
        }
        return url;
    }
    exports.imageUrl = imageUrl;
    exports.urlParams = {};
    if (location.search)
        exports.urlParams = parseUrlParams(location.search.substr(1));
    function parseUrlParams(query) {
        if (!query)
            throw new Error(`Argument query is null or empty.`);
        if (query[0] == '?')
            query = query.substr(1);
        let match, pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        let urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }
    exports.parseUrlParams = parseUrlParams;
    function formatDate(date) {
        if (date == null)
            return null;
        if (typeof date == 'string')
            return date;
        let d = date;
        let mm = d.getMonth() + 1;
        let dd = d.getDate();
        return `${d.getFullYear()}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;
    }
    exports.formatDate = formatDate;
    function formatDateTime(date) {
        if (date == null)
            return null;
        if (typeof date == 'string')
            return date;
        let d = date;
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
    exports.formatDateTime = formatDateTime;
});
