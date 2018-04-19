import { Editor,EditorProps } from 'user/components/editor';
import { State as ControlState, Props as ControlProps, default as Control, StyleType } from 'user/components/style/control'
let h = React.createElement;
requirejs(['css!mobileComponents/style/editor.css']);
export interface EditorState extends Partial<ControlState> {

}

export default class StyleEditor extends Editor<EditorProps, EditorState> {
    constructor(props) {
        super(props);
        this.state = { style: this.props.control.state.style };
    }
    setCurrentStyle(name: StyleType) {
        this.state.style = name;
        this.setState(this.state);
    }
    render() {
        return (
            <div className="style-editor">
                <div className="style-solutions">
                    <header>选择配色方案</header>
                    <ul>
                        {this.styleItem('default')}
                        {this.styleItem('red')}
                    </ul>
                    <div className="clearfix"></div>
                </div>
            </div>
        )
    }
    styleItem(name: StyleType) {
        let currentStyle = (this.state || { style: null }).style || 'default';
        return (
            <li className={currentStyle == name ? "active" : ''} onClick={() => this.setCurrentStyle(name)}>
                <div className={name}></div>
            </li>
        );
    }
}