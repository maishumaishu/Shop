namespace userServices {
    /** 实现数据的存储，以及数据修改的通知 */
    export class ValueStore<T> {
        private funcs = new Array<(args: T) => void>();
        private _value: T;

        constructor() {
        }
        add(func: (value: T) => any): (args: T) => any {
            this.funcs.push(func);
            return func;
        }
        remove(func: (value: T) => any) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(value: T) {
            this.funcs.forEach(o => o(value));
        }
        get value(): T {
            return this._value;
        }
        set value(value: T) {
            if (this._value == value)
                return;

            this._value = value;
            this.fire(value);
        }
    }

    /** 与用户相关的数据 */
    export class UserData {
        private _productsCount = new ValueStore<number>();
        private _toEvaluateCount = new ValueStore<number>();
        private _sendCount = new ValueStore<number>();
        private _notPaidCount = new ValueStore<number>();
        private _balance = new ValueStore<number>();
        private _nickName = new ValueStore<string>();
        private _shoppingCartItems = new ValueStore<ShoppingCartItem[]>();
        private _userToken = new ValueStore<string>();

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

        get shoppingCartItems() {
            return this._shoppingCartItems;
        }

        get userToken() {
            return this._userToken;
        }
    }

    export let userData = new UserData();
    userData.userToken.add(() => {
        let ShoppingCart = new ShoppingCartService();

        ShoppingCart.items().then((value) => {
            userData.shoppingCartItems.value = value;
        })

        let member = Service.createService(MemberService); //new MemberService();
        member.userInfo().then((o: UserInfo) => {
            // userData.toEvaluateCount.value = o.ToEvaluateCount;
            // userData.sendCount.value = o.SendCount;
            // userData.notPaidCount.value = o.NotPaidCount;
            // userData.balance.value = 0;
            userData.nickName.value = o.NickName;
        })

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

        userData.shoppingCartItems.add(value => {
            //==============================================
            // Price >0 的为山商品，<= 0 的为赠品，折扣
            let sum = 0;
            value.filter(o => o.Price > 0).forEach(o => sum = sum + o.Count);
            userData.productsCount.value = sum;
            //==============================================
        })
    });
    
    userData.userToken.value = localStorage.getItem('userToken');
}


