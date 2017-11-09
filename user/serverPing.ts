
class Ping {
    private opt: any;
    private favicon: string;
    private timeout: number;
    private img: HTMLImageElement;

    constructor(opt?: { favicon?: string, timeout?: number }) {
        this.opt = opt || {};
        this.favicon = this.opt.favicon || "/favicon.ico";
        this.timeout = this.opt.timeout || 0;
    }

    ping(source: string, callback: (error: string, pong: number) => void) {
        this.img = new Image();
        var timer;

        var start = new Date() as any;
        this.img.onload = pingCheck;
        this.img.onerror = pingCheck;
        if (this.timeout) {
            timer = setTimeout(pingCheck, this.timeout);
        }

        function pingCheck(e) {
            if (timer) {
                clearTimeout(timer);
            }
            var pong = new Date() as any - start;

            if (typeof callback === "function") {
                if (e.type === "error") {
                    console.error("error loading resource");
                    return callback("error", pong);
                }
                return callback(null, pong);
            }
        }

        let src = this.favicon.indexOf('?') >= 0 ?
            source + this.favicon + "&" + (+new Date()) :
            source + this.favicon + "?" + (+new Date());

        this.img.src = src;
    }

    /** 最佳服务器 */
    static optimumServer: string
}

let allServiceHosts = [`service.alinq.cn`, `service1.alinq.cn`, `service4.alinq.cn`];
let { protocol } = location;
for (let i = 0; i < allServiceHosts.length; i++) {
    let url = `${protocol}//${allServiceHosts[i]}/`;
    var p = new Ping({ favicon: 'user/index' });
    p.ping(url, (error, pong) => {
        if (!Ping.optimumServer)
            Ping.optimumServer = allServiceHosts[i];
    })
}
