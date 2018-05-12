
import { Editor, EditorProps } from 'components/editor';
import { State as ControlState, default as Control, NavigatorItem } from 'components/navigator/control';
import 'wuzhui';
import { FormValidator, rules } from 'dilu';
import { StationService as UserStation } from 'user/services/stationService';
import { StationService as AdminStation } from 'admin/services/station';
import app from 'admin/application';
import { siteMap } from 'admin/pageNodes';
import { PageSelectDialog } from 'admin/controls/pageSelectDialog';

export interface EditorState extends Partial<ControlState> {
}

interface NavigatorEditorProps extends EditorProps {

}
export default class NavigatorEditor extends Editor<NavigatorEditorProps, EditorState> {
    pageSelectDialog: PageSelectDialog;
    marginBootomElement: any;
    marginTopElement: any;
    validator: FormValidator;
    dialog: HTMLElement;
    itemsElement: HTMLTableElement;
    editItem: NavigatorItem

    constructor(props) {
        super(props);
        this.loadEditorCSS();
    }
    showDialog(item?: NavigatorItem) {
        this.editItem = item;
        this.validator.clearErrors();
        if (item) {
            this.value('name', item.name);
            this.value('pageId', item.pageId);
            this.value('pageName', item.pageName);
        }
        else {
            this.value('name', '');
            this.value('pageId', '');
            this.value('pageName', '');
        }
        ui.showDialog(this.dialog, async (button) => {
            if (button.name != 'ok')
                return;

            this.validator.clearErrors();
            let isVaid = await this.validator.check();
            if (!isVaid) {
                return Promise.resolve('validate fail');
            }

            if (item == null)
                this.addItem();
            else
                this.updateItem(item);

            ui.hideDialog(this.dialog);
        });
    }
    async addItem() {
        let name = this.value('name');
        let pageId = this.value('pageId');
        let pageName = this.value('pageName')
        this.state.items.push({ name, pageId });
        this.setState(this.state);
        ui.hideDialog(this.dialog);
    }
    updateItem(item: NavigatorItem) {
        let name = this.value('name');
        let pageId = this.value('pageId');
        let pageName = this.value('pageName');
        Object.assign(item, { name, pageId, pageName } as NavigatorItem);
        this.setState(this.state);
    }
    removeItem(item: NavigatorItem) {
        this.state.items = this.state.items.filter(o => o != item);
        this.setState(this.state);
        return Promise.resolve();
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

    showPageSelectDialog() {
        this.pageSelectDialog.show((item) => {
            if (this.editItem) {
                this.value('pageName', item.name);
                this.value('pageId', item.id);
            }
        })
    }

    componentDidMount() {
        this.validator = new FormValidator(this.dialog,
            { name: 'pageId', rules: [rules.required('请选择页面')] }
        )

        this.bindInputElement(this.marginTopElement, 'marginTop');
        this.bindInputElement(this.marginBootomElement, 'marginBottom');
    }

    render() {
        let { items } = this.state;
        let station = this.props.elementPage.createService(AdminStation);

        return [
            <div key="form" className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-2">边距</label>
                    <div className="col-sm-5">
                        <div className="input-group">
                            <input className="form-control" placeholder="导航栏的上边距"
                                ref={(e) => this.marginTopElement = e || this.marginTopElement} />
                            <span className="input-group-addon">px</span>
                        </div>
                    </div>
                    <div className="col-sm-5">
                        <div className="input-group">
                            <input className="form-control" placeholder="导航栏的下边距"
                                ref={(e) => this.marginBootomElement = e || this.marginBootomElement} />
                            <span className="input-group-addon">px</span>
                        </div>
                    </div>
                </div>
            </div>,
            <ul key="items">
                {items.length > 0 ?
                    items.map((o, i) =>
                        <li key={i}>
                            <div className="name">{o.name}</div>
                            <div className="page-name btn-link"
                                onClick={() => null}
                                title={"点击修改导航页面"}
                                ref={async (e: HTMLElement) => {
                                    if (!e) return;
                                    let station = this.elementPage.createService(UserStation);
                                    if (!o.pageId) return;
                                    let pageData = await station.pages.pageDataById(o.pageId);
                                    if (pageData != null) {
                                        e.innerHTML = pageData.name;
                                    }
                                    e.onclick = () => {
                                        app.redirect(siteMap.nodes.station_page, { pageId: o.pageId });
                                    }

                                }}>{o.pageId}</div>

                            <button className="btn-link pull-right" type="button"
                                ref={(e: HTMLButtonElement) => e ?
                                    ui.buttonOnClick(e, () => this.removeItem(o), { confirm: `确定要删除"${o.name}"吗` }) : null}>删除</button>

                            <button className="btn-link pull-right" type="button"
                                onClick={() => this.showDialog(o)}>编辑</button>

                            {o.pageId ? <button className="btn-link pull-right" type="button"
                                ref={async (e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = () => {
                                        app.redirect(siteMap.nodes.station_page, { pageId: o.pageId });
                                    }
                                }}>
                                修改页面</button> : null}

                            <div className="clearfix"></div>
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
                            <h4 className="modal-title">导航菜单项</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-3 control-label">名称</label>
                                <div className="col-lg-9">
                                    <input name="name" type="text" className="form-control" placeholder="请输名称" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">显示页面</label>
                                <div className="col-lg-9">
                                    <div className="input-group">
                                        <input name="pageName" type="text" className="form-control" placeholder="请选择要显示的页面"
                                            readOnly={true} />
                                        <span className="input-group-addon">
                                            <i className=" icon-cog" style={{ cursor: 'pointer' }}
                                                onClick={() => this.showPageSelectDialog()}>
                                            </i>
                                        </span>
                                    </div>
                                    <input name="pageId" type="hidden" className="form-control" placeholder="pageId" />
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
            </div>,
            ReactDOM.createPortal([
                <PageSelectDialog key="pageSelectDialog" station={station}
                    ref={(e) => this.pageSelectDialog = e || this.pageSelectDialog} />
            ], document.body)
        ]
    }
}