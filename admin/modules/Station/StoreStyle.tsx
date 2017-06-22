import { ComponentDesigner } from 'modules/Station/Components/ComponentDesigner';
import { Component } from 'mobileComponents/common';
import { default as station, PageData, ControlData, guid } from 'services/Station';
import { default as StyleControl } from 'mobileComponents/style/control';
import { default as ProductControl } from 'mobileComponents/product/control';
import { default as ProductPage } from 'mobileComponents/product/control';
export default async function (page: chitu.Page) {
    ReactDOM.render(
        <ComponentDesigner controlName='style' target="footer" >
            <ProductPage />
        </ComponentDesigner>, page.element);
}

