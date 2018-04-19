import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isWeixin } from 'userServices/weixinService';
import { app } from "user/application";
export { app } from 'user/application';
export { default as siteMap } from 'user/siteMap';

export function formatDate(date: Date | string) {
    if (typeof date == 'string')
        return date;

    let d = date as Date;
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours() + 1}:${d.getMinutes()}`;
}


export function subscribe<T>(component: React.Component<any, any>, item: chitu.ValueStore<T>, callback: (value: T) => void) {
    let func = item.add(callback);
    let componentWillUnmount = (component as any).componentWillUnmount as () => void;
    (component as any).componentWillUnmount = function () {
        item.remove(func);
        componentWillUnmount();
    }
}

//============================================================
// ui
export function defaultNavBar(elementPage: chitu.Page,
    options?: { title?: string, right?: JSX.Element, showBackButton?: boolean }) {
    //=============================
    // window['admin-app'] 表明为设计时
    if (window['admin-app']) {
        return null;
    }
    //=============================

    if (isWeixin) {
        return weixinNavheader(elementPage, options);
    }
    // document.title = options.title || "";
    options = options || {};
    let title = options.title || '';
    let className = elementPage.element.className;
    if (className.indexOf("topbar-padding") < 0)
        elementPage.element.className = className + ' topbar-padding';

    return (
        <nav className="bg-primary">
            <div className="pull-left" style={{ padding: 0, width: 60 }}>
                {options.showBackButton == false ?
                    <span dangerouslySetInnerHTML={{ __html: "&nbsp;" }}></span> :
                    <button name="back-button" className="left-button" style={{ opacity: 1 }} onClick={() => app.back()}>
                        <i className="icon-chevron-left"></i>
                    </button>
                }
                {/* {options.left} */}
            </div>
            <div className="pull-right" style={{ padding: 0, width: 60 }}>
                {options.right ? options.right :
                    <span dangerouslySetInnerHTML={{ __html: "&nbsp;" }}></span>}
            </div>
            <div className="" style={{ padding: 0 }}>
                <h4>
                    {title}
                </h4>
            </div>
        </nav>
    );
}

function weixinNavheader(elementPage: chitu.Page, options?: { title?: string, right?: JSX.Element, left?: JSX.Element }) {
    let title = options.title || "";
    document.title = options.title || "";
    if (options.left == null && options.right == null)
        return null;

    let className = elementPage.element.className;
    if (className.indexOf("topbar-padding") < 0)
        elementPage.element.className = className + ' topbar-padding';

    return (
        <nav className="bg-primary">
            <div className="col-xs-3" style={{ padding: 0 }}>
                {options.left}
            </div>
            <div className="col-xs-6" style={{ padding: 0 }}>

            </div>
            <div className="col-xs-3" style={{ padding: 0 }}>
                {options.right ? (options.right) : null}
            </div>
        </nav>
    );

}


