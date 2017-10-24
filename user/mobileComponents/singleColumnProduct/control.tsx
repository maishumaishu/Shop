import { Control, componentsDir } from 'pageComponents/common';
import { imageUrl } from 'userServices/service';
import { ShoppingCartService } from 'userServices/shoppingCartService';
import { ShoppingService } from 'userServices/shoppingService';

import { app } from 'site';

// let { ImageBox } = controls;
// requirejs([`css!${componentsDir}/singleColumnProduct/control`]);
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
// let shoppingCart = new ShoppingCartService();


// type ProductExt = Product & { Count: number };

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
    products?: Product[],
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

    /**
     * 列表类型
     */
    listType?: 'singleColumn' | 'doubleColumn' | 'largePicture',

    /**
     * 价格右侧显示内容类型
     */
    displayType?: 'none' | 'addProduct' | 'activity',

    /** 
     * 显示商品标题，仅单列显示商品有效
     */
    displayTitle?: boolean,
}

export default class SingleColumnProductControl extends Control<Props, State> {
    get persistentMembers(): (keyof State)[] {
        return [
            'productSourceType', 'prodcutsCount', 'categoryId', 'productIds',
            'listType', 'displayType', 'displayTitle'
        ]
    }
    constructor(args) {
        super(args);
        this.state = { products: [], productSourceType: 'category', prodcutsCount: 1 };
        this.loadControlCSS();
        Promise.all([shopping.products(0)]).then(data => {
            let products = data[0];// as (Product & { Count: number })[];
            // let items = data[1];
            // for (let i = 0; i < products.length; i++) {
            //     let item = items.filter(o => o.ProductId == products[i].Id)[0];
            //     if (item) {
            //         products[i].Count = item.Count;
            //     }
            //     else {
            //         products[i].Count = 0;
            //     }
            // }
            this.state.products = products;
            this.setState(this.state);
        });
    }

    addProduct(product: Product & { Count: number }) {
        // let count = product.Count + 1;
        // return shoppingCart.updateItem(product.Id, count, true).then(items => {
        //     product.Count = count;
        //     this.setState(this.state);
        // });
    }

    removeProduct(product: Product & { Count: number }) {
        // let count = product.Count - 1;
        // if (count < 0) {
        //     return;
        // }
        // return shoppingCart.updateItem(product.Id, count, true).then(items => {
        //     product.Count = count;
        //     this.setState(this.state);
        // });
    }

    _render() {
        var products = new Array<Product>();
        return (
            <div
                ref={async (e: HTMLElement) => {
                    if (!e) return;
                    let listType = this.state.listType;
                    let element: React.ReactElement<any>;
                    switch (listType) {
                        case 'doubleColumn':
                        default:
                            element = await this.renderDoubleColumn();
                            break;
                        case 'singleColumn':
                            element = await this.renderSingleColumn();
                            break;
                    }
                    ReactDOM.render(element, e);

                }}>
            </div>
        );
    }

    async renderSingleColumn(): Promise<JSX.Element> {

        var products = await this.products();
        let showProductTitle = this.state.displayTitle;

        let leftClassName = showProductTitle ? 'col-xs-4' : 'col-xs-3';
        let rightClassName = showProductTitle ? 'col-xs-8' : 'col-xs-9';

        return (
            <div className="singleColumnProductControl">
                {products.filter(o => o != null).map(o =>
                    <div key={o.Id} className="product single">
                        <div className={leftClassName}>
                            <img className="image img-responsive" src={imageUrl(o.ImagePath, 100)} title="高州风味"
                                ref={(e: HTMLImageElement) => e ? ui.renderImage(e, { imageSize: { width: 100, height: 100 } }) : null} />
                        </div>
                        <div className={`content ${rightClassName}`}>
                            <div className="name interception">
                                {o.Name}
                            </div>
                            {showProductTitle ?
                                <div className="title interception">
                                    {o.Title}
                                </div> : null}
                            <div className="price">
                                <span className="pull-left">
                                    ￥{o.Price.toFixed(2)}
                                </span>
                                <div className="pull-right">
                                    <i className="icon-plus-sign" />
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

    async renderDoubleColumn(): Promise<JSX.Element> {
        var products = await this.products();
        return (
            <div className="singleColumnProductControl">
                {products.filter(o => o != null).map(o =>
                    <div key={o.Id} className="product double col-xs-6"
                        onClick={() => app.redirect(`home_product?id=${o.Id}`)}>
                        <div>
                            <img src={imageUrl(o.ImagePath, 200)} title="高州风味"
                                ref={(e: HTMLImageElement) => e ? ui.renderImage(e, { imageSize: { width: 200, height: 200 } }) : null} />
                            <div className="name">
                                {o.Name}
                            </div>
                            <div className="price">
                                <span className="pull-left">
                                    ￥{o.Price.toFixed(2)}
                                </span>
                                <div className="pull-right">
                                    <i className="icon-plus-sign" />
                                </div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                )}
            </div>
        );


    }


    async products(): Promise<Product[]> {
        var products: Product[];
        if (this.state.productSourceType == 'category')
            products = await shopping.productsByCategory(this.state.prodcutsCount, this.state.categoryId);
        else
            products = await shopping.productsByIds(this.state.productIds);

        products.forEach(o => o.ImagePath = o.ImagePaths[0]);
        return products;
    }

}