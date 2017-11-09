import { Service } from 'userServices/service';

export class WeiXinService extends Service {
    weixinSetting(): Promise<WeiXinSetting> {
        let url = `UserShop/Home/GetConfig`;
        return this.get<WeiXinSetting>(url);
    }
    get openid() {
        return localStorage.getItem('openid');
    }
    set openid(value: string) {
        localStorage.setItem('openid', value);
    }
}


