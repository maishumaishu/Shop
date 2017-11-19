import { default as createShoppingCartPage } from 'modules/shopping/shoppingCart';

export default function (page: chitu.Page) {
    page.element.className = page.element.className.replace('shoppingCartNoMenu', 'shoppingCart');
    createShoppingCartPage(page, false);
}