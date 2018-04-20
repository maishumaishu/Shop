import { Editor, EditorProps } from "user/components/editor";
import { State as ControlState, default as CategoriesControl } from 'user/components/html/control';
import { guid } from "share/common";
import UE = require('admin/ue.ext');

export interface EditorState extends Partial<ControlState> {
}

export default class HtmlEditor extends Editor<EditorProps, EditorState> {
    htmlElement: HTMLInputElement;
    editorId: string;
    constructor(props) {
        super(props);
        this.loadEditorCSS();
        this.editorId = guid();
    }

    componentDidMount() {
        UE.createEditor(this.editorId, this.htmlElement, (content) => {
            this.state.html = content;
            this.setState(this.state);
        });
    }

    render() {
        let { html } = this.state;
        return (
            <form className="html-editor form-horizontal">
                <div className="form-group">
                    <div className="col-sm-12">
                        <script id={this.editorId} type="text/html" dangerouslySetInnerHTML={{ __html: html || '' }} />
                        <input type="hidden" value={html}
                            ref={(e: HTMLInputElement) => this.htmlElement = e || this.htmlElement} />
                    </div>
                </div>
            </form>
        );
    }
}