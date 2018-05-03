import { componentsDir, Control, ControlProps } from 'components/common';


export interface State {
    /**
     * 图片源
     */
    html: string,

}

export interface Props extends ControlProps<HtmlControl> {
    emptyText?: string
}

const defaultEmptyText = '请设置 HTML';

export default class HtmlControl extends Control<Props, State> {
    constructor(props) {
        super(props);
        this.loadControlCSS();
    }
    get persistentMembers(): (keyof State)[] {
        return ["html"]
    }
    _render(h: any): JSX.Element | JSX.Element[] {
        let { html } = this.state;
        if (!html) {
            let emptyText = this.props.emptyText || defaultEmptyText;
            html = `<div class="text-center" style="padding:20px 0 20px 0">${emptyText}</div>`;
        }
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
}