import { Editor, EditorProps, guid } from 'components/editor';
import { default as Control, Props as ControlProps, State as ControlState, CarouselItem } from 'components/carousel/control';
import { StationService } from 'admin/services/station';
import FormValidator from 'lib/formValidator';
import { ImageFileToBase64Result } from 'ui';
import { imageUrl, ImageUpload, ImageManager } from 'admin/images';


/**
 * TODO:
 * 1. 表单验证
 * 2. 窗口关闭后，数据清除
 * 3. 编辑，删除功能
 */
export interface EditorState extends Partial<ControlState> {
    editItemIndex: number
}
export default class CarouselEditor extends Editor<EditorProps, EditorState>{
    imageManager: ImageManager;
    station: StationService;

    constructor(props) {
        super(props);
        this.loadEditorCSS();
        this.station = this.props.elementPage.createService(StationService);
    }
    async saveContentImage(data: ImageFileToBase64Result) {
        let result = await this.station.saveImage(data.base64);

        let item: CarouselItem = { image: imageUrl(result.id), title: result.id, url: "" };
        this.state.items.push(item);
        this.setState(this.state);
        return result;
    }
    async showImageDialog() {
        this.imageManager.show((images) => {
            images.forEach(o => {
                this.state.items.push({ image: o, url: '', title: '' });
                this.setState(this.state);
            })
        });
    }
    render() {
        let { items, autoplay } = this.state;
        items = items || [];
        return [
            <div key={10} className="form-group">
                <label className="pull-left" style={{ width: 100 }}>自动播放</label>
                <span style={{ paddingRight: 10 }}>
                    <input type="radio" name="autoplay" value="true"
                        ref={(e: any) => this.bindCheckElement(e, 'autoplay', 'boolean')} />启用
                </span>
                <span>
                    <input type="radio" name="autoplay" value="false"
                        ref={(e: any) => this.bindCheckElement(e, 'autoplay', 'boolean')} />禁用
                </span>
            </div>,
            <ul key="ul" className="carousel-items">
                {items.map((o, i) =>
                    <li key={i}>
                        <div className="form-group">
                            <img src={o.image} />
                        </div>
                        <div className="form-group">
                            <input className="form-control" placeholder="请输入和图片对应的链接" />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-block btn-danger"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    ui.buttonOnClick(e, () => {
                                        items = items.filter(c => c != o);
                                        this.state.items = items;
                                        this.setState(this.state);
                                        return Promise.resolve();
                                    }, { confirm: '确定删除吗' })

                                }}>
                                删除
                            </button>
                        </div>
                    </li>
                )}
                <li onClick={() => this.showImageDialog()}>
                    <i className="icon-plus icon-4x"></i>
                    <div>从相册选取图片</div>
                </li>
            </ul>,
            <div key="div" className="clearfix"></div>,
            <ImageManager key="images" station={this.station}
                ref={(e) => this.imageManager = e || this.imageManager} />
        ]
    }
}