import { default as Service } from 'adminServices/service'

let bootbox = window['bootbox'];

class Site {
    constructor() {
    }
    showInfo(info) {
        return bootbox.alert('提示', info);
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
        let url = `../user/?${Service.appToken}#home_index`;
        // let url = `http://192.168.1.9/shop/user/#home/index?appToken=${Service.appToken}`;
        return url;
    }

}


export function formatDate(date: Date | string): string {
    if (date == null)
        return null;

    if (typeof date == 'string')
        return date;

    let d = date as Date;
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours() + 1}:${d.getMinutes()}`;
}


let site = new Site();
export default site; 