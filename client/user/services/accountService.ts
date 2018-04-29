import { Service } from 'user/services/service';

export class AccountService extends Service {
    private url(path: string) {
        return `UserAccount/${path}`;
    }

    // /**
    //  * 获取用户账户的余额
    //  */
    // balance = () => {
    //     return userData.balance;
    // }

    balanceDetails(): Promise<BalanceDetail[]> {
        return this.getByJson<BalanceDetail[]>(this.url('Account/GetBalanceDetails'), {});
    }

    scoreDetails(): Promise<ScoreDetail[]> {
        return this.getByJson<ScoreDetail[]>(this.url('Account/GetScoreDetails'), {});
    }

    account(): Promise<Account> {
        return this.getByJson<Account>(this.url('Account/GetAccount'));
    }

    payOrder(orderId: string, amount: number) {
        let url = this.url('Account/PayOrder');
        return this.putByJson(url, { orderId, amount });
    }
}

