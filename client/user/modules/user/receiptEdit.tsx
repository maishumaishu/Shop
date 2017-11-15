import { defaultNavBar, app } from 'site';
import { ShoppingService } from 'services/shoppingService';
import { FormValidator, rules } from 'dilu';
import { RegionsPageRouteValues } from 'modules/user/regions';
import * as ui from 'ui';

export interface ReceiptEditPageArguments {
    id?: string,
    receipt?: ReceiptInfo,
    onSaved: (receipt: ReceiptInfo) => void
}
export default async function (page: chitu.Page) {

    let shop = page.createService(ShoppingService);


    let routeValues = page.routeData.values as ReceiptEditPageArguments;
    let receiptInfo: ReceiptInfo = await getReceiptInfo(routeValues, shop);

    let receiptEditPage: ReceiptEditPage;
    ReactDOM.render(<ReceiptEditPage receiptInfo={receiptInfo} elementPage={page} onSaved={routeValues.onSaved}
        ref={(e) => receiptEditPage = e || receiptEditPage} />, page.element);

    page.showing.add(async () => {
        let receiptInfo: ReceiptInfo = await getReceiptInfo(page.routeData.values, shop);
        receiptEditPage.state.receiptInfo = receiptInfo;
        receiptEditPage.setState(receiptEditPage.state);
    })

}

async function getReceiptInfo(args: ReceiptEditPageArguments, shop: ShoppingService) {
    let receiptInfo: ReceiptInfo;
    let routeValues = args;
    let id = routeValues.id;
    if (id) {
        receiptInfo = await shop.receiptInfo(id);
    }
    else {
        receiptInfo = {} as ReceiptInfo;
    }

    return receiptInfo;
}

