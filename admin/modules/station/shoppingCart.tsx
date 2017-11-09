import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService as AdminStation } from 'adminServices/station';
import { StationService as UserStation } from 'userServices/stationService';

export default async function (page: chitu.Page) {

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);
    let pageData = await userStation.pages.shoppingCart();
    ReactDOM.render(
        <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
            save={adminStation.savePageData.bind(adminStation)} elementPage={page} >
        </MobilePageDesigner>, page.element);
}
