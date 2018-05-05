import { Editor, EditorProps } from "components/editor";
import { State as ControlState, default as CategoriesControl } from 'components/image/control';
import ImageManager from 'admin/controls/imageManager'
import { StationService } from "admin/services/station";
import tips from "admin/tips";
import { ImageInput } from "admin/controls/imageInput";
import { imageUrl } from "share/common";

export interface EditorState extends Partial<ControlState> {
    uploading: boolean
}

export default class ImageEditor extends Editor<EditorProps, EditorState> {
    // imageManager: ImageManager;
    station: StationService;

    constructor(props) {
        super(props);

        this.loadEditorCSS();
        this.state = { uploading: false };
        this.station = this.props.elementPage.createService(StationService);
    }

    bindTextElement(e: HTMLInputElement, member: keyof EditorState) {
        if (!e) return;
        e.value = this.state.source || '';
        e.onchange = () => {
            this.state.source = e.value || "";
            this.setState(this.state);
        }
    }

    render() {
        let { source } = this.state;
        return (
            <div className="image-editor form-horizontal">
                <div className="form-group">
                    <label className="col-sm-4">图片链接</label>
                    <div className="col-sm-8">
                        <ImageInput station={this.station} imageId={source} />
                    </div>
                </div>
                {/* {source ?
                    <div className="form-group">
                        <label className="col-sm-4"></label>
                        <div className="col-sm-8">
                            <img src={source} style={{ maxWidth: 200 }} />
                        </div>
                    </div> : null
                } */}
                <div className="form-group">
                    <label className="col-sm-4">页面链接</label>
                    <div className="col-sm-8">
                        <input className="form-control" placeholder="点击图片打开的页面链接" />
                    </div>
                </div>
            </div>
        )
    }
}