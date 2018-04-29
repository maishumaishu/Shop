import { Editor, EditorProps } from 'components/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'components/shoppingCartBar/control'

export interface EditorState extends Partial<ControlProps> {

}

export default class ShoppingCartBarEditor extends Editor<EditorProps, EditorState>{
    render() {
        return [];
    }
}