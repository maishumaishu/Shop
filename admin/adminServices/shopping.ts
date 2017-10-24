
// import Product = require('models/Product');
import { Service as Service } from 'adminServices/service';
// import mapping = require('knockout.mapping');

// let JData = window['JData'];


// export interface Product {
//     Id: string;
//     BuyLimitedNumber: number;
//     // ChildrenCount: number;
//     Name: string;
//     Unit: string;
//     OffShelve: boolean;
//     OldPrice: string;
//     Price: number;
//     CostPrice: string;
//     Introduce: string;
//     ImagePath: string;
//     ImagePaths: string[];
//     ImageCover: string;
//     Score: number;
//     ProductCategoryId: string,
//     BrandId: string,
//     SKU: string,
//     Stock: number;
//     ParentId: string,
//     Fields: { key: string, value: string }[],
//     Arguments: { key: string, value: string }[],
//     Title: string
// }



//===============================================
// 运费

export interface RegionFreight {
    Id: string,
    FreeAmount: number,
    Freight: number,
    RegionId: string,
    RegionName: string,
    SolutionId: string
}

export interface FreightSolution {
    Id: string,
    Name: string
}

export interface ProductFreight {
    Id: string,
    Name: string,
    ObjectId: string,
    ObjectType: string,
    SolutionId: string,
    SolutionName: string
}

export interface Order {
    Id: string,
    /** 订单日期 */
    OrderDate: Date,
    /** 付款人 */
    Consignee: string,
    /** 收货人地址 */
    ReceiptAddress: string,
    /** 状态 */
    Status: string,
    /** 状态文字 */
    StatusText: string,
    /** 序列号 */
    Serial: string,
    /** 运费 */
    Freight: number,
    /** 发票信息 */
    Invoice: string,
    /** 备注 */
    Remark: string,
    /** 合计金额 */
    Sum: number,
    OrderDetails: OrderDetail[]
}

export interface OrderDetail {
    Id: string,
    ProductName: string,
    Price: number,
    Unit: string,
    Quantity: number
}

export interface Coupon {
    Id: string,
    Title: string,
    Content: string,
    Discount: number,
    Amount: number,
    ValidBegin: Date,
    ValidEnd: Date,
    ProductIds?: string,
    CategoryIds?: string,
    BrandIds?: string
}

export interface CouponCode {
    Title: string,
    Content: string,
    UsedDateTime: Date,
    ValidBegin: Date,
    ValidEnd: Date,
}

export interface CityFreight {
    Id: string,
    /** 配送金额 */
    SendAmount: number,
    /** 运费 */
    Freight: number,
    /** 配送范围 */
    SendRadius: number,
}

export type Category = {
    Id: string, Name: string, ParentId?: string,
    SortNumber?: number, Remark?: string, Hidden?: boolean,
    ImagePath?: string
};

//===============================================

