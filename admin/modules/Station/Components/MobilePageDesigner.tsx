import components from 'mobileComponents/componentDefines';
import StyleControl from 'mobileComponents/style/control';
import { MobilePage } from 'modules/Station/Components/MobilePage';
import { Component as Control, componentsDir } from 'mobileComponents/common';
import { Editor, EditorProps } from 'mobileComponents/editor';
import { PageData, ControlData, guid, StationService } from 'services/Station';
import { PageComponent, PageView, PageHeader, PageFooter } from 'mobileControls';
import * as ui from 'ui';

let station = new StationService();

export interface Props extends React.Props<MobilePageDesigner> {
    pageData?: PageData | string,
    showComponentPanel?: boolean
}

export interface State {
    pageData?: PageData | string,
    editors: React.ReactElement<any>[]
}

export class MobilePageDesigner extends React.Component<Props, State> {
    private editorsElement: HTMLElement;
    private currentEditor: HTMLElement;
    private allContainer: HTMLElement;
    private _element: HTMLElement;
    private selectedContainer: HTMLElement;
    private controls: [string, React.Component<any, any>][];

    saved: chitu.Callback<MobilePageDesigner, { pageData: PageData }>;

    constructor(props: Props) {
        super(props);
        this.state = { pageData: props.pageData, editors: [] };
        this.controls = [];
        this.saved = chitu.Callbacks();
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

    getControlType(controlName: string): Promise<React.ComponentClass<any>> {
        return new Promise((resolve, reject) => {
            requirejs([`mobileComponents/${controlName}/control`], function (exports) {
                resolve(exports.default);
            })
        })
    }

    async createControlInstance(controlData: ControlData, element: HTMLElement) {
        let { controlId, controlName, data, selected } = controlData;
        let controlType = await this.getControlType(controlName);
        let reactElement = React.createElement(controlType, data);
        let control = ReactDOM.render(reactElement, element);
        control.id = controlId;
        this.controls.push([control.id, control]);
        return { control, controlType };
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
            let control = this.controls.filter(c => c[0] == o.controlId)[0];
            console.assert(control != null);
            o.data = control[1].state;
        });

        return station.savePageData(this.state.pageData).then(data => {
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

    renderControls(controls: ControlData[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div key={o.controlId}
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    this.createControlInstance(o, e)
                        .then(data => {
                            if (o.selected != 'disabled') {
                                e.onclick = (event) => {
                                    for (let i = 0; i < controls.length; i++) {
                                        controls[i].selected = controls[i].controlId == o.controlId;
                                    }
                                    this.setState(this.state);
                                }
                            }

                            if (o.selected == true) {
                                this.selecteControl(data.control, data.controlType);
                            }
                        });


                }} />
        );
    }

    renderHeader(pageData: PageData): JSX.Element {
        if (!pageData.header)
            return null;

        return (
            <PageHeader>
                {this.renderControls(pageData.controls)}
            </PageHeader>
        )
    }

    renderFooter(pageData: PageData): JSX.Element {
        if (!pageData.footer)
            return null;

        return (
            <PageFooter>
                {this.renderControls(pageData.footer.controls)}
            </PageFooter>
        )
    }


    renderViews(pageData: PageData) {

        let sortableElement = (element: HTMLElement, viewIndex: number) => {
            type UI = { item: JQuery, placeholder: JQuery, helper: JQuery };
            $(element).sortable({
                axis: "y",
                receive: (event: Event, ui: UI) => {
                    let element = ui.helper[0] as HTMLElement;
                    element.removeAttribute('style');
                    debugger;
                    let controlName = ui.item.attr('data-controlName');
                    console.assert(controlName != null);
                    ui.helper.remove();
                    pageData.views[viewIndex].controls.push({ controlId: guid(), controlName, data: {} });
                    this.setState(this.state);
                }
            })
        }

        return (pageData.views || []).map((o, i) => (
            <section key={i} ref={(e: HTMLElement) => e != null ? sortableElement(e, i) : null}>
                {this.renderControls(o.controls)}
            </section>
        ));
    }

    render() {
        let h = React.createElement;
        let children = (React.Children.toArray(this.props.children) || []);
        let pageData = this.state.pageData;
        let { showComponentPanel } = this.props;
        return (
            <div ref={(e: HTMLElement) => this._element = e || this._element}>
                <div style={{ position: 'absolute' }}>
                    <MobilePage >
                        {typeof pageData == 'string' ?
                            <div ref={(e: HTMLElement) => {
                                this.createControlInstance({ controlId: guid(), controlName: pageData as string, data: {} }, e)
                            }}>
                            </div> :
                            <PageComponent ref={(e) => { this.selectedContainer = e != null ? e.element : this.selectedContainer }}>
                                {this.renderHeader(pageData)}
                                {this.renderViews(pageData)}
                                {this.renderFooter(pageData)}
                            </PageComponent>
                        }
                        {children}
                    </MobilePage>
                </div>

                <div className="admin-pc" style={{ paddingLeft: 390 }} >
                    <ul style={{ margin: 0 }}>
                        <div className="pull-right">
                            <button className="btn btn-primary" style={{ marginLeft: 4 }}
                                ref={(e: HTMLButtonElement) => e != null ? e.onclick = ui.buttonOnClick(() => this.save()) : null}>保存</button>
                        </div>
                        <div className="pull-right">
                            <button className="btn btn-primary" style={{ marginLeft: 4 }}>预览</button>
                        </div>
                        <div className="clearfix">
                        </div>
                    </ul>
                    <hr style={{ margin: 0 }} />
                    <h5 style={{ display: showComponentPanel == true ? 'block' : 'none' }}>页面组件</h5>
                    <ul ref={(e: HTMLElement) => this.allContainer = e || this.allContainer}
                        style={{
                            padding: 0, listStyle: 'none',
                            display: showComponentPanel == true ? 'block' : 'none'
                        }}>
                        {components.map((c, i) => (
                            <li key={c.name} data-controlName={c.name}
                                style={{
                                    float: 'left', height: 80, width: 80, border: 'solid 1px #ccc', marginLeft: 4,
                                    textAlign: 'center', paddingTop: 20, backgroundColor: 'white', zIndex: 100
                                }} >
                                <img src={c.icon} />
                                {c.displayName}
                            </li>
                        ))}
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
