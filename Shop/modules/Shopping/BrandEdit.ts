import site = require('Site');
import app = require('Application');
import UE = require('common/ue.ext');
//let UE = window['UE'];

class BrandEditPage extends chitu.Page {
    private editorField = ko.observable<string>();
    constructor(params) {
        super(params);
        this.load.add((s, a) => this.page_load(<BrandEditPage>s, a));
    }

    private page_load(page: BrandEditPage, args) {
        var ue_ready = $.Deferred();
        //requirejs(['common/ue.ext'], function () {
        //let UE = window['UE'];
        UE.createEditor('IntroduceEditor', this.editorField);
        // ue.ready(function () {
        //     ue.setHeight(300);
        //     ue_ready.resolve(ue);
        // });
        //});

        requirejs(['jquery.fileupload'], () => {
            (<any>$(page.element).find('[name="ImageUpload"]')).fileupload({
                url: site.config.shopUrl + 'Common/UploadImage?dir=Shopping',
                dataType: 'json'
            }).on('fileuploaddone', function (e, data) {
                $(page.element).find('[name="Image"]').val(data.result.path);
            }).on('fileuploadfail', function (error) {
                site.showInfo('上传图片失败');
            });
        });


        page.load.add((sender, args) => {
            // let deferred: JQueryPromise<any> = $.Deferred();
            // if (!args.id) {
            //     (<JQueryDeferred<any>>deferred).resolve({});
            // }
            // else {
            //     deferred = $.ajax({
            //         url: site.config.shopUrl + 'ShoppingData/select?source=Brands',
            //         data: {
            //             selection: 'Id, Name, Remark, Image, Introduce',
            //             filter: 'Id=Guid"' + args.id + '"'
            //         }
            //     }).then(function (result) {
            //         return result.DataItems[0];
            //     });
            // }

            // $.when(ue_ready, deferred).done((ue, obj) => {
            //     $(page.element).find('form').find(':input').each(function () {
            //         var name = $(this).attr('name');
            //         $(this).val(obj[name]);
            //     });

            //     ue.setContent(obj['Introduce'] || '');
            // })
            if (!args.id)
                return;
       
            return $.ajax({
                url: site.config.shopUrl + 'ShoppingData/select?source=Brands',
                data: {
                    selection: 'Id, Name, Remark, Image, Introduce',
                    filter: 'Id=Guid"' + args.id + '"'
                }
            }).done((data) => {
                let obj = data.DataItems[0];
                $(page.element).find('form').find(':input').each(function () {
                    var name = $(this).attr('name');
                    $(this).val(obj[name]);
                });
                this.editorField(obj['Introduce'] || '');
            })
        });




        var model = {
            back: function () {
                app.back().fail(function () {
                    app.redirect('#Shopping/BrandList');
                });
            },
            saveBrand: function () {
                var id = $(page.element).find('[name="Id"]').val();
                $.ajax({
                    url: site.config.shopUrl + 'ShoppingData/' + (id ? 'Update' : 'Insert') + '?source=Brands',
                    data: $(page.element).find('form').serialize(),
                    method: 'post'
                })
                    .done(function () {
                        //model.back();
                    });
            }
        };

        ko.applyBindings(model, page.element);
    }
}

export = BrandEditPage;