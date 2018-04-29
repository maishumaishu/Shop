
// import Product = require('models/Product');
import { Service as Service } from 'admin/services/service';


export class ShoppingService extends Service {
    url(path: string) {
        return `${Service.config.shopUrl}${path}`;
    }
    async product(productId: string) {
        let url = Service.config.shopUrl + 'Product/GetProduct';
        // let data = { productId: productId };
        let arr = await Promise.all([this.getByJson<Product>(url, { productId }), this.productStocks([productId])])
        // return this.getByJson<Product>(url, data).then((data) => {
        let data = arr[0];
        data.Stock = arr[1][0] != null ? arr[1][0].Quantity : null;
        data.Fields = data.Fields || [];
        data.Arguments = data.Arguments || [];

        return data;
        // });
    }
    async products(args: wuzhui.DataSourceSelectArguments) {
        var url = this.url('Product/GetProducts');
        let result = await this.getByJson<wuzhui.DataSourceSelectResult<Product>>(url, args);
        result.dataItems.forEach(o => {
            o.Stock = null;
            o.BuyLimitedNumber = null;
        })
        return result;
    }
    async productsByIds(productIds: string[]) {
        var url = this.url('Product/GetProductsByIds');
        let items = await this.getByJson<Product[]>(url, { ids: productIds });//.then(items => {
        let dic: { [key: string]: Product } = {};
        items.filter(o => o != null).forEach(o => dic[o.Id] = o);
        let products = productIds.map(id => dic[id]);
        return products;
    }
    deleteProduct(id: string) {
        var url = this.url('Product/DeleteProduct');
        return this.deleteByJson(url, { id });
    }
    // queryProducts(pageIndex: number, searchText?: string): Promise<wuzhui.DataSourceSelectResult<Product>> {

    //     var url = this.url('Product/GetProducts');

    //     var maximumRows = 10;
    //     var start = pageIndex * maximumRows;
    //     var args = { StartRowIndex: start, MaximumRows: maximumRows };
    //     if (searchText)
    //         args['searchText'] = encodeURI(searchText);

    //     return this.getByJson<wuzhui.DataSourceSelectResult<Product>>(url, args).then((result) => {
    //         for (var i = 0; i < result.dataItems.length; i++) {
    //             result.dataItems[i].Stock = null;
    //             result.dataItems[i].BuyLimitedNumber = null;
    //             // result.DataItems[i] = mapping.fromJS(result.DataItems[i], {}, new Product()); //translators.product(result.DataItems[i]);
    //         }



