import { WeiXinService } from 'services/weixin';

const label_max_width = 120;
const input_max_width = 300;

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
            return [
                <ul key={10} className="nav nav-tabs">
                    <li className="pull-right">
                        <button className="btn btn-primary btn-sm"
                            ref={(e: HTMLButtonElement) => {
                                if (!e) return;
                                ui.buttonOnClick(e, () => this.save(), {});
                            }}>
                            <i className="icon-save" />
                            <span>保存</span>
                        </button>
                    </li>
                </ul>,
                <div key={20} className="well">
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            AppId
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <input name="AppId" className="form-control" value={setting.AppId || ''}
                                readOnly={true}
                                onChange={(e) => {
                                    setting.AppId = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }} />
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            AppSecret
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <input name="AppSecret" className="form-control" value={setting.AppSecret || ''}
                                readOnly={true}
                                onChange={(e) => {
                                    setting.AppSecret = (e.target as HTMLInputElement).value;
                                    this.setState(this.state);
                                }} />
                        </div>
                    </div>
                </div>,
                // <div key={30} className="page-content">
                //     <h4>Token设置</h4>
                //     <br />
                //     <div className="row form-group">
                //         <div className="col-xs-2 name">
                //             <label>Token：</label>
                //         </div>
                //         <div className="col-xs-10">
                //             <input name="Token" className="form-control" value={setting.Token || ''}
                //                 onChange={(e) => {
                //                     setting.Token = (e.target as HTMLInputElement).value;
                //                     this.setState(this.state);
                //                 }} />
                //         </div>
                //     </div>
                //     <div className="row form-group">
                //         <div className="col-xs-2 name">
                //             <label>AppId：</label>
                //         </div>
                //         <div className="col-xs-10">
                //             <input name="AppId" className="form-control" value={setting.AppId || ''}
                //                 onChange={(e) => {
                //                     setting.AppId = (e.target as HTMLInputElement).value;
                //                     this.setState(this.state);
                //                 }} />
                //         </div>
                //     </div>
                //     <div className="row form-group">
                //         <div className="col-xs-2 name">
                //             <label>AppSecret：</label>
                //         </div>
                //         <div className="col-xs-10">
                //             <input name="AppSecret" className="form-control" value={setting.AppSecret || ''}
                //                 onChange={(e) => {
                //                     setting.AppSecret = (e.target as HTMLInputElement).value;
                //                     this.setState(this.state);
                //                 }} />
                //         </div>
                //     </div>
                //     <hr />
                //     <h4>微支付设置</h4>
                //     <br />
                //     <div className="row form-group">
                //         <div className="col-xs-2 name">
                //             <label>PartnerKey：</label>
                //         </div>
                //         <div className="col-xs-10">
                //             <input name="PartnerKey" className="form-control" value={setting.PartnerKey || ''}
                //                 onChange={(e) => {
                //                     setting.PartnerKey = (e.target as HTMLInputElement).value;
                //                     this.setState(this.state);
                //                 }} />
                //         </div>
                //     </div>
                //     <div className="form-actions text-right">
                //         <button className="btn btn-info" type="button"
                //             ref={(e: HTMLButtonElement) => e ? e.onclick = ui.buttonOnClick(() => this.save(), {
                //                 toast: '保存成功'
                //             }) : null}>
                //             <i className="icon-ok bigger-110"></i>
                //             保存
                //         </button>
                //     </div>
                // </div>
            ]
        }
    }

    let setting = await weixin.getSetting();
    ReactDOM.render(<SettingPage setting={setting} />, page.element)

}

