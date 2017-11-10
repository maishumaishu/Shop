interface Account {
    UserId: string;
    Balance: number;
}

interface BalanceDetail {
    Amount: number
    Balance: number
    CreateDateTime: Date
    Type: 'OrderPurchase' | 'OrderCancel' | 'OnlineRecharge' | 'StoreRecharge'
}

interface ScoreDetail {
    Score: number
    Balance: number
    CreateDateTime: Date
    Type: 'OrderPurchase' | 'OrderConsume'
}