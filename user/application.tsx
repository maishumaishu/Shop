class Page extends chitu.Page {
    constructor(params) {
        super(params);
        let className = this.routeData.pageName.split('.').join('-');
        this.element.className = 'mobile-page ' + className;
    }
    createService<T>(type: { new (): T }) {
        return new type();
    }
}
class Application extends chitu.Application {
    constructor() {
        super();
        this.pageType = Page;

        this.pageCreated.add((sender, page) => {
            let routeData = page.routeData;
            let path = routeData.actionPath.substr(routeData.basePath.length);
            let cssPath = `css!modules` + path;
            requirejs([cssPath]);
        })
    }
}
import { } from 'mobileControls';
var app = new Application();

// function setMobilePageLocation(element: HTMLElement) {
//     // let nodes = document.querySelectorAll('mobile-page');
//     // for (let i = 0; i < nodes.length; i++) {
//     //     let element = nodes[i] as HTMLElement;
//     window.setTimeout(() => {
//         let left = ((window.innerWidth - element.clientWidth) / 2).toFixed(0);
//         element.style.left = `${left}px`;
//     }, 2000);
//     // }
// }
// // window.onresize = setMobilePageLocation;
// // setMobilePageLocation();
// app.pageCreated.add((sender, page) => {
//     page.shown.add(() => setMobilePageLocation(page.element));
// });



export = app;                                                                                                                                               