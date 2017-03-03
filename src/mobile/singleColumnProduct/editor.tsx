import { Editor, EditorState } from 'mobile/common';
import { Data, default as Control } from 'mobile/singleColumnProduct/control'

export default class MyEditor extends Editor<EditorState> {
    constructor(props) {
        super(props, Control, Data);
    }
    
    render() {
        return (
            <div>
                SingleColumnProduct Editor
            </div>
        );
    }
}