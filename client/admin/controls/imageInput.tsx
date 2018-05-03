import tips from "admin/tips";
import ImageManager from "./imageManager";
import { imageUrl } from "../images";
import { StationService } from "../services/station";

export interface State {
    /**
     * 图片源
     */
    imageId: string,

    /**
     * 点击图片打开的链接
     */
    url: string
}

type Props = {
    imageId: string,
    station: StationService,
} & React.Props<ImageInput>

//TODO 缩略图使用小图

requirejs(['css!admin/controls/imageInput']);
export class ImageInput extends React.Component<Props, State>{
    imageManager: ImageManager;

    constructor(props) {
        super(props);
        this.state = { imageId: this.props.imageId, url: '' };
    }

    bindTextElement(e: HTMLInputElement, member: keyof State) {
        if (!e) return;
        e.value = this.state[member] || '';
        e.onchange = () => {
            this.state[member] = e.value || "";
            this.setState(this.state);
        }
    }

    showImageDialog() {
        this.imageManager.show((images) => {
            this.state.imageId = images[0];//imageUrl(images[0], 100);
            this.setState(this.state);
        });
    }

    async uploadImage(file: File) {
        let { station } = this.props;
        let data = await ui.fileToBase64(file);
        let result = await station.saveImage(data);
        this.state.imageId = result.id;
        this.setState(this.state);
    }

    render() {
        let { station } = this.props;
        let { imageId } = this.state;
        return [
            <div key={10} className="image-input input-group">
                <input className="form-control" readOnly={true}
                    value={imageUrl(imageId)} />
                <span className="input-group-addon" title={tips.imageFromAlbum}
                    onClick={() => this.showImageDialog()}>
                    <i className="icon-picture" />
                </span>
                <span className="input-group-addon" title={tips.uploadImage}>
                    <i className="icon-plus" />
                    <input className="file-upload" type="file"
                        ref={(e: HTMLInputElement) => {
                            if (!e) return;
                            e.onchange = () => this.uploadImage(e.files[0]);
                        }} />
                </span>
                <ImageManager key="images" station={station}
                    ref={(e) => this.imageManager = e || this.imageManager} />
            </div>,
            <ImageManager key="images" station={station}
                ref={(e) => this.imageManager = e || this.imageManager} />,
            imageId ? <img key={imageId} className="image-input" src={imageUrl(imageId, 120)} /> : null
        ];
    }
}