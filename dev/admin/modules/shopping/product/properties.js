define(["require", "exports", "ui"], function (require, exports, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function arrayToGroup(fields) {
        let row_items_count = 3;
        let result = [];
        let field_group = [];
        for (let i = 0; i < fields.length; i++) {
            field_group.push(fields[i]);
            if (field_group.length == row_items_count) {
                result.push(field_group);
                field_group = [];
            }
        }
        if (field_group.length < row_items_count && field_group.length > 0) {
            result.push(field_group);
        }
        return result;
    }
    class DialogModel {
        constructor(element) {
            this.title = '';
            this.ok = ko.observable(() => {
                if (this.execute) {
                    this.execute(this).then(() => {
                        this.close();
                    });
                    return;
                }
                this.close();
            });
            if (!element)
                throw new Error(`Argument 'element' cannt be null.`); //errors.argumentNull('element');
            this.element = element;
        }
        show() {
            ui.showDialog(this.element);
        }
        close() {
            ui.hideDialog(this.element);
        }
    }
    class NamesInputModel extends DialogModel {
        constructor(componentElement) {
            super($(componentElement).find('[name="names_input_dianlog"]')[0]);
            this.names = '';
        }
    }
    class ProductPropertiesModel {
        constructor(params, element) {
            //===========================================
            this.showPropertiesDialog = () => {
                this.showNamesInputDialog('设置属数');
            };
            this.properties = params.properties;
            console.assert(this.properties != null);
            this.name = params.name || '';
            this.propertiesGroups = ko.computed(() => {
                let result = arrayToGroup(this.properties);
                return result;
            });
            this.namesInput = new NamesInputModel(element);
        }
        showNamesInputDialog(title) {
            this.namesInput.names = this.properties.map(o => o.key).join('， ');
            this.namesInput.title = title;
            this.namesInput.execute = (dialogModel) => {
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
                    });
                    return resolve();
                });
            };
            this.namesInput.show();
        }
    }
    class PropertiesComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { properties: this.props.properties || [] };
        }
        showPropertiesDialog() {
            ui.showDialog(this.dialogElement);
        }
        componentDidMount() {
            let inputValue = this.state.properties.map(o => o.key).join(',');
            this.dialogElement['fields'].value = inputValue;
        }
        dialogConfirm() {
            let properties = [];
            let names = (this.fieldsInput.value || '').replace(/，/g, ',').split(',').filter(o => o.trim() != '');
            names.forEach(key => {
                let value = this.state.properties[key] || '';
                properties.push({ key, value });
            });
            this.state.properties = properties;
            this.setState(this.state);
            ui.hideDialog(this.dialogElement);
            if (this.props.changed) {
                this.props.changed(properties);
            }
        }
        bindInput(e, c) {
            var property = this.state.properties.filter(d => d.key == c.key)[0];
            property.value = e.target.value;
            this.setState(this.state);
            if (this.props.changed) {
                this.props.changed(this.state.properties);
            }
        }
        render() {
            let inputValue = this.state.properties.map(o => o.key).join(', ');
            let groupProperties = arrayToGroup(this.state.properties);
            return (h("div", null,
                h("div", { className: "row" },
                    h("div", { className: "col-sm-6" },
                        h("h4", null, this.props.name)),
                    h("div", { className: "col-sm-6 button-bar" },
                        h("button", { className: "btn btn-primary btn-sm pull-right", onClick: () => this.showPropertiesDialog() }, "\u8BBE\u7F6E"))),
                groupProperties.length == 0 && this.props.emptyText ?
                    h("div", { className: "row from-group" },
                        h("div", { className: "text-center", style: { height: 40 } }, this.props.emptyText)) : null,
                groupProperties.map((o, i) => h("div", { key: i, className: "row form-group" }, o.map((c, j) => h("div", { key: c.key, className: "col-lg-4 col-md-4" },
                    h("label", { className: "col-lg-3" }, c.key),
                    h("div", { className: "col-lg-9" },
                        h("input", { className: "form-control", value: c.value, onChange: (e) => this.bindInput(e, c) })))))),
                h("form", { className: "modal fade", ref: (o) => this.dialogElement = o || this.dialogElement },
                    h("div", { className: "modal-dialog" },
                        h("div", { className: "modal-content" },
                            h("div", { className: "modal-header" },
                                h("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                                    h("span", { "aria-hidden": "true" }, "\u00D7")),
                                h("h4", null, this.props.name)),
                            h("div", { className: "modal-body" },
                                h("div", { className: "form-horizontal" },
                                    h("div", { className: "form-group" },
                                        h("label", { className: "control-label col-sm-2" }, "\u540D\u79F0"),
                                        h("div", { className: "col-sm-10" },
                                            h("input", { name: "fields", className: "form-control", placeholder: "请输入参数名称", ref: (e) => this.fieldsInput = e || this.fieldsInput }))),
                                    h("div", { className: "form-group" },
                                        h("div", { className: "col-sm-10 col-sm-offset-2" },
                                            h("div", null, "\u8BF7\u8F93\u5165\u4E00\u4E2A\u6216\u591A\u4E2A\u540D\u79F0\uFF0C\u591A\u4E2A\u8BF7\u7528\uFF07,\uFF07(\u82F1\u6587\u6216\u4E2D\u6587\u9017\u53F7)\u9694\u5F00"))))),
                            h("div", { className: "modal-footer" },
                                h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                                h("button", { type: "button", className: "btn btn-primary", ref: (e) => {
                                        if (!e)
                                            return;
                                        e.onclick = () => this.dialogConfirm();
                                    } }, "\u786E\u8BA4")))))));
        }
    }
    exports.PropertiesComponent = PropertiesComponent;
});
