define(["require", "exports", "knockout.validation", "application", "site"], function (require, exports, val, application_1, site_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PageModel {
        constructor() {
            this.advertItem = {
                id: ko.observable(),
                imgUrl: ko.observable().extend({ required: true }),
                linkUrl: ko.observable().extend({ required: true })
            };
            this.validation = val.group(this.advertItem);
        }
        back() {
            //location.href = 'Index.html#Station/AdvertItemList';
            application_1.default.back();
            // .catch(function () {
            //     app.redirect('Station/AdvertItemList');
            // });
        }
        save(model) {
            if (!model.advertItem.isValid()) {
                this.validation.showAllMessages();
                return;
            }
            $.ajax({
                url: site_1.default.config.siteUrl + 'AdvertItem/SaveAdvertItem',
                data: {
                    id: model.advertItem.id(),
                    imgUrl: model.advertItem.imgUrl(),
                    linkUrl: model.advertItem.linkUrl()
                }
            }).done(function () {
                model.back({});
            });
        }
    }
    //class AdvertItemEditPage extends chitu.Page {
    function default_1(page) {
        //      super(params);
        //slet site = window['site'];
        requirejs([`text!${page.name}.html`], (html) => {
            page.element.innerHTML = html;
            page_load(page, page.data);
        });
        // this.load.add();
    }
    exports.default = default_1;
    function page_load(sender, args) {
        // function () {
        // if (!args.id) {
        //     model.advertItem.id('');
        //     model.advertItem.imgUrl('');
        //     model.advertItem.linkUrl('');
        //     validation.showAllMessages(false);
        //     return;
        // }
        var model = new PageModel();
        ko.applyBindings(model, sender.element);
        $.ajax({
            url: site_1.default.config.siteUrl + 'AdvertItem/GetAdvertItem',
            data: { id: args.id }
        }).done(function (result) {
            model.advertItem.id(result.Id);
            model.advertItem.imgUrl(result.ImgUrl);
            model.advertItem.linkUrl(result.LinkUrl);
        });
        requirejs(['jquery.fileupload'], () => {
            $('#fileupload').fileupload({
                url: site_1.default.config.shopUrl + 'Common/UploadImage?dir=AD',
                dataType: 'json'
            }).on('fileuploaddone', function (e, data) {
                //$('#ImgUrl').val(Site.imageServerUrl + data.result.path);
                model.advertItem.imgUrl(data.result.path);
            }).on('fileuploadfail', function (error) {
                ui.alert('上传图片失败');
            });
        });
        // }
    }
});
//}
//export = AdvertItemEditPage; 
