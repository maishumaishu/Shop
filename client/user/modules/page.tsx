import { StationService } from 'userServices/stationService';
import { MobilePage } from 'mobileComponents/mobilePage';

export default async function (page: chitu.Page) {

    let { pageId } = page.data;
    let station = page.createService(StationService);

    let result = await Promise.all([station.pageData(pageId), station.pages.style(), station.pages.menu()]);
    let pageData = result[0];
    let stylePageData = result[1];
    let menuPageData = result[2];

    let existsStyleControl = pageData.footer.controls.filter(o => o.controlName == 'style').length > 0;
    if (!existsStyleControl) {
        // station.stylePage().then(stylePageData => {
        let styleControl = stylePageData.footer.controls[0];
        console.assert(styleControl != null && styleControl.controlName == 'style');
        pageData.footer.controls.push(styleControl);
        // })
    }

    let existsMenuControl = pageData.footer.controls.filter(o => o.controlName == 'menu').length > 0;
    if (!existsMenuControl && pageData.showMenu) {
        let menuControlData = menuPageData.footer.controls.filter(o => o.controlName == 'menu')[0];
        console.assert(menuControlData != null);
        pageData.footer.controls.push(menuControlData);
    }

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, page.element);

}




