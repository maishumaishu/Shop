import { Page } from 'site';
import { default as createShoppingCartPage } from 'modules/shopping/shoppingCart';

export default function (page: Page) {
    createShoppingCartPage(page);
}