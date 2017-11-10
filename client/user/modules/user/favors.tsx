import { defaultNavBar } from 'site';
import { ShoppingService } from 'userServices/shoppingService';
import { app } from 'site';
import { DataList } from 'user/components/dataList';


export default function (page: chitu.Page) {
    let shop = page.createService(ShoppingService);

    class FavorPage extends React.Component<{}, {}>{
        private unfavor: Function;
        private dataView: HTMLElement;

        constructor() {
            super();

            this.unfavor = (event: React.MouseEvent, item: FavorProduct) => {
                let btn = event.target as HTMLElement;

                return shop.unfavorProduct(item.ProductId).then(() => {
                    btn.style.opacity = '0';
                    setTimeout(() => {
                        btn.style.display = 'none';
                        (btn.nextSibling as HTMLElement).style.opacity = '1';
                    }, 400);
                });
            };
        }

        showProduct(productId: string) {
            app.redirect(`#home_product?id=${productId}`);
        }
        loadFavorProducts(pageIndex: number) {
            if (pageIndex > 0) {
                return Promise.resolve([]);
            }
            return shop.favorProducts().then(items => {
                return items;
            });
        }
        render() {
            return [
                <header>
                    {defaultNavBar({ title: '我的收藏' })}
                </header>,
                <section ref={o => o ? this.dataView = o as HTMLElement : null}>
                    <DataList className="container" loadData={this.loadFavorProducts} dataItem={(o: FavorProduct) => (
                        <div key={o.ProductId}>
                            <div className="item row">
                                <div onClick={() => this.showProduct(o.ProductId)} className="col-xs-4">
                                    <img src={o.ImageUrl} className="img-responsive"
                                        ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                                </div>
                                <div className="col-xs-8">
                                    <div onClick={() => this.showProduct(o.ProductId)} className="name">
                                        <div>{o.ProductName}</div>
                                    </div>
                                    <button ref={`btn_${o.Id}`} onClick={(event) => this.unfavor(event, o)} className="pull-right btn btn-primary">
                                        <i className="icon-heart"></i>
                                        <span>取消收藏</span>
                                    </button>
                                    <label className="pull-right">
                                        已取消
                                </label>
                                </div>
                            </div>
                            <hr className="row" />
                        </div>
                    )}
                        emptyItem={
                            <div className="norecords">
                                <div className="icon">
                                    <i className="icon-heart-empty">

                                    </i>
                                </div>
                                <h4 className="text">你还没有添加收藏哦</h4>
                            </div>
                        } />
                </section>
            ]
        }
    }

    ReactDOM.render(<FavorPage />, page.element);
}