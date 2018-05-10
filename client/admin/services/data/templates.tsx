import { guid } from "share/common";
import { State as ProductListState } from 'components/productList/control';

let templates: PageData[] = [
    {
        id: guid(),
        controls: [
            viewControl('summaryHeader'),
            viewControl('productList', {
                productsCount: 6
            } as ProductListState),
        ]
    },
    {
        id: guid(),
        controls: [
            headerControl('locationBar'),
            viewControl('productList', {
                productsCount: 6
            } as ProductListState),
            footerControl('shoppingCartBar')
        ]
    }
]

function viewControl(controlName: string, data?: any): ControlData {
    return {
        controlId: guid(),
        controlName,
        position: 'view',
        data
    }
}

function footerControl(controlName: string): ControlData {
    return {
        controlId: guid(),
        controlName,
        position: 'footer'
    }
}

function headerControl(controlName: string): ControlData {
    return {
        controlId: guid(),
        controlName,
        position: 'header'
    }
}


export default templates;