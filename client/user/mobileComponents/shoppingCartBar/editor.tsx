import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'mobileComponents/shoppingCartBar/control'

export interface EditorState extends Partial<ControlProps> {

}

export default class ShoppingCartBarEditor extends Editor<EditorProps, EditorState>{

}