import { Editor } from 'mobileComponents/editor';
import { State as ControlState, Props as ControlProps, default as Control } from 'mobileComponents/singleColumnProduct/control'
let h = React.createElement;
export interface EditorState {

}

export default class MyEditor extends Editor<ControlProps, ControlState, EditorState, Control> {
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