interface Props extends React.Props<ReceiptEditPage> {
    receiptInfo?: ReceiptInfo,
    elementPage: chitu.Page,
    onSaved: (receiptInfo: ReceiptInfo) => void
}
class ReceiptEditPage extends React.Component<
    Props,
    { receiptInfo: ReceiptInfo }>{
    private formElement: HTMLFormElement;
    private validator: FormValidator;
    constructor(props) {
        super(props);

        let receiptInfo = this.props.receiptInfo || {} as ReceiptInfo;
        this.state = { receiptInfo: receiptInfo };
    }
    componentDidMount() {
        // let fromElement = page.element.querySelector('form') as HTMLElement;
        // this.validator = new FormValidator(fromElement, {
        //     Name: { rules: ['required'], display: '地址名称', messages: { required: '请输入地址名称' } },
        //     Consignee: { rules: ['required'], display: '收货人', messages: { required: '请输入收货人姓名' } },
        //     Mobile: { rules: ['required'], display: '手机号码', messages: { required: '请输入手机号码' } },
        //     Address: { rules: ['required'], display: '详细地址', messages: { required: '请输入详细地址' } },
        //     RegionId: { rules: ['required'], display: '地区', messages: { required: '请选择地区' } },
        // });
        let { required } = rules;
        let e = this.formElement;
        this.validator = new FormValidator(
            { element: e["Name"], rules: [required("请输入地址名称")] },
            { element: e["Consignee"], rules: [required('请输入收货人姓名')] },
            { element: e["Mobile"], rules: [required('请输入手机号码')] },
            { element: e["Address"], rules: [required('请输入详细地址')] },
            { element: e["RegionId"], rules: [required('请选择地区')] },
        )

    }
    onInputChange(event: React.FormEvent) {
        let input = event.target as HTMLInputElement;
        let value: any;
        if (input.type == 'checkbox') {
            value = input.checked;
        }
        else {
            value = input.value;
        }

        this.state.receiptInfo[input.name] = value;
        this.setState(this.state);
    }
    async saveReceipt(): Promise<any> {
        let isValid = await this.validator.check();
        if (isValid == false) {
            return Promise.reject<any>(null);
        }

        let shop = this.props.elementPage.createService(ShoppingService); //this.props.shop;
        return shop.saveReceiptInfo(this.state.receiptInfo).then(data => {
            Object.assign(this.state.receiptInfo, data);
            this.setState(this.state);

            if (this.props.onSaved) {
                this.props.onSaved(this.state.receiptInfo);
                // app.back();
            }
            return data;
        });
    }
    changeRegion() {
        let r = this.state.receiptInfo;
        let routeValues: RegionsPageRouteValues = {
            province: { Id: r.ProvinceId, Name: r.ProvinceName }, city: { Id: r.CityId, Name: r.CityName },
            county: { Id: r.CountyId, Name: r.CountyName },
            selecteRegion: (province, city, county) => {
                r.ProvinceName = province.Name;
                r.ProvinceId = province.Id;
                r.CityName = city.Name;
                r.CityId = city.Id;
                r.CountyName = county.Name;
                r.CountyId = county.Id;
                r.RegionId = county.Id;
                this.setState(this.state);
            }
        };
        app.redirect('user_regions', routeValues);
    }
    render() {
        let receiptInfo = this.state.receiptInfo;//请选择地区
        let region = "";
        if (receiptInfo.ProvinceName && receiptInfo.CityName && receiptInfo.CountyName) {
            region = `${receiptInfo.ProvinceName} ${receiptInfo.CityName} ${receiptInfo.CountyName}`;
        }

        return [
            <header key="header">
                {defaultNavBar(this.props.elementPage, { title: '编辑地址' })}
            </header>,
            <section key="view0">
                <div className="container">
                    <form data-bind="with:receipt"
                        ref={(e: HTMLFormElement) => this.formElement = e || this.formElement}
                        className="form-horizontal">
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                <span className="color-red">*</span> 地址名称
                        </label>
                            <div className="col-xs-9">
                                <input type="text" name="Name" className="form-control"
                                    value={receiptInfo.Name || ''}
                                    onChange={(e) => this.onInputChange(e)}
                                    placeholder="方便区分收货地址，例如：公司、家" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                <span className="color-red">*</span> 收货人
                        </label>
                            <div className="col-xs-9">
                                <input type="text" name="Consignee" className="form-control"
                                    value={receiptInfo.Consignee || ''}
                                    onChange={(e) => this.onInputChange(e)}
                                    placeholder="请填写收货人的姓名" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                <span className="color-red">*</span> 手机号码
                            </label>
                            <div className="col-xs-9">
                                <input type="text" name="Mobile" className="form-control"
                                    value={receiptInfo.Mobile || ''}
                                    onChange={(e) => this.onInputChange(e)}
                                    data-bind="value:Mobile,textInput:Mobile" placeholder="请填写收货人手机号码" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                <span className="color-red">*</span> 所在地区
                            </label>
                            <div className="col-xs-9"
                                onClick={() => this.changeRegion()}>
                                {/* <span style={{ paddingRight: 10 }}>
                                    {receiptInfo.ProvinceName} {receiptInfo.CityName} {receiptInfo.CountyName}
                                    <input type="hidden" value={receiptInfo.RegionId || ''} readOnly={true} />
                                </span>
                                <i className="icon-chevron-right"></i> */}
                                <input type="text" className="form-control" placeholder="请选择地区" value={region} />
                                <input type="hidden" value={receiptInfo.RegionId || ''} readOnly={true} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                <span className="color-red">*</span> 详细地址
                        </label>
                            <div className="col-xs-9">
                                <input type="text" name="Address" className="form-control"
                                    value={receiptInfo.Address || ''}
                                    onChange={(e) => this.onInputChange(e)}
                                    data-bind="value:Address,textInput:Address" placeholder="请填写收货地址" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                邮编
                        </label>
                            <div className="col-xs-9">
                                <input type="text" name="PostalCode" className="form-control"
                                    placeholder="请输入邮政编码"
                                    value={receiptInfo.PostalCode || ''}
                                    onChange={(e) => this.onInputChange(e)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                固定电话
                        </label>
                            <div className="col-xs-9">
                                <input name="Phone" className="form-control" placeholder="请输入固定电话号码"
                                    value={receiptInfo.Phone || ''} onChange={(e) => this.onInputChange(e)} />
                            </div>
                        </div>
                        <div className="form-group" style={{ display: 'block' }}>
                            <label className="col-xs-3" style={{ paddingRight: 0 }}>
                                设为默认
                        </label>
                            <div className="col-xs-9 pull-right" style={{ textAlign: 'right' }}>
                                <input type="checkbox" name="IsDefault"
                                    onChange={(e) => this.onInputChange(e)}
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;
                                        e.checked = receiptInfo.IsDefault;
                                    }} />
                            </div>
                        </div>
                    </form>

                    <div className="form-group">
                        <span className="color-red">*</span>为必填项目
                </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block"
                            ref={(o: HTMLButtonElement) => {
                                if (!o) return;
                                o.onclick = ui.buttonOnClick(() => {
                                    return this.saveReceipt();
                                }, { toast: '保存地址成功' });

                            }}>保存</button>
                    </div>
                </div>
            </section>
        ]
    }
}
