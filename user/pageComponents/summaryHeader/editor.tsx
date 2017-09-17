import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'mobileComponents/summaryHeader/control'
let h = React.createElement;
export interface EditorState extends Partial<ControlState> {

}
export default class MyEditor extends Editor<EditorProps, EditorState> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (<div>SummaryHeader Editor</div>);
    }
} 