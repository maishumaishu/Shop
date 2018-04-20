import components from 'user/components/componentDefines';
import StyleControl from 'user/components/style/control';
import { VirtualMobile } from 'virtualMobile';
import { MobilePage } from 'user/components/mobilePage';
import { Control, componentsDir, IMobilePageDesigner } from 'user/components/common';
import { Editor, EditorProps } from 'user/components/editor';
import { guid, StationService } from 'adminServices/station';
import { PropTypes } from 'prop-types';

import { AppError, ErrorCodes } from 'share/common';
import { DesignTimeUserApplication } from 'modules/station/components/designTimeUserApplication';

import * as ui from 'ui';
import 'jquery-ui';
import app from 'application';
import siteMap from 'siteMap';
import { siteMap as userSiteMap, app as userApp } from 'user/site';
import { PageDatas } from 'userServices/stationService';

export interface Props extends React.Props<MobilePageDesigner> {
    pageData: PageData,
    showComponentPanel?: boolean,
    showPageEditor?: boolean,
    showMenuSwitch?: boolean,
    save: (pageData: PageData) => Promise<PageData>,
    pageDatas: PageDatas,
}

export interface State {
    editors: React.ReactElement<any>[],
    pageData: PageData,
}

export class MobilePageDesigner extends React.Component<Props, State> {
    private hasChanged: boolean = false;
    private userApp: DesignTimeUserApplication;
    private virtualMobile: VirtualMobile;
    private editorsElement: HTMLElement;
    private currentEditor: HTMLElement;
    private allContainer: HTMLElement;
    private _element: HTMLElement;
    private selectedContainer: HTMLElement;
    private mobilePage: MobilePage;
    private selectedControlId: string;
    private editorNameElement: HTMLElement;
    private editorName: string;
    // private userStation: UserStation;

    saved: chitu.Callback1<MobilePageDesigner, { pageData: PageData }>;

    constructor(props: Props) {
        super(props);
        if (this.props.pageData == null)
            throw new Error("Property of pageData cannt be null.");

        let pageData = JSON.parse(JSON.stringify(this.props.pageData)) as PageData;
        if (!pageData.footer)
            pageData.footer = { controls: [] };

        console.assert(pageData.footer.controls != null, 'footer controls is null.');

        this.state = { editors: [], pageData };
        let existsStyleControl = pageData.footer.controls.filter(o => o.controlName == 'style').length > 0;
        if (!existsStyleControl) {
            this.props.pageDatas.style().then(stylePageData => {
                let styleControl = stylePageData.footer.controls[0];
                console.assert(styleControl != null && styleControl.controlName == 'style');
                styleControl.selected = 'disabled';
                this.state.pageData.footer.controls.push(styleControl);
                this.setState(this.state);
            })
        }

        let existsMenuControl = pageData.footer.controls.filter(o => o.controlName == 'menu').length > 0;
        if (!existsMenuControl && pageData.showMenu) {
            this.loadMenu();
        }

        this.saved = chitu.Callbacks<MobilePageDesigner, { pageData: PageData }>();

        if (pageData._id == null) {
            // pagesDatas.createDefaultPage = (pageData) => this.station.savePageData(pageData);
            // let station = this.props.pageData
            this.props.save(this.props.pageData).then(data => {
                this.props.pageData._id = data._id;
            });
        }
    }

    async loadMenu() {
        let menuPageData = await this.props.pageDatas.menu();
        let menuControlData = menuPageData.footer.controls.filter(o => o.controlName == 'menu')[0];
        console.assert(menuControlData != null);
        menuControlData.selected = 'disabled';
        this.state.pageData.footer.controls.push(menuControlData);
        this.setState(this.state);
    }

    unloadMenu() {
        var controls = this.state.pageData.footer.controls.filter(o => o.controlName != 'menu');
        this.state.pageData.footer.controls = controls;
        this.setState(this.state);
    }

    static childContextTypes = { designer: PropTypes.object };

    getChildContext(): { designer: IMobilePageDesigner } {
        return { designer: this }
    }

    get element() {
        return this._element;
    }

    save() {
        let pageData = this.props.pageData;
        let controlDatas = new Array<ControlDescrtion>();
        //=====================================================================
        // 将 pageData 中的所以控件找出来，放入到 controlDatas
        (pageData.views || []).forEach(view => controlDatas.push(...view.controls || []));
        pageData.views = JSON.parse(JSON.stringify(this.mobilePage.state.pageData.views || []));
        pageData.footer = JSON.parse(JSON.stringify(this.mobilePage.state.pageData.footer || []));
        pageData.header = JSON.parse(JSON.stringify(this.mobilePage.state.pageData.header || {}));

        for (let i = 0; i < pageData.views.length; i++) {
            setControlValues(this.mobilePage, pageData.views[i].controls);
        }

        if (pageData.footer) {
            setControlValues(this.mobilePage, pageData.footer.controls);
        }

        function setControlValues(mobilePage: MobilePage, controls: ControlDescrtion[]) {
            for (let i = 0; i < controls.length; i++) {
                let componet = (mobilePage.controls.filter(c => c.controlId == controls[i].controlId)[0]) as any as Control<any, any>;
                console.assert(componet != null);

                let keys = componet.persistentMembers || [];
                let data = {};
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    data[key] = componet.state[key];
                }
                controls[i].data = data;
            }
        }

