define(["require", "exports", "application", "admin/services/shopping", "myWuZhui"], function (require, exports, application_1, shopping_1, wz) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        class RegionFreightDialog extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
            }
            show() {
                ui.showDialog(this.element);
            }
            hide() {
                ui.hideDialog(this.element);
            }
            render() {
                let dataItem = this.state.dataItem || {};
                let dataSource = this.props.dataSource;
                return (h("div", { className: "modal fade", ref: (e) => this.element = e || this.element },
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7"),
                                    h("span", { className: "sr-only" }, "Close")),
                                h("h4", { className: "modal-title" }, "\u5730\u533A\u8FD0\u8D39")),
                            h("div", { className: "modal-body form-horizontal" },
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2 control-label" }, dataItem.RegionName)),
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2 control-label" }, "\u8FD0\u8D39"),
                                    h("div", { className: "col-sm-10" },
                                        h("input", { type: "text", className: "form-control", placeholder: "请输入运费金额", ref: (o) => {
                                                if (!o)
                                                    return;
                                                o.value = dataItem.Freight;
                                            }, onChange: (e) => {
                                                dataItem.Freight = Number.parseFloat(e.target.value);
                                            } }))),
                                h("div", { className: "form-group" },
                                    h("label", { className: "col-sm-2 control-label" }, "\u514D\u8FD0\u8D39"),
                                    h("div", { className: "col-sm-10" },
                                        h("input", { type: "text", className: "form-control", placeholder: "请输入免运费金额", ref: (o) => {
                                                if (!o)
                                                    return;
                                                o.value = dataItem.FreeAmount;
                                            }, onChange: (e) => {
                                                dataItem.FreeAmount = Number.parseFloat(e.target.value);
                                            } }))),
                                h("div", { className: "modal-footer" },
                                    h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                    h("button", { type: "button", className: "btn btn-primary", onClick: () => {
                                            dataSource.update(dataItem).then(() => {
                                                this.hide();
                                            });
                                        } }, "\u786E\u8BA4")))))));
            }
        }
        class FreightListPage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { solutionId: this.props.solutionId, name: this.props.name };
                this.dataSource = new wuzhui.DataSource({
                    select: () => shopping.regionFreights(this.state.solutionId),
                    update: (dataItem) => shopping.setRegionFreight(dataItem.Id, dataItem.Freight, dataItem.FreeAmount),
                    primaryKeys: ['Id']
                });
            }
            componentDidMount() {
                let self = this;
                wz.createGridView({
                    dataSource: this.dataSource,
                    columns: [
                        new wz.BoundField({ dataField: 'RegionName', headerText: '地区' }),
                        new wz.BoundField({
                            dataField: 'Freight', headerText: '运费', dataFormatString: '￥{C2}',
                            itemStyle: { textAlign: 'right' },
                        }),
                        new wz.BoundField({
                            dataField: 'FreeAmount', headerText: '免运费金额', dataFormatString: '￥{C2}',
                            itemStyle: { textAlign: 'right' },
                        }),
                        new wz.CustomField({
                            createItemCell(dataItem) {
                                let cell = new wuzhui.GridViewCell();
                                ReactDOM.render(h("a", { className: "btn btn-minier btn-info", style: { marginRight: 4 }, onClick: () => self.showDialog(dataItem) },
                                    h("i", { className: "icon-pencil" })), cell.element);
                                return cell;
                            },
                            headerText: '操作',
                            headerStyle: { width: '80px' },
                            itemStyle: { textAlign: 'center' }
                        })
                    ],
                    element: this.freightListElement
                });
            }
            componentDidUpdate() {
                this.dataSource.select();
            }
            showDialog(dataItem) {
                this.dialog.state.dataItem = dataItem;
                this.dialog.setState(this.dialog.state);
                this.dialog.show();
            }
            render() {
                // this.dataSource.select = () => shopping.regionFreights(this.props.solutionId);
                let name = this.state.name;
                return [
                    h("ul", { key: "tab", className: "nav nav-tabs" },
                        h("li", { className: "pull-left" },
                            h("h4", { style: { marginBottom: 0 } }, name)),
                        h("li", { className: "pull-right" },
                            h("button", { className: "btn btn-primary btn-sm", onClick: () => application_1.default.back() },
                                h("i", { className: "icon-reply" }),
                                h("span", null, "\u8FD4\u56DE")))),
                    h("table", { key: "freights", ref: (e) => this.freightListElement = this.freightListElement || e }),
                    h(RegionFreightDialog, { key: "dialog", dataSource: this.dataSource, ref: (e) => this.dialog = e || this.dialog })
                ];
            }
        }
        let freightListPage;
        ReactDOM.render(h(FreightListPage, { ref: (e) => freightListPage = e || freightListPage, solutionId: page.data.id, name: page.data.name }), page.element);
        page.showing.add((sender, args) => {
            freightListPage.state.name = args.name;
            freightListPage.state.solutionId = args.id;
            freightListPage.setState(freightListPage.state);
        });
    }
    exports.default = default_1;
});
