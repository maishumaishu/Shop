declare namespace wuzhui {
    class Control<T extends HTMLElement> {
        private _text;
        private _visible;
        private _element;
        constructor(element: T);
        visible: boolean;
        readonly element: T;
        appendChild(child: Control<any> | HTMLElement, index?: number): void;
        style(value: CSSStyleDeclaration | string): void;
        static getControlByElement(element: HTMLElement): Control<any>;
    }
}
declare namespace wuzhui {
    interface DataSourceSelectResult<T> {
        totalRowCount: number;
        dataItems: Array<T>;
    }
    interface DataSourceError extends Error {
        handled: boolean;
        method: DataMethod;
    }
    type DataMethod = 'select' | 'update' | 'delete' | 'insert';
    type SelectResult<T> = Array<T> | DataSourceSelectResult<T>;
    class DataSource<T> {
        private _currentSelectArguments;
        private args;
        private primaryKeys;
        inserting: Callback<DataSource<T>, {
            item: T;
        }>;
        inserted: Callback<DataSource<T>, {
            item: T;
            index: number;
        }>;
        deleting: Callback<DataSource<T>, {
            item: T;
        }>;
        deleted: Callback<DataSource<T>, {
            item: T;
        }>;
        updating: Callback<DataSource<T>, {
            item: T;
        }>;
        updated: Callback<DataSource<T>, {
            item: T;
        }>;
        selecting: Callback<DataSource<T>, {
            selectArguments: DataSourceSelectArguments;
        }>;
        selected: Callback<DataSource<T>, {
            selectArguments: DataSourceSelectArguments;
            items: T[];
        }>;
        error: Callback<this, DataSourceError>;
        constructor(args: DataSourceArguments<T>);
        readonly canDelete: boolean;
        readonly canInsert: boolean;
        readonly canUpdate: boolean;
        protected executeInsert(item: T): Promise<any>;
        protected executeDelete(item: T): Promise<any>;
        protected executeUpdate(item: T): Promise<any>;
        protected executeSelect(args: DataSourceSelectArguments): Promise<SelectResult<T>>;
        readonly selectArguments: DataSourceSelectArguments;
        insert(item: T): Promise<any>;
        delete(item: T): Promise<any>;
        update(item: T): Promise<any>;
        isSameItem(theItem: T, otherItem: T): boolean;
        private checkPrimaryKeys(item);
        select(): Promise<void | T[] | DataSourceSelectResult<T>>;
        private processError(exc, method);
    }
    class DataSourceSelectArguments {
        startRowIndex?: number;
        totalRowCount?: number;
        maximumRows?: number;
        sortExpression?: string;
        filter?: string;
        constructor();
    }
    type DataSourceArguments<T> = {
        primaryKeys?: string[];
        select: ((args: DataSourceSelectArguments) => Promise<SelectResult<T>>);
        insert?: ((item: T) => Promise<any>);
        update?: ((item: T) => Promise<any>);
        delete?: ((item: T) => Promise<any>);
    };
    class WebDataSource<T> extends DataSource<T> {
    }
    class ArrayDataSource<T> extends DataSource<T> {
    }
}
declare namespace wuzhui {
    class Errors {
        constructor(parameters: any);
        static notImplemented(message?: string): Error;
        static argumentNull(paramName: any): Error;
        static controllBelonsAnother(): Error;
        static columnsCanntEmpty(): Error;
        static dataSourceCanntInsert(): Error;
        static dataSourceCanntUpdate(): Error;
        static dataSourceCanntDelete(): Error;
        static primaryKeyNull(key: string): Error;
    }
}
declare namespace wuzhui {
    enum GridViewRowType {
        Header = 0,
        Footer = 1,
        Data = 2,
        Paging = 3,
        Empty = 4,
    }
    class GridViewRow extends Control<HTMLTableRowElement> {
        private _rowType;
        private _gridView;
        constructor(rowType: GridViewRowType);
        readonly rowType: GridViewRowType;
        readonly gridView: GridView;
        readonly cells: GridViewCell[];
    }
    class GridViewDataRow extends GridViewRow {
        private _dataItem;
        constructor(gridView: GridView, dataItem: any);
        readonly dataItem: any;
    }
    interface GridViewArguments {
        dataSource: DataSource<any>;
        columns: Array<DataControlField>;
        showHeader?: boolean;
        showFooter?: boolean;
        element?: HTMLTableElement;
        emptyDataRowStyle?: string;
        pageSize?: number;
        pagerSettings?: PagerSettings;
        emptyDataHTML?: string;
        initDataHTML?: string;
    }
    class GridView extends Control<HTMLTableElement> {
        private _pageSize;
        private _selectedRowStyle;
        private _showFooter;
        private _showHeader;
        private _columns;
        private _dataSource;
        private _header;
        private _footer;
        private _body;
        private _emtpyRow;
        private _currentSortCell;
        private _params;
        static emptyRowClassName: string;
        static dataRowClassName: string;
        static pagingBarClassName: string;
        private emptyDataHTML;
        private initDataHTML;
        private loadFailHTML;
        rowCreated: Callback<GridView, {
            row: GridViewRow;
        }>;
        constructor(params: GridViewArguments);
        private createPagingBar(pagerSettings?);
        readonly columns: DataControlField[];
        readonly dataSource: DataSource<any>;
        private appendEmptyRow();
        private appendDataRow(dataItem, index?);
        private on_sort(sender, args);
        private appendHeaderRow();
        private appendFooterRow();
        private on_selectExecuted(items);
        private on_updateExecuted(item);
        private on_insertExecuted(item, index?);
        private on_deleteExecuted(item);
        private showEmptyRow();
        private hideEmptyRow();
    }
}
declare namespace wuzhui {
    enum PagerPosition {
        Bottom = 0,
        Top = 1,
        TopAndBottom = 2,
    }
    interface PagerSettings {
        /** The text to display for the first-page button. */
        firstPageText?: string;
        /** The text to display for the last-page button. */
        lastPageText?: string;
        /** The text to display for the last-page button. */
        nextPageText?: string;
        /** The number of page buttons to display in the pager when the Mode property is set to the Numeric or NumericFirstLast value. */
        pageButtonCount?: number;
        /** The text to display for the previous-page button. */
        previousPageText?: string;
        /** Class name of the number buttons. */
        buttonClassName?: string;
        /** Class name of the active number button. */
        activeButtonClassName?: string;
    }
    class PagingBar {
        private _pageIndex;
        private _dataSource;
        private _totalRowCount;
        private _pageSize;
        init(dataSource: DataSource<any>): void;
        readonly pageCount: number;
        pageSize: number;
        pageIndex: number;
        totalRowCount: number;
        render(): void;
    }
    interface NumberPagingButton {
        visible: boolean;
        pageIndex: number;
        text: string;
        active: boolean;
        onclick: NumberPagingButtonClickEvent;
    }
    interface PagingTotalLabel {
        text: string;
        visible: boolean;
    }
    type NumberPagingButtonClickEvent = (sender: NumberPagingButton, pagingBar: NumberPagingBar) => void;
    type PagingBarElementType = 'firstButton' | 'lastButton' | 'previousButton' | 'nextButton' | 'numberButton' | 'totalLabel';
    class NumberPagingBar extends PagingBar {
        private dataSource;
        private pagerSettings;
        private element;
        private totalElement;
        private numberButtons;
        private firstPageButton;
        private previousPageButton;
        private nextPageButton;
        private lastPageButton;
        private createLabel;
        private createButton;
        constructor(params: {
            dataSource: DataSource<any>;
            element: HTMLElement;
            pagerSettings?: PagerSettings;
            createTotal?: () => PagingTotalLabel;
            createButton?: () => NumberPagingButton;
        });
        private createPagingButton();
        private createTotalLabel();
        private createPreviousButtons();
        private createNextButtons();
        private createNumberButtons();
        private static on_buttonClick(button, pagingBar);
        render(): void;
    }
}
declare namespace wuzhui {
    function applyStyle(element: HTMLElement, value: CSSStyleDeclaration | string): void;
    class Callback<S, A> {
        private funcs;
        constructor();
        add(func: (sender: S, args: A) => any): void;
        remove(func: (sender: S, args: A) => any): void;
        fire(sender: S, args: A): void;
    }
    function callbacks<S, A>(): Callback<S, A>;
    function fireCallback<S, A>(callback: Callback<S, A>, sender: S, args: A): void;
}
declare namespace wuzhui {
    class GridViewCell extends Control<HTMLTableCellElement> {
        constructor();
    }
    class GridViewDataCell extends GridViewCell {
        private _value;
        private _valueElement;
        private nullText;
        private dataFormatString;
        private _dataField;
        private render;
        constructor(params: {
            dataItem: any;
            dataField: string;
            render?: (element: HTMLElement, value) => void;
            nullText?: string;
            dataFormatString?: string;
        });
        protected readonly valueElement: HTMLElement;
        readonly dataField: string;
        value: any;
        private formatValue(...args);
        private formatDate(value, format);
        private formatNumber(value, format);
    }
    interface DataControlFieldParams {
        footerText?: string;
        headerText?: string;
        itemStyle?: string | CSSStyleDeclaration;
        headerStyle?: string | CSSStyleDeclaration;
        footerStyle?: string | CSSStyleDeclaration;
        visible?: boolean;
        sortExpression?: string;
    }
    class GridViewHeaderCell extends Control<HTMLTableHeaderCellElement> {
        private _sortType;
        private _iconElement;
        private field;
        ascHTML: string;
        descHTML: string;
        sortingHTML: string;
        sorting: Callback<GridViewHeaderCell, {
            sortType: string;
        }>;
        sorted: Callback<GridViewHeaderCell, {
            sortType: string;
        }>;
        constructor(field: DataControlField);
        handleSort(): Promise<void>;
        private defaultHeaderText();
        sortType: "desc" | "asc";
        clearSortIcon(): void;
        private updateSortIcon();
    }
    class DataControlField {
        private _gridView;
        protected _params: DataControlFieldParams;
        constructor(params?: DataControlFieldParams);
        /**
         * Gets the text that is displayed in the footer item of a data control field.
         */
        /**
         * Sets the text that is displayed in the footer item of a data control field.
         */
        footerText: string;
        /**
         * Gets the text that is displayed in the header item of a data control field.
         */
        /**
        * Sets the text that is displayed in the header item of a data control field.
        */
        headerText: string;
        itemStyle: string | CSSStyleDeclaration;
        footerStyle: string | CSSStyleDeclaration;
        headerStyle: string | CSSStyleDeclaration;
        readonly visible: boolean;
        gridView: GridView;
        /**
         * Gets a sort expression that is used by a data source control to sort data.
         */
        /**
         * Sets a sort expression that is used by a data source control to sort data.
         */
        sortExpression: string;
        createHeaderCell(): GridViewCell;
        createFooterCell(): GridViewCell;
        createItemCell(dataItem: any): GridViewCell;
    }
}
declare namespace wuzhui {
    class GridViewEditableCell extends GridViewDataCell {
        private _dataItem;
        private _editorElement;
        private _valueType;
        private _field;
        constructor(field: BoundField, dataItem: any);
        readonly field: BoundField;
        beginEdit(): void;
        endEdit(): void;
        cancelEdit(): void;
        protected createControl(): HTMLElement;
        controlValue: any;
    }
    interface BoundFieldParams extends DataControlFieldParams {
        dataField: string;
        dataFormatString?: string;
        controlStyle?: CSSStyleDeclaration | string;
        nullText?: string;
    }
    class BoundField extends DataControlField {
        private _sortType;
        private _valueElement;
        constructor(params: BoundFieldParams);
        private params();
        /**
         * Gets the caption displayed for a field when the field's value is null.
         */
        readonly nullText: string;
        createItemCell(dataItem: any): GridViewCell;
        /**
         * Gets the field for the value.
         */
        readonly dataField: string;
        /**
         * Gets the string that specifies the display format for the value of the field.
         */
        readonly dataFormatString: string;
        readonly controlStyle: string | CSSStyleDeclaration;
    }
}
declare namespace wuzhui {
    interface CommandFieldParams extends DataControlFieldParams {
        showEditButton?: boolean;
        showNewButton?: boolean;
        showDeleteButton?: boolean;
        cancelButtonHTML?: string;
        deleteButtonHTML?: string;
        editButtonHTML?: string;
        newButtonHTML?: string;
        updateButtonHTML?: string;
        insertButtonHTML?: string;
        cancelButtonClass?: string;
        deleteButtonClass?: string;
        editButtonClass?: string;
        newButtonClass?: string;
        updateButtonClass?: string;
        insertButtonClass?: string;
        handleUpdate?: () => Promise<any>;
    }
    class CommandField extends DataControlField {
        private currentMode;
        constructor(params?: CommandFieldParams);
        private params();
        readonly cancelButtonHTML: string;
        readonly deleteButtonHTML: string;
        readonly editButtonHTML: string;
        readonly updateButtonHTML: string;
        readonly newButtonHTML: string;
        readonly insertButtonHTML: string;
        readonly cancelButtonClass: string;
        readonly deleteButtonClass: string;
        readonly editButtonClass: string;
        readonly newButtonClass: string;
        readonly updateButtonClass: string;
        readonly insertButtonClass: string;
        createItemCell(dataItem: any): GridViewCell;
        private createEditButton();
        private createDeleteButton();
        private createInsertButton();
        private createUpdateButton();
        private createCancelButton();
        private createNewButton();
        private hideButton(button);
        private showButton(button);
        private findParentCell(element);
        private on_editButtonClick(e);
        private on_cancelButtonClick(e);
        private on_updateButtonClick(e);
        private on_deleteButtonClick(e);
    }
}
declare namespace wuzhui {
    interface CustomFieldParams extends DataControlFieldParams {
        createHeaderCell?: () => GridViewCell;
        createFooterCell?: () => GridViewCell;
        createItemCell: (dataItem: any) => GridViewCell;
    }
    class CustomField extends DataControlField {
        constructor(params: CustomFieldParams);
        private params();
        createHeaderCell(): GridViewCell;
        createFooterCell(): GridViewCell;
        createItemCell(dataItem: any): GridViewCell;
    }
}
