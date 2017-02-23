

import Product = require('models/Product');
import app = require('Application');
import shopping = require('services/Shopping');
import Service = require('services/Service');
import mapping = require('knockout.mapping');
import val = require('knockout.validation');

import UE = require('common/ue.ext');
import bs = require('bootstrap');

ko.components.register('product-properties', {
    template: { require: 'text!modules/Shopping/Product/ProductProperties.html' },
    viewModel: { require: 'modules/Shopping/Product/ProductProperties' }
});

interface KeyValue {
    key: string,
    value: string
}

class PageModel {
    private $dlg_groups: JQuery;
    private page: chitu.Page;

    constructor(page: chitu.Page) {
        this.$dlg_groups = $(page.element).find('[name="groupList"]');
        this.page = page;
    }

    back() {
        app.back().catch(() => {
            location.href = '#Shopping/ProductList';
        })
    }

    product = new Product();
    categories = ko.observableArray();
    brands = ko.observableArray();

    remove = (item, event) => {
        this.product.ImagePaths.remove(item);
    }

    save(model: PageModel) {
        return shopping.saveProduct(model.product);
    }
}

export default function (page: chitu.Page) {
    requirejs(['common/ImageFileResize'], () => {
        (<any>$(this.element).find('[name="ImageUpload"]')).imageFileResize({
            max_width: 800,
            max_height: 800,
            callback: (file, imageData) => {
                var img_base64 = imageData.split(';')[1].split(',')[1];
                $.ajax({
                    url: Service.config.shopUrl + 'Common/UploadImage?dir=Shopping',
                    method: 'post',
                    dataType: 'json',
                    data: {
                        imageData: img_base64
                    }
                }).done((result) => {
                    var path = result.path;
                    if (path[0] == '/') {
                        path = path.substr(1, path.length - 1);
                    }
                    this.model.product.ImagePaths.push(Service.config.shopUrl + path);
                });
            }
        });
    });

    requirejs([`text!${page.routeData.actionPath}.html`, 'css!content/Shopping/ProductEdit.css'], function (html) {
        page.element.innerHTML = html;
        let model = new PageModel(page);
        UE.createEditor('productEditEditor', model.product.Introduce);
        ko.applyBindings(model, page.element);
        page_load(page, model, page.routeData.values);
    });

}

function page_load(page: chitu.Page, model: PageModel, args: any) {
    let categories_deferred = shopping.getCategories().then(function (data) {
        mapping.fromJS(data, {}, model.categories);
    });
    let brands_deferred = shopping.getBrands().then(function (data) {
        mapping.fromJS(data, {}, model.brands);
    });

    return Promise.all([categories_deferred, brands_deferred]).then(() => {
        return shopping.getProduct(args.id);
    }).then((data) => {
        mapping.fromJS(data, {}, model.product);
    });
}
