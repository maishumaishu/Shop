import { Editor, EditorProps, EditorState, guid } from 'mobile/common';
import { default as Control, Data } from 'mobile/carousel/control';
import site = require('Site');
import { default as station } from 'services/Station';
import { ImageUpload } from 'common/ImageUpload';

requirejs([`css!${Editor.path('carousel')}.css`]);

export default class EditorComponent extends Editor<EditorState<Data>>{

    private editorElement: HTMLElement;
    private dialogElement: HTMLElement;

    private imageName: string;

    constructor(props) {
        super(props, Control, Data);
    }

    addItem() {
        console.assert(this.imageName != null);
        let imageUrl = station.imageUrl(this.props.pageId, this.imageName);
        this.state.controlData.images.push(imageUrl);
        this.setState(this.state);
        $(this.dialogElement).modal('hide');
    }

    render() {
        let images = this.state.controlData.images;
        let imageWidth = 720;
        let imageHeight = 322;

        return (
            <div ref={(o: HTMLElement) => this.editorElement = o} className="carousel-editor">
                <div style={{ height: 30 }}>
                    <div className="pull-right">
                        <button className="btn btn-sm btn-primary"
                            onClick={() => {
                                $(this.dialogElement).modal({ keyboard: false });
                            }}>添加图片</button>
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
                        {images.map((o, i) => (
                            <tr key={i}>
                                <td></td>
                                <td className="text-center">
                                    <img src={o} style={{ width: 100 }} />
                                </td>
                                <td></td>
                                <td style={{ textAlign: 'center', paddingTop: 20 }}>
                                    <button className="btn btn-minier btn-info" >
                                        <i className="icon-pencil"></i>
                                    </button>
                                    <button className="btn btn-minier btn-danger" style={{ marginLeft: 4 }}>
                                        <i className="icon-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {images.length == 0 ?
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
                <form className="modal fade" ref={(o: HTMLElement) => this.dialogElement = o}>
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
                                            <select className="form-control" >
                                                <option>1</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">链接</label>
                                        <div className="col-sm-10">
                                            <input name="Name" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">备注</label>
                                        <div className="col-sm-10">
                                            <input name="Remark" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">图片</label>
                                        <div className="col-sm-10 fileupload">
                                            {/*<ImageFileSelector ref={o => this.imageFileSelector = o} size={{ width: imageWidth, height: imageHeight }}
                                                imageLoaded={(data) => {
                                                    this.imageName = `${guid()}_${imageWidth}_${imageHeight}`;
                                                    station.saveImage(this.props.pageId, this.imageName, data)
                                                }} />*/}
                                            <ImageUpload size={{ width: imageWidth, height: imageHeight }}
                                                upload={(data) => {
                                                    this.imageName = `${guid()}_${imageWidth}_${imageHeight}`;
                                                    return station.saveImage(this.props.pageId, this.imageName, data);
                                                }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ marginTop: 0 }}>
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary" onClick={() => this.addItem()}> 保存</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
