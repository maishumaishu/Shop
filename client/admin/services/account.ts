import { default as Service, guid } from 'services/service';

export class AccountService extends Service {
    private url(path: string): string {
        return `${Service.config.accountUrl}Account/${path}`;
    }
    offlinePayOrder(orderId: string, userId: string, paymentType: 'weixin' | 'alipay', amount: number) {
        let url = this.url('OfflinePayOrder');
        return this.put(url, { orderId, userId, paymentType, amount });
    }
}