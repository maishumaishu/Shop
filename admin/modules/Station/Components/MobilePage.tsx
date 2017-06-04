import { default as station, PageData, ControlData } from 'services/Station';
requirejs(['css!content/devices.css']);

interface Props extends React.Props<MobilePage> {
    pageData?: PageData,
    mode?: 'design' | 'preview'
}

export class MobilePage extends React.Component<Props, {}>{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
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

    render() {
        let controls: ControlData[] = [];
        if (this.props.pageData)
            controls = this.props.pageData.controls || [];

        let children = this.props.children;
        return (
            <div className="marvel-device iphone5c blue">
                <div className="top-bar"></div>
                <div className="sleep"></div>
                <div className="volume"></div>
                <div className="camera"></div>
                <div className="sensor"></div>
                <div className="speaker"></div>
                <div className="screen">
                    {controls.map((o, i) => (
                        <div key={i}
                            ref={(e: HTMLElement) => {
                                if (e == null) {
                                    return;
                                }

                                this.createControlInstance(o.controlId, o.controlName, e, o.data);
                            }}>
                        </div>
                    ))}
                    {children ? children : null}
                </div>
                <div className="home"></div>
                <div className="bottom-bar"></div>
            </div>
        );
    }
}