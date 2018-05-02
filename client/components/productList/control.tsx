import { Control, ControlProps } from 'components/common';
import { imageUrl } from 'user/services/service';
import { ShoppingCartService } from 'user/services/shoppingCartService';
import { ShoppingService } from 'user/services/shoppingService';
import { ProductImage } from 'user/controls/productImage';
import { app } from 'user/site';
import siteMap from 'user/siteMap';
import product from 'user/modules/home/product';
import template = require('art-template');

requirejs(['css!user/controls/productImage']);

export class Data {
    private _product: Product;

    get product() {
        return this._product;
    }
    set product(value: Product) {
        this._product = value;
    }
}

export interface Props extends ControlProps<ProductListControl> {
    // createService<T extends chitu.Service>(type: chitu.ServiceConstructor<T>): T;
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
    // products?: Product[],
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
    listType: 'singleColumn' | 'doubleColumn' | 'largePicture',

    /**
     * 价格右侧显示内容类型
     */
    displayType?: 'none' | 'addProduct' | 'activity',

    // shoppingCartItems: ShoppingCartItem[],
    imageSize: 'small' | 'medium' | 'large',

    productCounts?: { [key: string]: number },

    /**
     * 商品名称行数
     */
    productNameLines: 'singleLine' | 'doubleColumn',

    /**
     * 是否显示规格型号
     * independent 独立显示商品规格
     * append 将商品规格追加到名称后
     */
    showFields: 'independent' | 'append',

    /**
     * 商品模板
     */
    productTemplate?: string,
}

export default class ProductListControl extends Control<Props, State> {
    shoppingCart: ShoppingCartService;
    shopping: ShoppingService;
    get persistentMembers(): (keyof State)[] {
        return [
            'productSourceType', 'prodcutsCount', 'categoryId', 'productIds',
            'listType', 'displayType', 'imageSize', 'productNameLines',
            'showFields', 'productTemplate'
        ]
    }
    constructor(args) {
        super(args);
        let productCounts: { [key: string]: number } = {};
        for (let i = 0; i < ShoppingCartService.items.value.length; i++) {
            let item = ShoppingCartService.items.value[i];
            productCounts[item.ProductId] = item.Count;
        }

        this.state = {
            prodcutsCount: 1, productCounts,
            productSourceType: 'category', productNameLines: 'singleLine',
            showFields: 'independent', imageSize: 'small',
            listType: 'doubleColumn'
        };


        this.subscribe(ShoppingCartService.items, (shoppingCartItems) => {
            for (let i = 0; i < shoppingCartItems.length; i++) {
                this.state.productCounts[shoppingCartItems[i].ProductId] = shoppingCartItems[i].Count;
            }
            this.setState(this.state);
        })

        let props = this.props;
        this.shopping = this.props.mobilePage.props.elementPage.createService(ShoppingService);
        this.shoppingCart = this.props.mobilePage.props.elementPage.createService(ShoppingCartService);

        this.loadControlCSS();
        this.stateChanged.add(() => {

        })
    }

    _render(h) {

        let productTemplate = this.state.productTemplate || this.productTemplate();

        return (
            <div className="product-list-control" ref={async (e: HTMLElement) => {
                if (!e) return;
                var products = await this.products();

                if (products.length == 0) {
                    ReactDOM.render(
                        <div className="text-center" style={{ height: 200, padding: 100 }}>
                            暂无可显示的商品
                        </div>, e);
                    return;
                }

                let html = "";
                products.map(o => {
                    let product = o;
                    let name = this.productDisplayName(product);
                    let price = `￥${product.Price.toFixed(2)}`;
                    let image = imageUrl(product.ImagePath, 200, 200);
                    let stock = product.Stock;
                    let offShelve = product.OffShelve;
                    let id = product.Id;
                    let data = { name, price, image, stock, offShelve, id };
                    html = html + template.render(productTemplate, data);
                })

                setTimeout(() => {
                    e.innerHTML = html;
                    let q = e.querySelectorAll('[product-id]');
                    for (let i = 0; i < q.length; i++) {
                        let o = q.item(i) as HTMLElement;
                        this.elementOnClick(o, () => {
                            let productId = o.getAttribute('product-id');
                            if (!productId) {
                                ui.alert({ title: '错误', message: 'Product id is emtpy.' });
                            }
                            app.redirect(siteMap.nodes.home_product, { id: productId });
                        })
                    }
                }, 100);

            }}>
            </div>
        );
    }


    productTemplate(): string {
        let { listType } = this.state;
        let productTemplate: string;
        switch (listType) {
            case 'doubleColumn':
            default:
                productTemplate = this.doubleColumnTemplate();
                break;
            case 'singleColumn':
                productTemplate = this.singleColumnTemplate();
                break;
        }
        return productTemplate;
    }

