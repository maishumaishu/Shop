import { Editor, EditorProps } from "user/components/editor";
import { State as ControlState, default as CategoriesControl } from 'user/components/image/control';
import ImageManager from 'admin/controls/imageManager'
import { StationService } from "admin/services/station";
import { imageUrl } from "share/common";
import tips from "../../../admin/tips";

export interface EditorState extends Partial<ControlState> {
    uploading: boolean
}

export default class ImageEditor extends Editor<EditorProps, EditorState> {
    imageManager: ImageManager;
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

    showImageDialog() {
        this.imageManager.show();
    }

    async uploadImage(file: File) {
        let data = await ui.fileToBase64(file);
        let result = await this.station.saveImage(data);
        this.state.source = imageUrl(result.id);
        this.setState(this.state);
    }

    render() {
        let { source } = this.state;
        return (
            <div className="image-editor form-horizontal">
                <div className="form-group">
                    <label className="col-sm-4">图片链接</label>
                    <div className="col-sm-8">
                        <div className="input-group">
                            <input className="form-control"
                                ref={(e: HTMLInputElement) => this.bindTextElement(e, "source")} />
                            <span className="input-group-btn" title={tips.imageFromAlbum}>
                                <button className="btn btn-default" type="button"
                                    onClick={() => this.showImageDialog()}>
                                    <i className="icon-picture" />
                                </button>
                            </span>
                            <span className="input-group-btn" title={tips.uploadImage}>
                                <button className="btn btn-default" type="button">
                                    <i className="icon-plus" />
                                    <input className="file-upload" type="file"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.onchange = () => this.uploadImage(e.files[0]);
                                        }} />
                                </button>

                            </span>
                        </div>
                    </div>
                </div>
                {source ?
                    <div className="form-group">
                        <label className="col-sm-4"></label>
                        <div className="col-sm-8">
                            <img src={source} style={{ maxWidth: 200 }} />
                        </div>
                    </div> : null
                }
                <div className="form-group">
                    <label className="col-sm-4">页面链接</label>
                    <div className="col-sm-8">
                        <input className="form-control" />
                    </div>
                </div>
                <ImageManager station={this.station} ref={(e) => this.imageManager = e || this.imageManager} />
            </div>
        )
    }
}