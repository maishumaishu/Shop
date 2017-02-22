import app = require('Application');
import site = require('Site');
import shoppingService = require('services/Shopping');
import UE = require('common/ue.ext');

let JData = window['JData'];

export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    })
}

function page_load(page: chitu.Page, args: any) {
    var ue_ready = $.Deferred();

    //var ue: any;
    // requirejs(['com/ue.ext'], function (UE) {
    //     ue = UE.getEditor('couponCodeEditor');
    //     ue.ready(function () {
    //         ue.setHeight(120);
    //         ue_ready.resolve();
    //     });
    // })


    var model = {
        coupon: {
            Id: ko.observable(),
            Title: ko.observable().extend({ required: true }),
            Discount: ko.observable().extend({ required: true }),
            Amount: ko.observable().extend({ required: true }),
            ReceiveBegin: ko.observable().extend({ required: true }),
            ReceiveEnd: ko.observable().extend({ required: true }),
            ValidBegin: ko.observable().extend({ required: true }),
            ValidEnd: ko.observable().extend({ required: true }),
            Picture: ko.observable(),
            Remark: ko.observable<string>(),
            BrandNames: ko.observable(),
            CategoryNames: ko.observable(),
            ProductNames: ko.observable()
        },
        back: function () {
            app.back({}).catch(function () {
                app.redirect('Coupon/CouponList');
            })
        },
        save: function () {
            //model.coupon.Remark(ue.getContent());
            var result = $.Deferred();
            var dataItem = ko.mapping.toJS(model.coupon);
            debugger;
            shoppingService.couponDataSource.set_method('post');
            if (model.coupon.Id()) {
                result = shoppingService.couponDataSource.update(dataItem);
            }
            else {
                result = shoppingService.couponDataSource.insert(dataItem);
            }
            return result.done(function () {
                model.back();
            });
        }
    };

    ko.applyBindings(model, page.element);

    UE.createEditor('couponCodeEditor', model.coupon.Remark);

    (<any>$('[name="ReceiveBegin"],[name="ReceiveEnd"],[name="ValidBegin"],[name="ValidEnd"]')).datepicker({
        dateFormat: 'yy-mm-dd',
        beforeShow: function (inputElem, inst) {
            setTimeout(function () {
                $('#ui-datepicker-div').css("z-index", 10000);
            }, 100);
        }
    });

    //page.load.add(function (sender, args) {
    if (args.id) {
        var sel_args = new JData.DataSourceSelectArguments();
        sel_args.set_filter('Id=Guid"' + args.id + '"');
        $.when(shoppingService.couponDataSource.select(sel_args).then(function (coupons) {
            return coupons[0];
        }), ue_ready)
            .done(function (coupon: any) {
                coupon.ValidBegin = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ValidBegin);
                coupon.ValidEnd = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ValidEnd);
                coupon.ReceiveBegin = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ReceiveBegin);
                coupon.ReceiveEnd = (<any>$).datepicker.formatDate('yy-mm-dd', coupon.ReceiveEnd);

                ko.mapping.fromJS(coupon, {}, model.coupon);

                // ue.setContent(model.coupon.Remark() || '');
            })
    }
    //})

    requirejs(['jquery.fileupload'], function () {
        (<any>$(page.element).find('[name="ImageUpload"]')).fileupload({
            url: site.config.shopUrl + 'Common/UploadImage?dir=Coupon',
            dataType: 'json'
        }).on('fileuploaddone', function (e, data) {
            var path = data.result.path || '';
            if (path.substr(0, 1) == '/') {
                path = path.substr(1);
            }
            model.coupon.Picture(site.config.shopUrl + data.result.path);
        }).on('fileuploadfail', function (error) {
            site.showInfo('上传图片失败');
        });
    })

}