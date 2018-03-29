import { Service, config, imageUrl, guid } from 'userServices/service';


class Pages {

    private station: StationService;

    constructor(station: StationService) {
        this.station = station;
    }

    private defaultPages = {
        member: <PageData>{
            name: '*member',
            views: [{ controls: [{ controlId: guid(), controlName: 'member', selected: true }] }]
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
            views: [{ controls: [{ controlId: guid(), controlName: 'categories', selected: true }] }]
        },
        home: <PageData>{
            name: '*home',
            views: [{ controls: [{ controlId: guid(), controlName: 'summaryHeader', selected: true }] }]
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
            views: [
                {
                    controls: [
                        { controlId: guid(), controlName: 'shoppingCart' }
                    ]
                }
            ],
            footer: {
                controls: [
                    { controlId: guid(), controlName: 'shoppingCart:Footer' }
                ]
            }
        }
    };



    private getPage(name: string) {
        let pageName = `*${name}`;
        return this.station.pageDataByName(pageName).then(pageData => {
            if (pageData == null) {
                pageData = this.defaultPages[name];
            }
            return pageData;
        });
    }


    home(): Promise<PageData> {
        return this.getPage('home');
    }

    member(): Promise<PageData> {
        return this.getPage('member');
    }

    menu(): Promise<PageData> {
        return this.getPage('menu');
    }

    style(): Promise<PageData> {
        return this.getPage('style');
    }

    categories(): Promise<PageData> {
        return this.getPage('categories');
    }

    shoppingCart(): Promise<PageData> {
        return this.getPage('shoppingCart');
    }
}


export class StationService extends Service {

    private _pages: Pages;

    constructor() {
        super();
        this._pages = new Pages(this);
    }

    url(path) {
        return `UserSite/${path}`;
    }

    get pages(): Pages {
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
        if (pageData.views == null && pageData['controls'] != null) {
            pageData.views = [{ controls: pageData['controls'] }];
        }

        pageData.views = pageData.views || [
            { controls: [] }
        ];

        pageData.footer = pageData.footer || { controls: [] };
        pageData.header = pageData.header || { controls: [] };
        return pageData;
    }

    //============================================================
    // PageData

    private async fillPageData(pageData: PageData): Promise<PageData> {
        if (pageData.views == null && pageData['controls'] != null) {
            pageData.views = [{ controls: pageData['controls'] }];
        }

        pageData.footer = pageData.footer || { controls: [] };
        pageData.footer.controls = pageData.footer.controls || [];
        pageData.header = pageData.header || { controls: [] };
        pageData.header.controls = pageData.header.controls || [];
        
        return pageData;
    }

    pageData(pageId: string) {
        let url = this.url('Page/GetPageDataById');
        let data = { pageId };
        return this.getByJson<PageData>(url, { query: { _id: pageId } })
            .then(pageData => this.fillPageData(pageData));
    }
    defaultPageData() {
        let url = this.url('Page/GetDefaultPageData');
        return this.getByJson<PageData>(url).then(pageData => this.fillPageData(pageData));
    }
    //============================================================

    pageDataByName(name: string) {
        let url = this.url('Page/GetPageDataByName');
        // let query = { name };
        return this.getByJson<PageData>(url, { name }).then(o => {
            return this.fillPageData(o);
        });
    }

    controlData(name: string) {
        let url = this.url('Page/GetControlData');
        return this.getByJson<ControlData>(url, { query: { controlName: name } });
    }
    saveControlData(data: ControlData) {
        let url = this.url('Page/SaveControlData');
        return this.postByJson(url, { data }).then(result => {
            Object.assign(data, result);
        });
    }

    //============================================================

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
