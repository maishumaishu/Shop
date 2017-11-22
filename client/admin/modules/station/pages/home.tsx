import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService as UserStation } from 'userServices/stationService';
import { StationService as AdminStation } from 'adminServices/station';
export default function (page: chitu.Page) {

    let userStation = page.createService(UserStation);
    let adminStation = page.createService(AdminStation);
    userStation.pages.home().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showComponentPanel={true} showMenuSwitch={true}
                save={(p) => adminStation.savePageData(p)} userStation={userStation}>
            </MobilePageDesigner>, page.element);
    })
}
