

/*!
 * CHITU v1.6.0
 * https://github.com/ansiboy/ChiTu
 *
 * Copyright (c) 2016-2018, shu mai <ansiboy@163.com>
 * Licensed under the MIT License.
 *
 */

(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js 
        var target = module['exports'] || exports;
        var chitu = factory(target, require);
        Object.assign(target, chitu);
    } else if (typeof define === 'function' && define['amd']) {
        define(factory);
    } else {
        factory();
    }
})(function () {
    var chitu;
    (function (chitu) {
        const EmtpyStateData = "";
        const DefaultPageName = "index";
        function parseUrl(app, url) {
            let sharpIndex = url.indexOf('#');
            if (sharpIndex < 0) {
                let pageName = DefaultPageName;
                return { pageName, values: {} };
            }
            let routeString = url.substr(sharpIndex + 1);
            if (!routeString)
                throw Errors.canntParseRouteString(url);
            if (routeString.startsWith('!')) {
                let url = createUrl(app.currentPage.name, app.currentPage.data);
                history.replaceState(EmtpyStateData, "", url);
                return;
            }
            let routePath;
            let search;
            let param_spliter_index = routeString.indexOf('?');
            if (param_spliter_index > 0) {
                search = routeString.substr(param_spliter_index + 1);
                routePath = routeString.substring(0, param_spliter_index);
            }
            else {
                routePath = routeString;
            }
            if (!routePath)
                throw Errors.canntParseRouteString(routeString);
            let values = {};
            if (search) {
                values = pareeUrlQuery(search);
            }
            let path_parts = routePath.split(this.path_spliter_char).map(o => o.trim()).filter(o => o != '');
            if (path_parts.length < 1) {
                throw Errors.canntParseRouteString(routeString);
            }
            let file_path = path_parts.join('/');
            let pageName = path_parts.join('.');
            return { pageName, values };
        }
        function pareeUrlQuery(query) {
            let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
            let urlParams = {};
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
            return urlParams;
        }
        function createUrl(pageName, params) {
            let path_parts = pageName.split('.');
            let path = path_parts.join('/');
            if (!params)
                return `#${path}`;
            let stack = [];
            stack.push(params);
            while (stack.length > 0) {
                let obj = stack.pop();
                for (let key in obj) {
                    let type = typeof (obj[key]);
                    if (type == 'function' || obj[key] == null) {
                        delete obj[key];
                        continue;
                    }
                    else if (type == 'object') {
                        for (let key1 in obj[key])
                            if (typeof obj[key][key1] == 'object')
                                stack.push(obj[key][key1]);
                    }
                }
            }
            let paramsText = "";
            for (let key in params) {
                paramsText = paramsText + `&${key}=${params[key]}`;
            }
            if (paramsText.length > 0)
                paramsText = paramsText.substr(1);
            return `#${path}?${paramsText}`;
        }
        var PAGE_STACK_MAX_SIZE = 30;
        var CACHE_PAGE_SIZE = 30;
        var ACTION_LOCATION_FORMATER = '{controller}/{action}';
        var VIEW_LOCATION_FORMATER = '{controller}/{action}';
        class Application {
            constructor(siteMap) {
                this.pageCreated = chitu.Callbacks();
                this.pageType = chitu.Page;
                this.pageDisplayType = PageDisplayerImplement;
                this._runned = false;
                this.cachePages = {};
                this.allNodes = {};
                this.page_stack = new Array();
                this.error = chitu.Callbacks();
                if (!siteMap) {
                    throw Errors.argumentNull("siteMap");
                }
                this.allNodes = siteMap.nodes || {};
                for (let key in this.allNodes) {
                    this.allNodes[key].name = key;
                }
            }
            parseUrl(url) {
                let routeData = parseUrl(this, url);
                return routeData;
            }
            createUrl(pageName, values) {
                return createUrl(pageName, values);
            }
            on_pageCreated(page) {
                return this.pageCreated.fire(this, page);
            }
            get currentPage() {
                if (this.page_stack.length > 0)
                    return this.page_stack[this.page_stack.length - 1];
                return null;
            }
            getPage(pageName, values) {
                values = values || {};
                let allowCache = this.allowCache(pageName);
                console.assert(allowCache != null);
                let cachePage = this.cachePages[pageName];
                if (cachePage != null && allowCache) {
                    cachePage.data = values;
                    return cachePage;
                }
                if (cachePage != null)
                    cachePage.close();
                let page = this.createPage(pageName, values);
                let page_onloadComplete = (sender, args) => {
                    this.cachePages[sender.name] = sender;
                };
                let page_onclosed = (sender) => {
                    delete this.cachePages[sender.name];
                    this.page_stack = this.page_stack.filter(o => o != sender);
                    page.closed.remove(page_onclosed);
                    page.loadComplete.remove(page_onloadComplete);
                };
                page.closed.add(page_onclosed);
                page.loadComplete.add(page_onloadComplete);
                this.on_pageCreated(page);
                return page;
            }
            createPage(pageName, values) {
                let element = this.createPageElement(pageName);
                let displayer = new this.pageDisplayType(this);
                let siteMapNode = this.findSiteMapNode(pageName);
                if (siteMapNode == null)
                    throw Errors.pageNodeNotExists(pageName);
                if (siteMapNode.action == null)
                    throw Errors.actionCanntNull(pageName);
                console.assert(this.pageType != null);
                let page = new this.pageType({
                    app: this,
                    name: pageName,
                    data: values,
                    displayer,
                    element,
                    action: siteMapNode.action,
                });
                return page;
            }
            allowCache(pageName) {
                let node = this.allNodes[pageName];
                console.assert(node != null);
                return node.cache || false;
            }
            createPageElement(pageName) {
                let element = document.createElement(chitu.Page.tagName);
                document.body.appendChild(element);
                return element;
            }
            hashchange() {
                var routeData = this.parseUrl(location.href);
                if (routeData == null) {
                    return;
                }
                this.showPageByUrl(location.href);
            }
            run() {
                if (this._runned)
                    return;
                var app = this;
                this.hashchange();
                window.addEventListener('popstate', (event) => {
                    if (event.state == Application.skipStateName)
                        return;
                    this.hashchange();
                });
                this._runned = true;
            }
            showPage(node, args) {
                if (!node)
                    throw Errors.argumentNull('node');
                let pageName = node.name;
                if (!pageName)
                    throw Errors.argumentNull('pageName');
                if (this.currentPage != null && this.currentPage.name == pageName)
                    return;
                args = args || {};
                let oldCurrentPage = this.currentPage;
                let isNewPage = false;
                let page = this.getPage(pageName, args);
                page.show();
                this.pushPage(page);
                console.assert(page == this.currentPage, "page is not current page");
                return this.currentPage;
            }
            showPageByUrl(url, args) {
                if (!url)
                    throw Errors.argumentNull('url');
                var routeData = this.parseUrl(url);
                if (routeData == null) {
                    throw Errors.noneRouteMatched(url);
                }
                Object.assign(routeData.values, args || {});
                let node = this.allNodes[routeData.pageName];
                if (node == null)
                    throw Errors.pageNodeNotExists(routeData.pageName);
                return this.showPage(node, routeData.values);
            }
            pushPage(page) {
                let previous = this.currentPage;
                this.page_stack.push(page);
            }
            findSiteMapNode(pageName) {
                return this.allNodes[pageName];
            }
            setLocationHash(url) {
                history.pushState(EmtpyStateData, "", url);
            }
            closeCurrentPage() {
                if (this.page_stack.length <= 0)
                    return;
                var page = this.page_stack.pop();
                if (this.allowCache(page.name)) {
                    page.hide(this.currentPage);
                }
                else {
                    page.close();
                }
                if (this.currentPage) {
                    this.currentPage.show();
                }
            }
            redirect(node, args) {
                if (!node)
                    throw Errors.argumentNull("node");
                let result = this.showPage(node, args);
                let url = this.createUrl(node.name, args);
                this.setLocationHash(url);
                return result;
            }
            back() {
                history.back();
            }
            loadjs(path) {
                return new Promise((reslove, reject) => {
                    requirejs([path], function (result) {
                        reslove(result);
                    }, function (err) {
                        reject(err);
                    });
                });
            }
            get pageNodes() {
                return this.allNodes;
            }
        }
        Application.skipStateName = 'skip';
        chitu.Application = Application;
    })(chitu || (chitu = {}));
    class Errors {
        static pageNodeNotExists(pageName) {
            let msg = `Page node named ${pageName} is not exists.`;
            return new Error(msg);
        }
        static actionCanntNull(pageName) {
            let msg = `Action of '${pageName}' can not be null.`;
            return new Error(msg);
        }
        static argumentNull(paramName) {
            var msg = `The argument "${paramName}" cannt be null.`;
            return new Error(msg);
        }
        static modelFileExpecteFunction(script) {
            var msg = `The eval result of script file "${script}" is expected a function.`;
            return new Error(msg);
        }
        static paramTypeError(paramName, expectedType) {
            var msg = `The param "${paramName}" is expected "${expectedType}" type.`;
            return new Error(msg);
        }
        static paramError(msg) {
            return new Error(msg);
        }
        static pathPairRequireView(index) {
            var msg = `The view value is required for path pair, but the item with index "${index}" is miss it.`;
            return new Error(msg);
        }
        static notImplemented(name) {
            var msg = `'The method "${name}" is not implemented.'`;
            return new Error(msg);
        }
        static routeExists(name) {
            var msg = `Route named "${name}" is exists.`;
            return new Error(msg);
        }
        static noneRouteMatched(url) {
            var msg = `None route matched with url "${url}".`;
            var error = new Error(msg);
            return error;
        }
        static emptyStack() {
            return new Error('The stack is empty.');
        }
        static canntParseUrl(url) {
            var msg = `Can not parse the url "${url}" to route data.`;
            return new Error(msg);
        }
        static canntParseRouteString(routeString) {
            var msg = `Can not parse the route string "${routeString}" to route data.;`;
            return new Error(msg);
        }
        static routeDataRequireController() {
            var msg = 'The route data does not contains a "controller" file.';
            return new Error(msg);
        }
        static routeDataRequireAction() {
            var msg = 'The route data does not contains a "action" file.';
            return new Error(msg);
        }
        static viewCanntNull() {
            var msg = 'The view or viewDeferred of the page cannt null.';
            return new Error(msg);
        }
        static createPageFail(pageName) {
            var msg = `Create page "${pageName}" fail.`;
            return new Error(msg);
        }
        static actionTypeError(pageName) {
            let msg = `The action in page '${pageName}' is expect as function.`;
            return new Error(msg);
        }
        static canntFindAction(pageName) {
            let msg = `Cannt find action in page '${pageName}', is the exports has default field?`;
            return new Error(msg);
        }
        static exportsCanntNull(pageName) {
            let msg = `Exports of page '${pageName}' is null.`;
            return new Error(msg);
        }
        static scrollerElementNotExists() {
            let msg = "Scroller element is not exists.";
            return new Error(msg);
        }
        static resourceExists(resourceName, pageName) {
            let msg = `Rosource '${resourceName}' is exists in the resources of page '${pageName}'.`;
            return new Error(msg);
        }
        static siteMapRootCanntNull() {
            let msg = `The site map root node can not be null.`;
            return new Error(msg);
        }
        static duplicateSiteMapNode(name) {
            let msg = `The site map node ${name} is exists.`;
            return new Error(name);
        }
    }
    var chitu;
    (function (chitu) {
        class Callback {
            constructor() {
                this.funcs = new Array();
            }
            add(func) {
                this.funcs.push(func);
            }
            remove(func) {
                this.funcs = this.funcs.filter(o => o != func);
            }
            fire(...args) {
                this.funcs.forEach(o => o(...args));
            }
        }
        chitu.Callback = Callback;
        function Callbacks() {
            return new Callback();
        }
        chitu.Callbacks = Callbacks;
        class ValueStore {
            constructor(value) {
                this.items = new Array();
                this._value = value;
            }
            add(func, sender) {
                this.items.push({ func, sender });
                return func;
            }
            remove(func) {
                this.items = this.items.filter(o => o.func != func);
            }
            fire(value) {
                this.items.forEach(o => o.func(value, o.sender));
            }
            get value() {
                return this._value;
            }
            set value(value) {
                this._value = value;
                this.fire(value);
            }
        }
        chitu.ValueStore = ValueStore;
    })(chitu || (chitu = {}));
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var chitu;
    (function (chitu) {
        class Page {
            constructor(params) {
                this.animationTime = 300;
                this.data = null;
                this.load = chitu.Callbacks();
                this.loadComplete = chitu.Callbacks();
                this.showing = chitu.Callbacks();
                this.shown = chitu.Callbacks();
                this.hiding = chitu.Callbacks();
                this.hidden = chitu.Callbacks();
                this.closing = chitu.Callbacks();
                this.closed = chitu.Callbacks();
                this._element = params.element;
                this._app = params.app;
                this._displayer = params.displayer;
                this._action = params.action;
                this.data = params.data;
                this._name = params.name;
                setTimeout(() => {
                    this.loadPageAction();
                });
            }
            on_load() {
                return this.load.fire(this, this.data);
            }
            on_loadComplete() {
                return this.loadComplete.fire(this, this.data);
            }
            on_showing() {
                return this.showing.fire(this, this.data);
            }
            on_shown() {
                return this.shown.fire(this, this.data);
            }
            on_hiding() {
                return this.hiding.fire(this, this.data);
            }
            on_hidden() {
                return this.hidden.fire(this, this.data);
            }
            on_closing() {
                return this.closing.fire(this, this.data);
            }
            on_closed() {
                return this.closed.fire(this, this.data);
            }
            show() {
                this.on_showing();
                let currentPage = this._app.currentPage;
                if (this == currentPage) {
                    currentPage = null;
                }
                return this._displayer.show(this, currentPage).then(o => {
                    this.on_shown();
                });
            }
            hide(currentPage) {
                this.on_hiding();
                return this._displayer.hide(this, currentPage).then(o => {
                    this.on_hidden();
                });
            }
            close() {
                return new Promise((resolve, reject) => {
                    this.on_closing();
                    this._element.remove();
                    this.on_closed();
                    resolve();
                });
            }
            createService(type) {
                type = type || chitu.Service;
                let service = new type();
                service.error.add((ender, error) => {
                    this._app.error.fire(this._app, error, this);
                });
                return service;
            }
            get element() {
                return this._element;
            }
            get name() {
                return this._name;
            }
            loadPageAction() {
                return __awaiter(this, void 0, void 0, function* () {
                    let pageName = this.name;
                    let action;
                    if (typeof this._action == 'function') {
                        action = this._action;
                    }
                    else {
                        let actionResult;
                        try {
                            actionResult = yield this._app.loadjs(this._action);
                        }
                        catch (err) {
                            this._app.error.fire(this._app, err, this);
                            throw err;
                        }
                        if (!actionResult)
                            throw Errors.exportsCanntNull(pageName);
                        let actionName = 'default';
                        action = actionResult[actionName];
                        if (action == null) {
                            throw Errors.canntFindAction(pageName);
                        }
                    }
                    this.on_load();
                    let actionExecuteResult;
                    if (typeof action == 'function') {
                        let actionResult = action(this);
                        if (actionResult != null && actionResult.then != null && actionResult.catch != null) {
                            actionResult.then(() => this.on_loadComplete());
                        }
                        else {
                            this.on_loadComplete();
                        }
                    }
                    else {
                        throw Errors.actionTypeError(pageName);
                    }
                });
            }
            reload() {
                return this.loadPageAction();
            }
        }
        Page.tagName = 'div';
        chitu.Page = Page;
    })(chitu || (chitu = {}));
    class PageDisplayerImplement {
        show(page, previous) {
            page.element.style.display = 'block';
            if (previous != null) {
                previous.element.style.display = 'none';
            }
            return Promise.resolve();
        }
        hide(page, previous) {
            page.element.style.display = 'none';
            if (previous != null) {
                previous.element.style.display = 'block';
            }
            return Promise.resolve();
        }
    }
    function ajax(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url, options);
            let responseText = response.text();
            let p;
            if (typeof responseText == 'string') {
                p = new Promise((reslove, reject) => {
                    reslove(responseText);
                });
            }
            else {
                p = responseText;
            }
            let text = yield responseText;
            let textObject;
            let isJSONContextType = (response.headers.get('content-type') || '').indexOf('json') >= 0;
            if (isJSONContextType) {
                textObject = JSON.parse(text);
            }
            else {
                textObject = text;
            }
            if (response.status >= 300) {
                let err = new Error();
                err.method = options.method;
                err.name = `${response.status}`;
                err.message = isJSONContextType ? (textObject.Message || textObject.message) : textObject;
                err.message = err.message || response.statusText;
                throw err;
            }
            return textObject;
        });
    }
    function callAjax(url, options, service, error) {
        return new Promise((reslove, reject) => {
            let timeId;
            if (options.method == 'get') {
                timeId = setTimeout(() => {
                    let err = new Error();
                    err.name = 'timeout';
                    err.message = '网络连接超时';
                    reject(err);
                    error.fire(service, err);
                    clearTimeout(timeId);
                }, chitu.Service.settings.ajaxTimeout * 1000);
            }
            ajax(url, options)
                .then(data => {
                    reslove(data);
                    if (timeId)
                        clearTimeout(timeId);
                })
                .catch(err => {
                    reject(err);
                    error.fire(service, err);
                    if (timeId)
                        clearTimeout(timeId);
                });
        });
    }
    var chitu;
    (function (chitu) {
        class Service {
            constructor() {
                this.error = chitu.Callbacks();
            }
            ajax(url, options) {
                options = options || {};
                let data = options.data;
                let method = options.method;
                let headers = options.headers || [];
                let body;
                if (data != null) {
                    let is_json = (headers['content-type'] || '').indexOf('json') >= 0;
                    if (is_json) {
                        body = JSON.stringify(data);
                    }
                    else {
                        body = new URLSearchParams();
                        for (let key in data) {
                            body.append(key, data[key]);
                        }
                    }
                }
                return callAjax(url, { headers, body, method }, this, this.error);
            }
        }
        Service.settings = {
            ajaxTimeout: 30,
        };
        chitu.Service = Service;
    })(chitu || (chitu = {}));
    var chitu;
    (function (chitu) {
        function combinePath(path1, path2) {
            if (!path1)
                throw Errors.argumentNull('path1');
            if (!path2)
                throw Errors.argumentNull('path2');
            path1 = path1.trim();
            if (!path1.endsWith('/'))
                path1 = path1 + '/';
            return path1 + path2;
        }
    })(chitu || (chitu = {}));

    window['chitu'] = window['chitu'] || chitu

    return chitu;
});