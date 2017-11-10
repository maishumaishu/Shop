import { default as ProductControl } from 'mobileComponents/product/control';
import { guid } from 'userServices/service';
import { ShoppingService } from 'userServices/shoppingService';
import { MobilePage } from 'mobileComponents/mobilePage';
export default async function (page: chitu.Page) {
    var shopping = page.createService(ShoppingService);
    let product = await shopping.product(page.routeData.values.id);
    // productId={page.routeData.values.id} 
    // ReactDOM.render(
    //     <ProductControl product={product} />, page.element);

    let pageData = {
        views: [
            {
                controls: [
                    { controlId: guid(), controlName: 'product', data: { product } }
                ]
            }
        ]
    } as PageData;

    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page}></MobilePage>, page.element);
}
