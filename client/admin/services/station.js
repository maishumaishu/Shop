var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/service", "admin/services/data/templates", "share/common", "admin/services/service"], function (require, exports, service_1, templates_1, common_1, service_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.guid = service_2.guid;
    // type ImageData = {
    //     id: string, width?: number, height?: number
    // }
    class StationService extends service_1.default {
        url(path) {
            let url = `${service_1.default.config.siteUrl}${path}`;
            return url;
        }
        savePageData(pageData, isSystem) {
            let url = `${service_1.default.config.siteUrl}Page/SavePageData`;
            return this.postByJson(url, { pageData, isSystem }).then((data) => {
                Object.assign(pageData, data);
                return data;
            });
        }
        pageDataByTemplate(templateId) {
            var pageData = templates_1.default.filter(o => o.id == templateId).map(o => o.pageData)[0];
            return Promise.resolve(pageData);
        }
        pageDatas() {
            let url = this.url('Page/GetPageDatas');
            return this.getByJson(url).then(o => {
                return o || [];
            });
        }
        pageList(args) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = this.url('Page/GetPageList');
                let pageList = yield this.getByJson(url);
                let pages = pageList.dataItems.map(o => ({ id: o.Id, name: o.Name }));
                return { totalRowCount: pageList.totalRowCount, dataItems: pages };
            });
        }
        pageDataById(pageId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!pageId)
                    throw new Error('argument pageId null');
                let url = this.url('Page/GetPageDataById');
                let data = { pageId };
                let pageData = yield this.getByJson(url, { id: pageId });
                if (pageData == null) {
                    let error = new Error(`Page data ${pageId} is not exists.`);
                    this.error.fire(this, error);
                    throw error;
                }
                // pageData = await fillPageData(pageData);
                return pageData;
            });
        }
        deletePageData(pageId) {
            let url = this.url('Page/DeletePage');
            return this.deleteByJson(url, { pageId });
        }
        setDefaultPage(pageId) {
            let url = this.url('Page/SetDefaultPage');
            return this.putByJson(url, { pageId });
        }
        pageTemplates() {
            return __awaiter(this, void 0, void 0, function* () {
                return Promise.resolve(templates_1.default);
            });
        }
        //=================================================================
        // 和图片相干的接口
        /**
         * 保存图片
         * @param name 图片名称
         * @param imageBase64 图片的 base64 字符串
         */
        saveImage(imageBase64) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `${common_1.imageServiceBaseUrl}upload`;
                let image = document.createElement('img');
                return new Promise((resovle, reject) => {
                    image.onload = () => __awaiter(this, void 0, void 0, function* () {
                        let { width, height } = image;
                        let result = yield this.postByJson(url, { name, image: imageBase64, width, height });
                        resovle({ id: result.id, width, height });
                    });
                    image.src = imageBase64;
                });
            });
        }
        images(args, width, height) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = `${common_1.imageServiceBaseUrl}list`;
                let result = yield this.postByJson(url, args);
                return result;
            });
        }
        removeImage(id) {
            let url = `${common_1.imageServiceBaseUrl}delete/${id}`;
            return this.get(url);
        }
        pareeUrlQuery(query) {
            let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
            let urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
            return urlParams;
        }
        //============================================================
        // 店铺
        saveStore(store) {
            let url = this.url('Store/Save');
            return this.postByJson(url, { store });
        }
        store() {
            let url = this.url('Store/Get');
            return this.getByJson(url);
        }
    }
    exports.StationService = StationService;
});
