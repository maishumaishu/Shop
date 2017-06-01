import { Control, ControlArguments, componentsDir } from 'mobile/common';
import { Product, ShoppingService, ShoppingCartService } from 'userServices';
import * as ui from 'ui';

let { ImageBox } = controls;
requirejs([`css!${componentsDir}/singleColumnProduct/control`]);
export class Data {
    private _product: Product;

    get product() {
        return this._product;
    }
    set product(value: Product) {
        this._product = value;
    }
}

let shopping = new ShoppingService();
let shoppingCart = new ShoppingCartService();
export default class MyControl extends React.Component<{}, { products: (Product & { Count: number })[] }> {
    constructor(args: ControlArguments<Data>) {
        super(args);
        this.state = { products: [] };
        Promise.all([shopping.products(0), shoppingCart.items()]).then(data => {
            let products = data[0] as (Product & { Count: number })[];
            let items = data[1];
            for (let i = 0; i < products.length; i++) {
                let item = items.filter(o => o.ProductId == products[i].Id)[0];
                if (item) {
                    products[i].Count = item.Count;
                }
            }
            this.state.products = products;
            this.setState(this.state);
        });
    }

    addProduct(product: Product & { Count: number }) {
        let count = product.Count + 1;
        return shoppingCart.updateItem(product.Id, count, true).then(items => {
            product.Count = count;
            this.setState(this.state);
        });
    }

    removeProduct(product: Product & { Count: number }) {
        let count = product.Count - 1;
        if (count < 0) {
            return;
        }
        return shoppingCart.updateItem(product.Id, count, true).then(items => {
            product.Count = count;
            this.setState(this.state);
        });
    }

    render() {
        return (
            <div className="singleColumnProduct">
                {this.state.products.map(o =>
                    <div key={o.Id} className="product">
                        <ImageBox className="image" src={o.ImageUrl} text="高州风味" />
                        <div className="content">
                            <div className="title">
                                {o.Name}
                            </div>
                            <div>
                                <div className="price">
                                    ￥{o.Price.toFixed(2)}
                                </div>
                            </div>
                            <div>
                                <div className="input-group buttonBar">
                                    <span className="input-group-addon"
                                        ref={(e: HTMLElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => this.removeProduct(o));
                                        }}>
                                        <i className="icon-minus"></i>
                                    </span>
                                    <input type="text" className="form-control" style={{ textAlign: 'center' }}
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = (o.Count == null ? 0 : o.Count) as any;
                                        }} />
                                    <span className="input-group-addon" style={{ cursor: 'pointer' }}
                                        ref={(e: HTMLElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => this.addProduct(o));
                                        }}>
                                        <i className="icon-plus"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <hr />
                    </div>
                )}
            </div>

        );
    }
}