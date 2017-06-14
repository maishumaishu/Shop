import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { Component } from 'mobileComponents/common';
import { default as station, PageData, ControlData, guid } from 'services/Station';
import { default as StyleControl } from 'mobileComponents/style/control';
import { default as ProductControl } from 'mobileComponents/product/control';
export default function (page: chitu.Page) {
    let pageData = {
        views: [
            {
                controls: [
                    { controlId: guid(), controlName: 'product', selected: 'disabled' },
                    { controlId: guid(), controlName: 'style', selected: true }
                ]
            }
        ]
    } as PageData;
    let h = Component.createDesignElement;
    let styleControl: StyleControl;
    let designer: MobilePageDesigner;
    ReactDOM.render(
        <MobilePageDesigner ref={(e) => designer = e || designer} pageData={pageData} >
        </MobilePageDesigner>, page.element);
}