export class ShoppingService extends Service {
    url(path: string) {
        return `${Service.config.shopUrl}${path}`;
    }
    product(productId: string) {
        let url = Service.config.shopUrl + 'Product/GetProduct';
        let data = { productId: productId };
        return this.get<Product>(url, data).then((data) => {
            data.Fields = data.Fields || [];
            data.Arguments = data.Arguments || [];

            return data;
        });
    }
    products(args: wuzhui.DataSourceSelectArguments) {
        var url = this.url('Product/GetProducts');
        return this.get<wuzhui.DataSourceSelectResult<Product>>(url, args);
    }
    productsByIds(productIds: string[]) {
        var url = this.url('Product/GetProductsByIds');
        return this.getByJson<Product[]>(url, { ids: productIds }).then(items => {
            // items.forEach(o => o.ImagePath = imageUrl(o.ImagePath, 100));
            return productIds.map(id => items.filter(o => o.Id == id)[0]).filter(o => o != null);
        });
    }
    deleteProduct(id: string) {
        var url = this.url('Product/DeleteProduct');
        return this.deleteByJson(url, { id });
    }
    queryProducts(pageIndex: number, searchText?: string): Promise<{ TotalRowCount: number, DataItems: Array<Product> }> {

        var url = this.url('Product/GetProducts');
        if (searchText) {
            url = url + '?searchText=' + encodeURI(searchText);
        }

        var maximumRows = 10;
        var start = pageIndex * maximumRows;
        var args = { StartRowIndex: start, MaximumRows: maximumRows };
        return this.get<any>(url, args).then(function (result) {
            for (var i = 0; i < result.DataItems.length; i++) {
                // result.DataItems[i] = mapping.fromJS(result.DataItems[i], {}, new Product()); //translators.product(result.DataItems[i]);
            }

            return result;
        });
    }
    productChildren(parentId: string) {
        var url = this.url('Product/GetProducts');
        var args = { filter: `ParentId == Guid"${parentId}"` } as wuzhui.DataSourceSelectArguments;
        return this.get<wuzhui.DataSourceSelectResult<Product>>(url, args);
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

        return this.get<Category[]>(url);
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
        return this.get<wuzhui.DataSourceSelectResult<Brand>>(url, args).then(o => {
            return o.dataItems;
        });
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
    getProductStocks(productIds: string[]) {
        let url = this.url('Product/GetProductStocks');
        return this.get<Array<{ ProductId: string, Quantity: number }>>(url, { productIds: productIds });
    }
    getBuyLimitedNumbers(productIds: string[]) {
        let url = this.url('Product/GetBuyLimitedNumbers');
        return this.get<Array<{ ProductId: string, LimitedNumber: number }>>(url, { productIds: productIds });
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
    coupons() {
        let url = this.url('Coupon/GetCoupons');
        return this.get<Coupon[]>(url);
    }
    addCoupon(coupon: Coupon) {
        let url = this.url('Coupon/AddCoupon');
        return this.postByJson(url, coupon).then(data => {
            Object.assign(coupon, data);
            return data;
        });
    }
    updateCoupon(coupon: Coupon) {
        let url = this.url('Coupon/UpdateCoupon');
        return this.putByJson(url, coupon);
    }
    deleteCoupon(coupon: Coupon) {
        let url = this.url('Coupon/DeleteCoupon');
        return this.deleteByJson(url, { id: coupon.Id });
    }
    couponCodes(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Coupon/GetCouponCodes');
        return this.get<wuzhui.DataSourceSelectResult<any>>(url, args).then(result => {
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
        return this.get('Product/GetDefineProperties', { defineId: defineId });
    }
    getProductArguments(argumentId) {
        return this.get('Product/GetProductArguments', { argumentId: argumentId });
    }
    //================================================================
    // 运费
    freightSolutions() {
        return this.get<Array<FreightSolution>>(this.url('Freight/GetFreightSolutions'));
    }
    deleteFreightSolution(dataItem) {
        return this.deleteByJson(this.url('Freight/DeleteFreightSolution'), dataItem);
    }
    updateFreightSolution(dataItem) {
        return this.putByJson(this.url('Freight/UpdateFreightSolution'), dataItem);
    }
    regionFreights(solutionId) {
        let url = `${Service.config.shopUrl}Freight/GetRegionFreights`
        return this.get<Array<RegionFreight>>(url, { solutionId: solutionId });
    }
    setRegionFreight(id, freight, freeAmount) {
        let url = this.url('Freight/SetRegionFreight');
        return this.putByJson(url, { id: id, freight: freight, freeAmount: freeAmount });
    }
    productFreights(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Freight/GetProductFreights');
        return this.get<wuzhui.DataSourceSelectResult<ProductFreight>>(url, args);
    }
    addProductFreight(productId: string, solutionId: string) {
        let url = this.url('Freight/AddProductFreight');
        return this.postByJson(url, { productId, solutionId });
    }
    cityFreight() {
        let url = this.url('Freight/GetCityFreight');
        return this.get<CityFreight>(url);
    }
    updateCityFreight(item: CityFreight) {
        let url = this.url('Freight/UpdateCityFreight');
        return this.putByJson(url, { model: item });
    }
    //================================================================
    // 订单
    private orderStatusText(value: string) {
        switch (value) {
            case 'Confirmed':
                return 'confirm_text';
            case 'Send':
                return 'send_text';
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
        return this.get<wuzhui.DataSourceSelectResult<Order>>(url, args).then(result => {
            result.dataItems.forEach(c => c.StatusText = this.orderStatusText(c.Status));
            return result;
        });
    }
    // orderDetails(orderId: string) {
    //     let url = this.url('Order/GetOrderDetails');
    //     debugger;
    //     return this.get<OrderDetail[]>(url, { orderId });
    // }
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

var shopping = new ShoppingService();
export default shopping;

