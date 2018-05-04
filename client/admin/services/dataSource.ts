import { ShoppingService } from './shopping';
import { StationService } from './station';
import app from 'admin/application';
import 'wuzhui'

let shopping = new ShoppingService();
shopping.error.add((sender, err) => app.error.fire(app, err, app.currentPage));

let station = new StationService();
station.error.add((sender, err) => app.error.fire(app, err, app.currentPage));

export let pageData = new wuzhui.DataSource<PageData>({
    primaryKeys: ['id'],
    select: (args) => station.pageList(args),
    insert: (item, args: { isSystem }) => station.savePageData(item, args.isSystem),
    update: (item) => station.savePageData(item),
    delete: (item) => station.deletePageData(item.id)
})

export let product: wuzhui.DataSource<Product> = window['product_dataSource'] ||
    new wuzhui.DataSource<Product>({
        primaryKeys: ['Id'],
        select: (args) => shopping.products(args),
        delete: (item) => shopping.deleteProduct(item.Id),
        update: (item, args) => {
            args = args || {};
            return shopping.saveProduct({ product: item, parentId: args.parentId, id: args.id })
        }
    })

window['product_dataSource'] = window['product_dataSource'] || product;

