declare namespace JData {
    class WebDataSource {
        set_selectUrl(value: string);
    }
}

interface JDataStatic {
    // (selector: string, context?: Element | JQuery): Bootstrap;
    // (element: Element): Bootstrap;
    // (elementArray: Element[]): Bootstrap;
    gridView({
        dataSource: any,
        columns: Array,
        allowPaging: boolean,
        rowCreated: Function
    });
    dialog({});
    valid();
    validate({});
    datepicker
}


declare module "JData" {
    export = JData;
}

