
import Service = require('services/Service');

let JData = window['JData'];

export interface ControlData {
    controlId: string, controlName: string, data: any
}

export interface PageData {
    pageId: string,
    controls: Array<ControlData>
}

export class StationService extends Service {
    homeProduct = new JData.WebDataSource(
        Service.config.siteUrl + 'MicroStationData/Select?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Insert?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Update?source=HomeProducts',
        Service.config.siteUrl + 'MicroStationData/Delete?source=HomeProducts'
    )
    savePageData(data: PageData) {
        // console.assert(pageId != null);
        // console.assert(data != null);
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        Service.post(url, { data: JSON.stringify(data) });
    }
    getPageData(pageId: string) {
        let url = `${Service.config.siteUrl}Page/GetPageData`;
        return Service.get<PageData>(url, { pageId, fields: 'pageId' }).then(o=>{
            return o;
        });
    }
}

export default new StationService();