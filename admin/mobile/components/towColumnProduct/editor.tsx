import { Editor, EditorProps, EditorState } from 'mobile/components/editor';
import { Data, default as Control } from 'mobile/components/towColumnProduct/control'

class EditorComponent extends React.Component<{}, {}>{
    render() {
        return (
            <div>
                TowColumnProduct Editor
            </div>
        );
    }
}


export default class MyEditor extends Editor<EditorState<Data>> {
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