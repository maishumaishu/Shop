import { MobilePageDesigner } from 'components/mobilePageDesigner';
import { StationService, guid } from 'admin/services/station';
import { componentsDir } from 'components/common';
import { StationService as UserStation } from 'user/services/stationService';
import { Page } from 'chitu';
import { app } from 'admin/application';
import { pageData as dataSource } from 'admin/services/dataSource';

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
        async savePageData(item: PageData) {
            await dataSource.update(item);
            return item;
        }
        render() {
            let userStation = page.createService(UserStation);
            return (
                <MobilePageDesigner ref={(o) => this.designer = o} pageData={pageData} showComponentPanel={true} showPageEditor={true}
                    save={(pageData) => this.savePageData(pageData)} showMenuSwitch={true}
                    buttons={[
                        <button key="return" className="btn btn-sm btn-primary" onClick={() => app.back()}>
                            <i className="icon-reply" />
                            <span>返回</span>
                        </button>
                    ]}
                    pageDatas={userStation.pages}>
                </MobilePageDesigner>
            );
        }
    }


    let pageData = await getPageData(page);
    let mobilePage = ReactDOM.render(<MobilePage pageData={pageData} />, page.element);


}

async function getPageData(page: Page) {
    let station = page.createService(StationService);
    let userStation = page.createService(UserStation);
    let { pageId, templateId } = page.data;
    let pageData: PageData;
    if (pageId) {
        pageData = await userStation.pages.pageDataById(pageId);
    }
    else if (templateId) {
        pageData = await station.pageDataByTemplate(templateId);
    }
    else {
        pageData = {
            id: guid(),
            controls: []
        };
    }

    return pageData;
}