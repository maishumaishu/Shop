import { Editor, EditorProps } from "user/components/editor";
import { State as ControlState, default as CategoriesControl } from 'user/components/image/control';

export interface EditorState extends Partial<ControlState> {
}

export default class ImageEditor extends Editor<EditorProps, EditorState> {
    render() {
        return <div>NONE</div>
    }
}