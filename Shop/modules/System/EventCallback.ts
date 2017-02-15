
import site = require('Site');
import system = require('services/System');
import validation = require('knockout.validation');

let JData = window['JData'];

class EventCallbackPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add(this.page_load);
    }

    private page_load(page: EventCallbackPage, args) {
        var dataSource = new JData.WebDataSource(site.config.shopUrl + 'System/GetNotifyUrls',
            site.config.shopUrl + 'System/AddNotifyUrl', null,
            site.config.shopUrl + 'System/DeleteNotifyUrl');
        var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: dataSource,
            columns: [
                { dataField: 'NotifyTypeText', headerText: '类型' },
                { dataField: 'Url', headerText: '链接' },
                { type: JData.CommandField, showDeleteButton: true }
            ],
            allowPaging: false
        });

        var gridView = $gridView.data('JData.GridView');
        var sel_args = gridView.get_selectArguments();
        page.load.add(function () {
            gridView.get_dataSource().select(sel_args);
        });

        var model = {
            notifyUrl: {
                NotifyType: ko.observable().extend({ required: true }),
                Url: ko.observable().extend({ required: true })
            },
            types: ko.observable(),
            add: function () {
                (<any>$(page.element).find('[name="dlg_notifyUrl"]')).modal();
                val.showAllMessages(false);
            },
            confirm: function () {
                if (!(<any>model.notifyUrl).isValid())
                    return val.showAllMessages();

                //return services.system.addNotifyUrl(model.notifyUrl.NotifyType(), model.notifyUrl.Url()).done(function () {
                //    $(page.node()).find('[name="dlg_notifyUrl"]').modal('hide');
                //});
                return dataSource.insert(ko.mapping.toJS(model.notifyUrl)).done(function () {
                    (<any>$(page.element).find('[name="dlg_notifyUrl"]')).modal('hide');
                });
            }
        }

        var val = validation.group(model.notifyUrl);

        return system.getNotifyTypes().done(function (data) {
            data.unshift({ Key: '', Value: '请选择类型' })
            model.types(data);
            ko.applyBindings(model, page.element);
        });
    }
}


export = EventCallbackPage;