import { componentsDir, Control, component } from 'mobileComponents/common';
import { ShoppingCartService } from 'userServices/shoppingCartService';
import { ShoppingService } from 'userServices/shoppingService';
import { userData } from 'userServices/userData';

import { app } from 'site';
import { Panel } from 'components/panel';

requirejs(['css!mobileComponents/product/control.css']);

export interface Props {
    productId?: string
}
export interface State extends Props {

}

// @component("product")
export default class ProductControl extends Control<Props, State>{
    private productView: ProductView;

    persistentMembers = [];

    constructor(props) {
        super(props);
    }
    get element() {
        return this.productView.element;
    }
    _render(h) {
        let shopping = new ShoppingService();
        let shoppingCart = new ShoppingCartService();

        let product: Product;
        let designer = this.context.designer;
        // if (designer == null || !designer.isDesignMode) {

        // }
        // else {
        product = {
            Id: 'abc', Name: "Product", ImagePath: "ABC_200_200", ImagePaths: ["ABC_200_200"],
            Price: 100, MemberPrice: 100, Promotions: [], Arguments: [],
            CustomProperties: []
        } as Product;
        // }

        return (
            <ProductView shop={shopping} shoppingCart={shoppingCart} product={product}
                ref={async (e) => {
                    if (!e || !this.props.productId) return;
                    let p = await shopping.product(this.props.productId);
                    p.ImagePath = p.ImagePath || 'empty_300_300';
                    if (!p.ImagePaths || p.ImagePaths.length == 0) {
                        p.ImagePaths = [p.ImagePath];
                    }
                    e.state.product = p;
                    e.setState(e.state);
                }} />
        );
    }
}


let productStore = new chitu.ValueStore<Product>();

interface ProductPageState {
    productSelectedText: string,
    pullUpStatus: 'init' | 'ready',
    isFavored: boolean,
    productsCount: number,
    content: string,
    count: number,
    product: Product;
    couponsCount?: number
}


class ProductPanel extends React.Component<{ product: Product, parent: ProductView, shop: ShoppingService } & React.Props<ProductPanel>,
    { product: Product, count: number }> {

    private panel: Panel;
    constructor(props) {
        super(props);
        this.state = { product: this.props.product, count: this.props.parent.state.count };
    }
    private decrease() {
        let count = this.state.count;
        if (count == 1) {
            return;
        }

        count = count - 1;
        this.state.count = count;
        this.setState(this.state);
        this.props.parent.updateProductCount(count);
    }
    private increase() {
        let count = this.state.count;
        count = count + 1;
        this.state.count = count;
        this.setState(this.state);
        this.props.parent.updateProductCount(count);
    }
    private onProductsCountInputChanged(event: Event) {
        let value = Number.parseInt((event.target as HTMLInputElement).value);
        if (!value) return;

        this.state.count = value;
        this.setState(this.state);
        this.props.parent.updateProductCount(value);
    }
    private onFieldSelected(property: CustomProperty, name: string) {
        property.Options.forEach(o => {
            o.Selected = o.Name == name
        })

        var properties: { [name: string]: string } = {};
        this.state.product.CustomProperties.forEach(o => {
            properties[o.Name] = o.Options.filter(c => c.Selected)[0].Value;
        });

        let shop = this.props.shop;
        return shop.productByProperies(this.state.product.GroupId, properties)
            .then(o => {
                this.state.product = o;
                this.setState(this.state);
                productStore.value = o;
            });
    }
    show() {
        this.panel.show('right');
    } ProductView
    render() {
        let p = this.state.product;
        return (
            <Panel ref={(o) => {
                if (!o) return;
                this.panel = o
            }}
                header={
                    <div>
                        <nav>
                            <ul className="nav nav-tabs">
                                <li className="text-left" style={{ width: '30%' }}>
                                    <button onClick={() => this.panel.hide()} style={{ border: 'none', padding: 10, backgroundColor: 'inherit' }}>关闭</button>
                                </li>
                            </ul>
                        </nav>
                        <div style={{ paddingTop: "10px" }}>
                            <div className="pull-left" style={{ width: 80, height: 80, marginLeft: 10 }}>
                                {/*<ImageBox src={p.ImageUrl} className="img-responsive" />*/}
                                <img className="img-responsive" ref={(e: HTMLImageElement) => {
                                    if (!e) return;
                                }} />
                            </div>
                            <div style={{ marginLeft: 100, marginRight: 70 }}>
                                <div>{p.Name}</div>
                                <div className="price">￥{p.Price.toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                }
                body={
                    <div>
                        {p.CustomProperties.map(o => (
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
                        ))}
                    </div>
                }
                footer={
                    <div>
                        <div className="form-group">
                            <div style={{ width: 60, textAlign: 'left' }} className="pull-left">
                                <span>数量</span>
                            </div>
                            <div style={{ marginLeft: 60 }}>
                                <div className="input-group">
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" onClick={this.decrease.bind(this)}>
                                            <span className="icon-minus"></span>
                                        </button>
                                    </span>
                                    <input className="form-control" type="number" value={`${this.state.count}`}
                                        onChange={this.onProductsCountInputChanged.bind(this)} />
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" onClick={this.increase.bind(this)}>
                                            <span className="icon-plus"></span>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <button className="btn btn-primary btn-block"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                e.onclick = ui.buttonOnClick(() => {
                                    this.panel.hide();
                                    return this.props.parent.addToShoppingCart();
                                }, { toast: '成功添加到购物车' })
                            }}>
                            加入购物车
                        </button>
                    </div>
                } />
        );
    }
}

