
import Service = require('services/Service');


let JData = window['JData'];

class StationService extends Service {
    homeProduct = new JData.WebDataSource(
        Service.config.siteUrl + 'MicroStationData/Select?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Insert?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Update?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Delete?source=HomeProducts'
    )
    savePageData(data: { pageId: string, controls: any[] }) {
        // console.assert(pageId != null);
        // console.assert(data != null);
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        Service.postByJson(url, data);
    }
}

export = new StationService();