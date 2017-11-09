import { Service } from 'userServices/service';

export class WeiXinService extends Service {
    weixinSetting<WeiXinSetting>(): Promise<WeiXinSetting> {
        let url = `UserShop/Home/GetConfig`;
        return this.get<WeiXinSetting>(url);
    }
}




