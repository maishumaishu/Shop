import { default as Service, guid, imageUrl } from 'admin/services/service';
import templates from 'admin/services/data/templates'
import { imageServiceBaseUrl } from 'share/common';
export { guid } from 'admin/services/service';

// type ImageData = {
//     id: string, width?: number, height?: number
// }

export class StationService extends Service {
    private url(path: string) {
        let url = `${Service.config.siteUrl}${path}`;
        return url;
    }
    savePageData(pageData: PageData, isSystem?: boolean) {
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        return this.postByJson(url, { pageData, isSystem }).then((data) => {
            Object.assign(pageData, data);
            return data;
        });
    }
    pageDataByTemplate(templateId: string): Promise<PageData> {
        var pageData = templates.filter(o => o.id == templateId).map(o => o.pageData)[0];
        return Promise.resolve(pageData);
    }
    pageDatas() {
        let url = this.url('Page/GetPageDatas');
        return this.getByJson<PageData[]>(url).then(o => {
            return o || [];
        });
    }
    pageList(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Page/GetPageList');
        return this.getByJson<wuzhui.DataSourceSelectResult<{ Id: string, Name: string }>>(url);
    }
    async pageDataById(pageId: string) {
        if (!pageId) throw new Error('argument pageId null');

        let url = this.url('Page/GetPageDataById');
        let data = { pageId };
        let pageData = await this.getByJson<PageData>(url, { id: pageId })
        if (pageData == null) {
            let error = new Error(`Page data ${pageId} is not exists.`);
            this.error.fire(this, error);
            throw error;
        }
        // pageData = await fillPageData(pageData);
        return pageData;
    }
    deletePageData(pageId: string) {
        let url = this.url('Page/DeletePage');
        return this.deleteByJson(url, { pageId });
    }
    setDefaultPage(pageId: string) {
        let url = this.url('Page/SetDefaultPage');
        return this.putByJson(url, { pageId });
    }
    async pageTemplates(): Promise<TemplatePageData[]> {
        return Promise.resolve(templates);
    }

    //=================================================================
    // 和图片相干的接口

    /**
     * 保存图片
     * @param name 图片名称
     * @param imageBase64 图片的 base64 字符串 
     */
    async saveImage(imageBase64: string) {
        let url = `${imageServiceBaseUrl}upload`;
        let image = document.createElement('img');
        return new Promise<SiteImageData>((resovle, reject) => {
            image.onload = async () => {
                let { width, height } = image;
                let result = await this.postByJson<{ id: string }>(url, { name, image: imageBase64, width, height });
                resovle({ id: result.id, width, height });
            }
            image.src = imageBase64;
        })

    }

    async images(args: wuzhui.DataSourceSelectArguments, width?: number, height?: number) {
        let url = `${imageServiceBaseUrl}list`;
        let result = await this.postByJson<wuzhui.DataSourceSelectResult<SiteImageData>>(url, args);
        return result;
    }
    removeImage(id: string) {
        let url = `${imageServiceBaseUrl}delete/${id}`;
        return this.get(url);
    }
    private pareeUrlQuery(query): any {
        let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        let urlParams = {};
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    }

    //============================================================
    // 店铺
    saveStore(store: StoreInfo) {
        let url = this.url('Store/Save');
        return this.postByJson(url, { store });
    }
    store() {
        let url = this.url('Store/Get');
        return this.getByJson<StoreInfo>(url);
    }
    //============================================================
}
