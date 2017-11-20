import { default as ProductControl } from 'mobileComponents/product/control';
import { guid } from 'userServices/service';
import { ShoppingService } from 'userServices/shoppingService';
import { MobilePage } from 'mobileComponents/mobilePage';
import { Page } from 'application';

export default async function (page: Page) {
    var shopping = page.createService(ShoppingService);
    let product = await shopping.product(page.routeData.values.id);

    let mobilePage: MobilePage;

    let pageData = await createPageData(shopping, page.routeData.values.id);
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ref={e => mobilePage = e || mobilePage} />, page.element);

    page.showing.add(async (sender: Page, args) => {
        sender.showLoading();
        let pageData = await createPageData(shopping, page.routeData.values.id);
        mobilePage.state.pageData = pageData;
        mobilePage.setState(mobilePage.state);
        page.hideLoading();
    })
}

async function createPageData(shopping: ShoppingService, productId: string) {
    let product = await shopping.product(productId);
    let pageData = {
        header: {
            controls: [
                { controlId: guid(), controlName: 'product:Header' }
            ]
        },
        views: [
            {
                controls: [
                    { controlId: guid(), controlName: 'product', data: { product } }
                ]
            }
        ],
        footer: {
            controls: [
                { controlId: guid(), controlName: 'product:Footer', data: { product } }
            ]
        }
    } as PageData;
    return pageData;
}
