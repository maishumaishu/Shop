
import Product = require('models/Product');
import services = require('services/Service');
import mapping = require('knockout.mapping');

let JData = window['JData'];


class ShoppingService extends services {
    private url(path: string) {
        return `${services.config.shopUrl}${path}`;
    }
    getProduct(productId: string) {
        let url = services.config.shopUrl + 'Product/GetProduct';
        let data = { productId: productId };
        return this.ajax<any>({ url, data }).then(data => {
            data.Fields = data.Fields || [];
            data.Arguments = data.Arguments || [];
            return data;
        });
    }
    getProductList(pageIndex: number, searchText?: string): Promise<{ TotalRowCount: number, DataItems: Array<Product> }> {

        var url = this.url('Product/GetProducts');
        if (searchText) {
            url = url + '?searchText=' + encodeURI(searchText);
        }

        var maximumRows = 10;
        var start = pageIndex * maximumRows;
        var args = { StartRowIndex: start, MaximumRows: maximumRows };
        return services.get<any>(url, args).then(function (result) {
            for (var i = 0; i < result.DataItems.length; i++) {
                result.DataItems[i] = mapping.fromJS(result.DataItems[i], {}, new Product()); //translators.product(result.DataItems[i]);
            }

            return result;
        });
    }
    commonProduct(product) {
        alert(product.Id());
    }
    saveProduct(product: Product) {
        debugger;
        var obj = ko.mapping.toJS(product, { ignore: ['ExtProperties'] });
        if (obj.Id) {
            return services.putByJson(services.config.shopUrl + 'Product/UpdateProduct', obj);
        }
        else {
            return services.putByJson(services.config.shopUrl + 'Product/SaveProduct', obj);
        }
    }
    removeProduct(productId) {
        return services.callMethod('Product/DeleteProduct', { id: productId });
    }
    topProduct(productId) {
        return services.callMethod('Product/ProductTop', { id: productId });
    }
    onShelve(productId) {
        //return services.callMethod('Product/OnShelve', { productId: productId });
        return services.putByJson(this.url('Product/OnShelve'), { productId });
    }
    offShelve(productId) {
        return services.putByJson(this.url('Product/OffShelve'), { productId });
        //return services.callMethod('Product/OffShelve', { productId: productId });
    }
    getCategories() {
        let url = this.url('ShoppingData/select?source=ProductCategories&selection=Id,Name');
        return services.get<any>(url)
            .then(function (result) {
                return result.DataItems;
            });
    }
    getBrands() {
        let url = this.url('ShoppingData/select?source=Brands&selection=Id,Name');
        return services.get<any>(url, {})
            .then(function (result) {
                return result.DataItems;
            });
    }
    setStock(productId, quantity) {
        return services.callMethod('Product/SetStock', { productId: productId, quantity: quantity });
    }
    getProductStocks(productIds) {
        let url = this.url('Product/GetProductStocks');
        return services.get<Array<any>>(url, { productIds: productIds });
    }
    getBuyLimitedNumbers(productIds) {
        let url = this.url('Product/GetBuyLimitedNumbers');
        return services.get<Array<any>>(url, { productIds: productIds });
    }
    buyLimited(productId, quantity) {
        return services.callMethod('Product/SetBuyLimitedQuantity', { productId: productId, quantity: quantity });
    }
    getRegionFreights(solutionId) {
        let url = `${services.config.shopUrl}Freight/GetRegionFreights`
        return services.get<Array<any>>(url, { solutionId: solutionId });
    }
    setRegionFreight(id, freight, freeAmount) {
        return services.callMethod('Freight/SetRegionFreight', { id: id, freight: freight, freeAmount: freeAmount });
    }
    couponDataSource = new JData.WebDataSource(services.config.shopUrl + 'ShoppingData/Select?source=Coupons&selection=Id,Title,Discount,Amount,ValidBegin,ValidEnd,ReceiveBegin,ReceiveEnd,\
                                                                         Remark,Picture,BrandNames,CategoryNames,ProductNames',
        services.config.shopUrl + 'ShoppingData/Insert?source=Coupons',
        services.config.shopUrl + 'Coupon/UpdateCoupon',
        services.config.shopUrl + 'ShoppingData/Delete?source=Coupons');

    getDefineProperties(defineId) {
        return services.callMethod('Product/GetDefineProperties', { defineId: defineId });
    }
    getProductArguments(argumentId) {
        return services.callMethod('Product/GetProductArguments', { argumentId: argumentId });
    }
}


module outlet {
    export var dataSource = function () {
        return new JData.WebDataSource(
            services.config.shopUrl + 'ShoppingData/Select?source=Outlets',
            services.config.shopUrl + 'ShoppingData/Insert?source=Outlets',
            services.config.shopUrl + 'ShoppingData/Update?source=Outlets',
            services.config.shopUrl + 'ShoppingData/Delete?source=Outlets'
        );
    }
};


export = new ShoppingService();

