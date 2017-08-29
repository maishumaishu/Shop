import { componentsDir, Component } from 'mobileComponents/common'

export interface MobiePageDesigner {
    loadEditor();
}

export interface EditorProps {
    control: Component<any, any>
}

export abstract class Editor<P extends EditorProps, S> extends React.Component<P, S>{
    private controlType: React.ComponentClass<any>;

    constructor(props) {
        super(props);
        console.assert(this.props.control.state != null);

        var state = {} as S;
        let keys = this.props.control.persistentMembers;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            var value = this.props.control.state[key];
            state[key] = value;
        }
        this.state = state;
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        let control = this.props.control;
        console.assert(control != null);
        let controlState = control.state;
        let keys = control.persistentMembers;
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            controlState[key] = this.state[key];
        }
        control.setState(controlState);
        // this.props.control.setState(this.state || {} as ControlState);
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