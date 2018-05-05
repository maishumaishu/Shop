define(["require", "exports", "user/services/memberService", "user/services/accountService", "user/services/shoppingService"], function (require, exports, memberService_1, accountService_1, shoppingService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** 与用户相关的数据 */
    class UserData {
        constructor() {
            this._productsCount = new chitu.ValueStore();
            this._toEvaluateCount = new chitu.ValueStore();
            this._sendCount = new chitu.ValueStore();
            this._notPaidCount = new chitu.ValueStore();
            this._balance = new chitu.ValueStore();
            this._nickName = new chitu.ValueStore();
            // private _shoppingCartItems = new chitu.ValueStore<ShoppingCartItem[]>();
            this._userToken = new chitu.ValueStore();
            this._score = new chitu.ValueStore();
            this._userInfo = new chitu.ValueStore();
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
        get userInfo() {
            return this._userInfo;
        }
    }
    exports.UserData = UserData;
    exports.userData = new UserData();
    exports.userData.userToken.add((value) => {
        if (!value)
            return;
        // let ShoppingCart = new ShoppingCartService();
        // ShoppingCart.items().then((value) => {
        //     userData.shoppingCartItems.value = value;
        // })
        let account = new accountService_1.AccountService();
        account.account().then(o => {
            exports.userData.balance.value = o.Balance;
        });
        let shopping = new shoppingService_1.ShoppingService();
        shopping.ordersSummary().then(data => {
            exports.userData.toEvaluateCount.value = data.ToEvaluateCount;
            exports.userData.sendCount.value = data.SendCount;
            exports.userData.notPaidCount.value = data.NotPaidCount;
        });
        let member = new memberService_1.MemberService();
        member.userInfo().then(data => {
            exports.userData.userInfo.value = data;
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
    exports.userData.userToken.value = localStorage.getItem('userToken');
});
