import { VirtualMobile } from "components/virtualMobile";
import { MobilePage } from 'components/mobilePage';
import { MobilePageDesigner } from "components/mobilePageDesigner";
import { StationService as UserStation } from 'user/services/stationService';
import { StationService as AdminStation, guid, StationService } from 'admin/services/station';
import { ShoppingService } from "admin/services/shopping";
import { State as CarouselState } from 'components/carousel/control'
export default async function (page: chitu.Page) {
    type Props = { pageData: PageData } & React.Props<ProductEditPage>;
    class ProductEditPage extends React.Component<Props, any> {

        designer: MobilePageDesigner;
        async saveProduct(pageData: PageData): Promise<any> {
            let station = page.createService(AdminStation);
            await station.savePageData(pageData);
            console.assert(pageData.id != null);

            let shop = page.createService(ShoppingService);
            let product: Product = productFromPageData(pageData);
            console.assert(product != null);

            let parentId = page.data.parentId;
            return shop.saveProduct({ product, parentId, id: pageData.id });
        }

        render() {

            let { pageData } = this.props;

            let adminStation = page.createService(AdminStation);
            let userStation = page.createService(UserStation);
            let shop = page.createService(ShoppingService);

            return (
                <MobilePageDesigner pageData={pageData}
                    save={(pageData) => this.saveProduct(pageData)}
                    pageDatas={userStation.pages}
                    showComponentPanel={true}
                    buttons={[
                        <button key={100} className="btn btn-sm btn-primary" onClick={() => history.back()}>
                            <i className="icon-reply" />
                            <span>返回</span>
                        </button>
                    ]}
                    ref={e => this.designer = e || this.designer} />
            );
        }
    }

    let productId = page.data.id || page.data.parentId;
    let pageData: PageData;
    let product: Product;
    if (productId) {
        let station = page.createService(StationService);
        // pageData 的 id 和 商品 一样
        pageData = await station.pageDataById(productId);
        let product = productFromPageData(pageData);

        // parentId 不为空，是要复制一份商品，源 id 为 parentId
        if (page.data.parentId) {
            pageData.id = null;
            console.assert(product.Id == null);
        }
        else {
            product.Id = productId;
        }

    }
    else {
        pageData = {
            name: '*product',
            view: {
                controls: [
                    { controlName: 'carousel', controlId: guid(), data: { autoplay: false } },
                    { controlName: 'productInfo', controlId: guid(), selected: true },
                    { controlName: 'html', controlId: guid(), data: { emptyText: '暂无商品简介，点击设置商品简介，还可以添加其他组件。' } },
                ]
            },
            footer: {
                controls: [
                    { controlName: 'shoppingCartBar', controlId: guid() }
                ]
            }
        }
    }

    //===========================================================
    // 通过 itemWidth 设置列表项的宽
    let carousel = pageData.view.controls.filter(o => o.controlName == 'carousel')[0];
    console.assert(carousel != null);
    let carouselState = (carousel.data as CarouselState);
    carouselState.itemScale = 1;
    carouselState.clickType = 'showImage';
    //===========================================================

    ReactDOM.render(<ProductEditPage {...{ pageData }} />, page.element);
}

function productFromPageData(pageData: PageData) {
    let productInfo = pageData.view.controls.filter(o => o.controlName == 'productInfo')[0];
    console.assert(productInfo != null);

    let product: Product = productInfo.data.product;
    return product;
}