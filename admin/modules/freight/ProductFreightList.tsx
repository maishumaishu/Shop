import Service = require('service');
import { default as shopping, FreightSolution, ProductFreight } from 'services/shopping';
import * as wz from 'myWuZhui';
import * as ui from 'ui';

export default function (page: chitu.Page) {

    let freightSolutions: FreightSolution[];
    let tabbable = document.createElement('div');
    tabbable.className = 'tabbable';
    page.element.appendChild(tabbable);
    ReactDOM.render(
        <ul className="nav nav-tabs">
            <li className="pull-right">
                <button className="btn btn-primary btn-sm"
                    ref={(o: HTMLButtonElement) => {
                        if (!o) return;
                        o.onclick = ui.buttonOnClick(btnAdd_onclick);
                    }}>添加</button>
            </li>
        </ul>, tabbable);

    let dataSource = new wuzhui.WebDataSource({
        select: (args) => shopping.productFreights(args),
        insert: (dataItem: ProductFreight) => shopping.addProductFreight(dataItem.ObjectId, dataItem.SolutionId),
        primaryKeys: ['Id']
    });
    wz.appendGridView(page.element, {
        dataSource,
        columns: [
            new wz.BoundField({ dataField: 'ObjectId', headerText: '产品编号' }),
            new wz.BoundField({ dataField: 'Name', headerText: '名称' }),
            new wz.BoundField({ dataField: 'SolutionName', headerText: '方案' }),
            new wz.CustomField({
                createItemCell(dataItem) {
                    let cell = new wuzhui.GridViewCell();
                    ReactDOM.render(
                        <div>
                            <button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}
                                onClick={() => {
                                    dataSource.delete(dataItem)
                                }}>
                                <i className="icon-trash"></i>
                            </button>
                        </div>, cell.element);
                    return cell;
                },
                headerText: '操作',
                headerStyle: { width: '100px' } as CSSStyleDeclaration,
                itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
            })
        ]
    })

    let dialogElement = document.createElement('form');
    dialogElement.className = 'modal fade in';
    function showDialog(freightSolutions: FreightSolution[]) {
        ReactDOM.render(
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title">产品运费</h4>
                    </div>
                    <div className="modal-body form-horizontal">
                        <div className="form-group">
                            <label className="col-sm-2 control-label">产品编号</label>
                            <div className="col-sm-10">
                                <input name="productId" type="text" className="form-control" placeholder="请输入产品编号" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">运费方案</label>
                            <div className="col-sm-10">
                                {/*data-bind="options:solutions,optionsText:'Name',optionsValue:'Id',value:selectedSolutionId"*/}
                                <select name="solutionId" className="form-control">
                                    {freightSolutions.map(o =>
                                        <option key={o.Id} value={o.Id}>{o.Name}</option>
                                    )}

                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-primary"
                                onClick={() => {
                                    let dataItem = {
                                        SolutionId: dialogElement['solutionId'].value,
                                        ObjectId: dialogElement['productId'].value
                                    } as ProductFreight;
                                    save(dataItem)
                                }}>保存</button>
                        </div>
                    </div>
                </div>
            </div>
            , dialogElement);

        $(dialogElement).modal();
    }

    function save(dataItem) {
        dataSource.insert(dataItem).then(() => {
            $(dialogElement).modal('hide');
        })
    }

    function btnAdd_onclick(event) {
        let p: Promise<FreightSolution[]>;
        if (freightSolutions)
            p = Promise.resolve(freightSolutions);

        p = shopping.freightSolutions().then(data => {
            freightSolutions = data;
            return freightSolutions;
        });

        p.then((data) => {
            showDialog(freightSolutions);
            return data;
        })

        return p;
    }
}


//let JData = window['JData'];


/*export default function (page: chitu.Page) {



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
}*/