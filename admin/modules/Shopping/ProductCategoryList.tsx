
import { default as site } from 'Site';
import ui = require('UI');
import FormValidator = require('common/formValidator');
import { default as shopping } from 'services/Shopping';

export default function (page: chitu.Page) {
    class Page extends React.Component<{}, { rows?: Array<any> }>{
        private dialogElement: HTMLFormElement;
        private tableElement: HTMLTableElement;
        private validator: FormValidator;
        private dataSource: wuzhui.DataSource<any>;

        constructor(props) {
            super(props);
            this.state = {};

            let select = shopping.url('Product/GetProductCategories');
            let insert = shopping.url('Product/AddProductCategory');
            let update = shopping.url('Product/UpdateProductCategory');
            let deleteUrl = shopping.url('Product/DeleteProductCategory');
            this.dataSource = new wuzhui.WebDataSource({ select, insert, update, delete: deleteUrl, primaryKeys: ['Id'] });
            this.dataSource.selected.add((sender, args) => {
                this.state.rows = args.items;
                this.setState(this.state);
            });
        }
        createGridView(tableElement: HTMLTableElement) {
            var gridView = new wuzhui.GridView({
                element: tableElement,
                dataSource: this.dataSource,
                columns: [
                    new wuzhui.CustomField({
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewDataCell({
                                dataItem, dataField: 'SortNumber',
                                render(element, value: number) {
                                    element.innerHTML = `${value + 1}`;
                                }
                            });
                            return cell;
                        },
                        headerText: '序号',
                        headerStyle: { textAlign: 'center', width: '100px' } as CSSStyleDeclaration
                    }),
                    new wuzhui.BoundField({ dataField: 'Name', headerText: '名称', headerStyle: { textAlign: 'center' } as CSSStyleDeclaration }),
                    new wuzhui.BoundField({ dataField: 'Remark', headerText: '备注', headerStyle: { textAlign: 'center' } as CSSStyleDeclaration }),
                    new wuzhui.CustomField({
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewDataCell({
                                dataItem, dataField: 'Hidden',
                                render(element, value) {
                                    if (value == true)
                                        element.innerHTML = '是';
                                    else
                                        element.innerHTML = '否';
                                }
                            });
                            return cell;
                        },
                        headerText: '隐藏', headerStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    }),
                    new wuzhui.BoundField({ dataField: 'ImagePath', headerText: '图片', headerStyle: { textAlign: 'center' } as CSSStyleDeclaration }),
                    new ui.CommandField({
                        itemEditor: null,
                        headerText: '操作',
                        headerStyle: { textAlign: 'center', width: '120px' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    })
                ]
            });
        }
        createValidator(formElement: HTMLElement) {
            this.validator = new FormValidator(formElement, {
                SortNumber: { rules: ['required'] },
                Name: { rules: ['required'] },
            });
        }
        save() {
            if (!this.validator.validateForm()) {
                return;
            }

            let id = (this.dialogElement['Id'] as HTMLSelectElement).value;
            var dataItem = {
                SortNumber: (this.dialogElement['SortNumber'] as HTMLSelectElement).value,
                Name: (this.dialogElement['Name'] as HTMLInputElement).value,
                Remark: (this.dialogElement['Remark'] as HTMLInputElement).value,
                ImagePath: (this.dialogElement['ImagePath'] as HTMLInputElement).value,
                Hidden: (this.dialogElement['Hidden'] as HTMLInputElement).checked,
            };

            if (id) {
                (dataItem as any).Id = id;
            }

            let p: Promise<any>
            if (id) {
                p = this.dataSource.update(dataItem);
            }
            else {
                p = this.dataSource.insert(dataItem);
            }
            p.then(() => $(this.dialogElement).modal('hide'));
        }
        add() {
            this.validator.clearErrors();
            $(this.dialogElement).find('input').val('');
            $(this.dialogElement).modal();
        }
        edit(dataItem) {
            (this.dialogElement['Id'] as HTMLSelectElement).value = dataItem.Id;
            (this.dialogElement['SortNumber'] as HTMLSelectElement).value = dataItem.SortNumber;
            (this.dialogElement['Name'] as HTMLInputElement).value = dataItem.Name;
            (this.dialogElement['Remark'] as HTMLInputElement).value = dataItem.Remark;
            (this.dialogElement['ImagePath'] as HTMLInputElement).value = dataItem.ImagePath;
            (this.dialogElement['Hidden'] as HTMLInputElement).checked = dataItem.Hidden;
            $(this.dialogElement).modal();
        }
        componentDidMount() {
            this.createGridView(this.tableElement);
            this.createValidator(this.dialogElement);
        }
        render() {
            var rows = this.state.rows || [];

            return (
                <div>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button className="btn btn-sm btn-primary"
                                    onClick={() => this.add()}>添加</button>
                            </li>
                        </ul>
                    </div>
                    <form name="dlg_edit" className="modal fade"
                        ref={(o: HTMLFormElement) => this.dialogElement = this.dialogElement || o}>
                        <input name="Id" type="hidden" />
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">编辑</h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <label className="control-label col-sm-2">序号</label>
                                            <div className="col-sm-10">
                                                <select name="SortNumber" className="form-control" >
                                                    {rows.map((o, i) => (
                                                        <option key={i} value={`${i}`}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                    <option value={`${rows.length}`}>{rows.length + 1}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-2">名称</label>
                                            <div className="col-sm-10">
                                                <input name="Name" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-2">备注</label>
                                            <div className="col-sm-10">
                                                <input name="Remark" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-2">图片</label>
                                            <div className="col-sm-10">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <a href="#" className="fileinput-button">
                                                            <span className="icon-upload-alt"></span>
                                                            <input name="ImageUpload" type="file" id="ImageUpload" multiple={true} />
                                                        </a>
                                                    </span>
                                                    <input name="ImagePath" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-offset-2 col-sm-10">
                                                <div className="checkbox">
                                                    <label>
                                                        <input name="Hidden" type="checkbox" />在前台隐藏该类别
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer" style={{ marginTop: 0 }}>
                                    <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                    <button type="button" className="btn btn-primary"
                                        onClick={() => this.save()}>保存</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <table className={site.style.tableClassName}
                        ref={(o: HTMLTableElement) => { this.tableElement = this.tableElement || o }}>
                    </table>
                </div>
            );
        }
    }

    ReactDOM.render(<Page />, page.element);
}
