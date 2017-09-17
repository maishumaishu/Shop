import { ComponentDesigner } from 'componentDesigner';
import { MobilePageDesigner } from 'mobilePageDesigner';
import { default as station } from 'services/station';
export default function (page: chitu.Page) {
    station.homePage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showComponentPanel={true} showMenuSwitch={true}
                save={station.savePageData.bind(station)} >
            </MobilePageDesigner>, page.element);
    })
}
