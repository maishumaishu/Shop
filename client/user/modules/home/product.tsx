import { default as ProductControl } from 'components/product/control';
import { guid } from 'user/services/service';
import { ShoppingService } from 'user/services/shoppingService';
import { MobilePage } from 'components/mobilePage';
import { Page } from 'application';

export default async function (page: Page) {
    var shopping = page.createService(ShoppingService);
    let product = await shopping.product(page.data.id);

    let mobilePage: MobilePage;

    let pageData = await createPageData(shopping, page.data.id);
    ReactDOM.render(<MobilePage pageData={pageData} elementPage={page} ref={e => mobilePage = e || mobilePage} />, page.element);

    page.showing.add(async (sender: Page, args) => {
        sender.showLoading();
        let pageData = await createPageData(shopping, page.data.id);
        mobilePage.state.pageData = pageData;
        mobilePage.setState(mobilePage.state);
        page.hideLoading();
    })
}

async function createPageData(shopping: ShoppingService, productId: string) {
    let product = await shopping.product(productId);
    let pageData = {
        // header: {
        controls: [
            { controlId: guid(), controlName: 'product:Header', position: 'header' },
            // ]
            // },
            // view: {
            // controls: [
            { controlId: guid(), controlName: 'product', data: { product }, position: 'view' },
            //     ]
            // },
            // footer: {
            //     controls: [
            { controlId: guid(), controlName: 'product:Footer', data: { product }, position: 'footer' }
        ]
        // }
    } as PageData;
    return pageData;
}
