import { Editor, EditorProps, guid } from 'components/editor';
import { default as Control, Props as ControlProps, State as ControlState, CarouselItem } from 'components/carousel/control';
import { StationService } from 'admin/services/station';
import FormValidator from 'lib/formValidator';
import { ImageFileToBase64Result } from 'ui';
import { imageUrl, ImageUpload, ImageManager } from 'admin/images';

//========================================
// 列表项的宽度，这 css 样式设定，要与它相同
const itemHeight = 120;
//========================================

/**
 * TODO:
 * 1. 表单验证
 * 2. 窗口关闭后，数据清除
 * 3. 编辑，删除功能
 */
interface State extends Partial<ControlState> {
    editItemIndex: number,


}

interface Props extends EditorProps {
}


export default class CarouselEditor extends Editor<Props, State>{
    // imageManager: ImageManager;
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
        ImageManager.show((imageIds) => {
            imageIds.forEach(o => {
                this.state.items.push({ image: o, url: '', title: '' });
                this.setState(this.state);
            })
        });
    }
    render() {
        let { items, autoplay, itemScale, clickType } = this.state;

        let itemWidth: number;
        if (itemScale) {
            itemWidth = itemHeight / itemScale;
        }

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
                    <li key={i} style={{ width: itemWidth }}>
                        <div className="form-group">
                            <img src={imageUrl(o.image, 100)} />
                        </div>
                        {clickType == 'openPage' ?
                            <div className="form-group">
                                <input className="form-control" placeholder="请输入和图片对应的链接" />
                            </div> : null
                        }
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
                <li style={{ width: itemWidth }} onClick={() => this.showImageDialog()}>
                    <i className="icon-plus icon-4x"></i>
                    <div>从相册选取图片</div>
                </li>
            </ul>,
            <div key="div" className="clearfix"></div>,

        ]
    }
}