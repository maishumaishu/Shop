import { Editor, EditorProps } from 'user/components/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'user/components/shoppingCartBar/control'

export interface EditorState extends Partial<ControlProps> {

}

export default class ShoppingCartBarEditor extends Editor<EditorProps, EditorState>{
    render() {
        return [];
    }
}