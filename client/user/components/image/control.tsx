import { componentsDir, Control, ControlProps } from 'user/components/common';

export interface State {
    /**
     * 图片源
     */
    source: string,
    /**
     * 点击图片打开的链接
     */
    url: string
}

export interface Props extends ControlProps<ImageControl> {

}

export default class ImageControl extends Control<Props, State> {
    constructor(props) {
        super(props);
        this.loadControlCSS();
    }

    get persistentMembers(): (keyof State)[] {
        return ["source", "url"];
    }

    _render(h: any): JSX.Element | JSX.Element[] {
        let { source } = this.state;
        return (
            <div className="image-control">
                <img src={this.state.source}
                    ref={(e: HTMLImageElement) => {
                        if (!e) return;
                        ui.renderImage(e, { imageText: "请设置图片" })
                    }} />
            </div>
        )
    }
}