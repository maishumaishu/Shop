define(["require", "exports", "components/common", "iscroll"], function (require, exports, common_1, IScroll) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class NavigatorControl extends common_1.Control {
        constructor(props) {
            super(props);
            this.loadControlCSS();
            this.state = { items: [], activeIndex: 0 };
        }
        get persistentMembers() {
            return ["items", "width", "marginTop", "marginBottom"];
        }
        ;
        componentDidMount() {
            if (!this.props.mobilePage.props.designTime) {
                let width = this.state.width;
                if (width != null) {
                    this.element.style.width = `${width}px`;
                    let myScroll = new IScroll(this.element.parentElement, { scrollX: true, scrollY: false, mouseWheel: true });
                }
            }
            this.siteMap = {
                nodes: {
                    page0: { action: 'user/modules/page', cache: true },
                    page1: { action: 'user/modules/page', cache: true },
                    page2: { action: 'user/modules/page', cache: true }
                }
            };
            this.pageMaster = new chitu.PageMaster(this.siteMap.nodes, this.container);
            let activeIndex = this.state.activeIndex;
            let pageId = this.state.items[activeIndex].pageId;
            this.showPage(pageId, 0);
            // if (this.state.marginBottom) {
            //     this.element.style.marginBottom = `${this.state.marginBottom}px`;
            // }
            // if (this.state.marginTop) {
            //     this.element.style.marginTop = `${this.state.marginTop}px`;
            // }
        }
        showPage(pageId, index) {
            let name = `page${index}`;
            this.pageMaster.showPage(this.siteMap.nodes[name], { pageId });
        }
        componentDidUpdate() {
            if (this.props.mobilePage.props.designTime) {
                let width = 0;
                let items = this.element.querySelectorAll('li');
                for (let i = 0; i < items.length; i++) {
                    width = width + items.item(i).offsetWidth;
                }
                // 左右 padding 合计 20，预留 10
                let PADDING = 20 + 10;
                width = width + PADDING;
                this.state.width = width;
                this.element.style.width = `${width}px`;
            }
        }
        itemOnClick(e, item, i) {
            if (!e)
                return;
            e.onclick = () => {
                this.state.activeIndex = i;
                this.setState(this.state);
                this.showPage(item.pageId, i);
            };
        }
        _render(h) {
            let { items, activeIndex, marginBottom, marginTop } = this.state;
            marginBottom = marginBottom || '0';
            marginTop = marginTop || '0';
            return [
                h("div", { key: "bar", className: "scroll-container", style: { marginTop: `${marginTop}px`, marginBottom: `${marginBottom}px` } },
                    h("div", { className: "scroller", ref: (e) => this.element = e || this.element },
                        h("ul", null, items.map((o, i) => h("li", { key: i, className: `btn-link ${activeIndex == i ? 'active' : ''}`, ref: (e) => this.itemOnClick(e, o, i) },
                            " ",
                            o.name))))),
                h("div", { key: "container", className: "page-container", ref: (e) => this.container = e || this.container })
            ];
        }
    }
    exports.default = NavigatorControl;
    function test() {
    }
    setTimeout(() => test(), 500);
});
