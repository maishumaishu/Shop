
import site = require('Site');
import app = require('Application');
import { PageData, StationService } from 'services/Station';
import { Button } from 'common/controls';
import { RouteValue } from 'modules/Station/Page';

export default function (page: chitu.Page) {
    ReactDOM.render(<Page />, page.element);


}

let station = new StationService();

class Page extends React.Component<{}, { pageDatas: PageData[] }>{
    constructor(props) {
        super(props);
        this.state = { pageDatas: null };
    }
    private showPage(pageId?: string) {
        var routeValue: RouteValue = { id: pageId, onSave: this.pageSave.bind(this) };
        var url = 'Station/Page';
        if (pageId)
            url = url + '?pageId=' + pageId;

        app.redirect(url, routeValue)
    }
    private pageSave(pageData: PageData) {

    }
    componentDidMount() {
        station.getPageDatas().then(o => {
            this.state.pageDatas = o;
            this.setState(this.state);
        });
    }
    render() {
        console.assert(this.state != null);
        let pageData = this.state.pageDatas;
        return (
            <div>
                <div className="tabbable">
                    <ul className="nav nav-tabs">
                        <li className="pull-right">
                            <button onClick={(e) => this.showPage()} className="btn btn-sm btn-primary">添加</button>
                        </li>
                    </ul>
                </div>
                <table className={site.style.tableClassName}>
                    <thead>
                        <tr>
                            <td className="text-center" style={{ width: 200 }}>名称</td>
                            <td className="text-center">备注</td>
                            <td className="text-center" style={{ width: 200 }}>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData == null || pageData.length == 0 ?
                            <tr>
                                <td colSpan={3} style={{ height: 200, textAlign: 'center', paddingTop: 80 }}>
                                    {pageData == null ? '数据正在加载中...' : '暂无页面数据'}
                                </td>
                            </tr> :
                            (pageData.map(o => (
                                <tr key={o._id}>
                                    <td>{o.name}</td>
                                    <td></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="btn btn-minier btn-success">
                                            页面链接
                                        </button>
                                        <button className="btn btn-minier btn-info" style={{ marginLeft: 4 }}
                                            onClick={e => this.showPage(o._id)}>
                                            <i className="icon-pencil"></i>
                                        </button>
                                        <Button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}
                                            confirm={() => {
                                                return `确定要删除页面”${o.name}“吗？`;
                                            }}>
                                            <i className="icon-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}