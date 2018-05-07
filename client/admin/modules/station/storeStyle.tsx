import { VirtualMobile } from "components/virtualMobile";
import { guid } from "share/common";
import { MobilePage } from "components/mobilePage";
import { State as ProductListState } from "components/productList/control";
import { StationService } from "../../../user/services/stationService";
export default function (page: chitu.Page) {
    ReactDOM.render(<StoreStylePage page={page} />, page.element);
}

class StoreStylePage extends React.Component<{ page: chitu.Page }, any> {
    constructor(props) {
        super(props);

    }

    render() {
        let productListData = {
            prodcutsCount: 10
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
            <div key={30}>
                <div className="col-lg-4" style={{ textAlign: 'center' }}>
                    <VirtualMobile style={{ transform: 'scale(0.9)' }} >
                        {/* <MobilePage pageData={homePageData} elementPage={this.props.page} /> */}
                    </VirtualMobile>
                </div>
                <div className="col-lg-4" style={{ textAlign: 'center' }}>
                    <VirtualMobile style={{ transform: 'scale(0.9)' }} >
                        {/* <MobilePage pageData={shoppingCartPageData} elementPage={this.props.page} /> */}
                    </VirtualMobile>
                </div>
                <div className="col-lg-4" style={{ textAlign: 'center' }}>
                    <VirtualMobile style={{ transform: 'scale(0.9)' }} />
                </div>
            </div>
        ]
    }
}