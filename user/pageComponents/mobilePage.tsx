import { PageComponent, PageHeader, PageFooter, PageView } from 'mobileControls';
export interface Props extends React.Props<MobilePage> {
    pageData: PageData;
    designTime?: {
        controlSelected: (
            control: React.Component<any, any>,
            controlType: React.ComponentClass<any>) => void
    };
}

export interface ControlData {
    controlId: string;
    controlName: string;
    data?: any;
    selected?: boolean | 'disabled';
}

export interface PageData {
    _id?: string;
    name?: string;
    remark?: string;
    isDefault?: boolean;
    showMenu?: boolean;
    header?: {
        controls: ControlData[];
    };
    footer?: {
        controls: ControlData[];
    };
    views?: {
        controls: ControlData[];
    }[];
}

export class MobilePage extends React.Component<Props, { pageData: PageData }>{
    private screenElement: HTMLElement;
    components: (React.Component<any, any> & { controlId: string })[];

    constructor(props) {
        super(props);
        this.state = { pageData: this.props.pageData };
        this.components = [];
    }

    static getInstanceByElement(element: HTMLElement): MobilePage {
        return (element as any).mobilePage;
    }

    static async createControlInstance(controlData: ControlData, element: HTMLElement) {
        let { controlId, controlName, data, selected } = controlData;
        let types = await MobilePage.getControlType(controlName);
        let defaultProps = {};
        if (types.Props) {
            defaultProps = new types.Props();
        }
        data = Object.assign(defaultProps, data || {});
        let reactElement = React.createElement(types.Control, data);
        let control = ReactDOM.render(reactElement, element);
        control.id = controlId;
        return { control, controlType: types.Control };
    }

    static getControlType(controlName: string): Promise<{ Control: React.ComponentClass<any>, Props: { new () } }> {
        return new Promise((resolve, reject) => {
            requirejs([`mobileComponents/${controlName}/control`], function (exports) {
                resolve({ Control: exports.default, Props: exports.Props });
            })
        })
    }

    renderControls(controls: ControlData[]) {
        if (this.props.designTime) {
            return this.renderDesigntimeControls(controls);
        }

        return this.renderRuntimeControls(controls);
    }

    renderControl(controlData: ControlData) {
        let o = controlData;
        let runtimeControl = (
            <div id={o.controlId} key={o.controlId}
                ref={async (e: HTMLElement) => {
                    if (!e) return;
                    var c = await MobilePage.createControlInstance(o, e);
                    let obj = Object.assign(c.control, { controlId: o.controlId });
                    this.components.push(obj);

                }} />
        );

        return runtimeControl;
    }

    renderRuntimeControls(controls: ControlData[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div id={o.controlId} key={o.controlId}
                ref={async (e: HTMLElement) => {
                    if (!e) return;
                    var c = await MobilePage.createControlInstance(o, e);
                    var componet = Object.assign(c.control, { controlId: o.controlId });
                    this.components.push(componet);
                }} />
        );
    }
    renderDesigntimeControls(controls: ControlData[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div id={o.controlId} key={o.controlId}
                ref={async (e: HTMLElement) => {
                    if (!e) return;
                    MobilePage.createControlInstance(o, e)
                        .then(data => {
                            if (o.selected != 'disabled') {
                                e.onclick = (event) => {
                                    for (let i = 0; i < controls.length; i++) {
                                        controls[i].selected = controls[i].controlId == o.controlId;
                                    }
                                    this.setState(this.state);
                                }
                            }

                            if (o.selected == true && this.props.designTime.controlSelected) {
                                this.props.designTime.controlSelected(data.control, data.controlType)
                            }
                        });

                    var c = await MobilePage.createControlInstance(o, e);
                    var componet = Object.assign(c.control, { controlId: o.controlId });
                    this.components.push(componet);
                }} />
        );
    }

    renderHeader(pageData: PageData): JSX.Element {
        if (!pageData.header)
            return null;

        return (
            <PageHeader>
                {this.renderControls(pageData.header.controls)}
            </PageHeader>
        )
    }

    renderFooter(pageData: PageData): JSX.Element {
        let footerControls = (pageData.footer || { controls: [] }).controls || [];
        // let headerControls = (pageData.header || { controls: [] }).controls || [];

        // let allControls = [...headerControls, ...footerControls];
        // let views = pageData.views || [];
        // for (let i = 0; i < views.length; i++) {
        //     let controls = views[i].controls || [];
        //     allControls.push(...controls);
        // }

        return (
            <PageFooter>
                {this.renderControls(footerControls)}
                {/*{allControls.filter(o => o.controlName == 'style').length == 0 ?
                    this.renderControls([{ controlId: guid(), controlName: 'style', data: {} }]) : null
                }*/}
            </PageFooter>
        )
    }


    renderViews(pageData: PageData) {
        let designMode = this.props.designTime;
        if (designMode) {
            return this.renderDesigntimeViews(pageData);
        }

        return this.renderRuntimeViews(pageData);
    }

    renderRuntimeViews(pageData: PageData) {
        return (pageData.views || []).map((o, i) => (
            <PageView key={i}>
                {this.renderControls(o.controls)}
            </PageView>
        ));
    }

    renderDesigntimeViews(pageData: PageData) {
        let sortableElement = (element: HTMLElement, viewIndex: number) => {
            type UI = { item: JQuery, placeholder: JQuery, helper: JQuery };
            $(element).sortable({
                axis: "y",
                receive: (event: Event, ui: UI) => {
                    let element = ui.helper[0] as HTMLElement;
                    element.removeAttribute('style');
                    let controlName = ui.item.attr('data-controlName');
                    console.assert(controlName != null);
                    ui.helper.remove();
                    pageData.views[viewIndex].controls.push({ controlId: guid(), controlName, data: {} });
                    this.setState(this.state);
                },
                update: (event, ui) => {
                    let controls = [];
                    for (let i = 0; i < element.children.length; i++) {
                        let child = element.children[i] as HTMLElement;
                        let control = pageData.views[viewIndex].controls.filter(o => o.controlId == child.id)[0];
                        console.assert(control != null);
                        controls[i] = control;
                    }

                    pageData.views[viewIndex].controls = controls;
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
        let children = React.Children.toArray(this.props.children) || [];
        let pageData = this.state.pageData;

        // requirejs(['css!content/devices.css']);
        // let virtualPhone = (
            // <div className="marvel-device iphone5c blue">
            //     <div className="top-bar"></div>
            //     <div className="sleep"></div>
            //     <div className="volume"></div>
            //     <div className="camera"></div>
            //     <div className="sensor"></div>
            //     <div className="speaker"></div>
            //     <div className="screen"
            //         ref={(e: HTMLElement) => {
            //             if (!e) return;
            //             this.screenElement = e;
            //             (e as any).mobilePage = this;
            //         }}>
            //         <PageComponent>
            //             {this.renderHeader(pageData)}
            //             {this.renderViews(pageData)}
            //             {this.renderFooter(pageData)}
            //         </PageComponent>
            //     </div>
            //     <div className="home"></div>
            //     <div className="bottom-bar"></div>
            // </div>
        // );
        // return virtualPhone;
        return (
            <div>
                <PageComponent>
                    {this.renderHeader(pageData)}
                    {this.renderViews(pageData)}
                    {this.renderFooter(pageData)}
                </PageComponent>
            </div>
        );
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}