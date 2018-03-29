import { Editor, EditorProps } from 'mobileComponents/editor';
import { Props as ControlProps, State as ControlState, default as Control } from 'mobileComponents/summaryHeader/control'
let h = React.createElement;

export interface EditorState extends Partial<ControlState> {
}
export default class MyEditor extends Editor<EditorProps, EditorState> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { mode } = this.state;
        return (
            <div className="editor">
                暂无可用设置
                {/* <div style={{ height: 30 }}>
                    <input name="mode" type='radio' checked={mode == 'normal'}
                        onChange={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                                this.state.mode = 'normal';
                                this.setState(this.state);
                            }

                        }} />
                    <span style={{ paddingLeft: 10 }}>经典模式</span>
                </div>
                <div style={{ height: 30 }}>
                    <input type='radio' checked={mode == 'simple'}
                        onChange={(e) => {
                            if ((e.target as HTMLInputElement).checked) {
                                this.state.mode = 'simple';
                                this.setState(this.state);
                            }
                        }} />
                    <span name="mode" style={{ paddingLeft: 10 }}>简洁模式</span>
                </div> */}
            </div>
        );
    }
} 