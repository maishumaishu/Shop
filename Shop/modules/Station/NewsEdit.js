chitu.action(['com/ue.ext', 'jquery.validate'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    $(page.node()).find('[name=NewsCategoryId]').dropDownList({
        dataSource: 'MicroStationData/NewsCategories',
        serviceUrl: site.config.siteUrl
    })

    var ue_ready = $.Deferred();
    var ue = UE.getEditor('ContentEditor');
    ue.ready(function () {
        ue.setHeight(300);
        ue_ready.resolve();
    });

    //表单验证
    var rules = {
        NewsCategoryId: {
            required: true
        },
        Title: {
            required: true
        },
        PublishDateTime: {
            required: true,
            date: true
        },
        CreateDateTime: {
            required: true,
            date: true
        },
        Author: {
            required: true
        }
    };
    var message = {
        NewsCategoryId: { required: "请填写类别！" },
        Title: { required: "请填写新闻标题！" },
        PublishDateTime: {
            required: "请选择发布时间！",
            date: "请输入正确的时间格式！"
        },
        CreateDateTime: {
            required: "请选择添加时间！",
            date: "请输入正确的时间格式！"
        },
        Author: {
            required: "请填写作者姓名！"
        }
    };


    var model = {
        back: function () {
            app.back({}).fail(function () {
                app.redirect('Station/NewsList');
            });
        },
        saveNews: function () {
            var url;
            if (!$(page.node()).find('[name="Id"]').val())
                url = site.config.siteUrl + 'MicroStationData/Insert?source=News';
            else
                url = site.config.siteUrl + 'MicroStationData/Update?source=News';

            $('#Content').val($("#contentEditor").html());
            $.ajax({
                type: 'POST',
                url: url,
                data: $(page.node()).find('form').serialize(),
                success: function (error) {
                    model.back();
                }
            });
        }
    };
    ko.applyBindings(model, page.node());

    page.load.add(function (sender, args) {

        var deferred = $.Deferred();
        if (!args.id) {
            deferred.resolve({
                NewsCategoryId: 'd5a61042-5d74-48fa-8d93-8916624bc7ce'
            });
        }
        else {
            deferred = $.ajax({
                url: site.config.siteUrl + 'MicroStationData/Select',
                data: {
                    selection: 'Id, Title, Content, NewsCategoryId',
                    source: 'News',
                    filter: 'Id=Guid"' + args.id + '"'
                }
            })
            .then(function (result) {
                var obj = result.DataItems[0];
                return obj;
            });
        }

        ue_ready.pipe(function () {
            return deferred;
        })
        .done(function (obj) {
            $(page.node()).find('form').find(':input').each(function () {
                var name = $(this).attr('name');
                $(this).val(obj[name]);
            });

            $(page.node()).find('[name="NewsCategoryId"]').filter(function () {
                return $(this).text().toLowerCase() == (obj['NewsCategoryId'] || '').toLowerCase();
            })
            .prop('selected', true);

            ue.setContent(obj['Content'] || '');
        });
    });
});