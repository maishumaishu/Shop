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
    page.active.add(async () => {
        // let view = page.element.querySelector('section') as HTMLElement;
        // view.innerHTML = "数据正在加载中..."
        // view.style.paddingTop = "50";
        page.showLoading();
        let pageData = await createPageData(shopping, page.routeData.values.id);
        page.hideLoading();
        mobilePage.state.pageData = pageData;
        mobilePage.setState(mobilePage.state);
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
                { controlId: guid(), controlName: 'product:Footer' }
            ]
        }
    } as PageData;
    return pageData;
}
