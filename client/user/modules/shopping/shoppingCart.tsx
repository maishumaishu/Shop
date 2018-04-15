import { StationService } from 'userServices/stationService';
import { MobilePage } from 'mobileComponents/mobilePage';
import { Page } from 'user/application';

export default async function (page: Page, showMenu?: boolean) {
    let station = page.createService(StationService);
    let pageData = await station.pages.shoppingCart();
    if (showMenu != null) {
        page.data.showBackButton = false;
        pageData.showMenu = showMenu;
    }

    pageData = await station.fullPage(() => Promise.resolve(pageData));
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ></MobilePage>, page.element);
}
