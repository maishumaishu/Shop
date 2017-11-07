import site from 'site';
import weixin from 'adminServices/weixin';
import validation = require('knockout.validation');

let JData = window['JData'];



function page_load(page: chitu.Page, args) {
    var dataSource = new JData.WebDataSource(site.config.weixinUrl + 'WeiXin/GetMessageTemplates',
        site.config.weixinUrl + 'WeiXin/AddMessageTemplate', null,
        site.config.weixinUrl + 'WeiXin/DeleteMessageTemplate');
    dataSource.set_method('post');
    var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
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
            (<any>$dlg).modal();
            val.showAllMessages(false);
        },
        confirm: function () {
            if (!(<any>model.messageTemplate).isValid())
                return val.showAllMessages();

            var data = ko.mapping.toJS(model.messageTemplate);
            return dataSource.insert(data).done(function () {
                (<any>$dlg).modal('hide');
            });
        }
    };

    var val = validation.group(model.messageTemplate);
    return weixin.getMessageTemplateTypes().then(function (data) {
        /// <param name="data" type="Array"/>
        data.unshift({ Key: '', Value: '请选择类型' });
        model.types(data);
        ko.applyBindings(model, page.element);
    });
}


export default function (page: chitu.Page) {
    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load(page, page.routeData.values);
    })
}
