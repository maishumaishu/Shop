import { WeiXinService } from 'adminServices/weixin';

export default async function (page: chitu.Page) {

    let weixin = page.createService(WeiXinService);

    class SettingPage extends React.Component<{ setting: WeiXinSetting }, { setting: WeiXinSetting }>{
        constructor(props) {
            super(props);
            this.state = { setting: this.props.setting };
        }
        save() {
            return weixin.saveSetting(this.state.setting);
        }
        render() {
            let setting = this.state.setting;
            return (
                <div className="page-content">
                    <h4>Token设置</h4>
                    <br />
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>Token：</label>
                        </div>
                        <div className="col-xs-10">
                            <input name="Token" className="form-control" value={setting.Token || ''}
                                onChange={(e) => {
                                    setting.Token = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>AppId：</label>
                        </div>
                        <div className="col-xs-10">
                            <input name="AppId" className="form-control" value={setting.AppId || ''}
                                onChange={(e) => {
                                    setting.AppId = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-xs-2 name">
                            <label>AppSecret：</label>
                        </div>
                        <div className="col-xs-10">
                            <input name="AppSecret" className="form-control" value={setting.AppSecret || ''}
                                onChange={(e) => {
                                    setting.AppSecret = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }} />
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
                            <input name="PartnerKey" className="form-control" value={setting.PartnerKey || ''}
                                onChange={(e) => {
                                    setting.PartnerKey = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }} />
                        </div>
                    </div>
                    <div className="form-actions text-right">
                        <button className="btn btn-info" type="button"
                            ref={(e: HTMLButtonElement) => e ? e.onclick = ui.buttonOnClick(() => this.save(), {
                                toast: '保存成功'
                            }) : null}>
                            <i className="icon-ok bigger-110"></i>
                            保存
                </button>
                    </div>
                </div>
            );
        }
    }

    let setting = await weixin.getSetting();
    ReactDOM.render(<SettingPage setting={setting} />, page.element)

}