    private doubleColumnTemplate(): string {
        let imageTemplate = this.createProductImageTemplate();
        let infoTemplate = this.createProductInfoTemplate();
        let tmp = `
<div class="product double col-xs-6">
    <div class="btn-link" product-id="{{id}}">
    ${imageTemplate}
    </div>
    ${infoTemplate}
</div>`;

        return tmp;
    }

    private singleColumnTemplate(): string {
        let { imageSize } = this.state;
        let leftClassName: string, rightClassName: string;// = displayTitle ? 'col-xs-4' : 'col-xs-3';
        // let rightClassName = displayTitle ? 'col-xs-8' : 'col-xs-9';
        switch (imageSize) {
            case 'small':
            default:
                leftClassName = 'col-xs-3';
                rightClassName = 'col-xs-9';
                break;
            case 'medium':
                leftClassName = 'col-xs-4';
                rightClassName = 'col-xs-8';
                break;
            case 'large':
                leftClassName = 'col-xs-5';
                rightClassName = 'col-xs-7';
                break;
        }

        let imageTemplate = this.createProductImageTemplate();
        let infoTemplate = this.createProductInfoTemplate();
        // let leftHTMLE = template.render(imageTemplate,ar)
        let template = `
        <div class="product single">
            <div class="${leftClassName} btn-link" product-id="{{id}}">
                ${imageTemplate}
            </div>
            <div class="${rightClassName}">
                ${infoTemplate}
            </div>
            <div class="clearfix"></div>
        </div>
        <hr></hr>`;

        return template;
    }


    async products(): Promise<Product[]> {
        var products: Product[];
        if (this.state.productSourceType == 'category')
            products = await this.shopping.productsByCategory(this.state.prodcutsCount, this.state.categoryId);
        else {
            products = await this.shopping.productsByIds(this.state.productIds);
        }

        products.forEach(o => o.ImagePath = o.ImagePaths[0]);
        return products;
    }

    productDisplayName(product: Product) {
        let { showFields } = this.state;
        if (!showFields || product.Fields.length == 0)
            return product.Name;

        let fields = product.Fields.map(o => o.value).join(',');
        return `${product.Name}(${fields})`;
    }

    createProductImageTemplate() {
        let tmp = `
        <img class="product-image" src="{{image}}"/>
        {{if(offShelve || stock == 0)}}
        <div class="product-image-mask"></div>
        <div class="product-image-text">{{offShelve ? '已下架' : '已售罄'}}</div>
        {{/if}}`;
        return tmp;
    }

    createProductInfoTemplate() {
        var { productCounts, productNameLines, showFields } = this.state;
        let titleClassName = productNameLines == 'singleLine' ? 'name single-line' : 'name double-line';
        let tmp = `
        <div class='${titleClassName} btn-link' product-id="{{id}}">{{name}}</div>
        <div class="price-bar">
            <span class="pull-left">{{price}}</span>
            <div class="product-count">
            </div>
        </div>`;
        return tmp;
    }


}

type ProductCountProps = {
    product: Product, count: number,
    createService<T extends chitu.Service>(type?: chitu.ServiceConstructor<T>): T
} & React.Props<Product>
class ProductCount extends React.Component<ProductCountProps, {}>
{
    shoppingCart: ShoppingCartService;
    constructor(props) {
        super(props);
        chitu.Page.prototype.createService
        this.state = { count: this.props.count || 0 };
        this.shoppingCart = this.props.createService(ShoppingCartService);
    }

    async increaseCount(product: Product) {
        let count = (this.props.count || 0) + 1;
        await this.shoppingCart.setItemCount(product, count);
    }
    async decreaseCount(product: Product) {
        let count = (this.props.count || 0);
        if (count <= 0)
            return;

        count = count - 1;
        await this.shoppingCart.setItemCount(product, count);
    }
    render() {
        let product = this.props.product;
        let count = this.props.count;
        return (
            <div className="product-count pull-right">
                <i className="icon-plus-sign pull-right" onClick={() => this.increaseCount(product)} />
                {count ? [
                    <input type="text" key={0} className="pull-right" value={`${count}`}
                        onChange={(e) => {
                            if (!e) return;
                            var value = Number.parseInt((e.target as HTMLInputElement).value);
                            if (!value)
                                return;

                            this.shoppingCart.setItemCount(product, value);
                        }} />,
                    <i key={1} className="icon-minus-sign pull-right" onClick={() => this.decreaseCount(product)} />
                ] : null}
            </div>
        );
    }
}