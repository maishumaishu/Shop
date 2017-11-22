// import { ComponentDesigner } from 'componentDesigner';
// import { Component } from 'mobileComponents/common';
// import { default as station, PageData, ControlDescrtion, guid } from 'adminServices/station';
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
import { StationService as AdminStation } from 'adminServices/station';
import { StationService as UserStation } from 'userServices/stationService';
export default function (page: chitu.Page) {
    let userStation = page.createService(UserStation)
    let adminStation = page.createService(AdminStation);
    userStation.pages.style().then(pageData => {
        ReactDOM.render(
            <MobilePageDesigner pageData={pageData}
                save={(p) => adminStation.savePageData(p)} userStation={userStation}>
            </MobilePageDesigner>, page.element);
    })
}
