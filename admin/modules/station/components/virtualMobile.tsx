import { default as station, PageData, ControlDescrtion } from 'adminServices/station';
import { PageComponent, PageHeader, PageFooter, PageView } from 'mobileControls';
import { Control } from 'mobileComponents/common';
import { default as StyleControl } from 'mobileComponents/style/control';
requirejs(['css!content/devices.css']);


export class VirtualMobile extends React.Component<React.Props<VirtualMobile>, {}>{
    private screenElement: HTMLElement;
    constructor(props) {
        super(props);
    }

    static getInstanceByElement(element: HTMLElement): VirtualMobile {
        return (element as any).mobilePage;
    }

    async createControlInstance(controlId: string, controlName: string, element: HTMLElement, controlData?: any) {
        let controlType = await this.getControlType(controlName);
        let reactElement = React.createElement(controlType, controlData);
        ReactDOM.render(reactElement, element);
    }

    getControlType(controlName: string): Promise<React.ComponentClass<any>> {
        return new Promise((resolve, reject) => {
            requirejs([`mobileComponents/${controlName}/control`], function (exports) {
                resolve(exports.default);
            })
        })
    }

    controlCreated(component, type) {
        if (type == PageView) {
            let c = component as PageView;
        }
        else if (type == PageFooter) {
            let c = component as PageFooter;
        }
    }

    render() {
        let children = React.Children.toArray(this.props.children) || [];
        return (
            <div className="marvel-device iphone5c blue">
                <div className="top-bar"></div>
                <div className="sleep"></div>
                <div className="volume"></div>
                <div className="camera"></div>
                <div className="sensor"></div>
                <div className="speaker"></div>
                <div className="screen mobile-page"
                    ref={(e: HTMLElement) => {
                        if (!e) return;
                        this.screenElement = e;
                        (e as any).mobilePage = this;
                    }}>
                    {children}
                </div>
                <div className="home"></div>
                <div className="bottom-bar"></div>
            </div>
        );
    }


}