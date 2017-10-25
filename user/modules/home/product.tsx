import { default as StyleControl } from 'mobileComponents/style/control';
import { default as ProductControl } from 'mobileComponents/product/control';
export default function (page: chitu.Page) {
    ReactDOM.render(
        <ProductControl productId={page.routeData.values.id} />, page.element);
}
