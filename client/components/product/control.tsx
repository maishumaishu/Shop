import { componentsDir, Control, component, ControlProps } from 'components/common';
import { ShoppingCartService } from 'user/services/shoppingCartService';
import { ShoppingService } from 'user/services/shoppingService';
import { Service } from 'user/services/service';
import { userData } from 'user/services/userData';
import { imageUrl, guid } from 'user/services/service';
import { app, defaultNavBar } from 'user/site';
// import { Panel } from 'components/panel';
import { Panel } from 'ui';


export class Header extends Control<ControlProps<Footer>, any>{
    get persistentMembers(): string[] {
        return [];
    }

    private favor() {
        let shopping = this.elementPage.createService(ShoppingService);
        let p: (productId: string) => Promise<any>
        if (this.state.isFavored) {
            p = shopping.unfavorProduct;
        }
        else {
            p = shopping.favorProduct;
        }

        return p.bind(shopping)(this.state.product.Id).then(o => {
            this.state.isFavored = !this.state.isFavored;
            this.setState(this.state);
        })
    }
    componentDidMount() {
    }
    _render(h) {
        return defaultNavBar(this.elementPage, { title: '商品详情' })
    }
}

export class Footer extends Control<ControlProps<Footer> & { product: Product }, { productsCount: number }> {
    private shoppingCart: ShoppingCartService;
    constructor(props) {
        super(props);
        this.shoppingCart = this.elementPage.createService(ShoppingCartService);
        this.state = { productsCount: ShoppingCartService.productsCount.value };
        this.subscribe(ShoppingCartService.productsCount, (value) => {
            this.state.productsCount = value;
            this.setState(this.state);
        })
        // this.shoppingCart.productsCount
    }
    get persistentMembers() {
        return [];
    }
    addToShoppingCart() {

        let c = this.mobilePage.controls.filter(o => o instanceof ProductControl)[0] as any as ProductControl;

        let shoppingCart = this.elementPage.createService(ShoppingCartService); //this.props.shoppingCart;
        let product: Product = c.state.product;
        let id = product.Id;

        let count: number;
        let shoppingCartItem = ShoppingCartService.items.value.filter(o => o.ProductId == product.Id)[0];
        if (shoppingCartItem == null) {
            shoppingCartItem = {
                Id: guid(),
                Amount: product.Price * count,
                Count: count,
                ImagePath: product.ImagePath,
                Name: product.Name,
                ProductId: product.Id,
                Selected: true,
                Price: product.Price,
            };
            count = 1;
        }
        else {
            count = shoppingCartItem.Count + 1;
        }

        return shoppingCart.setItemCount(product, count);
    }
    componentDidMount() {
        // this.shoppingCart.onChanged(this, () => {
        //     this.state.productsCount = this.shoppingCart.productsCount;
        //     this.setState(this.state);
        // })
    }
    _render(h) {
        let { productsCount } = this.state;
        let p = this.props.product;
        let allowBuy = (p.Stock == null || p.Stock > 0) && p.OffShelve != true;

        let buttonText = p.Stock == 0 ? "商品已售罄" : p.OffShelve == true ? "商品已下架" : "加入购物车";
        return (
            <nav className="product-control-footer">
                <a href={'#shopping_shoppingCart'} className="pull-left">
                    <i className="icon-shopping-cart"></i>
                    {productsCount ?
                        <span className="badge bg-primary">{productsCount}</span>
                        : null
                    }
                </a>
                <button disabled={!allowBuy} style={{ width: 120 }}
                    ref={(e: HTMLButtonElement) => e ? e.onclick = ui.buttonOnClick(() => this.addToShoppingCart()) : null}
                    className="btn btn-primary pull-right" >{buttonText}</button>
            </nav>
        );
    }
}


let productStore = new chitu.ValueStore<Product>();


export interface Props extends ControlProps<ProductControl> {
    product: Product,
}

export interface State {
    productSelectedText: string,
    pullUpStatus: 'init' | 'ready',
    isFavored: boolean,
    productsCount: number,
    content: string,
    count: number,
    product: Product;
    couponsCount?: number
}

export default class ProductControl extends Control<Props, State>{

