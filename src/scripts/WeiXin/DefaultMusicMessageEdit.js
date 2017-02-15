/// <reference path="../jquery.validate.js" />

$.validator.addMethod("ValiMusicUrl", function (value, element) {
    if ($("#MusicURL").val().length > 0)
        return true;

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
        LocalMusicUrl: { ValiMusicUrl: true },
        MusicURL: { ValiMusicUrl: true },
        HQMusicUrl: {}
    };//url: true 
    var message = {
        KeyWord: { required: "请输入关键词" },
        Title: { required: "请输入标题" },
        Description: { required: "请输入内容" },
        LocalMusicUrl: { ValiMusicUrl: "请输入网上音乐链接或上传本地音乐" },
        MusicURL: { ValiMusicUrl: "请输入网上音乐链接或上传本地音乐" },//url: "地址格式不正确"
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

            $.ajax({ url: '/AjaxWeiXin/SaveDefaultMusicMessage', data: $form.serialize(), method: 'post' })
             .done(function () {
                 location.href = '/WeiXin/DefaultMessageEdit';
             });
        }
    };
    ko.applyBindings(model);
  
    //上传音乐===================================================================================
    $('#LocalMusicUrl').ace_file_input({
        style: 'well'
    });
    var d = $('#LocalMusicUrl').data('ace_file_input');
    var url = $('#LocalMusicUrl').attr('data-url');
    if (url != '' && url != null) {
        d.show_file_list([url]);
    }
    //======================================================================================
})



