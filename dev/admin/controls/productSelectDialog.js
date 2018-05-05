define(["require", "exports", "admin/services/service", "wuzhui"], function (require, exports, service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    requirejs(['css!admin/controls/productSelectDialog']);
    class ProductSelectDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { products: null, selecteItems: [] };
            var shopping = this.props.shopping;
            this.dataSource = new wuzhui.DataSource({ select: (args) => shopping.products(args) });
            this.dataSource.selectArguments.maximumRows = 18;
            this.dataSource.selectArguments.filter = '!OffShelve';
            this.dataSource.selected.add((sender, args) => {
                this.state.products = args.dataItems;
                this.setState(this.state);
            });
        }
        show(onProductSelected) {
            this.onProductSelected = onProductSelected;
            ui.showDialog(this.element);
        }
        selecteProduct(p) {
            if (this.state.selecteItems.indexOf(p) >= 0) {
                this.state.selecteItems = this.state.selecteItems.filter(o => o != p);
            }
            else {
                this.state.selecteItems.push(p);
            }
            this.setState(this.state);
            // if (!this.props.selected)
            //     return;
            // let result = this.onProductSelected(p) || Promise.resolve();
            // result.then(() => ui.hideDialog(this.element));
            // var isOK = true;
            // if (this.props.selected) {
            // isOK = this.props.selected(p);
            // }
            // if (!isOK)
            //     return;
            // ui.hideDialog(this.element);
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
                    buttonContainerWraper: 'ul'
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
            // let c: Product[][];
            // if (products != null) {
            //     let products1 = products.filter((o, i) => i <= 5);
            //     let products2 = products.filter((o, i) => i >= 6 && i <= 11);
            //     let products3 = products.filter((o, i) => i >= 12 && i <= 17);
            //     c = [products1, products2, products3].filter(o => o && o.length > 0);
            // }
            let status;
            if (products == null)
                status = 'loading';
            else if (products.length == 0)
                status = 'none';
            else
                status = 'finish';
            return (h("div", { className: "product-select-dialog modal fade", ref: (e) => this.element = e || this.element },
                h("div", { className: "modal-dialog modal-lg" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(this.element) },
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
                                        selected ? h("div", { className: "triangle" }) : null,
                                        h("img", { className: `img-responsive ${selected ? 'selected' : ''}`, src: service_1.imageUrl(p.ImagePath, 150, 150), ref: (e) => e ? ui.renderImage(e, { imageSize: { width: 150, height: 150 } }) : null }),
                                        h("div", { className: "interception" }, p.Name));
                                }))
                                : null,
                            h("div", { className: "clearfix" })),
                        h("div", { className: "modal-footer" },
                            h("div", { className: "paging-bar", ref: (e) => this.pagingBarElement = e || this.pagingBarElement }))))));
        }
    }
    exports.ProductSelectDialog = ProductSelectDialog;
});