    private productView: HTMLElement;
    // private header: HTMLElement;
    private introduceView: HTMLElement;
    private panelElement: HTMLElement;
    // private productPanel: ProductPanel;
    private isShowIntroduceView = false;
    private isShowProductView = false;
    private pageComponent: HTMLElement;
    private shopping: ShoppingService;
    private shoppingCart: ShoppingCartService;
    private panel: Panel;

    constructor(props) {
        super(props);

        // this.loadControlCSS();
        this.state = {
            productSelectedText: this.productSelectedText(this.props.product), content: null,
            pullUpStatus: 'init', isFavored: false, productsCount: userData.productsCount.value, count: 1,
            product: this.props.product
        };

        this.shoppingCart = this.elementPage.createService(ShoppingCartService);
        let shopping = this.shopping = this.elementPage.createService(ShoppingService); //this.props.shop;
        shopping.isFavored(this.props.product.Id).then((isFavored) => {
            this.state.isFavored = isFavored;
            this.setState(this.state);
        });

        shopping.storeCouponsCount().then(count => {
            this.state.couponsCount = count;
            this.setState(this.state);
        })

        shopping.productIntroduce(this.state.product.Id).then((content) => {
            this.state.content = content;
            this.setState(this.state);
        });

        // subscribe(this, userData.productsCount, (value: number) => {
        //     this.state.productsCount = value;
        //     this.setState(this.state);
        // });
        // subscribe(this, productStore, (value: Product) => {
        //     this.updateStateByProduct(value);
        // });

        this.panelElement = document.createElement('div');
        this.elementPage.element.appendChild(this.panelElement);
        this.panel = new Panel(this.panelElement);
    }

    private decrease() {
        let count = this.state.count;
        if (count == 1) {
            return;
        }

        count = count - 1;
        this.state.count = count;
        this.setState(this.state);
        this.updateProductCount(count);
    }

    private increase() {
        let count = this.state.count;
        count = count + 1;
        this.state.count = count;
        this.setState(this.state);
        this.updateProductCount(count);
    }

    private onFieldSelected(property: CustomProperty, name: string) {
        property.Options.forEach(o => {
            o.Selected = o.Name == name
        })

        var properties: { [name: string]: string } = {};
        this.state.product.CustomProperties.forEach(o => {
            properties[o.Name] = o.Options.filter(c => c.Selected)[0].Value;
        });

        return this.shopping.productByProperies(this.state.product.GroupId, properties)
            .then(o => {
                this.state.product = o;
                this.setState(this.state);
                productStore.value = o;
            });
    }

    private onProductsCountInputChanged(event: { target }) {
        let value = Number.parseInt((event.target as HTMLInputElement).value);
        if (!value) return;

        this.state.count = value;
        this.setState(this.state);
        this.updateProductCount(value);
    }

    get persistentMembers() {
        return [];
    }

    // private showPanel() {
    //     this.panel.show();
    // }
    private productSelectedText(product: Product) {
        var str = '';
        var props = product.CustomProperties || [];
        for (var i = 0; i < props.length; i++) {
            var options = props[i].Options;
            for (var j = 0; j < options.length; j++) {
                if (options[j].Selected) {
                    str = str + options[j].Name + ' ';
                    break;
                }
            }
        }
        str = str + (this.state == null ? 1 : this.state.count) + '件';
        return str;
    }

    // private showIntroduceView() {
    //     let shopping = this.shopping;
    //     if (this.state.content == null) {
    //         shopping.productIntroduce(this.state.product.Id).then((content) => {
    //             this.state.content = content;
    //             this.setState(this.state);
    //         });
    //     }
    // }

    componentDidMount() {

    }

    addToShoppingCart() {
        let shoppingCart = this.shoppingCart;
        let id = this.props.product.Id;
        let product = this.props.product;
        let count = this.state.count;

        // let shoppingCartItem = {
        //     Id: guid(),
        //     Amount: product.Price * count,
        //     Count: count,
        //     ImagePath: product.ImagePath,
        //     Name: product.Name,
        //     ProductId: product.Id,
        //     Selected: true,
        //     Price: product.Price,
        // };

        return shoppingCart.setItemCount(product, count);
    }

    updateProductCount(value) {
        this.state.count = value;
        this.state.productSelectedText = this.productSelectedText(this.props.product);
        this.state.content = null;
        this.setState(this.state);
    }

