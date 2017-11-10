import { StationService } from 'userServices/stationService';
import { MobilePage } from 'mobileComponents/mobilePage';
export default async function (page: chitu.Page) {
  
    let station = page.createService(StationService);
    let pageData = await station.fullPage(() => station.pages.shoppingCart());

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ></MobilePage>, page.element);
}
