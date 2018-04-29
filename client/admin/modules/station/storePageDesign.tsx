import { MobilePageDesigner, Props } from 'components/mobilePageDesigner';
import { StationService as AdminStation } from 'admin/services/station';
import { StationService as UserStation } from 'user/services/stationService';
import { AppError } from 'share/common'
export default async function (page: chitu.Page) {

    let arr = page.name.split('_');
    let storePage = arr[arr.length - 1];

    let adminStation = page.createService(AdminStation);
    let userStation = page.createService(UserStation);

    let func = userStation.pages[storePage] as Function;
    if (func == null)
        throw new Error(`Store page ${storePage} is not exists.`);

    let showComponentPanel = storePage == 'home';
    let pageData = await func.apply(userStation.pages);
    let props: Props = {
        pageData,
        pageDatas: userStation.pages,
        save: adminStation.savePageData.bind(adminStation),
        showMenuSwitch: true,
        showComponentPanel
    }
    ReactDOM.render(<MobilePageDesigner {...props} />, page.element);
}
