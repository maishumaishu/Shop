import * as ui from 'ui';

interface KeyValue {
    key: string,
    value: string
}

function arrayToGroup(fields: KeyValue[]): KeyValue[][] {
    let row_items_count = 3;

    let result: KeyValue[][] = [];
    let field_group: KeyValue[] = [];

    for (let i = 0; i < fields.length; i++) {
        field_group.push(fields[i]);
        if (field_group.length == row_items_count) {
            result.push(field_group);
            field_group = [];
        }
    }

    if (field_group.length < row_items_count) {
        result.push(field_group);
    }

    return result;
}

class DialogModel {
    constructor(element: HTMLElement) {
        if (!element) throw chitu.Errors.argumentNull('element');

        this.element = element;
    }
    private element: HTMLElement;

    title = '';
    execute: (dialogModel: DialogModel) => Promise<any>;
    ok = ko.observable<() => void>(() => {
        if (this.execute) {
            this.execute(this).then(() => {
                this.close();
            });
            return;
        }
        this.close();
    });
    show() {
        $(this.element).modal({ backdrop: false, show: true });
    }
    close() {
        $(this.element).modal('hide');
    }
}


class NamesInputModel extends DialogModel {
    constructor(componentElement: HTMLElement) {
        super($(componentElement).find('[name="names_input_dianlog"]')[0]);
    }
    names = '';
}

class ProductPropertiesModel {
    private properties: KeyValue[];
    private name: string;
    private propertiesGroups: KnockoutComputed<KeyValue[][]>;
    private namesInput: NamesInputModel;
    constructor(params: {
        properties: KeyValue[],
        name: string
    }, element: HTMLElement) {

        this.properties = params.properties;
        console.assert(this.properties != null);
        this.name = params.name || '';
        this.propertiesGroups = ko.computed<KeyValue[][]>(() => {
            let result = arrayToGroup(this.properties);
            return result;
        });
        this.namesInput = new NamesInputModel(element);
    }

    private showNamesInputDialog(title: string) {

        this.namesInput.names = this.properties.map(o => o.key).join('， ');
        this.namesInput.title = title;
        this.namesInput.execute = (dialogModel: NamesInputModel) => {
            return new Promise((resolve, reject) => {
                let properties = this.properties;
                for (let i = 0; i < properties.length; i++) {
                    let key = properties[i].key;
                    let value = properties[i].value;
                    properties[key] = value;
                }

                this.properties = [];
                let names = dialogModel.names.replace(/，/g, ',').split(',');
                names.filter(o => o.trim() != '').forEach(key => {
                    let value = properties[key] || '';
                    this.properties.push({ key, value });
                })

                return resolve();
            })
        };
        this.namesInput.show();
    }

    //===========================================
    showPropertiesDialog = () => {
        this.showNamesInputDialog('设置属数');
    }
    //===========================================
}

export class PropertiesComponent extends React.Component<
    React.Props<PropertiesComponent> & { name: string, properties: KeyValue[] },
    { properties: KeyValue[] }>{
    private dialogElement: HTMLFormElement;
    private fieldsInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = { properties: this.props.properties || [] };
    }
    showPropertiesDialog() {
        $(this.dialogElement).modal();
    }
    componentDidMount() {
        let inputValue = this.state.properties.map(o => o.key).join(',');
        (this.dialogElement['fields'] as HTMLInputElement).value = inputValue;
    }
    dialogConfirm() {
        let properties: KeyValue[] = [];
        let names = (this.fieldsInput.value || '').replace(/，/g, ',').split(',').filter(o => o.trim() != '');
        names.forEach(key => {
            let value = this.state.properties[key] || '';
            properties.push({ key, value });
        })

        this.state.properties = properties;
        this.setState(this.state);

        $(this.dialogElement).modal('hide');
    }
    render() {
        let inputValue = this.state.properties.map(o => o.key).join(', ');
        let groupProperties = arrayToGroup(this.state.properties);
        return (
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <h5>{this.props.name}</h5>
                    </div>
                    <div className="col-sm-6 button-bar">
                        <button className="btn btn-primary btn-sm"
                            onClick={() => this.showPropertiesDialog()}>设置</button>
                    </div>
                </div>
                {groupProperties.map((o, i) =>
                    <div key={i} className="row form-group">
                        {o.map((c, j) =>
                            <div key={c.key} className="col-lg-4 col-md-4">
                                <label className="col-lg-3">
                                    {c.key}
                                </label>
                                <div className="col-lg-9">
                                    <input className="form-control" value={c.value}
                                        onChange={(e) => {
                                            var property = this.state.properties.filter(d => d.key == c.key)[0];
                                            property.value = (e.target as HTMLInputElement).value;
                                            this.setState(this.state);
                                        }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <form className="modal fade" ref={(o: HTMLFormElement) => this.dialogElement = o || this.dialogElement}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4>{this.props.name}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <label className="control-label col-sm-2">名称</label>
                                        <div className="col-sm-10">
                                            <input name="fields" className="form-control" placeholder="请输入参数名称"
                                                ref={(e: HTMLInputElement) => this.fieldsInput = e || this.fieldsInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="col-sm-10 col-sm-offset-2">
                                            <div>
                                                请输入一个或多个名称，多个请用＇,＇(英文或中文逗号)隔开
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                                <button type="button" className="btn btn-primary"
                                    ref={(e: HTMLButtonElement) => {
                                        if (!e) return;
                                        e.onclick = () => this.dialogConfirm();
                                    }}>确认</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}