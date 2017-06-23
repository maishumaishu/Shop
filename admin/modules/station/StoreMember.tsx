import { ComponentDesigner } from 'modules/Station/Components/ComponentDesigner';
import { default as station, PageData, ControlData, guid } from 'services/Station';
import { default as MemberPage } from 'mobileComponents/member/control';
import { default as StyleControl } from 'mobileComponents/style/control';
export default function (page: chitu.Page) {
    let pageData = {
        views: [
            {
                controls: [
                    { controlId: guid(), controlName: 'member', selected: true }
                ]
            }
        ]
    } as PageData;
    let memberPage: MemberPage;
    // ReactDOM.render(
    //     <MobilePageDesigner ref={(e) => designer = e || designer} pageData={pageData} save={(pageData) => station.savePageData(pageData)} >
    //     </MobilePageDesigner>, page.element);
    ReactDOM.render(<ComponentDesigner controlName='member' />, page.element);
}
