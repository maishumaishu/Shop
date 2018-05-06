var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "components/common", "user/services/service", "user/services/shoppingCartService", "user/services/shoppingService", "user/site", "user/siteMap"], function (require, exports, common_1, service_1, shoppingCartService_1, shoppingService_1, site_1, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let status = new chitu.ValueStore('normal');
    let deleteItemsCount = new chitu.ValueStore(0);
    class Header extends common_1.Control {
        constructor(props) {
            super(props);
            this.state = { status: status.value };
            this.subscribe(status, (value) => {
                this.state.status = value;
                this.setState(this.state);
            });
        }
        get persistentMembers() {
            return [];
        }
        componentDidMount() {
        }
        edit() {
            this.shoppingCart.edit();
        }
        get shoppingCart() {
            if (this._shoppingCart == null) {
                let c = this.mobilePage.controls.filter(o => o instanceof ShoppingCartControl)[0];
                console.assert(c != null);
                this._shoppingCart = c;
            }
            return this._shoppingCart;
        }
        cancle() {
            this.shoppingCart.cancel();
        }
        get hasEditor() {
            return false;
        }
        _render() {
            let { status } = this.state;
            let showBackButton = this.elementPage.name == 'shopping.shoppingCartNoMenu';
            return site_1.defaultNavBar(this.elementPage, {
                title: '购物车',
                right: h("button", { className: "right-button", style: { width: 'unset' }, onClick: () => __awaiter(this, void 0, void 0, function* () {
                        yield this.edit();
                        this.state.status = this.shoppingCart.state.status;
                        this.setState(this.state);
                    }) }, status == 'normal' ? '编辑' : '完成'),
                showBackButton
            });
        }
    }
    exports.Header = Header;
    class Footer extends common_1.Control {
        constructor(props) {
            super(props);
            this.state = { items: shoppingCartService_1.ShoppingCartService.items.value, status: status.value };
            this.subscribe(status, (value) => {
                this.state.status = value;
                this.setState(this.state);
            });
            this.subscribe(shoppingCartService_1.ShoppingCartService.items, (value) => {
                this.state.items = value;
                this.setState(this.state);
            });
            this.subscribe(deleteItemsCount, (value) => {
                this.state.deleteItemsCount = deleteItemsCount.value;
                this.setState(this.state);
            });
        }
        get shoppingCart() {
            if (this._shoppingCart == null) {
                let c = this.mobilePage.controls.filter(o => o instanceof ShoppingCartControl)[0];
                console.assert(c != null);
                this._shoppingCart = c;
            }
            return this._shoppingCart;
        }
        get persistentMembers() {
            return [];
        }
        get hasEditor() {
            return false;
        }
        deleteConfirmText(items) {
            return "";
        }
        isCheckedAll() {
            if (this.state.status == 'normal') {
                let value = true;
                let items = this.state.items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].Selected != true) {
                        value = false;
                        break;
                    }
                }
                return value;
            }
            return this.state.deleteItemsCount == this.state.items.length;
        }
        checkAll() {
            if (this.isCheckedAll()) {
                return this.shoppingCart.uncheckAll();
            }
            return this.shoppingCart.checkAll();
        }
        _render() {
            let selectedItems = this.state.items.filter(o => o.Selected);
            let deleteItemsCount = this.state.deleteItemsCount;
            let totalAmount = 0;
            let selectedCount = 0;
            selectedItems.forEach(o => {
                totalAmount = totalAmount + o.Amount * o.Count;
                selectedCount = selectedCount + o.Count;
            });
            return (h("div", { className: "settlement", style: { bottom: this.props.hideMenu ? 0 : null, paddingLeft: 0 } },
                h("div", { className: "pull-right" }, this.state.status == 'normal' ?
                    h("button", { className: "btn btn-primary", disabled: selectedCount == 0, ref: (e) => {
                            if (!e)
                                return;
                            //onClick={() => this.shoppingCart.buy()}
                            ui.buttonOnClick(e, () => this.shoppingCart.buy());
                        } }, selectedCount > 0 ? `结算（${selectedCount}）` : '结算')
                    :
                        h("button", { className: "btn btn-primary", disabled: deleteItemsCount == 0, ref: (e) => {
                                if (!e)
                                    return;
                                ui.buttonOnClick(e, o => this.shoppingCart.removeSelectedItems(), {
                                    confirm: this.shoppingCart.removeConfirmText()
                                });
                            } }, "\u5220\u9664")),
                h("div", { style: { width: '100%', paddingTop: 8 } },
                    h("button", { className: "select-all pull-left", onClick: () => this.checkAll() },
                        this.isCheckedAll() ?
                            h("i", { className: "icon-ok-sign text-primary" })
                            :
                                h("i", { className: "icon-circle-blank text-primary" }),
                        h("span", { className: "text" }, "\u5168\u9009")),
                    this.state.status == 'normal' ?
                        h("label", { className: "pull-right", style: { paddingRight: 10, paddingTop: 2 } },
                            "\u603B\u8BA1\uFF1A",
                            h("span", { className: "price" },
                                "\uFFE5",
                                totalAmount.toFixed(2)))
                        : null)));
        }
    }
    exports.Footer = Footer;
    class ShoppingCartControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.shoppingCart = this.elementPage.createService(shoppingCartService_1.ShoppingCartService);
            this.shop = this.elementPage.createService(shoppingService_1.ShoppingService);
            this.state = {
                status: 'normal',
                items: [],
                deleteItems: [], inputCounts: {}
            };
            this.loadControlCSS();
            shoppingCartService_1.ShoppingCartService.items.add(this.on_shoppingCartChanged, this);
            this.elementPage.shown.add(() => {
                this.on_shoppingCartChanged(shoppingCartService_1.ShoppingCartService.items.value, this);
                shoppingCartService_1.ShoppingCartService.items.add(this.on_shoppingCartChanged, this);
            });
            this.elementPage.hidden.add(() => {
                shoppingCartService_1.ShoppingCartService.items.remove(this.on_shoppingCartChanged);
            });
            this.on_shoppingCartChanged(shoppingCartService_1.ShoppingCartService.items.value, this);
        }
        on_shoppingCartChanged(items, sender) {
            sender.shoppingCart.calculateShoppingCartItems().then((items) => {
                sender.state.items = items;
                sender.setState(sender.state);
            });
        }
        get persistentMembers() {
            return [];
        }
        get hasEditor() {
            return false;
        }
        // private refreshItems() {
        //     shoppingCart.calculateShoppingCartItems().then((items) => {
        //         this.state.items = items;
        //         this.setState(this.state);
        //     })
        // }
        selectItem(item) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.state.status == 'edit') {
                    let itemIndex = this.state.deleteItems.indexOf(item);
                    let deleteItems = itemIndex >= 0 ?
                        this.state.deleteItems.filter((o, i) => i != itemIndex) :
                        this.state.deleteItems.concat([item]);
                    this.setDeleteItems(deleteItems);
                    return;
                }
                if (item.Selected == false)
                    yield this.shoppingCart.selectItem(item.Id);
                else
                    yield this.shoppingCart.unselectItem(item.Id);
            });
        }
        removeSelectedItems() {
            return __awaiter(this, void 0, void 0, function* () {
                let items = this.state.deleteItems;
                yield this.shoppingCart.removeItems(items.map(o => o.Id));
                this.setDeleteItems([]);
                //this.refreshItems();
            });
        }
        decreaseCount(item) {
            let itemCount = this.state.inputCounts[item.Id] || item.Count;
            if (itemCount <= 1) {
                ui.confirm({
                    message: `确定要删除'${item.Name}'吗？`,
                    confirm: () => __awaiter(this, void 0, void 0, function* () {
                        yield this.shoppingCart.removeItems([item.Id]);
                        let deleteItems = this.state.deleteItems.filter(o => o.Id != item.Id);
                        this.setDeleteItems(deleteItems);
                    })
                });
                return;
            }
            this.changeItemCount(item, `${(itemCount) - 1}`);
        }
        increaseCount(item) {
            let itemCount = (this.state.inputCounts[item.Id] || item.Count) + 1;
            this.changeItemCount(item, `${itemCount}`);
        }
        changeItemCount(item, value) {
            let count = Number.parseInt(value);
            if (!count)
                return;
            this.state.inputCounts[item.Id] = count;
            this.setState(this.state);
        }
        cancel() {
            this.state.status = 'normal';
            status.value = this.state.status;
            this.setState(this.state);
        }
        edit() {
            if (this.state.status == 'normal') {
                this.state.status = 'edit';
                status.value = this.state.status;
                this.setState(this.state);
                return Promise.resolve();
            }
            let inputCounts = this.state.inputCounts;
            let itemIds = new Array();
            let quantities = new Array();
            for (let i = 0; i < this.state.items.length; i++) {
                let item = this.state.items[i];
                if (inputCounts[item.Id] != null && inputCounts[item.Id] != item.Count) {
                    itemIds.push(item.Id);
                    quantities.push(inputCounts[item.Id]);
                }
            }
            let result;
            if (itemIds.length > 0) {
                result = this.shoppingCart.setItemsCount(itemIds, quantities);
            }
            else {
                result = Promise.resolve({});
            }
            result.then(o => {
                this.state.status = 'normal';
                status.value = this.state.status;
                this.setState(this.state);
                // this.refreshItems();
            });
            return result;
        }
        checkAll() {
            if (this.state.status == 'normal') {
                return this.shoppingCart.selectAll();
            }
            this.setDeleteItems(this.state.items);
        }
        uncheckAll() {
            if (this.state.status == 'normal') {
                return this.shoppingCart.unselectAll();
            }
            this.setDeleteItems([]);
        }
        setDeleteItems(items) {
            this.state.deleteItems = items;
            this.setState(this.state);
            deleteItemsCount.value = items.length;
        }
        buy() {
            if (this.state.selectedCount <= 0)
                return;
            var items = this.state.items.filter(o => o.Selected);
            var productIds = items.map(o => o.ProductId);
            var quantities = items.map(o => o.Count);
            let result = this.shop.createOrder(productIds, quantities)
                .then((order) => {
                site_1.app.redirect(siteMap_1.default.nodes.shopping_orderProducts, { id: order.Id }); //shopping_orderProducts
            });
            return result;
        }
        isChecked(item) {
            if (this.state.status == 'normal') {
                return item.Selected;
            }
            return this.state.deleteItems.indexOf(item) >= 0;
        }
        isCheckedAll() {
            if (this.state.status == 'normal') {
                let selectedItems = this.state.items.filter(o => o.Selected);
                return selectedItems.length == this.state.items.length;
            }
            return this.state.deleteItems.length == this.state.items.length;
        }
        removeConfirmText() {
            let items = this.state.deleteItems;
            let str = "是否要删除？<br/> " + items.map(o => '<br/>' + o.Name);
            return str;
        }
        componentDidMount() {
            // this.elementPage.active.add(() => this.refreshItems());
        }
        _render(h) {
            let inputCounts = this.state.inputCounts;
            let items = this.state.items;
            return (items.length > 0 ?
                h("div", { className: "container" },
                    h("ul", { className: "list-group" }, items.map(o => h("li", { key: o.Id, className: "list-group-item row" },
                        o.Type == null ?
                            h("button", { onClick: () => this.selectItem(o), className: "pull-left icon" },
                                h("i", { className: this.isChecked(o) ? 'icon-ok-sign' : 'icon-circle-blank' })) : null,
                        h("a", { href: `#home_product?id=${o.ProductId}`, className: "pull-left pic" }, o.Type == 'Reduce' || o.Type == 'Discount' ?
                            h("div", { className: o.Type }, o.Type == 'Reduce' ? '减' : '折')
                            :
                                h("img", { src: service_1.imageUrl(o.ImagePath), className: "img-responsive", ref: (e) => e ? ui.renderImage(e) : null })),
                        h("div", { style: { marginLeft: 100 } },
                            h("a", { href: `#home_product?id=${o.ProductId}` }, o.Name),
                            h("div", { style: { height: 42, paddingTop: 4 } },
                                h("div", { className: "price pull-left", style: { marginTop: 10 } },
                                    "\uFFE5",
                                    o.Price.toFixed(2)),
                                h("div", { className: "pull-right", style: { marginTop: 4 } }, this.state.status == 'normal' || o.Type != null ?
                                    h("div", { style: { paddingLeft: 6 } },
                                        "X ",
                                        o.Count)
                                    :
                                        h("div", { className: "input-group", style: { width: 120, display: 'table' } },
                                            h("span", { onClick: () => this.decreaseCount(o), className: "input-group-addon" },
                                                h("i", { className: "icon-minus" })),
                                            h("input", { value: `${inputCounts[o.Id] || o.Count}`, className: "form-control", type: "text", style: { textAlign: 'center' }, onChange: (e) => (this.changeItemCount(o, e.target.value)) }),
                                            h("span", { onClick: () => this.increaseCount(o), className: "input-group-addon" },
                                                h("i", { className: "icon-plus" }))))))))))
                :
                    h("div", { className: "norecords" },
                        h("div", { className: "icon" },
                            h("i", { className: "icon-shopping-cart" })),
                        h("h4", { className: "text" }, "\u4F60\u7684\u8D2D\u4E70\u8F66\u7A7A\u7A7A\u5982\u4E5F")));
        }
    }
    exports.default = ShoppingCartControl;
});
