import { Component, componentsDir } from 'mobileComponents/common';
import { ShoppingCartService, ShoppingService, Product } from 'userServices';
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


type ProductExt = Product & { Count: number };

export interface Props {

}

type ProductsFromCategory = {
    prodcutsCount: number,
    categoryId: string,
    moduleTitle: string,
}

type ProductsByCustom = {
    productIds: string[]
    moduleTitle: string,
}

export interface State {
    products?: (Product & { Count: number })[],
    // productsType?: ProductsFromCategory | ProductsByCustom,

    //=======================================
    productSourceType: 'category' | 'custom',
    //=======================================
    // 按类别
    prodcutsCount?: number,
    categoryId?: string,
    //=======================================
    // 自定义
    productIds?: string[],
    //=======================================

    moduleTitle?: string,

}

export default class SingleColumnProductControl extends Component<Props, State> {
    get persistentMembers(): (keyof State)[] {
        return ['productSourceType', 'prodcutsCount', 'categoryId', 'productIds', 'moduleTitle']
    }
    constructor(args) {
        super(args);
        this.state = { products: [], productSourceType: 'category', prodcutsCount: 1 };
        Promise.all([shopping.products(0), shoppingCart.items()]).then(data => {
            let products = data[0] as (Product & { Count: number })[];
            let items = data[1];
            for (let i = 0; i < products.length; i++) {
                let item = items.filter(o => o.ProductId == products[i].Id)[0];
                if (item) {
                    products[i].Count = item.Count;
                }
                else {
                    products[i].Count = 0;
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

    _render(h) {

        var products = new Array<ProductExt>();
        return (
            <div
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    this.asyncRender().then(element => {
                        ReactDOM.render(element, e);
                    });
                }}>
            </div>
        );
    }

    async asyncRender(): Promise<JSX.Element> {

        var products: ProductExt[];
        // if (this.state.categoryId)
        if (this.state.productSourceType == 'category')
            products = await shopping.productsByCategory(this.state.prodcutsCount, this.state.categoryId) as ProductExt[];
        else
            products = await shopping.productsByIds(this.state.productIds) as ProductExt[];

        return (
            <div className="singleColumnProductControl">
                {products.filter(o => o != null).map(o =>
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