// import { ShoppingCartService, ShoppingService, ShoppingCartItem, userData, StationService } from 'user/services';
import { StationService } from 'user/services/stationService';
import { MobilePage } from 'components/mobilePage';
import * as ReactDOM from 'react-dom';


export default async function (page: chitu.Page) {
    let station = page.createService(StationService);
    let pageData = await station.pages.style();
    ReactDOM.render(
        <MobilePage pageData={pageData} elementPage={page} />
        , page.element);
}