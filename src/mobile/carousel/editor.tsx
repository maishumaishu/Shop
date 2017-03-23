import { Editor, EditorProps, EditorState, guid } from 'mobile/editor';
import { default as Control, Data, CarouselItem } from 'mobile/carousel/control';
import site = require('Site');
import { default as station } from 'services/Station';
import { ImagePreview } from 'common/ImagePreview';
import { Button } from 'common/controls';
import FormValidator = require('common/formValidator');

/**
 * TODO:
 * 1. 表单验证
 * 2. 窗口关闭后，数据清除
 * 3. 编辑，删除功能
 */
requirejs([`css!${Editor.path('carousel')}.css`]);

export default class EditorComponent extends Editor<EditorState<Data> & { editItemIndex: number }>{

    private editorElement: HTMLElement;
    private dialogElement: HTMLElement;
    private validator: FormValidator;
    private imageUpload: ImagePreview;

    private urlInput: HTMLInputElement;
    private numberSelect: HTMLSelectElement;

    constructor(props) {
        super(props, Control, Data);
    }

    componentDidMount() {
        super.componentDidMount();

        this.validator = new FormValidator(this.dialogElement, {
            image: { display: '图片', rules: ['image'], messages: { image: '请上传图片' } },
            url: { display: '链接', rules: ['required'] }
        });

        this.validator.hooks['image'] = () => {
            return this.imageUpload.state.imageData != null;
        }
    }

    saveItem() {
        if (!this.validator.validateForm()) {
            return Promise.reject({});
        }

        let item: CarouselItem;
        let { width, height } = this.imageUpload.props.size;

        if (this.state.editItemIndex == null) {
            item = { name: `${guid()}_${width}_${height}` } as CarouselItem;
        }
        else {
            item = this.state.controlData.items[this.state.editItemIndex];
            console.assert(item != null);

        }

        item.url = this.urlInput.value;

        let data = this.imageUpload.state.imageData;
        let p: Promise<any> = this.imageUpload.state.imageData.startsWith('data:image') ?
            station.saveImage(this.props.pageId, item.name, data) : Promise.resolve();

        return p.then(o => {
            console.assert(this.urlInput != null);
            item.image = station.imageUrl(this.props.pageId, item.name);
            let number = Number.parseInt(this.numberSelect.value);
            let items = this.state.controlData.items;
            if (this.state.editItemIndex == null)
                items.splice(number, 0, item);
            else {
                items = items.filter(o => o != item);
                items.splice(number, 0, item);

                this.state.controlData.items = items;
            }

            this.setState(this.state);
            $(this.dialogElement).modal('hide');
        });
    }

    removeItem(index: number) {
        let imageUrl = this.state.controlData.items[index].image;
        let name = station.getImageNameFromUrl(imageUrl);
        return station.removeImage(this.props.pageId, name).then(() => {
            // this.removeItem(i);
            this.state.controlData.items = this.state.controlData.items.filter((o, i) => index != i);
            this.setState(this.state);
        });
    }

    // editItem(index: number) {
    //     var item = this.state.controlData.items[index];
    //     console.assert(item != null);
    //     this.urlInput.value = item.url;
    //     this.numberSelect.value = `${index}`;
    //     this.imageUpload.state.imageData = item.image;
    //     this.imageUpload.setState(this.imageUpload.state);
    //     $(this.dialogElement).modal();
    // }

    reset() {
        this.urlInput.value = '';
        this.validator.clearErrors();
        this.imageUpload.clear()
    }

    showDialog(itemIndex?: number) {
        $(this.dialogElement).modal({ keyboard: false });
        this.state.editItemIndex = itemIndex;
        if (itemIndex == null) {
            this.reset();
        }
        else {
            let item = this.state.controlData.items[itemIndex];
            console.assert(item != null);
            this.urlInput.value = item.url;
            this.numberSelect.value = `${itemIndex}`;
            this.imageUpload.state.imageData = item.image;
        }
        this.imageUpload.setState(this.imageUpload.state);
        this.setState(this.state);
    }

    render() {
        let items = this.state.controlData.items;
        let imageWidth = 720;
        let imageHeight = 322;

        return (
            <div ref={(o: HTMLElement) => this.editorElement = o} className="carousel-editor">
                <div style={{ height: 30 }}>
                    <div className="pull-right">
                        <button className="btn btn-sm btn-primary"
                            onClick={() => this.showDialog()}>添加图片</button>
                    </div>
                    <h4 className="pull-left">设置轮播图片</h4>
                    <div className="clearfix"></div>
                </div>
                <hr />
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: 60 }}>序号</th>
                            <th className="text-center" style={{ width: 120 }}>图片</th>
                            <th className="text-center">链接地址</th>
                            <th className="text-center" style={{ width: 120 }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((o, i) => (
                            <tr key={o.name}>
                                <td>{i + 1}</td>
                                <td className="text-center">
                                    <img src={o.image} style={{ width: 100 }} />
                                </td>
                                <td>{o.url}</td>
                                <td style={{ textAlign: 'center', paddingTop: 20 }}>
                                    <button className="btn btn-minier btn-info"
                                        onClick={() => {
                                            this.showDialog(i);
                                        }}>
                                        <i className="icon-pencil"></i>
                                    </button>
                                    <Button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}
                                        confirm={"确定要删除该图片吗？"}
                                        onClick={() => {

                                            this.removeItem(i);
                                            return Promise.resolve();
                                        }}>
                                        <i className="icon-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {items.length == 0 ?
                            <tr>
                                <td colSpan={4} style={{ height: 150, paddingTop: 60, textAlign: 'center' }}>
                                    暂无轮播图片，请点击右上角的＂添加＂按钮添加图片
                                    </td>
                            </tr> : null
                        }
                    </tbody>
                </table>
                <div className="form-group">
                    <div className="pull-left">
                        <span>图片大小：720 X 322，播放时间：2 秒</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <a href="#">设置</a>
                    </div>
                </div>

                {/*　弹出窗口　*/}
                <div className="modal fade" ref={(o: HTMLElement) => this.dialogElement = o}>
                    <input name="Id" type="hidden" />
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">编辑</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">序号</label>
                                        <div className="col-sm-10">
                                            <select ref={(o: HTMLSelectElement) => this.numberSelect = this.numberSelect || o} className="form-control">
                                                {items.map((o, i) => (
                                                    <option key={i} value={`${i}`}>{i + 1}</option>
                                                ))}
                                                {this.state.editItemIndex == null ?
                                                    <option key={items.length} value={`${items.length}`}>{items.length + 1}</option> : null}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">链接</label>
                                        <div className="col-sm-10">
                                            <input ref={(o: HTMLInputElement) => this.urlInput = this.urlInput || o} name="url" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">图片</label>
                                        <div className="col-sm-10 fileupload">
                                            <ImagePreview ref={(o) => this.imageUpload = o}
                                                size={{ width: imageWidth, height: imageHeight }} inputName="image" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: 0 }}>
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <Button className="btn btn-primary" onClick={() => this.saveItem()}> 确定</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderControl(data: Data) {
        data.autoplay = false;
        super.renderControl(data);
    }
}