    updateStateByProduct(product: Product) {
        this.state.product = product;
        this.state.productSelectedText = this.productSelectedText(this.props.product);
        this.setState(this.state);
    }

    get element(): HTMLElement {
        console.assert(this.pageComponent != null);
        return this.element;
    }

    renderPanel(p: Product) {
        ReactDOM.render([
            <ul key={10} className="nav nav-tabs bg-primary">
                <li className="text-left" style={{ width: '30%' }}>
                    <button onClick={() => this.panel.hide()}>关闭</button>
                </li>
            </ul>,
            <div key={20} style={{ paddingTop: "10px" }}>
                <div className="pull-left" style={{ width: 80, height: 80, marginLeft: 10 }}>
                    <img className="img-responsive"
                        src={imageUrl(p.ImagePath)}
                        ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                </div>
                <div style={{ marginLeft: 100, marginRight: 70 }}>
                    <div>{p.Name}</div>
                    <div className="price">￥{p.Price.toFixed(2)}</div>
                </div>
            </div>,
            <div key={30} className="clearfix"></div>],
            this.panel.header);

        ReactDOM.render(p.CustomProperties.map((o) => (
            <div key={o.Name} className="container row">
                <div className="pull-left" style={{ width: 60 }}>
                    <span>{o.Name}</span>
                </div>
                {o.Options.map(c => (
                    <div key={c.Name} style={{ marginLeft: 60 }}>
                        <button className={c.Selected ? 'cust-prop selected' : 'cust-prop'}
                            ref={(e: HTMLButtonElement) => e != null ? e.onclick = ui.buttonOnClick(() => this.onFieldSelected(o, c.Name)) : null}
                        >{c.Name}</button>
                    </div>
                ))}
            </div>
        )), this.panel.body);

        ReactDOM.render([
            <div key={10} className="form-group">
                <div style={{ width: 50, paddingTop: 8, textAlign: 'left' }} className="pull-left">
                    <span>数量</span>
                </div>
                <div className="input-group">
                    <span className="input-group-btn">
                        <button className="btn btn-default" onClick={() => this.decrease()}>
                            <span className="icon-minus"></span>
                        </button>
                    </span>
                    <input className="form-control" type="number" value={`${this.state.count}`}
                        onChange={(event) => this.onProductsCountInputChanged(event)} />
                    <span className="input-group-btn">
                        <button className="btn btn-default" onClick={() => this.increase()}>
                            <span className="icon-plus"></span>
                        </button>
                    </span>
                </div>
            </div>,
            <div key={20} className="clearfix"></div>,
            <button key={30} className="btn btn-primary btn-block"
                ref={(e: HTMLButtonElement) => {
                    if (!e) return;
                    e.onclick = ui.buttonOnClick(() => {
                        this.panel.hide();
                        return this.addToShoppingCart();
                    }, { toast: '成功添加到购物车' })
                }}>
                加入购物车
                </button>
        ], this.panel.footer);
    }
    componentDidUpdate() {
        this.renderPanel(this.state.product);
    }
    _render(h) {
        let p = this.state.product;
        let { productsCount, couponsCount } = this.state;
        return [
            <div key="main" className="product-control" ref={(e: HTMLElement) => this.pageComponent = e || this.pageComponent}>
                <div name="productImages" className="carousel slide">
                    <div className="carousel-inner">
                        {/* {p.ImagePaths.map((o, i) => (
                            <div key={i} className={i == 0 ? "item active" : "item"} style={{ textAlign: "center" }}>
                                <img src={imageUrl(o, 300, 300)} className="img-responsive-100 img-full"
                                    ref={(e: HTMLImageElement) => {
                                        if (!e) return;
                                        ui.renderImage(e)
                                    }} />
                            </div>
                        ))} */}
                    </div>
                </div>
                <ul className="list-group">
                    <li name="productName" className="list-group-item">
                        <h4 className="text-left" style={{ fontWeight: 'bold' }}>{p.Name}</h4>
                    </li>

                    <li className="list-group-item">
                        <span>类别：</span>
                        <a href="">{p.ProductCategoryName}</a>
                    </li>

                    <li className="list-group-item">
                        <span className="pull-left">价格：<strong className="price">￥{p.Price.toFixed(2)}</strong></span>
                        <span className="pull-left" style={{ display: p.Score == null ? 'none' : 'block' }}>积分：<strong className="price">{this.props.product.Score}</strong></span>
                        <span className="pull-right">{p.Unit}</span>
                        <div className="clearfix"></div>
                    </li>

                    <li className="list-group-item" onClick={() => this.panel.show()}>
                        <span>
                            已选：{this.state.productSelectedText}
                        </span>
                        <span className="pull-right">
                            <i className="icon-chevron-right"></i>
                        </span>
                    </li>

                    {p.Promotions.length > 0 ?
                        <li className="list-group-item">
                            {p.Promotions.map((o, i) => (
                                <PromotionComponent key={i} promotion={o}></PromotionComponent>
                            ))}
                        </li> : null
                    }

                    {couponsCount ?
                        <li className="list-group-item" style={{ padding: '0px 0px 10px 0px' }} onClick={() => location.hash = '#shopping_storeCoupons'}>
                            <div className="pull-left">
                                店铺优惠劵
                            </div>
                            <div className="pull-right">
                                <span className="badge bg-primary" style={{ marginRight: 10 }}>{couponsCount}</span>
                                <i className="icon-chevron-right"></i>
                            </div>
                        </li> : null}
                </ul>
                <hr />
                <div className="container">
                    <h4 style={{ fontWeight: 'bold', width: '100%' }}>商品信息</h4>
                    {p.Arguments.map(o => (
                        <div key={o.key} style={{ marginBottom: '10px' }}>
                            <div className="pull-left" style={{ width: '100px' }}>{o.key}</div>
                            <div style={{ marginLeft: '100px' }}>{o.value}</div>
                            <div className="clearfix"></div>
                        </div>
                    ))}
                    <div style={{
                        height: '120px', paddingTop: '40px', textAlign: 'center',
                        display: p.Arguments == null || p.Arguments.length == 0 ? 'block' : 'none'
                    }}>
                        <h4>暂无商品信息</h4>
                    </div>
                </div>
                <hr />

            </div>,
            // <ProductPanel key="panel" ref={(o) => this.productPanel = o} parent={this} product={this.props.product} shop={this.shopping} />,
            <div key="content" className="product-control content"
                style={{ background: 'whitesmoke' }} dangerouslySetInnerHTML={{ __html: this.state.content }}
                ref={(e: HTMLElement) => {
                    if (!e) return;

                    let imgs = e.querySelectorAll('img');
                    for (let i = 0; i < imgs.length; i++) {
                        ui.renderImage(imgs[i], { imageText: Service.storeName });
                    }
                }}>
            </div>

        ];
    }
}

