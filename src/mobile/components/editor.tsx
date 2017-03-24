import { ControlArguments, controlsDir } from 'mobile/common'

export interface EditorProps {
    controlElement: HTMLElement,
    controlId: string,
    controlData?: any,
    pageId: string,
}
export interface EditorState<T> {
    controlData: T
}
export abstract class Editor<S extends EditorState<any>> extends React.Component<EditorProps, S> {
    private controlType: React.ComponentClass<any>;

    constructor(props: EditorProps, controlType: React.ComponentClass<any>, controlDataType: { new () }) {
        super(props);

        this.state = { controlData: (props.controlData || new controlDataType()) } as S;
        this.controlType = controlType;
        
    }

    componentDidMount() {
        this.renderControl(this.state.controlData);
    }

    componentDidUpdate(){
        this.renderControl(this.state.controlData);
    }

    renderControl(data) {
        console.assert(this.controlType != null);
        // console.assert(this.dataType != null);
        let reactElement = React.createElement(this.controlType, data);
        ReactDOM.render(reactElement, this.props.controlElement)
    }

    static path(controlName: string) {
        return `${controlsDir}/${controlName}/editor`;
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