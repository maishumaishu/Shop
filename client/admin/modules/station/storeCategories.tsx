import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService as AdminStation, guid } from 'adminServices/station';
import { StationService as UserStation } from 'userServices/stationService';

export default function (page: chitu.Page) {

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);

    userStation.pages.categories().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
                save={adminStation.savePageData.bind(adminStation)} elementPage={page} >
            </MobilePageDesigner>, page.element);
    })
}
