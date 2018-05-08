import { Control, ControlProps } from "../common";
import { ShoppingCartService } from "user/services/shoppingCartService";
import { guid } from "share/common";
import ProductInfoControl from "../productInfo/control";

type Props = ControlProps<ProductInfoBottomBarControl>;
type State = { productsCount: number, product?: Product };

export default class ProductInfoBottomBarControl extends Control<Props, State> {
    private shoppingCart: ShoppingCartService;
    constructor(props) {
        super(props);
        this.shoppingCart = this.elementPage.createService(ShoppingCartService);
        this.subscribe(ShoppingCartService.productsCount, (value) => {
            this.state.productsCount = value;
            this.setState(this.state);
        })
        // this.loadControlCSS();

        setTimeout(() => {
            let c = this.mobilePage.controls.filter(o => o instanceof ProductInfoControl)[0] as any as ProductInfoControl;
            console.assert(c != null);
            this.state = {
                productsCount: ShoppingCartService.productsCount.value,
                product: c.state.product
            };

            let self = this;
            let componentDidUpdate = c['componentDidUpdate'] as Function;
            c['componentDidUpdate'] = function () {
                self.state.product = c.state.product;
                self.setState(self.state);
                if (componentDidUpdate)
                    componentDidUpdate();
            }
        }, 100);
    }
    get persistentMembers() {
        return [];
    }
    get hasEditor() {
        return false;
    }
    addToShoppingCart() {

        let c = this.mobilePage.controls.filter(o => o instanceof ProductInfoControl)[0] as any as ProductInfoControl;

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

    }
    _render(h) {
        let { productsCount } = this.state;
        let p = this.state.product;
        let allowBuy = p != null && (p.Stock == null || p.Stock > 0) && p.OffShelve != true;

        let buttonText = "加入购物车";
        if (p != null && p.Stock == 0) {
            buttonText = "商品已售罄"
        }
        else if (p != null && p.OffShelve == true) {
            buttonText = "商品已下架"
        }
        return (
            <nav className="settlement">
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
