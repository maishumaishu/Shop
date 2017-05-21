
// import Product = require('models/Product');
import { Service as Service } from 'services/Service';
import mapping = require('knockout.mapping');

let JData = window['JData'];


export interface Product {
    Id: string;
    BuyLimitedNumber: number;
    // ChildrenCount: number;
    Name: string;
    // Unit: string;
    OffShelve: boolean;
    OldPrice: string;
    Price: number;
    CostPrice: string;
    Introduce: string;
    ImagePaths: string[];
    Score: number;
    ProductCategoryId: string,
    BrandId: string,
    SKU: string,
    Stock: number;
    ParentId: string,
    Fields: { key: string, value: string }[],
    Arguments: { key: string, value: string }[]
}

export interface Brand {
    Id: string;
    Name: string;
    Image: string;
}

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

//===============================================

class ShoppingService extends Service {
    url(path: string) {
        return `${Service.config.shopUrl}${path}`;
    }
    product(productId: string) {
        let url = Service.config.shopUrl + 'Product/GetProduct';
        let data = { productId: productId };
        return this.ajax<Product>({ url, data }).then((data) => {
            data.Fields = data.Fields || [];
            data.Arguments = data.Arguments || [];
            if (data.ImagePaths)
                data.ImagePaths = ((data as any).ImagePath as string).split(',');

            return data;
        });
    }
    getProducts(args: wuzhui.DataSourceSelectArguments) {
        var url = this.url('Product/GetProducts');
        return Service.get<any>(url, args);
    }
    getProductList(pageIndex: number, searchText?: string): Promise<{ TotalRowCount: number, DataItems: Array<Product> }> {

        var url = this.url('Product/GetProducts');
        if (searchText) {
            url = url + '?searchText=' + encodeURI(searchText);
        }

        var maximumRows = 10;
        var start = pageIndex * maximumRows;
        var args = { StartRowIndex: start, MaximumRows: maximumRows };
        return Service.get<any>(url, args).then(function (result) {
            for (var i = 0; i < result.DataItems.length; i++) {
                // result.DataItems[i] = mapping.fromJS(result.DataItems[i], {}, new Product()); //translators.product(result.DataItems[i]);
            }

            return result;
        });
    }
    productChildren(parentId: string) {
        var url = this.url('Product/GetProducts');
        var args = { filter: `ParentId == Guid"${parentId}"` } as wuzhui.DataSourceSelectArguments;
        return Service.get<wuzhui.DataSourceSelectResult<Product>>(url, args);
    }
    commonProduct(product) {
        alert(product.Id());
    }
    saveProduct(product: Product, parentId): Promise<{ Id: string }> {
        debugger;

        var obj: any = Object.assign({}, product);// ko.mapping.toJS(product, { ignore: ['ExtProperties'] });
        obj.parentId = parentId;
        obj.Arguments = JSON.stringify(product.Arguments) as any;
        obj.Fields = JSON.stringify(product.Fields) as any;
        if (!obj.Id) {
            product.Id = undefined;
            return Service.post(Service.config.shopUrl + 'Product/AddProduct', obj);
        }
        else {
            return Service.put(Service.config.shopUrl + 'Product/UpdateProduct', obj);
        }
    }
    removeProduct(productId) {
        return Service.callMethod('Product/DeleteProduct', { id: productId });
    }
    topProduct(productId) {
        return Service.callMethod('Product/ProductTop', { id: productId });
    }
    onShelve(productId) {
        //return services.callMethod('Product/OnShelve', { productId: productId });
        return Service.putByJson(this.url('Product/OnShelve'), { productId });
    }
    offShelve(productId) {
        return Service.putByJson(this.url('Product/OffShelve'), { productId });
        //return services.callMethod('Product/OffShelve', { productId: productId });
    }
    categories() {
        let url = this.url('Product/GetProductCategories');
        type Category = {
            Id: string, Name: string, ParentId?: string,
            SortNumber?: number, Remark?: string, Hidden?: boolean,
            ImagePath?: string
        };
        return Service.get<Category[]>(url);
    }
    //==========================================
    // 品牌
    brands(args?: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Product/GetBrands');
        return Service.get<wuzhui.DataSourceSelectResult<Brand>>(url, args).then(o => {
            return o.dataItems;
        });
    }
    addBrand(brand: Brand) {
        let url = this.url('Product/AddBrand');
        return Service.postByJson(url, { model: brand });
    }
    updateBrand(brand: Brand) {
        let url = this.url('Product/UpdateBrand');
        return Service.postByJson(url, { model: brand });
    }
    deleteBrand(brand: Brand) {
        let url = this.url('Product/DeleteBrand');
        return Service.delete(url, { id: brand.Id });
    }
    //==========================================
    setStock(productId, quantity) {
        let url = this.url('Product/SetStock');
        return Service.postByJson<any>(url, { productId: productId, quantity: quantity });
    }
    getProductStocks(productIds: string[]) {
        let url = this.url('Product/GetProductStocks');
        return Service.get<Array<{ ProductId: string, Quantity: number }>>(url, { productIds: productIds });
    }
    getBuyLimitedNumbers(productIds: string[]) {
        let url = this.url('Product/GetBuyLimitedNumbers');
        return Service.get<Array<{ ProductId: string, LimitedNumber: number }>>(url, { productIds: productIds });
    }
    buyLimited(productId, quantity) {
        return Service.postByJson('Product/SetBuyLimitedQuantity', { productId: productId, quantity: quantity });
    }
    couponDataSource = new JData.WebDataSource(Service.config.shopUrl + 'ShoppingData/Select?source=Coupons&selection=Id,Title,Discount,Amount,ValidBegin,ValidEnd,ReceiveBegin,ReceiveEnd,\
                                                                         Remark,Picture,BrandNames,CategoryNames,ProductNames',
        Service.config.shopUrl + 'ShoppingData/Insert?source=Coupons',
        Service.config.shopUrl + 'Coupon/UpdateCoupon',
        Service.config.shopUrl + 'ShoppingData/Delete?source=Coupons');

