import { FormValidator } from 'dilu';
import * as ui from 'ui';

type GridViewItemPopupEditorProps = React.Props<GridViewItemPopupEditor> & {
    saveDataItem: (dataItem: any) => Promise<any>,
    name?: string
};

type CommandFieldParams = {
    itemEditor?: GridViewItemPopupEditor,
    headerText?: string,
    headerStyle?: CSSStyleDeclaration,
    itemStyle?: CSSStyleDeclaration,
    leftButtons?: (dataItem) => Array<JSX.Element>
}

export class GridViewItemPopupEditor extends React.Component<GridViewItemPopupEditorProps, { title: string }> {
    element: HTMLElement;
    private dataItem: any;
    validator: FormValidator;

    constructor(props) {
        super(props);
        this.state = { title: '' };
    }
    show(dataItem?: any) {
        this.state.title = (dataItem ? '编辑' : '添加') + (this.props.name || '');;
        this.setState(this.state);
        this.dataItem = dataItem = dataItem || {};
        for (let key in dataItem) {
            let inputField = this.element.querySelector(`[name="${key}"]`) as HTMLInputElement;
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
    formatValue(value): string {
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
    private async ok() {
        let validator = this.validator;
        if (validator) {
            validator.clearErrors();
            let isValid = await validator.check();
            if (!isValid)
                return Promise.reject({});
        }

        let names = [];
        let inputFields = this.element.querySelectorAll('input, select');
        for (let i = 0; i < inputFields.length; i++) {
            let name = (inputFields[i] as (HTMLInputElement | HTMLSelectElement)).name;
            if (!name)
                continue;

            if (names.indexOf(name) < 0)
                names.push(name);
        }

        for (let i = 0; i < names.length; i++) {
            var elements = this.element.querySelectorAll(`[name=${names[i]}]`);
            let value: string = null;
            for (let j = 0; j < elements.length; j++) {
                let elementType = (elements[j] as (HTMLInputElement | HTMLSelectElement)).type;
                if ((elementType == 'checkbox' || elementType == 'radio') && !(elements[j] as HTMLInputElement).checked) {
                    continue;
                }
                let elementValue = (elements[j] as (HTMLInputElement | HTMLSelectElement)).value;
                value = value == null ? elementValue : value + ',' + elementValue;
            }
            this.dataItem[names[i]] = value;
        }


        return this.props.saveDataItem(this.dataItem).then(data => {
            this.hide();
            return data;
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
        return (
            <div className="modal fade" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
                            </button>
                            <h4 className="modal-title">{this.state.title}</h4>
                        </div>
                        <div className="modal-body form-horizontal">
                            {(this.props.children)}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                            <button type="button" className="btn btn-primary"
                                ref={(e: HTMLButtonElement) => {
                                    if (!e) return;
                                    e.onclick = ui.buttonOnClick(() => this.ok())

                                }}>确认</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class CommandField extends wuzhui.CustomField {
    constructor(params: CommandFieldParams) {

        let createItemCell = (dataItem) => {
            var cell: wuzhui.GridViewCell = new wuzhui.GridViewCell();
            let self = this as CommandField;

            let buttons = new Array<HTMLElement>();
            let leftButtons = params.leftButtons != null ? params.leftButtons(dataItem) : null;
            if (leftButtons) {
                leftButtons.map((o, i) => {
                    let element = document.createElement('span');
                    element.style.marginRight = '4px';
                    ReactDOM.render(o, element);
                    return element;

                }).forEach(item => buttons.push(item));//cell.element.appendChild(item)
            }

            if (params.itemEditor) {
                var editButton = document.createElement('button');
                editButton.className = 'btn btn-minier btn-info';
                editButton.innerHTML = '<i class="icon-pencil"></i>';
                // cell.appendChild(editButton);

                editButton.onclick = (event) => {
                    var rowElement = self.findParnet(event.target as HTMLElement, 'TR');
                    let row = wuzhui.Control.getControlByElement(rowElement) as wuzhui.GridViewDataRow;
                    // params.edit(row.dataItem);
                    params.itemEditor.show(row.dataItem);
                }

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
                let row = wuzhui.Control.getControlByElement(cell.element.parentElement) as wuzhui.GridViewDataRow;
                let table = self.findParnet(cell.element, 'TABLE');
                let gridView = wuzhui.Control.getControlByElement(table) as wuzhui.GridView;
                return gridView.dataSource.delete(row.dataItem);
            });


            return cell;
        }

        let { headerText, headerStyle, itemStyle } = params;
        headerText = headerText || '操作';

        headerStyle = headerStyle || {} as CSSStyleDeclaration;
        if (!headerStyle.textAlign)
            headerStyle.textAlign = 'center';

        itemStyle = itemStyle || {} as CSSStyleDeclaration;
        if (!itemStyle.textAlign)
            itemStyle.textAlign = 'center';

        let supperParams = { headerText, headerStyle, itemStyle, createItemCell } as wuzhui.CustomFieldParams;
        super(supperParams);
    }

    private findParnet(element: HTMLElement, tagName: string) {
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

export class BoundField extends wuzhui.BoundField {
    constructor(params: wuzhui.BoundFieldParams) {
        params.headerStyle = Object.assign({ textAlign: 'center' } as CSSStyleDeclaration, params.headerStyle || {});
        if (params.nullText == null)
            params.nullText = '';

        super(params)
    }
}

export class CustomField extends wuzhui.CustomField {
    constructor(params: wuzhui.CustomFieldParams) {
        params.headerStyle = Object.assign({ textAlign: 'center' } as CSSStyleDeclaration, params.headerStyle || {});
        super(params);
    }
}

export function appendGridView(target: HTMLElement,
    args: { dataSource: wuzhui.DataSource<any>, columns: wuzhui.DataControlField[], pageSize?: number }) {

    let tableElement = document.createElement('table');
    target.appendChild(tableElement);
    return createGridView({
        dataSource: args.dataSource, columns: args.columns, element: tableElement,
        pageSize: args.pageSize
    });

}
export function createGridView(params: wuzhui.GridViewArguments) {
    params = Object.assign({
        pageSize: 10,
        dataSource: null,
        columns: null,
    } as wuzhui.GridViewArguments, params);

    params.pagerSettings = Object.assign({
        activeButtonClassName: 'active'
    } as wuzhui.PagerSettings, params.pagerSettings);

    console.assert(params.element != null, 'element can not null.');
    params.element.className = 'table table-striped table-bordered table-hover';

    let gridView = new wuzhui.GridView(params);
    return gridView;
}

export function boundField(params: wuzhui.BoundFieldParams) {
    return new BoundField(params)
}

export function commandField(params: CommandFieldParams) {
    return new CommandField(params);
}

export function customField(params: wuzhui.CustomFieldParams) {
    return new CustomField(params);
}
