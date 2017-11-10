/** 店铺概况　页面 */
// import { Button, ImageBox } from 'common/controls';
import { default as site } from 'site'
import { StationService } from 'adminServices/station';
export default async function (page: chitu.Page) {
    // page.element.className = 'admin-pc';
    requirejs([`css!${page.routeData.actionPath}.css`]);

    let station = page.createService(StationService);

    class StationIndexPage extends React.Component<{ store: Store }, { store: Store }>{
        constructor(props) {
            super(props);
            this.state = { store: this.props.store };
        }
        userClientUrl() {

        }
        save() {
            return station.saveStore(this.state.store);
        }
        render() {
            let { store } = this.state;
            return (
                <div className="station-index">
                    <ul className="nav nav-tabs">
                        <li className="dropdown pull-right">
                            <button className="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">
                                访问店铺
                            </button>
                            <div className="dropdown-menu dropdown-menu-right" style={{ padding: 20 }}>
                                <div style={{ width: '100%', textAlign: 'center' }}>手机扫码访问</div>
                                <img src="https://h5.youzan.com/v2/common/url/create?type=homepage&kdt_id=764664" style={{ width: 180, height: 180 }} />
                                <div style={{ width: '100%' }}>
                                    <div className="pull-left">复制页面链接</div>
                                    <div className="pull-right">
                                        <a href={site.userClientUrl} target="_blank">电脑访问</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="pull-right">
                            <button className="btn btn-sm btn-primary"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(() => this.save(), { toast: "保存成功" });
                                }}>
                                <i className="icon-save"></i>
                                <span>保存</span>
                            </button>
                        </li>
                    </ul>
                    <div className="clearfix">
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-sm-12">
                            <h4>基本信息</h4>
                        </div>
                    </div>
                    <div className="row from-group">
                        <div className="col-lg-4 col-md-4">
                            <label className="col-lg-3">店铺名称*</label>
                            <div className="col-lg-9">
                                <input className="form-control" value={store.Name}
                                    onChange={(e) => store.Name = (e.target as HTMLInputElement).value} />
                            </div>
                        </div>

                    </div>

                    {/* <div className="well summary">
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>微页面</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>商品</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>昨日浏览量</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>昨日访客</span>
                        </div>
                        <div className="pull-left text-center" style={{ width: '20%' }}>
                            <div className="number">0</div>
                            <span>昨日访客</span>
                        </div>
                        <div className="clearfix"></div>
                    </div> */}
                </div>
            );
        }
    }

    let store = await station.store();
    ReactDOM.render(<StationIndexPage store={store} />, page.element);
}