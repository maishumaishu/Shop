import { defaultNavBar } from 'site';
import { imageUrl, config } from 'userServices/service';
import { ShoppingService } from 'userServices/shoppingService';
import { DataList, dataList, MyDataList } from 'components/dataList';
import { Tabs } from 'components/tabs';


export default async function (page: chitu.Page) {

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
                        <img key="img" className="img-responsive" src={imageUrl(o.ImagePath, 150, 150)}
                            ref={(e: HTMLImageElement) => e ? ui.renderImage(e, { imageSize: { width: 150, height: 150 } }) : null} />,
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
                    {/* <DataList className="products" scroller={() => this.dataView} loadData={loadProducts}
                    ref={e => this.dataList = e || this.dataList}
                    dataItem={(o: Product) => (
                        <a key={o.Id} href={`#home_product?id=${o.Id}`} className="col-xs-6 text-center item">
                            <img src={imageUrl(o.ImagePath, 100, 100)} ref={(e: HTMLImageElement) => e ? ui.renderImage(e, { imageSize: { width: 100, height: 100 } }) : null} />
                            <div className="bottom">
                                <div className="interception">{o.Name}</div>
                                <div>
                                    <div className="price pull-left">￥{o.Price.toFixed(2)}</div>
                                </div>
                            </div>
                        </a>
                    )} /> */}
                    <div ref={(e: HTMLElement) => this.dataListElement = e || this.dataListElement} style={{ paddingTop: 10 }}></div>
                </section >
            ]
        }
    }

    let shop = page.createService(ShoppingService);
    let categoryId = page.routeData.values.categoryId;


    let productListView: ProductListView;
    ReactDOM.render(<ProductListView shop={shop} categoryId={categoryId}
        ref={e => productListView = e || productListView} />, page.element);

    page.active.add(async () => {
        categoryId = page.routeData.values.categoryId;
        if (productListView.state.categoryId == categoryId)
            return;

        let category = await shop.category(categoryId);
        productListView.state.title = category.Name;
        productListView.state.categoryId = categoryId;
        productListView.setState(productListView.state);
    })
}



