import siteMap from 'user/siteMap';

export default function (page: chitu.Page) {
    page.element.className = page.element.className.replace('shoppingCartNoMenu', 'shoppingCart');
    siteMap.nodes.shopping_shoppingCart.action(page, false);
}