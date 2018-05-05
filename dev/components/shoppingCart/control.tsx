import { Control, ControlProps } from 'components/common';
import { imageUrl } from 'user/services/service';
import { ShoppingCartService } from 'user/services/shoppingCartService';
import { ShoppingService } from 'user/services/shoppingService';
import { StationService } from 'user/services/stationService';
import { userData } from 'user/services/userData';
import { app, defaultNavBar } from 'user/site';
import siteMap from 'user/siteMap';

type ControlStatus = 'normal' | 'edit'
let status = new chitu.ValueStore<ControlStatus>('normal');
let deleteItemsCount = new chitu.ValueStore<number>(0);

export class Header extends Control<any, { status: ControlStatus }> {
    private _shoppingCart: ShoppingCartControl;

    constructor(props) {
        super(props);
        this.state = { status: status.value };
        this.subscribe(status, (value) => {
            this.state.status = value;
            this.setState(this.state);
        })
    }

    get persistentMembers() {
        return [];
    }
    componentDidMount() {
    }
    private edit() {
        this.shoppingCart.edit();
    }
    get shoppingCart(): ShoppingCartControl {
        if (this._shoppingCart == null) {
            let c = this.mobilePage.controls.filter(o => o instanceof ShoppingCartControl)[0];
            console.assert(c != null);
            this._shoppingCart = c as any as ShoppingCartControl;
        }

        return this._shoppingCart;
    }
    private cancle() {
        this.shoppingCart.cancel();
    }
    get hasEditor() {
        return false;
    }
    _render() {
        let { status } = this.state;
        let showBackButton = this.elementPage.name == 'shopping.shoppingCartNoMenu';
        return defaultNavBar(this.elementPage, {
            title: '购物车',
            right:
                <button className="right-button" style={{ width: 'unset' }}
                    onClick={async () => {
                        await this.edit();
                        this.state.status = this.shoppingCart.state.status;
                        this.setState(this.state);
                    }}>
                    {status == 'normal' ? '编辑' : '完成'}
                </button>,
            showBackButton

        });
    }
}

interface FooterStatus {
    items?: ShoppingCartItem[],
    status?: ControlStatus,
    deleteItemsCount?: number
}
export class Footer extends Control<any, FooterStatus>{

    private _shoppingCart: ShoppingCartControl;

    constructor(props) {
        super(props);
        this.state = { items: ShoppingCartService.items.value, status: status.value };
        this.subscribe(status, (value) => {
            this.state.status = value;
            this.setState(this.state);
        })
        this.subscribe(ShoppingCartService.items, (value) => {
            this.state.items = value;
            this.setState(this.state);
        })
        this.subscribe(deleteItemsCount, (value) => {
            this.state.deleteItemsCount = deleteItemsCount.value;
            this.setState(this.state);
        })
    }

    get shoppingCart(): ShoppingCartControl {
        if (this._shoppingCart == null) {
            let c = this.mobilePage.controls.filter(o => o instanceof ShoppingCartControl)[0];
            console.assert(c != null);
            this._shoppingCart = c as any as ShoppingCartControl;
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

        return (
            <div className="settlement" style={{ bottom: this.props.hideMenu ? 0 : null, paddingLeft: 0 }}>
                <div className="pull-right">
                    {this.state.status == 'normal' ?
                        <button className="btn btn-primary" disabled={selectedCount == 0}
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                //onClick={() => this.shoppingCart.buy()}
                                ui.buttonOnClick(e, () => this.shoppingCart.buy());
                            }}>
                            {selectedCount > 0 ? `结算（${selectedCount}）` : '结算'}
                        </button>
                        :
                        <button className="btn btn-primary" disabled={deleteItemsCount == 0}
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                ui.buttonOnClick(e, o => this.shoppingCart.removeSelectedItems(), {
                                    confirm: this.shoppingCart.removeConfirmText()
                                });
                            }}>
                            删除
                </button>
                    }
                </div>
                <div style={{ width: '100%', paddingTop: 8 }}>
                    <button className="select-all pull-left" onClick={() => this.checkAll()}>
                        {this.isCheckedAll() ?
                            <i className="icon-ok-sign text-primary"></i>
                            :
                            <i className="icon-circle-blank text-primary"></i>
                        }
                        <span className="text">全选</span>
                    </button>
                    {this.state.status == 'normal' ?
                        <label className="pull-right" style={{ paddingRight: 10, paddingTop: 2 }}>
                            总计：<span className="price">￥{totalAmount.toFixed(2)}</span>
                        </label>
                        : null
                    }
                </div>

            </div>
        )
    }
}

