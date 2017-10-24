import { StationService } from 'userServices/stationService';
import { PageComponent, PageHeader, PageFooter, PageView } from 'mobileControls';
import { Page } from 'site';
import { MobilePage } from 'pageComponents/mobilePage';

export default async function (page: chitu.Page) {

    let { pageId } = page.routeData.values;
    let station = page.createService(StationService);
    let pageData = await station.pageData(pageId);

    let mobilePage: MobilePage;
    ReactDOM.render(<MobilePage pageData={pageData}
        ref={(o) => mobilePage = o || mobilePage} />, page.element);

    let existsStyleControl = pageData.footer.controls.filter(o => o.controlName == 'style').length > 0;
    if (!existsStyleControl) {
        station.stylePage().then(stylePageData => {
            let styleControl = stylePageData.footer.controls[0];
            console.assert(styleControl != null && styleControl.controlName == 'style');
            styleControl.selected = 'disabled';
            mobilePage.state.pageData.footer.controls.push(styleControl);
            mobilePage.setState(mobilePage.state);
        })
    }

    let existsMenuControl = pageData.footer.controls.filter(o => o.controlName == 'menu').length > 0;
    if (!existsMenuControl && pageData.showMenu) {
        loadMenu(station, mobilePage);
    }



}

async function loadMenu(station: StationService, mobilePage: MobilePage) {
    let menuPageData = await station.menuPage();
    let menuControlData = menuPageData.footer.controls.filter(o => o.controlName == 'menu')[0];
    console.assert(menuControlData != null);
    menuControlData.selected = 'disabled';
    mobilePage.state.pageData.footer.controls.push(menuControlData);
    mobilePage.setState(mobilePage.state);
}



