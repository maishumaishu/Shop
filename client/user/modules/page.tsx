import { StationService } from 'user/services/stationService';
import { MobilePage } from 'components/mobilePage';
import { UserPage } from 'user/application';

export default async function (page: UserPage) {

    let { pageId } = page.data;
    let station = page.createService(StationService);

    let pageData = await station.pages.pageDataById(pageId)

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} />, page.element);

}




