import { Editor, EditorProps } from 'mobileComponents/editor';
import { State as ControlState, Props as ControlProps, default as Control } from 'mobileComponents/singleColumnProduct/control'
let h = React.createElement;
export interface EditorState extends ControlState{

}

export default class MyEditor extends Editor<EditorProps, EditorState> {
    constructor(props) {
        super(props);//, Control, Data
    }

    render() {
        return (
            <div>
                SingleColumnProduct Editor
            </div>
        );
    }
}