define(["require", "exports", "site", "user/services/shoppingService", "user/controls/imageFileSelector"], function (require, exports, site_1, shoppingService_1, imageFileSelector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function default_1(page) {
        let shop = page.createService(shoppingService_1.ShoppingService);
        class Start extends React.Component {
            constructor(props) {
                super(props);
                this.state = { selected: this.props.selected };
            }
            get selected() {
                return this.state.selected;
            }
            render() {
                let selected = this.state.selected;
                return (h("i", { className: selected ? "icon-star" : 'icon-star-empty', onClick: () => {
                        this.state.selected = !this.state.selected;
                        this.setState(this.state);
                    } }));
            }
        }
        const minWordCount = 10, maxWordCount = 100;
        let starts = new Array();
        let startObjects = new Array();
        for (let i = 0; i < 5; i++) {
            starts.push(h(Start, { ref: o => startObjects.push(o), key: i, selected: true }));
        }
        class ProductEvaluate extends React.Component {
            constructor(props) {
                super(props);
                this.state = { evaluation: '', anonymous: true };
            }
            submit() {
                let score = startObjects.filter(o => o.selected).length;
                let { evaluation, anonymous } = this.state;
                let imageDatas = this.imageFileSelector.imageDatas; //.join(',');
                shop.evaluateProduct(orderDetailId, score, evaluation, anonymous, imageDatas);
                return Promise.resolve();
            }
            componentDidMount() {
            }
            render() {
                let evaluation = this.state.evaluation || '';
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '商品评价' })),
                    h("footer", { key: "f" },
                        h("div", { className: "container", style: { paddingTop: 10, paddingBottom: 10, height: 50 } },
                            h("button", { className: "btn btn-primary btn-block", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = ui.buttonOnClick(() => this.submit(), { confirm: '确定要发表评价吗？' });
                                } }, "\u63D0\u4EA4"))),
                    h("section", { key: "v" },
                        h("div", { className: "container" },
                            h("div", { className: "row" },
                                h("div", { className: "col-xs-4" },
                                    h("img", { src: this.props.productImageUrl, className: "img-responsive img-thumbnail" })),
                                h("div", { className: "col-xs-8", style: { paddingLeft: 0 } },
                                    h("label", null, "\u8BC4\u5206"),
                                    h("div", null, starts))),
                            h("div", { className: "row evaluation" },
                                h("div", { className: "col-xs-12" },
                                    h("textarea", { className: "form-control", placeholder: `长度在${minWordCount}至${maxWordCount}字之间`, value: evaluation, onChange: (e) => {
                                            this.state.evaluation = e.target.value;
                                            this.setState(this.state);
                                        } }),
                                    h("div", { className: "word-num" }, maxWordCount - evaluation.length))),
                            h("div", { className: "row anonymous" },
                                h("div", { className: "col-xs-12 checkbox" },
                                    h("label", null,
                                        h("input", { checked: this.state.anonymous, type: "checkbox", onChange: (e) => {
                                                this.state.anonymous = !this.state.anonymous;
                                                this.setState(this.state);
                                            } }),
                                        "\u533F\u540D\u8BC4\u4EF7"))),
                            h("div", { className: "row pictures" },
                                h("div", { className: "col-xs-12" },
                                    h(imageFileSelector_1.ImageFileSelector, { ref: (o) => this.imageFileSelector = o })))))
                ];
            }
        }
        let { orderDetailId, productImageUrl } = page.data;
        ReactDOM.render(h(ProductEvaluate, { orderDetailId: orderDetailId, productImageUrl: productImageUrl }), page.element);
    }
    exports.default = default_1;
});
