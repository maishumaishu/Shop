import { MobilePageDesigner } from 'mobilePageDesigner';
import { default as station, ControlDescrtion, guid } from 'adminServices/station';
import { default as MemberPage } from 'mobileComponents/member/control';
import { default as StyleControl } from 'mobileComponents/style/control';
export default function (page: chitu.Page) {
    station.memberPage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
                save={station.savePageData.bind(station)}  elementPage={page}>
            </MobilePageDesigner>, page.element);
    })
}
