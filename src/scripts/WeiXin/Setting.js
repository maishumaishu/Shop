$(function () {
    //表单验证
    var rules = {
        AppId: { required: true },
        AppSecret: { required: true }
    };
    var message = {
        AppId: { required: "请输入AppId" },
        AppSecret: { required: "请输入AppSecret" }
    };

    var $form = $("#formWXNewsMessage");
    var validator = $form.validate({
        rules: rules,
        messages: message
    });

    var model = {
        SaveSetting: function () {
            if (!$form.valid()) {
                return;
            }

            $.ajax({ url: '/AjaxWeiXin/SaveSetting', data: $form.serialize(), method: 'post' })
                .done(function () {
                    Site.showInfo('保存成功');
                })
                .fail(function (data) {
                    alert(data);
                });
        }
    }
    ko.applyBindings(model);
})



