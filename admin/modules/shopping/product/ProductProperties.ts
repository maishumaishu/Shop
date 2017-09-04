import bs = require('bootstrap');

interface KeyValue {
    key: KnockoutObservable<string>,
    value: KnockoutObservable<string>
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

    title = ko.observable<string>();
    execute: (dialogModel: DialogModel) => JQueryPromise<any>;
    ok = ko.observable<() => void>(() => {
        if (this.execute) {
            this.execute(this).done(() => {
                this.close();
            });
            return;
        }
        this.close();
    });
    show() {
        (<any>$(this.element)).modal({ backdrop: false, show: true });
    }
    close() {
        (<any>$(this.element)).modal('hide');
    }
}


class NamesInputModel extends DialogModel {
    constructor(componentElement: HTMLElement) {
        super($(componentElement).find('[name="names_input_dianlog"]')[0]);
    }
    names = ko.observable<string>();
}

class ProductPropertiesModel {
    private properties: KnockoutObservableArray<KeyValue>;
    private name: string;
    private propertiesGroups: KnockoutComputed<KeyValue[][]>;
    private namesInput: NamesInputModel;
    constructor(params: {
        properties: KnockoutObservableArray<KeyValue>,
        name: string
    }, element: HTMLElement) {

        this.properties = params.properties;
        console.assert(this.properties != null);
        this.name = params.name || '';
        this.propertiesGroups = ko.computed<KeyValue[][]>(() => {
            let result = arrayToGroup(this.properties());
            return result;
        });
        this.namesInput = new NamesInputModel(element);
    }

    private showNamesInputDialog(title: string) {

        this.namesInput.names(this.properties().map(o => o.key()).join('， '));
        this.namesInput.title(title);
        this.namesInput.execute = (dialogModel: NamesInputModel) => {
            let properties = this.properties();
            for (let i = 0; i < properties.length; i++) {
                let key = properties[i].key();
                let value = properties[i].value();
                properties[key] = value;
            }

            //let org_names = this.properties().map(o => o.key());

            this.properties.removeAll();
            let names = dialogModel.names().replace(/，/g, ',').split(',');
            names.filter(o => o.trim() != '').forEach(key => {
                let value = properties[key] || '';
                this.properties.push({ key: ko.observable(key), value: ko.observable(value) });
            })

            return $.Deferred().resolve();
        };
        this.namesInput.show();
    }

    //===========================================
    showPropertiesDialog = () => {
        this.showNamesInputDialog('设置属数');
    }
    //===========================================
}

export = {
    createViewModel: (params, componentInfo: { element: HTMLElement }) => {
        return new ProductPropertiesModel(params, componentInfo.element);
    }
};



