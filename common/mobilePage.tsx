export interface ControlData {
    controlId: string, controlName: string, data: any
}
export interface PageData {
    _id: string,
    name: string,
    remark: string,
    controls: Array<ControlData>,
    isDefault?: boolean,
}
export class Page extends React.Component<{ pageData: PageData }, {}>{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    async loadControlInstance(controlId: string, controlName: string, element: HTMLElement, controlData?: any) {
        let controlElement = document.createElement('div');
        let controlType = await this.getControlType(controlName);
        let reactElement = React.createElement(controlType, controlData);
        ReactDOM.render(reactElement, controlElement);
        element.appendChild(controlElement);
    }

    getControlType(controlName: string): Promise<React.ComponentClass<any>> {
        return new Promise((resolve, reject) => {
            requirejs([`mobileComponents/${controlName}/control`], function (exports) {
                resolve(exports.default);
            })
        })
    }

    render() {
        let controls = this.props.pageData.controls;
        return (
            <div>
                {controls.map((o, i) => (
                    <div key={o.controlId} data-controlId={o.controlId}
                        ref={(e: HTMLElement) => {
                            if (e == null) {
                                return;
                            }

                            this.loadControlInstance(o.controlId, o.controlName, e, o.data);
                        }}>
                    </div>
                ))}
            </div>
        );
    }
}
