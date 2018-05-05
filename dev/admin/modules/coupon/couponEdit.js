var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/site", "share/common", "admin/services/shopping", "ui", "modules/shopping/promotion/activityEdit", "jquery-ui"], function (require, exports, site_1, common_1, shopping_1, ui_1, activityEdit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let shopping = page.createService(shopping_1.ShoppingService);
            class CouponEditPage extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = { coupon: this.props.coupon || {} };
                }
                save() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!(yield this.validator.check())) {
                            return Promise.reject({});
                        }
                        let coupon = this.state.coupon;
                        // coupon.ValidBegin = new Date(this.validBeginInput.value);
                        // coupon.ValidEnd = new Date(this.validEndInput.value);
                        return shopping.saveCoupon(coupon);
                    });
                }
                componentDidMount() {
                    let { required } = dilu.rules;
                    this.validator = new dilu.FormValidator(this.formElement, { name: "title", rules: [required("请输入标题")] }, { name: "discount", rules: [required("请输入抵扣金额")] }, { name: "amount", rules: [required("请输入消费金额")] }, { name: "validBegin", rules: [required("请输入开始日期")] }, { name: "validEnd", rules: [required("请输入结束日期")] });
                    $('[name="validBegin"],[name="validEnd"]').datepicker({
                        dateFormat: 'yy-mm-dd',
                        beforeShow: function (inputElem, inst) {
                            setTimeout(function () {
                                $('#ui-datepicker-div').css("z-index", 10000);
                            }, 100);
                        }
                    });
                }
                render() {
                    let coupon = this.state.coupon || {};
                    return (h("div", { ref: (o) => this.formElement = o || this.formElement },
                        h("div", { className: "tabbable" },
                            h("ul", { className: "nav nav-tabs" },
                                h("li", { className: "pull-right" },
                                    h("button", { className: "btn btn-sm btn-primary", onClick: () => site_1.app.back() },
                                        h("i", { className: "icon-reply" }),
                                        h("span", null, "\u8FD4\u56DE"))),
                                h("li", { className: "pull-right" },
                                    h("button", { className: "btn btn-sm btn-primary", ref: (o) => {
                                            if (!o)
                                                return;
                                            o.onclick = ui_1.buttonOnClick(() => this.save(), { toast: '保存优惠劵成功' });
                                        } },
                                        h("i", { className: "icon-save" }),
                                        h("span", null, "\u4FDD\u5B58"))))),
                        h("br", null),
                        h("div", { className: "row" },
                            h("div", { className: "col-sm-12" },
                                h("h5", { className: "blue" }, "\u57FA\u672C\u4FE1\u606F"))),
                        h("br", null),
                        h("div", { className: "row form-group" },
                            h("div", { className: "col-sm-4" },
                                h("label", { className: "item-label" }, "\u6807\u9898"),
                                h("div", { className: "item-input" },
                                    h("input", { name: "title", className: "form-control", ref: (e) => this.titleInput = e || this.titleInput, value: coupon.Title || '', onChange: (e) => {
                                            coupon.Title = e.target.value;
                                            this.setState(this.state);
                                        } }))),
                            h("div", { className: "col-sm-4" },
                                h("label", { className: "item-label" }, "\u62B5\u6263\u91D1\u989D"),
                                h("div", { className: "item-input" },
                                    h("input", { name: "discount", className: "form-control", ref: (e) => this.discountInput = e || this.discountInput, value: coupon.Discount == null ? "" : `${coupon.Discount}`, onChange: (e) => {
                                            coupon.Discount = Number.parseFloat(e.target.value);
                                            this.setState(this.state);
                                        } }))),
                            h("div", { className: "col-sm-4 form-group" },
                                h("label", { className: "item-label" }, "\u6D88\u8D39\u91D1\u989D"),
                                h("div", { className: "item-input" },
                                    h("input", { name: "amount", className: "form-control", ref: (e) => this.amountInput = e || this.amountInput, value: coupon.Amount == null ? "" : `${coupon.Amount}`, onChange: (e) => {
                                            var value = Number.parseFloat(e.target.value);
                                            coupon.Amount = isNaN(value) ? null : value;
                                            this.setState(this.state);
                                        } })))),
                        h("div", { className: "row form-group" },
                            h("div", { className: "col-sm-4" },
                                h("label", { className: "item-label" }, "\u6709\u6548\u65E5\u671F"),
                                h("div", { className: "item-input" },
                                    h("div", { className: "col-sm-6", style: { paddingLeft: 0, paddingRight: 0 } },
                                        h("input", { name: "validBegin", className: "form-control", placeholder: "优惠券使用的开始日期", ref: (o) => this.validBeginInput = o || this.validBeginInput, value: coupon.ValidBegin ? common_1.formatDate(coupon.ValidBegin) : "", onChange: (e) => {
                                                coupon.ValidBegin = new Date(e.target.value);
                                                this.setState(this.state);
                                            } })),
                                    h("div", { className: "col-sm-6", style: { paddingRight: 0 } },
                                        h("input", { name: "validEnd", className: "form-control", placeholder: "优惠券使用的结束日期", ref: (o) => this.validEndInput = o || this.validEndInput, value: coupon.ValidEnd ? common_1.formatDate(coupon.ValidEnd) : "", onChange: (e) => {
                                                coupon.ValidEnd = new Date(e.target.value);
                                                this.setState(this.state);
                                            } })))),
                            h("div", { className: "col-sm-8" },
                                h("label", { className: "item-label" }, "\u63CF\u8FF0\u5185\u5BB9"),
                                h("div", { className: "item-input" },
                                    h("input", { className: "form-control" })))),
                        h("hr", null),
                        h(activityEdit_1.PromotionRangeComponent, { page: page, rules: coupon.Ranges })));
                }
            }
            let couponEditPage;
            let coupon;
            if (page.data.id)
                coupon = yield shopping.coupon(page.data.id);
            ReactDOM.render(h(CouponEditPage, { coupon: coupon, ref: (e) => couponEditPage = e }), page.element);
            // function updatePageState(sender, args) {
            //     // if (page.data.id) {
            //     shopping.coupon(args.id).then(coupon => {
            //         couponEditPage.state.coupon = coupon;
            //         couponEditPage.setState(couponEditPage.state);
            //     });
            //     // }
            // }
            // updatePageState();
            // page.showing.add((sender, args) => updatePageState(sender, args));
        });
    }
    exports.default = default_1;
});
