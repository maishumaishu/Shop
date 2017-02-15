
import freightService = require('services/Freight');
import site = require('Site');

let JData = window['JData'];

export = class SolutionListPage extends chitu.Page {
    constructor(params) {
        super(params);
        this.load.add((s, a) => this.page_load(<SolutionListPage>s, a));
    }

    private page_load(page: SolutionListPage, args) {
        var currentItem = null;
        (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: freightService.freightSolutions,
            columns: [
                { dataField: 'Id', headerText: '编号', itemStyle: { width: '300px' } },
                { dataField: 'Name', headerText: '名称' },
                { type: JData.CommandField, itemStyle: { width: '140px' } }
            ],
            rowCreated: function (sender, args) {
                if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                    return;

                var row = args.row.get_element();
                var command_cell = row.cells[row.cells.length - 1];

                var data_item = args.row.get_dataItem();
                var item_id = data_item.Id;


                var url = '#Freight/FreightList?id=' + item_id + '&name=' + encodeURI(data_item.Name);
                site.createCommand(command_cell, url, '设置运费');

                if (item_id == '00000000-0000-0000-0000-000000000000') {
                    return;
                }

                let $btn_delete = site.createCommand(command_cell, 'javascript:', '<i class="icon-trash"></i>');
                $btn_delete.click(function (event) {
                    var tr = $(event.target).parents('tr').first();
                    currentItem = $(tr).data('dataItem');

                    site.confirm('删除', '请确认删除。', function () {
                        freightService.freightSolutions.delete(currentItem);
                    });
                })
                    .removeClass('btn-info').addClass('btn-danger');

                let $btn_edit = site.createCommand(command_cell, 'javascript:', '<i class="icon-pencil">');
                $btn_edit.click(function (event) {
                    var tr = $(event.target).parents('tr').first();
                    currentItem = $(tr).data('dataItem');

                    model.modifyItem();
                });
            }
        });

        var $dlg_solution = $(page.element).find('[name="dlg_solution"]');
        var model = {
            title: ko.observable(),
            solutionName: ko.observable(),
            saveItem: function () {
                currentItem.Name = model.solutionName();
                if (currentItem.Id)
                    freightService.freightSolutions.update(currentItem);
                else
                    freightService.freightSolutions.insert(currentItem);

                (<any>$dlg_solution).modal('hide');
            },
            newItem: function () {
                currentItem = {};
                model.title('添加运费方案');
                (<any>$dlg_solution).modal();
            },
            modifyItem: function () {
                model.solutionName(currentItem.Name);
                model.title('编辑运费方案');
                (<any>$dlg_solution).modal();
            }
        }
        ko.applyBindings(model, page.element);

        var sel_args = new JData.DataSourceSelectArguments();
        sel_args.set_selection('Id, Name');
        freightService.freightSolutions.select(sel_args);
    }
}