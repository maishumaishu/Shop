import { defaultNavBar } from 'site';
import { imageUrl, config } from 'userServices/service';
import { ShoppingService } from 'userServices/shoppingService';
import { DataList, dataList, MyDataList } from 'components/dataList';
import { Tabs } from 'components/tabs';
import { ProductImage } from 'user/components/productImage';
import { Page } from 'user/application';

export default async function (page: Page) {

    class ProductListHeader extends React.Component<{ title: string }, {}>{
        render() {
            return (
                <div>
                    {defaultNavBar(page, { title: this.props.title })}
                    <ul className="tabs" style={{ margin: '0px' }}>
                        <li>
                            <a className="active">综合</a>
                        </li>
                        <li>
                            <a className="">销量</a>
                        </li>
                        <li>
                            <span>价格</span>
                            <span className="icon-angle-up"></span>
                        </li>
                    </ul>
                </div>
            );
        }
    }

    class ProductListView extends React.Component<
        { shop: ShoppingService, categoryId: string } & React.Props<ProductListView>,
        { categoryId: string, title: string }>{

        private dataListElement: HTMLElement;
        private dataView: HTMLElement;
        private dataList: MyDataList<Product>;

        constructor(props) {
            super(props)
            this.state = { categoryId: this.props.categoryId, title: '' };
            shop.category(this.props.categoryId).then(c => {
                this.state.title = c.Name;
                this.setState(this.state);
            })
        }

        componentDidMount() {
            this.dataList = dataList<Product>({
                element: this.dataListElement,
                loadData: (pageIndex) => {
                    return this.props.shop.products(categoryId, pageIndex)
                },
                item: (o) => {
                    let element = document.createElement('a');
                    element.href = `#home_product?id=${o.Id}`
                    element.className = "col-xs-6 text-center item";
                    ReactDOM.render([
                        <ProductImage key={o.Id} product={o} />,
                        <div key="name" className="bottom">
                            <div className="interception" style={{ textAlign: 'left' }}>{o.Name}</div>
                            <div>
                                <div className="price pull-left">￥{o.Price.toFixed(2)}</div>
                            </div>
                        </div>

                    ], element);
                    return element
                }
            });
        }

        render() {

            if (this.dataList != null) {
                let categoryId = this.state.categoryId;
                this.dataList.reset((pageIndex) => this.props.shop.products(categoryId, pageIndex))
            }

            return [
                <header key="header">
                    {defaultNavBar(page, { title: this.state.title })}
                </header>,
                <section key="view0" ref={(e: any) => this.dataView = e || this.dataView}>
                    <div className="products"
                        ref={(e: HTMLElement) => this.dataListElement = e || this.dataListElement} style={{ paddingTop: 10 }}></div>
                </section >
            ]
        }
    }

    let shop = page.createService(ShoppingService);
    let categoryId = page.data.categoryId;


    let productListView: ProductListView;
    ReactDOM.render(<ProductListView shop={shop} categoryId={categoryId}
        ref={e => productListView = e || productListView} />, page.element);

    type Params = { categoryId: string };
    page.showing.add(async (sender: Page, args: Params) => {
        categoryId = args.categoryId;
        if (productListView.state.categoryId == categoryId)
            return;

        sender.showLoading();
        let category = await shop.category(categoryId);
        productListView.state.title = category.Name;
        productListView.state.categoryId = categoryId;
        productListView.setState(productListView.state);
        sender.hideLoading();
    })
}



