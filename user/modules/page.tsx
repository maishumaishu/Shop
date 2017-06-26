import { PageData, ControlData, StationService, guid, Service } from 'userServices';
import { PageComponent, PageHeader, PageFooter, PageView } from 'mobileControls';
import { Page } from 'site';
import { MobilePage } from 'pageComponents/mobilePage';
export default async function (page: chitu.Page) {

    let { pageId } = page.routeData.values;
    let station = Service.createService(StationService);
    let pageData = await station.pageData(pageId);

    ReactDOM.render(<MobilePage pageData={pageData} />, page.element);

}

// interface Props extends React.Props<MobilePage> {
//     pageData: PageData
// }

