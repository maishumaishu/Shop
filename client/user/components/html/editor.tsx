import { Editor, EditorProps } from "user/components/editor";
import { State as ControlState, default as CategoriesControl } from 'user/components/html/control';
import { guid } from "share/common";
import UE = require('admin/ue.ext');
// import ace = require('ace_editor/ace');
import 'ace_editor/ace';

export interface EditorState extends Partial<ControlState> {
    type: 'rich' | 'source'
}

export default class HtmlEditor extends Editor<EditorProps, EditorState> {
    sourceEditorElement: HTMLElement;
    richEditorElement: HTMLInputElement;
    editor: any;
    htmlElement: HTMLInputElement;
    editorId: string;
    constructor(props) {
        super(props);
        this.loadEditorCSS();
        this.editorId = guid();
        this.state = { type: 'rich' }
    }

    setCheckElement(e: HTMLInputElement, member: keyof EditorState) {
        if (!e || e.onchange) return
        e.checked = this.state[member] == e.value;
        e.onchange = () => {
            this.state[member] = e.value;
            this.setState(this.state);
        }
    }

    loadTextEditor(e: HTMLElement) {
        if (!e) return;

        let ace = window['ace'];
        this.editor = ace.edit(e);
        this.editor.setTheme("ace/theme/chrome");
        this.editor.session.setMode("ace/mode/html");
        this.editor.setValue(this.state.html || '');
    }

    loadRichEditor(e: HTMLInputElement) {
        if (!e) return;

        UE.createEditor(this.editorId, e, (content) => {
            this.state.html = content;
            this.setState(this.state);
        });
    }

    apply() {
        if (this.state.type == 'source' && this.editor != null) {
            this.state.html = this.editor.getValue();
            this.setState(this.state);
        }
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.richEditorElement)
                this.loadRichEditor(this.richEditorElement);

            if (this.sourceEditorElement)
                this.loadTextEditor(this.sourceEditorElement);
        });
    }

    render() {
        let { html, type } = this.state;
        return [
            <div key="richEditor" className="form-group" style={{ display: type == 'rich' ? 'block' : 'none' }}>
                <script id={this.editorId} type="text/html" dangerouslySetInnerHTML={{ __html: html || '' }} />
                <input type="hidden" value={html} ref={(e: HTMLInputElement) => this.richEditorElement = e || this.richEditorElement} />
            </div>,
            <div key="sourceEditor" className="form-group" style={{ display: type == 'source' ? 'block' : 'none' }}>
                <pre style={{ height: 400 }} ref={(e: HTMLElement) => this.sourceEditorElement = e || this.sourceEditorElement} />

            </div>,
            <div key="type" className="form-group">
                <button type="button" className="btn btn-primary" onClick={() => this.apply()}>
                    应用当前HTML
                </button>
                <div className="pull-right">
                    <span style={{ paddingRight: 10 }}>
                        <input type="radio" name="type" value="rich"
                            ref={(e: HTMLInputElement) => this.setCheckElement(e, 'type')} />
                        富文本
                </span>
                    <span>
                        <input type="radio" name="type" value="source"
                            ref={(e: HTMLInputElement) => this.setCheckElement(e, 'type')} />
                        源码
                </span>
                </div>
            </div>
        ]
    }
}