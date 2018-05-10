import { default as Service, guid, imageUrl } from 'admin/services/service';
import templates from 'admin/services/data/templates'
import { imageServiceBaseUrl } from 'share/common';
export { guid } from 'admin/services/service';

export class StationService extends Service {
    private url(path: string) {
        let url = `${Service.config.siteUrl}${path}`;
        return url;
    }
    savePageData(pageData: PageData, isSystem?: boolean) {
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        let obj = pageData;
        obj.controls = pageData.controls.filter(o => o.save != false);
        return this.postByJson(url, { pageData: obj, isSystem }).then((data) => {
            Object.assign(pageData, data);
            return data;
        });
    }
    pageDataByTemplate(templateId: string): Promise<PageData> {
        var pageData = templates.filter(o => o.id == templateId).map(o => o)[0];
        return Promise.resolve(pageData);
    }
    /**
     * 保存页面数据快照
     * @param pageData 要保存为快照的页面数据
     */
    saveSnapshoot(pageData: PageData) {
        console.assert(pageData.id != null);
        pageData = JSON.parse(JSON.stringify(pageData));
        pageData.name = pageData.id;
        delete pageData.id;

        return this.savePageData(pageData, true);
    }
    async pageList(args: wuzhui.DataSourceSelectArguments): Promise<wuzhui.DataSourceSelectResult<PageData>> {
        let url = this.url('Page/GetPageList');
        let pageList = await this.getByJson<wuzhui.DataSourceSelectResult<{ Id: string, Name: string }>>(url);
        let pages = pageList.dataItems.map(o => <PageData>{ id: o.Id, name: o.Name });
        return { totalRowCount: pageList.totalRowCount, dataItems: pages };
    }
    deletePageData(pageId: string) {
        let url = this.url('Page/DeletePage');
        return this.deleteByJson(url, { pageId });
    }
    setDefaultPage(pageId: string) {
        let url = this.url('Page/SetDefaultPage');
        return this.putByJson(url, { pageId });
    }
    async pageTemplates(): Promise<PageData[]> {
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
}
