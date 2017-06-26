import { Editor, EditorProps } from 'mobileComponents/editor'
import { default as station, PageData, guid, ControlData } from 'services/station';
import FormValidator from 'formValidator';
import { VirtualMobile } from 'mobilePage';
import { PageComponent, PageView, PageHeader, PageFooter } from 'mobileControls';




export default async function (page: chitu.Page) {
    requirejs([`css!${page.routeData.actionPath}.css`]);

    let { pageId, templateId } = page.routeData.values;
    let pageData = {} as PageData;
    if (pageId)
        pageData = await station.pageData(pageId);
    else if (templateId)
        pageData = await station.pageDataByTemplate(templateId);

    let h = React.createElement;
    ReactDOM.render(
        <div className="mobile">
            <PreViewPage pageData={pageData} />
        </div>,
        page.element
    );

}

class PreViewPage extends React.Component<{ pageData: PageData }, any>{
    render() {
        let pageData = this.props.pageData;
        return (
            <VirtualMobile >
                <PageComponent>
                    {this.renderHeader(pageData)}
                    {this.renderViews(pageData)}
                    {this.renderFooter(pageData)}
                </PageComponent>
            </VirtualMobile>
        );
    }
    renderControls(controls: ControlData[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div key={o.controlId}
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    this.createControlInstance(o, e);
                }} />
        );
    }

    renderHeader(pageData: PageData): JSX.Element {
        if (!pageData.header)
            return null;

        return (
            <PageHeader>
                {this.renderControls(pageData.header.controls)}
            </PageHeader>
        )
    }

    renderFooter(pageData: PageData): JSX.Element {
        if (!pageData.footer)
            return null;
            
        return (
            <PageFooter>
                {this.renderControls(pageData.footer.controls)}
            </PageFooter>
        )
    }


    renderViews(pageData: PageData) {
        return (pageData.views || []).map((o, i) => (
            <section key={i}>
                {this.renderControls(o.controls)}
            </section>
        ));
    }

    async createControlInstance(controlData: ControlData, element: HTMLElement) {
        let { controlId, controlName, data, selected } = controlData;
        let controlType = await this.getControlType(controlName);
        let reactElement = React.createElement(controlType, data);
        let control = ReactDOM.render(reactElement, element);
        control.id = controlId;
        // this.controls.push([control.id, control]);
        return { control, controlType };
    }

    getControlType(controlName: string): Promise<React.ComponentClass<any>> {
        return new Promise((resolve, reject) => {
            let attr = controlName.split(':');
            let path = attr[0];
            let exprotName = attr[1];
            let pathName = `mobileComponents/${path}/control`;
            requirejs([pathName], function (exports) {
                if (!exprotName)
                    exprotName = 'default';

                let exportObj = exports[exprotName];
                if (exportObj == null)
                    throw new Error(`The export named ${exprotName} is not exists in '${pathName}'`);

                resolve(exportObj);
            })
        })
    }

}