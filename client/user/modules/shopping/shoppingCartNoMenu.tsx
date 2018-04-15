import siteMap from 'user/siteMap';
import { Page } from 'user/application';

export default function (page: Page) {
    page.element.className = page.element.className.replace('shoppingCartNoMenu', 'shoppingCart');
    siteMap.nodes.shopping_shoppingCart.action(page, false);
}