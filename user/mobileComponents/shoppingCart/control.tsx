import { Control, ControlProps } from 'mobileComponents/common';

import { ShoppingCartService } from 'userServices/shoppingCartService';
import { ShoppingService } from 'userServices/shoppingService';
import { StationService } from 'userServices/stationService';
import { userData } from 'userServices/userData';
import { app, defaultNavBar } from 'user/site';


export class Header extends Control<any, { status: string }> {
    private shoppingCart: ShoppingCartControl;

    constructor(props) {
        super(props);
        this.state = { status: 'normal' };
    }

    get persistentMembers() {
        return [];
    }
    componentDidMount() {
    }
    private edit() {
        if (this.shoppingCart == null) {
            let c = this.mobilePage.controls.filter(o => o instanceof ShoppingCartControl)[0];
            console.assert(c != null);
            this.shoppingCart = c as any as ShoppingCartControl;
        }
        this.shoppingCart.edit();
    }
    _render() {
        let { status } = this.state;
        return defaultNavBar({
            title: '购物车',
            showBackButton: false,
            right:
            <button className="right-button" style={{ width: 'unset' }}
                onClick={async () => {
                    await this.edit();
                    this.state.status = this.shoppingCart.state.status;
                    this.setState(this.state);
                }}>
                {status == 'normal' ? '编辑' : '完成'}
            </button>

        })
    }
}

//onClick={this.onEditClick.bind(this)} 

export class Footer extends Control<any, { items?: ShoppingCartItem[], status?: string }>{

    private shoppingCart: ShoppingCartControl;

    constructor(props) {
        super(props);
        this.state = { items: ShoppingCartService.items.value, status: 'normal' };
        this.subscribe(ShoppingCartService.items, (value) => {
            this.state.items = value;
            this.setState(this.state);
        })
    }

