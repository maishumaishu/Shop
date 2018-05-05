define(["require", "exports", "site"], function (require, exports, site_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import { PageComponent, PageHeader, PageFooter, PageView } from 'mobileControls';
    function default_1(page) {
        let callback = page.data.callback;
        class InvoicePage extends React.Component {
            constructor(props) {
                super(props);
                this.state = { title: '', type: '个人' };
            }
            confirm() {
                if (callback) {
                    callback(`类型：${this.state.type}，抬头：${this.state.title}`);
                }
                site_1.app.back();
            }
            render() {
                let type = this.state.type;
                let title = this.state.title;
                return [
                    h("header", { key: "h" }, site_1.defaultNavBar(page, { title: '发票信息' })),
                    h("footer", { key: "f" },
                        h("div", { className: "container", style: { paddingTop: 10, paddingBottom: 10 } },
                            h("button", { onClick: () => this.confirm(), className: "btn btn-block btn-primary" }, "\u786E\u8BA4"))),
                    h("section", { key: "v" },
                        h("form", { className: "container" },
                            h("div", { style: { paddingTop: 20 } },
                                h("label", { className: "choose" },
                                    h("input", { name: "type", checked: type != '公司', type: "radio", onChange: () => {
                                            this.state.type = '个人';
                                            this.setState(this.state);
                                        } }),
                                    " \u4E2A\u4EBA")),
                            h("hr", null),
                            h("div", null,
                                h("label", { className: "choose" },
                                    h("input", { name: "type", checked: type == '公司', type: "radio", onChange: () => {
                                            this.state.type = '公司';
                                            this.setState(this.state);
                                        } }),
                                    " \u516C\u53F8")),
                            h("hr", null),
                            h("div", { className: "form-group" },
                                h("label", null, "\u53D1\u7968\u62AC\u5934"),
                                h("input", { value: title, type: "text", className: "form-control", placeholder: "个人或公司名称", onChange: (e) => {
                                        this.state.title = e.target.value;
                                        this.setState(this.state);
                                    } }))))
                ];
            }
        }
        ReactDOM.render(h(InvoicePage, null), page.element);
    }
    exports.default = default_1;
});
