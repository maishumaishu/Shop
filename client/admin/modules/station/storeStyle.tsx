import { VirtualMobile } from "components/virtualMobile";
import { guid } from "share/common";
import { MobilePage } from "components/mobilePage";
import { State as ProductListState } from "components/productList/control";
import { StationService } from "user/services/stationService";
import { MobilePageDisplay } from "admin/controls/mobilePageDisplay";
import app from "admin/application";

export default function (page: chitu.Page) {
    ReactDOM.render(<StoreStylePage page={page} />, page.element);
}

export type StyleType = 'default' | 'red';

class StoreStylePage extends React.Component<{ page: chitu.Page }, any> {
    productPage: MobilePageDisplay;
    shoppingCartPage: MobilePageDisplay;
    homePage: MobilePageDisplay;

    constructor(props) {
        super(props);
        debugger;
        app.loadCSS(this.props.page.name);
    }
    setCurrentStyle(name: StyleType) {
        // this.state.style = name;
        // this.setState(this.state);
        [this.productPage, this.shoppingCartPage, this.homePage].forEach(o => {
            o.changeStyle(name);
        })
    }
    styleItem(name: StyleType) {
        let currentStyle = (this.state || { style: null }).style || 'default';
        return (
            <li className={currentStyle == name ? "active" : ''} onClick={() => this.setCurrentStyle(name)}>
                <div className={name}></div>
            </li>
        );
    }
    render() {
        let productListData = {
            productsCount: 10
        } as ProductListState;

        let station = this.props.page.createService(StationService);
        let homePageData: PageData = station.pages.defaultPages.home;
        let shoppingCartPageData = station.pages.defaultPages.shoppingCart;

        return [
            <ul key={10} style={{ margin: 0 }} >
                <li className="pull-right">
                    <button className="btn btn-sm btn-primary">
                        <i className="icon-eye-open"></i>
                        <span>预览</span>
                    </button>
                    <button className="btn btn-sm btn-primary">
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
                        {this.styleItem('default')}
                        {this.styleItem('red')}
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