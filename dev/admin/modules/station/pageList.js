var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/site", "admin/siteMap", "admin/services/station", "myWuZhui", "ui", "admin/services/dataSource"], function (require, exports, site_1, siteMap_1, station_1, wz, ui, dataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        site_1.app.loadCSS(page.name);
        let station = page.createService(station_1.StationService);
        ReactDOM.render(h(PageList, Object.assign({}, { station })), page.element);
    }
    exports.default = default_1;
    // type DataItem = { Id: string, Name: string };
    class PageList extends React.Component {
        constructor(props) {
            super(props);
            this.state = { templates: null };
            let station = this.props.station;
            // this.dataSource = new wuzhui.DataSource<DataItem>({
            //     primaryKeys: ['id'],
            //     select: (args) => station.pageList(args),
            //     delete: (item) => station.deletePageData(item.Id)
            // });
            this.dataSource = dataSource_1.pageData;
        }
        showPage(pageId) {
            site_1.app.redirect(siteMap_1.siteMap.nodes.station_page, { pageId });
        }
        pageSave(pageData) {
        }
        showCreatePageDialog() {
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
                        createItemCell(o) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(h(HomePageCell, { pageData: o, station: self.props.station }), cell.element);
                            return cell;
                        },
                        headerText: '主页',
                        headerStyle: { width: '80px' },
                        itemStyle: { textAlign: 'center' }
                    }),
                    wz.customField({
                        createItemCell(o) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(h(CommandCell, { pageData: o, dataSource: self.dataSource }), cell.element);
                            return cell;
                        },
                        headerText: '操作',
                        headerStyle: { width: '140px' },
                        itemStyle: { textAlign: 'center' }
                    })
                ],
                dataSource: this.dataSource
            });
        }
        render() {
            console.assert(this.state != null);
            return [
                h("ul", { key: 10, style: { margin: 0, listStyle: 'none' } },
                    h("li", { className: "pull-right" },
                        h("button", { onClick: (e) => this.showCreatePageDialog(), className: "btn btn-sm btn-primary" }, "\u65B0\u5EFA\u9875\u9762"))),
                h("table", { key: 20, ref: (e) => {
                        if (!e)
                            return;
                        this.pagesElement = e || this.pagesElement;
                    } }),
                h(TemplateDialog, Object.assign({ key: 30, ref: (e) => this.templateDialog = e }, { station: this.props.station }))
            ];
        }
    }
    class CommandCell extends React.Component {
        showPage(pageId) {
            // let pageId = this.props.pageData.id;
            // var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
            // var url = 'station/page';
            // if (pageId)
            //     url = url + '?pageId=' + pageId;
            site_1.app.redirect(siteMap_1.siteMap.nodes.station_page, { pageId });
        }
        // private pageSave(pageData: PageData) {
        // }
        deletePage(pageData) {
            return this.props.dataSource.delete(pageData);
        }
        render() {
            let pageData = this.props.pageData;
            return (h("div", null,
                h("button", { className: "btn btn-minier btn-success" }, "\u9875\u9762\u94FE\u63A5"),
                h("button", { className: "btn btn-minier btn-info", style: { marginLeft: 4 }, onClick: e => {
                        this.showPage(this.props.pageData.id);
                    } },
                    h("i", { className: "icon-pencil" })),
                h("button", { className: "btn btn-minier btn-danger", style: { marginLeft: 4 }, ref: (e) => {
                        if (!e)
                            return;
                        e.onclick = ui.buttonOnClick(() => this.deletePage(pageData), { confirm: `确定要删除页面”${pageData.name}“吗？` });
                    } },
                    h("i", { className: "icon-trash" }))));
        }
    }
    class HomePageCell extends React.Component {
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
            return (h("div", null, isDefault ?
                h("span", null, "\u5E97\u94FA\u4E3B\u9875") :
                h("button", { className: "btn btn-minier btn-primary", title: "将页面设为店铺首页", ref: (e) => {
                        if (!e)
                            return;
                        e.onclick = ui.buttonOnClick(() => {
                            return station.setDefaultPage(pageData.id).then(() => this.setAsDefaultPage());
                        }, { confirm: `是否将页面'${pageData.name}'设为店铺首页?` });
                    } }, "\u8BBE\u4E3A\u9996\u9875")));
        }
    }
    HomePageCell.homePageChanged = wuzhui.callbacks();
    class TemplateDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { templates: [] };
        }
        selecteTemplate(template) {
            // var routeValue: RouteValue = { onSave: this.pageSave.bind(this) };
            // let url = 'station/page?templateId=' + template._id;
            site_1.app.redirect(siteMap_1.siteMap.nodes.station_page, { templateId: template.id });
        }
        showDialog() {
            ui.showDialog(this.templateDialogElement);
        }
        componentDidMount() {
            return __awaiter(this, void 0, void 0, function* () {
                let station = this.props.station;
                let templates = yield station.pageTemplates();
                this.state.templates = templates;
                this.setState(this.state);
            });
        }
        render() {
            let { templates } = this.state;
            return (h("div", { key: 30, className: "modal fade templates-dialog", ref: (e) => this.templateDialogElement = e || this.templateDialogElement },
                h("div", { className: "modal-dialog modal-lg" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", "data-dismiss": "modal", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = () => ui.hideDialog(this.templateDialogElement);
                                } },
                                h("span", { "aria-hidden": "true" }, "\u00D7"),
                                h("span", { className: "sr-only" }, "Close")),
                            h("h4", { className: "modal-title" }, "\u8BF7\u9009\u62E9\u6A21\u677F")),
                        h("div", { className: "modal-body row" },
                            templates ?
                                templates.map(o => h("div", { key: o.id, className: "col-md-4 template-item", onClick: () => this.selecteTemplate(o) },
                                    h("img", { src: o.image, className: "img-responsive" }),
                                    h("div", { className: "name" }, o.name))) :
                                h("div", null, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D..."),
                            h("div", { className: "clear-fix" }))))));
        }
    }
    {
    }
});
