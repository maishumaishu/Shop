import { default as Service } from 'services/Service';


// let JData = window['JData'];

export interface ControlData {
    controlId: string, controlName: string, data: any
}

export interface PageData {
    _id: string,
    name: string,
    remark: string,
    controls: Array<ControlData>,
    isDefault: boolean,
}

export class StationService extends Service {
    private _homeProduct: JData.WebDataSource;
    private url(path: string) {
        let url = `${Service.config.siteUrl}${path}`;
        return url;
    }
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
    // savePageControls(pageId: string, controls: any[], name: string, remark?: string) {
    //     let url = `${Service.config.siteUrl}Page/SavePageControls`;
    //     return Service.post(url, { pageId, controls: JSON.stringify(controls), name, remark });
    // }
    savePageData(pageData: PageData) {
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        return Service.postByJson(url, pageData);
    }
    getPageData(pageId: string) {
        let url = `${Service.config.siteUrl}Page/GetPageData`;
        let data = { pageId };
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
    getPageDatas() {
        let url = this.url('Page/GetPageDatas');
        return Service.get<PageData[]>(url).then(o => {
            return o || [];
        });
    }
    setDefaultPage(pageId: string) {
        let url = this.url('Page/SetDefaultPage');
        return Service.putByJson(url, { pageId });
    }
    saveImage(pageId: string, name: string, image: string) {
        let url = `${Service.config.siteUrl}Page/SaveImage`;
        return Service.postByJson(url, { pageId, name, image });
    }
    imageUrl(pageId: string, fileName: string) {
        let url = `${Service.config.imageUrl}Page/Image?pageId=${pageId}&name=${fileName}&storeId=${Service.storeId}&application-key=${Service.appToken}`;
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