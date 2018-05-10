import * as ds from 'admin/services/dataSource';
import { createGridView, boundField, commandField } from 'myWuZhui';
export default function (page: chitu.Page) {
    ReactDOM.render(<ProductTemplates />, page.element);
}

class ProductTemplates extends React.Component<any, any> {
    templatesTable: HTMLTableElement;
    componentDidMount() {
        let gridview = createGridView({
            element: this.templatesTable,
            dataSource: ds.productTemplate,
            columns: [
                boundField({ dataField: 'id' }),
                boundField({ dataField: 'name', headerText: '名称' }),
                commandField({
                    leftButtons: (dataItem) => [
                        <button className="btn btn-minier btn-info">
                            <i className="icon-pencil"></i>
                        </button>
                    ]
                })
            ]
        })
        ds.productTemplate.select();
    }
    render() {
        return [
            <div key={10} className="tabbable">
                <ul className="nav nav-tabs">
                    <li className="pull-right">
                        <button className="btn btn-sm btn-primary">
                            <i className="icon-plus" />
                            <span>添加</span>
                        </button>
                    </li>
                </ul>
            </div>,
            <table key={20} ref={(e: HTMLTableElement) => this.templatesTable = e || this.templatesTable} />
        ];
    }
} 