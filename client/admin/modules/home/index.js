define(["require", "exports", "share/common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IndexPage extends React.Component {
        render() {
            return [
                h("h1", { key: "title", className: "text-center", style: { paddingBottom: 50, paddingTop: 10 } },
                    "\u6B22\u8FCE\u4F7F\u7528",
                    common_1.shopName),
                h("div", { key: "row1", className: "row" },
                    h("div", { className: "col-sm-4" },
                        h("ul", { className: "list-group" },
                            h("li", { className: "list-group-item list-group-item-success", style: { fontWeight: 'bold' } }, "\u4ECA\u65E5\u6CE8\u518C\u7528\u6237"),
                            h("li", { className: "list-group-item" }, "\u5F20\u4E09"),
                            h("li", { className: "list-group-item" }, "\u674E\u56DB"))),
                    h("div", { className: "col-sm-4" },
                        h("ul", { className: "list-group" },
                            h("li", { className: "list-group-item list-group-item-success", style: { fontWeight: 'bold' } }, "\u4ECA\u65E5\u8BA2\u5355"),
                            h("li", { className: "list-group-item" }, "\u5F20\u4E09"),
                            h("li", { className: "list-group-item" }, "\u674E\u56DB"))),
                    h("div", { className: "col-sm-4" },
                        h("ul", { className: "list-group" },
                            h("li", { className: "list-group-item list-group-item-success", style: { fontWeight: 'bold' } }, "\u4ECA\u65E5\u8BA2\u5355"),
                            h("li", { className: "list-group-item" }, "\u5F20\u4E09"),
                            h("li", { className: "list-group-item" }, "\u674E\u56DB"))))
            ];
        }
    }
    function default_1(page) {
        ReactDOM.render(h(IndexPage, null), page.element);
    }
    exports.default = default_1;
});
