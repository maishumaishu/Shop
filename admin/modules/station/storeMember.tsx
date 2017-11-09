import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService as AdminStation } from 'adminServices/station';
import { StationService as UserStation } from 'userServices/stationService';
import { default as MemberPage } from 'mobileComponents/member/control';
import { default as StyleControl } from 'mobileComponents/style/control';
export default function (page: chitu.Page) {

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);
    userStation.pages.member().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
                save={(p) => adminStation.savePageData(p)} elementPage={page} >
            </MobilePageDesigner >, page.element);
    })
}
