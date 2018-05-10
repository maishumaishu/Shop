import { VirtualMobile } from "components/virtualMobile";
import { DesignTimeUserApplication } from "components/designTimeUserApplication";
import { MobilePage } from "components/mobilePage";
import { UserPage as UserPage } from 'user/application';
import { loadControlCSS } from "admin/controls/utiltiy";

loadControlCSS('mobilePageDisplay');

interface Props extends React.Props<MobilePageDisplay> {
    pageData: PageData,
    // style?: React.CSSProperties,
    displayMobile?: boolean,
    scale?: number,
    enableMock?: boolean,
    color?: string
}
interface State {
    pageData: PageData
}
export class MobilePageDisplay extends React.Component<Props, State>{

    mobilePage: MobilePage;
    userApp: DesignTimeUserApplication;
    screenElement: HTMLElement;

    constructor(props) {
        super(props);
        this.state = { pageData: this.props.pageData };
    }
    changeStyle(style: StyleColor): any {
        this.mobilePage.styleColor = style;
        this.userApp.loadCSS(style);
    }
    renederMobilePage(screenElement: HTMLElement, pageData: PageData) {
        console.assert(screenElement != null);

        if (this.userApp == null) {
            this.userApp = new DesignTimeUserApplication(screenElement, this.props.enableMock);
            this.userApp.designPageNode.action = (page: UserPage) => {
                ReactDOM.render(<MobilePage pageData={pageData}
                    elementPage={page}
                    ref={(e) => this.mobilePage = e || this.mobilePage}
                />, page.element);
            }

            this.userApp.showDesignPage();
        }
        else {
            this.userApp.currentPage.reload();
        }

    }

    render() {
        let { pageData } = this.state;
        let { scale, displayMobile, color } = this.props;
        displayMobile = displayMobile == null ? true : displayMobile;

        return displayMobile ?
            <VirtualMobile color={color} scale={scale} ref={(e) => {
                this.screenElement = e != null ? e.screenElement : this.screenElement;
                setTimeout(() => {
                    this.renederMobilePage(this.screenElement, pageData);
                }, 100);
            }}>
            </VirtualMobile> :

            <div className="mobile-page-display" style={{ transform: `scale(${scale})` }}
                ref={(e: HTMLElement) => {
                    this.screenElement = e || this.screenElement;
                    setTimeout(() => {
                        this.renederMobilePage(this.screenElement, pageData);
                    }, 100);
                }} >
            </div>
    }
}