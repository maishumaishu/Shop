import { imageUrl } from "../images";

const imageThumbSize = 112;

type ImageThumberProps = React.Props<ImageThumber> & {
    imagePath: string, remove?: (imagePath: string) => Promise<any>,
    className?: string, onClick?: (sender: ImageThumber, e: React.MouseEvent) => void,
    selectedText?: string,
    text?: string, title?: string
}

type ImageThumberState = {
    // selectedText: string
}

requirejs(['less!admin/controls/imageThumber']);
export default class ImageThumber extends React.Component<ImageThumberProps, ImageThumberState>{
    constructor(props) {
        super(props);
        this.state = { selectedText: '' }
    }
    private setDeleteButton(e: HTMLButtonElement, imagePath: string) {
        if (!e) return;
        // if (this.props.remove) {
        ui.buttonOnClick(e,
            (e) => {
                e.stopPropagation();
                e.cancelBubble = true;
                return this.props.remove(imagePath)
            },
            {
                confirm: '确定删除该图片吗？'
            });
        // }
    }
    render() {
        let { imagePath, className, onClick, selectedText, text, title } = this.props;
        className = className || '';
        text = text || '';
        return (
            <div className={`image-thumber ${className}`} title={title}
                onClick={(e) => {
                    this.props.onClick ? this.props.onClick(this, e) : null
                }}>
                <div className={`item text-center  ${selectedText ? 'selected' : ''}`}>
                    <div className="triangle"></div>
                    <div className="top">
                        {selectedText}
                    </div>
                    {this.props.remove ?
                        <div className="remove">
                            <i className="icon-remove" ref={(e: any) => this.setDeleteButton(e, imagePath)} />
                        </div> : null}
                    <img className="img-responsive" src={imageUrl(imagePath, 150, 150)}
                        ref={(e: HTMLImageElement) => e ? ui.renderImage(e, { imageSize: { width: 150, height: 150 } }) : null} />
                    <div className="bottom">
                        {text}
                    </div>
                </div>
            </div>
        );
    }
}
