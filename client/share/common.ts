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

// export function imageUrl(path: string, width?: number) {
//     if (!path) return path;
//     if (path.startsWith("data:image")) {
//         return path;
//     }

//     let HTTP = 'http://'
//     if (path.startsWith(HTTP)) {
//         path = path.substr(HTTP.length);
//         let index = path.indexOf('/');
//         console.assert(index > 0);
//         path = path.substr(index);
//     }
//     else if (path[0] != '/') {
//         path = '/' + path;
//     }

//     let url = 'https://image.alinq.cn' + path;
//     if (width) {
//         url = url + '?width=' + width;
//     }
//     return url;
// }

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
    let url = `${protocol}//image.alinq.cn` + path;
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
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    let urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}
