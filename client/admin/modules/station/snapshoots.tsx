import { VirtualMobile } from "components/virtualMobile";
import { createGridView, boundField, commandField } from "admin/myWuZhui";
import 'wuzhui';
import app from "admin/application";
import { StationService } from "admin/services/station";
import { parseUrlParams } from "share/common";
import { MobilePageDisplay } from "admin/controls/mobilePageDisplay";
import { siteMap } from "admin/pageNodes";
let w = wuzhui;

app.loadCSS(siteMap.nodes.station_home_snapshoots.name);
export default class SnapshootList extends React.Component<any, any> {
    mobilePageDisplater: MobilePageDisplay;
    snapshootTable: HTMLTableElement;
    async show(pageDataId) {
        let station = app.createService(StationService);
        let pageData = await station.pageDataById(pageDataId);
        this.mobilePageDisplater.renederMobilePage(pageData);
    }
    componentDidMount() {
        let station = app.createService(StationService);
        let dataSource = new wuzhui.DataSource({
            select(args) {
                let urlParams = location.hash.split('?')[1];
                let params = parseUrlParams(urlParams);
                return station.snapshootList(params.pageDataId);
            }
        })
        let gridView = new w.GridView({
            element: this.snapshootTable,
            dataSource,
            columns: [
                new w.BoundField({ dataField: 'name', headerText: '名称' }),
                new w.BoundField({ dataField: 'createDateTime', headerText: '日期', dataFormatString: '{g}' }),
                new w.CustomField({
                    createItemCell: (dataItem: PageData) => {
                        let cell = new w.GridViewCell();
                        ReactDOM.render([
                            <button key={10} className="btn btn-minier btn-info"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    ui.buttonOnClick(e, () => {
                                        return this.show(dataItem.id);
                                    })
                                }}>
                                <i className=" icon-folder-open-alt"></i>
                                <span>查看</span>
                            </button>,
                            <button key={20} className="btn btn-minier btn-success">
                                <i className="icon-undo"></i>
                                <span>还原</span>
                            </button>,
                            <button key={30} className="btn btn-minier btn-danger">
                                <i className="icon-trash"></i>
                            </button>
                        ], cell.element)
                        return cell;
                    },
                    itemStyle: { textAlign: 'center' } as CSSStyleDeclaration,
                    headerText: "操作"
                })
            ]
        })
    }
    render() {
        return [
            <div key={20} >
                <ul style={{ margin: 0 }} className="clearfix">
                    <li className="pull-right">
                        <button className="btn btn-sm btn-primary" onClick={() => app.back()}>
                            <i className="icon-reply" />
                            <span>返回</span>
                        </button>
                    </li>
                </ul>
                <hr style={{ margin: 0 }} />

                <div key={10} style={{ position: 'absolute', marginTop: 20 }}>
                    <MobilePageDisplay pageData={{ controls: [] } as PageData}
                        displayMobile={false}
                        ref={(e) => this.mobilePageDisplater = e || this.mobilePageDisplater} />
                    <div style={{ position: 'absolute', width: 320, textAlign: 'center', marginTop: 20 }}>
                        <span>快照日期</span>
                        <span>2018-5-10 21:6</span>
                    </div>
                </div>,
                <div style={{ paddingLeft: 340 }}>
                    <table className="table table-striped table-bordered table-hover"
                        ref={(e: HTMLTableElement) => this.snapshootTable = e || this.snapshootTable}>
                    </table>
                </div>
            </div>
        ]
    }
}