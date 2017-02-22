import app = require('Application');
import shopAdmin = require('services/ShopAdmin');

export default function (page: chitu.Page) {
    shopAdmin.logout();
    app.redirect('User/Login');
}