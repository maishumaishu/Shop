
import { Editor, EditorProps } from 'user/components/editor';
import { State as ControlState, default as Control, NavigatorItem } from 'user/components/navigator/control';
import 'wuzhui';
import { FormValidator, rules } from 'dilu';

export interface EditorState extends Partial<ControlState> {
}

interface MenuEditorProps extends EditorProps {

}
export default class NavigatorEditor extends Editor<MenuEditorProps, EditorState> {
    validator: FormValidator;
    dialog: HTMLElement;
    itemsElement: HTMLTableElement;

    constructor(props) {
        super(props);
        this.loadEditorCSS();
    }
    showDialog(item?: NavigatorItem) {
        if (item) {
            this.value('name', item.name);
            this.value('pageId', item.pageId);
            this.value('pageName', item.pageName);
        }
        ui.showDialog(this.dialog, (button) => {
            if (button.name != 'ok')
                return;

            if (item == null)
                this.addItem();
            else
                this.updateItem(item);

            ui.hideDialog(this.dialog);
        });
    }
    async addItem() {
        this.validator.clearErrors();
        let isVaid = await this.validator.check();
        if (!isVaid) {
            return Promise.resolve('validate fail');
        }

        let name = this.value('name');
        let url = this.value('url');
        let pageId = this.value('pageId');
        let pageName = this.value('pageName')
        this.state.items.push({ name, pageId });
        this.setState(this.state);
        ui.hideDialog(this.dialog);
    }
    updateItem(item: NavigatorItem) {
        let name = this.value('name');
        let url = this.value('url');
        let pageId = this.value('pageId');
        let pageName = this.value('pageName');
        Object.assign(item, { name, url, pageId, pageName } as NavigatorItem);
        this.setState(this.state);
    }
    removeItem(item: NavigatorItem) {
        this.state.items = this.state.items.filter(o => o != item);
        this.setState(this.state);
        return Promise.resolve();
    }
    componentDidMount() {
        this.validator = new FormValidator(this.dialog,
            { name: 'name', rules: [rules.required('请输入导航菜单项名称')] }
        )
    }
    value(name: string, value?: string) {
        let element = this.dialog.querySelector(`[name="${name}"]`) as HTMLInputElement;
        if (element == null)
            throw new Error(`Element ${name} not exists.`);

        if (value != null) {
            element.value = value;
        }
        return element.value;
    }
    render() {
        let { items } = this.state;
        return [
            <ul key="items">
                {items.length > 0 ?
                    items.map((o, i) =>
                        <li key={i}>
                            {o.name}

                            <button className="btn-link pull-right" type="button"
                                ref={(e: HTMLButtonElement) => e ?
                                    ui.buttonOnClick(e, () => this.removeItem(o), { confirm: `确定要删除"${o.name}"吗` }) : null}>删除</button>

                            <button className="btn-link pull-right" type="button"
                                onClick={() => this.showDialog(o)}>编辑</button>

                        </li>
                    ) :
                    <li className="text-center no-records">
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
                                    <input name="name" type="text" className="form-control" placeholder="请输名称" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2 control-label">显示页面</label>
                                <div className="col-sm-10">
                                    <div className="input-group">
                                        <input name="url" type="text" className="form-control" placeholder="请选择要显示的页面" />
                                        <span className="input-group-addon">
                                            <i className=" icon-cog"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2 control-label">PageId</label>
                                <div className="col-sm-10">
                                    <input name="pageId" type="text" className="form-control" placeholder="pageId" />
                                </div>
                            </div>
                            {/* <input name="pageId" type="hidden" /> */}
                            <input name="pageName" type="hidden" />
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