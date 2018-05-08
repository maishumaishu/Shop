import { componentsDir, Control, ControlProps } from 'components/common';
import { imageUrl } from '../../share/common';

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
        this.hasCSS = true;
    }

    get persistentMembers(): (keyof State)[] {
        return ["source", "url"];
    }

    _render(h: any): JSX.Element | JSX.Element[] {
        let { source } = this.state;
        return (
            <div className="image-control">
                <img src={imageUrl(this.state.source)}
                    ref={(e: HTMLImageElement) => {
                        if (!e) return;
                        ui.renderImage(e, { imageText: "暂无图片" })
                    }} />
            </div>
        )
    }
}