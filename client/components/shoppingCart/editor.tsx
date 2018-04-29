import { Editor, EditorProps } from 'components/editor';
import { ShoppingCartlProps as ControlProps } from 'components/shoppingCart/control';
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