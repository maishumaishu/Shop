import { Editor, EditorProps } from 'pageComponents/editor';
import { State as ControlState, Props as ControlProps, default as Control } from 'pageComponents/product/control';
let h = React.createElement;
export interface EditorState {

}

export default class ProductEditor extends Editor<EditorProps, EditorState>{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}