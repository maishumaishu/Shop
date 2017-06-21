/// <reference path="service.ts"/>
namespace userServices {
    export interface BalanceDetail {
        Amount: number,
        Balance: number,
        CreateDateTime: Date,
        RelatedId: string,
        RelatedType: string,
        Type: string
    }
    export interface ScoreDetail {
        Score: number,
        Type: string,
        CreateDateTime: Date,
        Balance: number,
    }
    export interface Account {
        UserId: string;
        Balance: number;
    }
    export class AccountService extends Service {
        private url(path: string) {
            return `${config.service.account}${path}`;
        }

        /**
         * 获取用户账户的余额
         */
        balance = () => {
            return userData.balance
        }

        balanceDetails(): Promise<BalanceDetail[]> {
            return this.get<BalanceDetail[]>(this.url('Account/GetBalanceDetails'), {});
        }

        scoreDetails(): Promise<ScoreDetail[]> {
            return this.get<ScoreDetail[]>(this.url('Account/GetScoreDetails'), {});
        }

        account(): Promise<Account> {
            return this.get<Account>(this.url('Account/GetAccount'));
        }

        payOrder(orderId: string, amount: number) {
            let url = this.url('Account/PayOrder');
            return this.put(url, { orderId, amount });
        }
    }

}