interface ProductViewProps extends React.Props<ProductView> {
    product: Product, shop: ShoppingService,
    shoppingCart: ShoppingCartService
}

class ProductView extends React.Component<ProductViewProps, ProductPageState>{

    private productView: HTMLElement;
    private header: HTMLElement;
    private introduceView: HTMLElement;
    private productPanel: ProductPanel;
    private isShowIntroduceView = false;
    private isShowProductView = false;
    private pageComponent: HTMLElement;

    constructor(props) {
        super(props);
        this.state = {
            productSelectedText: this.productSelectedText(this.props.product), content: null,
            pullUpStatus: 'init', isFavored: false, productsCount: userData.productsCount.value, count: 1,
            product: this.props.product
        };

        let shop = this.props.shop;
        shop.isFavored(this.props.product.Id).then((isFavored) => {
            this.state.isFavored = isFavored;
            this.setState(this.state);
        });

        shop.storeCouponsCount().then(count => {
            this.state.couponsCount = count;
            this.setState(this.state);
        })

        // subscribe(this, userData.productsCount, (value: number) => {
        //     this.state.productsCount = value;
        //     this.setState(this.state);
        // });
        // subscribe(this, productStore, (value: Product) => {
        //     this.updateStateByProduct(value);
        // });
    }

    private showPanel() {
        this.productPanel.show();
        return Promise.resolve();
    }
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
    private showIntroduceView() {
        let shop = this.props.shop;
        if (this.state.content == null) {
            shop.productIntroduce(this.state.product.Id).then((content) => {
                this.state.content = content;
                this.setState(this.state);
            });
        }

        // this.productView.slide('up');
        // this.introduceView.slide('origin');
    }

    componentDidMount() {
        let buttons = this.header.querySelectorAll('nav button');
        let title = this.header.querySelector('nav.bg-primary') as HTMLElement;

        this.productView.addEventListener('scroll', function (event) {
            let p = this.scrollTop / 100;
            p = p > 1 ? 1 : p;

            let buttonOpacity = 0.5 + p;
            buttonOpacity = buttonOpacity > 1 ? 1 : buttonOpacity;

            title.style.opacity = `${p}`;
            for (let i = 0; i < buttons.length; i++) {
                (buttons[i] as HTMLElement).style.opacity = `${buttonOpacity}`;
            }

        });
    }

    private favor() {
        let shop = this.props.shop;
        let p: (productId: string) => Promise<any>
        if (this.state.isFavored) {
            p = shop.unfavorProduct;
        }
        else {
            p = shop.favorProduct;
        }

        return p.bind(shop)(this.state.product.Id).then(o => {
            this.state.isFavored = !this.state.isFavored;
            this.setState(this.state);
        })
    }

    private showProductView() {
        // this.productView.slide('origin');
        // this.introduceView.slide('down');
    }

    addToShoppingCart() {
        let shoppingCart = this.props.shoppingCart;
        let id = this.props.product.Id;
        return shoppingCart.addItem(id, this.state.count);
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
    render() {
        let p = this.state.product;
        let { productsCount, couponsCount } = this.state;
        return (
            <div className="mobile-page product-control" ref={(e: HTMLElement) => this.pageComponent = e || this.pageComponent}>
                <header ref={(o: HTMLElement) => this.header = o || this.header}>
                    <nav className="bg-primary"></nav>
                    <nav>
                        <button className="leftButton" onClick={() => app.back()}>
                            <i className="icon-chevron-left"></i>
                        </button>
                        <button className="rightButton"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                e.onclick = ui.buttonOnClick(() => this.favor());
                            }}>
                            <i className="icon-heart-empty" style={{ fontWeight: `800`, fontSize: `20px`, display: !this.state.isFavored ? 'block' : 'none' }} ></i>
                            <i className="icon-heart" style={{ display: this.state.isFavored ? 'block' : 'none' }}></i>
                        </button>
                    </nav>
                </header>
                <section ref={(o: HTMLElement) => this.productView = this.productView || o}>
                    <div name="productImages" className="swiper-container">
                        <div className="swiper-wrapper">
                            {p.ImagePaths.map((o, i) => (
                                <div key={i} className="swiper-slide" style={{ textAlign: "center" }}>
                                    <img src={o} className="img-responsive-100 img-full" title="牛牛店宝"
                                        ref={(e: HTMLImageElement) => {
                                            if (!e) return;
                                            ui.renderImage(e)
                                        }} />
                                </div>
                            ))}
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
                            <p className="oldprice" style={{ display: p.MemberPrice != null && p.MemberPrice != p.Price ? 'block' : 'none' }}>
                                促销价：<span className="price">￥{p.MemberPrice.toFixed(2)}</span>
                            </p>
                        </li>

                        <li className="list-group-item" onClick={() => this.showPanel()}>
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
                </section>
                <footer>
                    <nav>
                        <a href={'#shopping_shoppingCartNoMenu'} className="pull-left">
                            <i className="icon-shopping-cart"></i>
                            {this.state.productsCount ?
                                <span className="badge bg-primary">{productsCount}</span>
                                : null
                            }
                        </a>
                        <button ref={(e: HTMLButtonElement) => ui.buttonOnClick(() => this.addToShoppingCart())} className="btn btn-primary pull-right" >加入购物车</button>
                    </nav>
                </footer>
                <ProductPanel ref={(o) => this.productPanel = o} parent={this} product={this.props.product} shop={this.props.shop} />
            </div>


        );
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

