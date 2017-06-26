import { default as Service } from 'service';


export interface ControlData {
    controlId: string, controlName: string, data: any,
    selected?: boolean | 'disabled'
}

export interface PageData {
    _id?: string,
    name?: string,
    remark?: string,
    // controls?: Array<ControlData>,
    isDefault?: boolean,
    showMenu?: boolean,
    header?: { controls: ControlData[] },
    footer?: { controls: ControlData[] },
    views?: { controls: ControlData[] }[]
}

export interface TemplatePageData {
    _id: string;
    name: string;
    image: string;
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export class StationService extends Service {
    // private _homeProduct: JData.WebDataSource;
    private url(path: string) {
        let url = `${Service.config.siteUrl}${path}`;
        return url;
    }
    private async fillPageData(pageData: PageData): Promise<PageData> {
        if (pageData.views == null && pageData['controls'] != null) {
            pageData.views = [{ controls: pageData['controls'] }];
        }

        let menuControlData = pageData.footer.controls.filter(o => o.controlName == 'menu')[0];
        if (!menuControlData && pageData.showMenu == true) {
            menuControlData = await this.menuControlData();
            menuControlData.selected = 'disabled';
            pageData.footer.controls.push(menuControlData);
        }

        let styleControlData = pageData.footer.controls.filter(o => o.controlName == 'style')[0];
        if (!styleControlData) {
            styleControlData = await this.styleControlData();
            styleControlData.selected = 'disabled';
            pageData.footer.controls.push(styleControlData);
        }
        return pageData;
    }
    private trimPageData(pageData: PageData) {
        
        // 深复制 pageData
        let pageDataCopy = JSON.parse(JSON.stringify(pageData)); 

        let trimControls = (controls: ControlData[]) => {
            return controls.filter(o => o.selected != 'disabled');
        }
        if (pageDataCopy.header) {
            pageDataCopy.header.controls = trimControls(pageDataCopy.header.controls);
        }
        if (pageDataCopy.footer) {
            pageDataCopy.footer.controls = trimControls(pageDataCopy.footer.controls);
        }
        if (pageDataCopy.views) {
            for (let i = 0; i < pageDataCopy.views.length; i++) {
                pageDataCopy.views[i].controls = trimControls(pageDataCopy.views[i].controls);
            }
        }
        return pageDataCopy;
    }
    savePageData(pageData: PageData) {
        let url = `${Service.config.siteUrl}Page/SavePageData`;
        let _pageData = this.trimPageData(pageData);
        return Service.postByJson(url, { pageData: _pageData }).then((data) => {
            Object.assign(pageData, data);
            return data;
        });
    }
    pageData(pageId: string) {
        let url = `${Service.config.siteUrl}Page/GetPageData`;
        let data = { pageId };
        return Service.get<PageData>(url, { pageId }).then(pageData => this.fillPageData(pageData));
    }
    pageDataByName(name: string) {
        let url = `${Service.config.siteUrl}Page/GetPageDataByName`;
        let data = { name };
        return Service.get<PageData>(url, data).then(o => {
            // this.fillPageData(o);
            return o;
        });
    }
    pageDataByTemplate(templateId: string) {
        let url = `${Service.config.siteUrl}Page/GetPageDataByTemplate`;
        let data = { templateId };
        return Service.get<PageData>(url, data).then(o => this.fillPageData(o));
    }
    pageDatas() {
        let url = this.url('Page/GetPageDatas');
        return Service.get<PageData[]>(url).then(o => {
            return o || [];
        });
    }
    deletePageData(pageId: string) {
        let url = this.url('Page/DeletePage');
        return Service.delete(url, { pageId });
    }
    setDefaultPage(pageId: string) {
        let url = this.url('Page/SetDefaultPage');
        return Service.putByJson(url, { pageId });
    }
    pageTemplates() {
        let url = this.url('Page/GetTemplatePageDatas');
        return Service.get<TemplatePageData[]>(url);
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

    //============================================================
    controlData(name: string) {
        let url = this.url('Page/GetControlData');
        return Service.getByJson<ControlData>(url, { query: { controlName: name } });
    }
    saveControlData(data: ControlData, name: string) {
        let url = this.url('Page/SaveControlData');
        (data as any).name = name;
        return Service.postByJson(url, { data }).then(result => {
            Object.assign(data, result);
        });
    }
    async menuControlData() {
        let menuData = await this.controlData('menu');
        if (menuData == null) {
            menuData = { controlId: guid(), controlName: 'menu', data: {} };
        }
        return menuData;
    }
    async styleControlData() {
        let styleData = await this.controlData('style');
        if (styleData == null) {
            styleData = { controlId: guid(), controlName: 'style', data: {} };
        }
        return styleData;
    }
    //============================================================
}

let pageNames = {
    storeStyle: 'storeStyle',
    storeMenu: 'storeMenu'
}
let defaultPageDatas = {
    storeStyle: {
        name: pageNames.storeStyle,
        views: [
            {
                controls: [
                    // { controlId: guid(), controlName: 'product:Control', selected: 'disabled' },
                    // { controlId: guid(), controlName: 'style', selected: true }
                ]
            }
        ]
    } as PageData,
    storeMenu: {
        name: pageNames.storeMenu,
        footer: {
            controls: [
                { controlId: guid(), controlName: 'menu', data: { menuNodes: [{ name: '首页' }, { name: '个人中心' }] }, selected: true },
            ]
        }
    } as PageData
}

export default new StationService();