

import Product = require('models/Product');
import app = require('Application');
import shopping = require('services/Shopping');
import Service = require('services/Service');
import ProductGroupDialog = require('modules/Shopping/Product/ProductGroupDialog');
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
    private page: ProductEditPage;

    constructor(page: ProductEditPage) {
        this.$dlg_groups = $(page.element).find('[name="groupList"]');
        this.page = page;
    }

    back() {
        app.back().fail(function () {
            location.href = '#Shopping/ProductList';
        });
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

class ProductEditPage extends chitu.Page {
    private model: PageModel;

    constructor(params) {
        super(params);

        requirejs(['css!content/Shopping/ProductEdit.css']);

        this.model = new PageModel(this);
        ko.applyBindings(this.model, this.element);


        UE.createEditor('productEditEditor', this.model.product.Introduce);


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

        this.load.add(this.page_load);
    }

    private page_load(page: ProductEditPage, args: any) {
        let categories_deferred = shopping.getCategories().done(function (data) {
            mapping.fromJS(data, {}, page.model.categories);
        });
        let brands_deferred = shopping.getBrands().done(function (data) {
            mapping.fromJS(data, {}, page.model.brands);
        });
        return $.when(categories_deferred, brands_deferred)
            .pipe(() => shopping.getProduct(args.id))
            .done(function (data) {
                mapping.fromJS(data, {}, page.model.product);
            });
    }

}

export = ProductEditPage;