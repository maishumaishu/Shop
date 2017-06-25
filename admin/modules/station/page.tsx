import { MobilePageDesigner } from 'mobilePageDesigner';
import { default as station, PageData, ControlData, guid } from 'services/station';
import { componentsDir } from 'mobileComponents/common';

let editorTypes: { [propName: string]: React.ComponentClass<any> } = {};
let controlTypes: { [propName: string]: React.ComponentClass<any> } = {};

export interface RouteValue {
    onSave(pageData: PageData);
}

export default async function (page: chitu.Page) {
    class State {
        componentInstances: ControlData[]
    }

    let onSave = ((page.routeData.values || {}) as RouteValue).onSave;

    class Page extends React.Component<{ pageData: PageData }, State>{
        private designer: MobilePageDesigner;
        constructor(props) {
            super(props);
        }
        componentDidMount() {
            if (onSave)
                this.designer.saved.add((sender, args) => onSave(args.pageData));
        }
        async loadControlInstance(controlId: string, controlName: string, controlHTMLElement: HTMLElement, controlData?: any) {

            controlHTMLElement.setAttribute('data-controlName', controlName);
            controlHTMLElement.setAttribute('data-controlId', controlId);
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
            return (
                <MobilePageDesigner ref={(o) => this.designer = o} pageData={pageData} showComponentPanel={true} showPageEditor={true}
                    save={(pageData) => station.savePageData(pageData)}>
                </MobilePageDesigner>
            );
        }
    }

    let { pageId, templateId } = page.routeData.values;
    let pageData: PageData;
    if (pageId) {
        pageData = await station.pageData(pageId);
    }
    else {
        pageData = await station.pageDataByTemplate(templateId);
    }

    ReactDOM.render(<Page pageData={pageData} />, page.element);
}

function checkStyleControl(pageData: PageData) {
    if (pageData.views == null) {

    }
}