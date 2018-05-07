define(["require", "exports", "admin/services/shopping", "admin/application", "./imageThumber", "wuzhui"], function (require, exports, shopping_1, application_1, imageThumber_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['less!admin/controls/productSelectDialog']);
    class ProductSelectDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { products: null, selecteItems: [] };
            let shopping = new shopping_1.ShoppingService();
            shopping.error.add((sender, err) => application_1.default.error.fire(application_1.default, err, application_1.default.currentPage));
            // var shopping = this.props.shopping;
            this.dataSource = new wuzhui.DataSource({ select: (args) => shopping.products(args) });
            this.dataSource.selectArguments.maximumRows = 18;
            this.dataSource.selectArguments.filter = '!OffShelve';
            this.dataSource.selected.add((sender, args) => {
                this.state.products = args.dataItems;
                this.setState(this.state);
            });
        }
        static show(confirmSelectedProducts) {
            // this.confirmSelectedProducts = confirmSelectedProducts;
            // ui.showDialog(this.element);
            instance.confirmSelectedProducts = confirmSelectedProducts;
        }
        selecteProduct(p) {
            if (this.state.selecteItems.indexOf(p) >= 0) {
                this.state.selecteItems = this.state.selecteItems.filter(o => o != p);
            }
            else {
                this.state.selecteItems.push(p);
            }
            this.setState(this.state);
        }
        setPagingBar(e) {
            if (!e || wuzhui.Control.getControlByElement(e))
                return;
        }
        componentDidMount() {
            let pagingBar = new wuzhui.NumberPagingBar({
                dataSource: this.dataSource,
                element: this.pagingBarElement,
                pagerSettings: {
                    activeButtonClassName: 'active',
                    buttonWrapper: 'li',
                    buttonContainerWraper: 'ul',
                    showTotal: false,
                },
            });
            let ul = this.pagingBarElement.querySelector('ul');
            ul.className = "pagination";
            this.dataSource.select();
        }
        renderImage(e, src) {
            if (!e)
                return;
            ui.renderImage(e);
        }
        search(text) {
            this.dataSource.selectArguments["searchText"] = text || '';
            this.dataSource.select();
        }
        render() {
            let { products, selecteItems } = this.state;
            let status;
            if (products == null)
                status = 'loading';
            else if (products.length == 0)
                status = 'none';
            else
                status = 'finish';
            return (h("div", { className: "modal-dialog modal-lg" },
                h("div", { className: "modal-content" },
                    h("div", { className: "modal-header" },
                        h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(element) },
                            h("span", { "aria-hidden": "true" }, "\u00D7")),
                        h("h4", { className: "modal-title" }, "\u9009\u62E9\u5546\u54C1")),
                    h("div", { className: "modal-body" },
                        h("div", { className: "input-group" },
                            h("input", { type: "text", className: "form-control pull-right", placeholder: "请输入SKU或名称、类别", style: { width: '100%' }, ref: (e) => this.searchInput = e || this.searchInput }),
                            h("span", { className: "input-group-btn" },
                                h("button", { className: "btn btn-primary btn-sm pull-right", onClick: () => this.search(this.searchInput.value) },
                                    h("i", { className: "icon-search" }),
                                    h("span", null, "\u641C\u7D22")))),
                        h("hr", { className: "row" }),
                        status == 'loading' ?
                            h("div", { className: "loading" }, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D...") : null,
                        status == 'none' ?
                            h("div", { className: "norecords" }, "\u6682\u65E0\u5546\u54C1\u6570\u636E") : null,
                        status == 'finish' ?
                            h("div", { className: "products" }, products.map(p => {
                                let selected = selecteItems.indexOf(p) >= 0;
                                return h("div", { key: p.Id, className: "product col-lg-2", onClick: () => this.selecteProduct(p) },
                                    h(imageThumber_1.default, { imagePath: p.ImagePath, text: p.Name, selectedText: selecteItems.indexOf(p) >= 0 ? `${selecteItems.indexOf(p) + 1}` : '' }));
                            }))
                            : null,
                        h("div", { className: "clearfix" })),
                    h("div", { className: "modal-footer" },
                        h("div", { className: "paging-bar pull-left", ref: (e) => this.pagingBarElement = e || this.pagingBarElement }),
                        h("button", { name: "cancel", type: "button", className: "btn btn-default" }, "\u53D6\u6D88"),
                        h("button", { name: "ok", type: "button", className: "btn btn-primary", onClick: () => {
                                if (this.confirmSelectedProducts) {
                                    this.confirmSelectedProducts(selecteItems);
                                }
                                ui.hideDialog(element);
                            } }, "\u786E\u5B9A")))));
        }
    }
    exports.ProductSelectDialog = ProductSelectDialog;
    let element = document.createElement('div');
    element.className = 'product-select-dialog modal fade';
    document.body.appendChild(element);
    let instance = ReactDOM.render(h(ProductSelectDialog, null), element);
});
