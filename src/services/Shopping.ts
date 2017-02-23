
import Product = require('models/Product');
import services = require('services/Service');
import mapping = require('knockout.mapping');

let JData = window['JData'];


class ShoppingService extends services {
    getProduct(productId: string) {
        let url = services.config.shopUrl + 'Product/GetProduct';
        let data = { productId: productId };
        return this.ajax<any>({ url, data }).then(data => {
            data.Fields = data.Fields || [];
            data.Arguments = data.Arguments || [];
            return data;
        });
    }
    getProductList(pageIndex: number, searchText?: string): JQueryPromise<{ TotalRowCount: number, DataItems: Array<Product> }> {

        var url = 'Product/GetProducts';
        if (searchText) {
            url = url + '?searchText=' + encodeURI(searchText);
        }

        var maximumRows = 10;
        var start = pageIndex * maximumRows;
        var args = { StartRowIndex: start, MaximumRows: maximumRows };
        return services.get(url, args).then(function (result) {
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
        /// <returns type="jQuery.Deferred"/>
        return services.callMethod('Product/OnShelve', { productId: productId });
    }
    offShelve(productId) {
        /// <returns type="jQuery.Deferred"/>
        return services.callMethod('Product/OffShelve', { productId: productId });
    }
    getCategories() {
        let url = `${services.config.shopUrl}/ShoppingData/select?source=ProductCategories&selection=Id,Name`;
        return services.getByJson<any>(url, {})
            .then(function (result) {
                return result.DataItems;
            });
    }
    getBrands() {
        let url = `${services.config.shopUrl}/ShoppingData/select?source=Brands&selection=Id,Name`
        return services.getByJson<any>(url, {})
            .then(function (result) {
                return result.DataItems;
            });
    }
    setStock(productId, quantity) {
        /// <returns type="jQuery.Deferred"/>
        return services.callMethod('Product/SetStock', { productId: productId, quantity: quantity });
    }
    getProductStocks(productIds) {
        /// <returns type="jQuery.Deferred"/>
        return services.get('Product/GetProductStocks', { productIds: productIds });
    }
    getBuyLimitedNumbers(productIds) {
        /// <returns type="jQuery.Deferred"/>
        return services.get('Product/GetBuyLimitedNumbers', { productIds: productIds });
    }
    buyLimited(productId, quantity) {
        /// <returns type="jQuery.Deferred"/>
        return services.callMethod('Product/SetBuyLimitedQuantity', { productId: productId, quantity: quantity });
    }
    getRegionFreights(solutionId) {
        let url = `${services.config.shopUrl}Freight/GetRegionFreights`
        return services.getByJson<Array<any>>(url, { solutionId: solutionId });
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
    productGroups = new JData.WebDataSource(services.config.shopUrl + 'ShoppingData/Select?source=ProductGroups&selection=Id,Name,ArgumentNames,\
                                                                      CustomFieldName1,CustomFieldName2,CustomFieldName3,CustomFieldName4,CustomFieldName5,CustomFieldName6,\
                                                                      CustomFieldValues1,CustomFieldValues2,CustomFieldValues3,CustomFieldValues4,CustomFieldValues5,CustomFieldValues6,\
                                                                      CustomFieldSortNumber1,CustomFieldSortNumber2,CustomFieldSortNumber3,CustomFieldSortNumber4,CustomFieldSortNumber5,CustomFieldSortNumber6',
        services.config.shopUrl + 'ShoppingData/Insert?source=ProductGroups',
        services.config.shopUrl + 'ShoppingData/Update?source=ProductGroups',
        services.config.shopUrl + 'ShoppingData/Delete?source=ProductGroups');
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