    //===================================================
    // 优惠劵
    coupons() {
        let url = this.url('Coupon/GetCoupons');
        return Service.get<Coupon[]>(url);
    }
    addCoupon(coupon: Coupon) {
        let url = this.url('Coupon/AddCoupon');
        return Service.postByJson(url, coupon).then(data => {
            Object.assign(coupon, data);
            return data;
        });
    }
    updateCoupon(coupon: Coupon) {
        let url = this.url('Coupon/UpdateCoupon');
        return Service.putByJson(url, coupon);
    }
    deleteCoupon(coupon: Coupon) {
        let url = this.url('Coupon/DeleteCoupon');
        return Service.delete(url, { id: coupon.Id });
    }
    couponCodes(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Coupon/GetCouponCodes');
        return Service.get<wuzhui.DataSourceSelectResult<any>>(url, args).then(result => {
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
        return Service.postByJson(url, { couponId, count });
    }
    //===================================================
    getDefineProperties(defineId) {
        return Service.callMethod('Product/GetDefineProperties', { defineId: defineId });
    }
    getProductArguments(argumentId) {
        return Service.callMethod('Product/GetProductArguments', { argumentId: argumentId });
    }
    //================================================================
    // 运费
    freightSolutions() {
        return Service.get<Array<FreightSolution>>(this.url('Freight/GetFreightSolutions'));
    }
    deleteFreightSolution(dataItem) {
        return Service.delete(this.url('Freight/DeleteFreightSolution'), dataItem);
    }
    updateFreightSolution(dataItem) {
        return Service.put(this.url('Freight/UpdateFreightSolution'), dataItem);
    }
    regionFreights(solutionId) {
        let url = `${Service.config.shopUrl}Freight/GetRegionFreights`
        return Service.get<Array<RegionFreight>>(url, { solutionId: solutionId });
    }
    setRegionFreight(id, freight, freeAmount) {
        let url = this.url('Freight/SetRegionFreight');
        return Service.put(url, { id: id, freight: freight, freeAmount: freeAmount });
    }
    productFreights(args: wuzhui.DataSourceSelectArguments) {
        let url = this.url('Freight/GetProductFreights');
        return Service.get<wuzhui.DataSourceSelectResult<ProductFreight>>(url, args);
    }
    addProductFreight(productId: string, solutionId: string) {
        let url = this.url('Freight/AddProductFreight');
        return Service.post(url, { productId, solutionId });
    }
    cityFreight() {
        let url = this.url('Freight/GetCityFreight');
        return Service.get<CityFreight>(url);
    }
    updateCityFreight(item: CityFreight) {
        let url = this.url('Freight/UpdateCityFreight');
        return Service.putByJson(url, { model: item });
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
        return Service.get<wuzhui.DataSourceSelectResult<Order>>(url, args).then(result => {
            result.dataItems.forEach(c => c.StatusText = this.orderStatusText(c.Status));
            return result;
        });
    }
    // orderDetails(orderId: string) {
    //     let url = this.url('Order/GetOrderDetails');
    //     debugger;
    //     return Service.get<OrderDetail[]>(url, { orderId });
    // }
    //================================================================
}


module outlet {
    export var dataSource = function () {
        return new JData.WebDataSource(
            Service.config.shopUrl + 'ShoppingData/Select?source=Outlets',
            Service.config.shopUrl + 'ShoppingData/Insert?source=Outlets',
            Service.config.shopUrl + 'ShoppingData/Update?source=Outlets',
            Service.config.shopUrl + 'ShoppingData/Delete?source=Outlets'
        );
    }
};

var shopping = new ShoppingService();
export default shopping;

