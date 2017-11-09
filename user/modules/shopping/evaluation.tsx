import { ShoppingService } from 'userServices/shoppingService';
import { ShoppingCartService } from 'userServices/shoppingCartService';
// import { PageComponent, PageHeader, PageFooter, PageView, Dialog, Tabs, DataList, ImageBox } from 'mobileControls';
import { Tabs } from 'user/components/tabs';
import { DataList } from 'user/components/dataList';

export default function (page: chitu.Page) {
    let shop = page.createService(ShoppingService);
    const commented = 1, toComment = 0;
    class EvaluationComponent extends React.Component<{}, { activeTab }>{
        //private currentTab = 0;
        private dataList: DataList;
        constructor(props) {
            super(props);
            this.state = { activeTab: 0 };
        }
        private loadData() {
            if (this.state.activeTab == commented)
                return shop.commentedProducts();
            else
                return shop.toCommentProducts();
        }
        render() {
            return [
                <header>
                    <Tabs className="tabs"
                        onItemClick={(i) => {
                            this.state.activeTab = i;
                            this.setState(this.state);

                            this.dataList.reset();
                            this.dataList.loadData();
                        }}
                        children={[
                            <span>待评价</span>,
                            <span>已评价</span>
                        ]}>
                    </Tabs>
                </header>,
                <section className="container">
                    <DataList ref={(o) => this.dataList = o} loadData={() => this.loadData()}
                        dataItem={(o: ProductComent) =>
                            <div key={o.Id} className="products">
                                <div className="item">
                                    <div data-bind="click:$parent.showProduct,tap:$parent.showProduct" className="image pull-left">
                                        <img src={o.ImageUrl} className="img-responsive img-thumbnail"
                                            ref={(e: HTMLImageElement) => e ? ui.renderImage(e) : null} />
                                    </div>
                                    <div className="name">
                                        {o.Name}
                                    </div>
                                    {o.Status == 'Evaluated' ?
                                        <label data-bind="visible:Status()=='Evaluated'" className="pull-right">
                                            已评价
                                    </label>
                                        :
                                        <a href={`#shopping_productEvaluate?orderDetailId=${o.OrderDetailId}&productImageUrl=${encodeURIComponent(o.ImageUrl)}`} className="pull-right">
                                            <i className="icon-pencil"></i>
                                            评价晒单
                                    </a>
                                    }
                                    <div className="clearfix"></div>
                                </div>
                                <hr className="row" />
                            </div>
                        }
                        emptyItem={
                            <div className="norecords">
                                <div className="icon">
                                    <i className="icon-star">
                                    </i>
                                </div>
                                <h4 className="text">{this.state.activeTab == toComment ? '暂无待评价商品' : '暂无已评价商品'}</h4>
                            </div>
                        } />
                </section>
            ];
        }
    }

    ReactDOM.render(<EvaluationComponent />, page.element);
}