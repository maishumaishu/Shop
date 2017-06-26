
namespace userServices {
    export interface ControlData {
        controlId: string, controlName: string, data?: any,
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

    export interface News {
        Id: string, Title: string, ImgUrl: string,
        Date: Date, Content: string
    }

    export interface HomeProduct {
        Id: string, Name: string, ImagePath: string,
        ProductId: string, Price: number, PromotionLabel: string
    }

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
            return this.get<{ ImgUrl: string }[]>(this.url('Home/GetAdvertItems')).then(items => {
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
        //============================================================
        // PageData
        pageData(pageId: string) {
            let url = this.url('Page/GetPageData');
            let data = { pageId };
            return this.get<PageData>(url, { pageId }).then(pageData => this.fillPageData(pageData));
        }
        defaultPageData() {
            let url = this.url('Page/GetDefaultPageData');
            return this.get<PageData>(url).then(pageData => this.fillPageData(pageData));
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
        //============================================================
    }
}
