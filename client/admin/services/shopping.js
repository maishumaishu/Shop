var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShoppingService extends service_1.Service {
        url(path) {
            return `${service_1.Service.config.shopUrl}${path}`;
        }
        product(productId) {
            return __awaiter(this, void 0, void 0, function* () {
                let url = service_1.Service.config.shopUrl + 'Product/GetProduct';
                let arr = yield Promise.all([this.getByJson(url, { productId }), this.productStocks([productId])]);
                let data = arr[0];
                data.Stock = arr[1][0] != null ? arr[1][0].Quantity : null;
                data.Fields = data.Fields || [];
                data.Arguments = data.Arguments || [];
                return data;
            });
        }
        products(args) {
            return __awaiter(this, void 0, void 0, function* () {
                var url = this.url('Product/GetProducts');
                let result = yield this.getByJson(url, args);
                result.dataItems.forEach(o => {
                    o.Stock = null;
                    o.BuyLimitedNumber = null;
                });
                return result;
            });
        }
        productsByIds(productIds) {
            return __awaiter(this, void 0, void 0, function* () {
                var url = this.url('Product/GetProductsByIds');
                let items = yield this.getByJson(url, { ids: productIds }); //.then(items => {
                let dic = {};
                items.filter(o => o != null).forEach(o => dic[o.Id] = o);
                let products = productIds.map(id => dic[id]).filter(o => o != null);
                return products;
            });
        }
        deleteProduct(id) {
            var url = this.url('Product/DeleteProduct');
            return this.deleteByJson(url, { id });
        }
        productChildren(parentId) {
            var url = this.url('Product/GetProducts');
            var args = { filter: `ParentId == Guid"${parentId}"` };
            return this.getByJson(url, args);
        }
        commonProduct(product) {
            alert(product.Id());
        }
        saveProduct(args) {
            return __awaiter(this, void 0, void 0, function* () {
                let { product, parentId, id } = args;
                var obj = Object.assign({}, product);
                obj.Arguments = JSON.stringify(product.Arguments);
                obj.Fields = JSON.stringify(product.Fields);
                // obj.ImagePaths = (product.ImagePaths || []).join(',') as any;
                obj.Unit = obj.Unit || '件';
                let result = yield this.postByJson(service_1.Service.config.shopUrl + 'Product/SaveProduct', { model: obj, parentId, id });
                Object.assign(product, result);
                return result;
            });
        }
        removeProduct(productId) {
            let url = service_1.Service.config.shopUrl + 'Product/DeleteProduct';
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
            return this.getByJson(url);
        }
        addCategory(item) {
            let url = this.url('Product/AddProductCategory');
            return this.postByJson(url, { model: item });
        }
        updateCategory(item) {
            let url = this.url('Product/UpdateProductCategory');
            return this.putByJson(url, { model: item });
        }
        deleteCategory(id) {
            let url = this.url('Product/DeleteProductCategory');
            return this.deleteByJson(url, { id });
        }
        //==========================================
        // 品牌
        brands(args) {
            let url = this.url('Product/GetBrands');
            return this.getByJson(url, args);
            // .then(o => {
            //     return o.dataItems;
            // });
        }
        addBrand(brand) {
            let url = this.url('Product/AddBrand');
            return this.postByJson(url, { model: brand });
        }
        updateBrand(brand) {
            let url = this.url('Product/UpdateBrand');
            return this.postByJson(url, { model: brand });
        }
        deleteBrand(brand) {
            let url = this.url('Product/DeleteBrand');
            return this.deleteByJson(url, { id: brand.Id });
        }
        //==========================================
        setStock(productId, quantity) {
            let url = this.url('Product/SetStock');
            return this.putByJson(url, { productId: productId, quantity: quantity });
        }
        productStocks(productIds) {
            let url = this.url('Product/GetProductStocks');
            return this.getByJson(url, { productIds: productIds });
        }
        getBuyLimitedNumbers(productIds) {
            let url = this.url('Product/GetBuyLimitedNumbers');
            return this.getByJson(url, { productIds: productIds });
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
            return this.getByJson(url, { id }).then((c) => {
                c.Ranges = c.Ranges || [];
                return c;
            });
        }
        coupons() {
            let url = this.url('Coupon/GetCoupons');
            return this.getByJson(url);
        }
        addCoupon(coupon) {
            let url = this.url('Coupon/AddCoupon');
            return this.postByJson(url, coupon).then(data => {
                Object.assign(coupon, data);
                return data;
            });
        }
        updateCoupon(coupon) {
            let url = this.url('Coupon/UpdateCoupon');
            return this.putByJson(url, coupon);
        }
        saveCoupon(coupon) {
            let url = this.url('Coupon/SaveCoupon');
            return this.postByJson(url, { coupon });
        }
        deleteCoupon(coupon) {
            let url = this.url('Coupon/DeleteCoupon');
            return this.deleteByJson(url, { id: coupon.Id });
        }
        couponCodes(args) {
            let url = this.url('Coupon/GetCouponCodes');
            return this.getByJson(url, args).then(result => {
                result.dataItems.forEach(o => {
                    if (o.UsedDateTime)
                        o.UsedDateTime = new Date(o.UsedDateTime);
                    o.ValidBegin = new Date(o.ValidBegin);
                    o.ValidEnd = new Date(o.ValidEnd);
                });
                return result;
            });
        }
        generateCouponCode(couponId, count) {
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
            return this.getByJson(this.url('Freight/GetFreightSolutions'));
        }
        deleteFreightSolution(dataItem) {
            return this.deleteByJson(this.url('Freight/DeleteFreightSolution'), dataItem);
        }
        updateFreightSolution(dataItem) {
            return this.putByJson(this.url('Freight/UpdateFreightSolution'), dataItem);
        }
        regionFreights(solutionId) {
            let url = `${service_1.Service.config.shopUrl}Freight/GetRegionFreights`;
            return this.getByJson(url, { solutionId: solutionId });
        }
        setRegionFreight(id, freight, freeAmount) {
            let url = this.url('Freight/SetRegionFreight');
            return this.putByJson(url, { id: id, freight: freight, freeAmount: freeAmount });
        }
        productFreights(args) {
            let url = this.url('Freight/GetProductFreights');
            return this.getByJson(url, args);
        }
        addProductFreight(productId, solutionId) {
            let url = this.url('Freight/AddProductFreight');
            return this.postByJson(url, { productId, solutionId });
        }
        cityFreight() {
            let url = this.url('Freight/GetCityFreight');
            return this.getByJson(url);
        }
        updateCityFreight(item) {
            let url = this.url('Freight/UpdateCityFreight');
            return this.putByJson(url, { model: item });
        }
        //================================================================
        // 订单
        static orderStatusText(value) {
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
        orders(args) {
            let url = this.url('Order/GetOrders');
            return this.getByJson(url, args).then(result => {
                result.dataItems.forEach(c => c.StatusText = ShoppingService.orderStatusText(c.Status));
                return result;
            });
        }
        shipInfo(orderId) {
            let url = this.url('Order/GetShipInfo');
            return this.get(url, { orderId });
        }
    }
    exports.ShoppingService = ShoppingService;
});
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
