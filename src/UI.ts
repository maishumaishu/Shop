import bootbox = require('bootbox');

export class CommandField extends wuzhui.CustomField {
    constructor(params: {
        edit: (dataItem) => void,
        headerText?: string,
        headerStyle?: CSSStyleDeclaration,
        itemStyle?: CSSStyleDeclaration,
    }) {

        let createItemCell = (dataItem) => {
            var cell: wuzhui.GridViewCell = new wuzhui.GridViewCell();
            let self = this as CommandField;

            if (params.edit) {
                var editButton = document.createElement('button');
                editButton.className = 'btn btn-minier btn-info';
                editButton.innerHTML = '<i class="icon-pencil"></i>';
                cell.appendChild(editButton);

                editButton.onclick = (event) => {
                    var rowElement = self.findParnet(event.target as HTMLElement, 'TR');
                    let row = wuzhui.Control.getControlByElement(rowElement) as wuzhui.GridViewDataRow;
                    params.edit(row.dataItem);
                }
            }

            var deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-minier btn-danger';
            deleteButton.innerHTML = '<i class="icon-trash"></i>';
            deleteButton.style.marginLeft = '4px';
            cell.appendChild(deleteButton);

            deleteButton.onclick = buttonOnClick(() => {
                let row = wuzhui.Control.getControlByElement(cell.element.parentElement) as wuzhui.GridViewDataRow;
                let table = self.findParnet(cell.element, 'TABLE');
                let gridView = wuzhui.Control.getControlByElement(table) as wuzhui.GridView;
                return gridView.dataSource.delete(row.dataItem);
            });

            return cell;
        }

        let { headerText, headerStyle, itemStyle } = params;
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
    createGridView({
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

    console.assert(params.element != null);
    params.element.className = 'table table-striped table-bordered table-hover';

    let gridView = new wuzhui.GridView(params);
    return gridView;
}

export function buttonOnClick(callback: (event: MouseEvent) => Promise<any>, args?: { confirm?: string }) {
    args = args || {};

    let execute = async (event) => {
        let button = (event.target as HTMLButtonElement);
        button.setAttribute('disabled', '');
        try {
            await callback(event);
        }
        catch (exc) {
            console.error(exc);
           throw exc;
        }
        finally {
            button.removeAttribute('disabled')
        }
    }

    return function (event) {
        let confirmPromise: Promise<any>;
        if (!args.confirm) {
            confirmPromise = Promise.resolve();
        }
        else {
            confirmPromise = new Promise((reslove, reject) => {
                bootbox.confirm(args.confirm, (result) => {
                    if (!result) {
                        reject();
                        return
                    };
                    reslove();
                });
            });
        }

        confirmPromise.then(() => execute(event));
    }
}