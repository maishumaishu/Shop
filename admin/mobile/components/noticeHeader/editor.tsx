import { Editor, EditorProps, EditorState } from 'mobile/components/editor';
import { Data, default as Control } from 'mobile/components/noticeHeader/control'

export default class MyEditor extends Editor<EditorState<any>> {
    constructor(props) {
        super(props, Control, Data)
    }

    render() {
        return (<div>SummaryHeader Editor</div>);
    }
} 