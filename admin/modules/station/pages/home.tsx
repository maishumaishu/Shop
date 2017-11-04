import { MobilePageDesigner } from 'mobilePageDesigner';
import { default as station } from 'adminServices/station';
export default function (page: chitu.Page) {
    station.homePage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData} showComponentPanel={true} showMenuSwitch={true}
                save={station.savePageData.bind(station)}  elementPage={page}>
            </MobilePageDesigner>, page.element);
    })
}
