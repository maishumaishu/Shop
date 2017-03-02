import { Editor, EditorProps } from 'mobile/common';
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


export default class MyEditor extends Editor<{}> {
    controlType = Control;
    dataType = Data;

    // protected renderEditor() {
    //     ReactDOM.render(<EditorComponent />, this.element);
    // }
    render() {
        return (
            <div>
                TowColumnProduct Editor
            </div>
        )
    }
}