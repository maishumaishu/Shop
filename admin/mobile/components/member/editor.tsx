import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'mobile/components/member/control';

interface EditorState {

}

export default class MemberEditor extends Editor<ControlProps, ControlState, EditorState, Control> {
    constructor(props) {
        super(props);
    }
}