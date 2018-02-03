import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService as AdminStation } from 'adminServices/station';
import { StationService as UserStation } from 'userServices/stationService';
import { AppError } from 'share/common'
export default async function (page: chitu.Page) {

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);
    let pageData = await userStation.pages.shoppingCart();
    page.error.add((page, error: AppError) => {
        (error as any).handled = true;
    })
    ReactDOM.render(
        <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
            save={adminStation.savePageData.bind(adminStation)} userStation={userStation}>
        </MobilePageDesigner>, page.element);
}
