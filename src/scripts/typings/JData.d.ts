declare namespace JData {
    class WebDataSource {
        constructor(selectUrl: string, insertUrl: string, updateUrl: string, deleteUrl: string);
        delete(item: any);
        insert(item: any);
        select(args?: any);
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
    dialog({ });
    valid();
    validate({ });
    datepicker
}


declare module "JData" {
    export = JData;
}

