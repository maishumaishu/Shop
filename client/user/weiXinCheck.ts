
(async function check () {

    var ua = navigator.userAgent.toLowerCase();
    let isWeiXin = (ua.match(/MicroMessenger/i) as any) == 'micromessenger';
    if(!isWeiXin)
        return ;

    let urlParams: { code?: string, appKey?:string, state?:string } = {};
    if (location.search)
        urlParams = parseUrlParams(location.search.substr(1));

    let openid = localStorage.getItem('openid');
    if(openid)
        return;

    if (isWeiXin && openid == null && urlParams.code == null) {
        let setting = await weixinSetting();
        if (setting == null)
            return;

        let appid = setting.AppId;
        let { protocol, pathname, search, hash, host } = location;
        var redirect_uri = `${protocol}//${host}${location.pathname}${search}`;
        var state = hash ? hash.substr(1) : '';

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
        history.pushState("","", u);
    }

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

    function serviceUrl(path:string){
        let { protocol }=location;
        let url = `${protocol}//service.alinq.cn/UserWeiXin/${path}?application-key=${urlParams.appKey}`;
        return  url;
    }
    async function weixinSetting(){
        let url = serviceUrl('WeiXin/GetConfig')
        let response = await fetch(url);
        return response.json();
    }

    async function getOpenId(code:string){
        let { protocol }=location;
        let url = serviceUrl('WeiXin/GetOpenId')  + `&code=${code}`;
        let response = await  fetch(url);
        return  response.json();
    }

})();