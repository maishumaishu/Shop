import { ComponentDesigner } from 'componentDesigner';
import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService } from 'adminServices/station';

let station = new StationService();
export default function (page: chitu.Page) {
    station.menuPage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData}
                save={station.savePageData.bind(station)} >
            </MobilePageDesigner>, page.element);
    })
}
