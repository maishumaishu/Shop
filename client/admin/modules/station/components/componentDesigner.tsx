import { MobilePageDesigner } from 'mobilePageDesigner';
import { guid } from 'services/service';
import { StationService } from 'services/station';
import { StationService as UserStation } from 'userServices/stationService';
import { default as StyleControl } from 'mobileComponents/style/control';

interface Props extends React.Props<ComponentDesigner> {
    controlName: string,
    target?: 'header' | 'footer' | 'default',
    elementPage: chitu.Page
}

interface State {
    pageData: PageData
}

/**
 * 组件设计器,数据以组件名称保存，即多个组件实例使用一份数据。
 */
export class ComponentDesigner extends React.Component<Props, State>{
    private station: StationService;
    constructor(props) {
        super(props);
        this.station = this.props.elementPage.createService(StationService);
        this.state = { pageData: {} };
        this.station.controlData(this.props.controlName).then(async controlData => {

            let pageData: PageData = this.state.pageData;
            let target = this.props.target || 'default';
            if (controlData == null)
                controlData = { controlId: guid(), controlName: this.props.controlName, data: {} };

            controlData.selected = true;
            switch (target) {
                case 'header':
                    pageData.header = { controls: [controlData] };
                    break;
                case 'footer':
                    pageData.footer = { controls: [controlData] };
                    break;
                case 'default':
                    pageData.views = [{ controls: [controlData] }];
                    break;
            }

            if (controlData.controlName != 'style') {
                let styleControlData = await this.station.styleControlData();
                styleControlData.selected = 'disabled';
                pageData.footer = pageData.footer || { controls: [] };
                pageData.footer.controls = pageData.footer.controls || [];
                pageData.footer.controls.push(styleControlData);
            }

            this.setState(this.state);
        });
    }
    save(pageData: PageData) {

        let { target, controlName } = this.props;
        let controlDatas: ControlDescrtion[];
        switch (target) {
            case 'header':
                controlDatas = pageData.header.controls;
                break;
            case 'footer':
                controlDatas = pageData.footer.controls;
                break;
            default:
                controlDatas = pageData.views[0].controls;
                break;
        }

        let controlData = controlDatas.filter(o => o.controlName == controlName)[0];

        return this.station.saveControlData(controlData, 'menu');
    }
    render() {
        let pageData = this.state.pageData;
        let userStation = this.props.elementPage.createService(UserStation);
        return (
            <MobilePageDesigner pageData={pageData} save={(pageData) => this.save(pageData)} userStation={userStation}>
                {this.props.children}
            </MobilePageDesigner>
        );
    }
}