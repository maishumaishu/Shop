import site = require('Site');
import { CommandField, buttonOnClick, createGridView } from 'UI';
import FormValidator = require('common/formValidator');

export default function (page: chitu.Page) {

    class Page extends React.Component<{}, {}>{
        private dialogElement: HTMLElement;
        private nameElement: HTMLInputElement;
        private imageElement: HTMLInputElement;
        private validator: FormValidator;
        private dataItem: any;
        private dataSource: wuzhui.DataSource<any>;

        componentDidMount() {

            let self = this;

            var baseUrl = site.config.shopUrl + 'ShoppingData/';
            var tableElement = document.createElement('table');
            tableElement.className = 'table table-striped table-bordered table-hover';
            page.element.appendChild(tableElement);
            var dataSource = this.dataSource = new wuzhui.WebDataSource({
                primaryKeys: ['Id'],
                select: baseUrl + 'Select?source=Brands&selection=Id,Name,Image,Recommend',
                update: baseUrl + 'Update?source=Brands',
                insert: baseUrl + 'Insert?source=Brands',
                delete: baseUrl + 'Delete?source=Brands'
            });

            var gridView = createGridView({
                element: tableElement, dataSource, columns: [
                    new wuzhui.BoundField({
                        dataField: 'Name', sortExpression: 'Name', headerText: '名称',
                        itemStyle: { width: '200px' } as CSSStyleDeclaration,
                        headerStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    }),
                    new wuzhui.BoundField({
                        dataField: 'Image', headerText: '图片',
                        headerStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    }),
                    new CommandField({
                        headerText: '操作',
                        headerStyle: { textAlign: 'center', width: '100px' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                        edit(dataItem) {
                            self.openDialog(dataItem)
                        }
                    })
                ]
            });

            this.validator = new FormValidator(this.dialogElement, {
                'name': { rules: ['required'], display: '名称' },
            })
        }
        private openDialog(dataItem?: any) {
            this.validator.clearErrors();
            dataItem = dataItem || { Name: '', Image: '' };
            $(this.dialogElement).modal();
            this.nameElement.value = dataItem.Name;
            this.imageElement.value = dataItem.Image;
            this.dataItem = dataItem;
        }
        private save() {
            this.dataItem = this.dataItem || {};
            this.dataItem.Name = this.nameElement.value;
            this.dataItem.Image = this.imageElement.value;
            var p = this.dataItem.Id ? this.dataSource.update(this.dataItem) : this.dataSource.insert(this.dataItem);
            p.then(() => {
                $(this.dialogElement).modal('hide');
            });

            return p;
        }
        private add() {
            this.dataItem = null;
            this.openDialog();
        }
        render() {
            return (
                <div>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button href="#Shopping/BrandEdit" className="btn btn-sm btn-primary"
                                    onClick={() => this.add()}
                                >添加</button>
                            </li>
                        </ul>
                    </div>
                    <div ref={(o: HTMLElement) => this.dialogElement = o || this.dialogElement} className="modal fade">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title">&nbsp;</h4>
                                </div>
                                <div className="modal-body form-horizontal">
                                    <div className="form-group">
                                        <label className="col-sm-2">名称</label>
                                        <div className="col-sm-10">
                                            <input name="name" type="text" className="form-control"
                                                ref={(o: HTMLInputElement) => this.nameElement = o || this.nameElement} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-sm-2">图片</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control"
                                                ref={(o: HTMLInputElement) => this.imageElement = o || this.imageElement} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                    <button type="button" className="btn btn-primary"
                                        ref={(o: HTMLButtonElement) => {
                                            if (!o) return;
                                            o.onclick = buttonOnClick(() => {
                                                if (!this.validator.validateForm())
                                                    return Promise.reject(new Error());

                                                return this.save();
                                            })
                                        }}>确认</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
    }

    ReactDOM.render(<Page />, page.element);

}

