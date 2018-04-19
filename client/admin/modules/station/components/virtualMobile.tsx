import { Control } from 'user/components/common';
import { default as StyleControl } from 'user/components/style/control';
requirejs(['css!content/devices.css']);


export class VirtualMobile extends React.Component<React.Props<VirtualMobile>, {}>{
    private _screenElement: HTMLElement;
    constructor(props) {
        super(props);
    }

    // static getInstanceByElement(element: HTMLElement): VirtualMobile {
    //     return (element as any).mobilePage;
    // }

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
        // if (type == PageView) {
        //     let c = component as PageView;
        // }
        // else if (type == PageFooter) {
        //     let c = component as PageFooter;
        // }
    }

    get screenElement() {
        return this._screenElement;
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
                <div className="screen"
                    ref={(e: HTMLElement) => {
                        if (!e) return;
                        this._screenElement = e;
                        // (e as any).mobilePage = this;
                    }}>
                    {children}
                </div>
                <div className="home"></div>
                <div className="bottom-bar"></div>
            </div>
        );
    }


}