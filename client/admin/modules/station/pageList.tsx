import { default as site } from 'site';
import app from 'application';
import { StationService } from 'adminServices/station';
// import { Button } from 'common/controls';
import { RouteValue } from 'modules/station/page';
import * as wz from 'myWuZhui';
import * as ui from 'ui';

export default function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);
    page.element.className = 'admin-pc';
    ReactDOM.render(<Page />, page.element);
}

let station = new StationService();

class Page extends React.Component<{}, { templates: TemplatePageData[] }>{
    private pagesElement: HTMLTableElement;
    private dataSource: wuzhui.DataSource<PageData>;
    private templateDialogElement: HTMLElement;
    constructor(props) {
        super(props);
        this.state = { templates: null };
        this.dataSource = new wuzhui.DataSource<PageData>({
            primaryKeys: ['_id'],
            select: (args) => station.pageDatas(),
            delete: (item) => station.deletePageData(item._id)
        });
        station.pageTemplates().then(templates => {
            this.state.templates = templates;
            this.setState(this.state);
        })
    }
    private showPage(pageId?: string) {
        var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
        var url = 'station/page';
        if (pageId)
            url = url + '?pageId=' + pageId;

        app.redirect(url, routeValue)
    }
    private pageSave(pageData: PageData) {
    }
    private showCreatePageDialog() {
        // $(this.templateDialogElement).modal();
        ui.showDialog(this.templateDialogElement);
    }
    private selecteTemplate(template: TemplatePageData) {
        var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
        let url = 'station/page?templateId=' + template._id;
        app.redirect(url, routeValue)
    }
    componentDidMount() {
        let self = this;
        wz.createGridView({
            element: this.pagesElement,
            columns: [
                wz.boundField({ dataField: 'name', headerText: '名称' }),
                wz.boundField({ dataField: 'remark', headerText: '备注' }),
                wz.customField({
                    createItemCell(o: PageData) {
                        let cell = new wuzhui.GridViewCell()
                        ReactDOM.render(<HomePageCell pageData={o} />, cell.element);
                        return cell;
                    },
                    headerText: '主页',
                    headerStyle: { width: '80px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                }),
                wz.customField({
                    createItemCell(o: PageData) {
                        let cell = new wuzhui.GridViewCell();
                        ReactDOM.render(<CommandCell pageData={o} dataSource={self.dataSource} />, cell.element);
                        return cell;
                    },
                    headerText: '操作',
                    headerStyle: { width: '140px' } as CSSStyleDeclaration,
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                })
            ],
            dataSource: this.dataSource
        })

    }
    render() {
        console.assert(this.state != null);
        let templates = this.state.templates;
        return (
            <div>
                <ul style={{ margin: 0, listStyle: 'none' }}>
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
                        <button onClick={(e) => this.showCreatePageDialog()} className="btn btn-sm btn-primary">新建页面</button>
                    </li>
                </ul>
                <table ref={(e: HTMLTableElement) => {
                    if (!e) return;
                    this.pagesElement = e || this.pagesElement;

                }}>
                </table>
                <div className="modal fade templates-dialog" ref={(e: HTMLElement) => this.templateDialogElement = e || this.templateDialogElement}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = () => ui.hideDialog(this.templateDialogElement);
                                    }}>
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">请选择模板</h4>
                            </div>
                            <div className="modal-body row">
                                {templates ?
                                    templates.map(o =>
                                        <div key={o._id} className="col-md-4 template-item"
                                            onClick={() => this.selecteTemplate(o)}>
                                            <img src={o.image} className="img-responsive" />
                                            <div className="name">{o.name}</div>
                                        </div>
                                    ) :
                                    <div>
                                        数据正在加载中...
                                    </div>
                                }
                                <div className="clear-fix">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class CommandCell extends React.Component<{ pageData: PageData, dataSource: wuzhui.DataSource<PageData> }, {}>{
    showPage() {
        let pageId = this.props.pageData._id;
        var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
        var url = 'station/page';
        if (pageId)
            url = url + '?pageId=' + pageId;

        app.redirect(url, routeValue)
    }
    private pageSave(pageData: PageData) {
    }
    private deletePage(pageData: PageData) {
        return this.props.dataSource.delete(pageData);
    }
    render() {
        let pageData = this.props.pageData;
        return (
            <div>
                <button className="btn btn-minier btn-success">
                    页面链接
                                            </button>
                <button className="btn btn-minier btn-info" style={{ marginLeft: 4 }}
                    onClick={e => this.showPage()}>
                    <i className="icon-pencil"></i>
                </button>
                <button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}
                    ref={(e: HTMLButtonElement) => {
                        if (!e) return;
                        e.onclick = ui.buttonOnClick(() => this.deletePage(pageData),
                            { confirm: `确定要删除页面”${pageData.name}“吗？` });
                    }}>
                    <i className="icon-trash"></i>
                </button>
            </div>
        );
    }
}

class HomePageCell extends React.Component<{ pageData: PageData }, { isDefault: boolean }>{
    static homePageChanged = wuzhui.callbacks<HomePageCell, { item: PageData }>();
    constructor(props) {
        super(props);
        this.state = { isDefault: this.props.pageData.isDefault };
        HomePageCell.homePageChanged.add((sender, args) => {
            if (this.props.pageData._id == args.item._id) {
                this.state.isDefault = true;
            }
            else {
                this.state.isDefault = false;
            }
            this.setState(this.state);
        });
    }
    /** 设为主页面 */
    setAsDefaultPage() {
        let pageData = this.props.pageData;
        return station.setDefaultPage(pageData._id).then(() => {
            HomePageCell.homePageChanged.fire(this, { item: pageData });
        });
    }
    render() {
        let isDefault = this.state.isDefault;
        let pageData = this.props.pageData;
        return (<div>
            {isDefault ?
                <span>店铺主页</span> :
                <button className="btn btn-minier btn-primary" title="将页面设为店铺首页"
                    ref={(e: HTMLButtonElement) => {
                        if (!e) return;
                        e.onclick = ui.buttonOnClick(() => {
                            return station.setDefaultPage(pageData._id).then(() => this.setAsDefaultPage());
                        }, { confirm: `是否将页面'${pageData.name}'设为店铺首页?` })
                    }}>
                    设为首页
                    </button>
            }

        </div>)
    }
}