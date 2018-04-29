import { Service, config, imageUrl, guid } from 'user/services/service';
import { StationService as AdminStationService } from 'admin/services/station';
export class PageDatas {

    private station: StationService;

    constructor(station: StationService) {
        this.station = station;
    }

    private defaultPages = {
        member: <PageData>{
            name: '*member',
            view: { controls: [{ controlId: guid(), controlName: 'member', selected: true }] }
        },
        menu: <PageData>{
            name: '*menu',
            footer: { controls: [{ controlId: guid(), controlName: 'menu', selected: true }] }
        },
        style: <PageData>{
            name: '*style',
            footer: { controls: [{ controlId: guid(), controlName: 'style', selected: true }] }
        },
        categories: <PageData>{
            name: '*categories',
            view: { controls: [{ controlId: guid(), controlName: 'categories', selected: true }] }
        },
        home: <PageData>{
            name: '*home',
            view: { controls: [{ controlId: guid(), controlName: 'summaryHeader', selected: true }] }
        },
        shoppingCart: <PageData>{
            name: '*shoppingCart',
            showMenu: true,
            className: 'shopping-shoppingCart',
            header: {
                controls: [
                    { controlId: guid(), controlName: 'shoppingCart:Header' }
                ]
            },
            view: {
                controls: [
                    { controlId: guid(), controlName: 'shoppingCart' }
                ]
            },
            footer: {
                controls: [
                    { controlId: guid(), controlName: 'shoppingCart:Footer' }
                ]
            }
        }
    };

    private async pageDataByName(name: string) {
        let pageName = `*${name}`;
        let pageData = await pageDataByName(this.station, pageName); //this.station.pageDataByName(pageName);

        if (pageData == null) {
            //===========================================
            // 获取默认的数据，如果是后台，自动添加默认的 PageData 
            pageData = this.defaultPages[name];
            if (window['admin-app'] != null && pageData != null) {
                requirejs(['admin/services/station'], function (e: any) {
                    let adminStation: AdminStationService = new e['StationService']();
                    adminStation.savePageData(pageData, true);
                })
            }
            //===========================================
        }
        return pageData;
    }


    async pageDataById(pageId: string) {
        if (!pageId) throw new Error('argument pageId null');

        let url = this.station.url('Page/GetPageDataById');
        let data = { pageId };
        let pageData = await this.station.getByJson<PageData>(url, { id: pageId })
        if (pageData == null) throw new Error(`Page ${pageId} is not exists.`);
        pageData = await fillPageData(pageData);
        return pageData;
    }


    home(): Promise<PageData> {
        return this.pageDataByName('home');
    }

    member(): Promise<PageData> {
        return this.pageDataByName('member');
    }

    menu(): Promise<PageData> {
        return this.pageDataByName('menu');
    }

    style(): Promise<PageData> {
        return this.pageDataByName('style');
    }

    categories(): Promise<PageData> {
        return this.pageDataByName('categories');
    }

    shoppingCart(): Promise<PageData> {
        return this.pageDataByName('shoppingCart');
    }
}

function pageDataByName(service: StationService, name: string): Promise<PageData> {
    let url = service.url('Page/GetPageDataByName');
    return service.getByJson<PageData>(url, { name }).then(o => {
        if (o != null && o["_id"] != null) {
            o.id = o["_id"];
            delete o["_id"];
        }

        return fillPageData(o);
    });
}

async function fillPageData(pageData: PageData): Promise<PageData> {
    if (pageData == null)
        return null;

    if (pageData.view == null && pageData['controls'] != null) {
        pageData.view = { controls: pageData['controls'] };
    }
    else if (pageData.view == null && pageData['views'] != null) {
        pageData.view = pageData['views'][0] || {};
    }

    pageData.footer = pageData.footer || { controls: [] };
    pageData.footer.controls = pageData.footer.controls || [];
    pageData.header = pageData.header || { controls: [] };
    pageData.header.controls = pageData.header.controls || [];

    return pageData;
}

export class StationService extends Service {

    private _pages: PageDatas;

    constructor() {
        super();
        this._pages = new PageDatas(this);
    }

    url(path) {
        return `UserSite/${path}`;
    }

    get pages(): PageDatas {
        return this._pages;
    }

    newsList(pageIndex: number) {
        let url = this.url('Info/GetNewsList');
        return this.getByJson<News[]>(url, { pageIndex }).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    news(newsId: string): Promise<News> {
        let url = this.url('Info/GetNews');
        return this.getByJson<News>(url, { newsId }).then(item => {
            item.ImgUrl = imageUrl(item.ImgUrl);
            let div = document.createElement('div');
            div.innerHTML = item.Content;
            let imgs = div.querySelectorAll('img');
            for (let i = 0; i < imgs.length; i++) {
                (imgs[i] as HTMLImageElement).src = imageUrl((imgs[i] as HTMLImageElement).src);
            }

            item.Content = div.innerHTML;

            return item;
        });
    }

    searchKeywords() {
        return this.getByJson<Array<string>>(this.url('Home/GetSearchKeywords'));
    }

    historySearchWords() {
        return this.getByJson<Array<string>>(this.url('Home/HistorySearchWords'));
    }

    advertItems(): Promise<{ ImgUrl: string, Id: string }[]> {
        return this.getByJson<{ ImgUrl: string, Id: string }[]>(this.url('Home/GetAdvertItems')).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = this.url('Home/GetHomeProducts');
        return this.getByJson<HomeProduct[]>(url, { pageIndex }).then((products) => {
            products.forEach(o => o.ImagePath = imageUrl(o.ImagePath));
            return products;
        });
    }

    private translatePageData(pageData: PageData): PageData {
        if (pageData.view == null && pageData['controls'] != null) {
            pageData.view = { controls: pageData['controls'] };
        }

        pageData.view = pageData.view || { controls: [] };

        pageData.footer = pageData.footer || { controls: [] };
        pageData.header = pageData.header || { controls: [] };
        return pageData;
    }

    async fullPage(page: () => Promise<PageData>) {
        let result = await Promise.all([page.bind(this)(), this.pages.style(), this.pages.menu()]);
        let pageData = result[0] as PageData;
        let stylePageData = result[1];
        let menuPageData = result[2];

        pageData.footer = pageData.footer || {} as any;
        pageData.footer.controls = pageData.footer.controls || [];

        // let existsStyleControl = pageData.footer.controls.filter(o => o.controlName == 'style').length > 0;
        // if (!existsStyleControl) {
        //     // station.stylePage().then(stylePageData => {
        //     let styleControl = stylePageData.footer.controls[0];
        //     console.assert(styleControl != null && styleControl.controlName == 'style');
        //     pageData.footer.controls.push(styleControl);
        //     // })/home/maishu/projects/shop-cloud/trunk/Assemblies/packages/Microsoft.AspNet.WebApi.Core.5.2.3/lib/net45/System.Web.Http.dll
        // }

        let existsMenuControl = pageData.footer.controls.filter(o => o.controlName == 'menu').length > 0;
        if (!existsMenuControl && pageData.showMenu) {
            let menuControlData = menuPageData.footer.controls.filter(o => o.controlName == 'menu')[0];
            console.assert(menuControlData != null);
            pageData.footer.controls.push(menuControlData);
        }

        return pageData;
    }

    store() {
        let url = this.url('Store/Get');
        return this.getByJson<StoreInfo>(url);
    }
}
