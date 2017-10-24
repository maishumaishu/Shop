import { Service, config, imageUrl, guid } from 'userServices/service';



export class StationService extends Service {
    constructor() {
        super();
    }

    private url(path) {
        return `${config.service.site}${path}`;
    }

    newsList(pageIndex: number) {
        let url = this.url('Info/GetNewsList');
        return this.get<News[]>(url, { pageIndex }).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    news(newsId: string): Promise<News> {
        let url = this.url('Info/GetNews');
        return this.get<News>(url, { newsId }).then(item => {
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
        return this.get<Array<string>>(this.url('Home/GetSearchKeywords'));
    }

    historySearchWords() {
        return this.get<Array<string>>(this.url('Home/HistorySearchWords'));
    }

    advertItems(): Promise<{ ImgUrl: string, Id: string }[]> {
        return this.get<{ ImgUrl: string, Id: string }[]>(this.url('Home/GetAdvertItems')).then(items => {
            items.forEach(o => o.ImgUrl = imageUrl(o.ImgUrl));
            return items;
        });
    }

    proudcts(pageIndex?: number): Promise<HomeProduct[]> {
        pageIndex = pageIndex === undefined ? 0 : pageIndex;
        let url = this.url('Home/GetHomeProducts');
        return this.get<HomeProduct[]>(url, { pageIndex }).then((products) => {
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
    private async fillPageData(pageData: PageData): Promise<PageData> {
        if (pageData.views == null && pageData['controls'] != null) {
            pageData.views = [{ controls: pageData['controls'] }];
        }

        pageData.footer = pageData.footer || { controls: [] };
        pageData.footer.controls = pageData.footer.controls || [];

        return pageData;
    }
    //============================================================
    // PageData
    pageData(pageId: string) {
        let url = this.url('Page/GetPageData');
        let data = { pageId };
        return this.getByJson<PageData>(url, { query: { _id: pageId } })
            .then(pageData => this.fillPageData(pageData));
    }
    defaultPageData() {
        let url = this.url('Page/GetDefaultPageData');
        return this.get<PageData>(url).then(pageData => this.fillPageData(pageData));
    }
    async memberPageData() {
        let memberControlData = await this.memberControlData();
        let pageData = {
            showMenu: true,
            views: [
                { controls: [memberControlData] }
            ]
        } as PageData;
        return this.fillPageData(pageData);
    }
    //============================================================
    controlData(name: string) {
        let url = this.url('Page/GetControlData');
        return this.getByJson<ControlData>(url, { query: { controlName: name } });
    }
    saveControlData(data: ControlData) {
        let url = this.url('Page/SaveControlData');
        return this.post(url, { data }).then(result => {
            Object.assign(data, result);
        });
    }
    async menuControlData() {
        let menuData = await this.controlData('menu');
        if (menuData == null) {
            menuData = { controlId: guid(), controlName: 'menu' };
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
    async memberControlData() {
        let member = await this.controlData('member');
        if (member == null) {
            member = { controlId: guid(), controlName: 'member', data: {} };
        }
        return member;
    }

    pageDataByName(name: string) {
        let url = this.url('Page/GetPageData');
        let query = { name };
        return this.getByJson<PageData>(url, { query }).then(o => {
            return o;
        });
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
        }
    };

    homePage(): Promise<PageData> {
        const pageName = this.defaultPages.home.name;
        return this.pageDataByName(pageName).then(pageData => {
            if (pageData == null) {
                pageData = this.defaultPages.home;
            }
            return pageData;
        });
    }

    memberPage(): Promise<PageData> {
        const pageName = this.defaultPages.member.name;
        return this.pageDataByName(pageName).then(pageData => {
            if (pageData == null) {
                pageData = this.defaultPages.member;
            }
            return pageData;
        });
    }

    menuPage(): Promise<PageData> {
        const pageName = this.defaultPages.menu.name;
        return this.pageDataByName(pageName).then(pageData => {
            if (pageData == null) {
                pageData = this.defaultPages.menu;
            }
            return pageData;
        });
    }

    stylePage(): Promise<PageData> {
        const pageName = this.defaultPages.style.name;
        return this.pageDataByName(pageName).then(pageData => {
            if (pageData == null)
                pageData = this.defaultPages.style;

            return pageData;
        });
    }

    categoriesPage(): Promise<PageData> {
        const pageName = this.defaultPages.categories.name;
        return this.pageDataByName(pageName).then(pageData => {
            if (pageData == null)
                pageData = this.defaultPages.categories;

            return pageData;
        });
    }

    //============================================================
}
