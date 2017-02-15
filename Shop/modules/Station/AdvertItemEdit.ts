
import val = require('knockout.validation');
import app = require('Application');
import site = require('Site');

class PageModel {
    private validation: KnockoutValidationErrors;

    constructor() {
        this.validation = val.group(this.advertItem);
    }
    back() {
        //location.href = 'Index.html#Station/AdvertItemList';
        app.back({}).fail(function () {
            app.redirect('Station/AdvertItemList');
        });
    }
    advertItem = {
        id: ko.observable(),
        imgUrl: ko.observable().extend({ required: true }),
        linkUrl: ko.observable().extend({ required: true })
    }
    save(model: PageModel) {

        if (!(<any>model.advertItem).isValid()) {
            this.validation.showAllMessages();
            return;
        }

        $.ajax({
            url: site.config.siteUrl + 'AdvertItem/SaveAdvertItem',
            data: {
                id: model.advertItem.id(),
                imgUrl: model.advertItem.imgUrl(),
                linkUrl: model.advertItem.linkUrl()
            }
        }).done(function () {
            (<any>model).back({});
        });
    }
}


class AdvertItemEditPage extends chitu.Page {
    constructor(params) {
        super(params);

        //slet site = window['site'];
        let page = this;

        var model = new PageModel();

        ko.applyBindings(model, page.element);
        this.load.add(function (sender, args) {
            // if (!args.id) {
            //     model.advertItem.id('');
            //     model.advertItem.imgUrl('');
            //     model.advertItem.linkUrl('');
            //     validation.showAllMessages(false);
            //     return;
            // }

            $.ajax({
                url: site.config.siteUrl + 'AdvertItem/GetAdvertItem',
                data: { id: args.id }
            }).done(function (result) {
                model.advertItem.id(result.Id);
                model.advertItem.imgUrl(result.ImgUrl);
                model.advertItem.linkUrl(result.LinkUrl);
            });

            requirejs(['jquery.fileupload'], () => {
                (<any>$('#fileupload')).fileupload({
                    url: site.config.shopUrl + 'Common/UploadImage?dir=AD',
                    dataType: 'json'
                }).on('fileuploaddone', function (e, data) {
                    //$('#ImgUrl').val(Site.imageServerUrl + data.result.path);
                    model.advertItem.imgUrl(data.result.path);
                }).on('fileuploadfail', function (error) {
                    site.showInfo('上传图片失败');
                });
            });

        });

    }
}


export = AdvertItemEditPage;