
const imageThumbSize = 112;

type ImageThumberProps = React.Props<ImageThumber> & {
    imagePath, remove?: (imagePath: string) => Promise<any>,
    className?: string
}

requirejs(['css!controls/imageThumber']);
export default class ImageThumber extends React.Component<ImageThumberProps, {}>{
    setDeleteButton(e: HTMLButtonElement, imagePath: string) {
        if (!e) return;
        if (this.props.remove) {
            ui.buttonOnClick(e, () => this.props.remove(imagePath), {
                confirm: '确定删除该图片吗？'
            });
        }
    }
    render() {
        let { imagePath, className } = this.props;
        className = className || '';
        return (
            <div className={`image-thumber ${className}`}>
                <div className="item text-center">
                    <img className="img-responsive" src={imagePath}/>
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
