import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control, MenuNode } from 'mobileComponents/menu/control';
import { StationService } from 'userServices/stationService';
import { FormValidator, rules } from 'dilu';

requirejs(['css!mobileComponents/menu/editor.css']);
let h = React.createElement;

export interface MenuEditorState extends Partial<ControlState> {
    currentItem?: MenuNode;
}

interface MenuEditorProps extends EditorProps {

}


type Link = {
    text: string,
    url: string
}

// let station = new StationService();

let links: Link[] = [
    { text: '请选择链接', url: '' },
    { text: '店铺主页', url: '#home_index' },
    { text: '购物车', url: '#shopping_shoppingCart' },
    { text: '会员主页', url: '#user_index' },
    { text: '商品类别', url: '#home_class' }
]

let icons = [
    "icon-home", "icon-shopping-cart", "icon-user", "icon-comment",
    "icon-rss", "icon-truck", "icon-reorder", "icon-calendar",
    "icon-th-large"
]

export default class MenuEditor extends Editor<MenuEditorProps, MenuEditorState>{ //Editor<ControlProps, ControlState, EditorState, Control> {//Editor<EditorState<ControlProps>>
    private urlInput: HTMLInputElement;
    private itemDialogELement: HTMLElement;
    private nameInput: HTMLInputElement;
    private validator: FormValidator;
    private iconsElement: HTMLElement;

    constructor(props) {
        super(props);
        this.state = { currentItem: {} as MenuNode };
    }
    editItem(menuItem: MenuNode) {
        this.state.currentItem = menuItem;
        this.setState(this.state);
        this.validator.clearErrors();
        ui.showDialog(this.itemDialogELement);
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
        ui.showDialog(this.itemDialogELement);
    }
    async save() {
        let isValid = await this.validator.check();
        if (!isValid) {
            return;
        }
        let currentItem = this.state.currentItem;
        if (this.state.menuNodes.indexOf(currentItem) < 0) {
            this.state.menuNodes.push(currentItem);
        }
        this.setState(this.state);
        ui.hideDialog(this.itemDialogELement);
        return Promise.resolve();
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
    toggleDisplayIcon() {
        this.state.showIcon = this.state.showIcon ? false : true;
        this.setState(this.state);
    }
    toggleIconsPanel() {
        this.iconsElement.style.display ?
            this.iconsElement.style.removeProperty('display') :
            this.iconsElement.style.display = 'none';
    }
    componentDidMount() {
        let { required } = rules;
        this.validator = new FormValidator(
            { element: this.nameInput, rules: [required()] },
            { element: this.urlInput, rules: [required()], condition: () => this.isCustomUrl() }
        );
    }
    render() {
        let menuNodes = this.state.menuNodes || [];
        menuNodes.sort((a, b) => {
            return (a.sortNumber || 0) - (b.sortNumber || 0);
        });

        let currentItem = this.state.currentItem;

        return (
            <div className="menuEditor">

                <div className="menu-apply">
                    <div className="pull-left">
                        <label className="pull-right">
                            <input type="checkbox" className="ace ace-switch ace-switch-5"
                                ref={(e: HTMLInputElement) => {
                                    if (!e) return;
                                    e.checked = this.state.showIcon;
                                    e.onchange = () => {
                                        this.toggleDisplayIcon();
                                    }
                                }} />
                            <span className="lbl middle"></span>
                        </label>
                        <div className="pull-right" style={{ padding: '4px 10px 0 0' }}>
                            菜单项显示图标
                        </div>
                    </div>
                    <div className="clear-fix" />
                </div>
                <ul className="menu">
                    {menuNodes.map((o, i) =>
                        <li key={i}>
                            <div className="pull-left" style={{ width: 60 }}>
                                {o.sortNumber}
                            </div>
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
                    <li onClick={() => ui.showDialog(this.itemDialogELement)}>
                        <button className="btn btn-primary"
                            onClick={(e) => {
                                this.newItem();
                            }}>
                            <i className="icon-plus" />
                            点击添加菜单项
                        </button>
                    </li>
                </ul>
                <div className="modal fade"
                    ref={(e: HTMLElement) => {
                        if (!e) return;
                        this.itemDialogELement = e;
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
                                                }
                                            }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">序号</label>
                                    <div className="col-sm-10">
                                        <input name="sortNumber" type="text" className="form-control" placeholder="请输入菜单项序号"
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                {/* this.nameInput = e || this.nameInput */ }
                                                e.value = currentItem.sortNumber as any || ''
                                                e.onchange = () => {
                                                    currentItem.sortNumber = Number.parseInt(e.value);
                                                }
                                            }} />
                                    </div>
                                </div>
                                {
                                    this.state.showIcon ?
                                        <div className="form-group">
                                            <label className="col-sm-2 control-label">图标</label>
                                            <div className="col-sm-10">
                                                <div className="input-group">
                                                    <input name="icon" type="text" className="form-control" placeholder="请输入菜单项图标"
                                                        ref={(e: HTMLInputElement) => {
                                                            if (!e) return;
                                                            e.value = currentItem.icon || ''
                                                            e.onchange = () => {
                                                                currentItem.icon = e.value;
                                                            }
                                                        }} />
                                                    <div className="input-group-addon"
                                                        onClick={() => this.toggleIconsPanel()}>
                                                        <i className="icon-cog" style={{ cursor: 'pointer' }} />
                                                    </div>
                                                    <div ref={(e: HTMLElement) => this.iconsElement = e || this.iconsElement} style={{
                                                        position: 'absolute', height: 100, width: '100%', background: 'white',
                                                        zIndex: 10, left: 0, top: 35, border: 'solid 1px #ccc', overflowY: 'auto',
                                                        display: 'none'
                                                    }}>
                                                        <div style={{ position: 'absolute', width: '100%', borderBottom: 'solid 1px #ccc', padding: '4px 6px', background: 'white' }}>
                                                            <span>请选择图标</span>
                                                            <i className="icon-remove" style={{ position: 'absolute', right: 6, top: 6 }}
                                                                onClick={() => this.toggleIconsPanel()} />
                                                        </div>
                                                        <div style={{ padding: '30px 6px 6px 6px' }}>
                                                            {icons.map(o =>
                                                                <i key={o} className={o} style={{ display: 'table-cell', padding: 10, fontSize: 20 }}
                                                                    onClick={() => {
                                                                        currentItem.icon = o;
                                                                        this.toggleIconsPanel();
                                                                    }} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : null
                                }
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">链接</label>
                                    <div className="col-sm-10">
                                        <input name="url" className="form-control"
                                            style={{ display: this.isCustomUrl() ? null : 'none' }}
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                this.urlInput = e;
                                                e.value = currentItem.url || '';
                                                e.onchange = () => {
                                                    currentItem.url = e.value;
                                                }
                                            }} />
                                        <select className="form-control"
                                            style={{ display: this.isCustomUrl() ? 'none' : null }}
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
                </div>
            </div>
        );
    }
}