
import { default as shopping } from 'services/Shopping';
import site = require('Site');
import * as ui from 'UI';

export default function (page: chitu.Page) {


    class Page extends React.Component<any, any>{
        private gridViewElement: HTMLTableElement;
        private dialogElement: HTMLElement;
        private dataSource: wuzhui.DataSource<any>;

        constructor(props) {
            super(props);
        }
        componentDidMount() {
            let dataSource = this.dataSource = new wuzhui.WebDataSource({
                select: () => shopping.freightSolutions(),
                delete: (dataItem) => shopping.deleteFreightSolution(dataItem),
                update: (dataItem) => shopping.updateFreightSolution(dataItem),
                primaryKeys: ['Id']
            });
            let gridView = ui.createGridView({
                element: this.gridViewElement,
                columns: [
                    new ui.BoundField({
                        dataField: 'Id', headerText: '编号',
                        headerStyle: { width: '300px' } as CSSStyleDeclaration
                    }),
                    new ui.BoundField({
                        dataField: 'Name', headerText: '名称',
                    }),
                    new ui.CustomField({
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(
                                <div>
                                    <button className="btn btn-info btn-minier" style={{ marginRight: 4 }}
                                        onClick={() => this.showDialog(dataSource, dataItem)}>
                                        <i className="icon-pencil"></i>
                                    </button>
                                    <button className="btn btn-minier btn-danger" style={{ marginRight: 4 }}
                                        ref={(e: HTMLElement) => {
                                            if (!e) return;
                                            e.onclick = ui.buttonOnClick(() => dataSource.delete(dataItem),
                                                { confirm: `确定要删除'${dataItem.Name}'运费方案吗` });
                                        }}>
                                        <i className="icon-trash"></i>
                                    </button>
                                    <a className="btn btn-info btn-minier" style={{ marginRight: 4 }}
                                        href={`#Freight/FreightList?id=${dataItem.Id}&name=${encodeURI(dataItem.Name)}`}>设置运费</a>
                                </div>, cell.element);
                            return cell;
                        },
                        headerText: '操作',
                        headerStyle: { width: '180px' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                    })
                ],
                dataSource,
                pageSize: null
            });
        }
        showDialog(dataItem) {
            let name: string = dataItem.Name;
            ReactDOM.render(
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h4 data-bind="text:title" className="modal-title">编辑方案</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">方案名称</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control"
                                        placeholder="请输入运费方案的名称"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = name || '';
                                        }}
                                        onChange={(e) => name = (e.target as HTMLInputElement).value} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button name="btn_cancel" type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button name="btn_confirm" type="button" className="btn btn-primary"
                                    onClick={() => {
                                        dataItem.Name = name;
                                        this.dataSource.update(dataItem).then(() => {
                                            $(this.dialogElement).modal('hide');
                                        });
                                    }}>确认</button>
                            </div>
                        </div>
                    </div>
                </div>
                , this.dialogElement);

            $(this.dialogElement).modal();
        }
        render() {
            return (
                <div>
                    <div id="news" className="tabbable">
                        <ul id="myTab" className="nav nav-tabs">
                            <li className="pull-right">
                                <button data-bind="click:newItem" className="btn btn-primary btn-sm"
                                    onClick={() => this.showDialog({})}>新建运费模板</button>
                            </li>
                        </ul>
                    </div>
                    <table ref={(e: HTMLTableElement) => this.gridViewElement = e || this.gridViewElement}>
                    </table>
                    <div className="modal fade" ref={(e: HTMLElement) => this.dialogElement = e || this.dialogElement}>
                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<Page />, page.element);




    // let dialogElement = document.createElement('form');
    // dialogElement.name = 'dlg_solution';
    // dialogElement.className = 'modal fade';
    // page.element.appendChild(dialogElement);



}