export interface ShoppingCartState {
    items?: ShoppingCartItem[], status?: ControlStatus,
    totalAmount?: number, selectedCount?: number,
    deleteItems: Array<ShoppingCartItem>,
    inputCounts: { [key: string]: number }

}

export interface ShoppingCartlProps extends ControlProps<ShoppingCartControl> {
    hideMenu: boolean, pageName: string,
}
export default class ShoppingCartControl extends Control<
    ShoppingCartlProps,
    ShoppingCartState>{

    private shoppingCart: ShoppingCartService;
    private shop: ShoppingService;

    constructor(props) {
        super(props);

        this.shoppingCart = this.elementPage.createService(ShoppingCartService);
        this.shop = this.elementPage.createService(ShoppingService);

        this.state = {
            status: 'normal',
            items: [],
            deleteItems: [], inputCounts: {}
        };

        this.loadControlCSS();


        ShoppingCartService.items.add(this.on_shoppingCartChanged, this);
        this.elementPage.shown.add(() => {
            this.on_shoppingCartChanged(ShoppingCartService.items.value, this);
            ShoppingCartService.items.add(this.on_shoppingCartChanged, this);
        })
        this.elementPage.hidden.add(() => {
            ShoppingCartService.items.remove(this.on_shoppingCartChanged);
        })
        this.on_shoppingCartChanged(ShoppingCartService.items.value, this);
    }

    private on_shoppingCartChanged(items: ShoppingCartItem[], sender?: ShoppingCartControl) {
        sender.shoppingCart.calculateShoppingCartItems().then((items) => {
            sender.state.items = items;
            sender.setState(sender.state);
        })
    }

    get persistentMembers() {
        return [];
    }

    // private refreshItems() {
    //     shoppingCart.calculateShoppingCartItems().then((items) => {
    //         this.state.items = items;
    //         this.setState(this.state);
    //     })
    // }

    private async selectItem(item: ShoppingCartItem) {
        if (this.state.status == 'edit') {
            let itemIndex = this.state.deleteItems.indexOf(item);

            let deleteItems = itemIndex >= 0 ?
                this.state.deleteItems.filter((o, i) => i != itemIndex) :
                this.state.deleteItems.concat([item]);

            this.setDeleteItems(deleteItems);
            return;
        }

        if (item.Selected == false)
            await this.shoppingCart.selectItem(item.Id);
        else
            await this.shoppingCart.unselectItem(item.Id);

    }
    async removeSelectedItems() {
        let items: ShoppingCartItem[] = this.state.deleteItems;
        await this.shoppingCart.removeItems(items.map(o => o.Id));
        this.setDeleteItems([]);
        //this.refreshItems();
    }
    private decreaseCount(item: ShoppingCartItem) {
        let itemCount = this.state.inputCounts[item.Id] || item.Count;
        if (itemCount <= 1) {
            ui.confirm({
                message: `确定要删除'${item.Name}'吗？`,
                confirm: async () => {
                    await this.shoppingCart.removeItems([item.Id]);
                    let deleteItems = this.state.deleteItems.filter(o => o.Id != item.Id);
                    this.setDeleteItems(deleteItems);
                }
            })
            return;
        }
        this.changeItemCount(item, `${(itemCount) - 1}`);
    }
    private increaseCount(item: ShoppingCartItem) {
        let itemCount = (this.state.inputCounts[item.Id] || item.Count) + 1;
        this.changeItemCount(item, `${itemCount}`);
    }
    private changeItemCount(item: ShoppingCartItem, value: string) {
        let count = Number.parseInt(value);
        if (!count) return;

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
        let itemIds = new Array<string>();
        let quantities = new Array<number>();
        for (let i = 0; i < this.state.items.length; i++) {
            let item = this.state.items[i];
            if (inputCounts[item.Id] != null && inputCounts[item.Id] != item.Count) {
                itemIds.push(item.Id);
                quantities.push(inputCounts[item.Id]);
            }
        }


        let result: Promise<any>;
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

    private setDeleteItems(items: ShoppingCartItem[]) {
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
                app.redirect(siteMap.nodes.shopping_orderProducts, { id: order.Id });//shopping_orderProducts
            })

        return result;
    }

    private isChecked(item: ShoppingCartItem) {
        if (this.state.status == 'normal') {
            return item.Selected;
        }
        return this.state.deleteItems.indexOf(item) >= 0;
    }

    private isCheckedAll() {
        if (this.state.status == 'normal') {
            let selectedItems = this.state.items.filter(o => o.Selected);
            return selectedItems.length == this.state.items.length;
        }

        return this.state.deleteItems.length == this.state.items.length;
    }

    removeConfirmText() {
        let items: ShoppingCartItem[] = this.state.deleteItems;
        let str = "是否要删除？<br/> " + items.map(o => '<br/>' + o.Name);
        return str;
    }

    componentDidMount() {
        // this.elementPage.active.add(() => this.refreshItems());
    }

    _render(h) {
        let inputCounts = this.state.inputCounts;
        let items = this.state.items;
        return (
            items.length > 0 ?
                <div className="container">
                    <ul className="list-group">
                        {items.map(o =>
                            <li key={o.Id} className="list-group-item row">
                                {o.Type == null ?
                                    <button onClick={() => this.selectItem(o)} className="pull-left icon">
                                        <i className={this.isChecked(o) ? 'icon-ok-sign' : 'icon-circle-blank'}></i>
                                    </button> : null}
                                <a href={`#home_product?id=${o.ProductId}`} className="pull-left pic">
                                    {o.Type == 'Reduce' || o.Type == 'Discount' ?
                                        <div className={o.Type}>
                                            {o.Type == 'Reduce' ? '减' : '折'}
                                        </div>
                                        :
                                        <img src={imageUrl(o.ImagePath)} className="img-responsive"
                                            ref={(e: any) => e ? ui.renderImage(e) : null} />}
                                </a>
                                <div style={{ marginLeft: 100 }}>
                                    <a href={`#home_product?id=${o.ProductId}`} >{o.Name}</a>
                                    <div style={{ height: 42, paddingTop: 4 }}>
                                        <div className="price pull-left" style={{ marginTop: 10 }}>￥{o.Price.toFixed(2)}</div>
                                        <div className="pull-right" style={{ marginTop: 4 }}>
                                            {this.state.status == 'normal' || o.Type != null ?
                                                <div style={{ paddingLeft: 6 }}>X {o.Count}</div>
                                                :
                                                <div className="input-group" style={{ width: 120, display: 'table' }}>
                                                    <span onClick={() => this.decreaseCount(o)} className="input-group-addon">
                                                        <i className="icon-minus"></i>
                                                    </span>
                                                    <input value={`${inputCounts[o.Id] || o.Count}`} className="form-control" type="text" style={{ textAlign: 'center' }}
                                                        onChange={(e) => (this.changeItemCount(o, (e.target as HTMLInputElement).value))} />
                                                    <span onClick={() => this.increaseCount(o)} className="input-group-addon">
                                                        <i className="icon-plus"></i>
                                                    </span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                :
                <div className="norecords">
                    <div className="icon">
                        <i className="icon-shopping-cart">

                        </i>
                    </div>
                    <h4 className="text">你的购买车空空如也</h4>
                </div>
        )
    }
}