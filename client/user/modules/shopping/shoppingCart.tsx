import { StationService } from 'userServices/stationService';
import { MobilePage } from 'mobileComponents/mobilePage';
export default async function (page: chitu.Page, showMenu?: boolean) {

    let station = page.createService(StationService);
    let pageData = await station.pages.shoppingCart();
    if (showMenu != null) {
        page.data.showBackButton = false;
        pageData.showMenu = showMenu;
    }

    pageData = await station.fullPage(() => Promise.resolve(pageData));
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ></MobilePage>, page.element);
}
