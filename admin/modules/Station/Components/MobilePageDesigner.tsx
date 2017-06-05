import { MobilePage } from 'modules/Station/Components/MobilePage';
import { Control, componentsDir } from 'mobileComponents/common';
import { Editor, EditorProps } from 'mobileComponents/editor';
export interface Props extends React.Props<MobilePage> {

}


export class MobilePageDesigner extends React.Component<any, { editors: React.ReactElement<any>[] }> {
    private controls: Array<{ control: Control<any>, name: string }>;
    private editorsElement: HTMLElement;
    constructor(props) {
        super(props);
        this.state = { editors: [] };
        this.controls = [];
    }

    loadEditor(controlName: string, control: Control<any>, editorElement: HTMLElement) {
        let editorPathName = Editor.path(controlName);
        requirejs([editorPathName], (exports) => {
            let editorType = exports.default;
            console.assert(editorType != null, 'editor type is null');
            let editorReactElement = React.createElement(editorType, { control });
            ReactDOM.render(editorReactElement, editorElement);
        })
    }

    componentDidMount() {
        for (let i = 0; i < this.controls.length; i++) {
            let editorElement = document.createElement('div');
            this.editorsElement.appendChild(editorElement);
            this.loadEditor(this.controls[i].name, this.controls[i].control, editorElement);
        }
    }
    render() {
        let children = (React.Children.toArray(this.props.children) || []);
        // .filter(o => typeof o.type != 'string');

        return (
            <div>
                <div style={{ position: 'absolute' }}>
                    <MobilePage mode={'design'}>
                        {children.map(o =>
                            <div key={o.key} ref={(e: HTMLElement) => {
                                let c = ReactDOM.render(o, e);
                                let controlTypeName = (o.type as React.ComponentClass<any>).name;
                                if (!controlTypeName) {
                                    return;
                                }
                                let controlName = controlTypeName[0].toLowerCase() + controlTypeName.substr(1) || '';
                                if (controlName.endsWith('Control')) {
                                    controlName = controlName.substr(0, controlName.length - 'Control'.length);
                                }
                                this.controls.push({ control: c, name: controlName });
                                e.className = controlTypeName;
                            }} />
                        )}
                    </MobilePage>
                </div>
                <div style={{ paddingLeft: 390 }} ref={(e: HTMLElement) => this.editorsElement = e || this.editorsElement}>
                </div>
                <div className="clearfix">
                </div>
            </div>
        );
    }
}