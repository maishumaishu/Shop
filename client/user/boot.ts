/** 获取连接速度最快的服务器 */
(function () {

    let service_domain = `userservices.alinq.cn`;
    function get(url): Promise<any> {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.send(null);
            request.onreadystatechange = () => {
                if (request.readyState == 4) {
                    let text = request.responseText;
                    let obj = JSON.parse(text);

                    if (request.status == 200) {
                        resolve(obj);
                        return;
                    }
                    else {
                        reject(obj);
                    }
                    // document.getElementById("myDiv").innerHTML = request.responseText;
                }

                // reject(new Error(`state code:${request.status}`));
            }

            setTimeout(() => {
                reject(new Error("time out"));
            }, 1000 * 10);
        })
        // let text = request.responseText;
        // return JSON.parse(text);
    }


    let urlParams: { code?: string, appKey?: string, state?: string } = {};
    if (location.search)
        urlParams = parseUrlParams(location.search.substr(1));

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

    /** 微信环境获取用户的 openid */
    (async function check() {
        var ua = navigator.userAgent.toLowerCase();
        let isWeiXin = (ua.match(/MicroMessenger/i) as any) == 'micromessenger';
        if (!isWeiXin)
            return;

        let openid = localStorage.getItem('openid');
        if (openid)
            return;

        if (isWeiXin && openid == null && urlParams.code == null) {
            let setting = await weixinSetting();
            if (setting == null)
                return;

            let appid = setting.AppId;
            let { protocol, pathname, search, hash, host } = location;
            var redirect_uri = `${protocol}//${host}${location.pathname}${search}`;
            var state = hash ? hash.substr(1) : '';

            //======================================
            // host 为 IP，无法使用微信 auth
            if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(host))
                return;

            if (host == 'localhost')
                return;
            //======================================

            var url =
                `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`
            location.href = url;
        }
        else if (urlParams.code) {
            let openId = await getOpenId(urlParams.code);
            if (openId != null)
                localStorage.setItem('openid', openId);

            let { protocol, pathname, host } = location;
            let search = `?appKey=${urlParams.appKey}`;
            let hash = `#${urlParams.state}`;
            let u = `${protocol}//${host}${location.pathname}${search}${hash}`

            location.hash = hash;
            history.pushState("", "", u);
        }

        function serviceUrl(path: string) {
            let { protocol } = location;
            let url = `${protocol}//${service_domain}/UserWeiXin/${path}?application-key=${urlParams.appKey}`;
            return url;
        }

        async function weixinSetting() {
            let url = serviceUrl('WeiXin/GetConfig');
            return get(url);
        }

        async function getOpenId(code: string) {
            let { protocol } = location;
            let url = serviceUrl('WeiXin/GetOpenId') + `&code=${code}`;
            return get(url);
        }

    })();

    (async function () {
        let { protocol } = location;
        let url = `${protocol}//${service_domain}/UserSite/Store/Get?application-id=${urlParams.appKey}`;
        let store = await get(url);
        if (store != null && store.Name != null) {
            document.title = store.Name;
            localStorage.setItem(`${urlParams.appKey}_storeName`, store.Name);
        }

    })();

})();



