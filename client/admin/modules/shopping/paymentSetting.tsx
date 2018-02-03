import { FormValidator, rules } from 'dilu';

const label_max_width = 160;
const input_max_width = 300;
export default function (page: chitu.Page) {

    class PaymentSettingPage extends React.Component<any,
        { enableWeixinPayment: boolean, enableTransfer: boolean }>{

        private validator: FormValidator;
        private partnerKeyInput: HTMLInputElement;
        private transferTipsInput: HTMLAreaElement;
        constructor(props) {
            super(props);

            this.state = { enableWeixinPayment: false, enableTransfer: false };

        }
        async save() {
            let isValid = await this.validator.check();
            if (!isValid)
                return;

            return Promise.resolve();
        }
        componentDidMount() {
            let { required } = rules;
            this.validator = new FormValidator(
                {
                    element: this.partnerKeyInput, rules: [required()],
                    condition: () => {
                        return !this.partnerKeyInput.disabled;
                    }
                },
                {
                    element: this.transferTipsInput, rules: [required()],
                    condition: () => {
                        return !(this.transferTipsInput as any).disabled;
                    }
                }
            )
        }
        render() {
            let { enableTransfer, enableWeixinPayment } = this.state;
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
                            微支付应用 ID
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <input type="text" className="form-control" disabled={!enableWeixinPayment}
                                ref={(e: HTMLInputElement) => this.partnerKeyInput = e || this.partnerKeyInput}
                                placeholder="请输入微信支付商户密钥" />
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            {/* PartnerKey */}
                            微支付商户密钥
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <input type="text" className="form-control" disabled={!enableWeixinPayment}
                                ref={(e: HTMLInputElement) => this.partnerKeyInput = e || this.partnerKeyInput}
                                placeholder="请输入微信支付商户密钥" />
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                        </label>
                        <label className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <input type="checkbox" checked={enableWeixinPayment}
                                onChange={(e) => {
                                    this.state.enableWeixinPayment = (e.target as HTMLInputElement).checked;
                                    this.setState(this.state);
                                }} />
                            开启微信支付
                        </label>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                            {/* PartnerKey */}
                            转账提示
                        </label>
                        <div className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <textarea className="form-control" multiple={true} style={{ height: 80 }}
                                ref={(e: HTMLAreaElement) => this.transferTipsInput = e || this.transferTipsInput}
                                disabled={!enableTransfer} placeholder="请输入提示用户进行转账的留言" />
                        </div>
                    </div>
                    <div className="row form-group">
                        <label className="col-md-4" style={{ width: label_max_width }}>
                        </label>
                        <label className="col-md-8" style={{ maxWidth: input_max_width }}>
                            <input type="checkbox" checked={enableTransfer}
                                onChange={(e) => {
                                    this.state.enableTransfer = (e.target as HTMLInputElement).checked;
                                    this.setState(this.state);
                                }} />
                            允许个人转账支付
                        </label>
                    </div>
                </div>
            ];
        }
    }

    ReactDOM.render(<PaymentSettingPage />, page.element);
}