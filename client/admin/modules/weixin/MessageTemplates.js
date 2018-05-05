define(["require", "exports", "site", "admin/services/weixin", "knockout.validation"], function (require, exports, site_1, weixin_1, validation) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let JData = window['JData'];
    function page_load(page, args) {
        var dataSource = new JData.WebDataSource(site_1.default.config.weixinUrl + 'WeiXin/GetMessageTemplates', site_1.default.config.weixinUrl + 'WeiXin/AddMessageTemplate', null, site_1.default.config.weixinUrl + 'WeiXin/DeleteMessageTemplate');
        dataSource.set_method('post');
        var $gridView = $('<table>').appendTo(page.element).gridView({
            dataSource: dataSource,
            columns: [
                { dataField: 'TypeText', headerText: '类型' },
                { dataField: 'TemplateId', headerText: '模版ID' },
                { type: JData.CommandField, showDeleteButton: true }
            ],
            allowPaging: true
        });
        var gridView = $gridView.data('JData.GridView');
        var sel_args = gridView.get_selectArguments();
        // page.load.add(function () {
        gridView.get_dataSource().select(sel_args);
        // });
        var $dlg = $(page.element).find('[name="dlg_msgTemplate"]');
        var model = {
            messageTemplate: {
                Type: ko.observable().extend({ required: true }),
                TemplateId: ko.observable().extend({ required: true })
            },
            types: ko.observableArray(),
            add: function () {
                $dlg.modal();
                val.showAllMessages(false);
            },
            confirm: function () {
                if (!model.messageTemplate.isValid())
                    return val.showAllMessages();
                var data = ko.mapping.toJS(model.messageTemplate);
                return dataSource.insert(data).done(function () {
                    $dlg.modal('hide');
                });
            }
        };
        var val = validation.group(model.messageTemplate);
        return weixin_1.default.getMessageTemplateTypes().then(function (data) {
            /// <param name="data" type="Array"/>
            data.unshift({ Key: '', Value: '请选择类型' });
            model.types(data);
            ko.applyBindings(model, page.element);
        });
    }
    function default_1(page) {
        requirejs([`text!${page.data.actionPath}.html`], (html) => {
            page.element.innerHTML = html;
            page_load(page, page.data.values);
        });
    }
    exports.default = default_1;
});
