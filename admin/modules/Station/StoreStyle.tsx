import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { MobilePage } from 'modules/Station/Components/MobilePage';
import { Control } from 'mobileComponents/common';
import { default as station, PageData, ControlData } from 'services/Station';
import { default as StyleControl } from 'mobileComponents/style/control';
import { default as ProductControl } from 'mobileComponents/product/control';
export default function (page: chitu.Page) {
    let pageData = {} as PageData;
    let h = Control.createDesignElement;
    ReactDOM.render(
        <MobilePageDesigner >
            <StyleControl style="default" />
            <ProductControl />
        </MobilePageDesigner>, page.element);
}

