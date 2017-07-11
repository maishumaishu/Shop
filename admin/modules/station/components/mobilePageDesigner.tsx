import components from 'mobileComponents/componentDefines';
import StyleControl from 'mobileComponents/style/control';
import { VirtualMobile } from 'mobilePage';
import { MobilePage } from 'mobileComponents/mobilePage';
import { Component as Control, componentsDir, IMobilePageDesigner } from 'mobileComponents/common';
import { Editor, EditorProps } from 'mobileComponents/editor';
import { PageData, ControlData, guid, default as station } from 'services/station';
import { PageComponent, PageView, PageHeader, PageFooter } from 'mobileControls';
import * as ui from 'ui';

export interface Props extends React.Props<MobilePageDesigner> {
    pageData?: PageData,
    showComponentPanel?: boolean,
    showPageEditor?: boolean,
    save: (pageData: PageData) => Promise<any>
}

export interface State {
    pageData?: PageData,
    editors: React.ReactElement<any>[]
}

export class MobilePageDesigner extends React.Component<Props, State> {
    private editorsElement: HTMLElement;
    private currentEditor: HTMLElement;
    private allContainer: HTMLElement;
    private _element: HTMLElement;
    private selectedContainer: HTMLElement;
    private mobilePage: MobilePage;

    saved: chitu.Callback<MobilePageDesigner, { pageData: PageData }>;

    constructor(props: Props) {
        super(props);
        this.state = { pageData: props.pageData, editors: [] };
        this.saved = chitu.Callbacks();
    }

    static childContextTypes = { designer: React.PropTypes.object };

    getChildContext(): { designer: IMobilePageDesigner } {
        return { designer: this }
    }

    get element() {
        return this._element;
    }

    loadEditor(controlName: string, control: Control<any, any>, editorElement: HTMLElement) {
        let editorPathName = Editor.path(controlName);
        requirejs([editorPathName], (exports) => {
            let editorType = exports.default;
            console.assert(editorType != null, 'editor type is null');
            let editorReactElement = React.createElement(editorType, { control });
            ReactDOM.render(editorReactElement, editorElement);
        })
    }

    componentDidMount() {
        $(this.allContainer).find('li').draggable({
            connectToSortable: $(this.element).find(PageView.tagName),
            helper: "clone",
            revert: "invalid"
        });
    }

    save() {
        if (typeof this.state.pageData == 'string')
            return Promise.resolve();

        let pageData = this.state.pageData;
        let controlDatas = new Array<ControlData>();
        (pageData.views || []).forEach(view => controlDatas.push(...view.controls || []));
        if (pageData.header)
            controlDatas.push(...pageData.header.controls || []);

        if (pageData.footer)
            controlDatas.push(...pageData.footer.controls || [])

        controlDatas.forEach(o => {
            let control = this.mobilePage.components.filter(c => c.controlId == o.controlId)[0];
            console.assert(control != null);

            let data = {};
            for (let key in control.props) {
                data[key] = control.state[key];
            }

            o.data = data;
        });

        let save = this.props.save;
        return save(this.state.pageData).then(data => {
            this.saved.fire(this, { pageData })
            return data;
        });
    }

    selecteControl(control: React.Component<any, any> & { id?: string }, controlType: React.ComponentClass<any>) {
        if (!control.id)
            control.id = guid();

        let controlName = controlType.name;
        if (controlName.endsWith('Control')) {
            controlName = controlName[0].toLowerCase() + controlName.substr(1, controlName.length - 'Control'.length - 1);
        }
        let editorPathName = Editor.path(controlName);
        let editorId = `editor-${control.id}`;
        let editorElement = this.editorsElement.querySelector(`[id='${editorId}']`) as HTMLElement;

        if (this.currentEditor == editorElement && editorElement != null) {
            return;
        }

        if (this.currentEditor)
            this.currentEditor.style.display = 'none';

        if (editorElement != null) {
            editorElement.style.display = 'block';
            this.currentEditor = editorElement;
            return;
        }

        editorElement = document.createElement('div');
        editorElement.className = controlName;
        editorElement.id = editorId;
        this.editorsElement.appendChild(editorElement);

        if (this.currentEditor)
            this.currentEditor.style.display = 'none';

        this.currentEditor = editorElement;
        requirejs([editorPathName], (exports) => {
            let editorType = exports.default;
            console.assert(editorType != null, 'editor type is null');
            let editorReactElement = React.createElement(editorType, { control });
            ReactDOM.render(editorReactElement, editorElement);
        })
    }

