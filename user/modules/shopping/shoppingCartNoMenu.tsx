import { Page } from 'site';
import { ShoppingCartService, ShoppingCartItem } from 'userServices';
import { default as createShoppingCartPage } from 'modules/shopping/shoppingCart';

export default function (page: Page) {
    createShoppingCartPage(page, true);
}