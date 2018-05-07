var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "user/services/service"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ShoppingService extends service_1.Service {
        constructor() {
            super();
            this.counties = (cityId) => {
                var result = this.getByJson(this.url('Address/GetCounties'), { cityId: cityId });
                return result;
            };
        }
        url(path) {
            return `UserShop/${path}`;
        }
        /**
         * 获取单个商品
         * @param productId 商品编号
         */
        product(productId) {
            let url = this.url('Product/GetProduct');
            return this.getByJson(url, { productId })
                .then(product => this.processProduct(product));
        }
        productByProperies(groupId, properties) {
            var d = { groupId, filter: JSON.stringify(properties) };
            return this.getByJson(this.url('Product/GetProductByPropertyFilter'), d)
                .then(o => this.processProduct(o));
        }
        processProduct(product) {
            // if (!product.ImagePaths && product.ImagePath != null) {
            //     product.ImagePaths = product.ImagePath.split(',').map(o => imageUrl(o));
            // }
            // product.ImagePaths = product.ImagePaths || [];
            // product.ImagePath = product.ImagePaths[0];
            product.Arguments = product.Arguments || [];
            product.Fields = product.Fields || [];
            return product;
        }
        productIntroduce(productId) {
            let url = this.url('Product/GetProductIntroduce');
            return this.getByJson(url, { productId }).then(o => o.Introduce);
        }
        products(categoryId, pageIndex) {
            if (typeof categoryId == 'number') {
                pageIndex = categoryId;
                categoryId = null;
            }
            let url = this.url('Product/GetProducts');
            var args = { startRowIndex: pageIndex * service_1.config.pageSize };
            if (categoryId != null) {
                args.filter = `ProductCategoryId=Guid.Parse('${categoryId}')`;
            }
            let result;
            return this.getByJson(url, args).then(o => {
                let ids = o.Products.map(a => a.Id);
                return this.productStocks(ids).then((a) => {
                    for (let i = 0; i < o.Products.length; i++) {
                        let stockRecord = a.filter(c => c.ProductId == o.Products[i].Id)[0];
                        if (stockRecord) {
                            o.Products[i].Stock = stockRecord.Quantity;
                        }
                    }
                    return o.Products;
                });
            });
        }
        productStocks(productIds) {
            let url = this.url('Product/GetProductStocks');
            return this.getByJson(url, { productIds: productIds });
        }
        productsByIds(productIds) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!productIds || productIds.length == 0)
                    return [];
                var url = this.url('Product/GetProductsByIds');
                var arr = yield Promise.all([this.getByJson(url, { ids: productIds }), this.productStocks(productIds)]);
                let products = arr[0];
                let stcokRecords = arr[1];
                products.forEach(item => {
                    let stockRecord = stcokRecords.filter(o => o.ProductId == item.Id)[0];
                    if (stockRecord)
                        item.Stock = stockRecord.Quantity;
                });
                let dic = {};
                products.forEach(o => dic[o.Id] = o);
                let result = productIds.map(o => dic[o]).filter(o => o != null);
                return result;
            });
        }
        /**
         *
         * @param count 要获取商品的最多数量
         */
        productsByCategory(count, categoryId) {
            var args = { startRowIndex: 0, maximumRows: count };
            if (categoryId != null) {
                args.filter = `ProductCategoryId=Guid.Parse('${categoryId}')`;
            }
            let url = this.url('Product/GetProducts');
            return this.getByJson(url, args).then(o => {
                // o.Products.forEach(o => {
                //     o.ImagePath = imageUrl(o.ImagePath);
                // });
                return o.Products;
            });
        }
        category(categoryId) {
            let url = this.url('Product/GetCategory');
            return this.getByJson(url, { categoryId });
        }
        categories() {
            let url = this.url('Product/GetCategories');
            return this.getByJson(url);
        }
        toCommentProducts() {
            var result = this.getByJson(this.url('Product/GetToCommentProducts'))
                .then(items => {
                items.forEach(o => o.ImageUrl = service_1.imageUrl(o.ImageUrl));
                return items;
            });
            return result;
        }
        commentedProducts() {
            var result = this.getByJson(this.url('Product/GetCommentedProducts'))
                .then(items => {
                items.forEach(o => o.ImageUrl = service_1.imageUrl(o.ImageUrl));
                return items;
            });
            return result;
        }
        //=====================================================================
        // 收藏夹
        favorProducts() {
            return this.getByJson(this.url('Product/GetFavorProducts')).then(items => {
                items.forEach(o => o.ImageUrl = service_1.imageUrl(o.ImageUrl));
                return items;
            });
        }
        unfavorProduct(productId) {
            return this.postByJson(this.url('Product/UnFavorProduct'), { productId });
        }
        isFavored(productId) {
            return this.getByJson(this.url('Product/IsFavored'), { productId });
        }
        favorProduct(productId) {
            return this.postByJson(this.url('Product/FavorProduct'), { productId });
        }
        //=====================================================================
        // 订单
        // balancePay(orderId: string, amount: number) {
        //     type TResult = { Id: string, Amount: number, BalanceAmount: number };
        //     return this.post<TResult>(this.url('Order/BalancePay'), { orderId: orderId, amount: amount });
        // }
        confirmOrder(orderId, remark, invoice) {
            let args = { orderId, remark, invoice };
            var result = this.postByJson(this.url('Order/ConfirmOrder'), args);
            return result;
        }
        myOrderList(pageIndex, type) {
            let args = {};
            args.startRowIndex = service_1.config.pageSize * pageIndex;
            args.maximumRows = service_1.config.pageSize;
            if (type)
                args.filter = `Status="${type}"`;
            return this.getByJson(this.url('Order/GetMyOrderList'), args)
                .then(orders => {
                orders.forEach(o => {
                    o.OrderDetails.forEach(c => c.ImageUrl = service_1.imageUrl(c.ImageUrl));
                });
                return orders;
            });
        }
        order(orderId) {
            return this.getByJson(this.url('Order/GetOrder'), { orderId }).then(o => {
                o.OrderDetails.forEach(c => c.ImageUrl = service_1.imageUrl(c.ImageUrl));
                return o;
            });
        }
        createOrder(productIds, quantities) {
            var result = this.postByJson(this.url('Order/CreateOrder'), { productIds: productIds, quantities: quantities })
                .then(function (order) {
                return order;
            });
            return result;
        }
        cancelOrder(orderId) {
            let url = this.url('Order/CancelOrder');
            return this.putByJson(url, { orderId });
        }
        ordersSummary() {
            return this.getByJson(this.url('Order/GetOrdersSummary'));
        }
        changeReceipt(orderId, receiptId) {
            var result = this.postByJson(this.url('Order/ChangeReceipt'), { orderId, receiptId });
            return result;
        }
        orderStatusText(status) {
            switch (status) {
                case 'Created':
                    return '已创建';
                case 'WaitingForPayment':
                    return '待付款';
                case 'Paid':
                    return '已付款';
                case 'Send':
                    return '已发货';
                case 'Received':
                    return '已收货';
                case 'Canceled':
                    return '已取消';
                case 'WaitingForSend':
                    return '待发货';
                case 'Evaluated':
                    return '已评价';
            }
        }
        //=====================================================================
        // 优惠券
        couponStatusText(status) {
            switch (status) {
                case 'available':
                    return '未使用';
                case 'used':
                    return '已使用';
                case 'expired':
                    return '已过期';
                default:
                    return '';
            }
        }
        /** 获取个人优惠码 */
        myCoupons(pageIndex, status) {
            let url = this.url('Coupon/GetMyCoupons');
            return this.getByJson(url, { pageIndex, status });
        }
        storeCoupons() {
            let url = this.url('Coupon/GetCoupons');
            return this.getByJson(url);
        }
        /** 领取优惠卷 */
        receiveCoupon(couponId) {
            let url = this.url('Coupon/ReceiveCouponCode');
            return this.postByJson(url, { couponId });
        }
        /** 获取订单可用的优惠劵 */
        orderAvailableCoupons(orderId) {
            let url = this.url('Coupon/GetAvailableCouponCodes');
            return this.getByJson(url, { orderId });
        }
        /** 获取店铺优惠劵数量 */
        storeCouponsCount() {
            let url = this.url('Coupon/GetStoreCouponsCount');
            return this.getByJson(url, {});
        }
        resizeImage(img, max_width, max_height) {
            var canvas = document.createElement('canvas');
            var width = img.width;
            var height = img.height;
            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > max_width) {
                    height = Math.round(height *= max_width / width);
                    width = max_width;
                }
            }
            else {
                if (height > max_height) {
                    width = Math.round(width *= max_height / height);
                    height = max_height;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL("/jpeg", 0.7);
        }
        /**
         * 评价晒单
         * @param score: 评分
         * @param evaluation: 评价
         * @param anonymous: 是否匿名评价
         * @param imageDatas: 多个上传的图片，用 ',' 连接
         * @param imageThumbs: 多个缩略图，用 ',' 连接
         */
        evaluateProduct(orderDetailId, score, evaluation, anonymous, imageDatas) {
            //let imageString = imageDatas.join(',');
            let imageThumbs = imageDatas.map(o => {
                var image = new Image();
                image.src = o;
                return this.resizeImage(image, 200, 200);
            });
            var data = {
                orderDetailId, evaluation,
                score, anonymous,
                imageDatas: imageDatas.join(','),
                imageThumbs: imageThumbs.join(','),
            };
            var result = this.postByJson(this.url('Product/EvaluateProduct'), data);
            return result;
        }
        //=====================================================================
        // Address
        receiptInfos() {
            return this.getByJson(this.url('Address/GetReceiptInfos'));
        }
        receiptInfo(id) {
            return this.getByJson(this.url('Address/GetReceiptInfo'), { id })
                .then(o => {
                o.RegionId = o.CountyId;
                return o;
            });
        }
        provinces() {
            var result = this.getByJson(this.url('Address/GetProvinces'));
            return result;
        }
        cities(province) {
            var guidRule = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (guidRule.test(province))
                return this.getByJson(this.url('Address/GetCities'), { provinceId: province });
            return this.getByJson(this.url('Address/GetCities'), { provinceName: province });
            ;
        }
        saveReceiptInfo(receiptInfo) {
            return __awaiter(this, void 0, void 0, function* () {
                var self = this;
                let url = this.url('Address/SaveReceiptInfo');
                var result = yield this.postByJson(url, receiptInfo);
                Object.assign(receiptInfo, result);
                return result;
            });
        }
        setDefaultReceiptInfo(receiptInfoId) {
            let url = this.url('Address/SetDefaultReceiptInfo');
            return this.putByJson(url, { receiptInfoId });
        }
        deleteReceiptInfo(receiptInfoId) {
            let url = this.url('Address/DeleteReceiptInfo');
            return this.deleteByJson(url, { receiptInfoId });
        }
    }
    exports.ShoppingService = ShoppingService;
});
