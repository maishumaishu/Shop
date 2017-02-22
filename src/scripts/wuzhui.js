var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var wuzhui;
(function (wuzhui) {
    const CONTROL_DATA_NAME = 'Control';
    class Control {
        constructor(element) {
            if (!element)
                throw wuzhui.Errors.argumentNull('element');
            this._element = element;
            $(element).data(CONTROL_DATA_NAME, this);
        }
        get html() {
            return $(this.element).html();
        }
        set html(value) {
            $(this.element).html(value);
        }
        get visible() {
            return $(this.element).is(':visible');
        }
        set visible(value) {
            if (value)
                $(this._element).show();
            else
                $(this._element).hide();
        }
        get element() {
            return this._element;
        }
        appendChild(child) {
            if (child == null)
                throw wuzhui.Errors.argumentNull('child');
            let childElement;
            if (child instanceof Control)
                childElement = child.element;
            else
                childElement = child;
            this.element.appendChild(childElement);
        }
        style(value) {
            wuzhui.applyStyle(this.element, value);
        }
        static getControlByElement(element) {
            return $(element).data(CONTROL_DATA_NAME);
        }
    }
    wuzhui.Control = Control;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    class DataSource {
        constructor(primaryKeys) {
            this.inserting = wuzhui.callbacks();
            this.inserted = wuzhui.callbacks();
            this.deleting = wuzhui.callbacks();
            this.deleted = wuzhui.callbacks();
            this.updating = wuzhui.callbacks();
            this.updated = wuzhui.callbacks();
            this.selecting = wuzhui.callbacks();
            this.selected = wuzhui.callbacks();
            this.primaryKeys = primaryKeys || [];
            this._currentSelectArguments = new DataSourceSelectArguments();
        }
        get selectArguments() {
            return this._currentSelectArguments;
        }
        executeInsert(item) {
            throw wuzhui.Errors.notImplemented();
        }
        executeDelete(item) {
            throw wuzhui.Errors.notImplemented();
        }
        executeUpdate(item) {
            throw wuzhui.Errors.notImplemented();
        }
        executeSelect(args) {
            throw wuzhui.Errors.notImplemented();
        }
        insert(item) {
            if (!this.canInsert)
                throw wuzhui.Errors.dataSourceCanntInsert();
            this.checkPrimaryKeys(item);
            wuzhui.fireCallback(this.inserting, this, { item });
            return this.executeInsert(item).then((data) => {
                $.extend(item, data);
                wuzhui.fireCallback(this.inserted, this, { item });
            });
        }
        delete(item) {
            if (!this.canDelete)
                throw wuzhui.Errors.dataSourceCanntDelete();
            this.checkPrimaryKeys(item);
            //this.deleting.fireWith(this, [this, { item }]);
            wuzhui.fireCallback(this.deleting, this, { item });
            return this.executeDelete(item).then(() => {
                // this.deleted.fireWith(this, [this, { item }]);
                wuzhui.fireCallback(this.deleted, this, { item });
            });
        }
        update(item) {
            if (!this.canUpdate)
                throw wuzhui.Errors.dataSourceCanntUpdate();
            this.checkPrimaryKeys(item);
            //this.updating.fireWith(this, [this, { item }]);
            wuzhui.fireCallback(this.updating, this, { item });
            return this.executeUpdate(item).then((data) => {
                $.extend(item, data);
                // this.updated.fireWith(this, [this, { item }]);
                wuzhui.fireCallback(this.updated, this, { item });
            });
        }
        isSameItem(theItem, otherItem) {
            if (theItem == null)
                throw wuzhui.Errors.argumentNull('theItem');
            if (otherItem == null)
                throw wuzhui.Errors.argumentNull('otherItem');
            if (theItem != otherItem && this.primaryKeys.length == 0)
                return false;
            if (this.primaryKeys.length > 0) {
                for (let pk of this.primaryKeys) {
                    if (theItem[pk] != otherItem[pk])
                        return false;
                }
            }
            return true;
        }
        checkPrimaryKeys(item) {
            for (let key in item) {
                if (item[key] == null && this.primaryKeys.indexOf(key) >= 0)
                    throw wuzhui.Errors.primaryKeyNull(key);
            }
        }
        select() {
            let args = this.selectArguments;
            // this.selecting.fireWith(this, [this, { selectArguments: args }]);
            wuzhui.fireCallback(this.selecting, this, { selectArguments: args });
            return this.executeSelect(args).then((data) => {
                let data_items;
                let result = data;
                if ($.isArray(data)) {
                    data_items = data;
                    args.totalRowCount = data_items.length;
                }
                else if (result.dataItems !== undefined && result.totalRowCount !== undefined) {
                    data_items = data.dataItems;
                    args.totalRowCount = data.totalRowCount;
                }
                else {
                    throw new Error('Type of the query result is expected as Array or DataSourceSelectResult.');
                }
                //this.selected.fireWith(this, [this, { selectArguments: args, items: data_items }]);
                wuzhui.fireCallback(this.selected, this, { selectArguments: args, items: data_items });
            });
        }
        //===============================================
        //Virtual Properties
        get canDelete() {
            return false;
        }
        get canInsert() {
            return false;
        }
        get canUpdate() {
            return false;
        }
    }
    wuzhui.DataSource = DataSource;
    class DataSourceSelectArguments {
        constructor() {
            this.startRowIndex = 0;
            this.maximumRows = 2147483647;
        }
    }
    wuzhui.DataSourceSelectArguments = DataSourceSelectArguments;
    class WebDataSource extends DataSource {
        constructor(args) {
            super(args.primaryKeys);
            this.args = args;
        }
        get canDelete() {
            return this.args.deleteUrl != null && this.primaryKeys.length > 0;
        }
        get canInsert() {
            return this.args.insertUrl != null && this.primaryKeys.length > 0;
        }
        get canUpdate() {
            return this.args.updateUrl != null && this.primaryKeys.length > 0;
        }
        executeInsert(item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return wuzhui.ajax(this.args.selectUrl, { body: this.formatData(item) });
        }
        executeDelete(item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return wuzhui.ajax(this.args.deleteUrl, { body: this.formatData(item) });
        }
        executeUpdate(item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return wuzhui.ajax(this.args.updateUrl, { body: this.formatData(item) });
        }
        executeSelect(args) {
            if (!args)
                throw wuzhui.Errors.argumentNull("args");
            return wuzhui.ajax(this.args.selectUrl, { body: args });
        }
        formatData(data) {
            let obj = $.extend({}, data);
            for (let name in obj) {
                if (data[name] instanceof Date) {
                    // 说明：对于MVC3，必须把日期时间转换成'yyyy-MM-dd HH:mm'这种格式。
                    let date = obj[name];
                    let y = date.getFullYear();
                    let m = date.getMonth() + 1;
                    let d = date.getDate();
                    let h = date.getHours();
                    let M = date.getMinutes();
                    let s = date.getSeconds();
                    obj[name] = y + "-" + m + "-" + d + " " + h + ":" + M + ":" + s;
                }
            }
            return obj;
        }
    }
    wuzhui.WebDataSource = WebDataSource;
    class ArrayDataSource extends DataSource {
        constructor(items, primaryKeys) {
            if (items == null)
                throw wuzhui.Errors.argumentNull('items');
            super(primaryKeys);
            this.source = items;
        }
        executeInsert(item) {
            if (item == null)
                throw wuzhui.Errors.argumentNull('item');
            this.source.push(item);
            return Promise.resolve();
        }
        executeDelete(item) {
            if (item == null)
                throw wuzhui.Errors.argumentNull('item');
            let pkValues = this.getPrimaryKeyValues(item);
            let itemIndex = this.findItem(pkValues);
            this.source.filter((value, index, array) => {
                return index != itemIndex;
            });
            return Promise.resolve();
        }
        executeUpdate(item) {
            if (item == null)
                throw wuzhui.Errors.argumentNull('item');
            let pkValues = this.getPrimaryKeyValues(item);
            let itemIndex = this.findItem(pkValues);
            if (itemIndex >= 0) {
                let sourceItem = this.source[itemIndex];
                for (let key in sourceItem) {
                    sourceItem[key] = item[key];
                }
            }
            return Promise.resolve();
        }
        executeSelect(args) {
            return Promise.resolve(this.source);
        }
        get canDelete() {
            return this.primaryKeys.length > 0;
        }
        get canInsert() {
            return this.primaryKeys.length > 0;
        }
        get canUpdate() {
            return this.primaryKeys.length > 0;
        }
        getPrimaryKeyValues(item) {
            let pkValues = [];
            for (let i = 0; i < this.primaryKeys.length; i++) {
                pkValues[i] = item[this.primaryKeys[i]];
            }
            return pkValues;
        }
        findItem(pkValues) {
            for (let i = 0; i < this.source.length; i++) {
                let item = this.source[i];
                let same = true;
                for (let j = 0; j < this.primaryKeys.length; j++) {
                    let primaryKey = this.primaryKeys[j];
                    if (item[primaryKey] != pkValues[primaryKey]) {
                        same = false;
                        break;
                    }
                }
                if (same) {
                    return i;
                }
            }
            return -1;
        }
    }
    wuzhui.ArrayDataSource = ArrayDataSource;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    class Errors {
        constructor(parameters) {
        }
        static notImplemented(message) {
            message = message || "Not implemented";
            return new Error(message);
        }
        static argumentNull(paramName) {
            return new Error("Argument '" + paramName + "' can not be null.");
        }
        static controllBelonsAnother() {
            return new Error("The control is belongs another control.");
        }
        static columnsCanntEmpty() {
            return new Error("Columns cannt empty.");
        }
        static dataSourceCanntInsert() {
            return new Error("DataSource can not insert.");
        }
        static dataSourceCanntUpdate() {
            return new Error("DataSource can not update.");
        }
        static dataSourceCanntDelete() {
            return new Error("DataSource can not delete.");
        }
        static primaryKeyNull(key) {
            let msg = `Primary key named '${key}' value is null.`;
            return new Error(msg);
        }
    }
    wuzhui.Errors = Errors;
})(wuzhui || (wuzhui = {}));
/// <reference path="Control.ts"/>
var wuzhui;
(function (wuzhui) {
    var GridViewRowType;
    (function (GridViewRowType) {
        GridViewRowType[GridViewRowType["Header"] = 0] = "Header";
        GridViewRowType[GridViewRowType["Footer"] = 1] = "Footer";
        GridViewRowType[GridViewRowType["Data"] = 2] = "Data";
        GridViewRowType[GridViewRowType["Paging"] = 3] = "Paging";
        GridViewRowType[GridViewRowType["Empty"] = 4] = "Empty";
    })(GridViewRowType = wuzhui.GridViewRowType || (wuzhui.GridViewRowType = {}));
    class GridViewRow extends wuzhui.Control {
        constructor(rowType) {
            let element = document.createElement('tr');
            super(element);
            this._rowType = rowType;
        }
        get rowType() {
            return this._rowType;
        }
        get gridView() {
            if (this._gridView == null) {
                let gridViewElement = $(this.element).parents('table').first()[0];
                console.assert(gridViewElement != null);
                this._gridView = wuzhui.Control.getControlByElement(gridViewElement);
                console.assert(this._gridView != null);
            }
            return this._gridView;
        }
        get cells() {
            let cells = new Array();
            for (let i = 0; i < this.element.cells.length; i++) {
                let cell = wuzhui.Control.getControlByElement(this.element.cells[i]);
                console.assert(cell != null);
                cells[i] = cell;
            }
            return cells;
        }
    }
    wuzhui.GridViewRow = GridViewRow;
    class GridViewDataRow extends GridViewRow {
        constructor(gridView, dataItem) {
            super(GridViewRowType.Data);
            this._dataItem = dataItem;
            for (var i = 0; i < gridView.columns.length; i++) {
                var column = gridView.columns[i];
                var cell = column.createItemCell(dataItem);
                cell.visible = column.visible;
                this.appendChild(cell);
            }
        }
        get dataItem() {
            return this._dataItem;
        }
    }
    wuzhui.GridViewDataRow = GridViewDataRow;
    class GridView extends wuzhui.Control {
        constructor(params) {
            super(params.element || document.createElement('table'));
            this.emptyDataText = '暂无记录';
            //========================================================
            // 样式
            // headerStyle: string;
            // footerStyle: string;
            // rowStyle: string;
            // alternatingRowStyle: string;
            //private emptyDataRowStyle: string;
            //========================================================
            this.rowCreated = wuzhui.callbacks();
            params = $.extend({
                showHeader: true, showFooter: false,
                allowPaging: false
            }, params);
            this._params = params;
            this._columns = params.columns || [];
            if (this._columns.length == 0)
                throw wuzhui.Errors.columnsCanntEmpty();
            for (var i = 0; i < this._columns.length; i++) {
                var column = this._columns[i];
                column.gridView = this;
            }
            this._dataSource = params.dataSource;
            this._dataSource.selected.add((sender, e) => this.on_selectExecuted(e.items, e.selectArguments));
            this._dataSource.updated.add((sender, e) => this.on_updateExecuted(e.item));
            if (params.showHeader) {
                this._header = new wuzhui.Control(document.createElement('thead'));
                this.appendChild(this._header);
                this.appendHeaderRow();
            }
            this._body = new wuzhui.Control(document.createElement('tbody'));
            this.appendChild(this._body);
            this.appendEmptyRow();
            if (params.showFooter) {
                this._footer = new wuzhui.Control(document.createElement('tfoot'));
                this.appendChild(this._footer);
                if (params.showFooter)
                    this.appendFooterRow();
            }
        }
        get columns() {
            return this._columns;
        }
        get dataSource() {
            return this._dataSource;
        }
        appendEmptyRow() {
            this._emtpyRow = new GridViewRow(GridViewRowType.Empty);
            this._emtpyRow.element.className = GridView.emptyRowClassName;
            let cell = document.createElement('td');
            cell.colSpan = this.columns.length;
            let textElement = document.createElement('span');
            textElement.innerText = this.emptyDataText;
            cell.appendChild(textElement);
            if (!this._params.emptyDataRowStyle) {
                wuzhui.applyStyle(cell, this._params.emptyDataRowStyle);
            }
            this._emtpyRow.appendChild(cell);
            this._body.appendChild(this._emtpyRow);
            wuzhui.fireCallback(this.rowCreated, this, { row: this._emtpyRow });
        }
        appendDataRow(dataItem) {
            var row = new GridViewDataRow(this, dataItem);
            row.element.className = GridView.dataRowClassName;
            this._body.appendChild(row);
            wuzhui.fireCallback(this.rowCreated, this, { row });
        }
        on_sort(sender, args) {
            if (this._currentSortCell != null && this._currentSortCell != sender) {
                this._currentSortCell.clearSortIcon();
            }
            this._currentSortCell = sender;
        }
        appendHeaderRow() {
            var row = new GridViewRow(GridViewRowType.Header);
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                let cell = column.createHeaderCell();
                if (cell instanceof wuzhui.GridViewHeaderCell) {
                    cell.sorting.add(this.on_sort);
                }
                row.appendChild(cell);
                cell.visible = this.columns[i].visible;
            }
            this._header.appendChild(row);
        }
        appendFooterRow() {
            var row = new GridViewRow(GridViewRowType.Footer);
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                let cell = column.createFooterCell();
                row.appendChild(cell);
                cell.visible = column.visible;
            }
            this._footer.appendChild(row);
        }
        on_selectExecuted(items, args) {
            // Clear datarows
            $(this._body.element).find(`.${GridView.dataRowClassName}`).each((i, e) => this._body.element.removeChild(e));
            if (items.length == 0) {
                this.showEmptyRow();
                return;
            }
            this.hideEmptyRow();
            for (let i = 0; i < items.length; i++) {
                this.appendDataRow(items[i]);
            }
        }
        on_updateExecuted(item) {
            console.assert(item != null);
            for (let i = 0; i < this._body.element.rows.length; i++) {
                let row_element = this._body.element.rows[i];
                let row = $(row_element).data('Control');
                if (!(row instanceof GridViewDataRow))
                    continue;
                let dataItem = row.dataItem;
                if (!this.dataSource.isSameItem(item, dataItem))
                    continue;
                for (let i = 0; i < this.columns.length; i++) {
                    let col = this.columns[i];
                    if (!(col instanceof wuzhui.BoundField))
                        continue;
                    let cell = row.cells[i];
                    if (cell instanceof wuzhui.GridViewEditableCell) {
                        let c = cell;
                        let value = item[col.dataField];
                        if (value !== undefined) {
                            c.value = value;
                            dataItem[col.dataField] = value;
                        }
                    }
                }
                break;
            }
        }
        showEmptyRow() {
            $(this._emtpyRow.element).show();
        }
        hideEmptyRow() {
            $(this._emtpyRow.element).hide();
        }
    }
    GridView.emptyRowClassName = 'empty';
    GridView.dataRowClassName = 'data';
    wuzhui.GridView = GridView;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var PagerPosition;
    (function (PagerPosition) {
        PagerPosition[PagerPosition["Bottom"] = 0] = "Bottom";
        PagerPosition[PagerPosition["Top"] = 1] = "Top";
        PagerPosition[PagerPosition["TopAndBottom"] = 2] = "TopAndBottom";
    })(PagerPosition = wuzhui.PagerPosition || (wuzhui.PagerPosition = {}));
    ;
    class PagingBar {
        init(dataSource) {
            if (dataSource == null)
                throw wuzhui.Errors.argumentNull('dataSource');
            this._pageIndex = 0;
            this._dataSource = dataSource;
            var pagingBar = this;
            pagingBar.totalRowCount = 1000000;
            dataSource.selected.add((source, args) => {
                pagingBar._pageSize = args.selectArguments.maximumRows;
                var totalRowCount = args.selectArguments.totalRowCount;
                if (totalRowCount != null && totalRowCount >= 0) {
                    pagingBar.totalRowCount = totalRowCount;
                }
                var startRowIndex = args.selectArguments.startRowIndex;
                if (startRowIndex <= 0)
                    startRowIndex = 0;
                pagingBar._pageIndex = Math.floor(startRowIndex / pagingBar._pageSize);
                pagingBar.render();
            });
            dataSource.deleted.add(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount - 1;
                pagingBar.render();
            });
            dataSource.inserted.add(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount + 1;
                pagingBar.render();
            });
        }
        get pageCount() {
            var pageCount = Math.ceil(this.totalRowCount / this.pageSize);
            return pageCount;
        }
        get pageSize() {
            return this._pageSize;
        }
        set pageSize(value) {
            this._pageSize = value;
        }
        get pageIndex() {
            return this._pageIndex;
        }
        set pageIndex(value) {
            this._pageIndex = value;
        }
        get totalRowCount() {
            return this._totalRowCount;
        }
        set totalRowCount(value) {
            this._totalRowCount = value;
        }
        // Virtual Method
        render() {
            throw wuzhui.Errors.notImplemented('The table-row render method is not implemented.');
        }
    }
    wuzhui.PagingBar = PagingBar;
    class NumberPagingBar extends PagingBar {
        constructor(params) {
            if (!params.dataSource)
                throw wuzhui.Errors.argumentNull('dataSource');
            if (!params.element)
                throw wuzhui.Errors.argumentNull('element');
            let pagerSettings = $.extend({
                pageButtonCount: 10,
                firstPageText: '<<',
                lastPageText: '>>',
                nextPageText: '...',
                previousPageText: '...',
            }, params.pagerSettings || {});
            super();
            this.dataSource = params.dataSource;
            this.pagerSettings = pagerSettings;
            this.element = params.element;
            this.numberButtons = new Array();
            this.createButton = params.createButton || this.createPagingButton;
            this.createLabel = params.createTotal || this.createTotalLabel;
            this.createPreviousButtons();
            this.createNumberButtons();
            this.createNextButtons();
            this.totalElement = this.createLabel();
            this.totalElement.visible = false;
            this.init(params.dataSource);
        }
        createPagingButton() {
            let button = document.createElement('a');
            button.href = 'javascript:';
            this.element.appendChild(button);
            let result = {
                get visible() {
                    return $(button).is(':visible');
                },
                set visible(value) {
                    if (value)
                        $(button).show();
                    else
                        $(button).hide();
                },
                get pageIndex() {
                    return new Number($(button).attr('pageIndex')).valueOf();
                },
                set pageIndex(value) {
                    $(button).attr('pageIndex', value);
                },
                get text() {
                    return button.innerHTML;
                },
                set text(value) {
                    button.innerHTML = value;
                },
                get active() {
                    return button.href != null;
                },
                set active(value) {
                    if (value == true) {
                        $(button).removeAttr('href');
                        return;
                    }
                    button.href = 'javascript:';
                }
            };
            $(button).click(() => {
                if (result.onclick) {
                    result.onclick(result, this);
                }
            });
            return result;
        }
        createTotalLabel() {
            let totalElement = document.createElement('span');
            totalElement.className = 'total';
            let textElement = document.createElement('span');
            textElement.className = 'text';
            textElement.innerHTML = '总记录：';
            totalElement.appendChild(textElement);
            let numberElement = document.createElement('span');
            numberElement.className = 'number';
            totalElement.appendChild(numberElement);
            this.element.appendChild(totalElement);
            return {
                get text() {
                    return numberElement.innerHTML;
                },
                set text(value) {
                    numberElement.innerHTML = value;
                },
                get visible() {
                    return $(totalElement).is(':visible');
                },
                set visible(value) {
                    if (value == true)
                        $(totalElement).show();
                    else
                        $(totalElement).hide();
                }
            };
        }
        createPreviousButtons() {
            this.firstPageButton = this.createButton();
            this.firstPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.firstPageButton.text = this.pagerSettings.firstPageText;
            this.firstPageButton.visible = false;
            this.previousPageButton = this.createButton();
            this.previousPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.previousPageButton.text = this.pagerSettings.previousPageText;
            this.previousPageButton.visible = false;
        }
        createNextButtons() {
            this.nextPageButton = this.createButton();
            this.nextPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.nextPageButton.text = this.pagerSettings.nextPageText;
            this.nextPageButton.visible = false;
            this.lastPageButton = this.createButton();
            this.lastPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.lastPageButton.text = this.pagerSettings.lastPageText;
            this.lastPageButton.visible = false;
        }
        createNumberButtons() {
            let pagingBar = this;
            let buttonCount = this.pagerSettings.pageButtonCount;
            for (let i = 0; i < buttonCount; i++) {
                let button = this.createButton(); //NumberPagingBar.on_buttonClick)
                button.onclick = NumberPagingBar.on_buttonClick;
                this.numberButtons[i] = button;
            }
            $(this.numberButtons).click(function () {
                NumberPagingBar.on_buttonClick(this, pagingBar);
            });
        }
        static on_buttonClick(button, pagingBar) {
            let pageIndex = button.pageIndex;
            if (!pageIndex == null) {
                return;
            }
            let args = pagingBar.dataSource.selectArguments;
            args.maximumRows = pagingBar.pageSize;
            args.startRowIndex = pageIndex * pagingBar.pageSize;
            pagingBar.pageIndex = pageIndex;
            pagingBar.dataSource.select();
        }
        render() {
            var pagerSettings = this.pagerSettings;
            var buttonCount = pagerSettings.pageButtonCount;
            let pagingBarIndex = Math.floor(this.pageIndex / buttonCount);
            let pagingBarCount = Math.floor(this.pageCount / buttonCount) + 1;
            this.previousPageButton.pageIndex = (pagingBarIndex - 1) * buttonCount;
            this.nextPageButton.pageIndex = (pagingBarIndex + 1) * buttonCount;
            this.firstPageButton.pageIndex = 0;
            this.lastPageButton.pageIndex = this.pageCount - 1;
            for (let i = 0; i < this.numberButtons.length; i++) {
                let pageIndex = pagingBarIndex * buttonCount + i;
                if (pageIndex < this.pageCount) {
                    this.numberButtons[i].pageIndex = pageIndex;
                    this.numberButtons[i].text = (pagingBarIndex * buttonCount + i + 1).toString();
                    this.numberButtons[i].visible = true;
                    this.numberButtons[i].active = pageIndex == this.pageIndex;
                }
                else {
                    this.numberButtons[i].visible = false;
                }
            }
            this.totalElement.text = this.totalRowCount;
            this.totalElement.visible = true;
            this.firstPageButton.visible = false;
            this.previousPageButton.visible = false;
            this.lastPageButton.visible = false;
            this.nextPageButton.visible = false;
            if (pagingBarIndex > 0) {
                this.firstPageButton.visible = true;
                this.previousPageButton.visible = true;
            }
            if (pagingBarIndex < pagingBarCount - 1) {
                this.lastPageButton.visible = true;
                this.nextPageButton.visible = true;
            }
        }
    }
    wuzhui.NumberPagingBar = NumberPagingBar;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    /**
     * 判断服务端返回的数据是否为错误信息
     * @param responseData 服务端返回的数据
     */
    function isError(responseData) {
        if (responseData.Type == 'ErrorObject') {
            if (responseData.Code == 'Success') {
                return null;
            }
            let err = new Error(responseData.Message);
            err.name = responseData.Code;
            return err;
        }
        let err = responseData;
        if (err.name !== undefined && err.message !== undefined && err['stack'] !== undefined) {
            return err;
        }
        return null;
    }
    class AjaxError {
        constructor(method) {
            this.name = 'ajaxError';
            this.message = 'Ajax Error';
            this.method = method;
        }
    }
    wuzhui.AjaxError = AjaxError;
    wuzhui.ajaxTimeout = 5000;
    function ajax(url, options) {
        return new Promise((reslove, reject) => {
            let timeId;
            if (options.method == 'get') {
                timeId = setTimeout(() => {
                    let err = new AjaxError(options.method);
                    err.name = 'timeout';
                    reject(err);
                    this.error.fire(this, err);
                    clearTimeout(timeId);
                }, wuzhui.ajaxTimeout);
            }
            _ajax(url, options)
                .then(data => {
                reslove(data);
                if (timeId)
                    clearTimeout(timeId);
            })
                .catch(err => {
                reject(err);
                this.error.fire(this, err);
                if (timeId)
                    clearTimeout(timeId);
            });
        });
    }
    wuzhui.ajax = ajax;
    function _ajax(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield fetch(url, options);
                if (response.status >= 300) {
                    let err = new AjaxError(options.method);
                    err.name = `${response.status}`;
                    err.message = response.statusText;
                    throw err;
                }
                let responseText = response.text();
                let p;
                if (typeof responseText == 'string') {
                    p = new Promise((reslove, reject) => {
                        reslove(responseText);
                    });
                }
                else {
                    p = responseText;
                }
                let text = yield responseText;
                let textObject = JSON.parse(text);
                let err = isError(textObject);
                if (err)
                    throw err;
                textObject = this.travelJSON(textObject);
                return textObject;
            }
            catch (err) {
                this.error.fire(this, err);
                throw err;
            }
        });
    }
    function applyStyle(element, value) {
        let style = value || '';
        if (typeof style == 'string')
            $(element).attr('style', style);
        else {
            for (let key in style) {
                element.style[key] = style[key];
            }
        }
    }
    wuzhui.applyStyle = applyStyle;
    class Callback {
        constructor() {
            this.funcs = new Array();
        }
        add(func) {
            this.funcs.push(func);
        }
        remove(func) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(sender, args) {
            this.funcs.forEach(o => o(sender, args));
        }
    }
    wuzhui.Callback = Callback;
    function callbacks() {
        return new Callback();
    }
    wuzhui.callbacks = callbacks;
    function fireCallback(callback, sender, args) {
        callback.fire(sender, args);
    }
    wuzhui.fireCallback = fireCallback;
})(wuzhui || (wuzhui = {}));
/// <reference path="../Control.ts"/>
var wuzhui;
(function (wuzhui) {
    class GridViewCell extends wuzhui.Control {
        constructor(field) {
            super(document.createElement('td'));
            this._field = field;
        }
        get field() {
            return this._field;
        }
    }
    wuzhui.GridViewCell = GridViewCell;
    class GridViewHeaderCell extends GridViewCell {
        constructor(field) {
            super(field);
            this.ascHTML = '↑';
            this.descHTML = '↓';
            this.sortingHTML = '...';
            this.sorting = wuzhui.callbacks();
            this.sorted = wuzhui.callbacks();
            if (field.sortExpression) {
                let labelElement = document.createElement('a');
                labelElement.href = 'javascript:';
                labelElement.innerHTML = this.defaultHeaderText();
                $(labelElement).click(() => this.handleSort());
                this._iconElement = document.createElement('span');
                this.appendChild(labelElement);
                this.appendChild(this._iconElement);
                this.sorting.add(() => this._iconElement.innerHTML = this.sortingHTML);
                this.sorted.add(() => this.updateSortIcon());
            }
            else {
                this.element.innerHTML = this.defaultHeaderText();
            }
            this.style(field.headerStyle);
        }
        handleSort() {
            let selectArguments = this.field.gridView.dataSource.selectArguments;
            let sortType = this.sortType == 'asc' ? 'desc' : 'asc';
            wuzhui.fireCallback(this.sorting, this, { sortType });
            selectArguments.sortExpression = this.field.sortExpression + ' ' + sortType;
            return this.field.gridView.dataSource.select()
                .then(() => {
                this.sortType = sortType;
                wuzhui.fireCallback(this.sorted, this, { sortType });
            });
        }
        defaultHeaderText() {
            return this.field.headerText || this.field.dataField || '';
        }
        get sortType() {
            return this._sortType;
        }
        set sortType(value) {
            this._sortType = value;
        }
        clearSortIcon() {
            this._iconElement.innerHTML = '';
        }
        updateSortIcon() {
            if (this.sortType == 'asc') {
                this._iconElement.innerHTML = '↑';
            }
            else if (this.sortType == 'desc') {
                this._iconElement.innerHTML = '↓';
            }
            else {
                this._iconElement.innerHTML = '';
            }
        }
    }
    wuzhui.GridViewHeaderCell = GridViewHeaderCell;
    class DataControlField {
        constructor(params) {
            if (params.visible == null)
                params.visible = true;
            this._params = params;
        }
        /**
         * Gets the text that is displayed in the footer item of a data control field.
         */
        get footerText() {
            return this._params.footerText;
        }
        /**
         * Sets the text that is displayed in the footer item of a data control field.
         */
        set footerText(value) {
            this._params.footerText = value;
        }
        /**
         * Gets the text that is displayed in the header item of a data control field.
         */
        get headerText() {
            return this._params.headerText;
        }
        /**
        * Sets the text that is displayed in the header item of a data control field.
        */
        set headerText(value) {
            this._params.headerText = value;
        }
        get itemStyle() {
            return this._params.itemStyle;
        }
        set itemStyle(value) {
            this._params.itemStyle = value;
        }
        get footerStyle() {
            return this._params.footerStyle;
        }
        set footerStyle(value) {
            this._params.footerStyle = value;
        }
        get headerStyle() {
            return this._params.headerStyle;
        }
        set headerStyle(value) {
            this._params.headerStyle = value;
        }
        get visible() {
            return this._params.visible;
        }
        get gridView() {
            return this._gridView;
        }
        set gridView(value) {
            this._gridView = value;
        }
        /**
         * Gets a sort expression that is used by a data source control to sort data.
         */
        get sortExpression() {
            return this._params.sortExpression;
        }
        /**
         * Sets a sort expression that is used by a data source control to sort data.
         */
        set sortExpression(value) {
            this._params.sortExpression = value;
        }
        createHeaderCell() {
            let cell = new GridViewHeaderCell(this);
            return cell;
        }
        createFooterCell() {
            let cell = new GridViewCell(this);
            cell.html = this.footerText || '';
            cell.style(this.footerStyle);
            return cell;
        }
        createItemCell(dataItem) {
            if (!dataItem)
                throw wuzhui.Errors.argumentNull('dataItem');
            let cell = new GridViewCell(this);
            cell.style(this.itemStyle);
            return cell;
        }
    }
    wuzhui.DataControlField = DataControlField;
})(wuzhui || (wuzhui = {}));
/// <reference path="DataControlField.ts"/>
var wuzhui;
(function (wuzhui) {
    class GridViewEditableCell extends wuzhui.GridViewCell {
        constructor(field, dataItem) {
            if (field == null)
                throw wuzhui.Errors.argumentNull('field');
            if (dataItem == null)
                throw wuzhui.Errors.argumentNull('dataItem');
            super(field);
            this._dataItem = dataItem;
            this._valueElement = document.createElement('span');
            if (field.nullText) {
                this._valueElement.innerHTML = field.nullText;
            }
            this._editorElement = this.createControl();
            this.appendChild(this._valueElement);
            this.appendChild(this._editorElement);
            wuzhui.applyStyle(this._editorElement, this.field.controlStyle);
            this.value = dataItem[field.dataField];
            if (this.value instanceof Date)
                this._valueType = 'date';
            else
                this._valueType = typeof this.value;
            $(this._editorElement).hide();
        }
        beginEdit() {
            $(this._valueElement).hide();
            $(this._editorElement).show();
            let value = this._dataItem[this.field.dataField];
            this.setControlValue(value);
        }
        endEdit() {
            let value = this.getControlValue();
            this._dataItem[this.field.dataField] = value;
            this._valueElement.innerHTML = this.getCellHtml(value);
            $(this._editorElement).hide();
            $(this._valueElement).show();
        }
        cancelEdit() {
            $(this._editorElement).hide();
            $(this._valueElement).show();
        }
        set value(value) {
            if (this._value == value)
                return;
            this._value = value;
            this.setControlValue(value);
            this._valueElement.innerHTML = this.getCellHtml(value);
        }
        get value() {
            return this._value;
        }
        //==============================================
        // Virtual Methods
        createControl() {
            let ctrl = document.createElement('span');
            ctrl.appendChild(document.createElement('input'));
            return ctrl;
        }
        setControlValue(value) {
            $(this._editorElement).find('input').val(value);
        }
        getControlValue() {
            var text = $(this._editorElement).find('input').val();
            switch (this._valueType) {
                case 'number':
                    return new Number(text).valueOf();
                case 'date':
                    return new Date(text);
                default:
                    return text;
            }
        }
        //==============================================
        getCellHtml(value) {
            if (value == null)
                return this.field.nullText;
            if (this.field.dataFormatString)
                return this.formatValue(this.field.dataFormatString, value);
            return value;
        }
        formatValue(...args) {
            var result = '';
            var format = args[0];
            for (var i = 0;;) {
                var open = format.indexOf('{', i);
                var close = format.indexOf('}', i);
                if ((open < 0) && (close < 0)) {
                    result += format.slice(i);
                    break;
                }
                if ((close > 0) && ((close < open) || (open < 0))) {
                    if (format.charAt(close + 1) !== '}') {
                        throw new Error('Sys.Res.stringFormatBraceMismatch');
                    }
                    result += format.slice(i, close + 1);
                    i = close + 2;
                    continue;
                }
                result += format.slice(i, open);
                i = open + 1;
                if (format.charAt(i) === '{') {
                    result += '{';
                    i++;
                    continue;
                }
                if (close < 0)
                    throw new Error('Sys.Res.stringFormatBraceMismatch');
                var brace = format.substring(i, close);
                var colonIndex = brace.indexOf(':');
                var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
                if (isNaN(argNumber))
                    throw new Error('Sys.Res.stringFormatInvalid');
                var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
                var arg = args[argNumber];
                if (typeof (arg) === "undefined" || arg === null) {
                    arg = '';
                }
                if (arg instanceof Date)
                    result = result + this.formatDate(arg, argFormat);
                else if (arg instanceof Number || typeof arg == 'number')
                    result = result + this.formatNumber(arg, argFormat);
                else
                    result = result + arg.toString();
                i = close + 1;
            }
            return result;
        }
        formatDate(value, format) {
            switch (format) {
                case 'd':
                    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
                case 'g':
                    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}`;
                case 'G':
                    return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
                case 't':
                    return `${value.getHours()}:${value.getMinutes()}`;
                case 'T':
                    return `${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
            }
            return value.toString();
        }
        formatNumber(value, format) {
            let reg = new RegExp('^C[0-9]+');
            if (reg.test(format)) {
                let num = format.substr(1);
                return value.toFixed(num);
            }
            return value.toString();
        }
    }
    wuzhui.GridViewEditableCell = GridViewEditableCell;
    class BoundField extends wuzhui.DataControlField {
        constructor(params) {
            super(params);
            this._params = params;
            this._valueElement = document.createElement('span');
        }
        params() {
            return this._params;
        }
        /**
         * Gets the caption displayed for a field when the field's value is null.
         */
        get nullText() {
            return this.params().nullText;
        }
        createItemCell(dataItem) {
            let cell = new GridViewEditableCell(this, dataItem);
            cell.style(this.itemStyle);
            return cell;
        }
        /**
         * Gets the field for the value.
         */
        get dataField() {
            return this.params().dataField;
        }
        /**
         * Gets the string that specifies the display format for the value of the field.
         */
        get dataFormatString() {
            return this.params().dataFormatString;
        }
        get controlStyle() {
            return this.params().controlStyle;
        }
    }
    wuzhui.BoundField = BoundField;
})(wuzhui || (wuzhui = {}));
/// <reference path="DataControlField.ts"/>
var wuzhui;
(function (wuzhui) {
    class GridViewCommandCell extends wuzhui.GridViewCell {
        constructor(field) {
            super(field);
        }
    }
    class CommandField extends wuzhui.DataControlField {
        constructor(params) {
            super(params);
            this._updating = false;
            this._deleting = false;
            if (!this.params().cancelButtonHTML)
                this.params().cancelButtonHTML = '取消';
            if (!this.params().deleteButtonHTML)
                this.params().deleteButtonHTML = '删除';
            if (!this.params().editButtonHTML)
                this.params().editButtonHTML = '编辑';
            if (!this.params().updateButtonHTML)
                this.params().updateButtonHTML = '更新';
        }
        params() {
            return this._params;
        }
        get cancelButtonHTML() {
            return this.params().cancelButtonHTML;
        }
        set cancelButtonHTML(value) {
            this.params().cancelButtonHTML = value;
        }
        get deleteButtonHTML() {
            return this.params().deleteButtonHTML;
        }
        set deleteButtonHTML(value) {
            this.params().deleteButtonHTML = value;
        }
        get editButtonHTML() {
            return this.params().editButtonHTML;
        }
        set editButtonHTML(value) {
            this.params().editButtonHTML = value;
        }
        get updateButtonHTML() {
            return this.params().updateButtonHTML;
        }
        set updateButtonHTML(value) {
            this.params().updateButtonHTML = value;
        }
        get newButtonHTML() {
            return this.params().newButtonHTML;
        }
        set newButtonHTML(value) {
            this.params().newButtonHTML = value;
        }
        get insertButtonHTML() {
            return this.params().insertButtonHTML;
        }
        set insertButtonHTML(value) {
            this.params().insertButtonHTML = value;
        }
        get cancelButtonClass() {
            return this.params().cancelButtonClass;
        }
        set cancelButtonClass(value) {
            this.params().cancelButtonClass = value;
        }
        get deleteButtonClass() {
            return this.params().deleteButtonClass;
        }
        set deleteButtonClass(value) {
            this.params().deleteButtonClass = value;
        }
        get editButtonClass() {
            return this.params().editButtonClass;
        }
        set editButtonClass(value) {
            this.params().editButtonClass = value;
        }
        get newButtonClass() {
            return this.params().newButtonClass;
        }
        set newButtonClass(value) {
            this.params().newButtonClass = value;
        }
        get updateButtonClass() {
            return this.params().updateButtonClass;
        }
        set updateButtonClass(value) {
            this.params().updateButtonClass = value;
        }
        get insertButtonClass() {
            return this.params().insertButtonClass;
        }
        set insertButtonClass(value) {
            this.params().insertButtonClass = value;
        }
        createItemCell(dataItem) {
            let cell = new GridViewCommandCell(this);
            cell.style(this.itemStyle);
            if (this.params().showEditButton) {
                let editButton = this.createEditButton();
                editButton.style.marginRight = '4px';
                if (this.editButtonClass)
                    editButton.className = this.editButtonClass;
                cell.editButton = editButton;
                $(editButton).click(this.on_editButtonClick);
                cell.appendChild(editButton);
                let updateButton = this.createUpdateButton();
                updateButton.style.display = 'none';
                updateButton.style.marginRight = '4px';
                if (this.updateButtonClass)
                    updateButton.className = this.updateButtonClass;
                cell.updateButton = updateButton;
                $(updateButton).click(this.on_updateButtonClick);
                cell.appendChild(updateButton);
                let cancelButton = this.createCancelButton();
                cancelButton.style.display = 'none';
                cancelButton.style.marginRight = '4px';
                if (this.cancelButtonClass)
                    cancelButton.className = this.cancelButtonClass;
                cell.cacelButton = cancelButton;
                $(cancelButton).click(this.on_cancelButtonClick);
                cell.appendChild(cancelButton);
            }
            if (this.params().showDeleteButton) {
                let deleteButton = this.createDeleteButton();
                deleteButton.style.marginRight = '4px';
                if (this.deleteButtonClass)
                    deleteButton.className = this.deleteButtonClass;
                cell.deleteButton = deleteButton;
                $(deleteButton).click(this.on_deleteButtonClick);
                cell.appendChild(deleteButton);
            }
            if (this.params().showNewButton) {
                let newButton = this.createNewButton();
                newButton.style.marginRight = '4px';
                if (this.newButtonClass)
                    newButton.className = this.newButtonClass;
                cell.newButton = newButton;
                cell.appendChild(newButton);
            }
            return cell;
        }
        createEditButton() {
            let button = document.createElement('a');
            button.innerHTML = this.editButtonHTML;
            button.href = 'javascript:';
            return button;
        }
        createDeleteButton() {
            let button = document.createElement('a');
            button.innerHTML = this.deleteButtonHTML;
            button.href = 'javascript:';
            return button;
        }
        createInsertButton() {
            let button = document.createElement('a');
            button.innerHTML = this.insertButtonHTML;
            button.href = 'javascript:';
            return button;
        }
        createUpdateButton() {
            let button = document.createElement('a');
            button.innerHTML = this.updateButtonHTML;
            button.href = 'javascript:';
            return button;
        }
        createCancelButton() {
            let button = document.createElement('a');
            button.innerHTML = this.cancelButtonHTML;
            button.href = 'javascript:';
            return button;
        }
        createNewButton() {
            let button = document.createElement('a');
            button.innerHTML = this.newButtonHTML;
            button.href = 'javascript:';
            return button;
        }
        on_editButtonClick(e) {
            let cellElement = $(e.target).parents('td').first()[0];
            let rowElement = cellElement.parentElement; //<HTMLTableRowElement>$(e.target).parents('tr').first()[0];
            for (let i = 0; i < rowElement.cells.length; i++) {
                let cell = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell instanceof wuzhui.GridViewEditableCell) {
                    cell.beginEdit();
                }
            }
            let cell = wuzhui.Control.getControlByElement(cellElement);
            $([cell.cacelButton, cell.updateButton]).show();
            $(cell.editButton).hide();
        }
        on_cancelButtonClick(e) {
            let cellElement = $(e.target).parents('td').first()[0];
            let rowElement = cellElement.parentElement;
            for (let i = 0; i < rowElement.cells.length; i++) {
                let cell = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell instanceof wuzhui.GridViewEditableCell) {
                    cell.cancelEdit();
                }
            }
            let cell = wuzhui.Control.getControlByElement(cellElement);
            $([cell.cacelButton, cell.updateButton]).hide();
            $(cell.editButton).show();
        }
        on_updateButtonClick(e) {
            if (this._updating)
                return;
            this._updating = true;
            let cellElement = $(e.target).parents('td').first()[0];
            let rowElement = cellElement.parentElement;
            let row = wuzhui.Control.getControlByElement(rowElement);
            //==========================================================
            // 复制 dataItem 副本
            let dataItem = $.extend({}, row.dataItem || {});
            //==========================================================
            let dataSource = row.gridView.dataSource;
            let editableCells = new Array();
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell instanceof wuzhui.GridViewEditableCell) {
                    dataItem[cell.field.dataField] = cell.getControlValue();
                    editableCells.push(cell);
                }
            }
            dataSource.update(dataItem)
                .then(() => {
                editableCells.forEach((item) => item.endEdit());
                let cell = wuzhui.Control.getControlByElement(cellElement);
                $([cell.cacelButton, cell.updateButton]).hide();
                $(cell.editButton).show();
                this._updating = false;
            })
                .catch(() => this._updating = false);
        }
        on_deleteButtonClick(e) {
            if (this._deleting)
                return;
            this._deleting = true;
            let rowElement = $(e.target).parents('tr').first()[0];
            let row = wuzhui.Control.getControlByElement(rowElement);
            let dataSource = row.gridView.dataSource;
            dataSource.delete(row.dataItem)
                .then(() => {
                $(rowElement).remove();
                this._deleting = false;
            })
                .catch(() => this._deleting = false);
        }
    }
    wuzhui.CommandField = CommandField;
})(wuzhui || (wuzhui = {}));
/// <reference path="DataControlField.ts"/>
var wuzhui;
(function (wuzhui) {
    class CustomField extends wuzhui.DataControlField {
        constructor(params) {
            super(params);
        }
        params() {
            return this._params;
        }
        createHeaderCell() {
            if (this.params().createHeaderCell) {
                let cell = this.params().createHeaderCell();
                cell.style(this.headerStyle);
                return cell;
            }
            return super.createHeaderCell();
        }
        createFooterCell() {
            if (this.params().createFooterCell) {
                let cell = this.params().createFooterCell();
                cell.style(this.params().footerStyle);
                return cell;
            }
            return super.createFooterCell();
        }
        createItemCell(dataItem) {
            if (this.params().createItemCell) {
                let cell = this.params().createItemCell(dataItem);
                cell.style(this.params().itemStyle);
                return cell;
            }
            return super.createItemCell(dataItem);
        }
    }
    wuzhui.CustomField = CustomField;
})(wuzhui || (wuzhui = {}));
