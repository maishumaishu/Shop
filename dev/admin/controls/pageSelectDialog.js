define(["require", "exports", "admin/services/dataSource", "css!admin/controls/pageSelectDialog"], function (require, exports, dataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PageSelectDialog extends React.Component {
        // dataSource: wuzhui.DataSource<PageData>;
        constructor(props) {
            super(props);
            let { station } = this.props;
            this.state = { items: [] };
            // this.dataSource = new wuzhui.DataSource({
            //     select: (args) => station.pageList(args)
            // })
            dataSource_1.pageData.selected.add((sender, data) => {
                this.state.items = data.dataItems;
                this.setState(this.state);
            });
        }
        show(callback) {
            dataSource_1.pageData.selectArguments.startRowIndex = 0;
            dataSource_1.pageData.select();
            ui.showDialog(this.element);
            this.callback = callback;
        }
        componentDidMount() {
            let pagingBar = new wuzhui.NumberPagingBar({
                dataSource: dataSource_1.pageData,
                element: this.pagingBarElement,
                pagerSettings: {
                    activeButtonClassName: 'active',
                    buttonWrapper: 'li',
                    buttonContainerWraper: 'ul',
                    showTotal: true
                },
            });
            let ul = this.pagingBarElement.querySelector('ul');
            ul.className = "pagination";
        }
        selecteItem(item) {
            if (!this.callback)
                return;
            this.callback(item);
            ui.hideDialog(this.element);
        }
        render() {
            let { items } = this.state;
            return h("div", { className: "page-select-dialog modal fade", ref: (e) => this.element = e || this.element },
                h("div", { className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", onClick: () => ui.hideDialog(this.element) },
                                h("span", { "aria-hidden": "true" }, "\u00D7")),
                            h("h4", { className: "modal-title" }, "\u9009\u62E9\u9875\u9762")),
                        h("div", { className: "modal-body" },
                            h("ul", null, items.map((o, i) => h("li", { key: i, className: "btn-link", title: "点击选择页面", onClick: () => this.selecteItem(o) }, o.name)))),
                        h("div", { className: "modal-footer", ref: (e) => this.pagingBarElement = e || this.pagingBarElement }))));
        }
    }
    exports.PageSelectDialog = PageSelectDialog;
});