        let save = this.props.save;
        return save(pageData).then(data => {
            this.saved.fire(this, { pageData })
            this.hasChanged = false;
            return data;
        });
    }

    selecteControl(control: Control<any, any> & { id?: string }, controlType: React.ComponentClass<any>) {
        if (!control.id)
            control.id = guid();

        let controlName = controlType.name;
        if (controlName.endsWith('Control')) {
            controlName = controlName[0].toLowerCase() + controlName.substr(1, controlName.length - 'Control'.length - 1);
        }
        let editorPathName = Editor.path(controlName);
        let editorId = `editor-${control.id}`;
        let editorElement = this.editorsElement.querySelector(`[id='${editorId}']`) as HTMLElement;

        this.selectedControlId = control.id;
        this.editorName =
            components.filter(o => o.name == controlName).map(o => o.displayName)[0] || controlName;

        if (this.editorNameElement)
            this.editorNameElement.innerHTML = this.editorName;

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
            console.assert(control.elementPage != null, 'element page is null');
            let editorReactElement = React.createElement(editorType, { control, elementPage: control.elementPage } as EditorProps);
            let editor: Editor<any, any> = ReactDOM.render(editorReactElement, editorElement);
            control.stateChanged.add(() => {
                this.hasChanged = true;
            })
        })
    }

    removeControl(controlId: string) {
        let pageData = this.state.pageData;
        if (pageData.header != null && pageData.header.controls) {
            pageData.header.controls = pageData.header.controls.filter(o => o.controlId != controlId);
        }

        if (pageData.views != null) {
            for (let i = 0; i < pageData.views.length; i++) {
                if (pageData.views[i].controls == null)
                    continue;

                pageData.views[i].controls = pageData.views[i].controls.filter(o => o.controlId != controlId);
            }
        }

        if (pageData.footer != null && pageData.footer.controls != null) {
            pageData.footer.controls = pageData.footer.controls.filter(o => o.controlId != controlId);
        }

        this.setState(this.state);
        return Promise.resolve();
    }

    preview() {
        if (this.hasChanged || !this.props.pageData._id) {
            ui.alert({ title: '提示', message: `预览前必须先保存页面, 请点击"保存"按钮保存页面` });
            return;
        }
        let url = userApp.createUrl(userSiteMap.nodes.page, { pageId: this.props.pageData._id });
        open(url, '_blank');
    }

    renederVirtualMobile(screenElement: HTMLElement, pageData: PageData) {
        console.assert(screenElement != null);

        if (this.userApp == null) {
            this.userApp = new DesignTimeUserApplication(screenElement);
            this.userApp.designPageNode.action = (page: chitu.Page) => {
                ReactDOM.render(<MobilePage ref={(e) => this.mobilePage = e} pageData={pageData}
                    elementPage={page}
                    designTime={{
                        controlSelected: (a, b) => this.selecteControl(a, b)
                    }} />, page.element);

                $(this.allContainer).find('li').draggable({
                    connectToSortable: $(page.element).find("section"),
                    helper: "clone",
                    revert: "invalid"
                });
            }

            this.userApp.showDesignPage();
        }
        else {
            this.userApp.currentPage.reload();
        }

        //==============================================
        // 关闭所以页面
        // while (this.userApp.currentPage != null) {
        //     this.userApp.currentPage.close();
        // }
        //==============================================



    }

    render() {
        let h = React.createElement;
        let children = (React.Children.toArray(this.props.children) || []);
        let { pageData } = this.state;
        // let selectedControlId = this.selectedControlId;
        let { showComponentPanel } = this.props;

        return (
            <div ref={(e: HTMLElement) => this._element = e || this._element}>
                <div style={{ position: 'absolute' }}>
                    <VirtualMobile ref={(e) => {
                        if (!e) return;
                        this.virtualMobile = e;

                        // let routeData = userApp.parseRouteString("");

                        setTimeout(() => {
                            // debugger;
                            this.renederVirtualMobile(e.screenElement, pageData);

                        }, 100);

                    }} >

                        {children}
                    </VirtualMobile>
                </div>

                <div className="admin-pc" style={{ paddingLeft: 390 }} >
                    <ul style={{ margin: 0 }}>
                        {this.props.showMenuSwitch ? <li className="pull-left">
                            <div className="pull-left" style={{ paddingTop: 4, paddingRight: 10 }}>
                                显示导航菜单
                            </div>
                            <label className="pull-left switch">
                                <input type="checkbox" className="ace ace-switch ace-switch-5"
                                    ref={(e: HTMLInputElement) => {
                                        if (!e) return;

                                        e.checked = pageData.showMenu;
                                        e.onchange = async () => {
                                            this.props.pageData.showMenu = pageData.showMenu = e.checked;
                                            if (e.checked)
                                                this.loadMenu();
                                            else
                                                this.unloadMenu();
                                        }
                                    }} />
                                <span className="lbl middle"></span>
                            </label>
                        </li> : null}
                        <li className="pull-right">
                            <button className="btn btn-sm btn-primary"
                                ref={(e: HTMLButtonElement) => e != null ? e.onclick = ui.buttonOnClick(() => this.save(), { toast: '保存页面成功' }) : null}>
                                <i className="icon-save" />
                                <span>保存</span>
                            </button>
                        </li>
                        <li className="pull-right">
                            <button className="btn btn-sm btn-primary" onClick={() => this.preview()}>
                                <i className="icon-eye-open" />
                                <span>预览</span>
                            </button>
                        </li>
                        <li className="clearfix">
                        </li>
                    </ul>

                    <div className="clear-fix" />
                    <hr style={{ margin: 0 }} />

                    <div className="form-group" style={{ height: 40, display: this.props.showPageEditor == true ? 'block' : 'none', marginTop: 20 }}>
                        <div className="row">
                            <div className="col-sm-4">
                                <label className="control-label pull-left" style={{ paddingTop: 8 }}>名称</label>
                                <div style={{ paddingLeft: 40 }}>
                                    <input name="name" className="form-control" placeholder="请输入页面名称（必填）"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = pageData.name || '';
                                            e.onchange = () => {
                                                pageData.name = e.value;
                                                {/* this.setState(this.state); */ }
                                            }
                                        }} />
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <label className="control-label pull-left" style={{ paddingTop: 8 }}>备注</label>
                                <div style={{ paddingLeft: 40 }}>
                                    <input name="remark" className="form-control pull-left" placeholder="请输入页面备注（选填）"
                                        ref={(e: HTMLInputElement) => {
                                            if (!e) return;
                                            e.value = pageData.remark || '';
                                            e.onchange = () => {
                                                pageData.remark = e.value;
                                            }
                                        }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <hr style={{ display: this.props.showPageEditor == true ? 'block' : 'none' }} />
                        <h5 style={{ display: showComponentPanel == true ? 'block' : 'none' }}>页面组件</h5>
                        <ul ref={(e: HTMLElement) => this.allContainer = e || this.allContainer}
                            style={{
                                padding: 0, listStyle: 'none',
                                display: showComponentPanel == true ? 'block' : 'none'
                            }}>
                            {components.map((c, i) => {
                                return (
                                    <li key={c.name} data-control-name={c.name} data-target={c.target}
                                        style={{
                                            float: 'left', height: 80, width: 80, border: 'solid 1px #ccc', marginLeft: 4,
                                            textAlign: 'center', paddingTop: 8, backgroundColor: 'white', zIndex: 100
                                        }} >
                                        <div>
                                            <i className={c.icon} style={{ fontSize: 44 }} />
                                        </div>
                                        <div>
                                            {c.displayName}
                                        </div>
                                    </li>
                                )
                            })}
                            <li className="clearfix"></li>
                        </ul>
                    </div>

                    {showComponentPanel ?
                        <div className="form-group">
                            <div className="well">
                                <i className="icon-remove" style={{ cursor: 'pointer' }}
                                    ref={(e: HTMLElement) => {
                                        if (e == null) return;
                                        e.onclick = ui.buttonOnClick(
                                            () => this.removeControl(this.selectedControlId),
                                            {
                                                confirm: () => {
                                                    return `确定要移除控件'${this.editorNameElement.innerHTML}'吗？`
                                                }
                                            });

                                    }}></i>
                                <span style={{ paddingLeft: 8 }}
                                    ref={(e: HTMLElement) => this.editorNameElement = e || this.editorNameElement} />
                                <hr style={{ marginTop: 14 }} />
                                <div ref={(e: HTMLElement) => this.editorsElement = e || this.editorsElement}>
                                </div>
                            </div>
                        </div> :
                        <div ref={(e: HTMLElement) => this.editorsElement = e || this.editorsElement}>
                        </div>
                    }
                </div>
                <div className="clearfix">
                </div>
            </div>
        );
    }
}
