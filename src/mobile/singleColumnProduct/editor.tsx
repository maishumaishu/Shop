import { Editor, EditorState } from 'mobile/editor';
import { Data, default as Control } from 'mobile/singleColumnProduct/control'

export default class MyEditor extends Editor<EditorState<Data>> {
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