
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
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        Service.post(url, { data: JSON.stringify(data) });
    }
    getPageData(pageId: string, fields?: string[]) {
        let url = `${Service.config.siteUrl}Page/GetPageData`;
        let data = { pageId, fields: undefined };
        if (fields != null) {
            data.fields = JSON.stringify(fields);
        }
        return Service.get<PageData>(url, data);
    }
}

export default new StationService();