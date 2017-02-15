
import activity = require('services/Activity');
import site = require('Site');
import validation = require('knockout.validation');

let JData = window['JData'];

class ActivitiesPage extends chitu.Page {
    constructor(params) {
        super(params);


        this.load.add(this.page_load);

    }

    private page_load(page: ActivitiesPage, args) {
        var dataSource = activity.activities;
        var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: dataSource,
            columns: [
                { dataField: 'BeginDate', headerText: '开始日期', dataFormatString: '{0:d}' },
                { dataField: 'EndDate', headerText: '结束日期', dataFormatString: '{0:d}' },
                { type: JData.CommandField, headerText: '操作', showDeleteButton: true }
            ],
            rowCreated: function (sender, args) {
                if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                    return;

                var row = args.row.get_element();
                var dataItem = args.row.get_dataItem();
                var command_cell = row.cells[row.cells.length - 1];
                site.createCommand(command_cell, '#Shopping/Promotion/ActivityEdit?id=' + dataItem.Id, '<i class="icon-cog"></i>');
            },
            allowPaging: true
        });

        var gridView = $gridView.data('JData.GridView');
        var sel_args = gridView._getSelectArgument();
        page.load.add(function () {
            dataSource.select(sel_args);
        });

        var $dlg_activity = $(page.element).find('[name="dlg_activity"]');
        var model = {
            activity: {
                BeginDate: ko.observable().extend({ required: true }),
                EndDate: ko.observable().extend({ required: true })
            },
            add: function () {
                (<any>$dlg_activity).modal();
            },
            ok: function () {
                if (!(<any>model.activity).isValid()) {
                    return val.showAllMessages();
                }
                var item = ko.mapping.toJS(model.activity);
                return activity.activities.insert(item).done(function () {
                    (<any>$dlg_activity).modal('hide');
                });
            }

        }

        var val = validation.group(model.activity);
        ko.applyBindings(model, page.element);
    }
}

export = ActivitiesPage;