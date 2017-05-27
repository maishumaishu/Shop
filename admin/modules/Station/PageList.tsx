import { default as site } from 'Site';
import app = require('Application');
import { PageData, StationService } from 'services/Station';
import { Button } from 'common/controls';
import { RouteValue } from 'modules/Station/Page';
import * as ui from 'UI';

export default function (page: chitu.Page) {
    ReactDOM.render(<Page />, page.element);
}

let station = new StationService();

class Page extends React.Component<{}, { pageDatas: PageData[] }>{
    private pagesElement: HTMLTableElement;
    private dataSource: wuzhui.WebDataSource<PageData>;

    constructor(props) {
        super(props);
        this.state = { pageDatas: null };
        this.dataSource = new wuzhui.WebDataSource<PageData>({
            primaryKeys: ['_id'],
            select: (args) => station.getPageDatas()
        });
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
        let self = this;
        ui.createGridView({
            element: this.pagesElement,
            columns: [
                ui.boundField({ dataField: 'name', headerText: '名称' }),
                ui.boundField({ dataField: 'remark', headerText: '备注' }),
                ui.customField({
                    createItemCell(o: PageData) {
                        let cell = new wuzhui.GridViewDataCell({
                            dataItem: o, dataField: 'isDefault',
                            render(element: HTMLElement, value: boolean) {
                                ReactDOM.render(
                                    <div>
                                        {value ?
                                            <span>店铺主页</span> :
                                            <button className="btn btn-minier btn-primary" title="将页面设为店铺首页"
                                                ref={(e: HTMLButtonElement) => {
                                                    if (!e) return;
                                                    e.onclick = ui.buttonOnClick(() => {
                                                        return station.setDefaultPage(o._id).then(() => {
                                                            var rowElements = self.pagesElement.querySelectorAll('tbody > tr');
                                                            for (let i = 0; i < rowElements.length; i++) {
                                                                let row = wuzhui.Control.getControlByElement(rowElements[i] as HTMLElement);
                                                                if (row instanceof wuzhui.GridViewDataRow) {
                                                                    (row.dataItem as PageData).isDefault = false;
                                                                    self.dataSource.updated.fire(self.dataSource, { item: row.dataItem });
                                                                }
                                                            }
                                                            o.isDefault = true;
                                                            self.dataSource.updated.fire(self.dataSource, { item: o });
                                                        });
                                                    }, { confirm: `是否将页面'${o.name}'设为店铺首页?` })
                                                }}>
                                                设为首页
                                            </button>
                                        }

                                    </div>,
                                    element
                                );
                            }
                        });

                        return cell;
                    },
                    headerText: '主页',
                    headerStyle: { width: '80px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                }),
                ui.customField({
                    createItemCell(o: PageData) {
                        let cell = new wuzhui.GridViewCell();
                        ReactDOM.render(
                            <div>
                                <button className="btn btn-minier btn-success">
                                    页面链接
                                        </button>
                                <button className="btn btn-minier btn-info" style={{ marginLeft: 4 }}
                                    onClick={e => self.showPage(o._id)}>
                                    <i className="icon-pencil"></i>
                                </button>
                                <Button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}
                                    confirm={() => {
                                        return `确定要删除页面”${o.name}“吗？`;
                                    }}>
                                    <i className="icon-trash"></i>
                                </Button>
                            </div>,
                            cell.element
                        );
                        return cell;
                    },
                    headerText: '操作',
                    headerStyle: { width: '140px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                })
            ],
            dataSource: this.dataSource
        })
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
                        <div className="pull-right">
                            <div className="dropdown" style={{ marginLeft: 4, }}>
                                <button className="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">
                                    访问店铺
                                </button>
                                <div className="dropdown-menu dropdown-menu-right" style={{ padding: 20 }}>
                                    <div style={{ width: '100%', textAlign: 'center' }}>手机扫码访问</div>
                                    <img src="https://h5.youzan.com/v2/common/url/create?type=homepage&kdt_id=764664" style={{ width: 180, height: 180 }} />
                                    <div style={{ width: '100%' }}>
                                        <div className="pull-left">复制页面链接</div>
                                        <div className="pull-right">电脑访问</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <li className="pull-right">
                            <button onClick={(e) => this.showPage()} className="btn btn-sm btn-primary">新建页面</button>
                        </li>
                    </ul>
                </div>
                <table ref={(e: HTMLTableElement) => this.pagesElement = e || this.pagesElement}>
                </table>
            </div>
        );
    }
}