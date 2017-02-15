//chitu.action(['sv/Freight'], function (page) {
/// <param name="page" type="chitu.Page"/>

//});

import Service = require('services/Service');
import freight = require('services/Freight');
let JData = window['JData'];

export default function (page: chitu.Page) {



    requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
        page.element.innerHTML = html;
        page_load();
        //page_load(page, page.routeData.values);
    })
    function page_load() {
        var $gridView = (<any>$('<table>').appendTo(page.element)).gridView({
            dataSource: freight.productFreight,
            columns: [
                { dataField: 'ObjectId', headerText: '产品编号', itemStyle: { width: '290px' } },
                { dataField: 'Name', headerText: '名称' },
                { dataField: 'SolutionName', headerText: '方案' },
                { dataField: 'IsSingle', headerText: '是否独立购买' },
                { type: JData.CommandField, showDeleteButton: true, itemStyle: { width: '120px' } }
            ],
            allowPaging: true
        });
        var sel_args = $gridView.data('JData.GridView').get_selectArguments();
        freight.productFreight.select(sel_args);

        var $dlg_productFreight = $(page.element).find('[Name="productFreight"]')
        var model = {
            solutions: ko.observableArray(),
            selectedSolutionId: ko.observable(),
            productId: ko.observable(),
            isSingle: ko.observable(true),
            add: function () {
                (<any>$dlg_productFreight).modal();
            },
            save: function () {
                var item = { ProductId: model.productId(), SolutionId: model.selectedSolutionId(), IsSingle: model.isSingle() };
                return freight.productFreight.insert(item).done(function () {
                    (<any>$dlg_productFreight).modal('hide');
                });
            }
        };

        ko.applyBindings(model, page.element);

        var args = new JData.DataSourceSelectArguments();
        args.set_selection('Id, Name');
        model.solutions.removeAll();
        return freight.freightSolutions
            .select(args)
            .done(function (items) {
                $.each(items, function () {
                    model.solutions.unshift(this);
                });
                model.selectedSolutionId('00000000-0000-0000-0000-000000000000');
            });
    };
}