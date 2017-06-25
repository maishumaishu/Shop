/** 同城配送 页面*/
import FormValidator from 'formValidator';
import { default as shopping, CityFreight, } from 'services/shopping';
import * as ui from 'ui';

export default function (page: chitu.Page) {
    class InCitySendPage extends React.Component<{ cityFreight: CityFreight }, { cityFreight: CityFreight }>{
        validator: FormValidator;
        formElement: HTMLFormElement;
        constructor(props) {
            super(props);
            this.state = { cityFreight: this.props.cityFreight };
        }
        componentDidMount() {
            this.validator = new FormValidator(this.formElement, {
                SendAmount: { rules: ['required'] },
                Freight: { rules: ['required'] },
                SendRadius: { rules: ['required'] }
            })
        }
        save(): Promise<any> {
            if (!this.validator.validateForm())
                return Promise.reject({});

            let dataItem = this.state.cityFreight;
            return shopping.updateCityFreight(dataItem);
        }
        render() {
            let dataItem = this.state.cityFreight;
            return (
                <form className="form-horizontal" style={{ maxWidth: 800 }}
                    ref={(e: HTMLFormElement) => this.formElement = e || this.formElement}>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">配送金额</label>
                        <div className="col-sm-10">
                            <input name="SendAmount" type="number" className="form-control" placeholder="请输入配送金额"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    e.value = dataItem.SendAmount as any;
                                    e.onchange = () => {
                                        this.state.cityFreight.SendAmount = Number.parseFloat(e.value);
                                        this.setState(this.state);
                                    }
                                }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">配送费</label>
                        <div className="col-sm-10">
                            <input name="Freight" type="number" className="form-control" placeholder="请输入配送费"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    e.value = dataItem.Freight as any;
                                    e.onchange = () => {
                                        this.state.cityFreight.Freight = Number.parseFloat(e.value);
                                        this.setState(this.state);
                                    }
                                }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label">配送范围</label>
                        <div className="col-sm-10">
                            <div className="input-group">
                                <input name="SendRadius" type="number" className="form-control" placeholder="请输入配送范围"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.value = dataItem.SendRadius as any;
                                        e.onchange = () => {
                                            this.state.cityFreight.SendRadius = Number.parseFloat(e.value);
                                            this.setState(this.state);
                                        }
                                    }} />
                                <div className="input-group-addon">公里</div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button className="btn btn-primary"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick((e) => {
                                        return this.save();
                                    }, { toast: '保存成功' })
                                }}>保存</button>
                        </div>
                    </div>
                </form>
            );
        }
    }

    shopping.cityFreight().then(dataItem =>
        ReactDOM.render(<InCitySendPage cityFreight={dataItem} />, page.element)
    );

}