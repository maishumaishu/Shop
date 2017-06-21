namespace userServices {
    //==========================================================
    // 公用函数 模块开始
    export function imageUrl(path: string) {
        if (path.startsWith(`http://localhost:${location.port}`)) {
            path = path.substr(`http://localhost:${location.port}`.length);
        }
        else if (path.startsWith('http://localhost')) {
            path = path.substr('http://localhost'.length);
        }
        else if (path.startsWith('file://')) {
            path = path.substr('file://'.length);
        }
        const imageBasePath = 'http://service.alinq.cn:2800/AdminServices/Shop';
        let url: string;
        if (!path.startsWith('http')) {
            url = imageBasePath + path;
        }
        else {
            url = path;
        }
        url = url + `?application-key=${tokens.appToken}`;
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

    // 公用函数 模块结束
    //==========================================================
}