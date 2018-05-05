define(["require", "exports", "components/common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const defaultEmptyText = '请设置 HTML';
    class HtmlControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.loadControlCSS();
        }
        get persistentMembers() {
            return ["html"];
        }
        _render(h) {
            let { html } = this.state;
            if (!html) {
                let emptyText = this.props.emptyText || defaultEmptyText;
                html = `<div class="text-center" style="padding:20px 0 20px 0">${emptyText}</div>`;
            }
            return h("div", { dangerouslySetInnerHTML: { __html: html } });
        }
    }
    exports.default = HtmlControl;
});
