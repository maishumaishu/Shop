import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { Component } from 'mobileComponents/common';
import { default as station, PageData, ControlData, guid } from 'services/Station';
import { default as StyleControl } from 'mobileComponents/style/control';
import { default as ProductControl } from 'mobileComponents/product/control';
export default async function (page: chitu.Page) {
    let pageData = await station.storeStylePageData();
    let h = Component.createDesignElement;
    let styleControl: StyleControl;
    let designer: MobilePageDesigner;
    ReactDOM.render(
        <MobilePageDesigner ref={(e) => designer = e || designer} pageData={pageData} >
        </MobilePageDesigner>, page.element);
}

