/// <reference path="../jquery.validate.js" />

$.validator.addMethod("ValiMusicUrl", function (value, element) {
    //if ($("#MusicURL").val().length > 0)
    //    return true;

    if ($('#LocalMusicUrl').attr('data-url').length > 0 || $('#LocalMusicUrl').val().length > 0)
        return true;

    return false;
}, "");



$(function () {
    //表单验证
    var rules = {
        KeyWord: { required: true },
        Title: { required: true },
        Description: { required: true },
        LocalMusicUrl: { url: true },
        MusicURL: { url: true },
        HQMusicUrl: {}
    };//url: true 
    var message = {
        KeyWord: { required: "请输入关键词" },
        Title: { required: "请输入标题" },
        Description: { required: "请输入内容" },
        LocalMusicUrl: { url: "请输入网上音乐链接或上传本地音乐" },
        MusicURL: { url: "请输入网上音乐链接或上传本地音乐" },//url: "地址格式不正确"
        HQMusicUrl: {}  //url: "地址格式不正确"

    };

    var $form = $("#formWXNewsMessage");
    var validator = $form.validate({
        rules: rules,
        messages: message
    });

    var model = {
        SaveMusicMessage: function () {
            if (!$form.valid())
                return;

            Site.ajax({ url: '/AjaxWeiXin/SaveMusicMessage', data: $form.serialize(), method: 'post' })
             .done(function (data) {
                 debugger;
                 location.href = '/App/Index.html#WeiXin/MusicMessageList';
             });
        }
    };
    ko.applyBindings(model);

    //上传音乐===================================================================================
    $('#musicUpload, #hqMusicUpload').fileupload({
        url: Site.fileServerUrl + '/Common/UploadMusic?dir=WeiXin',
        dataType: 'json'
    }).on('fileuploaddone', function (e, data) {
        $('#MusicURL').val(Site.fileServerUrl + data.result.path);
    }).on('fileuploadfail', function (error) {
        Site.showInfo('上传音乐失败');
    });

    var ue = UE.getEditor('DescriptionEditor');
    ue.ready(function () {
        ue.setHeight(150);
    });
})



