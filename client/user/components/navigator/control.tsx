import { Control, ControlProps } from "user/components/common";
import { clearFix, animation, lighten, modularScale, hiDPI } from 'polished'
import '/scripts/dragscroll.js'
import IScroll = require('iscroll');


interface Props extends ControlProps<Navigator> {

}

export type NavigatorItem = {
    name: string,
    page_id?: string,
    page_name?: string,
}

export interface State {
    items: NavigatorItem[]
}

export default class NavigatorControl extends Control<Props, State> {

    element: HTMLElement;
    constructor(props) {
        super(props);
        this.loadControlCSS();
        this.state = { items: [] };
    }

    get persistentMembers() {
        return [] as any;
    };

    componentDidMount() {
        setTimeout(() => {
            let myScroll = new IScroll(this.element.parentElement, { scrollX: true, scrollY: false, mouseWheel: true });
        }, 100);
    }

    _render(h: any): JSX.Element | JSX.Element[] {
        return (
            <div id="scroller" ref={(e: HTMLElement) => this.element = e || this.element}>
                <ul>
                    <li>首页</li>
                    <li>单品花束</li>
                    <li>混合花束</li>
                    <li>MINI花束</li>
                    <li>礼品花束</li>
                    <li>花瓶花剪</li>
                    <li>家居生活</li>
                    <li>花加绿值</li>
                </ul>
            </div>
        )
    }
}

function test() {



}

setTimeout(() => test(), 500);