    preview() {
        let pageId = this.props.pageData._id;
        if (!pageId) {
            alert(`页面必须保存`);
            return;
        }
        open(`#station/preView?pageId=${pageId}`, ':blank');
    }

    render() {
        let h = React.createElement;
        let children = (React.Children.toArray(this.props.children) || []);
        let pageData = this.state.pageData;
        let { showComponentPanel } = this.props;
        return (
            <div ref={(e: HTMLElement) => this._element = e || this._element}>
                <div style={{ position: 'absolute' }}>
                    <VirtualMobile >
                        <MobilePage ref={(e) => this.mobilePage = e} pageData={pageData}
                            designTime={{
                                controlSelected: (a, b) => this.selecteControl(a, b)
                            }} />
                        {children}
                    </VirtualMobile>
                </div>

                <div className="admin-pc" style={{ paddingLeft: 390 }} >
                    <ul style={{ margin: 0 }}>
                        <div className="pull-right">
                            <button className="btn btn-primary" style={{ marginLeft: 4 }}
                                ref={(e: HTMLButtonElement) => e != null ? e.onclick = ui.buttonOnClick(() => this.save(), { toast: '保存页面成功' }) : null}>保存</button>
                        </div>
                        <div className="pull-right">
                            <button className="btn btn-primary" style={{ marginLeft: 4 }}
                                onClick={() => this.preview()}>预览</button>
                        </div>
                        <div className="clearfix">
                        </div>
                    </ul>
                    <hr style={{ margin: 0 }} />
                    <h5 style={{ display: this.props.showPageEditor == true ? 'block' : 'none' }}>页面信息</h5>
                    <form style={{ height: 40, display: this.props.showPageEditor == true ? 'block' : 'none' }}>
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="control-label pull-left" style={{ paddingTop: 8 }}>名称</label>
                                <div style={{ paddingLeft: 40 }}>
                                    <input name="name" className="form-control" placeholder="请输入页面名称（选填）"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = pageData.name || '';
                                            e.onchange = () => {
                                                pageData.name = e.value;
                                                this.setState(this.state);
                                            }
                                        }} />
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <label className="control-label pull-left" style={{ paddingTop: 8 }}>备注</label>
                                <div style={{ paddingLeft: 40 }}>
                                    <input name="remark" className="form-control pull-left" placeholder="请输入页面备注（必填）"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = pageData.remark || '';
                                            e.onchange = () => {
                                                pageData.remark = e.value;
                                                this.setState(this.state);
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox"
                                            ref={(e: HTMLInputElement) => {
                                                if (!e) return;
                                                e.checked = pageData.showMenu;
                                                e.onchange = async () => {
                                                    pageData.showMenu = e.checked;
                                                    this.setState(this.state);
                                                }
                                            }} /> 显示菜单
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                    <hr style={{ display: this.props.showPageEditor == true ? 'block' : 'none' }} />
                    <h5 style={{ display: showComponentPanel == true ? 'block' : 'none' }}>页面组件</h5>
                    <ul ref={(e: HTMLElement) => this.allContainer = e || this.allContainer}
                        style={{
                            padding: 0, listStyle: 'none',
                            display: showComponentPanel == true ? 'block' : 'none'
                        }}>
                        {components.map((c, i) => {
                            return (
                                <li key={c.name} data-controlName={c.name}
                                    style={{
                                        float: 'left', height: 80, width: 80, border: 'solid 1px #ccc', marginLeft: 4,
                                        textAlign: 'center', paddingTop: 20, backgroundColor: 'white', zIndex: 100
                                    }} >
                                    <img src={c.icon} />
                                    {c.displayName}
                                </li>
                            )
                        })}
                        <li className="clearfix"></li>
                    </ul>
                    <div ref={(e: HTMLElement) => this.editorsElement = e || this.editorsElement}>
                    </div>
                </div>
                <div className="clearfix">
                </div>
            </div>
        );
    }
}
