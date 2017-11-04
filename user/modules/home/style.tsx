import { Page, Menu, defaultNavBar, app } from 'site';
// import { ShoppingCartService, ShoppingService, ShoppingCartItem, userData, StationService } from 'userServices';
import { StationService } from 'userServices/stationService';
import { MobilePage } from 'mobileComponents/mobilePage';
import * as ReactDOM from 'react-dom';


export default async function (page: Page) {
    let station = page.createService(StationService);
    let pageData = await station.pages.style();
    ReactDOM.render(
        <MobilePage pageData={pageData} elementPage={page} />
        , page.element);
}