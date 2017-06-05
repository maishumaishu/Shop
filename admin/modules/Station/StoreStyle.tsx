import { MobilePageDesigner } from 'modules/Station/Components/MobilePageDesigner';
import { default as station, PageData, ControlData } from 'services/Station';
import { default as StyleControl } from 'mobileComponents/style/control';
import { default as ProductControl } from 'mobileComponents/product/control';
export default function (page: chitu.Page) {
    let pageData = {} as PageData;
    ReactDOM.render(
        <MobilePageDesigner >
            <StyleControl style="default" />
            <ProductControl />
            <button className="btn btn-primary">TEST</button>
        </MobilePageDesigner>, page.element);
}

