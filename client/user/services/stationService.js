var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PageDatas {
        constructor(station) {
            this.defaultPages = {
                member: {
                    name: '*member',
                    controls: [{ controlId: service_1.guid(), controlName: 'member', selected: true }]
                },
                menu: {
                    name: '*menu',
                    controls: [{ controlId: service_1.guid(), controlName: 'menu', selected: true }]
                },
                style: {
                    name: '*style',
                    controls: [{ controlId: service_1.guid(), controlName: 'style', selected: true }]
                },
                categories: {
                    name: '*categories',
                    controls: [{ controlId: service_1.guid(), controlName: 'categories', selected: true }]
                },
                home: {
                    name: '*home',
                    controls: [{ controlId: service_1.guid(), controlName: 'summaryHeader', selected: true }]
                },
                shoppingCart: {
                    name: '*shoppingCart',
                    showMenu: true,
                    className: 'shopping-shoppingCart',
                    controls: [
                        { controlId: service_1.guid(), controlName: 'shoppingCart:Header', position: 'header' },
                        { controlId: service_1.guid(), controlName: 'shoppingCart', position: 'view' },
                        { controlId: service_1.guid(), controlName: 'shoppingCart:Footer', position: 'footer' }
                    ]
                }
            };
            this.station = station;
        }
        pageDataByName(name) {
            return __awaiter(this, void 0, void 0, function* () {
                let pageName = `*${name}`;
                let pageData = yield pageDataByName(this.station, pageName); //this.station.pageDataByName(pageName);
                if (pageData == null) {
                    //===========================================
                    // 获取默认的数据，如果是后台，自动添加默认的 PageData 
                    pageData = this.defaultPages[name];
                    if (window['admin-app'] != null && pageData != null) {
                        requirejs(['admin/services/station'], function (e) {
                            let adminStation = new e['StationService']();
                            adminStation.savePageData(pageData, true);
                        });
                    }
                    //===========================================
                }
                pageData = yield fillPageData(pageData);
                return pageData;
            });
        }
        pageDataById(pageId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!pageId)
                    throw new Error('argument pageId null');
                let url = this.station.url('Page/GetPageDataById');
                let data = { pageId };
                let pageData = yield this.station.getByJson(url, { id: pageId });
                if (pageData == null) {
                    let error = new Error(`Page data ${pageId} is not exists.`);
                    this.station.error.fire(this.station, error);
                    throw error;
                }
                pageData = yield fillPageData(pageData);
                return pageData;
            });
        }
        home() {
            return this.pageDataByName('home');
        }
        member() {
            return this.pageDataByName('member');
        }
        menu() {
            return this.pageDataByName('menu');
        }
        style() {
            return this.pageDataByName('style');
        }
        categories() {
            return this.pageDataByName('categories');
        }
        shoppingCart() {
            return this.pageDataByName('shoppingCart');
        }
    }
    exports.PageDatas = PageDatas;
    function pageDataByName(service, name) {
        let url = service.url('Page/GetPageDataByName');
        return service.getByJson(url, { name }).then(o => {
            if (o != null && o["_id"] != null) {
                o.id = o["_id"];
                delete o["_id"];
            }
            return fillPageData(o);
        });
    }
    function fillPageData(pageData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (pageData == null)
                return null;
            // if (pageData.view == null && pageData['controls'] != null) {
            //     pageData.view = { controls: pageData['controls'] };
            // }
            // else if (pageData.view == null && pageData['views'] != null) {
            //     pageData.view = pageData['views'][0] || {};
            // }
            // pageData.footer = pageData.footer || { controls: [] };
            // pageData.footer.controls = pageData.footer.controls || [];
            // pageData.header = pageData.header || { controls: [] };
            // pageData.header.controls = pageData.header.controls || [];
            let controls = new Array();
            let obj = pageData;
            if (obj.views) {
                obj.view = obj.views[0];
                delete obj.views;
            }
            if (obj.header != null && obj.header.controls != null) {
                obj.header.controls.forEach(o => {
                    o.position = 'header';
                    controls.push(o);
                });
                delete obj.header;
            }
            if (obj.footer != null && obj.footer.controls != null) {
                obj.footer.controls.forEach(o => {
                    o.position = 'footer';
                    controls.push(o);
                });
                delete obj.footer;
            }
            if (obj.view != null && obj.view.controls != null) {
                obj.view.controls.forEach(o => {
                    o.position = 'view';
                    controls.push(o);
                });
                delete obj.view;
            }
            if (pageData.controls == null)
                pageData.controls = controls;
            else
                pageData.controls.push(...controls);
            return pageData;
        });
    }
    class StationService extends service_1.Service {
        constructor() {
            super();
            this._pages = new PageDatas(this);
        }
        url(path) {
            return `UserSite/${path}`;
        }
        get pages() {
            return this._pages;
        }
        newsList(pageIndex) {
            let url = this.url('Info/GetNewsList');
            return this.getByJson(url, { pageIndex }).then(items => {
                items.forEach(o => o.ImgUrl = service_1.imageUrl(o.ImgUrl));
                return items;
            });
        }
        news(newsId) {
            let url = this.url('Info/GetNews');
            return this.getByJson(url, { newsId }).then(item => {
                item.ImgUrl = service_1.imageUrl(item.ImgUrl);
                let div = document.createElement('div');
                div.innerHTML = item.Content;
                let imgs = div.querySelectorAll('img');
                for (let i = 0; i < imgs.length; i++) {
                    imgs[i].src = service_1.imageUrl(imgs[i].src);
                }
                item.Content = div.innerHTML;
                return item;
            });
        }
        searchKeywords() {
            return this.getByJson(this.url('Home/GetSearchKeywords'));
        }
        historySearchWords() {
            return this.getByJson(this.url('Home/HistorySearchWords'));
        }
        advertItems() {
            return this.getByJson(this.url('Home/GetAdvertItems')).then(items => {
                items.forEach(o => o.ImgUrl = service_1.imageUrl(o.ImgUrl));
                return items;
            });
        }
        proudcts(pageIndex) {
            pageIndex = pageIndex === undefined ? 0 : pageIndex;
            let url = this.url('Home/GetHomeProducts');
            return this.getByJson(url, { pageIndex }).then((products) => {
                products.forEach(o => o.ImagePath = service_1.imageUrl(o.ImagePath));
                return products;
            });
        }
    }
    exports.StationService = StationService;
});
