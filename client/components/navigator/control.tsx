import { Control, ControlProps } from "components/common";
import IScroll = require('iscroll');

interface Props extends ControlProps<Navigator> {

}

export type NavigatorItem = {
    name: string,
    pageId?: string,
    pageName?: string,
}

export interface State {
    items: NavigatorItem[],
    width?: number,
    activeIndex: number,
}

export default class NavigatorControl extends Control<Props, State> {

    siteMap: chitu.SiteMap<chitu.SiteMapNode>;
    container: HTMLElement;
    element: HTMLElement;
    pageMaster: chitu.PageMaster;

    constructor(props) {
        super(props);
        this.loadControlCSS();
        this.state = { items: [], activeIndex: 0 };

    }

    get persistentMembers(): (keyof State)[] {
        return ["items", "width"];
    };

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
        }
        this.pageMaster = new chitu.PageMaster(this.siteMap, this.container);
        let activeIndex = this.state.activeIndex;
        let pageId = this.state.items[activeIndex].pageId;
        // this.pageMaster.showPage(this.siteMap.nodes.page, { pageId })
        this.showPage(pageId, 0);
    }

    showPage(pageId: string, index: number) {
        let name = `page${index}`;
        this.pageMaster.showPage(this.siteMap.nodes[name], { pageId })
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

    itemOnClick(e: HTMLButtonElement, item: NavigatorItem, i: number) {
        if (!e) return;
        e.onclick = () => {
            this.state.activeIndex = i;
            this.setState(this.state);
            this.showPage(item.pageId, i);
        }
    }

    _render(h: any): JSX.Element | JSX.Element[] {
        let { items, activeIndex } = this.state;
        // if (this.pageMaster != null)
        //     this.pageMaster.showPage(this.siteMap.nodes[`${activeIndex}`])

        return [
            <div key="bar" id="scroller" ref={(e: HTMLElement) => this.element = e || this.element}>
                <ul>
                    {items.map((o, i) =>
                        <li key={i} className={`btn-link ${activeIndex == i ? 'active' : ''}`}
                            ref={(e: HTMLButtonElement) => this.itemOnClick(e, o, i)} > {o.name}</li>
                    )}
                </ul>
            </div>,
            <div key="container" className="page-container"
                ref={(e: HTMLElement) => this.container = e || this.container}>
            </div>
        ]
    }
}

function test() {



}

setTimeout(() => test(), 500);