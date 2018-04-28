
import app from 'application';
import val = require('knockout.validation');
import { ShoppingService } from 'services/shopping';
import * as wz from 'myWuZhui';

export default function (page: chitu.Page) {

    let shopping = page.createService(ShoppingService);
    class RegionFreightDialog extends React.Component<
        { dataSource: wuzhui.DataSource<RegionFreight> } & React.Props<RegionFreightDialog>, { dataItem?: RegionFreight }> {
        private element: HTMLElement;
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
            let dataItem = this.state.dataItem || {} as RegionFreight;
            let dataSource = this.props.dataSource;
            return (
                <div className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">地区运费</h4>
                            </div>
                            <div className="modal-body form-horizontal">
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">
                                        {dataItem.RegionName}
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">运费</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" placeholder="请输入运费金额"
                                            ref={(o: HTMLInputElement) => {
                                                if (!o) return;
                                                o.value = dataItem.Freight as any;
                                            }}
                                            onChange={(e) => {
                                                dataItem.Freight = Number.parseFloat((e.target as HTMLInputElement).value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">免运费</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" placeholder="请输入免运费金额"
                                            ref={(o: HTMLInputElement) => {
                                                if (!o) return;
                                                o.value = dataItem.FreeAmount as any
                                            }}
                                            onChange={(e) => {
                                                dataItem.FreeAmount = Number.parseFloat((e.target as HTMLInputElement).value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                    <button type="button" className="btn btn-primary"
                                        onClick={() => {
                                            dataSource.update(dataItem).then(() => {
                                                this.hide();
                                            });
                                        }}
                                    >确认</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    }

    class FreightListPage extends React.Component<
        { solutionId: string, name: string } & React.Props<FreightListPage>, { solutionId: string, name: string }>{
        private dataSource: wuzhui.DataSource<RegionFreight>;
        private freightListElement: HTMLTableElement;
        private dialog: RegionFreightDialog;

        constructor(props) {
            super(props);

            this.state = { solutionId: this.props.solutionId, name: this.props.name };
            this.dataSource = new wuzhui.DataSource<RegionFreight>({
                select: () => shopping.regionFreights(this.state.solutionId),
                update: (dataItem: RegionFreight) => shopping.setRegionFreight(dataItem.Id, dataItem.Freight, dataItem.FreeAmount),
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
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
                    }),
                    new wz.BoundField({
                        dataField: 'FreeAmount', headerText: '免运费金额', dataFormatString: '￥{C2}',
                        itemStyle: { textAlign: 'right' } as CSSStyleDeclaration,
                    }),
                    new wz.CustomField({
                        createItemCell(dataItem: RegionFreight) {
                            let cell = new wuzhui.GridViewCell();
                            ReactDOM.render(
                                <a className="btn btn-minier btn-info" style={{ marginRight: 4 }}
                                    onClick={() => self.showDialog(dataItem)}>
                                    <i className="icon-pencil"></i>
                                </a>, cell.element)
                            return cell;
                        },
                        headerText: '操作',
                        headerStyle: { width: '80px' } as CSSStyleDeclaration,
                        itemStyle: { textAlign: 'center' } as CSSStyleDeclaration
                    })
                ],
                element: this.freightListElement
            });
        }
        componentDidUpdate() {
            this.dataSource.select();
        }
        showDialog(dataItem: RegionFreight) {
            this.dialog.state.dataItem = dataItem;
            this.dialog.setState(this.dialog.state);
            this.dialog.show();
        }
        render() {
            // this.dataSource.select = () => shopping.regionFreights(this.props.solutionId);
            let name = this.state.name;
            return [
                <ul key="tab" className="nav nav-tabs">
                    <li className="pull-left">
                        <h4 style={{ marginBottom: 0 }}>{name}</h4>
                    </li>
                    <li className="pull-right">
                        <button className="btn btn-primary btn-sm" onClick={() => app.back()}>
                            <i className="icon-reply" />
                            <span>返回</span>
                        </button>
                    </li>
                </ul>,
                <table key="freights" ref={(e: HTMLTableElement) => this.freightListElement = this.freightListElement || e}></table>,
                <RegionFreightDialog key="dialog" dataSource={this.dataSource} ref={(e) => this.dialog = e || this.dialog} />
            ];
        }
    }

    let freightListPage: FreightListPage;
    ReactDOM.render(<FreightListPage ref={(e) => freightListPage = e || freightListPage}
        solutionId={page.data.id} name={page.data.name} />, page.element);

    page.showing.add((sender, args) => {
        freightListPage.state.name = args.name;
        freightListPage.state.solutionId = args.id;
        freightListPage.setState(freightListPage.state);
    })
}

