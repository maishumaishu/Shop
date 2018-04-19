import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService as AdminStation } from 'adminServices/station';
import { StationService as UserStation } from 'userServices/stationService';
import { AppError } from 'share/common'
export default async function (page: chitu.Page) {

    let arr = page.name.split('_');
    let storePage = arr[arr.length - 1];

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);

    let func = userStation.pages[storePage] as Function;
    if (func == null)
        throw new Error(`Store page ${storePage} is not exists.`);

    let pageData = await func.apply(userStation.pages);

    ReactDOM.render(
        <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
            save={adminStation.savePageData.bind(adminStation)} pageDatas={userStation.pages}>
        </MobilePageDesigner>, page.element);
}
