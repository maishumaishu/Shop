import { StationService } from 'user/services/stationService';
import { MobilePage } from 'components/mobilePage';

export default async function (page: chitu.Page) {

    let { pageId } = page.data;
    let station = page.createService(StationService);

    let result = await Promise.all([station.pages.pageDataById(pageId), station.pages.style(), station.pages.menu()]);
    let pageData = result[0];
    let stylePageData = result[1];
    let menuPageData = result[2];

    let existsStyleControl = pageData.controls.filter(o => o.controlName == 'style').length > 0;
    if (!existsStyleControl) {
        let styleControl = stylePageData.controls[0];
        console.assert(styleControl != null && styleControl.controlName == 'style');
        pageData.controls.push(styleControl);
    }

    let existsMenuControl = pageData.controls.filter(o => o.controlName == 'menu').length > 0;
    if (!existsMenuControl && pageData.showMenu) {
        let menuControlData = menuPageData.controls.filter(o => o.controlName == 'menu')[0];
        console.assert(menuControlData != null);
        pageData.controls.push(menuControlData);
    }

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, page.element);

}




