import { Editor, EditorProps } from 'mobileComponents/editor';
import { ShoppingCartlProps as ControlProps } from 'mobileComponents/shoppingCart/control';
export interface EditorState extends Partial<ControlProps> {

}

export default class ShoppingCartEditor extends Editor<EditorProps, EditorState>{
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