import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import MenuControl from 'user/components/menu/control';
import { Control, ControlProps } from 'user/components/common';

export interface Props extends React.Props<MobilePage> {
    pageData: PageData;
    elementPage: chitu.Page;
    designTime?: {
        controlSelected?: (
            control: Control<any, any>,
            controlType: React.ComponentClass<any>
        ) => void
    };
}

export interface ControlDescription {
    controlId: string;
    controlName: string;
    data?: any;
    selected?: boolean | 'disabled';
}

export type ControlPair = { control: Control<any, any>, controlType: React.ComponentClass<any> }
const menuHeight = 50;
type State = { pageData: PageData };
export class MobilePage extends React.Component<Props, State>{
    private screenElement: HTMLElement;
    private selecteControl: ControlPair;

    private headerControlsCount: number = 0;
    private footerControlsCount: number = 0;
    private viewControlsCount: number = 0;
    private createdControlCount: number = 0;

    private footerElement: HTMLElement;
    private headerElement: HTMLElement;

    controls: (Control<any, any> & { controlId: string, controlName: string })[];

    constructor(props) {
        super(props);
        this.state = { pageData: this.props.pageData };
        this.controls = [];
    }

    static getInstanceByElement(element: HTMLElement): MobilePage {
        return (element as any).mobilePage;
    }

    async createControlInstance(controlData: ControlDescription, element: HTMLElement): Promise<ControlPair> {
        let { controlId, controlName, data, selected } = controlData;
        let types = await MobilePage.getControlType(controlName);

        let props: ControlProps<any> = Object.assign({}, data || {});
        props.mobilePage = this;
        console.assert(this.props.elementPage != null);
        let reactElement = React.createElement(types.Control, props);
        let control: Control<any, any> = ReactDOM.render(reactElement, element);
        // control.mobilePage = this;
        element.className = `${controlName}-control`;
        control.id = controlId;
        let result: ControlPair = { control, controlType: types.Control };
        return result;
    }

    static getControlType(controlName: string): Promise<{ Control: React.ComponentClass<any>, Props: { new() } }> {

        let arr = controlName.split(':');
        let fileName = arr[0];
        let name = arr[1] || 'default';

        let filePath = `user/components/${fileName}/control`;
        return new Promise((resolve, reject) => {
            requirejs([filePath], function (exports) {
                resolve({ Control: exports[name], Props: exports.Props });
            })
        })
    }

    static childContextTypes = { mobilePage: PropTypes.object };

    getChildContext(): { mobilePage: MobilePage } {
        return { mobilePage: this }
    }

    //======================================================================================
    // For Design Time
    // controlCreated(control: Control<any, any>, controlType: React.ComponentClass<any>) {
    //     this.createdControlCount = this.createdControlCount + 1;
    //     var total = this.headerControlsCount + this.footerControlsCount + this.viewControlsCount;
    //     if (this.createdControlCount == total && this.selecteControl != null &&
    //         this.props.designTime.controlSelected != null) {
    //         let c = this.selecteControl;
    //         // 加上延时，否则编辑器有可能显示不出来
    //         setTimeout(() => {
    //             this.props.designTime.controlSelected(c.control, c.controlType);
    //         }, 100);
    //     }
    // }
    //======================================================================================

    renderControls(controls: ControlDescription[]) {
        if (this.props.designTime) {
            return this.renderDesigntimeControls(controls);
        }

        return this.renderRuntimeControls(controls);
    }

    renderControl(controlData: ControlDescription) {
        let o = controlData;
        let runtimeControl = (
            <div id={o.controlId} key={o.controlId}
                ref={async (e: HTMLElement) => {
                    if (!e) return;
                    var c = await this.createControlInstance(o, e);
                    let obj = Object.assign(c.control, { controlId: o.controlId, controlName: o.controlName });
                    this.controls.push(obj);

                }} />
        );

        return runtimeControl;
    }

    renderRuntimeControls(controls: ControlDescription[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div id={o.controlId} key={o.controlId}
                ref={async (e: HTMLElement) => {
                    if (!e) return;
                    var c = await this.createControlInstance(o, e);
                    var componet = Object.assign(c.control, { controlId: o.controlId, controlName: o.controlName });
                    this.controls.push(componet);
                }} />
        );
    }
    renderDesigntimeControls(controls: ControlDescription[]) {
        controls = controls || [];
        return controls.map((o, i) =>
            <div id={o.controlId} key={o.controlId}
                ref={async (e: HTMLElement) => {
                    if (!e) return;

                    var c = await this.createControlInstance(o, e);
                    var componet = Object.assign(c.control, { controlId: o.controlId, controlName: o.controlName });
                    this.controls.push(componet);

                    if (o.selected != 'disabled') {
                        e.onclick = (event) => {
                            for (let i = 0; i < controls.length; i++) {
                                controls[i].selected = controls[i].controlId == o.controlId;
                            }
                            this.props.designTime.controlSelected(c.control, c.controlType);
                            event.preventDefault();
                        }
                    }

                    if (o.selected == true) {
                        this.selecteControl = c;
                    }

                }} />
        );
    }

    renderHeader(pageData: PageData): JSX.Element {
        if (!pageData.header)
            return null;

        let headerControls = (pageData.header || { controls: [] }).controls || [];
        this.headerControlsCount = headerControls.length;
        return (
            <header key="header" className="page-header"
                ref={(e: HTMLElement) => this.headerElement = e || this.headerElement}>
                {this.renderControls(headerControls)}
            </header>
        )
    }

