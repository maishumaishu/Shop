export const shopName = '好易微商城';
export const serviceHost = 'userservices.alinq.cn'; //'service4.alinq.cn'; //'service.bailunmei.com';"192.168.1.24";//
export const websocketUrl = "shopws.bailunmei.com";//"http://maishu.alinq.cn:48015";//
export const imageServer = "image.bailunmei.com";
export interface AppError extends Error {
    handled: boolean
}
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


export let ErrorCodes = {
    Unkonwn: '600',
    UserNotLogin: '601',
    TokenInvalid: '724',
}

export function imageUrl(path: string, width?: number, height?: number) {
    if (!path) return path;
    if (path.startsWith('data:image'))
        return path;

    let HTTP = 'http://'
    if (path.startsWith(HTTP)) {
        path = path.substr(HTTP.length);
        let index = path.indexOf('/');
        console.assert(index > 0);
        path = path.substr(index);
    }
    else if (path[0] != '/') {
        path = '/' + path;
    }

    let urlParams = new Array<{ name: string, value: string }>();
    let protocol = location.protocol;
    let url = `${protocol}//${imageServer}` + path;
    if (width) {
        // url = url + '?width=' + width;
        urlParams.push({ name: 'width', value: width.toString() });
    }

    if (navigator.userAgent.indexOf('chrome') < 0) {
        urlParams.push({ name: 'type', value: 'jpeg' })
    }

    if (urlParams.length > 0) {
        url = url + '?' + urlParams.map(o => `${o.name}=${o.value}`).join('&');
    }

    return url;
}


export let urlParams: { code?: string, appKey?: string, state?: string } = {};
if (location.search)
    urlParams = parseUrlParams(location.search.substr(1));

export function parseUrlParams(query: string) {
    if (!query) throw new Error(`Argument query is null or empty.`);
    if (query[0] == '?')
        query = query.substr(1);

    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    let urlParams: any = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}

export function formatDate(date: Date | string): string {
    if (date == null)
        return null;

    if (typeof date == 'string')
        return date;

    let d = date as Date;
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    return `${d.getFullYear()}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;
}

export function formatDateTime(date: Date | string): string {
    if (date == null)
        return null;

    if (typeof date == 'string')
        return date;

    let d = date as Date;
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
}

