import { MobilePageDesigner } from 'mobilePageDesigner';
import { StationService } from 'services/station';

var station = new StationService();
export default function (page: chitu.Page) {
    station.categoriesPage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showMenuSwitch={true}
                save={station.savePageData.bind(station)} >
            </MobilePageDesigner>, page.element);
    })
}
