import { VirtualMobile } from "components/virtualMobile";
import { DesignTimeUserApplication } from "components/designTimeUserApplication";
import { MobilePage } from "components/mobilePage";
// import { State as StyleControlState, StyleType } from 'components/style/control';
import { UserPage as UserPage } from 'user/application';

interface Props extends React.Props<MobilePageDisplay> {
    pageData: PageData,
    style?: React.CSSProperties,
    enableMock?: boolean,
}
interface State {
    pageData: PageData
}
export class MobilePageDisplay extends React.Component<Props, State>{

    mobilePage: MobilePage;
    userApp: DesignTimeUserApplication;
    virtualMobile: VirtualMobile;
    constructor(props) {
        super(props);
        this.state = { pageData: this.props.pageData };
    }
    changeStyle(style: StyleColor): any {
        this.mobilePage.styleColor = style;
        this.userApp.loadCSS(style);
    }
    renederVirtualMobile(screenElement: HTMLElement, pageData: PageData) {
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
        let { style } = this.props;
        return <VirtualMobile style={style} ref={(e) => {
            this.virtualMobile = e || this.virtualMobile;
            setTimeout(() => {
                this.renederVirtualMobile(this.virtualMobile.screenElement, pageData);
            }, 100);
        }}>

        </VirtualMobile>
    }
}