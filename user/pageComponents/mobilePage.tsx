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
    constructor(props) {
        super(props);
        this.state = { pageData: this.props.pageData };
    }

    static getInstanceByElement(element: HTMLElement): MobilePage {
        return (element as any).mobilePage;
    }

    static async createControlInstance(controlData: ControlData, element: HTMLElement) {
        let { controlId, controlName, data, selected } = controlData;
        let controlType = await MobilePage.getControlType(controlName);
        let reactElement = React.createElement(controlType, data);
        let control = ReactDOM.render(reactElement, element);
        control.id = controlId;
        return { control, controlType };
    }

    static getControlType(controlName: string): Promise<React.ComponentClass<any>> {
        return new Promise((resolve, reject) => {
            requirejs([`mobileComponents/${controlName}/control`], function (exports) {
                resolve(exports.default);
            })
        })
    }

    renderControls(controls: ControlData[]) {
        if (this.props.designTime) {
            return this.renderDesigntimeControls(controls);
        }

        return this.renderRuntimeControls(controls);
    }

    static renderControl(controlData: ControlData) {
        let o = controlData;
        let runtimeControl = (
            <div id={o.controlId} key={o.controlId}
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    MobilePage.createControlInstance(o, e);


                }} />
        );

        return runtimeControl;
    }

    renderRuntimeControls(controls: ControlData[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div id={o.controlId} key={o.controlId}
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    MobilePage.createControlInstance(o, e);


                }} />
        );
    }
    renderDesigntimeControls(controls: ControlData[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div id={o.controlId} key={o.controlId}
                ref={(e: HTMLElement) => {
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
                    debugger;
                    let controlName = ui.item.attr('data-controlName');
                    console.assert(controlName != null);
                    ui.helper.remove();
                    pageData.views[viewIndex].controls.push({ controlId: guid(), controlName, data: {} });
                    this.setState(this.state);
                },
                update: (event, ui) => {
                    debugger;
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