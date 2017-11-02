(function(factory) { 
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') { 
        // [1] CommonJS/Node.js 
        var target = module['exports'] || exports; 
        var chitu = factory(target, require);
        Object.assign(target,chitu);
    } else 
if (typeof define === 'function' && define['amd']) { 
    define(factory);  
} else { 
    factory(); 
} 
})(function() {var chitu;
(function (chitu) {
const DEFAULT_FILE_BASE_PATH = 'modules';
class RouteData {
constructor(basePath, routeString, pathSpliterChar) {
    this._parameters = {};
    this.path_string = '';
    this.path_spliter_char = '/';
    this.path_contact_char = '/';
    this.param_spliter = '?';
    this.name_spliter_char = '.';
    this._pathBase = '';
    if (!basePath)
        throw chitu.Errors.argumentNull('basePath');
    if (!routeString)
        throw chitu.Errors.argumentNull('routeString');
    if (pathSpliterChar)
        this.path_spliter_char = pathSpliterChar;
    this._loadCompleted = false;
    this._routeString = routeString;
    this._pathBase = basePath;
    this.parseRouteString();
    let routeData = this;
}
parseRouteString() {
    let routeString = this.routeString;
    let routePath;
    let search;
    let param_spliter_index = routeString.indexOf(this.param_spliter);
    if (param_spliter_index > 0) {
        search = routeString.substr(param_spliter_index + 1);
        routePath = routeString.substring(0, param_spliter_index);
    }
    else {
        routePath = routeString;
    }
    if (!routePath)
        throw chitu.Errors.canntParseRouteString(routeString);
    if (search) {
        this._parameters = this.pareeUrlQuery(search);
    }
    let path_parts = routePath.split(this.path_spliter_char).map(o => o.trim()).filter(o => o != '');
    if (path_parts.length < 1) {
        throw chitu.Errors.canntParseRouteString(routeString);
    }
    let file_path = path_parts.join(this.path_contact_char);
    this._pageName = path_parts.join(this.name_spliter_char);
    this._actionPath = (this.basePath ? chitu.combinePath(this.basePath, file_path) : file_path);
}
pareeUrlQuery(query) {
    let match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    let urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
}
get basePath() {
    return this._pathBase;
}
get values() {
    return this._parameters;
}
get pageName() {
    return this._pageName;
}
get routeString() {
    return this._routeString;
}
get actionPath() {
    return this._actionPath;
}
get loadCompleted() {
    return this._loadCompleted;
}
}
chitu.RouteData = RouteData;
var PAGE_STACK_MAX_SIZE = 30;
var CACHE_PAGE_SIZE = 30;
var ACTION_LOCATION_FORMATER = '{controller}/{action}';
var VIEW_LOCATION_FORMATER = '{controller}/{action}';
class Application {
constructor(args) {
    this.pageCreated = chitu.Callbacks();
    this.pageType = chitu.Page;
    this.pageDisplayType = PageDisplayerImplement;
    this._runned = false;
    this.page_stack = new Array();
    this.cachePages = {};
    this.fileBasePath = DEFAULT_FILE_BASE_PATH;
    this.backFail = chitu.Callbacks();
    args = args || {};
    this._siteMap = args.siteMap;
    if (this._siteMap) {
        if (this._siteMap.root == null)
            throw chitu.Errors.siteMapRootCanntNull();
        this._siteMap.root.level = 0;
        this.setChildrenParent(this._siteMap.root);
    }
}
setChildrenParent(parent) {
    if (parent == null)
        throw chitu.Errors.argumentNull('parent');
    let children = parent.children || [];
    for (let i = 0; i < children.length; i++) {
        children[i].parent = parent;
        children[i].level = parent.level + 1;
        this.setChildrenParent(children[i]);
    }
}
parseRouteString(routeString) {
    let routeData = new RouteData(this.fileBasePath, routeString);
    return routeData;
}
on_pageCreated(page) {
    return this.pageCreated.fire(this, page);
}
get currentPage() {
    if (this.page_stack.length > 0)
        return this.page_stack[this.page_stack.length - 1];
    return null;
}
get pages() {
    return this.page_stack;
}
createPage(routeData, actionArguments) {
    let data = this.cachePages[routeData.routeString];
    if (data) {
        data.hitCount = (data.hitCount || 0) + 1;
        return data.page;
    }
    let previous_page = this.pages[this.pages.length - 1];
    let element = this.createPageElement(routeData);
    let displayer = new this.pageDisplayType(this);
    console.assert(this.pageType != null);
    let page = new this.pageType({
        app: this,
        previous: previous_page,
        routeData: routeData,
        displayer,
        element,
        actionArguments
    });
    this.cachePages[routeData.routeString] = { page, hitCount: 1 };
    let keyes = Object.keys(this.cachePages);
    if (keyes.length > CACHE_PAGE_SIZE) {
        let key = keyes[0];
        for (let i = 1; i < keyes.length; i++) {
            let data0 = this.cachePages[key];
            let data1 = this.cachePages[keyes[i]];
            if (data1.hitCount < data0.hitCount) {
                key = keyes[i];
            }
        }
        this.cachePages[key].page.close();
        delete this.cachePages[key];
    }
    let page_onclosed = (sender) => {
        this.page_stack = this.page_stack.filter(o => o != sender);
        page.closed.remove(page_onclosed);
    };
    page.closed.add(page_onclosed);
    this.on_pageCreated(page);
    return page;
}
createPageElement(routeData) {
    let element = document.createElement(chitu.Page.tagName);
    document.body.appendChild(element);
    return element;
}
hashchange() {
    var hash = window.location.hash;
    if (!hash) {
        console.log('The url is not contains hash.url is ' + window.location.href);
        return;
    }
    var routeString;
    if (location.hash.length > 1)
        routeString = location.hash.substr(1);
    var page = this.getPageByRouteString(routeString);
    let previousPageIndex = this.page_stack.length - 2;
    if (page != null && this.page_stack.indexOf(page) == previousPageIndex) {
        this.closeCurrentPage();
    }
    else {
        this.showPage(routeString);
    }
}
run() {
    if (this._runned)
        return;
    var app = this;
    this.hashchange();
    window.addEventListener('popstate', () => {
        this.hashchange();
    });
    this._runned = true;
}
getPage(name) {
    for (var i = this.page_stack.length - 1; i >= 0; i--) {
        var page = this.page_stack[i];
        if (page != null && page.name == name)
            return page;
    }
    return null;
}
getPageByRouteString(routeString) {
    for (var i = this.page_stack.length - 1; i >= 0; i--) {
        var page = this.page_stack[i];
        if (page != null && page.routeData.routeString == routeString)
            return page;
    }
    return null;
}
showPage(routeString, args) {
    if (!routeString)
        throw chitu.Errors.argumentNull('routeString');
    if (this.currentPage != null && this.currentPage.routeData.routeString == routeString)
        return;
    var routeData = this.parseRouteString(routeString);
    if (routeData == null) {
        throw chitu.Errors.noneRouteMatched(routeString);
    }
    Object.assign(routeData.values, args || {});
    if (this.page_stack.length >= 2 && routeString == this.page_stack[this.page_stack.length - 2].routeData.routeString) {
        this.closeCurrentPage();
        return;
    }
    let page = this.createPage(routeData, args);
    this.pushPage(page);
    page.show();
    return page;
}
pushPage(page) {
    let previous = this.currentPage;
    this.page_stack.push(page);
    if (this.page_stack.length > PAGE_STACK_MAX_SIZE) {
        let c = this.page_stack.shift();
    }
    page.previous = previous;
}
findSiteMapNode(pageName) {
    if (this._siteMap == null)
        return;
    let stack = new Array();
    stack.push(this._siteMap.root);
    while (stack.length > 0) {
        let node = stack.pop();
        if (node.pageName == pageName) {
            return node;
        }
    }
    return null;
}
setLocationHash(routeString) {
    if (window.location.hash == '#' + routeString) {
        return;
    }
    history.pushState(routeString, "", `#${routeString}`);
}
closeCurrentPage() {
    if (this.page_stack.length <= 0)
        return;
    var page = this.page_stack.pop();
    page.previous = this.currentPage;
    page.hide();
    if (this.currentPage != null)
        this.setLocationHash(this.currentPage.routeData.routeString);
}
clearPageStack() {
    this.page_stack = [];
}
redirect(routeString, args) {
    let result = this.showPage(routeString, args);
    this.setLocationHash(routeString);
    return result;
}
back() {
    history.back();
}
_back(args = undefined) {
    if (this.currentPage == null) {
        this.backFail.fire(this, null);
        return;
    }
    let routeData = this.currentPage.routeData;
    this.closeCurrentPage();
    if (this.page_stack.length > 0) {
        return;
    }
    if (this._siteMap == null) {
        this.backFail.fire(this, null);
        return;
    }
    let siteMapNode = this.findSiteMapNode(routeData.pageName);
    if (siteMapNode != null && siteMapNode.parent != null) {
        let p = siteMapNode.parent;
        let routeString = typeof p.routeString == 'function' ? p.routeString() : p.routeString;
        this.redirect(routeString);
        return;
    }
    this.backFail.fire(this, null);
}
}
chitu.Application = Application;
})(chitu || (chitu = {}));

var chitu;
(function (chitu) {
class Errors {
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
static viewNodeNotExists(name) {
    var msg = `The view node "${name}" is not exists.`;
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
}
chitu.Errors = Errors;
})(chitu || (chitu = {}));

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
fire(sender, args) {
    this.funcs.forEach(o => o(sender, args));
}
}
chitu.Callback = Callback;
function Callbacks() {
return new Callback();
}
chitu.Callbacks = Callbacks;
class ValueStore {
constructor(value) {
    this.funcs = new Array();
    this._value = value;
}
add(func) {
    this.funcs.push(func);
    return func;
}
remove(func) {
    this.funcs = this.funcs.filter(o => o != func);
}
fire(value) {
    this.funcs.forEach(o => o(value));
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
    this.error = chitu.Callbacks();
    this.load = chitu.Callbacks();
    this.loadComplete = chitu.Callbacks();
    this.showing = chitu.Callbacks();
    this.shown = chitu.Callbacks();
    this.hiding = chitu.Callbacks();
    this.hidden = chitu.Callbacks();
    this.closing = chitu.Callbacks();
    this.closed = chitu.Callbacks();
    this._element = params.element;
    this._previous = params.previous;
    this._app = params.app;
    this._routeData = params.routeData;
    this._displayer = params.displayer;
    this._actionArguments = params.actionArguments;
    this.loadPageAction();
}
on_load() {
    return this.load.fire(this, null);
}
on_loadComplete() {
    return this.loadComplete.fire(this, null);
}
on_showing() {
    return this.showing.fire(this, null);
}
on_shown() {
    return this.shown.fire(this, null);
}
on_hiding() {
    return this.hiding.fire(this, null);
}
on_hidden() {
    return this.hidden.fire(this, null);
}
on_closing() {
    return this.closing.fire(this, null);
}
on_closed() {
    return this.closed.fire(this, null);
}
show() {
    this.on_showing();
    return this._displayer.show(this).then(o => {
        this.on_shown();
    });
}
hide() {
    this.on_hiding();
    return this._displayer.hide(this).then(o => {
        this.on_hidden();
    });
}
close() {
    return this.hide().then(() => {
        this.on_closing();
        this._element.remove();
        this.on_closed();
    });
}
createService(type) {
    let service = new type();
    service.error.add((ender, error) => {
        this.error.fire(this, error);
    });
    return service;
}
get element() {
    return this._element;
}
get previous() {
    return this._previous;
}
set previous(value) {
    this._previous = value;
}
get routeData() {
    return this._routeData;
}
get name() {
    return this.routeData.pageName;
}
loadPageAction() {
    return __awaiter(this, void 0, void 0, function* () {
        console.assert(this._routeData != null);
        let routeData = this._routeData;
        var url = routeData.actionPath;
        let actionResult = yield chitu.loadjs(url);
        if (!actionResult)
            throw chitu.Errors.exportsCanntNull(routeData.pageName);
        let actionName = 'default';
        let action = actionResult[actionName];
        if (action == null) {
            throw chitu.Errors.canntFindAction(routeData.pageName);
        }
        let actionExecuteResult;
        if (typeof action == 'function') {
            let actionResult = action(this);
            if (actionResult != null && actionResult.then != null && actionResult.catch != null) {
                actionResult.then(() => this.on_loadComplete());
            }
        }
        else {
            throw chitu.Errors.actionTypeError(routeData.pageName);
        }
        this.on_load();
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
show(page) {
page.element.style.display = 'block';
if (page.previous != null) {
    page.previous.element.style.display = 'none';
}
return Promise.resolve();
}
hide(page) {
page.element.style.display = 'none';
if (page.previous != null) {
    page.previous.element.style.display = 'block';
}
return Promise.resolve();
}
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
return new (P || (P = Promise))(function (resolve, reject) {
function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
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
    textObject = travelJSON(textObject);
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
function travelJSON(result) {
    const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (typeof result === 'string' && result.match(this.datePattern)) {
        return new Date(result);
    }
    var stack = new Array();
    stack.push(result);
    while (stack.length > 0) {
        var item = stack.pop();
        for (var key in item) {
            var value = item[key];
            if (value == null)
                continue;
            if (value instanceof Array) {
                for (var i = 0; i < value.length; i++) {
                    stack.push(value[i]);
                }
                continue;
            }
            if (typeof value == 'object') {
                stack.push(value);
                continue;
            }
            if (typeof value == 'string' && value.match(datePattern)) {
                item[key] = new Date(value);
            }
        }
    }
    return result;
}
});
}
var chitu;
(function (chitu) {
class Service {
constructor() {
    this.error = chitu.Callbacks();
}
ajax(url, options) {
    return new Promise((reslove, reject) => {
        let timeId;
        if (options.method == 'get') {
            timeId = setTimeout(() => {
                let err = new Error();
                err.name = 'timeout';
                err.message = '网络连接超时';
                reject(err);
                this.error.fire(this, err);
                clearTimeout(timeId);
            }, Service.settings.ajaxTimeout * 1000);
        }
        ajax(url, options)
            .then(data => {
            reslove(data);
            if (timeId)
                clearTimeout(timeId);
        })
            .catch(err => {
            reject(err);
            this.error.fire(this, err);
            if (timeId)
                clearTimeout(timeId);
        });
    });
}
getByJson(url, data) {
    console.assert(url.indexOf('?') < 0);
    if (data) {
        url = url + '?' + JSON.stringify(data);
    }
    return this.ajaxByJSON(url, null, 'get');
}
postByJson(url, data) {
    return this.ajaxByJSON(url, data, 'post');
}
deleteByJson(url, data) {
    return this.ajaxByJSON(url, data, 'delete');
}
putByJson(url, data) {
    return this.ajaxByJSON(url, data, 'put');
}
get(url, data) {
    data = data || {};
    let urlParams = '';
    for (let key in data) {
        urlParams = urlParams + `&${key}=${data[key]}`;
    }
    console.assert(url.indexOf('?') < 0);
    url = url + '?' + urlParams;
    let options = {
        method: 'get',
    };
    return this.ajax(url, options);
}
post(url, data) {
    return this.ajaxByForm(url, data, 'post');
}
put(url, data) {
    return this.ajaxByForm(url, data, 'put');
}
delete(url, data) {
    return this.ajaxByForm(url, data, 'delete');
}
ajaxByForm(url, data, method) {
    let headers = {};
    headers['content-type'] = 'application/x-www-form-urlencoded';
    let body = new URLSearchParams();
    for (let key in data) {
        body.append(key, data[key]);
    }
    return this.ajax(url, { headers, body, method });
}
ajaxByJSON(url, data, method) {
    let headers = {};
    headers['content-type'] = 'application/json';
    let body;
    if (data)
        body = JSON.stringify(data);
    let options = {
        headers,
        body,
        method
    };
    return this.ajax(url, options);
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
    throw chitu.Errors.argumentNull('path1');
if (!path2)
    throw chitu.Errors.argumentNull('path2');
path1 = path1.trim();
if (!path1.endsWith('/'))
    path1 = path1 + '/';
return path1 + path2;
}
chitu.combinePath = combinePath;
function loadjs(path) {
return new Promise((reslove, reject) => {
    requirejs([path], function (result) {
        reslove(result);
    }, function (err) {
        reject(err);
    });
});
}
chitu.loadjs = loadjs;
})(chitu || (chitu = {}));

window['chitu'] = window['chitu'] || chitu 
                    
return chitu;
    });