    //         return result;
    //     });
    // }
    productChildren(parentId: string) {
        var url = this.url('Product/GetProducts');
        var args = { filter: `ParentId == Guid"${parentId}"` } as wuzhui.DataSourceSelectArguments;
        return this.getByJson<wuzhui.DataSourceSelectResult<Product>>(url, args);
    }
    commonProduct(product) {
        alert(product.Id());
    }
    saveProduct(product: Product, parentId): Promise<{ Id: string }> {
        var obj = Object.assign({ parentId }, product);// ko.mapping.toJS(product, { ignore: ['ExtProperties'] });
        // obj.parentId = parentId;
        obj.Arguments = JSON.stringify(product.Arguments) as any;
        obj.Fields = JSON.stringify(product.Fields) as any;
        obj.ImagePaths = product.ImagePaths.join(',') as any;
        obj.Unit = obj.Unit || '件';

        if (!obj.Id) {
            product.Id = undefined;
            return this.postByJson(Service.config.shopUrl + 'Product/AddProduct', obj);
        }
        else {
            return this.putByJson(Service.config.shopUrl + 'Product/UpdateProduct', obj);
        }
    }
    removeProduct(productId) {
        let url = Service.config.shopUrl + 'Product/DeleteProduct';
        return this.deleteByJson(url, { id: productId });
    }
    onShelve(productId) {
        //return services.callMethod('Product/OnShelve', { productId: productId });
        return this.putByJson(this.url('Product/OnShelve'), { productId });
    }
    offShelve(productId) {
        return this.putByJson(this.url('Product/OffShelve'), { productId });
        //return services.callMethod('Product/OffShelve', { productId: productId });
    }
    categories() {
        let url = this.url('Product/GetProductCategories');

        return this.getByJson<Category[]>(url);
    }
    addCategory(item: Category) {
        let url = this.url('Product/AddProductCategory');
        return this.postByJson(url, { model: item })
    }
    updateCategory(item: Category) {
        let url = this.url('Product/UpdateProductCategory');
        return this.putByJson(url, { model: item })
    }
    deleteCategory(id: string): Promise<any> {
        let url = this.url('Product/DeleteProductCategory');
        return this.deleteByJson(url, { id });
    }
    //==========================================
    // 品牌
    brands(args?: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Product/GetBrands');
        return this.getByJson<wuzhui.DataSourceSelectResult<Brand>>(url, args);
        // .then(o => {
        //     return o.dataItems;
        // });
    }
    addBrand(brand: Brand) {
        let url = this.url('Product/AddBrand');
        return this.postByJson(url, { model: brand });
    }
    updateBrand(brand: Brand) {
        let url = this.url('Product/UpdateBrand');
        return this.postByJson(url, { model: brand });
    }
    deleteBrand(brand: Brand) {
        let url = this.url('Product/DeleteBrand');
        return this.deleteByJson(url, { id: brand.Id });
    }
    //==========================================
    setStock(productId, quantity) {
        let url = this.url('Product/SetStock');
        return this.putByJson<any>(url, { productId: productId, quantity: quantity });
    }
    productStocks(productIds: string[]) {
        let url = this.url('Product/GetProductStocks');
        return this.getByJson<Array<{ ProductId: string, Quantity: number }>>(url, { productIds: productIds });
    }
    getBuyLimitedNumbers(productIds: string[]) {
        let url = this.url('Product/GetBuyLimitedNumbers');
        return this.getByJson<Array<{ ProductId: string, LimitedNumber: number }>>(url, { productIds: productIds });
    }
    buyLimited(productId, quantity) {
        let url = this.url('Product/SetBuyLimitedQuantity');
        return this.putByJson(url, { productId: productId, quantity: quantity });
    }
    // couponDataSource = new JData.WebDataSource(Service.config.shopUrl + 'ShoppingData/Select?source=Coupons&selection=Id,Title,Discount,Amount,ValidBegin,ValidEnd,ReceiveBegin,ReceiveEnd,\
    //                                                                      Remark,Picture,BrandNames,CategoryNames,ProductNames',
    //     Service.config.shopUrl + 'ShoppingData/Insert?source=Coupons',
    //     Service.config.shopUrl + 'Coupon/UpdateCoupon',
    //     Service.config.shopUrl + 'ShoppingData/Delete?source=Coupons');

