/** 店铺概况　页面 */
// import { Button, ImageBox } from 'common/controls';
import { default as site } from 'site'
export default function (page: chitu.Page) {
    page.element.className = 'admin-pc';
    requirejs([`css!${page.routeData.actionPath}.css`]);
    class StationIndexPage extends React.Component<{}, {}>{
        userClientUrl() {

        }
        render() {
            return (
                <div>
                    <div className="pull-right">
                        <div className="dropdown">
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
                        </div>
                    </div>
                    <div className="clearfix">
                    </div>

                    <div className="well summary">
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
                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<StationIndexPage />, page.element);
}