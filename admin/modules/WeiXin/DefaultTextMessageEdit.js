chitu.action(function (page) {
    /// <param name="page" type="chitu.Page"/>

    //表单验证
    var rules = {
        KeyWord: {
            required: true
        },
        Title: {
            required: true
        },
        Content: {
            required: true
        }
    };
    var message = {
        KeyWord: {
            required: "请输入关键词"
        },
        Title: {
            required: "请输入标题"
        },
        Content: {
            required: "请输入内容"
        }
    };

    $("#formWXNewsMessage").validate({
        rules: rules,
        messages: message
    });
    //表单提交
    $('#formWXNewsMessage').submit(function (enent) {
        var validator = $(this).data('validator');
        Sys.Debug.assert(validator != null);
        if (validator.errorList.length > 0) {
            return;
        }
    });

});