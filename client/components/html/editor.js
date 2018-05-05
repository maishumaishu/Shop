define(["require", "exports", "components/editor", "share/common", "admin/ue.ext", "ace_editor/ace"], function (require, exports, editor_1, common_1, UE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HtmlEditor extends editor_1.Editor {
        constructor(props) {
            super(props);
            this.loadEditorCSS();
            this.editorId = common_1.guid();
            this.state = { type: 'rich' };
        }
        setCheckElement(e, member) {
            if (!e || e.onchange)
                return;
            e.checked = this.state[member] == e.value;
            e.onchange = () => {
                this.state[member] = e.value;
                this.setState(this.state);
            };
        }
        loadTextEditor(e) {
            if (!e)
                return;
            let ace = window['ace'];
            this.editor = ace.edit(e);
            this.editor.setTheme("ace/theme/chrome");
            this.editor.session.setMode("ace/mode/html");
            this.editor.setValue(this.state.html || '');
        }
        loadRichEditor(e) {
            if (!e)
                return;
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
                h("div", { key: "richEditor", className: "form-group", style: { display: type == 'rich' ? 'block' : 'none' } },
                    h("script", { id: this.editorId, type: "text/html", dangerouslySetInnerHTML: { __html: html || '' } }),
                    h("input", { type: "hidden", value: html, ref: (e) => this.richEditorElement = e || this.richEditorElement })),
                h("div", { key: "sourceEditor", className: "form-group", style: { display: type == 'source' ? 'block' : 'none' } },
                    h("pre", { style: { height: 400 }, ref: (e) => this.sourceEditorElement = e || this.sourceEditorElement })),
                h("div", { key: "type", className: "form-group" },
                    h("button", { type: "button", className: "btn btn-primary", onClick: () => this.apply() }, "\u5E94\u7528\u5F53\u524DHTML"),
                    h("div", { className: "pull-right" },
                        h("span", { style: { paddingRight: 10 } },
                            h("input", { type: "radio", name: "type", value: "rich", ref: (e) => this.setCheckElement(e, 'type') }),
                            "\u5BCC\u6587\u672C"),
                        h("span", null,
                            h("input", { type: "radio", name: "type", value: "source", ref: (e) => this.setCheckElement(e, 'type') }),
                            "\u6E90\u7801")))
            ];
        }
    }
    exports.default = HtmlEditor;
});
