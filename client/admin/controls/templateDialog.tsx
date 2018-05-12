import { StationService } from "admin/services/station";
import app from "admin/application";
import { siteMap } from "admin/pageNodes";
import { MobilePageDisplay } from "admin/controls/mobilePageDisplay";
import { loadControlCSS, createDialogElement } from "./utiltiy";

loadControlCSS('templateDialog')

type TemplateDialogProps = { element: HTMLElement } & React.Props<TemplateDialog>;
class TemplateDialog extends React.Component<TemplateDialogProps, { templates: PageData[] }> {
    templateDialogElement: HTMLElement;
    callback: (pageData: PageData) => void;

    constructor(props) {
        super(props);
        this.state = { templates: [] };
        this.templateDialogElement = this.props.element;
    }

    private selecteTemplate(template: PageData) {
        if (this.callback) {
            this.callback(template);
        }
        ui.hideDialog(this.templateDialogElement);
    }

    showDialog(callback: (pageData: PageData) => void) {
        this.callback = callback;
        ui.showDialog(this.templateDialogElement);
    }

    async componentDidMount() {
        let station = app.createService(StationService);

        let templates = await station.pageTemplates();
        this.state.templates = templates;
        this.setState(this.state);
    }

    render() {
        let { templates } = this.state;
        return <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal"
                        ref={(e: HTMLButtonElement) => {
                            if (!e) return;
                            e.onclick = () => ui.hideDialog(this.templateDialogElement);
                        }}>
                        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                    </button>
                    <h4 className="modal-title">请选择模板</h4>
                </div>
                <div className="modal-body row">
                    {templates ?
                        templates.map(o =>
                            <div key={o.id} className="template-item" onClick={() => this.selecteTemplate(o)}
                                title="点击选择该模板">
                                <MobilePageDisplay pageData={o} scale={0.8} displayMobile={false} />
                            </div>
                        ) :
                        <div>数据正在加载中...</div>
                    }
                    <div className="clear-fix">
                    </div>
                </div>
            </div>
        </div>
    }
}

let instance: TemplateDialog;
let element = createDialogElement('templates-dialog');
export function showTemplateDialog(callback?: (template: PageData) => void) {
    if (instance == null) {
        instance = ReactDOM.render(<TemplateDialog element={element} />, element);
    }

    instance.showDialog(callback);
}
