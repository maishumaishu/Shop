
const imageThumbSize = 112;

type ImageThumberProps = React.Props<ImageThumber> & {
    imagePath: string, remove?: (imagePath: string) => Promise<any>,
    className?: string, onClick?: (sender: ImageThumber, e: React.MouseEvent) => void,
    selectedText?: string
}

type ImageThumberState = {
    // selectedText: string
}

requirejs(['css!controls/imageThumber']);
export default class ImageThumber extends React.Component<ImageThumberProps, ImageThumberState>{
    constructor(props) {
        super(props);
        this.state = { selectedText: '' }
    }
    // set selectedText(value: string) {
    //     this.state.selectedText = value;
    //     this.setState(this.state);
    // }
    private setDeleteButton(e: HTMLButtonElement, imagePath: string) {
        if (!e) return;
        if (this.props.remove) {
            ui.buttonOnClick(e,
                (e) => {
                    e.stopPropagation();
                    e.cancelBubble = true;
                    return this.props.remove(imagePath)
                },
                {
                    confirm: '确定删除该图片吗？'
                });
        }
    }
    render() {
        let { imagePath, className, onClick, selectedText } = this.props;
        className = className || '';
        return (
            <div className={`image-thumber ${className}`}
                onClick={(e) => {
                    this.props.onClick ? this.props.onClick(this, e) : null
                }}>
                <div className={`item text-center  ${selectedText ? 'selected' : ''}`}>
                    <div className="triangle"></div>
                    <div className="top">{selectedText}</div>
                    <img className="img-responsive" src={imagePath} />
                    <div className="bottom">
                        <button className="btn-link"
                            ref={(e: HTMLButtonElement) => this.setDeleteButton(e, imagePath)}>
                            删除
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