class PromotionComponent extends React.Component<
    { promotion: Promotion, key: any },
    { status: 'collapse' | 'expand' }>{


    constructor(props) {
        super(props);
        this.state = { status: 'collapse' };
    }

    toggle() {
        if (this.state.status == 'collapse') {
            this.state.status = 'expand';
        }
        else {
            this.state.status = 'collapse';
        }
        this.setState(this.state);
    }

    render() {
        let type = this.props.promotion.Type;
        let contents = this.props.promotion.Contents;
        let status = this.state.status;
        return (
            <div className="media">
                <div className="media-left" >
                    <span style={{ display: type.indexOf('Given') >= 0 ? 'block' : 'none' }} className="label label-info" >满赠</span>
                    <span style={{ display: type.indexOf('Reduce') >= 0 ? 'block' : 'none' }} className="label label-success" >满减</span>
                    <span style={{ display: type.indexOf('Discount') >= 0 ? 'block' : 'none' }} className="label label-warning" >满折</span>
                </div>
                <div onClick={() => this.toggle()} className="media-body">
                    {contents.map((o, i) => (
                        <div key={i} style={{ display: status == 'expand' || i == 0 ? 'block' : 'none', margin: '0 0 8px 0' }}>
                            {o.Description}
                        </div>
                    ))}
                </div>
                {contents.length > 1 ?
                    <div onClick={() => this.toggle()} className="media-right">
                        <i className={status == 'collapse' ? "icon-chevron-down" : 'icon-chevron-up'}></i>
                    </div> : null}
            </div >
        );
    }
}

