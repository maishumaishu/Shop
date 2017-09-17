import { ComponentDesigner } from 'componentDesigner';
import { MobilePageDesigner } from 'mobilePageDesigner';
import { default as station, PageData, ControlDescrtion, guid } from 'services/station';
import { default as MemberPage } from 'mobileComponents/member/control';
import { default as StyleControl } from 'mobileComponents/style/control';
export default function (page: chitu.Page) {
    station.memberPage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
                save={station.savePageData.bind(station)} >
            </MobilePageDesigner>, page.element);
    })
}
