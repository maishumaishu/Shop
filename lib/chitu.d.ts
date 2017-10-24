declare namespace chitu {
    class RouteData {
        private _parameters;
        private path_string;
        private path_spliter_char;
        private path_contact_char;
        private param_spliter;
        private name_spliter_char;
        private _pathBase;
        private _pageName;
        private _actionPath;
        private _routeString;
        private _loadCompleted;
        constructor(basePath: string, routeString: string, pathSpliterChar?: string);
        parseRouteString(): void;
        private pareeUrlQuery(query);
        readonly basePath: string;
        readonly values: any;
        readonly pageName: string;
        readonly routeString: string;
        readonly actionPath: string;
        readonly loadCompleted: boolean;
    }
    class Application {
        pageCreated: Callback<Application, Page>;
        protected pageType: PageConstructor;
        protected pageDisplayType: PageDisplayConstructor;
        private _runned;
        private zindex;
        private page_stack;
        private cachePages;
        fileBasePath: string;
        backFail: Callback<Application, null>;
        constructor();
        protected parseRouteString(routeString: string): RouteData;
        private on_pageCreated(page);
        readonly currentPage: Page;
        readonly pages: Array<Page>;
        protected createPage(routeData: RouteData, actionArguments: any): Page;
        protected createPageElement(routeData: chitu.RouteData): HTMLElement;
        protected hashchange(): void;
        run(): void;
        getPage(name: string): Page;
        private getPageByRouteString(routeString);
        showPage(routeString: string, args?: any): Page;
        setLocationHash(routeString: string): void;
        private closeCurrentPage();
        private clearPageStack();
        redirect(routeString: string, args?: any): Page;
        back(args?: any): void;
    }
}

declare namespace chitu {
    class Errors {
        static argumentNull(paramName: string): Error;
        static modelFileExpecteFunction(script: any): Error;
        static paramTypeError(paramName: string, expectedType: string): Error;
        static paramError(msg: string): Error;
        static viewNodeNotExists(name: any): Error;
        static pathPairRequireView(index: any): Error;
        static notImplemented(name: any): Error;
        static routeExists(name: any): Error;
        static noneRouteMatched(url: any): Error;
        static emptyStack(): Error;
        static canntParseUrl(url: string): Error;
        static canntParseRouteString(routeString: string): Error;
        static routeDataRequireController(): Error;
        static routeDataRequireAction(): Error;
        static viewCanntNull(): Error;
        static createPageFail(pageName: string): Error;
        static actionTypeError(pageName: string): Error;
        static canntFindAction(pageName: any): Error;
        static exportsCanntNull(pageName: string): void;
        static scrollerElementNotExists(): Error;
        static resourceExists(resourceName: string, pageName: string): Error;
    }
}

declare namespace chitu {
    class Callback<S, A> {
        private funcs;
        constructor();
        add(func: (sender: S, args: A) => any): void;
        remove(func: (sender: S, args: A) => any): void;
        fire(sender: S, args: A): void;
    }
    function Callbacks<S, A>(): Callback<S, A>;
    class ValueStore<T> {
        private funcs;
        private _value;
        constructor(value?: T);
        add(func: (value: T) => any): (args: T) => any;
        remove(func: (value: T) => any): void;
        fire(value: T): void;
        value: T;
    }
}

declare namespace chitu {
    interface PageDisplayConstructor {
        new (app: Application): PageDisplayer;
    }
    interface PageDisplayer {
        show(page: Page): Promise<any>;
        hide(page: Page): Promise<any>;
    }
    interface PageParams {
        app: Application;
        routeData: RouteData;
        element: HTMLElement;
        displayer: PageDisplayer;
        previous?: Page;
        actionArguments: any;
    }
    class Page {
        private animationTime;
        private num;
        private _element;
        private _previous;
        private _app;
        private _routeData;
        private _displayer;
        private _actionArguments;
        static tagName: string;
        error: Callback<Page, Error>;
        load: Callback<this, null>;
        loadComplete: Callback<this, null>;
        showing: Callback<this, null>;
        shown: Callback<this, null>;
        hiding: Callback<this, null>;
        hidden: Callback<this, null>;
        closing: Callback<this, null>;
        closed: Callback<this, null>;
        constructor(params: PageParams);
        private on_load();
        private on_loadComplete();
        private on_showing();
        private on_shown();
        private on_hiding();
        private on_hidden();
        private on_closing();
        private on_closed();
        show(): Promise<any>;
        hide(): Promise<any>;
        close(): Promise<any>;
        createService<T extends Service>(type: ServiceConstructor<T>): T;
        readonly element: HTMLElement;
        previous: Page;
        readonly routeData: RouteData;
        readonly name: string;
        private loadPageAction();
        reload(): Promise<void>;
    }
}
interface PageActionConstructor {
    new (page: chitu.Page): any;
}
interface PageConstructor {
    new (args: chitu.PageParams): chitu.Page;
}
declare class PageDisplayerImplement implements chitu.PageDisplayer {
    show(page: chitu.Page): Promise<void>;
    hide(page: chitu.Page): Promise<void>;
}

interface ServiceError extends Error {
    method?: string;
}
declare function ajax<T>(url: string, options: RequestInit): Promise<T>;
declare namespace chitu {
    interface ServiceConstructor<T extends Service> {
        new (): T;
    }
    abstract class Service {
        error: Callback<Service, Error>;
        static settings: {
            ajaxTimeout: number;
            headers: {
                [key: string]: string;
            };
        };
        constructor();
        ajax<T>(url: string, options: RequestInit): Promise<T>;
        getByJson<T>(url: string, data?: any): Promise<T>;
        postByJson<T>(url: string, data?: Object): Promise<T>;
        deleteByJson<T>(url: string, data?: Object): Promise<T>;
        putByJson<T>(url: string, data?: Object): Promise<T>;
        get<T>(url: string, data?: any): Promise<T>;
        post<T>(url: string, data?: any): Promise<T>;
        put<T>(url: string, data?: any): Promise<T>;
        delete<T>(url: string, data?: any): Promise<T>;
        private ajaxByForm<T>(url, data, method);
        private ajaxByJSON<T>(url, data, method);
    }
}

declare namespace chitu {
    function combinePath(path1: string, path2: string): string;
    function loadjs(path: any): Promise<any>;
}
declare module "maishu-chitu" { 
            export = chitu; 
        }
