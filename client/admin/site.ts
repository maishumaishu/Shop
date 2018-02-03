import { default as Service } from 'services/service'

// let bootbox = window['bootbox'];

class Site {
    constructor() {
    }
    config = {
        shopUrl: Service.config.shopUrl,
        weixinUrl: Service.config.weixinUrl,
        siteUrl: Service.config.siteUrl,
        memberUrl: Service.config.memberUrl,
        // startUrl: 'Home/Index'
    }
    style = {
        tableClassName: 'table table-striped table-bordered table-hover'
    }
    startUrl: 'Home/Index';
    get userClientUrl() {
        // let arr = location.pathname.split('/');
        // console.assert(arr.length > 1);
        // arr[arr.length - 1] = 'user';
        let { protocol, host, pathname } = location;
        pathname = pathname.replace('admin', 'user');
        let url = `${protocol}//${host}${pathname}?appKey=${Service.appToken}#home_index`;
        // let url = `http://192.168.1.9/shop/user/#home/index?appToken=${Service.appToken}`;
        return url;
    }

}


<<<<<<< HEAD

=======
>>>>>>> 2e39c4920d331aff5a2a51f341f36d2daf61ebd9

let site = new Site();
export default site; 