import app from 'application';
import { formatDate } from 'adminServices/service';
import { ShoppingService } from 'adminServices/shopping';
// import FormValidator from 'formValidator';
// import * as wz from 'myWuZhui';
import { buttonOnClick } from 'ui';
import { PromotionRangeComponent } from 'modules/shopping/promotion/activityEdit'

export default async function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);

    interface CouponEditPageState {
        coupon: Coupon
    }

    interface CouponEditPageProps extends React.Props<CouponEditPage> {
        coupon: Coupon
    }

    class CouponEditPage extends React.Component<CouponEditPageProps, CouponEditPageState>{
        private validator: dilu.FormValidator;
        private formElement: HTMLElement;
        private productTable: HTMLTableElement;
        private categoryTable: HTMLTableElement;
        private brandTable: HTMLTableElement;

        private titleInput: HTMLInputElement;
        private discountInput: HTMLInputElement;
        private amountInput: HTMLInputElement;

        private validBeginInput: HTMLInputElement;
        private validEndInput: HTMLInputElement;

        constructor(props) {
            super(props);
            this.state = { coupon: this.props.coupon || {} as Coupon };
        }
        async  save(): Promise<any> {
            if (!await this.validator.check()) {
                return Promise.reject({});
            }

            let coupon = this.state.coupon;
            // coupon.ValidBegin = new Date(this.validBeginInput.value);
            // coupon.ValidEnd = new Date(this.validEndInput.value);
            return shopping.saveCoupon(coupon);
        }
        componentDidMount() {
            let { required } = dilu.rules;
            this.validator = new dilu.FormValidator(
                { element: this.titleInput, rules: [required("请输入标题")] },
                { element: this.discountInput, rules: [required("请输入抵扣金额")] },
                { element: this.amountInput, rules: [required("请输入消费金额")] },
                { element: this.validBeginInput, rules: [required("请输入开始日期")] },
                { element: this.validEndInput, rules: [required("请输入结束日期")] }
            );

            ($('[name="validBegin"],[name="validEnd"]') as any).datepicker({
                dateFormat: 'yy-mm-dd',
                beforeShow: function (inputElem, inst) {
                    setTimeout(function () {
                        $('#ui-datepicker-div').css("z-index", 10000);
                    }, 100);
                }
            });
        }
        render() {
            let coupon = this.state.coupon || {} as Coupon;
            return (
                <div ref={(o: HTMLElement) => this.formElement = o || this.formElement} >
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary" onClick={() => app.back()}>
                                    <i className="icon-reply" />
                                    <span>返回</span>
                                </button>
                            </li>
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary"
                                    ref={(o: HTMLButtonElement) => {
                                        if (!o) return;
                                        o.onclick = buttonOnClick(
                                            () => this.save(),
                                            { toast: '保存优惠劵成功' })
                                    }}>
                                    <i className="icon-save" />
                                    <span>保存</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                            <h5 className="blue">基本信息</h5>
                        </div>
                    </div>
                    <br />
                    <div className="row form-group">
                        <div className="col-sm-4">
                            <label className="item-label">标题</label>
                            <div className="item-input">
                                <input name="title" className="form-control"
                                    ref={(e: HTMLInputElement) => this.titleInput = e || this.titleInput}
                                    value={coupon.Title || ''}
                                    onChange={(e) => {
                                        coupon.Title = (e.target as HTMLInputElement).value;
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <label className="item-label">抵扣金额</label>
                            <div className="item-input">
                                <input name="discount" className="form-control"
                                    ref={(e: HTMLInputElement) => this.discountInput = e || this.discountInput}
                                    value={coupon.Discount == null ? "" : `${coupon.Discount}`}
                                    onChange={(e) => {
                                        coupon.Discount = Number.parseFloat((e.target as HTMLInputElement).value);
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>

                        <div className="col-sm-4 form-group">
                            <label className="item-label">消费金额</label>
                            <div className="item-input">
                                <input name="amount" className="form-control"
                                    ref={(e: HTMLInputElement) => this.amountInput = e || this.amountInput}
                                    value={coupon.Amount == null ? "" : `${coupon.Amount}`}
                                    onChange={(e) => {
                                        var value = Number.parseFloat((e.target as HTMLInputElement).value);
                                        coupon.Amount = isNaN(value) ? null : value;
                                        this.setState(this.state);
                                    }} />
                            </div>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-sm-4">
                            <label className="item-label">有效日期</label>
                            <div className="item-input">
                                <div className="col-sm-6" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <input name="validBegin" className="form-control" placeholder="优惠券使用的开始日期"
                                        ref={(o: HTMLInputElement) => this.validBeginInput = o || this.validBeginInput}
                                        value={coupon.ValidBegin ? formatDate(coupon.ValidBegin) : ""}
                                        onChange={(e) => {
                                            coupon.ValidBegin = new Date((e.target as HTMLInputElement).value);
                                            this.setState(this.state);
                                        }} />
                                </div>
                                <div className="col-sm-6" style={{ paddingRight: 0 }}>
                                    <input name="validEnd" className="form-control" placeholder="优惠券使用的结束日期"
                                        ref={(o: HTMLInputElement) => this.validEndInput = o || this.validEndInput}
                                        value={coupon.ValidEnd ? formatDate(coupon.ValidEnd) : ""}
                                        onChange={(e) => {
                                            coupon.ValidEnd = new Date((e.target as HTMLInputElement).value);
                                            this.setState(this.state);
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <label className="item-label">描述内容</label>
                            <div className="item-input">
                                <input className="form-control" />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <PromotionRangeComponent page={page} rules={coupon.Ranges} />
                </div>
            );
        }
    }

    let couponEditPage: CouponEditPage;
    let coupon = await shopping.coupon(page.routeData.values.id);
    ReactDOM.render(<CouponEditPage coupon={coupon} ref={(e) => couponEditPage = e} />, page.element);

    function updatePageState(sender, args) {
        // if (page.routeData.values.id) {
        shopping.coupon(args.id).then(coupon => {
            couponEditPage.state.coupon = coupon;
            couponEditPage.setState(couponEditPage.state);
        });
        // }
    }

    // updatePageState();
    page.showing.add((sender, args) => updatePageState(sender, args));
}
