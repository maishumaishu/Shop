import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control, MenuNode } from 'mobileComponents/menu/control';
requirejs(['css!mobileComponents/menu/editor.css']);
let h = React.createElement;
export interface EditorState {
}
export default class MenuEditor extends Editor<ControlProps, ControlState, EditorState, Control> {//Editor<EditorState<ControlProps>>
    private appendDialogELement: HTMLElement;
    private nameInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = { menuNodes: this.props.control.props.menuNodes || [] };
    }
    render() {
        let menuNodes = this.state.menuNodes || [];
        return (
            <div className="menuEditor">

                <div className="menu-apply">
                    <div className="title">将菜单应用到以下页面：</div>
                    <div>
                        <label className="item">
                            <input type="checkbox" /> 店铺首页
                        </label>
                        <label className="item">
                            <input type="checkbox" /> 会员主页
                        </label>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <ul className="menu">
                    {menuNodes.map((o, i) =>
                        <li key={i}>
                            {o.name}
                        </li>
                    )}
                    <li onClick={() => $(this.appendDialogELement).modal()}>
                        <button className="btn btn-primary"
                            onClick={(e) => {
                                $(this.appendDialogELement).modal();
                            }}>点击添加菜单项</button>
                    </li>
                </ul>
                <div className="modal fade"
                    ref={(e: HTMLElement) => this.appendDialogELement = e || this.appendDialogELement}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title">添加菜单项</h4>
                            </div>
                            <div className="modal-body form-horizontal">
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">名称</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" placeholder="请输入菜单项名称"
                                            ref={(e: HTMLInputElement) => this.nameInput = e || this.nameInput} />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary"
                                    onClick={() => {
                                        this.state.menuNodes.push({ name: this.nameInput.value } as MenuNode);
                                        this.setState(this.state);
                                        $(this.appendDialogELement).modal('hide');
                                    }}>保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}