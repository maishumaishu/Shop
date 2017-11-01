import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService } from 'adminServices/station';


// var station = new StationService();
export default async function (page: chitu.Page) {
    let station = page.createService(StationService);
    let pageData = await station.shoppingCartPage();
    ReactDOM.render(
        <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
            save={station.savePageData.bind(station)} elementPage={page} >
        </MobilePageDesigner>, page.element);
}
