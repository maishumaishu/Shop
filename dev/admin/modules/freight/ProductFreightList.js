define(["require", "exports", "admin/services/shopping", "myWuZhui"], function (require, exports, shopping_1, wz) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        let freightSolutions;
        let tabbable = document.createElement('div');
        tabbable.className = 'tabbable';
        page.element.appendChild(tabbable);
        ReactDOM.render(h("ul", { className: "nav nav-tabs" },
            h("li", { className: "pull-right" },
                h("button", { className: "btn btn-primary btn-sm", ref: (o) => {
                        if (!o)
                            return;
                        o.onclick = ui.buttonOnClick(btnAdd_onclick);
                    } }, "\u6DFB\u52A0"))), tabbable);
        let dataSource = new wuzhui.DataSource({
            select: (args) => shopping.productFreights(args),
            insert: (dataItem) => shopping.addProductFreight(dataItem.ObjectId, dataItem.SolutionId),
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
                        ReactDOM.render(h("div", null,
                            h("button", { className: "btn btn-minier btn-danger", style: { marginLeft: 4 }, onClick: () => {
                                    dataSource.delete(dataItem);
                                } },
                                h("i", { className: "icon-trash" }))), cell.element);
                        return cell;
                    },
                    headerText: '操作',
                    headerStyle: { width: '100px' },
                    itemStyle: { textAlign: 'center' }
                })
            ]
        });
        let dialogElement = document.createElement('form');
        dialogElement.className = 'modal fade in';
        function showDialog(freightSolutions) {
            ReactDOM.render(h("div", { className: "modal-dialog" },
                h("div", { className: "modal-content" },
                    h("div", { className: "modal-header" },
                        h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                            h("span", { "aria-hidden": "true" }, "\u00D7"),
                            h("span", { className: "sr-only" }, "Close")),
                        h("h4", { className: "modal-title" }, "\u4EA7\u54C1\u8FD0\u8D39")),
                    h("div", { className: "modal-body form-horizontal" },
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2 control-label" }, "\u4EA7\u54C1\u7F16\u53F7"),
                            h("div", { className: "col-sm-10" },
                                h("input", { name: "productId", type: "text", className: "form-control", placeholder: "请输入产品编号" }))),
                        h("div", { className: "form-group" },
                            h("label", { className: "col-sm-2 control-label" }, "\u8FD0\u8D39\u65B9\u6848"),
                            h("div", { className: "col-sm-10" },
                                h("select", { name: "solutionId", className: "form-control" }, freightSolutions.map(o => h("option", { key: o.Id, value: o.Id }, o.Name))))),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { type: "button", className: "btn btn-primary", onClick: () => {
                                    let dataItem = {
                                        SolutionId: dialogElement['solutionId'].value,
                                        ObjectId: dialogElement['productId'].value
                                    };
                                    save(dataItem);
                                } }, "\u4FDD\u5B58"))))), dialogElement);
            ui.showDialog(dialogElement);
        }
        function save(dataItem) {
            dataSource.insert(dataItem).then(() => {
                ui.hideDialog(dialogElement);
            });
        }
        function btnAdd_onclick(event) {
            let p;
            if (freightSolutions)
                p = Promise.resolve(freightSolutions);
            p = shopping.freightSolutions().then(data => {
                freightSolutions = data;
                return freightSolutions;
            });
            p.then((data) => {
                showDialog(freightSolutions);
                return data;
            });
            return p;
        }
    }
    exports.default = default_1;
});
//let JData = window['JData'];
/*export default function (page: chitu.Page) {



    requirejs([`text!${page.name}.html`], (html) => {
        page.element.innerHTML = html;
        page_load();
        //page_load(page, page.data);
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
