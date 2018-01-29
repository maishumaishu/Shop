import { default as site } from 'site';
import { CommandField, createGridView, GridViewItemPopupEditor } from 'myWuZhui';
import { FormValidator, rules } from 'dilu';
import { default as shopping } from 'adminServices/shopping'
import { default as activity } from 'adminServices/activity'
export default function (page: chitu.Page) {

    class BrandListPage extends React.Component<{}, {}>{
        private dataSource: wuzhui.DataSource<any>;
        private itemEditor: GridViewItemPopupEditor;

        componentDidMount() {

            let self = this;

            var baseUrl = site.config.shopUrl + 'ShoppingData/';
            var tableElement = document.createElement('table');
            tableElement.className = 'table table-striped table-bordered table-hover';
            page.element.appendChild(tableElement);
            var dataSource = this.dataSource = new wuzhui.WebDataSource<Brand>({
                primaryKeys: ['Id'],
                select: (args) => shopping.brands(args),
                update: (dataItem) => shopping.updateBrand(dataItem),
                insert: (dataItem) => shopping.addBrand(dataItem),
                delete: (dataItem) => shopping.deleteBrand(dataItem)
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
                        itemEditor: this.itemEditor
                    })
                ]
            });
        }

        render() {
            return (
                <div>
                    <div className="tabbable">
                        <ul className="nav nav-tabs">
                            <li className="pull-right">
                                <button href="#Shopping/BrandEdit" className="btn btn-sm btn-primary"
                                    onClick={() => this.itemEditor.show()} >
                                    <i className="icon-plus" />
                                    <span>添加</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    <GridViewItemPopupEditor
                        name="品牌"
                        ref={(e) => {
                            if (!e) return;
                            this.itemEditor = e;
                            e.validator = new FormValidator(
                                { element: e.element as HTMLInputElement, rules: [rules.required()] }
                            )
                        }}
                        saveDataItem={(dataItem) => {
                            if (dataItem.Id == null)
                                return this.dataSource.insert(dataItem);
                            else
                                return this.dataSource.update(dataItem);
                        }} >


                        <div className="form-group">
                            <label className="col-sm-2">名称</label>
                            <div className="col-sm-10">
                                <input name="Name" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-2">图片</label>
                            <div className="col-sm-10">
                                <input name="Image" type="text" className="form-control" />
                            </div>
                        </div>

                    </GridViewItemPopupEditor>
                </div >
            );
        }
    }

    page.element.className = "admin-pc";
    ReactDOM.render(<BrandListPage />, page.element);
}

