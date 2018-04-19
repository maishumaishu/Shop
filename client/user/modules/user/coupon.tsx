import { defaultNavBar } from 'site';
import { ShoppingService } from 'userServices/shoppingService';
import { Tabs } from 'user/controls/tabs';
import { DataList } from 'user/controls/dataList';

export default function (page: chitu.Page) {
    let shopping = page.createService(ShoppingService);

    let defaultIndex = 0;
    type Status = 'available' | 'used' | 'expired';
    let statuses: Status[] = ['available', 'used', 'expired'];
    class CouponPage extends React.Component<{}, { status: Status }>{
        private dataView: HTMLElement;
        private dataList: DataList;

        constructor(props) {
            super(props);
            this.state = { status: statuses[defaultIndex] }
        }

        activeItem(index: number) {
            this.state.status = statuses[index];
            this.setState(this.state);
        }
        loadData(pageIndex: number, status: string) {
            return shopping.myCoupons(pageIndex, status);
        }
        componentDidUpdate() {
            this.dataList.reset();
            this.dataList.loadData();
        }
        render() {
            let status = this.state.status;
            return [
                <header>
                    {defaultNavBar(page, { title: '我的优惠券' })}
                    <Tabs className="tabs" defaultActiveIndex={defaultIndex} onItemClick={(index) => this.activeItem(index)}
                        scroller={() => this.dataView} >
                        {statuses.map(o => (
                            <span key={o}>{shopping.couponStatusText(o)}</span>
                        ))}
                    </Tabs>
                </header>,
                <section ref={o => this.dataView = o as HTMLElement}>
                    <hr />
                    <DataList ref={o => this.dataList = o}
                        loadData={(pageIndex) => this.loadData(pageIndex, status)}
                        dataItem={(o: CouponCode) => (
                            <div key={o.Id}>
                                <div className="coupon">
                                    <div className={`pull-left ${status}`}>
                                        ￥<span className="text">{o.Discount}</span>
                                    </div>
                                    <div className="main">
                                        <div>
                                            {o.Title}
                                        </div>
                                        <div className="date">
                                            {`有效期 ${o.ValidBegin.toLocaleDateString()} 至 ${o.ValidEnd.toLocaleDateString()}`}
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        )}
                        emptyItem={
                            <div className="norecords">
                                <div className="icon">
                                    <i className="icon-money">

                                    </i>
                                </div>
                                <h4 className="text">暂无{shopping.couponStatusText(status)}的优惠券</h4>
                            </div>
                        } />
                </section>
            ]
        }
    }

    ReactDOM.render(<CouponPage />, page.element);
}
