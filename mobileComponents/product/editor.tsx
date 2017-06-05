import { Editor } from 'mobileComponents/editor';
import { State as ControlState, Props as ControlProps, default as Control } from 'mobileComponents/product/control';

interface EditorState {

}

export default class ProductEditor extends Editor<ControlProps, ControlState, EditorState, Control>{
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