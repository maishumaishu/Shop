define(["require", "exports", "user/services/weixinService", "user/application", "share/common", "user/application", "user/siteMap"], function (require, exports, weixinService_1, application_1, common_1, application_2, siteMap_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.app = application_2.app;
    exports.siteMap = siteMap_1.default;
    function formatDate(date) {
        if (typeof date == 'string')
            return date;
        let d = date;
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours() + 1}:${d.getMinutes()}`;
    }
    exports.formatDate = formatDate;
    function subscribe(component, item, callback) {
        let func = item.add(callback);
        let componentWillUnmount = component.componentWillUnmount;
        component.componentWillUnmount = function () {
            item.remove(func);
            componentWillUnmount();
        };
    }
    exports.subscribe = subscribe;
    function defaultNavBar(elementPage, options) {
        //=============================
        // window[ADMIN_APP] 表明为设计时
        if (window[common_1.ADMIN_APP]) {
            return null;
        }
        //=============================
        let element;
        if (elementPage.element != null) {
            element = elementPage.element;
        }
        else {
            element = elementPage;
        }
        if (weixinService_1.isWeixin) {
            return weixinNavheader(element, options);
        }
        // document.title = options.title || "";
        options = options || {};
        let title = options.title || '';
        let className = element.className;
        if (className.indexOf("topbar-padding") < 0)
            element.className = className + ' topbar-padding';
        return (h("nav", { className: "bg-primary" },
            h("div", { className: "pull-left", style: { padding: 0, width: 60 } }, options.showBackButton == false ?
                h("span", { dangerouslySetInnerHTML: { __html: "&nbsp;" } }) :
                h("button", { name: "back-button", className: "left-button", style: { opacity: 1 }, onClick: () => application_1.app.back() },
                    h("i", { className: "icon-chevron-left" }))),
            h("div", { className: "pull-right", style: { padding: 0, width: 60 } }, options.right ? options.right :
                h("span", { dangerouslySetInnerHTML: { __html: "&nbsp;" } })),
            h("div", { className: "", style: { padding: 0 } },
                h("h4", null, title))));
    }
    exports.defaultNavBar = defaultNavBar;
    function weixinNavheader(elementPage, options) {
        let element;
        if (elementPage.element != null) {
            element = elementPage.element;
        }
        else {
            element = elementPage;
        }
        let title = options.title || "";
        document.title = options.title || "";
        if (options.left == null && options.right == null)
            return null;
        let className = element.className;
        if (className.indexOf("topbar-padding") < 0)
            element.className = className + ' topbar-padding';
        return (h("nav", { className: "bg-primary" },
            h("div", { className: "col-xs-3", style: { padding: 0 } }, options.left),
            h("div", { className: "col-xs-6", style: { padding: 0 } }),
            h("div", { className: "col-xs-3", style: { padding: 0 } }, options.right ? (options.right) : null)));
    }
});