    renderFooter(pageData: PageData): JSX.Element {
        let footerControls = (pageData.footer || { controls: [] }).controls || [];
        return (
            <footer key="footer" className="page-footer"
                ref={(e: HTMLElement) => this.footerElement = e || this.footerElement}>
                {this.renderControls(footerControls)}
            </footer>
        )
    }


    renderViews(pageData: PageData) {
        let views = pageData.views || [];

        let designMode = this.props.designTime;
        if (designMode) {
            return this.renderDesigntimeViews(pageData);
        }

        return this.renderRuntimeViews(pageData);
    }

    renderRuntimeViews(pageData: PageData) {
        let views = pageData.views || [];
        return views.map((o, i) => (
            <section key={`view${i}`} className="page-view"
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    this.setPageElementClassName(e, pageData);
                    setTimeout(() => {
                        if (this.footerElement) {
                            let height = this.footerElement.offsetHeight;
                            e.style.paddingBottom = `${height}px`;
                        }

                        if (this.headerElement) {
                            let height = this.headerElement.offsetHeight;
                            e.style.paddingTop = `${height}px`;
                        }

                    }, 500);
                }}>
                {this.renderControls(o.controls)}
            </section>
        ));
    }

    private setPageElementClassName(viewElement: HTMLElement, pageData: PageData) {
        console.assert(viewElement != null);

        let pageElement = viewElement.parentElement;
        console.assert(pageElement != null);

        let className = pageElement.className;
        if (pageData.className && className.indexOf(pageData.className) < 0) {
            className = className + ' ' + pageData.className;
            pageElement.className = className;
        }
    }

    renderDesigntimeViews(pageData: PageData) {
        let sortableElement = (element: HTMLElement, viewIndex: number) => {
            type UI = { item: JQuery, placeholder: JQuery, helper: JQuery };

            let newControlIndex: number;
            $(element).sortable({
                axis: "y",
                change: () => {
                    for (let i = 0; i < element.children.length; i++) {
                        if (!element.children.item(i).id) {
                            newControlIndex = i;
                            break;
                        }
                    }
                },
                receive: (event: Event, ui: UI) => {
                    let helper = ui.helper[0] as HTMLElement;
                    helper.removeAttribute('style');
                    let controlName = ui.item.attr('data-control-name');
                    let target = ui.item.attr('data-target');
                    console.assert(controlName != null);
                    ui.helper.remove();
                    if (target == 'footer')
                        pageData.footer.controls.push({ controlId: guid(), controlName, data: {} });
                    else if (target == 'header')
                        pageData.header.controls.push({ controlId: guid(), controlName, data: {} });
                    else {
                        let children = element.children;
                        debugger;
                        console.assert(newControlIndex != null);
                        pageData.views[viewIndex].controls.splice(newControlIndex, 0, { controlId: guid(), controlName, data: {} });
                        newControlIndex = null;
                        // pageData.views[viewIndex].controls.push({ controlId: guid(), controlName, data: {} });
                    }

                    this.setState(this.state);
                },
                update: (event, ui) => {
                    let view_controls = [];
                    let footer_controls = [];
                    //===================================================
                    // 排序 view controls
                    for (let i = 0; i < element.children.length; i++) {
                        let child = element.children[i] as HTMLElement;
                        let control = pageData.views[viewIndex].controls.filter(o => o.controlId == child.id)[0];
                        console.assert(control != null);
                        view_controls[i] = control;
                    }
                    //===================================================
                    for (let i = 0; i < this.footerElement.children.length; i++) {
                        let child = this.footerElement.children[i] as HTMLElement;
                        let control = pageData.footer.controls.filter(o => o.controlId == child.id)[0];
                        footer_controls[i] = control;
                    }
                    //===================================================

                    pageData.views[viewIndex].controls = view_controls;
                    pageData.footer.controls = footer_controls;
                }
            })
        }

        return (pageData.views || []).map((o, i) => (
            <section key={i}
                ref={(e: HTMLElement) => {
                    if (!e) return;
                    sortableElement(e, i);
                    this.setPageElementClassName(e, pageData);
                    setTimeout(() => {
                        if (this.footerElement) {
                            let height = this.footerElement.offsetHeight;
                            e.style.paddingBottom = `${height}px`;
                        }

                        if (this.headerElement) {
                            let height = this.headerElement.offsetHeight;
                            e.style.paddingTop = `${height}px`;
                        }

                    }, 500);
                }}
            >
                {this.renderControls(o.controls)}
            </section>
        ));
    }

    render() {
        let children = React.Children.toArray(this.props.children) || [];
        let pageData = this.state.pageData;

        if (pageData.header && pageData.header.controls)
            this.headerControlsCount = pageData.header.controls.length;

        if (pageData.footer && pageData.footer.controls)
            this.footerControlsCount = pageData.footer.controls.length;

        let views = pageData.views || [];
        this.viewControlsCount = 0;
        for (let i = 0; i < views.length; i++) {
            this.viewControlsCount = this.viewControlsCount + (views[i].controls || []).length;
        }

        var result = [
            this.renderHeader(pageData),
            this.renderFooter(pageData),
            ...this.renderViews(pageData),
        ];

        // let footer_height = this.footerElement.offsetHeight;
        // debugger;

        if (this.props.designTime && this.props.designTime.controlSelected) {
            // 加上延时，否则编辑器有可能显示不出来
            setTimeout(() => {
                if (this.selecteControl != null) {
                    let c = this.selecteControl;
                    this.props.designTime.controlSelected(c.control, c.controlType);
                }
            }, 500);
        }

        return result;
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