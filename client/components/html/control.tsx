import { componentsDir, Control, ControlProps } from 'components/common';


export interface State {
    /**
     * 图片源
     */
    html: string,

}

export interface Props extends ControlProps<HtmlControl> {

}

export default class HtmlControl extends Control<Props, State> {
    get persistentMembers(): (keyof State)[] {
        return ["html"]
    }
    _render(h: any): JSX.Element | JSX.Element[] {
        let { html } = this.state;
        if (!html) {
            html = `<div class="text-center" style="padding:20px 0 20px 0">请设置 HTML</div>`;
        }
        return <div className="html-control" dangerouslySetInnerHTML={{ __html: html }} />;
    }
}