    //===================================================
    // 优惠劵
    coupon(id) {
        let url = this.url('Coupon/GetCoupon');
        return this.getByJson<Coupon>(url, { id }).then((c) => {
            c.Ranges = c.Ranges || [];
            return c;
        });
    }
    coupons() {
        let url = this.url('Coupon/GetCoupons');
        return this.getByJson<Coupon[]>(url);
    }
    private addCoupon(coupon: Coupon) {
        let url = this.url('Coupon/AddCoupon');
        return this.postByJson(url, coupon).then(data => {
            Object.assign(coupon, data);
            return data;
        });
    }
    private updateCoupon(coupon: Coupon) {
        let url = this.url('Coupon/UpdateCoupon');
        return this.putByJson(url, coupon);
    }
    saveCoupon(coupon: Coupon) {
        let url = this.url('Coupon/SaveCoupon');
        return this.postByJson(url, { coupon });
    }
    deleteCoupon(coupon: Coupon) {
        let url = this.url('Coupon/DeleteCoupon');
        return this.deleteByJson(url, { id: coupon.Id });
    }
    couponCodes(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Coupon/GetCouponCodes');
        return this.getByJson<wuzhui.DataSourceSelectResult<any>>(url, args).then(result => {
            result.dataItems.forEach(o => {
                if (o.UsedDateTime)
                    o.UsedDateTime = new Date(o.UsedDateTime);

                o.ValidBegin = new Date(o.ValidBegin);
                o.ValidEnd = new Date(o.ValidEnd);
            })
            return result;
        });
    }
    generateCouponCode(couponId: string, count: number) {
        let url = this.url('Coupon/GenerateCouponCode');
        return this.postByJson(url, { couponId, count });
    }
    //===================================================
    getDefineProperties(defineId) {
        return this.getByJson('Product/GetDefineProperties', { defineId: defineId });
    }
    getProductArguments(argumentId) {
        return this.getByJson('Product/GetProductArguments', { argumentId: argumentId });
    }
    //================================================================
    // 运费
    freightSolutions() {
        return this.getByJson<Array<FreightSolution>>(this.url('Freight/GetFreightSolutions'));
    }
    deleteFreightSolution(dataItem) {
        return this.deleteByJson(this.url('Freight/DeleteFreightSolution'), dataItem);
    }
    updateFreightSolution(dataItem) {
        return this.putByJson(this.url('Freight/UpdateFreightSolution'), dataItem);
    }
    regionFreights(solutionId) {
        let url = `${Service.config.shopUrl}Freight/GetRegionFreights`
        return this.getByJson<Array<RegionFreight>>(url, { solutionId: solutionId });
    }
    setRegionFreight(id, freight, freeAmount) {
        let url = this.url('Freight/SetRegionFreight');
        return this.putByJson(url, { id: id, freight: freight, freeAmount: freeAmount });
    }
    productFreights(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Freight/GetProductFreights');
        return this.getByJson<wuzhui.DataSourceSelectResult<ProductFreight>>(url, args);
    }
    addProductFreight(productId: string, solutionId: string) {
        let url = this.url('Freight/AddProductFreight');
        return this.postByJson(url, { productId, solutionId });
    }
    cityFreight() {
        let url = this.url('Freight/GetCityFreight');
        return this.getByJson<CityFreight>(url);
    }
    updateCityFreight(item: CityFreight) {
        let url = this.url('Freight/UpdateCityFreight');
        return this.putByJson(url, { model: item });
    }
    //================================================================
    // 订单
    static orderStatusText(value: string) {
        switch (value) {
            case 'Confirmed':
                return '已确认';
            case 'Send':
                return '已发货';
            case 'WaitingForPayment':
                return '待付款';
            case 'Canceled':
                return '已取消';
            case 'Paid':
                return '已付款';
            case 'Received':
                return '已收货';
        }
        return value;
    }
    orders(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Order/GetOrders');
        return this.getByJson<wuzhui.DataSourceSelectResult<Order>>(url, args).then(result => {
            result.dataItems.forEach(c => c.StatusText = ShoppingService.orderStatusText(c.Status));
            return result;
        });
    }
    shipInfo(orderId: string) {
        let url = this.url('Order/GetShipInfo');
        return this.get<ShipInfo>(url, { orderId });
    }
    //================================================================
}


// module outlet {
//     export var dataSource = function () {
//         return new JData.WebDataSource(
//             Service.config.shopUrl + 'ShoppingData/Select?source=Outlets',
//             Service.config.shopUrl + 'ShoppingData/Insert?source=Outlets',
//             Service.config.shopUrl + 'ShoppingData/Update?source=Outlets',
//             Service.config.shopUrl + 'ShoppingData/Delete?source=Outlets'
//         );
//     }
// };

// var shopping = new ShoppingService();
// export default shopping;

