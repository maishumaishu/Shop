import { Service } from 'userServices/service';
// import { ShoppingCartService } from 'user/services/shoppingCartService';
import { MemberService } from 'user/services/memberService';
import { AccountService } from 'user/services/accountService';
import { ShoppingService } from 'user/services/shoppingService';

/** 与用户相关的数据 */
export class UserData {
    private _productsCount = new chitu.ValueStore<number>();
    private _toEvaluateCount = new chitu.ValueStore<number>();
    private _sendCount = new chitu.ValueStore<number>();
    private _notPaidCount = new chitu.ValueStore<number>();
    private _balance = new chitu.ValueStore<number>();
    private _nickName = new chitu.ValueStore<string>();
    // private _shoppingCartItems = new chitu.ValueStore<ShoppingCartItem[]>();
    private _userToken = new chitu.ValueStore<string>();
    private _score = new chitu.ValueStore<number>();

    constructor() {
        this.userToken.add((value) => {
            if (!value) {
                localStorage.removeItem('userToken');
                //TODO:ClearData
                return;
            }

            localStorage.setItem('userToken', value);
            //=================================
            // window.setTimeout(() => {
            //     this.loadData();
            // }, 100);
            //=================================
        });
    }

    /** 购物车中的商品数 */
    get productsCount() {
        return this._productsCount;
    }

    /** 待评价商品数 */
    get toEvaluateCount() {
        return this._toEvaluateCount;
    }

    /** 已发货订单数量 */
    get sendCount() {
        return this._sendCount;
    }

    /** 未付货订单数 */
    get notPaidCount() {
        return this._notPaidCount;
    }

    get balance() {
        return this._balance;
    }

    get nickName() {
        return this._nickName;
    }

    // get shoppingCartItems() {
    //     return this._shoppingCartItems;
    // }

    get userToken() {
        return this._userToken;
    }

    get score() {
        return this._score;
    }
}

export let userData = new UserData();
userData.userToken.add(() => {
    // let ShoppingCart = new ShoppingCartService();

    // ShoppingCart.items().then((value) => {
    //     userData.shoppingCartItems.value = value;
    // })



    let account = new AccountService();
    account.account().then(o => {
        userData.balance.value = o.Balance;
    });

    let shopping = new ShoppingService();
    shopping.ordersSummary().then(data => {
        userData.toEvaluateCount.value = data.ToEvaluateCount;
        userData.sendCount.value = data.SendCount;
        userData.notPaidCount.value = data.NotPaidCount;
    });

    // userData.shoppingCartItems.add(value => {
    //     //==============================================
    //     // Price >0 的为山商品，<= 0 的为赠品，折扣
    //     let sum = 0;
    //     value.filter(o => o.Price > 0).forEach(o => sum = sum + o.Count);
    //     userData.productsCount.value = sum;
    //     //==============================================
    // })
});

userData.userToken.value = localStorage.getItem('userToken');



