define(["require", "exports", "./shopping", "./station", "admin/application", "wuzhui"], function (require, exports, shopping_1, station_1, application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let shopping = new shopping_1.ShoppingService();
    shopping.error.add((sender, err) => application_1.default.error.fire(application_1.default, err, application_1.default.currentPage));
    let station = new station_1.StationService();
    station.error.add((sender, err) => application_1.default.error.fire(application_1.default, err, application_1.default.currentPage));
    exports.pageData = new wuzhui.DataSource({
        primaryKeys: ['id'],
        select: (args) => station.pageList(args),
        insert: (item, args) => station.savePageData(item, args.isSystem),
        update: (item) => station.savePageData(item),
        delete: (item) => station.deletePageData(item.id)
    });
    exports.product = window['product_dataSource'] ||
        new wuzhui.DataSource({
            primaryKeys: ['Id'],
            select: (args) => shopping.products(args),
            delete: (item) => shopping.deleteProduct(item.Id),
            update: (item, args) => {
                args = args || {};
                return shopping.saveProduct({ product: item, parentId: args.parentId, id: args.id });
            }
        });
    window['product_dataSource'] = window['product_dataSource'] || exports.product;
});
