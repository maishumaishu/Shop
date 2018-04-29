import { defaultNavBar } from 'site';
import { ShoppingService } from 'user/services/shoppingService';
import * as ui from 'ui';

export default function (page: chitu.Page) {

    let orderId = page.data.orderId;
    if (!orderId) throw new Error('orderId cannt be empty.');

    let shopping = page.createService(ShoppingService);

    class OrderCouponsPage extends React.Component<{ couponCodes: CouponCode[] }, {}>{
        render() {
            return [
                <header key="h">
                    {defaultNavBar(page, { title: '请选择优惠劵' })}
                </header>,
                <section key="v">
                    <hr />
                    {this.props.couponCodes.map(o =>
                        <div key={o.Code}>
                            <div className="coupon">
                                <div className={`pull-left available`}>
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
                </section>
            ]
        }
    }
    shopping.orderAvailableCoupons(orderId).then(items => {
        ReactDOM.render(<OrderCouponsPage couponCodes={items} />, page.element);
    })
}