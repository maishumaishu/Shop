// chitu.action(['sv/WeiXin', 'bootbox'], function (page) {
//     /// <param name="page" type="chitu.Page"/>


// })

import weixin from 'adminServices/weixin';
// import bootbox = require('bootbox');
import * as ui from 'ui';

function page_load(page: chitu.Page, args) {

    function SaveSetting() {
        //service.weixin.getSetting
        var obj = {};
        $($(page.element).find('form').serializeArray()).each(function () {
            obj[this.name] = this.value;
        });
        weixin.saveSetting(obj).done(function () {
            // bootbox.alert('修改成功');
            ui.alert('修改成功')
        });
    };

    weixin.getSetting().done(function (data) {
        data.SaveSetting = SaveSetting;
        ko.applyBindings(data, page.element);
    });
}

export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    })
}
