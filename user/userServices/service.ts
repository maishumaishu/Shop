
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

// const REMOTE_HOST = 'service.alinq.cn';
export let config = {
    /** 调用服务接口超时时间，单位为秒 */
    ajaxTimeout: 30,
    pageSize: 10
}

// let host: string;
let protocol = location.protocol;
let allServiceHosts = [`service.alinq.cn`, `service1.alinq.cn`, `service4.alinq.cn`];

function parseUrlParams(query: string) {
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
    async ajax<T>(url: string, options: RequestInit) {

        let host = await this.getServiceHost();

        url = `${protocol}//${host}/` + url;


        options = options || {};
        options.headers = options.headers;

        options.headers['application-key'] = tokens.appToken;
        if (tokens.userToken.value)
            options.headers['user-token'] = tokens.userToken.value;

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
    private async ping<T>(method: () => Promise<T>) {
        var start: number = new Date() as any;
        let result = await method();
        var pong = new Date() as any - start;
        return Object.assign(result, { pong });
    }
    private async hostPing(host: string): Promise<number> {
        let app_key = location.search.substr(1);

        let url = "UserShop/Home/";
        let m = () => this.get<string>(url);
        let data = await Promise.all([
            this.ping(m),
            this.ping(m),
            this.ping(m)
        ]);

        // localStorage.setItem('appid', data[0].AppId);

        let arr = data.map(o => o.pong);
        let num = (arr[0] + arr[1] + arr[2]) / 3;
        return num;
    }
    private async getServiceHost(): Promise<string> {
        let host = localStorage['ServiceHost'];
        if (host)
            return Promise.resolve(host);

        host = await new Promise<string>((resolve, reject) => {
            let result: string;
            for (let i = 0; i < allServiceHosts.length; i++) {
                this.hostPing(allServiceHosts[i]).then(o => {
                    console.log(`ping: ${allServiceHosts[i]} ${o}`);

                    if (!result) {
                        result = allServiceHosts[i];
                        resolve(result);
                    }
                });
            }
        });

        localStorage['ServiceHost'] = host;
        return host;
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

    let url = 'https://image.alinq.cn' + path;
    if (width) {
        url = url + '?width=' + width;
        if (height) {
            url = url + '&height=' + height;
        }
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