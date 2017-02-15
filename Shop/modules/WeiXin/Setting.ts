// chitu.action(['sv/WeiXin', 'bootbox'], function (page) {
//     /// <param name="page" type="chitu.Page"/>


// })

import weixin = require('services/WeiXin');
import bootbox = require('bootbox');

class SettingPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add(this.page_load);
    }

    private page_load(page: SettingPage, args) {

        function SaveSetting() {
            //service.weixin.getSetting
            var obj = {};
            $($(page.element).find('form').serializeArray()).each(function () {
                obj[this.name] = this.value;
            });
            weixin.saveSetting(obj).done(function () {
                bootbox.alert('修改成功');
            });
        };

        weixin.getSetting().done(function (data) {
            data.SaveSetting = SaveSetting;
            ko.applyBindings(data, page.element);
        });
    }
}

export = SettingPage;