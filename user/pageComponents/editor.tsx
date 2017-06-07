
import { componentsDir } from 'mobileComponents/common'

export interface EditorProps<ControlProp, ControlState, ControlType extends React.Component<ControlProp, ControlState>> {
    control: ControlType
    // pageId: string,
}

export abstract class Editor<ControlProp, ControlState, State, ControlType extends React.Component<ControlProp, ControlState>>
    extends React.Component<EditorProps<ControlProp, ControlState, ControlType>, ControlState> {//<S extends EditorState<any>> extends React.Component<EditorProps, S>
    private controlType: React.ComponentClass<any>;

    constructor(props: EditorProps<ControlProp, ControlState, ControlType>) {
        super(props);

    }

    componentDidMount() {
        // this.renderControl(this.state.controlData);
    }

    componentDidUpdate() {
        // this.renderControl(this.state.controlData);
        this.props.control.setState(this.state);
    }

    // renderControl(data) {
    //     console.assert(this.controlType != null);
    //     // console.assert(this.dataType != null);
    //     let reactElement = React.createElement(this.controlType, data);
    //     ReactDOM.render(reactElement, this.props.controlElement)
    // }

    static path(controlName: string) {
        return `${componentsDir}/${controlName}/editor`;
    }
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}