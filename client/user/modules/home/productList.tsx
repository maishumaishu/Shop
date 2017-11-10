import { defaultNavBar } from 'site';
import { imageUrl } from 'userServices/service';
import { ShoppingService } from 'userServices/shoppingService';
import { DataList } from 'components/dataList';
import { Tabs } from 'components/tabs';


export default function (page: chitu.Page) {

    let shop = page.createService(ShoppingService);
    let categoryId = page.routeData.values.categoryId;

    class ProductListView extends React.Component<{ title: string }, {}>{

        private dataView: HTMLElement;

        loadProducts(pageIndex: number) {
            return shop.products(categoryId, pageIndex).then(items => {
                return items;
            });
        }
        render() {
            return (
                <div>
                    {/* <header>
                        {defaultNavBar({ title: this.props.title })}
                        <Tabs className="tabs" scroller={() => this.dataView}>
                            <span className="active">综合</span>
                            <span className="">销量</span>
                            <span>
                                <span>价格</span>
                                <span className="icon-angle-up"></span>
                            </span>
                        </Tabs>
                    </header> */}
                    <section ref={(o: HTMLElement) => o ? this.dataView = o : null}>
                        <DataList className="products" scroller={() => this.dataView} loadData={this.loadProducts}
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
                            )} />
                    </section>
                </div>
            );
        }
    }

    class ProductListHeader extends React.Component<{ title: string }, {}>{
        render() {
            return (
                <div>
                    {defaultNavBar({ title: this.props.title })}
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

    shop.category(categoryId).then(o => {
        ReactDOM.render(<ProductListView title={o.Name} />, page.element);
    })
}