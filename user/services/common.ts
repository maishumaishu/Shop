namespace userServices {
    //==========================================================
    // 公用函数 模块开始
    export function imageUrl(path: string, width?: number) {
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

    // 公用函数 模块结束
    //==========================================================
}