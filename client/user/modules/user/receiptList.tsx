import { defaultNavBar, app } from 'user/site';
import { ShoppingService } from 'user/services/shoppingService';
import { ReceiptEditPageArguments } from 'user/modules/user/receiptEdit';
export type SetAddress = (address: string, order: Order) => void;
export interface ReceiptListRouteValues {
    callback: SetAddress,
    orderId: string
}

import siteMap from 'user/siteMap';

export default function (page: chitu.Page) {

    let shop = page.createService(ShoppingService);
    let routeValue = (page.data || {}) as ReceiptListRouteValues;
    class ReceiptListPage extends React.Component<{ items: ReceiptInfo[] }, { items?: ReceiptInfo[] }>{
        constructor(props) {
            super(props);
            this.state = { items: this.props.items || [] };
        }

        private detail(item: ReceiptInfo) {
            var result = `${item.ProvinceName} ${item.CityName} ${item.CountyName} ${item.Address}`;

            result = result + ` 联系人: ${item.Consignee}`;
            if (item.Phone != null || item.Mobile != null)
                result = result + ` 电话：${item.Phone || ''} ${item.Mobile || ''}`;

            return result;
        }
        private newReceipt() {
            let routeValues = {
                onSaved: (receipt: ReceiptInfo) => {
                    if (receipt.IsDefault) {
                        this.state.items.forEach(o => o.IsDefault = false);
                    }
                    this.state.items.unshift(receipt);
                    this.setState(this.state);
                    app.back();
                }
            } as ReceiptEditPageArguments;
            app.redirect(siteMap.nodes.user_receiptEdit, true, routeValues);//'user_receiptEdit',

        }
        private editReceipt(receipt: ReceiptInfo) {
            let routeValues = {
                id: receipt.Id,
                receipt,
                onSaved: (receipt: ReceiptInfo) => {
                    var index = this.state.items.findIndex((o) => o.Id == receipt.Id);
                    this.state.items[index] = receipt;
                    if (receipt.IsDefault) {
                        this.state.items
                            .filter((o, i) => i != index)
                            .forEach(o => o.IsDefault = false);
                    }

                    this.setState(this.state);
                    app.back();
                }
            } as ReceiptEditPageArguments;
            app.redirect(siteMap.nodes.user_receiptEdit, routeValues);
        }
        async setDefaultReceipt(receipt: ReceiptInfo) {
            await shop.setDefaultReceiptInfo(receipt.Id);
            let index = this.state.items.indexOf(receipt);
            receipt.IsDefault = true;
            this.state.items
                .filter((o, i) => i != index)
                .forEach(o => o.IsDefault = false);

            this.setState(this.state);
        }
        private deleteReceipt(receipt: ReceiptInfo) {
            return shop.deleteReceiptInfo(receipt.Id).then(() => {
                this.state.items = this.state.items.filter(o => o != receipt);
                this.setState(this.state);
            });
        }
        private setAddress(receipt: ReceiptInfo) {
            shop.changeReceipt(routeValue.orderId, receipt.Id)
                .then((order) => {
                    routeValue.callback(this.detail(receipt), order);
                    app.back();
                });
        }
        render() {
            let items: ReceiptInfo[] = [];
            this.state.items.filter(o => o.IsDefault).forEach((o) => items.push(o));
            this.state.items.filter(o => !o.IsDefault).forEach((o) => items.push(o));
            return [
                <header key="h">
                    {defaultNavBar(page, { title: routeValue.callback ? '选择收货地址' : '收货地址' })}
                </header>,
                <section key="v">
                    {items.map(receipt => (
                        <div key={receipt.Id} style={{ marginBottom: 14 }}>
                            <div className="container">
                                <h5 data-bind="text:Name">{receipt.Name}</h5>
                                {routeValue.callback ?
                                    <div onClick={() => this.setAddress(receipt)} className="small">{this.detail(receipt)}</div>
                                    :
                                    <div className="small">{this.detail(receipt)}</div>
                                }
                            </div>
                            <div style={{ marginTop: 6 }}>
                                <hr style={{ marginBottom: 8 }} />
                                <div className="container">
                                    <div className="pull-left">
                                        <a href="javascript:"
                                            onClick={() => this.setDefaultReceipt(receipt)}>
                                            {(receipt.IsDefault ?
                                                <i className="icon-ok-sign" style={{ fontSize: 20 }}></i> :
                                                <i className="icon-circle-blank" style={{ fontSize: 20 }}></i>)}
                                            <span style={{ marginLeft: 8 }}>默认地址</span>
                                        </a>
                                    </div>
                                    <div className="pull-right">
                                        <a href="javascript:"
                                            onClick={() => this.editReceipt(receipt)}>
                                            <span className="icon-pencil" style={{ fontSize: 20 }}></span>
                                            <span style={{ marginLeft: 4 }}>编辑</span>
                                        </a>
                                        <button
                                            ref={(e: HTMLButtonElement) => {
                                                if (!e) return;
                                                e.onclick = ui.buttonOnClick(() => this.deleteReceipt(receipt),
                                                    { confirm: '你删除该收货地址吗？' })
                                            }}
                                            style={{ marginLeft: 12, border: 'none', background: 'none' }}>
                                            <span className="icon-remove" style={{ fontSize: 20 }}></span>
                                            <span style={{ marginLeft: 4 }}>删除</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                                <hr style={{ marginTop: 8, borderTopWidth: 12 }} />
                            </div>

                        </div>
                    ))}
                    {items.length == 0 ?
                        <div className="norecords">
                            <div className="icon">
                                <i className="icon-inbox" />
                            </div>
                            <h4 className="text">暂无收货地址</h4>
                        </div> : null}

                </section>,
                <footer key="f">
                    <div className="form-group">
                        <button onClick={() => this.newReceipt()} className="btn btn-primary btn-block">
                            添加新的收货地址
                        </button>
                    </div>
                </footer>
            ]
        }
    }

    shop.receiptInfos().then(items => {
        ReactDOM.render(<ReceiptListPage items={items} />, page.element);
    })

}