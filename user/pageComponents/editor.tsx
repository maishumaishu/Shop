import { componentsDir } from 'mobileComponents/common'

export interface MobiePageDesigner {
    loadEditor();
}

export interface EditorProps<ControlProp, ControlState, ControlType extends React.Component<ControlProp, ControlState>> {
    control: ControlType
    // pageId: string,
}

export abstract class Editor<ControlProp, ControlState, State, ControlType extends React.Component<ControlProp, ControlState>>
    extends React.Component<EditorProps<ControlProp, ControlState, ControlType>, ControlState & State> {
    private controlType: React.ComponentClass<any>;

    constructor(props: EditorProps<ControlProp, ControlState, ControlType>) {
        super(props);
        this.state = Object.assign({} as State, this.props.control.state);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        this.props.control.setState(this.state || {} as ControlState);
    }

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