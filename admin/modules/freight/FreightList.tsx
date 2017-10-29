
import app = require('application');
import val = require('knockout.validation');
import { ShoppingService } from 'adminServices/shopping';
import * as ui from 'myWuZhui';

export default function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);

    page.element.className = 'admin-pc';
    let tabbable = document.createElement('div');
    tabbable.className = 'tabbable';
    page.element.appendChild(tabbable);

    ReactDOM.render(
        <ul className="nav nav-tabs">
            <li className="pull-left">
                <h4 style={{ marginBottom: 0 }}>{page.routeData.values.name}</h4>
            </li>
            <li className="pull-right">
                <a className="btn btn-primary btn-sm" onClick={() => app.back()}>返回</a>
            </li>
        </ul>, tabbable);

    let id = page.routeData.values.id;
    let dataSource = new wuzhui.WebDataSource<RegionFreight>({
        select: () => shopping.regionFreights(id),
        update: (dataItem: RegionFreight) => shopping.setRegionFreight(dataItem.Id, dataItem.Freight, dataItem.FreeAmount),
        primaryKeys: ['Id']
    });
    ui.appendGridView(page.element, {
        dataSource,
        columns: [
            new ui.BoundField({ dataField: 'RegionName', headerText: '地区' }),
            new ui.BoundField({
                dataField: 'Freight', headerText: '运费', dataFormatString: '￥{0:C2}',
                itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
            }),
            new ui.BoundField({
                dataField: 'FreeAmount', headerText: '免运费金额', dataFormatString: '￥{0:C2}',
                itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
            }),
            new ui.CustomField({
                createItemCell(dataItem) {
                    let cell = new wuzhui.GridViewCell();
                    ReactDOM.render(
                        <a className="btn btn-minier btn-info" style={{ marginRight: 4 }}
                            onClick={() => showDialog(dataItem)}>
                            <i className="icon-pencil"></i>
                        </a>, cell.element)
                    return cell;
                },
                headerText: '操作',
                headerStyle: { width: '80px' } as CSSStyleDeclaration,
                itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
            })
        ],
    });

    let dialogElement = document.createElement('form');
    dialogElement.className = 'modal fade in';
    page.element.appendChild(dialogElement);

    function showDialog(obj: RegionFreight) {
        let dataItem = Object.assign({}, obj);
        ReactDOM.render(
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title">地区运费</h4>
                    </div>
                    <div className="modal-body form-horizontal">
                        <div className="form-group">
                            <label className="col-sm-2 control-label">
                                {dataItem.RegionName}
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">运费</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="请输入运费金额"
                                    ref={(o: HTMLInputElement) => {
                                        if (!o) return;
                                        o.value = dataItem.Freight as any;
                                    }}
                                    onChange={(e) => {
                                        dataItem.Freight = Number.parseFloat((e.target as HTMLInputElement).value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2 control-label">免运费</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" placeholder="请输入免运费金额"
                                    ref={(o: HTMLInputElement) => {
                                        if (!o) return;
                                        o.value = dataItem.FreeAmount as any
                                    }}
                                    onChange={(e) => {
                                        dataItem.FreeAmount = Number.parseFloat((e.target as HTMLInputElement).value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-primary"
                                onClick={() => {
                                    dataSource.update(dataItem).then(() => {
                                        $(dialogElement).modal('hide');
                                    });
                                }}
                            >确认</button>
                        </div>
                    </div>
                </div>
            </div>
            , dialogElement)

        $(dialogElement).modal();
    }

}


// export default function (page: chitu.Page) {

//     var validation;
//     var currentItem;

//     var model = {
//         regionFreight: {
//             Id: ko.observable(),
//             RegionId: ko.observable(),
//             RegionName: ko.observable(),
//             Freight: ko.observable().extend({ required: true }),
//             FreeAmount: ko.observable()
//         },
//         freights: ko.observableArray(),
//         freightEdit: function (item) {

//         },
//         back: function () {
//             app.back().catch(function () {
//                 app.redirect('Freight/SolutionList')
//             });
//         },
//         edit: function (item) {
//             if (validation != null)
//                 validation.showAllMessages(false);

//             model.regionFreight.Id(ko.unwrap(item.Id));
//             model.regionFreight.RegionId(ko.unwrap(item.RegionId));
//             model.regionFreight.RegionName(ko.unwrap(item.RegionName));
//             model.regionFreight.Freight(ko.unwrap(item.Freight));
//             model.regionFreight.FreeAmount(ko.unwrap(item.FreeAmount));
//             (<any>$(page.element).find('[name="regionFreight"]')).modal();
//             currentItem = item;
//         },
//         confirm: function () {
//             validation = ko.validation.group(model.regionFreight);
//             if (!(<any>model.regionFreight).isValid()) {
//                 validation.showAllMessages();
//                 return $.Deferred().reject();
//             }

//             var id = model.regionFreight.Id();
//             var freight = model.regionFreight.Freight();
//             var freeAmount = model.regionFreight.FreeAmount();
//             return shopping.setRegionFreight(id, freight, freeAmount).done(function () {
//                 currentItem.Freight(freight);
//                 currentItem.FreeAmount(freeAmount);
//                 (<any>$(page.element).find('[name="regionFreight"]')).modal('hide');
//             });
//         }
//     };


//     requirejs([`text!${page.routeData.actionPath}.html`], (html) => {
//         page.element.innerHTML = html;
//         ko.applyBindings(model, page.element);

//         page_load(page, page.routeData.values);
//     })

//     function page_load(sender, args) {
//         app.nav_bar.title(decodeURI(args.name));
//         return shopping.getRegionFreights(args.id).then(function (items) {
//             for (var i = 0; i < items.length; i++) {
//                 items[i] = ko.mapping.fromJS(items[i]);
//             }
//             model.freights(items);
//         });
//     };
// }
