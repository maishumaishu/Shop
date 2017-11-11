import * as chitu from 'maishu-chitu';


let userToken = new chitu.ValueStore<string>(localStorage.getItem('userToken'));

let appToken: string;
export let tokens = {
    get appToken() {
        if (appToken == null) {
            let search = location.search;
            console.assert(search != null, 'search cannt null.');
            let query = parseUrlParams(location.search.substr(1));
            appToken = query['appKey'];
        }

        return appToken;
    },
    get userToken(): chitu.ValueStore<string> {
        return userToken;
    }
}

userToken.add((value) => {
    if (!value) {
        localStorage.removeItem('userToken');
        return;
    }
    localStorage.setItem('userToken', value);
})

export let config = {
    pageSize: 10
}


let protocol = location.protocol;
let defaultHost = 'service.alinq.cn';

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

export abstract class Service extends chitu.Service {
    static error = new chitu.Callback<Service, Error>();
    async ajax<T>(url: string, options: RequestInit) {

        let host = defaultHost; //Ping.optimumServer ||
        url = `${protocol}//${host}/${url}`;

        options = options || {};
        options.headers = options.headers;

        if (!tokens.appToken)
            throw new Error("app token error");

        options.headers['application-key'] = tokens.appToken;
        if (tokens.userToken.value)
            options.headers['user-token'] = tokens.userToken.value;

        this.error.add((sender, error) => {
            Service.error.fire(sender, error);
        })


        return super.ajax<T>(url, options);
    }
    get<T>(url: string, data?: any): Promise<T> {
        return super.getByJson(url, data);
    }
    post<T>(url: string, data?: any): Promise<T> {
        return super.postByJson(url, data);
    }
    put<T>(url: string, data?: any): Promise<T> {
        return super.putByJson(url, data);
    }
    delete<T>(url: string, data?: any): Promise<T> {
        return super.deleteByJson(url, data);
    }
}

export function imageUrl(path: string, width?: number, height?: number) {
    if (!path) return path;

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

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}