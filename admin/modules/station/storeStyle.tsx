// import { ComponentDesigner } from 'componentDesigner';
// import { Component } from 'mobileComponents/common';
// import { default as station, PageData, ControlDescrtion, guid } from 'services/station';
// import { default as StyleControl } from 'mobileComponents/style/control';
// import { default as ProductControl } from 'mobileComponents/product/control';
// import { default as ProductPage } from 'mobileComponents/product/control';
// export default async function (page: chitu.Page) {
//     ReactDOM.render(
//         <ComponentDesigner controlName='style' target="footer" >
//             <ProductPage />
//         </ComponentDesigner>, page.element);
// }


import { ComponentDesigner } from 'componentDesigner';
import { MobilePageDesigner } from 'mobilePageDesigner';
import { default as station} from 'services/station';
export default function (page: chitu.Page) {
    station.stylePage().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData}
                save={station.savePageData.bind(station)} >
            </MobilePageDesigner>, page.element);
    })
}
