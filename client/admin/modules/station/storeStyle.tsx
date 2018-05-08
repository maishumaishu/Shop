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

let allColors: StyleColor[] = ['default', 'red', 'green'];
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

        debugger;
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
        let { store } = this.state;
        let currentColor: StyleColor = 'default';
        if (store != null && store.Data.Style != null) {
            currentColor = store.Data.Style;
            debugger;
        }

        return [
            <ul key={10} style={{ margin: 0 }} >
                <li className="pull-right">
                    <button className="btn btn-sm btn-primary">
                        <i className="icon-eye-open"></i>
                        <span>预览</span>
                    </button>
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
            <div className="style-editor">
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
            <div key={30}>
                <div className="col-lg-4" style={{ textAlign: 'center' }}>
                    <MobilePageDisplay style={{ transform: 'scale(0.9)' }} pageData={homePageData}
                        ref={(e) => this.homePage = e || this.homePage} />
                </div>
                <div className="col-lg-4" style={{ textAlign: 'center' }}>
                    <MobilePageDisplay style={{ transform: 'scale(0.9)' }} pageData={shoppingCartPageData}
                        enableMock={true} ref={(e) => this.shoppingCartPage = e || this.shoppingCartPage} />
                </div>
                <div className="col-lg-4" style={{ textAlign: 'center' }}>
                    <MobilePageDisplay pageData={{ controls: [] } as PageData} style={{ transform: 'scale(0.9)' }}
                        ref={(e) => this.productPage = e || this.productPage} />
                </div>
            </div>
        ]
    }
}