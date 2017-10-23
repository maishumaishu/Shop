import { componentsDir, Control } from 'mobileComponents/common'

export interface MobiePageDesigner {
    loadEditor();
}

export interface EditorProps {
    control: Control<any, any>
}

export abstract class Editor<P extends EditorProps, S> extends React.Component<P, S>{
    private controlType: React.ComponentClass<any>;

    constructor(props) {
        super(props);
        console.assert(this.props.control.state != null);
    }

    get state(): S {
        return super.state;
    }
    /**
     * 重写 set state， 在第一次赋值，将控件中 state 的持久化成员赋值过来。 
     */
    set state(value: S) {

        value = value || {} as S;
        if (super.state != null) {
            super.state = value;
            return;
        }

        var state = {} as any;
        let keys = this.props.control.persistentMembers || [];
        let controlState = this.props.control.state;
        for (let i = 0; i < keys.length; i++) {
            var prop = controlState[keys[i]];
            if (prop !== undefined)
                state[keys[i]] = prop;
        }

        super.state = Object.assign(value, state);;
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
    }

    static path(controlName: string) {
        return `${componentsDir}/${controlName}/editor`;
    }

    protected loadEditorCSS() {
        var typeName = this.constructor.name;
        typeName = typeName.replace('Editor', '');
        typeName = typeName[0].toLowerCase() + typeName.substr(1);

        requirejs([`css!${componentsDir}/${typeName}/editor`]);
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