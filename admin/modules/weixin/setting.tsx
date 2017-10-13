import weixin from 'services/weixin';

export default function (page: chitu.Page) {

    weixin.getSetting().then(data => {
        debugger;
    });

    class SettingPage extends React.Component<{}, {}>{
        render() {
            return (
                <div className="page-content">
                    <h4>Token设置</h4>
                    <br />
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>Token：</label>
                        </div>
                        <div className="col-xs-10">
                            <input data-bind="value:Token" name="Token" className="form-control" />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>AppId：</label>
                        </div>
                        <div className="col-xs-10">
                            <input data-bind="value:AppId" name="AppId" className="form-control" />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>AppSecret：</label>
                        </div>
                        <div className="col-xs-10">
                            <input data-bind="value:AppSecret" name="AppSecret" className="form-control" />
                        </div>
                    </div>
                    <hr />
                    <h4>微支付设置</h4>
                    <br />
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>PartnerKey：</label>
                        </div>
                        <div className="col-xs-10">
                            <input data-bind="value:PartnerKey" name="PartnerKey" className="form-control" />
                        </div>
                    </div>
                    <div className="form-actions text-right">
                        <button className="btn btn-info" type="button" data-bind="click: SaveSetting">
                            <i className="icon-ok bigger-110"></i>
                            保存
                </button>
                    </div>
                </div>
            );
        }
    }

    ReactDOM.render(<SettingPage />, page.element)

}

