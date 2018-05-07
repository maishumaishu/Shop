var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShoppingCartService extends service_1.Service {
        constructor() {
            super();
            this.SHOPPING_CART_STORAGE_NAME = 'shoppingCart';
            this.timeids = {};
            ShoppingCartService.items.add((items) => {
                let count = ShoppingCartService.calculateProdusCount(items);
                ShoppingCartService.productsCount.value = count;
            });
        }
        static calculateProdusCount(items) {
            let count = 0;
            items.filter(o => o.IsGiven != true)
                .forEach(o => count = count + o.Count);
            return count;
        }
        url(method) {
            return `UserShop/ShoppingCart/${method}`;
        }
        addItem(item) {
            let url = this.url("AddItem");
            return this.postByJson(url, { item });
        }
        _setItemCount(itemId, count) {
            if (count <= 0) {
                let url = this.url('RemoveItems');
                return this.deleteByJson(url, { itemIds: [itemId] });
            }
            let url = this.url('SetItemCount');
            let item = { itemId, count };
            return this.putByJson(url, { item });
        }
        setItemCount(item, count) {
            return __awaiter(this, void 0, void 0, function* () {
                if (item.ProductId != null)
                    return this.setItemCountByItem(item, count);
                return this.setItemCountByProduct(item, count);
            });
        }
        setItemCountByItemId(itemId, count) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, rejct) => {
                    //================================================================
                    // 采用延时更新，减轻服务器负荷
                    let setItemCountTimeoutId = this.timeids[itemId];
                    if (setItemCountTimeoutId != null) {
                        window.clearTimeout(setItemCountTimeoutId);
                    }
                    this.timeids[itemId] = setTimeout(() => {
                        this._setItemCount(itemId, count)
                            .then(() => resolve())
                            .catch(err => rejct(err));
                    }, 1000 * 3); // 延迟 3 秒更新
                    //================================================================
                });
            });
        }
        setItemsCount(itemIds, counts) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('SetItemsCount');
                yield this.putByJson(url, { ids: itemIds, counts });
                for (let i = 0; i < itemIds.length; i++) {
                    ShoppingCartService.items.value.filter(o => o.Id == itemIds[i])[0].Count = counts[i];
                }
                ShoppingCartService.items.fire(ShoppingCartService.items.value);
            });
        }
        setItemCountByItem(item, count) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.setItemCountByItemId(item.Id, count);
                var shoopingCartItem = ShoppingCartService.items.value.filter(o => o.Id == item.Id)[0];
                console.assert(shoopingCartItem != null);
                shoopingCartItem.Count = count;
                ShoppingCartService.items.fire(ShoppingCartService.items.value);
            });
        }
        setItemCountByProduct(product, count) {
            return __awaiter(this, void 0, void 0, function* () {
                let shoppingCartItems = ShoppingCartService.items.value;
                let shoppingCartItem = shoppingCartItems.filter(o => o.ProductId == product.Id && o.Type == null)[0];
                let result;
                if (shoppingCartItem == null) {
                    shoppingCartItem = {
                        Id: service_1.guid(),
                        Amount: product.Price * count,
                        Count: count,
                        ImagePath: product.ImagePath,
                        Name: product.Name,
                        ProductId: product.Id,
                        Selected: true,
                        Price: product.Price,
                    };
                    this.addItem(shoppingCartItem);
                    shoppingCartItems.push(shoppingCartItem);
                }
                else {
                    this.setItemCountByItemId(shoppingCartItem.Id, count);
                    shoppingCartItem.Count = count;
                }
                ShoppingCartService.items.value = shoppingCartItems;
                return result;
            });
        }
        static get items() {
            return ShoppingCartService._items;
        }
        onChanged(component, callback) {
            let func = ShoppingCartService.items.add(callback);
            let componentWillUnmount = component.componentWillUnmount;
            let items = ShoppingCartService.items;
            component.componentWillUnmount = function () {
                items.remove(func);
                componentWillUnmount();
            };
        }
        selectItem(itemId) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('SelectItems');
                // let item = { Id: itemId, Selected: true } as ShoppingCartItem;
                yield this.putByJson(url, { ids: [itemId], selected: true });
                ShoppingCartService.items.value.filter(o => o.Id == itemId)[0].Selected = true;
                ShoppingCartService.items.fire(ShoppingCartService.items.value);
            });
        }
        unselectItem(itemId) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('SelectItems');
                let item = { Id: itemId, Selected: false };
                yield this.putByJson(url, { ids: [itemId], selected: false });
                ShoppingCartService.items.value.filter(o => o.Id == itemId)[0].Selected = false;
                ShoppingCartService.items.fire(ShoppingCartService.items.value);
            });
        }
        selectAll() {
            let url = this.url('SelecteAll');
            ShoppingCartService.items.value.forEach(o => o.Selected = true);
            ShoppingCartService.items.fire(ShoppingCartService.items.value);
            return this.putByJson(url);
        }
        unselectAll() {
            let url = this.url('UnselecteAll');
            ShoppingCartService.items.value.forEach(o => o.Selected = false);
            ShoppingCartService.items.fire(ShoppingCartService.items.value);
            return this.putByJson(url);
        }
        static get productsCount() {
            // let count = 0;
            // ShoppingCartService.items.value.forEach(o => count = count + o.Count);
            // return count;
            return ShoppingCartService._productsCount;
        }
        get selectedCount() {
            let count = 0;
            ShoppingCartService.items.value.filter(o => o.Selected).forEach(o => count = count + o.Count);
            return count;
        }
        /*移除购物车中的多个产品*/
        removeItems(itemIds) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('RemoveItems');
                yield this.deleteByJson(url, { itemIds });
                let items = ShoppingCartService.items.value.filter(o => itemIds.indexOf(o.Id) < 0);
                ShoppingCartService.items.value = items;
            });
        }
        calculateShoppingCartItems() {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('Calculate');
                let result = yield this.getByJson(url).then(items => {
                    items = items || [];
                    items.forEach(o => o.ImagePath = o.ImagePath || o.ImageUrl);
                    return items;
                });
                return result;
            });
        }
        items() {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url("Get");
                return this.getByJson(url).then(items => {
                    items.forEach(o => o.ImagePath = o.ImagePath || o.ImageUrl);
                    return items;
                });
            });
        }
    }
    ShoppingCartService._items = new chitu.ValueStore([]);
    ShoppingCartService._productsCount = new chitu.ValueStore();
    exports.ShoppingCartService = ShoppingCartService;
});
