import ImageUpload from 'controls/imageUpload';
import ImageThumber from 'controls/ImageThumber';

requirejs(['css!controls/imageManager']);

type State = { images: string[] }
export default class ImageManager extends React.Component<any, State> {
    private element: HTMLElement;

    constructor(props) {
        super(props);

        this.state = { images: [] };
    }

    show() {
        ui.showDialog(this.element);
    }

    saveImage(data) {
        this.state.images.push(data);
        this.setState(this.state);
        return Promise.resolve();
    }

    render() {
        let { images } = this.state;
        return (
            <div className="image-manager modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"
                                onClick={() => ui.hideDialog(this.element)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">选择图片</h4>
                        </div>
                        <div className="modal-body">
                            {images.map((o, i) =>
                                <ImageThumber key={i} imagePath={o} className="col-xs-3" />
                            )}
                            <ImageUpload className="col-xs-3"  saveImage={(data) => this.saveImage(data.base64)} />
                            <div className="clearfix" />
                        </div>
                        <div className="modal-footer">
                            <button name="cancel" type="button" className="btn btn-default"
                                onClick={() => ui.hideDialog(this.element)}>
                                取消
                            </button>
                            <button name="ok" type="button" className="btn btn-primary">
                                确定
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}