import app from 'application';
import { formatDate } from 'site';

import { ShoppingService } from 'adminServices/shopping';
import UE = require('ue.ext');
import FormValidator from 'formValidator';
import * as ui from 'myWuZhui';
import { buttonOnClick } from 'ui';

export default async function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);

    interface CouponEditPageState {
        coupon: Coupon
    }

    interface CouponEditPageProps extends React.Props<CouponEditPage> {
        coupon?: Coupon
    }

    class CouponEditPage extends React.Component<CouponEditPageProps, CouponEditPageState>{
        private validator: FormValidator;
        private formElement: HTMLElement;
        private productTable: HTMLTableElement;
        private categoryTable: HTMLTableElement;
        private brandTable: HTMLTableElement;

        private validBeginInput: HTMLInputElement;
        private validEndInput: HTMLInputElement;

        constructor(props) {
            super(props);
            this.state = { coupon: this.props.coupon || {} as Coupon };
        }
        save(): Promise<any> {
            if (!this.validator.validateForm()) {
                return Promise.reject({});
            }

            let coupon = this.state.coupon;
            coupon.ValidBegin = new Date(this.validBeginInput.value);
            coupon.ValidEnd = new Date(this.validEndInput.value);
            if (coupon.Id) {
                return shopping.updateCoupon(coupon);
            }
            return shopping.addCoupon(coupon);
        }
        componentDidMount() {
            this.validator = new FormValidator(this.formElement, {
                title: { rules: ['required'], display: '标题' },
                discount: { rules: ['required'], display: '抵扣金额' },
                amount: { rules: ['required'], display: '消费金额' },
                validBegin: { rules: ['required'], display: '开始日期' },
                validEnd: { rules: ['required'], display: '结束日期' }
            });

            var productGridView = ui.createGridView({
                element: this.productTable,
                columns: [
                    new ui.BoundField({ dataField: 'Name' })
                ],
                dataSource: new wuzhui.DataSource({ select: () => Promise.resolve([]) }),
                showHeader: false,
                pageSize: 0,
                emptyDataHTML: '尚未添加可以使用该优惠卷的商品，默认所有商品可以使用'
            });
            var categoryGridView = ui.createGridView({
                element: this.categoryTable,
                columns: [
                    new ui.BoundField({ dataField: 'Name' })
                ],
                dataSource: new wuzhui.DataSource({ select: () => Promise.resolve([]) }),
                showHeader: false,
                pageSize: 0,
                emptyDataHTML: '尚未添加可以使用该优惠卷的品类，默认所有品类的商品可以使用'
            });
            var brandGridView = ui.createGridView({
                element: this.brandTable,
                columns: [
                    new ui.BoundField({ dataField: 'Name' })
                ],
                dataSource: new wuzhui.DataSource({ select: () => Promise.resolve([]) }),
                showHeader: false,
                pageSize: 0,
                emptyDataHTML: '尚未添加可以使用该优惠卷的品牌，默认所有品牌的商品可以使用'
            });

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
                                    value={`${coupon.Discount}` || ''}
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
                                    value={`${coupon.Amount}` || ''}
                                    onChange={(e) => {
                                        coupon.Amount = Number.parseFloat((e.target as HTMLInputElement).value);
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
                                        value={formatDate(coupon.ValidBegin)}
                                        onChange={(e) => {
                                            coupon.ValidBegin = new Date((e.target as HTMLInputElement).value);
                                            this.setState(this.state);
                                        }} />
                                </div>
                                <div className="col-sm-6" style={{ paddingRight: 0 }}>
                                    <input name="validEnd" className="form-control" placeholder="优惠券使用的结束日期"
                                        ref={(o: HTMLInputElement) => this.validEndInput = o || this.validEndInput}
                                        value={formatDate(coupon.ValidEnd)}
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
                    <div className="row">
                        <div className="col-sm-12">
                            <h5 className="blue">适用范围</h5>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="tabbable">
                                <ul className="nav nav-tabs"
                                    style={{ border: 'solid 1px #ccc', background: '#f7f7f7' }}>
                                    <li>
                                        <div style={{ padding: '4px 0px 0px 6px' }}>适用商品</div>
                                    </li>
                                    <li className="pull-right">
                                        <button data-bind="click:back" className="btn btn-xs btn-primary">
                                            <i className="icon-plus"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <table className="table table-striped table-bordered table-hover"
                                ref={(o: HTMLTableElement) => this.productTable = o || this.productTable}>
                            </table>
                        </div>
                        <div className="col-sm-4">
                            <div className="tabbable">
                                <ul className="nav nav-tabs"
                                    style={{ border: 'solid 1px #ccc', background: '#f7f7f7' }}>
                                    <li>
                                        <div style={{ padding: '4px 0px 0px 6px' }}>适用品类</div>
                                    </li>
                                    <li className="pull-right">
                                        <button data-bind="click:back" className="btn btn-xs btn-primary">
                                            <i className="icon-plus"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <table className="table table-striped table-bordered table-hover"
                                ref={(o: HTMLTableElement) => this.categoryTable = o || this.categoryTable}>
                            </table>
                        </div>
                        <div className="col-sm-4">
                            <div className="tabbable">
                                <ul className="nav nav-tabs"
                                    style={{ border: 'solid 1px #ccc', background: '#f7f7f7' }}>
                                    <li>
                                        <div style={{ padding: '4px 0px 0px 6px' }}>适用品牌</div>
                                    </li>
                                    <li className="pull-right">
                                        <button data-bind="click:back" className="btn btn-xs btn-primary">
                                            <i className="icon-plus"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <table className="table table-striped table-bordered table-hover"
                                ref={(o: HTMLTableElement) => this.brandTable = o || this.brandTable}>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // let coupon: Coupon;
    // if (page.routeData.values.id) {
    //     shopping.coupon(page.routeData.values.id);
    // }

    // page.showing.add(() => {
    //     let id = page.routeData.values.id;

    // })



    let couponEditPage: CouponEditPage;
    ReactDOM.render(<CouponEditPage ref={(e) => couponEditPage = e} />, page.element);

    function updatePageState() {
        if (page.routeData.values.id) {
            shopping.coupon(page.routeData.values.id).then(coupon => {
                couponEditPage.state.coupon = coupon;
                couponEditPage.setState(couponEditPage.state);
            });
        }
    }

    updatePageState();
    page.showing.add(() => updatePageState());
}

// let JData = window['JData'];

// export default function (page: chitu.Page) {
//     requirejs([`text!${page.routeDaRechargeAmountta.actionPath}.html`], (html) => {
//         page.element.innerHTML = html;
//         page_load(page, page.routeData.values);
//     })
// }

// function page_load(page: chitu.Page, args: any) {
//     var ue_ready = $.Deferred();

//     //var ue: any;
//     // requirejs(['com/ue.ext'], function (UE) {
//     //     ue = UE.getEditor('couponCodeEditor');
//     //     ue.ready(function () {
//     //         ue.setHeight(120);
//     //         ue_ready.resolve();
//     //     });
//     // })


//     var model = {
//         coupon: {
//             Id: ko.observable(),
//             Title: ko.observable().extend({ required: true }),
//             Discount: ko.observable().extend({ required: true }),
//             Amount: ko.observable().extend({ required: true }),
//             ReceiveBegin: ko.observable().extend({ required: true }),
//             ReceiveEnd: ko.observable().extend({ required: true }),
//             ValidBegin: ko.observable().extend({ required: true }),
//             ValidEnd: ko.observable().extend({ required: true }),
//             Picture: ko.observable(),
//             Remark: ko.observable<string>(),
//             BrandNames: ko.observable(),
//             CategoryNames: ko.observable(),
//             ProductNames: ko.observable()
//         },
//         back: function () {
//             app.back({}).catch(function () {
//                 app.redirect('Coupon/CouponList');
//             })
//         },
//         save: function () {
//             //model.coupon.Remark(ue.getContent());
//             var result = $.Deferred();
//             var dataItem = ko.mapping.toJS(model.coupon);
//             debugger;
//             shopping.couponDataSource.set_method('post');
//             if (model.coupon.Id()) {
//                 result = shopping.couponDataSource.update(dataItem);
//             }
//             else {
//                 result = shopping.couponDataSource.insert(dataItem);
//             }
//             return result.done(function () {
//                 model.back();
//             });
//         }
//     };

//     ko.applyBindings(model, page.element);

//     UE.createEditor('couponCodeEditor', model.coupon.Remark);

//     (<any>$('[name="ReceiveBegin"],[name="ReceiveEnd"],[name="ValidBegin"],[name="ValidEnd"]')).datepicker({
//         dateFormat: 'yy-mm-dd',
//         beforeShow: function (inputElem, inst) {
//             setTimeout(function () {
//                 $('#ui-datepicker-div').css("z-index", 10000);
//             }, 100);
//         }
//     });

//     //page.load.add(function (sender, args) {
//     if (args.id) {
//         var sel_args = new JData.DataSourceSelectArguments();
//         sel_args.set_filter('Id=Guid"' + args.id + '"');
//         $.when(shopping.couponDataSource.select(sel_args).then(function (coupons) {
//             return coupons[0];
//         }), ue_ready)
//             .done(function (coupon: any) {
//                 coupon.ValidBegin = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ValidBegin);
//                 coupon.ValidEnd = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ValidEnd);
//                 coupon.ReceiveBegin = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ReceiveBegin);
//                 coupon.ReceiveEnd = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ReceiveEnd);

//                 ko.mapping.fromJS(coupon, {}, model.coupon);

//                 // ue.setContent(model.coupon.Remark() || '');
//             })
//     }
//     //})

//     requirejs(['jquery.fileupload'], function () {
//         (<any>$(page.element).find('[name="ImageUpload"]')).fileupload({
//             url: site.config.shopUrl + 'Common/UploadImage?dir=Coupon',
//             dataType: 'json'
//         }).on('fileuploaddone', function (e, data) {
//             var path = data.result.path || '';
//             if (path.substr(0, 1) == '/') {
//                 path = path.substr(1);
//             }
//             model.coupon.Picture(site.config.shopUrl + data.result.path);
//         }).on('fileuploadfail', function (error) {
//             site.showInfo('上传图片失败');
//         });
//     })

// }