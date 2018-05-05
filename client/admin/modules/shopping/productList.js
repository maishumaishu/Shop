var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "admin/services/shopping", "admin/site", "admin/tips", "admin/siteMap", "admin/services/dataSource", "user/application", "user/siteMap", "ui", "clipboard", "wuzhui"], function (require, exports, shopping_1, site_1, tips_1, siteMap_1, dataSource_1, application_1, siteMap_2, ui, ClipboardJS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProductList extends React.Component {
        constructor(props) {
            super(props);
            this.state = { dataItem: {}, tab: 'all' };
            this.dataSource = dataSource_1.product;
        }
        copyProductUrl(product) {
            return __awaiter(this, void 0, void 0, function* () {
                var clipboard = new ClipboardJS('.btn', {
                    text: function () {
                        return 'none';
                    }
                });
            });
        }
        showRestrictionDialog(dataItem) {
            this.state.dataItem = dataItem;
            this.state.restriction = {
                productId: dataItem.Id,
                productName: dataItem.Name,
                unlimit: dataItem.BuyLimitedNumber == null,
                quantity: dataItem.BuyLimitedNumber
            };
            this.setState(this.state);
            ui.showDialog(this.restrictionDialog);
        }
        setBuyLimited(restriction) {
            let { shopping } = this.props;
            return shopping.buyLimited(restriction.productId, restriction.quantity)
                .then((result) => {
                let item = {
                    Id: restriction.productId,
                    BuyLimitedNumber: restriction.quantity
                };
                this.dataSource.updated.fire(this.dataSource, item);
                ui.hideDialog(this.restrictionDialog);
            });
        }
        showStockDialog(dataItem) {
            this.state.productStock = {
                productId: dataItem.Id,
                productName: dataItem.Name,
                unlimit: dataItem.Stock == null,
                stock: dataItem.Stock
            };
            this.setState(this.state);
            ui.showDialog(this.stockDialog);
        }
        setStock(productStock) {
            let { shopping } = this.props;
            return shopping.setStock(productStock.productId, productStock.stock)
                .then((data) => {
                let item = {
                    Id: productStock.productId,
                    Stock: productStock.stock
                };
                this.dataSource.updated.fire(this.dataSource, item);
                return data;
            });
        }
        offShelve(item) {
            let { shopping } = this.props;
            return shopping.offShelve(item.Id).then(() => {
                item.OffShelve = true;
                this.dataSource.updated.fire(this.dataSource, item);
            });
        }
        onShelve(item) {
            let { shopping } = this.props;
            return shopping.onShelve(item.Id).then(() => {
                item.OffShelve = (false);
                this.dataSource.updated.fire(this.dataSource, item);
            });
        }
        showChildren(parentId) {
            var rows = this.productTable.rows;
            var rowIndex;
            for (let i = 0; i < rows.length; i++) {
                var gridViewRow = wuzhui.Control.getControlByElement(rows[i]);
                if (gridViewRow == null || gridViewRow.rowType != wuzhui.GridViewRowType.Data)
                    continue;
                var dataItem = gridViewRow.dataItem;
                console.assert(dataItem != null);
                if (dataItem.Id == parentId) {
                    rowIndex = i;
                    break;
                }
            }
            let { shopping } = this.props;
            return shopping.productChildren(parentId).then((result) => {
                result.dataItems.forEach((o) => this.dataSource.inserted.fire(this.dataSource, o, rowIndex));
                return result;
            });
        }
        hideChildren(parentId) {
            var rows = this.productTable.rows;
            var children = [];
            for (let i = 0; i < rows.length; i++) {
                var gridViewRow = wuzhui.Control.getControlByElement(rows[i]);
                if (gridViewRow == null || gridViewRow.rowType != wuzhui.GridViewRowType.Data)
                    continue;
                var dataItem = gridViewRow.dataItem;
                console.assert(dataItem != null);
                if (dataItem.ParentId == parentId) {
                    children.push(dataItem);
                }
            }
            children.forEach(o => this.dataSource.deleted.fire(this.dataSource, o));
        }
        removeProduct(dataItem) {
            return this.dataSource.delete(dataItem);
        }
        componentDidMount() {
            let { shopping } = this.props;
            // let dataSource = this.dataSource;
            dataSource_1.product.selected.add((sender, args) => {
                let productIds = args.dataItems.map(o => o.Id);
                shopping.productStocks(productIds).then(data => {
                    data.map(o => ({ Id: o.ProductId, Stock: o.Quantity }))
                        .forEach(o => dataSource_1.product.updated.fire(dataSource_1.product, o));
                });
                shopping.getBuyLimitedNumbers(productIds).then(data => {
                    data.map(o => ({ Id: o.ProductId, BuyLimitedNumber: o.LimitedNumber }))
                        .forEach(o => dataSource_1.product.updated.fire(dataSource_1.product, o));
                });
            });
            let self = this;
            var gridView = new wuzhui.GridView({
                dataSource: dataSource_1.product,
                element: this.productTable,
                pagerSettings: { activeButtonClassName: 'active' },
                columns: [
                    new wuzhui.CustomField({
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewDataCell({
                                dataField: 'SortNumber',
                                render(value) {
                                    ReactDOM.render(h("a", { href: "javascript:", style: { width: 100 }, title: "点击修改序号" }, value), cell.element);
                                }
                            });
                            return cell;
                        },
                        headerText: '序号',
                        headerStyle: { textAlign: 'center' }
                    }),
                    new NameField(self),
                    new wuzhui.BoundField({
                        dataField: 'SKU', headerText: 'SKU',
                        headerStyle: { textAlign: 'center' }
                    }),
                    new wuzhui.BoundField({
                        dataField: 'ProductCategoryName', headerText: '类别',
                        headerStyle: { textAlign: 'center' },
                    }),
                    new wuzhui.CustomField({
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewDataCell({
                                dataField: 'OffShelve',
                                render(offShelve) {
                                    let className = offShelve ? 'btn btn-default btn-minier' : "btn btn-primary btn-minier";
                                    let text = offShelve ? '已下架' : '已上架';
                                    ReactDOM.render(h("div", null,
                                        h("button", { className: className, onClick: () => offShelve ? self.onShelve(dataItem) : self.offShelve(dataItem), title: offShelve ? tips_1.default.clickOnShelve : tips_1.default.clickOffShelve }, text)), cell.element);
                                }
                            });
                            return cell;
                        },
                        headerText: '上下架',
                        headerStyle: { textAlign: 'center', width: '60px' },
                        itemStyle: { textAlign: 'center' }
                    }),
                    new wuzhui.CustomField({
                        headerText: '库存',
                        headerStyle: { textAlign: 'center', width: '60px' },
                        itemStyle: { textAlign: 'center' },
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewDataCell({
                                dataField: 'Stock',
                                render(value) {
                                    ReactDOM.render(h("a", { href: "javascript:" }, value == null ? '无限' : value), cell.element);
                                }
                            });
                            cell.element.onclick = function () {
                                self.showStockDialog(dataItem);
                            };
                            return cell;
                        },
                    }),
                    new wuzhui.CustomField({
                        createItemCell(dataItem) {
                            let cell = new wuzhui.GridViewDataCell({
                                dataField: 'BuyLimitedNumber',
                                render(value) {
                                    ReactDOM.render(h("a", { href: "javascript:" }, value == null ? '不限' : value), cell.element);
                                }
                            });
                            cell.element.onclick = function () {
                                self.showRestrictionDialog(dataItem);
                            };
                            return cell;
                        },
                        headerText: '限购',
                        headerStyle: { textAlign: 'center', width: '60px' },
                        itemStyle: { textAlign: 'center' },
                    }),
                    new wuzhui.BoundField({
                        dataField: 'Price', headerText: '价格', dataFormatString: '￥{C2}',
                        headerStyle: { textAlign: 'center', width: '80px' },
                        itemStyle: { textAlign: 'right' }
                    }),
                    new OperationField(self)
                ],
                pageSize: 10
            });
        }
        switchTab(tab) {
            if (this.state.tab == tab)
                return;
            this.state.tab = tab;
            this.setState(this.state);
            if (tab == 'offShelve')
                this.dataSource.selectArguments.filter = 'OffShelve == true';
            else if (tab == 'onShelve')
                this.dataSource.selectArguments.filter = 'OffShelve != true';
            else
                this.dataSource.selectArguments.filter = null;
            this.dataSource.selectArguments.startRowIndex = 0;
            this.dataSource.select();
        }
        search() {
            this.dataSource.selectArguments['searchText'] = this.state.searchText;
            this.dataSource.select();
        }
        render() {
            let restriction = this.state.restriction;
            let productStock = this.state.productStock;
            let tab = this.state.tab;
            return (h("div", null,
                h("div", { name: "tabs", className: "tabbable" },
                    h("ul", { className: "nav nav-tabs" },
                        h("li", { className: tab == 'all' ? "active" : '', onClick: () => this.switchTab('all') },
                            h("a", { href: "javascript:" }, "\u5168\u90E8")),
                        h("li", { className: tab == 'onShelve' ? "active" : '', onClick: () => this.switchTab('onShelve') },
                            h("a", { href: "javascript:" }, "\u5DF2\u4E0A\u67B6")),
                        h("li", { className: tab == 'offShelve' ? "active" : '', onClick: () => this.switchTab('offShelve') },
                            h("a", { href: "javascript:" }, "\u5DF2\u4E0B\u67B6")),
                        h("li", { className: "pull-right" }),
                        h("li", { className: "pull-right" }),
                        h("li", { "data-bind": "visible:tabs.current() == 'all'", className: "pull-right" },
                            h("button", { onClick: () => site_1.app.redirect(siteMap_1.siteMap.nodes.shopping_product_productEdit), className: "btn btn-primary btn-sm pull-right" },
                                h("i", { className: "icon-plus" }),
                                h("span", null, "\u6DFB\u52A0")),
                            h("button", { className: "btn btn-primary btn-sm pull-right", onClick: () => this.search() },
                                h("i", { className: "icon-search" }),
                                h("span", null, "\u641C\u7D22")),
                            h("input", { type: "text", className: "form-control", style: { width: 300 }, placeholder: "请输入SKU或名称、类别", value: this.state.searchText, onChange: (e) => {
                                    this.state.searchText = e.target.value;
                                    this.setState(this.state);
                                } })))),
                h("table", { name: "productList", className: site_1.default.style.tableClassName, ref: (o) => this.productTable = o || this.productTable }),
                restriction ?
                    h("form", { className: "modal fade", ref: (o) => this.restrictionDialog = o || this.restrictionDialog },
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u4EA7\u54C1\u9650\u8D2D")),
                                h("div", { className: "modal-body" },
                                    h("div", { className: "form-group" },
                                        h("label", null, this.state.dataItem.Name)),
                                    h("div", { className: "form-group" },
                                        h("input", { type: "text", className: "form-control", placeholder: "请输入产品限购数量", disabled: restriction.unlimit, value: restriction.quantity == null ? '' : `${restriction.quantity}`, onChange: (e) => {
                                                let inputValue = e.target.value;
                                                if (inputValue)
                                                    restriction.quantity = Number.parseInt(inputValue);
                                                else
                                                    restriction.quantity = null;
                                                this.setState(this.state);
                                            } })),
                                    h("div", { className: "checkbox" },
                                        h("label", null,
                                            h("input", { checked: restriction.unlimit, type: "checkbox", className: "checkbox", style: { marginTop: 0 }, onChange: (e) => {
                                                    restriction.unlimit = e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            h("span", null, "\u4E0D\u9650\u6570\u91CF"))),
                                    h("div", { className: "modal-footer" },
                                        h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                        h("button", { type: "button", className: "btn btn-primary", ref: (e) => {
                                                if (!e)
                                                    return;
                                                e.onclick = ui.buttonOnClick(() => {
                                                    return this.setBuyLimited(restriction);
                                                });
                                            } }, "\u786E\u8BA4")))))) : null,
                productStock ?
                    h("form", { name: "productStock", className: "modal fade", ref: (o) => this.stockDialog = o || this.stockDialog },
                        h("div", { className: "modal-dialog" },
                            h("div", { className: "modal-content" },
                                h("div", { className: "modal-header" },
                                    h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                        h("span", { "aria-hidden": "true" }, "\u00D7"),
                                        h("span", { className: "sr-only" }, "Close")),
                                    h("h4", { className: "modal-title" }, "\u4EA7\u54C1\u5E93\u5B58")),
                                h("div", { className: "modal-body" },
                                    h("div", { className: "form-group" },
                                        h("label", null, productStock.productName)),
                                    h("div", { className: "form-group" },
                                        h("input", { type: "text", className: "form-control", placeholder: "请输入产品库存数量", value: productStock.stock == null ? '' : `${productStock.stock}`, disabled: productStock.unlimit, onChange: (e) => {
                                                let inputValue = e.target.value;
                                                if (inputValue)
                                                    productStock.stock = Number.parseInt(inputValue);
                                                else
                                                    productStock.stock = null;
                                                this.setState(this.state);
                                            } })),
                                    h("div", { className: "checkbox" },
                                        h("label", null,
                                            h("input", { "data-bind": "checked:unlimit", type: "checkbox", className: "checkbox", style: { marginTop: 0 }, checked: productStock.unlimit, onChange: (e) => {
                                                    productStock.unlimit = e.target.checked;
                                                    this.setState(this.state);
                                                } }),
                                            h("span", null, "\u4E0D\u9650\u5E93\u5B58"))),
                                    h("div", { className: "modal-footer" },
                                        h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                        h("button", { type: "button", className: "btn btn-primary", onClick: (e) => {
                                                this.setStock(productStock).then(() => {
                                                    ui.hideDialog(this.stockDialog);
                                                });
                                            } }, "\u786E\u8BA4")))))) : null));
        }
    }
    class NameField extends wuzhui.CustomField {
        constructor(page) {
            super({
                createItemCell(dataItem) {
                    let status = 'collapsed';
                    let cell = new wuzhui.GridViewDataCell({
                        dataField: 'Name',
                        render(value, element) {
                            ReactDOM.render(h("div", null,
                                h("span", null, value),
                                h("span", { style: { paddingLeft: 8 } }, (dataItem.Fields || []).map(o => h("span", { key: o.key, className: "badge badge-gray", style: { paddingTop: 3 } }, o.value)))), element);
                        }
                    });
                    return cell;
                },
                headerText: '名称',
                headerStyle: { textAlign: 'center' },
                itemStyle: { textAlign: 'left' },
            });
        }
    }
    class OperationField extends wuzhui.CustomField {
        constructor(page) {
            super({
                createItemCell(dataItem) {
                    let cell = new wuzhui.GridViewCell();
                    ReactDOM.render([
                        h("button", { key: 10, className: "btn btn-minier btn-success", title: tips_1.default.clickCopyProductURL, ref: (e) => {
                                if (!e)
                                    return;
                                var clipboard = new ClipboardJS(e, {
                                    text: function () {
                                        let pageName = siteMap_2.default.nodes.home_product.name;
                                        console.assert(pageName != null);
                                        var url = application_1.app.createUrl(pageName, { id: dataItem.Id });
                                        return url;
                                    }
                                });
                                clipboard.on('success', function (e) {
                                    ui.showToastMessage('商品链接已经成功复制');
                                });
                                clipboard.on('error', function (e) {
                                    ui.alert('商品链接已经成功失败');
                                });
                            } }, "\u5546\u54C1\u94FE\u63A5"),
                        h("button", { key: 20, className: "btn btn-minier btn-purple", title: tips_1.default.clickAddRegularProduct, onClick: () => site_1.app.redirect(siteMap_1.siteMap.nodes.shopping_product_productEdit, { parentId: dataItem.Id }) },
                            h("i", { className: "icon-copy" })),
                        h("button", { key: 30, className: "btn btn-minier btn-info", title: tips_1.default.clickEditProduct, onClick: () => { site_1.app.redirect(siteMap_1.siteMap.nodes.shopping_product_productEdit, { id: dataItem.Id }); } },
                            h("i", { className: "icon-pencil" })),
                        h("button", { key: 40, className: "btn btn-minier btn-danger", ref: (e) => {
                                if (!e)
                                    return;
                                e.onclick = ui.buttonOnClick(() => {
                                    return page.removeProduct(dataItem);
                                }, { confirm: `确定删除商品'${dataItem.Name}'吗？` });
                            } },
                            h("i", { className: "icon-trash" }))
                    ], cell.element);
                    return cell;
                },
                headerText: '操作',
                headerStyle: { textAlign: 'center', width: '210px' },
                itemStyle: { textAlign: 'center' }
            });
        }
    }
    function default_1(page) {
        let shopping = page.createService(shopping_1.ShoppingService);
        let element = document.createElement('div');
        page.element.appendChild(element);
        ReactDOM.render(h(ProductList, { shopping: shopping }), element);
    }
    exports.default = default_1;
});
