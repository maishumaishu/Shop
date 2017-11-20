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
var DEFAULT_FILE_BASE_PATH = 'modules';
var RouteData = (function () {
function RouteData(basePath, routeString, pathSpliterChar) {
    this._parameters = {};
    this.path_string = '';
    this.path_spliter_char = '/';
    this.path_contact_char = '/';
    this.param_spliter = '?';
    this.name_spliter_char = '.';
    this._pathBase = '';
    if (!basePath)
        throw Errors.argumentNull('basePath');
    if (!routeString)
        throw Errors.argumentNull('routeString');
    if (pathSpliterChar)
        this.path_spliter_char = pathSpliterChar;
    this._routeString = routeString;
    this._pathBase = basePath;
    this.parseRouteString();
    var routeData = this;
}
RouteData.prototype.parseRouteString = function () {
    var routeString = this.routeString;
    var routePath;
    var search;
    var param_spliter_index = routeString.indexOf(this.param_spliter);
    if (param_spliter_index > 0) {
        search = routeString.substr(param_spliter_index + 1);
        routePath = routeString.substring(0, param_spliter_index);
    }
    else {
        routePath = routeString;
    }
    if (!routePath)
        throw Errors.canntParseRouteString(routeString);
    if (search) {
        this._parameters = this.pareeUrlQuery(search);
    }
    var path_parts = routePath.split(this.path_spliter_char).map(function (o) { return o.trim(); }).filter(function (o) { return o != ''; });
    if (path_parts.length < 1) {
        throw Errors.canntParseRouteString(routeString);
    }
    var file_path = path_parts.join(this.path_contact_char);
    this._pageName = path_parts.join(this.name_spliter_char);
    this._actionPath = (this.basePath ? combinePath(this.basePath, file_path) : file_path);
};
RouteData.prototype.pareeUrlQuery = function (query) {
    var match, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
    var urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
};
Object.defineProperty(RouteData.prototype, "basePath", {
    get: function () {
        return this._pathBase;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(RouteData.prototype, "values", {
    get: function () {
        return this._parameters;
    },
    set: function (value) {
        this._parameters = value;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(RouteData.prototype, "pageName", {
    get: function () {
        return this._pageName;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(RouteData.prototype, "routeString", {
    get: function () {
        return this._routeString;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(RouteData.prototype, "actionPath", {
    get: function () {
        return this._actionPath;
    },
    enumerable: true,
    configurable: true
});
return RouteData;
}());
chitu.RouteData = RouteData;
var PAGE_STACK_MAX_SIZE = 30;
var CACHE_PAGE_SIZE = 30;
var ACTION_LOCATION_FORMATER = '{controller}/{action}';
var VIEW_LOCATION_FORMATER = '{controller}/{action}';
var Application = (function () {
function Application(args) {
    this.pageCreated = chitu.Callbacks();
    this.pageType = chitu.Page;
    this.pageDisplayType = PageDisplayerImplement;
    this._runned = false;
    this.page_stack = new Array();
    this.cachePages = {};
    this.fileBasePath = DEFAULT_FILE_BASE_PATH;
    this.backFail = chitu.Callbacks();
    this.error = chitu.Callbacks();
    args = args || {};
    this._siteMap = args.siteMap;
    if (this._siteMap) {
        if (this._siteMap.root == null)
            throw Errors.siteMapRootCanntNull();
        this._siteMap.root.level = 0;
        this.setChildrenParent(this._siteMap.root);
    }
}
Application.prototype.setChildrenParent = function (parent) {
    if (parent == null)
        throw Errors.argumentNull('parent');
    var children = parent.children || [];
    for (var i = 0; i < children.length; i++) {
        children[i].parent = parent;
        children[i].level = parent.level + 1;
        this.setChildrenParent(children[i]);
    }
};
Application.prototype.parseRouteString = function (routeString) {
    var routeData = new RouteData(this.fileBasePath, routeString);
    return routeData;
};
Application.prototype.on_pageCreated = function (page) {
    return this.pageCreated.fire(this, page);
};
Object.defineProperty(Application.prototype, "currentPage", {
    get: function () {
        if (this.page_stack.length > 0)
            return this.page_stack[this.page_stack.length - 1];
        return null;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(Application.prototype, "pages", {
    get: function () {
        return this.page_stack;
    },
    enumerable: true,
    configurable: true
});
Application.prototype.createPage = function (routeData) {
    var _this = this;
    var data = this.cachePages[routeData.pageName];
    if (data) {
        data.hitCount = (data.hitCount || 0) + 1;
        data.page.routeData.values = routeData.values;
        return data.page;
    }
    var previous_page = this.pages[this.pages.length - 1];
    var element = this.createPageElement(routeData);
    var displayer = new this.pageDisplayType(this);
    console.assert(this.pageType != null);
    var page = new this.pageType({
        app: this,
        previous: previous_page,
        routeData: routeData,
        displayer: displayer,
        element: element
    });
    var keyes = Object.keys(this.cachePages);
    if (keyes.length > CACHE_PAGE_SIZE) {
        var key = keyes[0];
        for (var i = 1; i < keyes.length; i++) {
            var data0 = this.cachePages[key];
            var data1 = this.cachePages[keyes[i]];
            if (data1.hitCount < data0.hitCount) {
                key = keyes[i];
            }
        }
        this.cachePages[key].page.close();
        delete this.cachePages[key];
    }
    var page_onerror = function (sender, error) {
        _this.error.fire(_this, error);
    };
    var page_onloadComplete = function (sender, args) {
        _this.cachePages[sender.name] = { page: sender, hitCount: 1 };
    };
    var page_onclosed = function (sender) {
        _this.page_stack = _this.page_stack.filter(function (o) { return o != sender; });
        page.closed.remove(page_onclosed);
        page.loadComplete.remove(page_onloadComplete);
        page.error.remove(page_onerror);
    };
    page.error.add(page_onerror);
    page.closed.add(page_onclosed);
    page.loadComplete.add(page_onloadComplete);
    this.on_pageCreated(page);
    return page;
};
Application.prototype.createPageElement = function (routeData) {
    var element = document.createElement(chitu.Page.tagName);
    document.body.appendChild(element);
    return element;
};
Application.prototype.hashchange = function () {
    var hash = window.location.hash;
    if (!hash) {
        console.log('The url is not contains hash.url is ' + window.location.href);
        return;
    }
    var routeString;
    if (location.hash.length > 1)
        routeString = location.hash.substr(1);
    var routeData = this.parseRouteString(routeString);
    var page = this.getPage(routeData.pageName);
    var previousPageIndex = this.page_stack.length - 2;
    this.showPage(routeString);
};
Application.prototype.run = function () {
    var _this = this;
    if (this._runned)
        return;
    var app = this;
    this.hashchange();
    window.addEventListener('popstate', function (event) {
        if (event.state == Application.skipStateName)
            return;
        _this.hashchange();
    });
    this._runned = true;
};
Application.prototype.getPage = function (name) {
    for (var i = this.page_stack.length - 1; i >= 0; i--) {
        var page = this.page_stack[i];
        if (page != null && page.name == name)
            return page;
    }
    return null;
};
Application.prototype.getPageByRouteString = function (routeString) {
    for (var i = this.page_stack.length - 1; i >= 0; i--) {
        var page = this.page_stack[i];
        if (page != null && page.routeData.routeString == routeString)
            return page;
    }
    return null;
};
Application.prototype.showPage = function (routeString, args) {
    if (!routeString)
        throw Errors.argumentNull('routeString');
    if (this.currentPage != null && this.currentPage.routeData.routeString == routeString)
        return;
    var routeData = this.parseRouteString(routeString);
    if (routeData == null) {
        throw Errors.noneRouteMatched(routeString);
    }
    Object.assign(routeData.values, args || {});
    var oldCurrentPage = this.currentPage;
    var page = this.getPage(routeData.pageName);
    var previousPageIndex = this.page_stack.length - 2;
    if (page != null && this.page_stack.indexOf(page) == previousPageIndex) {
        this.closeCurrentPage();
    }
    else {
        var page_1 = this.createPage(routeData);
        this.pushPage(page_1);
        page_1.show();
        console.assert(page_1 == this.currentPage, "page is not current page");
    }
    if (oldCurrentPage)
        oldCurrentPage.deactive.fire(oldCurrentPage, null);
    console.assert(this.currentPage != null);
    this.currentPage.active.fire(this.currentPage, routeData.values);
    return this.currentPage;
};
Application.prototype.pushPage = function (page) {
    if (this.currentPage != null) {
        var currentSiteNode = this.findSiteMapNode(this.currentPage.name);
        var pageNode = this.findSiteMapNode(page.name);
        if (currentSiteNode != null && pageNode != null && pageNode.level <= currentSiteNode.level) {
            this.clearPageStack();
        }
    }
    var previous = this.currentPage;
    this.page_stack.push(page);
    if (this.page_stack.length > PAGE_STACK_MAX_SIZE) {
        var c = this.page_stack.shift();
    }
    page.previous = previous;
};
Application.prototype.findSiteMapNode = function (pageName) {
    if (this._siteMap == null)
        return;
    var stack = new Array();
    stack.push(this._siteMap.root);
    while (stack.length > 0) {
        var node = stack.pop();
        if (node.pageName == pageName) {
            return node;
        }
        var children = node.children || [];
        children.forEach(function (c) { return stack.push(c); });
    }
    return null;
};
Application.prototype.setLocationHash = function (routeString) {
    if (window.location.hash == '#' + routeString) {
        return;
    }
    history.pushState('chitu', "", "#" + routeString);
};
Application.prototype.closeCurrentPage = function () {
    if (this.page_stack.length <= 0)
        return;
    var page = this.page_stack.pop();
    page.previous = this.currentPage;
    page.hide();
};
Application.prototype.clearPageStack = function () {
    this.page_stack = [];
};
Application.prototype.redirect = function (routeString, args) {
    var result = this.showPage(routeString, args);
    this.setLocationHash(routeString);
    return result;
};
Application.prototype.back = function () {
    history.back();
};
Application.skipStateName = 'skip';
return Application;
}());
chitu.Application = Application;
})(chitu || (chitu = {}));

var Errors = (function () {
function Errors() {
}
Errors.argumentNull = function (paramName) {
var msg = "The argument \"" + paramName + "\" cannt be null.";
return new Error(msg);
};
Errors.modelFileExpecteFunction = function (script) {
var msg = "The eval result of script file \"" + script + "\" is expected a function.";
return new Error(msg);
};
Errors.paramTypeError = function (paramName, expectedType) {
var msg = "The param \"" + paramName + "\" is expected \"" + expectedType + "\" type.";
return new Error(msg);
};
Errors.paramError = function (msg) {
return new Error(msg);
};
Errors.viewNodeNotExists = function (name) {
var msg = "The view node \"" + name + "\" is not exists.";
return new Error(msg);
};
Errors.pathPairRequireView = function (index) {
var msg = "The view value is required for path pair, but the item with index \"" + index + "\" is miss it.";
return new Error(msg);
};
Errors.notImplemented = function (name) {
var msg = "'The method \"" + name + "\" is not implemented.'";
return new Error(msg);
};
Errors.routeExists = function (name) {
var msg = "Route named \"" + name + "\" is exists.";
return new Error(msg);
};
Errors.noneRouteMatched = function (url) {
var msg = "None route matched with url \"" + url + "\".";
var error = new Error(msg);
return error;
};
Errors.emptyStack = function () {
return new Error('The stack is empty.');
};
Errors.canntParseUrl = function (url) {
var msg = "Can not parse the url \"" + url + "\" to route data.";
return new Error(msg);
};
Errors.canntParseRouteString = function (routeString) {
var msg = "Can not parse the route string \"" + routeString + "\" to route data.;";
return new Error(msg);
};
Errors.routeDataRequireController = function () {
var msg = 'The route data does not contains a "controller" file.';
return new Error(msg);
};
Errors.routeDataRequireAction = function () {
var msg = 'The route data does not contains a "action" file.';
return new Error(msg);
};
Errors.viewCanntNull = function () {
var msg = 'The view or viewDeferred of the page cannt null.';
return new Error(msg);
};
Errors.createPageFail = function (pageName) {
var msg = "Create page \"" + pageName + "\" fail.";
return new Error(msg);
};
Errors.actionTypeError = function (pageName) {
var msg = "The action in page '" + pageName + "' is expect as function.";
return new Error(msg);
};
Errors.canntFindAction = function (pageName) {
var msg = "Cannt find action in page '" + pageName + "', is the exports has default field?";
return new Error(msg);
};
Errors.exportsCanntNull = function (pageName) {
var msg = "Exports of page '" + pageName + "' is null.";
};
Errors.scrollerElementNotExists = function () {
var msg = "Scroller element is not exists.";
return new Error(msg);
};
Errors.resourceExists = function (resourceName, pageName) {
var msg = "Rosource '" + resourceName + "' is exists in the resources of page '" + pageName + "'.";
return new Error(msg);
};
Errors.siteMapRootCanntNull = function () {
var msg = "The site map root node can not be null.";
return new Error(msg);
};
return Errors;
}());

var chitu;
(function (chitu) {
var Callback = (function () {
function Callback() {
    this.funcs = new Array();
}
Callback.prototype.add = function (func) {
    this.funcs.push(func);
};
Callback.prototype.remove = function (func) {
    this.funcs = this.funcs.filter(function (o) { return o != func; });
};
Callback.prototype.fire = function (sender, args) {
    this.funcs.forEach(function (o) { return o(sender, args); });
};
return Callback;
}());
chitu.Callback = Callback;
function Callbacks() {
return new Callback();
}
chitu.Callbacks = Callbacks;
var ValueStore = (function () {
function ValueStore(value) {
    this.items = new Array();
    this._value = value;
}
ValueStore.prototype.add = function (func, sender) {
    this.items.push({ func: func, sender: sender });
    return func;
};
ValueStore.prototype.remove = function (func) {
    this.items = this.items.filter(function (o) { return o.func != func; });
};
ValueStore.prototype.fire = function (value) {
    this.items.forEach(function (o) { return o.func(value, o.sender); });
};
Object.defineProperty(ValueStore.prototype, "value", {
    get: function () {
        return this._value;
    },
    set: function (value) {
        this._value = value;
        this.fire(value);
    },
    enumerable: true,
    configurable: true
});
return ValueStore;
}());
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
var __generator = (this && this.__generator) || function (thisArg, body) {
var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
function verb(n) { return function (v) { return step([n, v]); }; }
function step(op) {
if (f) throw new TypeError("Generator is already executing.");
while (_) try {
    if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
    if (y = 0, t) op = [0, t.value];
    switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
    }
    op = body.call(thisArg, _);
} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
}
};
var chitu;
(function (chitu) {
var Page = (function () {
function Page(params) {
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
    this.active = chitu.Callbacks();
    this.deactive = chitu.Callbacks();
    this._element = params.element;
    this._previous = params.previous;
    this._app = params.app;
    this._routeData = params.routeData;
    this._displayer = params.displayer;
    this.loadPageAction();
}
Page.prototype.on_load = function () {
    return this.load.fire(this, this.routeData.values);
};
Page.prototype.on_loadComplete = function () {
    return this.loadComplete.fire(this, this.routeData.values);
};
Page.prototype.on_showing = function () {
    return this.showing.fire(this, this.routeData.values);
};
Page.prototype.on_shown = function () {
    return this.shown.fire(this, this.routeData.values);
};
Page.prototype.on_hiding = function () {
    return this.hiding.fire(this, this.routeData.values);
};
Page.prototype.on_hidden = function () {
    return this.hidden.fire(this, this.routeData.values);
};
Page.prototype.on_closing = function () {
    return this.closing.fire(this, this.routeData.values);
};
Page.prototype.on_closed = function () {
    return this.closed.fire(this, this.routeData.values);
};
Page.prototype.show = function () {
    var _this = this;
    this.on_showing();
    return this._displayer.show(this).then(function (o) {
        _this.on_shown();
    });
};
Page.prototype.hide = function () {
    var _this = this;
    this.on_hiding();
    return this._displayer.hide(this).then(function (o) {
        _this.on_hidden();
    });
};
Page.prototype.close = function () {
    var _this = this;
    return this.hide().then(function () {
        _this.on_closing();
        _this._element.remove();
        _this.on_closed();
    });
};
Page.prototype.createService = function (type) {
    var _this = this;
    var service = new type();
    service.error.add(function (ender, error) {
        _this.error.fire(_this, error);
    });
    return service;
};
Object.defineProperty(Page.prototype, "element", {
    get: function () {
        return this._element;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(Page.prototype, "previous", {
    get: function () {
        return this._previous;
    },
    set: function (value) {
        this._previous = value;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(Page.prototype, "routeData", {
    get: function () {
        return this._routeData;
    },
    enumerable: true,
    configurable: true
});
Object.defineProperty(Page.prototype, "name", {
    get: function () {
        return this.routeData.pageName;
    },
    enumerable: true,
    configurable: true
});
Page.prototype.loadPageAction = function () {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var routeData, url, actionResult, err_1, actionName, action, actionExecuteResult, actionResult_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.assert(this._routeData != null);
                    routeData = this._routeData;
                    url = routeData.actionPath;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, loadjs(url)];
                case 2:
                    actionResult = _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    this.error.fire(this, err_1);
                    throw err_1;
                case 4:
                    if (!actionResult)
                        throw Errors.exportsCanntNull(routeData.pageName);
                    actionName = 'default';
                    action = actionResult[actionName];
                    if (action == null) {
                        throw Errors.canntFindAction(routeData.pageName);
                    }
                    if (typeof action == 'function') {
                        actionResult_1 = action(this);
                        if (actionResult_1 != null && actionResult_1.then != null && actionResult_1.catch != null) {
                            actionResult_1.then(function () { return _this.on_loadComplete(); });
                        }
                        else {
                            this.on_loadComplete();
                        }
                    }
                    else {
                        throw Errors.actionTypeError(routeData.pageName);
                    }
                    this.on_load();
                    return [2];
            }
        });
    });
};
Page.prototype.reload = function () {
    return this.loadPageAction();
};
Page.tagName = 'div';
return Page;
}());
chitu.Page = Page;
})(chitu || (chitu = {}));
var PageDisplayerImplement = (function () {
function PageDisplayerImplement() {
}
PageDisplayerImplement.prototype.show = function (page) {
page.element.style.display = 'block';
if (page.previous != null) {
    page.previous.element.style.display = 'none';
}
return Promise.resolve();
};
PageDisplayerImplement.prototype.hide = function (page) {
page.element.style.display = 'none';
if (page.previous != null) {
    page.previous.element.style.display = 'block';
}
return Promise.resolve();
};
return PageDisplayerImplement;
}());

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
return new (P || (P = Promise))(function (resolve, reject) {
function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __generator = (this && this.__generator) || function (thisArg, body) {
var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
function verb(n) { return function (v) { return step([n, v]); }; }
function step(op) {
if (f) throw new TypeError("Generator is already executing.");
while (_) try {
    if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
    if (y = 0, t) op = [0, t.value];
    switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
            if (t[2]) _.ops.pop();
            _.trys.pop(); continue;
    }
    op = body.call(thisArg, _);
} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
}
};
function ajax(url, options) {
return __awaiter(this, void 0, void 0, function () {
function travelJSON(obj) {
    var datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (typeof obj === 'string' && obj.match(this.datePattern)) {
        return new Date(obj);
    }
    else if (typeof obj === 'string') {
        return obj;
    }
    var stack = new Array();
    stack.push(obj);
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
    return obj;
}
var response, responseText, p, text, textObject, isJSONContextType, err;
return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4, fetch(url, options)];
        case 1:
            response = _a.sent();
            responseText = response.text();
            if (typeof responseText == 'string') {
                p = new Promise(function (reslove, reject) {
                    reslove(responseText);
                });
            }
            else {
                p = responseText;
            }
            return [4, responseText];
        case 2:
            text = _a.sent();
            isJSONContextType = (response.headers.get('content-type') || '').indexOf('json') >= 0;
            if (isJSONContextType) {
                textObject = JSON.parse(text);
                textObject = travelJSON(textObject);
            }
            else {
                textObject = text;
            }
            if (response.status >= 300) {
                err = new Error();
                err.method = options.method;
                err.name = "" + response.status;
                err.message = isJSONContextType ? (textObject.Message || textObject.message) : textObject;
                err.message = err.message || response.statusText;
                throw err;
            }
            return [2, textObject];
    }
});
});
}
var chitu;
(function (chitu) {
var Service = (function () {
function Service() {
    this.error = chitu.Callbacks();
}
Service.prototype.ajax = function (url, options) {
    var _this = this;
    return new Promise(function (reslove, reject) {
        var timeId;
        if (options.method == 'get') {
            timeId = setTimeout(function () {
                var err = new Error();
                err.name = 'timeout';
                err.message = '网络连接超时';
                reject(err);
                _this.error.fire(_this, err);
                clearTimeout(timeId);
            }, Service.settings.ajaxTimeout * 1000);
        }
        ajax(url, options)
            .then(function (data) {
            reslove(data);
            if (timeId)
                clearTimeout(timeId);
        })
            .catch(function (err) {
            reject(err);
            _this.error.fire(_this, err);
            if (timeId)
                clearTimeout(timeId);
        });
    });
};
Service.prototype.getByJson = function (url, data) {
    console.assert(url.indexOf('?') < 0);
    if (data) {
        url = url + '?' + JSON.stringify(data);
    }
    return this.ajaxByJSON(url, null, 'get');
};
Service.prototype.postByJson = function (url, data) {
    return this.ajaxByJSON(url, data, 'post');
};
Service.prototype.deleteByJson = function (url, data) {
    return this.ajaxByJSON(url, data, 'delete');
};
Service.prototype.putByJson = function (url, data) {
    return this.ajaxByJSON(url, data, 'put');
};
Service.prototype.get = function (url, data) {
    data = data || {};
    var urlParams = '';
    for (var key in data) {
        urlParams = urlParams + ("&" + key + "=" + data[key]);
    }
    console.assert(url.indexOf('?') < 0);
    if (urlParams)
        url = url + '?' + urlParams.substr(1);
    var options = {
        method: 'get',
    };
    return this.ajax(url, options);
};
Service.prototype.post = function (url, data) {
    return this.ajaxByForm(url, data, 'post');
};
Service.prototype.put = function (url, data) {
    return this.ajaxByForm(url, data, 'put');
};
Service.prototype.delete = function (url, data) {
    return this.ajaxByForm(url, data, 'delete');
};
Service.prototype.ajaxByForm = function (url, data, method) {
    var headers = {};
    headers['content-type'] = 'application/x-www-form-urlencoded';
    var body = new URLSearchParams();
    for (var key in data) {
        body.append(key, data[key]);
    }
    return this.ajax(url, { headers: headers, body: body, method: method });
};
Service.prototype.ajaxByJSON = function (url, data, method) {
    var headers = {};
    headers['content-type'] = 'application/json';
    var body;
    if (data)
        body = JSON.stringify(data);
    var options = {
        headers: headers,
        body: body,
        method: method
    };
    return this.ajax(url, options);
};
Service.settings = {
    ajaxTimeout: 30,
};
return Service;
}());
chitu.Service = Service;
})(chitu || (chitu = {}));

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
function loadjs(path) {
return new Promise(function (reslove, reject) {
requirejs([path], function (result) {
    reslove(result);
}, function (err) {
    reject(err);
});
});
}

window['chitu'] = window['chitu'] || chitu 
                    
return chitu;
    });