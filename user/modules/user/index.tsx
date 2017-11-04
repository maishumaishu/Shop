import { Page, Menu, defaultNavBar, app } from 'site';
import { StationService } from 'userServices/stationService';
import { PageComponent, PageView, PageFooter } from 'mobileControls';
import { MobilePage } from 'mobileComponents/mobilePage';
export default async function (page: Page) {
    let station = page.createService(StationService);
    let pageData = await station.fullPage(() => station.pages.member());
    ReactDOM.render(
        <MobilePage pageData={pageData} elementPage={page} />
        , page.element);
}
