import { VirtualMobile } from "components/virtualMobile";
import { guid } from "share/common";
import { MobilePage } from "components/mobilePage";
import { State as ProductListState } from "components/productList/control";
import { StationService } from "user/services/stationService";
import { MobilePageDisplay } from "admin/controls/mobilePageDisplay";
import app from "admin/application";
import { MemberService } from "admin/services/member";
import site from "admin/site";
import tips from "admin/tips";

export default function (page: chitu.Page) {
    ReactDOM.render(<StoreStylePage page={page} />, page.element);
}

let allColors: StyleColor[] = ['default', 'red', 'green', 'pink', 'goldenrod'];
class StoreStylePage extends React.Component<{ page: chitu.Page }, { store?: Store }> {
    productPage: MobilePageDisplay;
    shoppingCartPage: MobilePageDisplay;
    homePage: MobilePageDisplay;

    constructor(props) {
        super(props);
        this.state = {};
        app.loadCSS(this.props.page.name);
    }

    setCurrentStyle(name: StyleColor) {
        [this.productPage, this.shoppingCartPage, this.homePage].forEach(o => {
            o.changeStyle(name);
        })

        if (this.state.store == null)
            return;

        this.state.store.Data.Style = name;
        this.setState(this.state);
    }

    save() {
        let member = this.props.page.createService(MemberService);
        let { store } = this.state;
        if (store == null) {
            return;
        }
        return member.saveStore(store);
    }

    async componentDidMount() {
        let member = this.props.page.createService(MemberService);
        let appId = site.appIdFromLocation();
        let store = await member.store(appId);
        this.state.store = store;
        this.setState(this.state);
    }
    render() {
        let productListData = {
            productsCount: 10
        } as ProductListState;

        let station = this.props.page.createService(StationService);
        let homePageData: PageData = station.pages.defaultPages.home;
        let shoppingCartPageData = station.pages.defaultPages.shoppingCart;
        let productPageData: PageData = {
            controls: [
                {
                    controlId: guid(), controlName: 'carousel', position: 'view',
                    data: {
                        items: [{ image: "27260990-305a-02bc-7b43-aff92038fd6d" }]
                    }
                },
                {
                    controlId: guid(), controlName: 'productInfo', position: 'view',
                    data: {
                        "product": {
                            "Id": "417f106d-d15c-4d11-a08f-bfb6eb9a4eb4",
                            "Name": "晶璨花瓶—shiny",
                            "Price": 59, "Fields": [],
                            "Arguments": [
                                { "key": "工艺", "value": "手工吹制" },
                                { "key": "材质", "value": "材质" },
                                { "key": "花瓶口径", "value": "8.2CM" },
                                { "key": "花瓶高度", "value": "22CM" },
                                { "key": "花瓶宽度", "value": "17CM" },
                                { "key": "备注", "value": "手工测量，存在些许误差" }
                            ],
                            "ImagePath": "2c5509ad-9aee-3458-71ff-538e00d85086",
                            "ProductCategoryId": "9f8b32a1-070e-4b70-abd2-3adc554b6a18",
                            "ProductCategoryName": "配件"
                        }, "hideProperties": false
                    }
                },
                { controlId: guid(), controlName: 'productInfoBottomBar', position: 'footer' }
            ]
        }

        let { store } = this.state;
        let currentColor: StyleColor = 'default';
        if (store != null && store.Data.Style != null) {
            currentColor = store.Data.Style;
        }
        let scale = 0.85;
        return [
            <ul key={10} style={{ margin: 0 }} >
                <li className="pull-right">
                    <button className="btn btn-sm btn-primary"
                        ref={(e: HTMLButtonElement) => {
                            if (!e) return;
                            ui.buttonOnClick(e, () => {
                                return this.save();
                            }, { toast: tips.saveSuccess })
                        }}>
                        <i className="icon-save"></i>
                        <span>保存</span>
                    </button>
                </li>
                <li className="clearfix">
                </li>
            </ul>,
            <hr key={20} style={{ marginTop: 0 }} />,
            <div key={25} className="style-editor">
                <div className="style-solutions">
                    <header>选择配色方案</header>
                    <ul>
                        {allColors.map(o =>
                            <li key={o} className={o == currentColor ? "btn-link active" : 'btn-link'}
                                onClick={() => this.setCurrentStyle(o)}>
                                <div className={o}></div>
                            </li>
                        )}
                    </ul>
                    <div className="clearfix"></div>
                </div>
            </div>,
            <div key={30} className="row">
                <div className="col-md-4" style={{ textAlign: 'center', width: '33.33' }}>
                    <MobilePageDisplay style={{ transform: `scale(${scale})` }} pageData={homePageData}
                        ref={(e) => this.homePage = e || this.homePage} />
                </div>
                <div className="col-md-4" style={{ textAlign: 'center', width: '33.33' }}>
                    <MobilePageDisplay style={{ transform: `scale(${scale})` }} pageData={shoppingCartPageData}
                        enableMock={true} ref={(e) => this.shoppingCartPage = e || this.shoppingCartPage} />
                </div>
                <div className="col-md-4" style={{ textAlign: 'center', width: '33.33' }}>
                    <MobilePageDisplay pageData={productPageData} style={{ transform: `scale(${scale})` }}
                        ref={(e) => this.productPage = e || this.productPage} />
                </div>
            </div>
        ]
    }
}