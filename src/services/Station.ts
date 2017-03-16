
import Service = require('services/Service');

// let JData = window['JData'];

export interface ControlData {
    controlId: string, controlName: string, data: any
}

export interface PageData {
    _id: string,
    name: string,
    controls: Array<ControlData>
}

export class StationService extends Service {
    private _homeProduct: JData.WebDataSource;

    get homeProduct(): JData.WebDataSource {
        if (!this._homeProduct) {
            this._homeProduct = new JData.WebDataSource(
                Service.config.siteUrl + 'MicroStationData/Select?source=HomeProducts',
                Service.config.siteUrl + 'MicroStationData/Insert?source=HomeProducts',
                Service.config.siteUrl + 'MicroStationData/Update?source=HomeProducts',
                Service.config.siteUrl + 'MicroStationData/Delete?source=HomeProducts'
            );
        }
        return this._homeProduct;
    }
    savePageControls(pageId: string, controls: any[]) {
        let url = `${Service.config.siteUrl}Page/SavePageControls`;
        Service.post(url, { pageId, controls: JSON.stringify(controls) });
    }
    private getPageData(pageId: string, fields?: string[]) {
        let url = `${Service.config.siteUrl}Page/GetPageData`;
        let data = { pageId, fields: undefined };
        if (fields != null) {
            data.fields = JSON.stringify(fields);
        }
        return Service.get<PageData>(url, data);
    }
    /** 通过页面名称获取页面 id 
     * @param name 页面名称
     */
    getPageId(name: string): Promise<string> {
        let url = `${Service.config.siteUrl}Page/GetPageId`;
        return Service.get<{ "_id": string }>(url, { name }).then(o => o._id);
    }
    getPageDataByName(name: string) {
        return this.getPageId(name).then(o => {
            return this.getPageData(o);
        })
    }
    saveImage(pageId: string, name: string, image: string) {
        let url = `${Service.config.siteUrl}Page/SaveImage`;
        return Service.postByJson(url, { pageId, name, image });
    }
    imageUrl(pageId: string, fileName: string) {
        let url = `${Service.config.imageUrl}Page/Image?pageId=${pageId}&name=${fileName}&storeId=${Service.storeId}&application-token=${Service.appToken}`;
        return url;
    }
    removeImage(pageId: string, name: string) {
        let url = `${Service.config.siteUrl}Page/RemoveImage`;
        return Service.postByJson(url, { pageId, name });
    }
    getImageNameFromUrl(imageUrl: string) {
        var arr = imageUrl.split('?');
        console.assert(arr.length == 2);
        var params = this.pareeUrlQuery(arr[1]);
        return params.name;
    }
    private pareeUrlQuery(query): any {
        let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        let urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }
}

export default new StationService();