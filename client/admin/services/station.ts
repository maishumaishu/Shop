import { default as Service, guid, imageUrl } from 'admin/services/service';
import templates from 'admin/services/data/templates'
import { imageServiceBaseUrl } from 'share/common';
import { errors } from 'dilu';
export { guid } from 'admin/services/service';

let snapshootCounts: { [pageDataId: string]: chitu.ValueStore<number> } = {};
type PageListResult = wuzhui.DataSourceSelectResult<{
    Id: string, Name: string, CreateDateTime: Date
}>
export class StationService extends Service {
    private url(path: string) {
        let url = `${Service.config.siteUrl}${path}`;
        return url;
    }
    //=================================================================
    // 和页面数据相关的接口
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
    async saveSnapshoot(pageData: PageData) {

        let snapshootCount = await this.snapshootCount(pageData.id);
        console.assert(snapshootCount != null);

        console.assert(pageData.id != null);
        pageData = JSON.parse(JSON.stringify(pageData));
        pageData.name = pageData.id;
        delete pageData.id;

        debugger;
        let result = await this.savePageData(pageData, true);
        snapshootCount.value = (snapshootCount.value || 0) + 1;
        return result;
    }
    /**
     * 获取页面快照数量
     * @param pageDataId 页面编号
     */
    async snapshootCount(pageDataId: string): Promise<chitu.ValueStore<number>> {
        if (pageDataId == null)
            throw errors.argumentNull('pageDataId');

        let count = snapshootCounts[pageDataId];
        if (count == null) {
            let url = this.url('Page/GetPageDatasCount');
            let c = await this.get<number>(url, { Filter: `Name = '${pageDataId}'` });
            count = new chitu.ValueStore<number>(c);
            snapshootCounts[pageDataId] = count;
        }
        return count;
    }
     /**
      * 获取页面列表
      * @param args 数据集参数
      */
    async pageList(args: wuzhui.DataSourceSelectArguments): Promise<wuzhui.DataSourceSelectResult<PageData>> {
        let url = this.url('Page/GetPageList');
        args.filter = `IsSystem = false`;
        let pageList = await this.getByJson<PageListResult>(url, args);
        let pages = pageList.dataItems.map(o => <PageData>{
            id: o.Id, name: o.Name,
            createDateTime: o.CreateDateTime, controls: []
        });
        return { totalRowCount: pageList.totalRowCount, dataItems: pages };
    }
    /**
     *  获取页面快照
     */
    async snapshootList(pageDataId: string): Promise<wuzhui.DataSourceSelectResult<PageData>> {
        let url = this.url('Page/GetPageList');
        let args = new wuzhui.DataSourceSelectArguments();
        args.filter = `Name = '${pageDataId}'`
        let pageList = await this.getByJson<PageListResult>(url, args);
        let pages = pageList.dataItems.map(o => <PageData>{
            id: o.Id, name: o.Name,
            createDateTime: o.CreateDateTime, controls: []
        });
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
    async pageTemplatesCount(pageDataId: string): Promise<number> {
        let url = this.url('Page/GetPageTemplatesCount');
        return this.get<number>(url, { pageDataId })
    }
    async pageDataById(pageDataId: string) {
        let url = this.url('Page/GetPageDataById');
        return this.get<PageData>(url, { id: pageDataId })
    }

    //=================================================================
    // 和图片相关的接口

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
