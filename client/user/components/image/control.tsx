import { componentsDir, Control, ControlProps } from 'user/components/common';

export interface State {
    /**
     * 图片源
     */
    Source: string,
    /**
     * 点击图片打开的链接
     */
    URL: string
}

export interface Props extends ControlProps<ImageControl> {

}

export default class ImageControl extends Control<Props, State> {
    constructor(props) {
        super(props);
        this.loadControlCSS();
    }
    
    get persistentMembers(): (keyof State)[] {
        return ["Source", "URL"];
    }

    _render(h: any): JSX.Element | JSX.Element[] {
        return (
            <div className="image">
                <img src="http://image.bailunmei.com/5ad85056668ae11b3949d3b6_960_960?width=200&type=jpeg"
                    ref={(e: HTMLImageElement) => {
                        if (!e) return;
                        ui.renderImage(e, { imageText: "Hello World" })
                    }} />
            </div>
        )
    }
}