    get persistentMembers() {
        return [];
    }
    buy() {

    }
    deleteSelectedItems() {
        return Promise.resolve();
    }
    deleteConfirmText(items) {
        return "";
    }
    isCheckedAll() {
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
    checkAll() {
        if (this.isCheckedAll()) {
            return shoppingCart.unselectAll();
        }
        return shoppingCart.selectAll();
    }
    _render() {

        let shoppingCart = this.shoppingCart;
        let selectedCount = 0;
        let deleteItems = [];
        let totalAmount = 0;
        return (<div className="settlement" style={{ bottom: this.props.hideMenu ? 0 : null, paddingLeft: 0 }}>
            <div className="pull-right">
                {this.state.status == 'normal' ?
                    <button className="btn btn-primary" onClick={() => this.buy()} disabled={selectedCount == 0}>
                        {selectedCount > 0 ? `结算（${selectedCount}）` : '结算'}
                    </button>
                    :
                    <button className="btn btn-primary" disabled={deleteItems.length == 0}
                        ref={(e: HTMLButtonElement) => {
                            if (!e) return;
                            e.onclick = ui.buttonOnClick(o => this.deleteSelectedItems(), {
                                confirm: this.deleteConfirmText(deleteItems)
                            });
                        }}
                    >
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

        </div>)
    }
}

// type MyShoppingCartItem = ShoppingCartItem & { InputCount: number };
export interface ShoppingCartState {
    items?: ShoppingCartItem[], status?: 'normal' | 'edit',
    totalAmount?: number, selectedCount?: number,
    deleteItems: Array<ShoppingCartItem>,
    inputCounts: { [key: string]: number }

}

let shoppingCart = new ShoppingCartService(); //page.createService(ShoppingCartService);
let shop = new ShoppingService();  //page.createService(ShoppingService);
let station = new StationService(); //page.createService(StationService);

export interface ShoppingCartlProps extends ControlProps<ShoppingCartControl> {
    hideMenu: boolean, pageName: string,
}
export default class ShoppingCartControl extends Control<
    ShoppingCartlProps,
    ShoppingCartState>{

    // private dialog: controls.Dialog;

    constructor(props) {
        super(props);
        // this.setStateByItems(ShoppingCartService.items.value || []);
        // ShoppingCartService.items.add(items => {
        //     this.setStateByItems(items);
        // })
        this.state = {
            status: 'normal',
            items: ShoppingCartService.items.value,
            deleteItems: [], inputCounts: {}
        };//.map(o => Object.assign(o, { InputCount: 0 }));
        this.subscribe(ShoppingCartService.items, (items) => {
            this.state.items = items;
            this.setState(this.state);
        })
        this.loadControlCSS();
    }

    get persistentMembers() {
        return [];
    }

    private async selectItem(item: ShoppingCartItem) {
        if (this.state.status == 'edit') {
            let itemIndex = this.state.deleteItems.indexOf(item);
            if (itemIndex >= 0)
                this.state.deleteItems = this.state.deleteItems.filter((o, i) => i != itemIndex);
            else
                this.state.deleteItems.push(item);

            this.setState(this.state);
            return;
        }

        if (item.Selected == false)
            await shoppingCart.selectItem(item.Id);
        else
            await shoppingCart.unselectItem(item.Id);

        //shoppingCart.updateItem(item.ProductId, item.Count, !item.Selected);
        // showDialog(this.dialog, p);
        // return p;
    }
    private deleteSelectedItems() {
        let items: ShoppingCartItem[] = this.state.deleteItems;
        return shoppingCart.removeItems(items.map(o => o.ProductId));
        // .then(items => {
        //     this.setStateByItems(items);
        //     this.state.deleteItems = [];
        //     this.setState(this.state);
        // });
    }
    private decreaseCount(item: ShoppingCartItem) {
        let itemCount = this.state.inputCounts[item.Id] || item.Count;
        if (itemCount <= 1) {
            return;
        }
        // item.Count = item.Count - 1;
        // this.setState(this.state);
        this.changeItemCount(item, `${(itemCount) - 1}`);
    }
    private increaseCount(item: ShoppingCartItem) {
        let itemCount = (this.state.inputCounts[item.Id] || item.Count) + 1;
        // this.setState(this.state);
        this.changeItemCount(item, `${itemCount}`);
    }
    private changeItemCount(item: ShoppingCartItem, value: string) {
        let count = Number.parseInt(value);
        if (!count) return;

        this.state.inputCounts[item.Id] = count;
        this.setState(this.state);
    }

    edit() {
        if (this.state.status == 'normal') {
            this.state.status = 'edit';
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
            result = shoppingCart.setItemsCount(itemIds, quantities); //shoppingCart.updateItems(productIds, quantities);
            // showDialog(this.dialog, result);
        }
        else {
            result = Promise.resolve({});
        }

        result.then(o => {
            this.state.status = 'normal';
            this.setState(this.state);
        });

        return result;
    }
    private checkAll() {
        if (this.state.status == 'normal') {
            let p: Promise<any>;
            if (this.isCheckedAll()) {
                p = shoppingCart.unselectAll();
            }
            else {
                p = shoppingCart.selectAll();
            }

            // p.then((items) => {
            //     this.setStateByItems(items);
            // })

            // showDialog(this.dialog, p);
            return p;
        }

        if (this.isCheckedAll()) {
            this.state.deleteItems = [];
        }
        else {
            this.state.deleteItems = this.state.items;
        }
        this.setState(this.state);

    }
    private buy() {
        if (this.state.selectedCount <= 0)
            return;


        var items = this.state.items.filter(o => o.Selected);
        var productIds = items.map(o => o.ProductId);
        var quantities = items.map(o => o.Count);

        let result = shop.createOrder(productIds, quantities)
            .then((order) => {
                app.redirect(`shopping_orderProducts?id=${order.Id}`)
            })

        return result;
    }
    // private setStateByItems(items: ShoppingCartItem[]) {

    //     let state: ShoppingCartState = this.state || { status: 'normal', deleteItems: [] };// as ShoppingCartState;

    //     let selectItems = items.filter(o => o.Selected);

    //     state.selectedCount = 0;
    //     selectItems.filter(o => !o.IsGiven).forEach(o => state.selectedCount = state.selectedCount + o.Count);
    //     state.items = items.map(o => {
    //         let i = o as MyShoppingCartItem;
    //         i.InputCount = i.Count;
    //         return i;
    //     });

    //     state.totalAmount = 0;
    //     selectItems.forEach(o => {
    //         state.totalAmount = state.totalAmount + o.Amount;
    //     })

    //     if (this.state == null)
    //         this.state = state;
    //     else
    //         this.setState(state);
    // }
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
    private deleteConfirmText(items: ShoppingCartItem[]) {
        let str = "是否要删除？<br/> " + items.map(o => '<br/>' + o.Name);
        return str;
    }

    _render() {
        let inputCounts = this.state.inputCounts;
        return (
            this.state.items.length > 0 ?
                <div className="container">
                    <ul className="list-group">
                        {this.state.items.map(o =>
                            <li key={o.Id} className="list-group-item row">
                                {!o.IsGiven ?
                                    <button onClick={() => this.selectItem(o)} className="pull-left icon">
                                        <i className={this.isChecked(o) ? 'icon-ok-sign' : 'icon-circle-blank'}></i>
                                    </button> : null}
                                <a href={`#home_product?id=${o.ProductId}`} className="pull-left pic">
                                    {o.Type == 'Reduce' || o.Type == 'Discount' ?
                                        <div className={o.Type}>
                                            {o.Type == 'Reduce' ? '减' : '折'}
                                        </div>
                                        :
                                        <img src={o.ImagePath} className="img-responsive"
                                            ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />}

                                </a>
                                <div style={{ marginLeft: 110 }}>
                                    <a href={`#home_product?id=${o.ProductId}`} >{o.Name}</a>
                                    <div style={{ height: 42, paddingTop: 4 }}>
                                        <div className="price pull-left" style={{ marginTop: 10 }}>￥{o.Price.toFixed(2)}</div>
                                        <div className="pull-right" style={{ marginTop: 4 }}>
                                            {this.state.status == 'normal' || o.IsGiven ?
                                                <div style={{ paddingLeft: 6 }}>X {o.Count}</div>
                                                :
                                                <div className="input-group" style={{ width: 120, display: o.IsGiven ? 'none' : 'table' }}>
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