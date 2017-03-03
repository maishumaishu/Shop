import { Editor, EditorProps, EditorState } from 'mobile/common';
import { Data, default as Control } from 'mobile/towColumnProduct/control'

class EditorComponent extends React.Component<{}, {}>{
    render() {
        return (
            <div>
                TowColumnProduct Editor
            </div>
        );
    }
}


export default class MyEditor extends Editor<EditorState> {
    constructor(props) {
        super(props, Control, Data);
    }


    render() {
        return (
            <div>
                TowColumnProduct Editor
            </div>
        )
    }
}