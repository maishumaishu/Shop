import * as React from 'react';
import * as ReactDOM from 'react-dom';

export { app, defaultNavBar, Page, Menu, searchNavBar, config } from 'user/application';

// export app;

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

//===================================================
// 生成样式

import { MobilePage } from 'mobileComponents/mobilePage';
import { StationService } from 'userServices/stationService';

let station = new StationService();
let element = document.createElement('div');
document.body.appendChild(element);
station.stylePage().then(pageData => {
    ReactDOM.render(<MobilePage pageData={pageData} />, element);
})
//===================================================
