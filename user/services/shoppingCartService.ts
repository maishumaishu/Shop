namespace userServices {
    export type ShoppingCartItem = {
        Id: string,
        Amount: number,
        Count: number,
        ImageUrl: string,
        IsGiven: boolean,
        Name: string,
        ProductId: string,
        Remark: string,
        Score: number,
        Selected: boolean,
        Unit: number,
        Price: number,
        Type: 'Reduce' | 'Discount'
    }

    export class ShoppingCartService extends Service {
        constructor() {
            super();
        }
        private url(path: string) {
            return `${config.service.shop}${path}`;
        }
        private processShoppingCartItems(items: ShoppingCartItem[]) {
            for (let i = 0; i < items.length; i++) {
                items[i].ImageUrl = imageUrl(items[i].ImageUrl);
                if (items[i].Remark) {
                    Object.assign(items[i], JSON.parse(items[i].Remark));
                }
            }

            return items;
        }

        addItem(productId: string, count?: number) {
            count = count || 1;
            return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/AddItem'), { productId, count })
                .then((result) => this.processShoppingCartItems(result))
                .then((result) => userData.shoppingCartItems.value = result);
        }

        updateItem(productId: string, count: number, selected: boolean) {
            let data = { productId: productId, count: count, selected: selected };
            return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/UpdateItem'), data)
                .then(items => this.processShoppingCartItems(items))
                .then((result) => userData.shoppingCartItems.value = result);
        }

        updateItems(productIds: string[], quantities: number[]) {
            let data = { productIds, quantities };
            return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/UpdateItems'), data)
                .then(items => this.processShoppingCartItems(items))
                .then(items => userData.shoppingCartItems.value = items);
        }

        items() {
            return this.get<ShoppingCartItem[]>(this.url('ShoppingCart/GetItems'))
                .then(items => this.processShoppingCartItems(items));
        }

        selectAll = () => {
            return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/SelectAll'))
                .then(items => this.processShoppingCartItems(items))
                .then(items => userData.shoppingCartItems.value = items);
        }

        unselectAll = () => {
            return this.post<ShoppingCartItem[]>(this.url('ShoppingCart/UnselectAll'))
                .then(items => this.processShoppingCartItems(items))
                .then(items => userData.shoppingCartItems.value = items);
        }

        /*移除购物车中的多个产品*/
        removeItems(productIds: string[]): Promise<any> {
            var result = this.post<ShoppingCartItem[]>(this.url('ShoppingCart/RemoveItems'), { productIds })
                .then(items => this.processShoppingCartItems(items))
                .then(items => userData.shoppingCartItems.value = items);

            return result;
        }
    }

}