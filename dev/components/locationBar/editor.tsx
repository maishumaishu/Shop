
import { Editor, EditorProps } from 'components/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'components/member/control';

export interface EditorState extends Partial<ControlState> {

}

export default class LocationBarEditor extends Editor<EditorProps, EditorState> {
    render() {
        return <div>
            暂无可用设置
        </div>;
    }
}