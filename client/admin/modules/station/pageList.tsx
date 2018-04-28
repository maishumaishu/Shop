import { default as site } from 'site';
import app from 'application';
import { StationService } from 'services/station';
import * as wz from 'myWuZhui';
import * as ui from 'ui';
import siteMap from 'siteMap';

export default function (page: chitu.Page) {
    app.loadCSS(page.name);
    let station = page.createService(StationService);
    ReactDOM.render(<PageList {...{ station }} />, page.element);
}


class PageList extends React.Component<{ station: StationService }, {}>{
    private pagesElement: HTMLTableElement;
    private dataSource: wuzhui.DataSource<PageData>;
    private templateDialog: TemplateDialog;

    constructor(props) {
        super(props);
        this.state = { templates: null };
        let station = this.props.station;
        this.dataSource = new wuzhui.DataSource<PageData>({
            primaryKeys: ['id'],
            select: (args) => station.pageDatas(),
            delete: (item) => station.deletePageData(item.id)
        });
        // station.pageTemplates().then(templates => {
        //     this.state.templates = templates;
        //     this.setState(this.state);
        // })
        // templates: TemplatePageData[]
    }
    private showPage(pageId?: string) {
        // var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
        // var url = 'station/page';
        // if (pageId)
        //     url = url + '?pageId=' + pageId;

        app.redirect(siteMap.nodes.station_page, { pageId });
    }
    private pageSave(pageData: PageData) {
    }
    private showCreatePageDialog() {
        // $(this.templateDialogElement).modal();
        this.templateDialog.showDialog();
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
                        ReactDOM.render(<HomePageCell pageData={o} station={self.props.station} />, cell.element);
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
        return [
            <ul key={10} style={{ margin: 0, listStyle: 'none' }}>
                <li className="pull-right">
                    <button onClick={(e) => this.showCreatePageDialog()} className="btn btn-sm btn-primary">新建页面</button>
                </li>
            </ul>,
            <table key={20} ref={(e: HTMLTableElement) => {
                if (!e) return;
                this.pagesElement = e || this.pagesElement;

            }} />,
            <TemplateDialog key={30} ref={(e) => this.templateDialog = e} {...{ station: this.props.station }} />
        ];
    }
}

class CommandCell extends React.Component<{ pageData: PageData, dataSource: wuzhui.DataSource<PageData> }, {}>{
    showPage(pageId: string) {
        // let pageId = this.props.pageData.id;
        // var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
        // var url = 'station/page';
        // if (pageId)
        //     url = url + '?pageId=' + pageId;

        app.redirect(siteMap.nodes.station_page, { pageId });
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
                    onClick={e => {
                        this.showPage(this.props.pageData.id)
                    }}>
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

class HomePageCell extends React.Component<{ pageData: PageData, station: StationService }, { isDefault: boolean }>{
    static homePageChanged = wuzhui.callbacks<HomePageCell, { item: PageData }>();
    constructor(props) {
        super(props);
        this.state = { isDefault: this.props.pageData.isDefault };
        HomePageCell.homePageChanged.add((sender, args) => {
            if (this.props.pageData.id == args.item.id) {
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
        let station = this.props.station;
        return station.setDefaultPage(pageData.id).then(() => {
            HomePageCell.homePageChanged.fire(this, { item: pageData });
        });
    }
    render() {
        let isDefault = this.state.isDefault;
        let { pageData, station } = this.props;
        return (<div>
            {isDefault ?
                <span>店铺主页</span> :
                <button className="btn btn-minier btn-primary" title="将页面设为店铺首页"
                    ref={(e: HTMLButtonElement) => {
                        if (!e) return;
                        e.onclick = ui.buttonOnClick(() => {
                            return station.setDefaultPage(pageData.id).then(() => this.setAsDefaultPage());
                        }, { confirm: `是否将页面'${pageData.name}'设为店铺首页?` })
                    }}>
                    设为首页
                    </button>
            }

        </div>)
    }
}

type TemplateDialogProps = { station: StationService } & React.Props<TemplateDialog>;
class TemplateDialog extends React.Component<TemplateDialogProps, { templates: TemplatePageData[] }> {
    templateDialogElement: HTMLElement;

    constructor(props) {
        super(props);
        this.state = { templates: [] };
    }

    private selecteTemplate(template: TemplatePageData) {
        // var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
        // let url = 'station/page?templateId=' + template._id;
        app.redirect(siteMap.nodes.station_page, { templateId: template.id });
    }

    showDialog() {
        ui.showDialog(this.templateDialogElement);
    }

    async componentDidMount() {
        let station = this.props.station;
        let templates = await station.pageTemplates();
        this.state.templates = templates;
        this.setState(this.state);
    }

    render() {
        let { templates } = this.state;
        return (
            <div key={30} className="modal fade templates-dialog"
                ref={(e: HTMLElement) => this.templateDialogElement = e || this.templateDialogElement}>
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
                                    <div key={o.id} className="col-md-4 template-item"
                                        onClick={() => this.selecteTemplate(o)}>
                                        <img src={o.image} className="img-responsive" />
                                        <div className="name">{o.name}</div>
                                    </div>
                                ) :
                                <div>数据正在加载中...</div>
                            }
                            <div className="clear-fix">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


{/* <div key={30} className="modal fade templates-dialog" ref={(e: HTMLElement) => this.templateDialogElement = e || this.templateDialogElement}>
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
                    <div key={o.id} className="col-md-4 template-item"
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
</div> */}