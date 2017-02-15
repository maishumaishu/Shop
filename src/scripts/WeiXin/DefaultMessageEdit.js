


(function () {
    var BuyPageModel = function (WXMessages) {
        var self = this;
        //this.Products = ko.observableArray(products);
        $(WXMessages).each(function (i, item) {
            $(item).extend(this, {
                ParamLinkUrl: (self[item.EDefaultType + item.EMessType].ParamLinkUrl + '&&ID=' + item.Id),
                EditMessage: function () {
                    location.href = (self[item.EDefaultType + item.EMessType].ParamLinkUrl + '&&ID=' + item.Id);
                },
                ParamImgUrl: function () {
                    if (item.PicUrl == null)
                        return item.LocalUrl;
                    return item.PicUrl;
                },
                ParamIsEnalbed: ko.observable((item.IsEnalbed == 0 ? false : true)),
                _changeEnabled: function () {
                    $.ajax({
                        url: '/AjaxWeiXin/ChangeDefaultEnabled?t=' + Math.random(),
                        type: 'post',
                        data: { ID: item.Id, edefaultType: item.EDefaultType },
                        success: function (data) {
                            $(WXMessages).each(function (j, itemEntity) {
                                if (itemEntity.EDefaultType == item.EDefaultType)
                                    itemEntity.ParamIsEnalbed(false);
                            });
                            item.ParamIsEnalbed(data);

                            Site.showInfo("修改状态成功!");
                            //location.href = "/WeiXin/DefaultMessageEdit";
                        }
                    })
                }
            })
            self[item.EDefaultType + item.EMessType] = item;
        });
    };




    //初始化信息
    BuyPageModel.prototype = {
        AttentionMessageText: {
            Content: '您尚未编辑文本回复信息',
            ParamLinkUrl: '/WeiXin/DefaultTextMessageEdit?edefaultType=AttentionMessage',
            EditMessage: function () { location.href = '/WeiXin/DefaultTextMessageEdit?edefaultType=AttentionMessage' },
            _changeEnabled: function () { Site.showInfo("请先编辑信息") }
        },
        AttentionMessageNews: {
            Title: '图文消息标题',
            SubDescription: '图文回复内容简介',
            ParamImgUrl: function () { return "/Images/WeiXin/nopic.gif" },
            ParamLinkUrl: '/WeiXin/DefaultNewsMessageEdit?edefaultType=AttentionMessage',
            EditMessage: function () { location.href = '/WeiXin/DefaultNewsMessageEdit?edefaultType=AttentionMessage' },
            _changeEnabled: function () { Site.showInfo("请先编辑信息") }
        },
        AttentionMessageMusic: {
            Title: '音乐消息标题',
            Description: '音乐消息回复描述',
            ParamLinkUrl: '/WeiXin/DefaultMusicMessageEdit?edefaultType=AttentionMessage',
            ParamImgUrl: function () { return "" },
            EditMessage: function () { location.href = '/WeiXin/DefaultMusicMessageEdit?edefaultType=AttentionMessage' },
            _changeEnabled: function () { Site.showInfo("请先编辑信息") }
        },
        UnmatchMessageText: {
            Content: '您尚未编辑文本回复信息',
            ParamLinkUrl: '/WeiXin/DefaultTextMessageEdit?edefaultType=UnmatchMessage',
            EditMessage: function () { location.href = '/WeiXin/DefaultTextMessageEdit?edefaultType=UnmatchMessage' },
            _changeEnabled: function () { Site.showInfo("请先编辑信息") }
        },
        UnmatchMessageNews: {
            Title: '图文消息标题',
            SubDescription: '图文回复内容简介',
            ParamLinkUrl: '/WeiXin/DefaultNewsMessageEdit?edefaultType=UnmatchMessage',
            ParamImgUrl:function(){return "/Images/WeiXin/nopic.gif"},
            EditMessage: function () { location.href = '/WeiXin/DefaultNewsMessageEdit?edefaultType=UnmatchMessage' },
            _changeEnabled: function () { Site.showInfo("请先编辑信息") }
        },
        UnmatchMessageMusic: {
            Title: '音乐消息标题',
            Description: '音乐消息回复描述',
            ParamLinkUrl: '/WeiXin/DefaultMusicMessageEdit?edefaultType=UnmatchMessage',
            EditMessage: function () { location.href = '/WeiXin/DefaultMusicMessageEdit?edefaultType=UnmatchMessage' },
            _changeEnabled: function () { Site.showInfo("请先编辑信息") }
        }
    }


    $.getJSON("/AjaxWeiXin/GetDefaultMessage", null, function (data) {
        $(function () {
            var model = new BuyPageModel(data);
            ko.applyBindings(model);
            //ko.applyBindings(new CouponModel(data), document.getElementById('CouponView'));
        })
    });
})();




