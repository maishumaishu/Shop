import { default as ProductControl } from 'mobileComponents/shoppingCart/control';
import { guid } from 'userServices/service';
import { ShoppingService } from 'userServices/shoppingService';
import { StationService } from 'userServices/stationService';
import { MobilePage } from 'mobileComponents/mobilePage';
export default async function (page: chitu.Page) {
    // var shopping = page.createService(ShoppingService);
    // let product = await shopping.product(page.routeData.values.id);
    // productId={page.routeData.values.id} 
    // ReactDOM.render(
    //     <ProductControl product={product} />, page.element);

    let pageData = {
        showMenu: true,
        header: {
            controls: [
                { controlId: guid(), controlName: 'shoppingCart.Header' }
            ]
        },
        views: [
            {
                controls: [
                    { controlId: guid(), controlName: 'shoppingCart' }
                ]
            }
        ],
        footer: {
            controls: [
                { controlId: guid(), controlName: 'shoppingCart.Footer' }
            ]
        }
    } as PageData;

    let station = page.createService(StationService);
    pageData = await station.fullPage(() => Promise.resolve(pageData));

    ReactDOM.render(<MobilePage pageData={pageData}></MobilePage>, page.element);
}
