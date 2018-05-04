import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { isWeixin } from 'user/services/weixinService';
import { app } from "user/application";
import { ADMIN_APP } from 'share/common';
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
export function defaultNavBar(element: HTMLElement,
    options?: { title?: string, right?: JSX.Element, showBackButton?: boolean });
export function defaultNavBar(elementPage: chitu.Page,
    options?: { title?: string, right?: JSX.Element, showBackButton?: boolean });
export function defaultNavBar(elementPage: any,
    options?: { title?: string, right?: JSX.Element, showBackButton?: boolean }) {
    //=============================
    // window[ADMIN_APP] 表明为设计时
    if (window[ADMIN_APP]) {
        return null;
    }
    //=============================

    let element: HTMLElement;
    if ((elementPage as chitu.Page).element != null) {
        element = (elementPage as chitu.Page).element;
    }
    else {
        element = elementPage;
    }


    if (isWeixin) {
        return weixinNavheader(element, options);
    }

    // document.title = options.title || "";
    options = options || {};
    let title = options.title || '';
    let className = element.className;
    if (className.indexOf("topbar-padding") < 0)
        element.className = className + ' topbar-padding';

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

function weixinNavheader(element: HTMLElement, options?: { title?: string, right?: JSX.Element, left?: JSX.Element });
function weixinNavheader(elementPage: chitu.Page, options?: { title?: string, right?: JSX.Element, left?: JSX.Element })
function weixinNavheader(elementPage: any, options?: { title?: string, right?: JSX.Element, left?: JSX.Element }) {

    let element: HTMLElement;
    if ((elementPage as chitu.Page).element != null) {
        element = (elementPage as chitu.Page).element;
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


