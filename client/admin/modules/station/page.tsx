import { MobilePageDesigner } from 'components/mobilePageDesigner';
import { StationService, guid } from 'admin/services/station';
import { componentsDir } from 'components/common';
import { StationService as UserStation } from 'user/services/stationService';
import { Page } from 'chitu';

let controlTypes: { [propName: string]: React.ComponentClass<any> } = {};

export default async function (page: chitu.Page) {

    let station = page.createService(StationService);

    class State {
        pageData: PageData
    }

    class MobilePage extends React.Component<{ pageData: PageData }, State>{
        private designer: MobilePageDesigner;
        constructor(props) {
            super(props);
            this.state = { pageData: this.props.pageData };
        }
        async loadControlInstance(controlId: string, controlName: string, controlHTMLElement: HTMLElement, controlData?: any) {

            controlHTMLElement.setAttribute('data-control-name', controlName);
            controlHTMLElement.setAttribute('data-control-id', controlId);
            controlHTMLElement.className = `${controlName}-control`;
            let controlType = await this.getControlType(controlName);
            let controlReactElement = React.createElement(controlType, controlData);
            let control: React.Component<any, any> = ReactDOM.render(controlReactElement, controlHTMLElement);
            return { control, type: controlType };
        }
        getControlType(controlName: string): Promise<React.ComponentClass<any>> {
            if (controlTypes[controlName] != null) {
                return Promise.resolve(controlTypes[controlName]);
            }

            return new Promise((reslove, reject) => {
                let path = `${componentsDir}/${controlName}/control`; //Editor.path(controlName);
                let self = this;
                requirejs([path], function (obj: any) {
                    let controlType = (obj || {}).default as React.ComponentClass<any>;
                    console.assert(controlType != null);
                    controlTypes[controlName] = controlType;
                    reslove(controlType);
                })
            })
        }
        render() {
            let userStation = page.createService(UserStation);
            return (
                <MobilePageDesigner ref={(o) => this.designer = o} pageData={pageData} showComponentPanel={true} showPageEditor={true}
                    save={(pageData) => station.savePageData(pageData)} showMenuSwitch={true}
                    pageDatas={userStation.pages}>
                </MobilePageDesigner>
            );
        }
    }


    let pageData = await getPageData(page);
    let mobilePage = ReactDOM.render(<MobilePage pageData={pageData} />, page.element);


}

function checkStyleControl(pageData: PageData) {
    if (pageData.views == null) {

    }
}

async function getPageData(page: Page) {
    let station = page.createService(StationService);
    let { pageId, templateId } = page.data;
    let pageData: PageData;
    if (pageId) {
        pageData = await station.pageData(pageId);
    }
    else if (templateId) {
        pageData = await station.pageDataByTemplate(templateId);
    }
    else {
        pageData = {
            id: guid(),
            views: [
                { controls: [] }
            ]
        };
    }

    return pageData;
}