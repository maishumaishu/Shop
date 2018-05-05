var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "myWuZhui", "ui", "admin/services/shopping", "dilu", "ui", "admin/services/service"], function (require, exports, wz, ui_1, shopping_1, dilu_1, ui, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        class CouponCodeListPage extends React.Component {
            constructor(props) {
                super(props);
                this.currentStatus = 'all';
                this.state = {};
                shopping.coupons().then(items => {
                    this.state.coupons = items;
                    this.setState(this.state);
                });
            }
            switchTab(status) {
                if (status == this.currentStatus)
                    return;
                switch (status) {
                    case 'all':
                        this.dataSource.selectArguments.filter = null;
                        break;
                    case 'used':
                        this.dataSource.selectArguments.filter = 'UsedDateTime <> null';
                        break;
                    case 'canUse':
                        this.dataSource.selectArguments.filter = `UsedDateTime == null and DateTime.Now.Date <= ValidEnd`;
                        break;
                    case 'expired':
                        this.dataSource.selectArguments.filter = `UsedDateTime == null and DateTime.Now.Date > ValidEnd`;
                        break;
                }
                this.currentStatus = status;
                this.dataSource.select();
            }
            status(couponCode) {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth();
                var yyyy = today.getFullYear();
                var currentDate = new Date(yyyy, mm, dd);
                var text;
                var status;
                if (couponCode.UsedDateTime) {
                    status = 'used';
                    text = '已使用';
                }
                else if (currentDate > couponCode.ValidEnd) {
                    status = 'expired';
                    text = '已过期';
                }
                else {
                    status = 'valid';
                    text = '可使用';
                }
                return { value: status, text };
            }
            showGenerateDialog() {
                this.validator.clearErrors();
                ui.showDialog(this.dialogElement);
            }
            generateCouponCode() {
                return __awaiter(this, void 0, void 0, function* () {
                    let isValid = yield this.validator.check();
                    if (isValid == false) {
                        return Promise.reject({});
                    }
                    let couponId = this.dialogElement['coupon'].value;
                    let count = Number.parseInt(this.dialogElement['count'].value);
                    return shopping.generateCouponCode(couponId, count).then(() => {
                        ui.hideDialog(this.dialogElement);
                        return this.dataSource.select();
                    });
                });
            }
            componentDidMount() {
                // this.validator = new FormValidator(this.dialogElement, {
                //     count: { rules: ['required'], display: '数量' },
                //     coupon: { rules: ['required'], messages: { required: '请选择优惠劵' } }//
                // });
                let { required } = dilu_1.rules;
                // let e = this.dialogElement;
                this.validator = new dilu_1.FormValidator(this.dialogElement, { name: "count", rules: [required('请输入数量')] }, { name: "coupon", rules: [required('请选择优惠劵')] });
                this.dataSource = new wuzhui.DataSource({
                    primaryKeys: ["Id"],
                    select: (args) => {
                        return shopping.couponCodes(args);
                    }
                });
                let self = this;
                let gridView = wz.createGridView({
                    element: this.couponCodesTable,
                    dataSource: this.dataSource,
                    columns: [
                        new wz.BoundField({ dataField: 'Title', headerText: '名称' }),
                        new wz.BoundField({ dataField: 'Code', headerText: '优惠码' }),
                        new wz.CustomField({
                            createItemCell(data) {
                                let cell = new wuzhui.GridViewCell();
                                cell.element.innerHTML = `${service_1.formatDate(data.ValidBegin)} - ${service_1.formatDate(data.ValidEnd)}`;
                                return cell;
                            },
                            headerText: '有效期',
                            headerStyle: { width: '200px' },
                            itemStyle: { textAlign: 'center' }
                        }),
                        new wz.BoundField({
                            dataField: 'UsedDateTime', headerText: '使用时间', dataFormatString: '{g}'
                        }),
                        new wz.CustomField({
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                let status = self.status(dataItem);
                                ReactDOM.render(h("button", { className: "btn btn-minier btn-info", disabled: status.value != 'valid' }, status.text), cell.element);
                                return cell;
                            },
                            headerText: '状态',
                            headerStyle: { textAlign: 'center', width: '100px' },
                            itemStyle: { textAlign: 'center' }
                        })
                    ]
                });
            }
            render() {
                let coupons = this.state.coupons || [];
                return (h("div", null,
                    h("div", { className: "tabbable" },
                        h("ul", { className: "nav nav-tabs" },
                            h("li", { className: "active" },
                                h("a", { "data-toggle": "tab", href: "#", onClick: () => this.switchTab('all') }, "\u5168\u90E8")),
                            h("li", null,
                                h("a", { "data-toggle": "tab", href: "#", onClick: () => this.switchTab('canUse') }, "\u53EF\u4F7F\u7528")),
                            h("li", null,
                                h("a", { "data-toggle": "tab", href: "#", onClick: () => this.switchTab('used') }, "\u5DF2\u4F7F\u7528")),
                            h("li", null,
                                h("a", { "data-toggle": "tab", href: "#", onClick: () => this.switchTab('expired') }, "\u5DF2\u8FC7\u671F")),
                            h("li", { className: "pull-right" },
                                h("button", { href: "/ExportExcel.aspx?type=couponCodes", className: "btn btn-sm btn-primary" },
                                    h("i", { className: "icon-download-alt" }),
                                    h("span", null, "\u5BFC\u51FA"))),
                            h("li", { className: "pull-right" },
                                h("button", { className: "btn btn-sm btn-primary", ref: (o) => {
                                        if (!o)
                                            return;
                                        o.onclick = () => this.showGenerateDialog();
                                    } },
                                    h("i", { className: "icon-cog" }),
                                    h("span", null, "\u751F\u6210\u4F18\u60E0\u7801"))),
                            h("li", { className: "pull-right" },
                                h("button", { id: "btnSearch", "data-bind": "click: search", className: "btn btn-sm btn-primary" },
                                    h("i", { className: "icon-search" }),
                                    h("span", null, "\u67E5\u627E"))),
                            h("li", { className: "pull-right" },
                                h("input", { "data-bind": "value: filter.searchText", id: "txtSearch", className: "nav-search-input form-control", type: "text", placeholder: "输入要查找的优惠码或优惠券编号", style: { width: 300 } })))),
                    h("table", { ref: (o) => this.couponCodesTable = o || this.couponCodesTable }),
                    h("form", { className: "modal fade in", ref: (o) => this.dialogElement = o || this.dialogElement },
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u751F\u6210\u4F18\u60E0\u7801")),
                                h("div", { className: "modal-body form-horizontal" },
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u4F18\u60E0\u52B5"),
                                        h("div", { className: "col-sm-10" },
                                            h("select", { name: "coupon", className: "form-control", ref: (e) => this.couponsSelect = e || this.couponsSelect },
                                                h("option", { value: "" }, "\u8BF7\u9009\u62E9\u4F18\u60E0\u52B5"),
                                                coupons.map(o => h("option", { key: o.Id, value: o.Id }, o.Title))))),
                                    h("div", { className: "form-group" },
                                        h("label", { className: "col-sm-2 control-label" }, "\u6570\u91CF"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "count", type: "text", className: "form-control", placeholder: "请输入生成优惠码的数量", ref: (e) => this.countInput = e || this.countInput })))),
                                h("div", { className: "modal-footer" },
                                    h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                    h("button", { type: "button", className: "btn btn-primary", ref: (o) => {
                                            if (!o)
                                                return;
                                            o.onclick = ui_1.buttonOnClick(() => this.generateCouponCode());
                                        } }, "\u786E\u8BA4")))))));
            }
        }
        ReactDOM.render(h(CouponCodeListPage, null), page.element);
    }
    exports.default = default_1;
});
// import val = require('jquery.validate');
// import site = require('admin/site');
// import bootbox = require('bootbox');
// import { default as shopping } from 'services/shopping'
// let JData = window['JData'];
// // let selectUrl = site.config.shopUrl + 'ShoppingData/Select?source=CouponCodes&selection=Code,Coupon.Title,UsedDateTime,Coupon.ValidEnd';
// let selectUrl = shopping.url('Coupon/GetCouponCodes');
// class PageModel {
//     private dataSource: any;
//     constructor(dataSource) {
//         this.dataSource = dataSource;
//     }
//     filter = {
//         searchText: ko.observable(),
//         status: ko.observable()
//     };
//     doSelect(filter) {
//         var url;
//         if (filter) {
//             url = selectUrl + '&filter=' + encodeURI(filter);
//         }
//         else {
//             url = selectUrl;
//         }
//         this.dataSource.set_selectUrl(url);
//         var args = new JData.DataSourceSelectArguments();
//         args.set_maximumRows(10);
//         this.dataSource.select(args);
//     }
//     search(model: PageModel) {
//         this.doSelect(model.filter.toString());
//     }
//     showAll(model: PageModel) {
//         model.filter.status(null);
//         model.doSelect(model.filter.toString());
//     }
//     showNotUsed(model: PageModel, event) {
//         model.filter.status('notUsed');
//         model.doSelect(model.filter.toString());
//     }
//     showUsed(model: PageModel) {
//         model.filter.status('used');
//         model.doSelect(model.filter.toString());
//     }
//     showExpired(model: PageModel) {
//         model.filter.status('expired');
//         model.doSelect(model.filter.toString());
//     }
//     generateCouponCode(model: PageModel) {
//         // var dlg_selector;
//         // if (dlg_selector == null) {
//         debugger;
//         var url = site.config.shopUrl + 'ShoppingData/Select?source=Coupons&selection=Title,Id';
//         $.ajax({
//             url: url
//         }).done(function (data) {
//             (<any>$('#dlgGenerator')).confirm({
//                 ok: function () {
//                     $.ajax({
//                         url: site.config.shopUrl + 'Coupon/GenerateCouponCode',
//                         data: { couponId: $('#CouponId').val(), count: $('#Count').val() }
//                     }).done(function () {
//                         bootbox.alert('生成优惠码成功');
//                     });
//                     return true;
//                 }
//             });
//         })
//         return;
//         //}
//         //dlg_selector.dialog('open');
//         //});
//     }
// }
// export default function (page: chitu.Page) {
//     requirejs([`text!${page.name}.html`], (html) => {
//         page.element.innerHTML = html;
//         page_load(page);
//     })
// }
// function page_load(page: chitu.Page) {
//     var CODE_COLUMN_INDEX = 2;
//     var USAGED_COLUMN_INDEX = 3;
//     //=================================================
//     // 优惠码表格
//     var dataSource = new JData.WebDataSource();
//     dataSource.set_selectUrl(selectUrl);
//     var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
//         dataSource: dataSource,
//         columns: [
//             { dataField: 'Id', visible: false },
//             { dataField: 'Title', headerText: '名称' },
//             { dataField: 'Code', headerText: '优惠码' },
//             { dataField: 'UsedDateTime', headerText: '使用时间', dataFormatString: '{0:g}' },
//             { dataField: 'Operator', headerText: '操作员' },
//             {
//                 dataField: 'UsedDateTime', headerText: '状态',
//                 displayValue: function (container, value) {
//                     var dataItem = $(container).parents('tr').first().data('dataItem');
//                     var validEnd = new Date();
//                     if (dataItem.ValidEnd) {
//                         // var arr = dataItem.ValidEnd.toFormattedString('d').substr(0, 10).split('-');
//                         validEnd = new Date(dataItem.ValidEnd);
//                     }
//                     var today = new Date();
//                     var dd = today.getDate();
//                     var mm = today.getMonth();
//                     var yyyy = today.getFullYear();
//                     var currentDate = new Date(yyyy, mm, dd);
//                     var text;
//                     var status;
//                     if (value) {
//                         status = 'used';
//                         text = '已使用';
//                     }
//                     else if (currentDate > validEnd) {
//                         status = 'expired';
//                         text = '已过期';
//                     }
//                     else {
//                         status = 'valid';
//                         text = '可使用';
//                     }
//                     var $btn = $('<button>').attr('class', 'btn btn-info btn-minier')
//                         .append('<i class="icon-pencil">')
//                         .append(`<span>${text}</span>`);
//                     if (status != 'valid')
//                         $btn.attr('disabled', 'disabled');
//                     $btn.appendTo(container);
//                     $btn.click(function () {
//                         var cells = $(container).parents('tr').first().prop('cells');
//                         $('#couponCode').html($(cells[CODE_COLUMN_INDEX]).text());
//                         (<any>$('#usageConfirm')).confirm({
//                             ok: function () {
//                                 $.ajax({
//                                     url: site.config.shopUrl + 'Coupon/UseCouponCode?code=' + $(cells[CODE_COLUMN_INDEX]).text(),
//                                     success: function () {
//                                         (<any>$('#usageConfirm')).dialog('close');
//                                         $btn.attr('disabled', 'disabled').find('span').html('已使用');
//                                         bootbox.alert('已成功使用优惠码"' + $(cells[CODE_COLUMN_INDEX]).text() + '"');
//                                     }
//                                 });
//                             }
//                         });
//                     });
//                 }
//             }
//         ],
//         allowPaging: true,
//         rowCreated: function (sender, args) {
//             if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
//                 return;
//         }
//     });
//     dataSource.select($gridView.data('JData.GridView').get_selectArguments());
//     //=================================================
//     (<any>$('#CouponId')).dropDownList({
//         dataSource: 'ShoppingData/Coupons',
//         displayField: 'Title'
//     });
//     requirejs(['jquery.validate'], function () {
//         let validator = (<any>$('#dlgGenerator')).validate({
//             rules: {
//                 CouponId: {
//                     required: true
//                 },
//                 Count: {
//                     required: true,
//                     min: 1,
//                     max: 1000
//                 }
//             }
//         });
//         (<any>$('#dlgGenerator')).confirm({
//             title: '创建优惠码',
//             title_html: true,
//             width: '400px',
//             autoOpen: false,
//             open: function () {
//                 $('#Count').focus();
//                 validator.resetForm();
//             }
//         });
//         //=================================================
//         // 使用优惠码窗口
//         var codeInputValidator = (<any>$('#codeInput')).validate({
//             rules: {
//                 CouponCode: { required: true }
//             }
//         });
//         (<any>$('#codeInput')).confirm({
//             title: '使用优惠码',
//             title_html: true,
//             width: '400px',
//             autoOpen: false,
//             open: function () {
//                 $('#CouponCode').focus();
//                 $('#CouponCode').val('');
//                 codeInputValidator.resetForm();
//             },
//             ok: function () {
//                 if (!(<any>$('#codeInput')).isValid())
//                     return;
//                 $('#couponCode').html($('#CouponCode').val());
//                 (<any>$('#usageConfirm')).confirm({
//                     ok: function () {
//                         (<any>$('#usageConfirm')).dialog('close');
//                         $.ajax({
//                             url: site.config.shopUrl + 'Coupon/UseCouponCode',
//                             data: { code: $('#CouponCode').val() }
//                         }).done(function (data) {
//                             (<any>$('#codeInput')).dialog('close');
//                             $gridView.find('td').each(function () {
//                                 if ($(this).text() == $('#CouponCode').val()) {
//                                     var cells = $(this).parents('tr').first().prop('cells');
//                                     var cell = cells[USAGED_COLUMN_INDEX];
//                                     $(cell).find('button').attr('disabled', 'disabled').find('span').html('已使用');
//                                 }
//                             });
//                             if (data.Type == 'ErrorObject' && data.Code != 'Success')
//                                 (<any>$).dialog.alert('失败', data.Message, function () { });
//                             else
//                                  (<any>$).dialog.alert('成功', '使用优惠码"' + $('#CouponCode').val() + '"成功');
//                         });
//                     }
//                 });
//             }
//         });
//     });
//     $('#useCouponCode').click(function () {
//         (<any>$('#codeInput')).dialog('open');
//     });
//     $('#btnSearch').click(function () {
//         var url;
//         var searchText = $('#txtSearch').val();
//         if (searchText) {
//             var filter;
//             if (searchText.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
//                 filter = `Coupon.Id = Guid"${searchText}"`; //$.validator.format('Coupon.Id = Guid"{0}"', searchText);
//             }
//             else {
//                 filter = `Code = "${searchText}"`;//$.validator.format('Code = "{0}"', searchText);
//             }
//             url = selectUrl + '&filter=' + encodeURI(filter);
//         }
//         else {
//             url = selectUrl;
//         }
//         dataSource.set_selectUrl(url);
//         var args = new JData.DataSourceSelectArguments();
//         args.set_maximumRows(10);
//         dataSource.select(args);
//     });
//     (function () {
//         //var filter;
//         var model = new PageModel(dataSource);
//         model.filter.toString = ko.computed(function () {
//             var value = '';
//             if (this.searchText()) {
//                 if (this.searchText().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
//                     value = `Coupon.Id = Guid"${this.searchText()}"`;//$.validator.format('Coupon.Id = Guid"{0}"', this.searchText());
//                 }
//                 else {
//                     value = `Code = "${this.searchText()}"`; //$.validator.format('Code = "{0}"', this.searchText());
//                 }
//             }
//             var status = this.status();
//             if (status && value)
//                 value = value + ' and ';
//             switch (status) {
//                 case 'used':
//                     value = value + 'UsedDateTime != null';
//                     break;
//                 case 'notUsed':
//                     value = value + 'UsedDateTime == null and DateTime.Now.Date <= Coupon.ValidEnd';
//                     break;
//                 case 'expired':
//                     value = value + 'UsedDateTime == null and DateTime.Now.Date > Coupon.ValidEnd';
//                     break;
//             }
//             return value;
//         }, model.filter);
//         ko.applyBindings(model, page.element);
//     })();
// } 
