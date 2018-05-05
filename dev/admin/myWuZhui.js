var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "ui", "wuzhui"], function (require, exports, ui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GridViewItemPopupEditor extends React.Component {
        constructor(props) {
            super(props);
            this.state = { title: '' };
        }
        show(dataItem) {
            this.state.title = (dataItem ? '编辑' : '添加') + (this.props.name || '');
            ;
            this.setState(this.state);
            this.dataItem = dataItem = dataItem || {};
            for (let key in dataItem) {
                let inputField = this.element.querySelector(`[name="${key}"]`);
                if (inputField == null)
                    continue;
                inputField.value = this.formatValue(dataItem[key]);
            }
            // $(this.element).modal();
            ui.showDialog(this.element);
        }
        hide() {
            // $(this.element).modal('hide');
            ui.hideDialog(this.element);
        }
        formatValue(value) {
            if (value instanceof Date) {
                var date = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
                let hours = value.getHours();
                let minutes = value.getMinutes();
                let seconds = value.getSeconds();
                if (hours == 0 && minutes == 0 && seconds == 0)
                    return date;
                return `${date} ${hours}:${minutes}:${seconds}`;
            }
            return value;
        }
        ok() {
            return __awaiter(this, void 0, void 0, function* () {
                let validator = this.validator;
                if (validator) {
                    validator.clearErrors();
                    let isValid = yield validator.check();
                    if (!isValid)
                        return Promise.reject({});
                }
                let names = [];
                let inputFields = this.element.querySelectorAll('input, select');
                for (let i = 0; i < inputFields.length; i++) {
                    let name = inputFields[i].name;
                    if (!name)
                        continue;
                    if (names.indexOf(name) < 0)
                        names.push(name);
                }
                for (let i = 0; i < names.length; i++) {
                    var elements = this.element.querySelectorAll(`[name=${names[i]}]`);
                    let value = null;
                    for (let j = 0; j < elements.length; j++) {
                        let elementType = elements[j].type;
                        if ((elementType == 'checkbox' || elementType == 'radio') && !elements[j].checked) {
                            continue;
                        }
                        let elementValue = elements[j].value;
                        value = value == null ? elementValue : value + ',' + elementValue;
                    }
                    this.dataItem[names[i]] = value;
                }
                return this.props.saveDataItem(this.dataItem).then(data => {
                    this.hide();
                    return data;
                });
            });
        }
        render() {
            var children = [];
            if (this.props.children instanceof Array) {
                children.concat(this.props.children);
            }
            else {
                children.push(this.props.children);
            }
            return (h("div", { className: "modal fade", ref: (e) => this.element = e || this.element },
                h("div", { className: "modal-dialog" },
                    h("div", { className: "modal-content" },
                        h("div", { className: "modal-header" },
                            h("button", { type: "button", className: "close", "data-dismiss": "modal" },
                                h("span", { "aria-hidden": "true" }, "\u00D7"),
                                h("span", { className: "sr-only" }, "Close")),
                            h("h4", { className: "modal-title" }, this.state.title)),
                        h("div", { className: "modal-body form-horizontal" }, (this.props.children)),
                        h("div", { className: "modal-footer" },
                            h("button", { type: "button", className: "btn btn-default", "data-dismiss": "modal" }, "\u53D6\u6D88"),
                            h("button", { type: "button", className: "btn btn-primary", ref: (e) => {
                                    if (!e)
                                        return;
                                    e.onclick = ui.buttonOnClick(() => this.ok());
                                } }, "\u786E\u8BA4"))))));
        }
    }
    exports.GridViewItemPopupEditor = GridViewItemPopupEditor;
    class CommandField extends wuzhui.CustomField {
        constructor(params) {
            let createItemCell = (dataItem) => {
                var cell = new wuzhui.GridViewCell();
                let self = this;
                let buttons = new Array();
                let leftButtons = params.leftButtons != null ? params.leftButtons(dataItem) : null;
                if (leftButtons) {
                    leftButtons.map((o, i) => {
                        let element = document.createElement('span');
                        element.style.marginRight = '4px';
                        ReactDOM.render(o, element);
                        return element;
                    }).forEach(item => buttons.push(item)); //cell.element.appendChild(item)
                }
                if (params.itemEditor) {
                    var editButton = document.createElement('button');
                    editButton.className = 'btn btn-minier btn-info';
                    editButton.innerHTML = '<i class="icon-pencil"></i>';
                    // cell.appendChild(editButton);
                    editButton.onclick = (event) => {
                        var rowElement = self.findParnet(event.target, 'TR');
                        let row = wuzhui.Control.getControlByElement(rowElement);
                        // params.edit(row.dataItem);
                        params.itemEditor.show(row.dataItem);
                    };
                    buttons.push(editButton);
                }
                var deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-minier btn-danger';
                deleteButton.innerHTML = '<i class="icon-trash"></i>';
                buttons.push(deleteButton);
                // deleteButton.style.marginRight = '4px';
                for (let i = 0; i < buttons.length; i++) {
                    if (i < buttons.length - 1)
                        buttons[i].style.marginRight = '4px';
                    cell.appendChild(buttons[i]);
                }
                deleteButton.onclick = ui.buttonOnClick(() => {
                    let row = wuzhui.Control.getControlByElement(cell.element.parentElement);
                    let table = self.findParnet(cell.element, 'TABLE');
                    let gridView = wuzhui.Control.getControlByElement(table);
                    return gridView.dataSource.delete(row.dataItem);
                });
                return cell;
            };
            let { headerText, headerStyle, itemStyle } = params;
            headerText = headerText || '操作';
            headerStyle = headerStyle || {};
            if (!headerStyle.textAlign)
                headerStyle.textAlign = 'center';
            itemStyle = itemStyle || {};
            if (!itemStyle.textAlign)
                itemStyle.textAlign = 'center';
            let supperParams = { headerText, headerStyle, itemStyle, createItemCell };
            super(supperParams);
        }
        findParnet(element, tagName) {
            console.assert(element != null);
            console.assert(tagName != null && tagName == tagName.toUpperCase());
            let p = element.parentElement;
            while (p) {
                if (p.tagName == tagName)
                    return p;
                p = p.parentElement;
            }
            return null;
        }
    }
    exports.CommandField = CommandField;
    class BoundField extends wuzhui.BoundField {
        constructor(params) {
            params.headerStyle = Object.assign({ textAlign: 'center' }, params.headerStyle || {});
            if (params.nullText == null)
                params.nullText = '';
            super(params);
        }
    }
    exports.BoundField = BoundField;
    class CustomField extends wuzhui.CustomField {
        constructor(params) {
            params.headerStyle = Object.assign({ textAlign: 'center' }, params.headerStyle || {});
            super(params);
        }
    }
    exports.CustomField = CustomField;
    function appendGridView(target, args) {
        let tableElement = document.createElement('table');
        target.appendChild(tableElement);
        return createGridView({
            dataSource: args.dataSource, columns: args.columns, element: tableElement,
            pageSize: args.pageSize
        });
    }
    exports.appendGridView = appendGridView;
    function createGridView(params) {
        params = Object.assign({
            pageSize: 10,
            dataSource: null,
            columns: null,
        }, params);
        params.pagerSettings = Object.assign({
            activeButtonClassName: 'active'
        }, params.pagerSettings);
        console.assert(params.element != null, 'element can not null.');
        params.element.className = 'table table-striped table-bordered table-hover';
        let gridView = new wuzhui.GridView(params);
        return gridView;
    }
    exports.createGridView = createGridView;
    function boundField(params) {
        return new BoundField(params);
    }
    exports.boundField = boundField;
    function commandField(params) {
        return new CommandField(params);
    }
    exports.commandField = commandField;
    function customField(params) {
        return new CustomField(params);
    }
    exports.customField = customField;
});
