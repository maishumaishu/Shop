import { Editor, EditorProps } from 'user/components/editor';
import { ShoppingCartlProps as ControlProps } from 'user/components/shoppingCart/control';
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