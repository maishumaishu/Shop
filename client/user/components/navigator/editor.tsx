
import { Editor, EditorProps } from 'user/components/editor';
import { State as ControlState, default as Control, NavigatorItem } from 'user/components/navigator/control';
import 'wuzhui';


export interface EditorState extends Partial<ControlState> {
}

interface MenuEditorProps extends EditorProps {

}
export default class NavigatorEditor extends Editor<MenuEditorProps, EditorState> {
    dialog: HTMLElement;
    dataSource: wuzhui.DataSource<NavigatorItem>;
    itemsElement: HTMLTableElement;
    constructor(props) {
        super(props);
        this.loadEditorCSS();
        this.state = { items: [{ name: '首页' }] };
    }
    showDialog() {
        ui.showDialog(this.dialog);
    }
    componentDidMount() {
        // this.dataSource = new wuzhui.DataSource<NavigatorItem>({
        //     select: () => Promise.resolve([
        //         { name: '首页' },

        //     ])
        // });
        // new wuzhui.GridView<NavigatorItem>({
        //     element: this.itemsElement,
        //     dataSource: this.dataSource,
        //     columns: [
        //         new wuzhui.BoundField({ dataField: 'name', headerText: '名称' })
        //     ]
        // })
    }
    render() {
        let { items } = this.state;
        return [
            <ul key="items">
                {items.length > 0 ?
                    items.map((o, i) =>
                        <li key={i}>
                            {o.name}
                            <button className="btn-link pull-right" type="button">删除</button>
                        </li>
                    ) :
                    <li>
                        暂无数据,点击"添加导航菜单项"按钮添加
                    </li>
                }
            </ul>,
            <div key="button" className="text-center">
                <button className="btn btn-primary"
                    onClick={() => this.showDialog()}>
                    添加导航菜单项
                    </button>
            </div>,
            <div key="dialog" className="modal fade" ref={(e: HTMLElement) => this.dialog = e || this.dialog}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"
                                onClick={() => ui.hideDialog(this.dialog)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">添加导航菜单项</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-2 control-label">名称</label>
                                <div className="col-sm-10">
                                    <input name="productId" type="text" className="form-control" placeholder="请输名称" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2 control-label">显示页面</label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input name="productId" type="text" className="form-control" placeholder="请选择要显示的页面" />
                                        <span className="input-group-addon">
                                            <i className=" icon-cog"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button name="cancel" type="button" className="btn btn-default"
                                onClick={() => ui.hideDialog(this.dialog)}>
                                取消
                          </button>
                            <button name="ok" type="button" className="btn btn-primary">
                                确定
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        ]
    }
}