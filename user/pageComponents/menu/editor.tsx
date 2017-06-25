import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control, MenuNode } from 'mobileComponents/menu/control';
import { FormValidator } from 'formValidator';
requirejs(['css!mobileComponents/menu/editor.css']);
let h = React.createElement;
export interface EditorState {
    currentItem?: MenuNode;
}

type Link = {
    text: string,
    url: string
}
let links: Link[] = [
    { text: '请选择链接', url: '' },
    { text: '店铺主页', url: '#home/index' },
    { text: '购物车', url: '#shopping/shoppingCart' },
    { text: '会员主页', url: '#user/index' }
]

export default class MenuEditor extends Editor<ControlProps, ControlState, EditorState, Control> {//Editor<EditorState<ControlProps>>
    private itemDialogELement: HTMLElement;
    private nameInput: HTMLInputElement;
    private validator: FormValidator;

    constructor(props) {
        super(props);
        this.state = { menuNodes: this.props.control.props.menuNodes || [] };
    }
    editItem(menuItem: MenuNode) {
        this.state.currentItem = menuItem;
        this.setState(this.state);
        this.validator.clearErrors();
        $(this.itemDialogELement).modal();
    }
    deleteItem(menuItem: MenuNode) {
        let menuNodes = this.state.menuNodes.filter(o => o != menuItem);
        this.state.menuNodes = menuNodes;
        this.setState(this.state);

        return Promise.resolve();
    }
    newItem() {
        this.state.currentItem = { url: '' } as MenuNode;
        this.setState(this.state);
        this.validator.clearErrors();
        $(this.itemDialogELement).modal();
    }
    save() {
        if (!this.validator.validateForm()) {
            return;
        }
        let currentItem = this.state.currentItem;

        if (this.state.menuNodes.indexOf(currentItem) < 0) {
            this.state.menuNodes.push(currentItem);
        }
        this.setState(this.state);
        $(this.itemDialogELement).modal('hide');
        return Promise.resolve();
    }
    createValidator(form: HTMLElement) {
        this.validator = new FormValidator(this.itemDialogELement, {
            name: { rules: ['required'] },
            url: {
                depends: () => {
                    if (this.isCustomUrl())
                        return ['required'];

                    return;
                }
            }
        })
    }
    private isCustomUrl() {
        if (this.state.currentItem == null)
            return false;

        let currentUrl = this.state.currentItem.url;
        let containsUrl = links.map(o => o.url).indexOf(currentUrl) >= 0;
        return !(containsUrl);
    }
    linkName(url: string) {
        let link = links.filter(o => o.url == url)[0];
        return link ? link.text : '';
    }
    render() {
        let menuNodes = this.state.menuNodes || [];
        let currentItem = this.state.currentItem;

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
                            <div className="pull-left" style={{ width: 100 }}>
                                {o.name}
                            </div>
                            <div className="pull-left">
                                {o.url} {this.linkName(o.url) ? `(${this.linkName(o.url)})` : ''}
                            </div>
                            <div className="pull-right">
                                <button className="btn btn-danger btn-sm pull-right" style={{ marginLeft: 4 }}
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.deleteItem(o), { confirm: `确定要删除菜单项 "${o.name}" 吗?` });
                                    }}>
                                    <i className="icon-remove" />
                                    <span style={{ paddingLeft: 4 }}>删除</span>
                                </button>
                                <button className="btn btn-info btn-sm pull-right"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = () => this.editItem(o);
                                    }}>
                                    <i className="icon-pencil" />
                                    <span style={{ paddingLeft: 4 }}>修改</span>
                                </button>
                            </div>
                            <div className="clearfix"></div>
                        </li>
                    )}
                    <li onClick={() => $(this.itemDialogELement).modal()}>
                        <button className="btn btn-primary"
                            onClick={(e) => {
                                this.newItem();
                            }}>
                            <i className="icon-plus" />
                            点击添加菜单项
                        </button>
                    </li>
                </ul>
                {currentItem ? <div className="modal fade"
                    ref={(e: HTMLElement) => {
                        if (!e) return;
                        this.itemDialogELement = e;
                        this.createValidator(e);
                    }}>
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
                                        <input name="name" type="text" className="form-control" placeholder="请输入菜单项名称"
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                this.nameInput = e || this.nameInput
                                                e.value = currentItem.name || ''
                                                e.onchange = () => {
                                                    currentItem.name = e.value;
                                                    {/*this.setState(this.state);*/ }
                                                }
                                            }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">链接</label>
                                    <div className="col-sm-10">
                                        {this.isCustomUrl() ?
                                            <input name="url" className="form-control"
                                                ref={(e: HTMLInputElement) => {
                                                    if (!e) return;
                                                    e.value = currentItem.url || '';
                                                    e.onchange = () => {
                                                        currentItem.url = e.value;
                                                        {/*this.setState(this.state);*/ }
                                                    }
                                                }} /> :
                                            <select className="form-control"
                                                ref={(e: HTMLSelectElement) => {
                                                    if (!e) return;
                                                    e.value = currentItem.url;
                                                    e.onchange = () => {
                                                        let option = e.options[e.selectedIndex] as HTMLOptionElement;
                                                        currentItem.url = option.value;
                                                    }
                                                }}>
                                                {links.map((o, i) =>
                                                    <option key={i} value={o.url}>
                                                        {o.text}
                                                    </option>
                                                )}

                                            </select>
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <input type="checkbox"
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                e.value = currentItem.url || '';
                                                e.checked = this.isCustomUrl();
                                                e.onchange = () => {
                                                    if (e.checked) {
                                                        this.state.currentItem.url = null;
                                                        this.setState(this.state);
                                                    }
                                                    else {
                                                        this.state.currentItem.url = '';
                                                        this.setState(this.state);
                                                    }
                                                }

                                            }} /> 自定义链接
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = ui.buttonOnClick(() => this.save());
                                    }}>确定</button>
                            </div>
                        </div>
                    </div>
                </div> : null}
            </div>
        );
    }
}