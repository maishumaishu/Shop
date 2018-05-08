import siteMap from 'user/siteMap';
import { UserPage } from 'user/application';

export default function (page: UserPage) {
    page.element.className = page.element.className.replace('shoppingCartNoMenu', 'shoppingCart');
    siteMap.nodes.shopping_shoppingCart.action(page, false);
}