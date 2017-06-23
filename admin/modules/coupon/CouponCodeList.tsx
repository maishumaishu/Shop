import * as ui from 'myWuZhui';
import { buttonOnClick } from 'ui';
import { default as shopping, CouponCode, Coupon } from 'services/Shopping';
import FormValidator from 'formValidator';

export default function (page: chitu.Page) {
    page.element.className = 'admin-pc';
    type Status = 'all' | 'used' | 'canUse' | 'expired';
    interface PageState {
        coupons: Array<Coupon>
    }
    class CouponCodeListPage extends React.Component<{}, PageState>{
        private couponCodesTable: HTMLTableElement;
        private currentStatus: Status = 'all';
        private dataSource: wuzhui.WebDataSource<CouponCode>;
        private dialogElement: HTMLElement;
        private validator: FormValidator;

        constructor(props) {
            super(props);
            this.state = {} as PageState;
            shopping.coupons().then(items => {
                this.state.coupons = items;
                this.setState(this.state);
            });
        }
        switchTab(status: Status) {
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
        status(couponCode: CouponCode) {

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
            $(this.dialogElement).modal();
        }
        generateCouponCode(): Promise<any> {
            if (!this.validator.validateForm()) {
                return Promise.reject({});
            }
            let couponId = (this.dialogElement['coupon'] as HTMLSelectElement).value;
            let count = Number.parseInt((this.dialogElement['count'] as HTMLInputElement).value);
            return shopping.generateCouponCode(couponId, count).then(() => {
                $(this.dialogElement).modal('hide');
                return this.dataSource.select();
            });
        }
        componentDidMount() {
            this.validator = new FormValidator(this.dialogElement, {
                count: { rules: ['required'], display: '数量' },
                coupon: { rules: ['required'], messages: { required: '请选择优惠劵' } }//
            });

            this.dataSource = new wuzhui.WebDataSource({
                primaryKeys: ["Id"],
                select: (args) => {
                    return shopping.couponCodes(args);
                }
            })
            let self = this;
            let gridView = ui.createGridView({
                element: this.couponCodesTable,
                dataSource: this.dataSource,
                columns: [
                    new ui.BoundField({ dataField: 'Title', headerText: '标题' }),
                    new ui.BoundField({ dataField: 'Code', headerText: '优惠码' }),
                    new ui.BoundField({ dataField: 'UsedDateTime', headerText: '使用时间', dataFormatString: '{0:g}' }),
                    new ui.CustomField({
                        createItemCell(dataItem: CouponCode) {
                            let cell = new wuzhui.GridViewCell();
                            let status = self.status(dataItem);
                            ReactDOM.render(
                                <button className="btn btn-minier btn-info" disabled={status.value != 'valid'}>{status.text}</button >, cell.element);
                            return cell;
                        },
                        headerText: '状态',
                        headerStyle: { textAlign: 'center', width: '100px' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    })
                ]
            })
        }
        render() {
            let coupons = this.state.coupons || [];
            return (
                <div>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a data-toggle="tab" href="#" onClick={() => this.switchTab('all')}>全部</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#" onClick={() => this.switchTab('canUse')}>可使用</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#" onClick={() => this.switchTab('used')}>已使用</a>
                            </li>
                            <li>
                                <a data-toggle="tab" href="#" onClick={() => this.switchTab('expired')}>已过期</a>
                            </li>
                            <li className="pull-right">
                                <a href="/ExportExcel.aspx?type=couponCodes" className="btn btn-sm btn-primary">导出</a>
                            </li>
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary"
                                    ref={(o: HTMLButtonElement) => {
                                        if (!o) return;
                                        o.onclick = () => this.showGenerateDialog();

                                    }}>生成优惠码</button>
                            </li>

                            <li className="pull-right">
                                <a id="btnSearch" data-bind="click: search" className="btn btn-sm btn-primary">查找</a>
                            </li>
                            <li className="pull-right">
                                <input data-bind="value: filter.searchText" id="txtSearch" className="nav-search-input form-control" type="text" placeholder="输入要查找的优惠码或优惠券编号" style={{ width: 300 }} />
                            </li>
                        </ul>
                    </div>
                    <table ref={(o: HTMLTableElement) => this.couponCodesTable = o || this.couponCodesTable}></table>
                    <form className="modal fade in" ref={(o: HTMLElement) => this.dialogElement = o || this.dialogElement}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">生产优惠码</h4>
                                </div>
                                <div className="modal-body form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">
                                            优惠劵
                                        </label>
                                        <div className="col-sm-10">
                                            <select name="coupon" className="form-control">
                                                <option value="">请选择优惠劵</option>
                                                {coupons.map(o =>
                                                    <option key={o.Id} value={o.Id}>
                                                        {o.Title}
                                                    </option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2 control-label">
                                            数量
                                        </label>
                                        <div className="col-sm-10">
                                            <input name="count" type="text" className="form-control" placeholder="请输入生成优惠码的数量" />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                    <button type="button" className="btn btn-primary"
                                        ref={(o: HTMLButtonElement) => {
                                            if (!o) return;
                                            o.onclick = buttonOnClick(() => this.generateCouponCode());
                                        }}>确认</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
    }

    ReactDOM.render(<CouponCodeListPage />, page.element);

}

// import val = require('jquery.validate');
// import site = require('Site');
// import bootbox = require('bootbox');
// import { default as shopping } from 'services/Shopping'
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
//     requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
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