var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var wuzhui;
(function (wuzhui) {
    var CONTROL_DATA_NAME = 'Control';
    var Control = (function () {
        function Control(element) {
            if (!element)
                throw wuzhui.Errors.argumentNull('element');
            this._element = element;
            $(element).data(CONTROL_DATA_NAME, this);
        }
        Object.defineProperty(Control.prototype, "visible", {
            // get html(): string {
            //     return $(this.element).html();
            // }
            // set html(value) {
            //     $(this.element).html(value);
            // }
            get: function () {
                return $(this.element).is(':visible');
            },
            set: function (value) {
                if (value)
                    $(this._element).show();
                else
                    $(this._element).hide();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Control.prototype.appendChild = function (child, index) {
            if (child == null)
                throw wuzhui.Errors.argumentNull('child');
            var childElement;
            if (child instanceof Control)
                childElement = child.element;
            else
                childElement = child;
            var placeChild;
            if (index != null) {
                placeChild = this.element.children[index];
            }
            if (placeChild == null) {
                this.element.appendChild(childElement);
            }
            else {
                this.element.insertBefore(childElement, placeChild);
            }
        };
        Control.prototype.style = function (value) {
            wuzhui.applyStyle(this.element, value);
        };
        Control.getControlByElement = function (element) {
            return $(element).data(CONTROL_DATA_NAME);
        };
        return Control;
    }());
    wuzhui.Control = Control;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var DataSource = (function () {
        function DataSource(args) {
            this.inserting = wuzhui.callbacks();
            this.inserted = wuzhui.callbacks();
            this.deleting = wuzhui.callbacks();
            this.deleted = wuzhui.callbacks();
            this.updating = wuzhui.callbacks();
            this.updated = wuzhui.callbacks();
            this.selecting = wuzhui.callbacks();
            this.selected = wuzhui.callbacks();
            this.error = wuzhui.callbacks();
            this.args = args;
            this.primaryKeys = args.primaryKeys || [];
            this._currentSelectArguments = new DataSourceSelectArguments();
        }
        Object.defineProperty(DataSource.prototype, "canDelete", {
            get: function () {
                return this.args.delete != null && this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSource.prototype, "canInsert", {
            get: function () {
                return this.args.insert != null && this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataSource.prototype, "canUpdate", {
            get: function () {
                return this.args.update != null && this.primaryKeys.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        DataSource.prototype.executeInsert = function (item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return this.args.insert(item);
        };
        DataSource.prototype.executeDelete = function (item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return this.args.delete(item);
        };
        DataSource.prototype.executeUpdate = function (item) {
            if (!item)
                throw wuzhui.Errors.argumentNull("item");
            return this.args.update(item);
        };
        DataSource.prototype.executeSelect = function (args) {
            if (!args)
                throw wuzhui.Errors.argumentNull("args");
            return this.args.select(args);
        };
        Object.defineProperty(DataSource.prototype, "selectArguments", {
            get: function () {
                return this._currentSelectArguments;
            },
            enumerable: true,
            configurable: true
        });
        DataSource.prototype.insert = function (item) {
            var _this = this;
            if (!this.canInsert)
                throw wuzhui.Errors.dataSourceCanntInsert();
            this.checkPrimaryKeys(item);
            wuzhui.fireCallback(this.inserting, this, { item: item });
            return this.executeInsert(item).then(function (data) {
                Object.assign(item, data);
                wuzhui.fireCallback(_this.inserted, _this, { item: item });
                return data;
            }).catch(function (exc) {
                _this.processError(exc, 'insert');
            });
        };
        DataSource.prototype.delete = function (item) {
            var _this = this;
            if (!this.canDelete)
                throw wuzhui.Errors.dataSourceCanntDelete();
            this.checkPrimaryKeys(item);
            wuzhui.fireCallback(this.deleting, this, { item: item });
            return this.executeDelete(item).then(function (data) {
                wuzhui.fireCallback(_this.deleted, _this, { item: item });
                return data;
            }).catch(function (exc) {
                _this.processError(exc, 'delete');
            });
        };
        DataSource.prototype.update = function (item) {
            var _this = this;
            if (!this.canUpdate)
                throw wuzhui.Errors.dataSourceCanntUpdate();
            this.checkPrimaryKeys(item);
            wuzhui.fireCallback(this.updating, this, { item: item });
            return this.executeUpdate(item).then(function (data) {
                Object.assign(item, data);
                wuzhui.fireCallback(_this.updated, _this, { item: item });
                return data;
            }).catch(function (exc) {
                _this.processError(exc, 'update');
            });
        };
        DataSource.prototype.isSameItem = function (theItem, otherItem) {
            if (theItem == null)
                throw wuzhui.Errors.argumentNull('theItem');
            if (otherItem == null)
                throw wuzhui.Errors.argumentNull('otherItem');
            if (theItem != otherItem && this.primaryKeys.length == 0)
                return false;
            if (this.primaryKeys.length > 0) {
                for (var _i = 0, _a = this.primaryKeys; _i < _a.length; _i++) {
                    var pk = _a[_i];
                    if (theItem[pk] != otherItem[pk])
                        return false;
                }
            }
            return true;
        };
        DataSource.prototype.checkPrimaryKeys = function (item) {
            for (var key in item) {
                if (item[key] == null && this.primaryKeys.indexOf(key) >= 0)
                    throw wuzhui.Errors.primaryKeyNull(key);
            }
        };
        DataSource.prototype.select = function () {
            var _this = this;
            var args = this.selectArguments;
            wuzhui.fireCallback(this.selecting, this, { selectArguments: args });
            return this.executeSelect(args).then(function (data) {
                var data_items;
                var result = data;
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
                wuzhui.fireCallback(_this.selected, _this, { selectArguments: args, items: data_items });
                return data;
            }).catch(function (exc) {
                _this.processError(exc, 'select');
            });
        };
        DataSource.prototype.processError = function (exc, method) {
            exc.method = method;
            this.error.fire(this, exc);
            if (!exc.handled)
                throw exc;
        };
        return DataSource;
    }());
    wuzhui.DataSource = DataSource;
    var DataSourceSelectArguments = (function () {
        function DataSourceSelectArguments() {
            this.startRowIndex = 0;
            this.maximumRows = 2147483647;
        }
        return DataSourceSelectArguments;
    }());
    wuzhui.DataSourceSelectArguments = DataSourceSelectArguments;
    var WebDataSource = (function (_super) {
        __extends(WebDataSource, _super);
        function WebDataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WebDataSource;
    }(DataSource));
    wuzhui.WebDataSource = WebDataSource;
    var ArrayDataSource = (function (_super) {
        __extends(ArrayDataSource, _super);
        function ArrayDataSource() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ArrayDataSource;
    }(DataSource));
    wuzhui.ArrayDataSource = ArrayDataSource;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    var Errors = (function () {
        function Errors(parameters) {
        }
        Errors.notImplemented = function (message) {
            message = message || "Not implemented";
            return new Error(message);
        };
        Errors.argumentNull = function (paramName) {
            return new Error("Argument '" + paramName + "' can not be null.");
        };
        Errors.controllBelonsAnother = function () {
            return new Error("The control is belongs another control.");
        };
        Errors.columnsCanntEmpty = function () {
            return new Error("Columns cannt empty.");
        };
        Errors.dataSourceCanntInsert = function () {
            return new Error("DataSource can not insert.");
        };
        Errors.dataSourceCanntUpdate = function () {
            return new Error("DataSource can not update.");
        };
        Errors.dataSourceCanntDelete = function () {
            return new Error("DataSource can not delete.");
        };
        Errors.primaryKeyNull = function (key) {
            var msg = "Primary key named '" + key + "' value is null.";
            return new Error(msg);
        };
        return Errors;
    }());
    wuzhui.Errors = Errors;
})(wuzhui || (wuzhui = {}));
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
    function findParentElement(element, parentTagName) {
        console.assert(element != null);
        console.assert(parentTagName != null);
        parentTagName = parentTagName.toUpperCase();
        var p = element.parentElement;
        while (p) {
            if (p.tagName == parentTagName)
                return p;
            p = p.parentElement;
        }
    }
    var GridViewRow = (function (_super) {
        __extends(GridViewRow, _super);
        function GridViewRow(rowType) {
            var _this = this;
            var element = document.createElement('tr');
            _this = _super.call(this, element) || this;
            _this._rowType = rowType;
            return _this;
        }
        Object.defineProperty(GridViewRow.prototype, "rowType", {
            get: function () {
                return this._rowType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridViewRow.prototype, "gridView", {
            get: function () {
                if (this._gridView == null) {
                    var gridViewElement = findParentElement(this.element, 'table');
                    console.assert(gridViewElement != null);
                    this._gridView = wuzhui.Control.getControlByElement(gridViewElement);
                    console.assert(this._gridView != null);
                }
                return this._gridView;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridViewRow.prototype, "cells", {
            get: function () {
                var cells = new Array();
                for (var i = 0; i < this.element.cells.length; i++) {
                    var cell = wuzhui.Control.getControlByElement(this.element.cells[i]);
                    console.assert(cell != null);
                    cells[i] = cell;
                }
                return cells;
            },
            enumerable: true,
            configurable: true
        });
        return GridViewRow;
    }(wuzhui.Control));
    wuzhui.GridViewRow = GridViewRow;
    var GridViewDataRow = (function (_super) {
        __extends(GridViewDataRow, _super);
        function GridViewDataRow(gridView, dataItem) {
            var _this = _super.call(this, GridViewRowType.Data) || this;
            _this._dataItem = dataItem;
            for (var i = 0; i < gridView.columns.length; i++) {
                var column = gridView.columns[i];
                var cell = column.createItemCell(dataItem);
                cell.visible = column.visible;
                _this.appendChild(cell);
            }
            return _this;
        }
        Object.defineProperty(GridViewDataRow.prototype, "dataItem", {
            get: function () {
                return this._dataItem;
            },
            enumerable: true,
            configurable: true
        });
        return GridViewDataRow;
    }(GridViewRow));
    wuzhui.GridViewDataRow = GridViewDataRow;
    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView(params) {
            var _this = _super.call(this, params.element || document.createElement('table')) || this;
            _this.emptyDataHTML = '暂无记录';
            _this.initDataHTML = '数据正在加载中...';
            _this.loadFailHTML = '加载数据失败，点击重新加载。';
            //========================================================
            // 样式
            // headerStyle: string;
            // footerStyle: string;
            // rowStyle: string;
            // alternatingRowStyle: string;
            //private emptyDataRowStyle: string;
            //========================================================
            _this.rowCreated = wuzhui.callbacks();
            params = Object.assign({
                showHeader: true, showFooter: false,
                allowPaging: false
            }, params);
            _this._params = params;
            _this._columns = params.columns || [];
            if (_this._columns.length == 0)
                throw wuzhui.Errors.columnsCanntEmpty();
            for (var i = 0; i < _this._columns.length; i++) {
                var column = _this._columns[i];
                column.gridView = _this;
            }
            _this._dataSource = params.dataSource;
            _this._dataSource.selected.add(function (sender, e) { return _this.on_selectExecuted(e.items); });
            _this._dataSource.updated.add(function (sender, e) { return _this.on_updateExecuted(e.item); });
            _this._dataSource.inserted.add(function (sender, e) { return _this.on_insertExecuted(e.item, e.index); });
            _this._dataSource.deleted.add(function (sender, e) { return _this.on_deleteExecuted(e.item); });
            _this._dataSource.selecting.add(function (sender, e) {
                var display = _this._emtpyRow.element.style.display;
                if (display != 'none') {
                    _this._emtpyRow.element.cells[0].innerHTML = _this.initDataHTML;
                }
            });
            _this._dataSource.error.add(function (sender, e) {
                if (e.method == 'select') {
                    _this.on_selectExecuted([]);
                    var element = _this._emtpyRow.cells[0].element;
                    element.innerHTML = _this.loadFailHTML;
                    element.onclick = function () {
                        _this._dataSource.select();
                    };
                    e.handled = true;
                }
            });
            if (params.showHeader) {
                _this._header = new wuzhui.Control(document.createElement('thead'));
                _this.appendChild(_this._header);
                _this.appendHeaderRow();
            }
            _this.emptyDataHTML = params.emptyDataHTML || _this.emptyDataHTML;
            _this.initDataHTML = params.initDataHTML || _this.initDataHTML;
            _this._body = new wuzhui.Control(document.createElement('tbody'));
            _this.appendChild(_this._body);
            _this.appendEmptyRow();
            var allowPaging = params.pageSize;
            if (params.showFooter || allowPaging) {
                _this._footer = new wuzhui.Control(document.createElement('tfoot'));
                _this.appendChild(_this._footer);
                if (params.showFooter)
                    _this.appendFooterRow();
                if (allowPaging) {
                    _this.createPagingBar(params.pagerSettings);
                    _this.dataSource.selectArguments.maximumRows = params.pageSize;
                }
            }
            _this.dataSource.select();
            return _this;
        }
        GridView.prototype.createPagingBar = function (pagerSettings) {
            var pagingBarContainer = document.createElement('tr');
            var pagingBarElement = document.createElement('td');
            pagingBarElement.className = GridView.pagingBarClassName;
            pagingBarElement.colSpan = this.columns.length;
            pagingBarContainer.appendChild(pagingBarElement);
            console.assert(this._footer != null);
            this._footer.appendChild(pagingBarContainer);
            new wuzhui.NumberPagingBar({ dataSource: this.dataSource, element: pagingBarElement, pagerSettings: pagerSettings });
        };
        Object.defineProperty(GridView.prototype, "columns", {
            get: function () {
                return this._columns;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridView.prototype, "dataSource", {
            get: function () {
                return this._dataSource;
            },
            enumerable: true,
            configurable: true
        });
        GridView.prototype.appendEmptyRow = function () {
            this._emtpyRow = new GridViewRow(GridViewRowType.Empty);
            this._emtpyRow.element.className = GridView.emptyRowClassName;
            var cell = new wuzhui.GridViewCell();
            cell.element.colSpan = this.columns.length;
            // cell.element.innerHTML = this.initDataHTML;
            if (!this._params.emptyDataRowStyle) {
                wuzhui.applyStyle(cell.element, this._params.emptyDataRowStyle);
            }
            this._emtpyRow.appendChild(cell);
            this._body.appendChild(this._emtpyRow);
            wuzhui.fireCallback(this.rowCreated, this, { row: this._emtpyRow });
        };
        GridView.prototype.appendDataRow = function (dataItem, index) {
            var row = new GridViewDataRow(this, dataItem);
            row.element.className = GridView.dataRowClassName;
            this._body.appendChild(row, index);
            wuzhui.fireCallback(this.rowCreated, this, { row: row });
            if (this._emtpyRow.element.style.display != 'none')
                this.hideEmptyRow();
        };
        GridView.prototype.on_sort = function (sender, args) {
            if (this._currentSortCell != null && this._currentSortCell != sender) {
                this._currentSortCell.clearSortIcon();
            }
            this._currentSortCell = sender;
        };
        GridView.prototype.appendHeaderRow = function () {
            var _this = this;
            var row = new GridViewRow(GridViewRowType.Header);
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                var cell = column.createHeaderCell();
                if (cell instanceof wuzhui.GridViewHeaderCell) {
                    cell.sorting.add(function (e, a) { return _this.on_sort(e, a); });
                }
                row.appendChild(cell);
                cell.visible = this.columns[i].visible;
            }
            this._header.appendChild(row);
        };
        GridView.prototype.appendFooterRow = function () {
            var row = new GridViewRow(GridViewRowType.Footer);
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                var cell = column.createFooterCell();
                row.appendChild(cell);
                cell.visible = column.visible;
            }
            this._footer.appendChild(row);
        };
        GridView.prototype.on_selectExecuted = function (items) {
            var rows = this._body.element.querySelectorAll("." + GridView.dataRowClassName);
            for (var i = 0; i < rows.length; i++)
                this._body.element.removeChild(rows[i]);
            if (items.length == 0) {
                this.showEmptyRow();
                return;
            }
            for (var i = 0; i < items.length; i++) {
                this.appendDataRow(items[i]);
            }
        };
        GridView.prototype.on_updateExecuted = function (item) {
            console.assert(item != null);
            for (var i = 0; i < this._body.element.rows.length; i++) {
                var row_element = this._body.element.rows[i];
                var row = wuzhui.Control.getControlByElement(row_element);
                ;
                if (!(row instanceof GridViewDataRow))
                    continue;
                var dataItem = row.dataItem;
                if (!this.dataSource.isSameItem(item, dataItem))
                    continue;
                var cells = row.cells;
                for (var j = 0; j < cells.length; j++) {
                    var cell = cells[j];
                    if (cell instanceof wuzhui.GridViewDataCell) {
                        var value = item[cell.dataField];
                        if (value !== undefined) {
                            cell.value = value;
                            dataItem[cell.dataField] = value;
                        }
                    }
                }
                break;
            }
        };
        GridView.prototype.on_insertExecuted = function (item, index) {
            if (index == null)
                index = 0;
            this.appendDataRow(item, index);
        };
        GridView.prototype.on_deleteExecuted = function (item) {
            var dataRowsCount = 0;
            var rows = this._body.element.rows;
            var dataRows = new Array();
            for (var i = 0; i < rows.length; i++) {
                var row = wuzhui.Control.getControlByElement(rows.item(i));
                if ((row instanceof GridViewDataRow))
                    dataRows.push(row);
            }
            for (var i = 0; i < dataRows.length; i++) {
                var dataRow = dataRows[i];
                if (!this.dataSource.isSameItem(item, dataRow.dataItem))
                    continue;
                dataRow.element.remove();
                if (dataRows.length == 1)
                    this.showEmptyRow();
            }
        };
        GridView.prototype.showEmptyRow = function () {
            this._emtpyRow.element.cells[0].innerHTML = this.emptyDataHTML;
            this._emtpyRow.element.style.removeProperty('display');
        };
        GridView.prototype.hideEmptyRow = function () {
            this._emtpyRow.element.style.display = 'none';
        };
        GridView.emptyRowClassName = 'empty';
        GridView.dataRowClassName = 'data';
        GridView.pagingBarClassName = 'pagingBar';
        return GridView;
    }(wuzhui.Control));
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
    var PagingBar = (function () {
        function PagingBar() {
        }
        PagingBar.prototype.init = function (dataSource) {
            if (dataSource == null)
                throw wuzhui.Errors.argumentNull('dataSource');
            this._pageIndex = 0;
            this._dataSource = dataSource;
            var pagingBar = this;
            pagingBar.totalRowCount = 1000000;
            dataSource.selected.add(function (source, args) {
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
        };
        Object.defineProperty(PagingBar.prototype, "pageCount", {
            get: function () {
                var pageCount = Math.ceil(this.totalRowCount / this.pageSize);
                return pageCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagingBar.prototype, "pageSize", {
            get: function () {
                return this._pageSize;
            },
            set: function (value) {
                this._pageSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagingBar.prototype, "pageIndex", {
            get: function () {
                return this._pageIndex;
            },
            set: function (value) {
                this._pageIndex = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagingBar.prototype, "totalRowCount", {
            get: function () {
                return this._totalRowCount;
            },
            set: function (value) {
                this._totalRowCount = value;
            },
            enumerable: true,
            configurable: true
        });
        // Virtual Method
        PagingBar.prototype.render = function () {
            throw wuzhui.Errors.notImplemented('The table-row render method is not implemented.');
        };
        return PagingBar;
    }());
    wuzhui.PagingBar = PagingBar;
    var NumberPagingBar = (function (_super) {
        __extends(NumberPagingBar, _super);
        function NumberPagingBar(params) {
            var _this = this;
            if (!params.dataSource)
                throw wuzhui.Errors.argumentNull('dataSource');
            if (!params.element)
                throw wuzhui.Errors.argumentNull('element');
            var pagerSettings = $.extend({
                pageButtonCount: 10,
                firstPageText: '<<',
                lastPageText: '>>',
                nextPageText: '...',
                previousPageText: '...',
            }, params.pagerSettings || {});
            _this = _super.call(this) || this;
            _this.dataSource = params.dataSource;
            _this.pagerSettings = pagerSettings;
            _this.element = params.element;
            _this.numberButtons = new Array();
            _this.createButton = params.createButton || _this.createPagingButton;
            _this.createLabel = params.createTotal || _this.createTotalLabel;
            _this.createPreviousButtons();
            _this.createNumberButtons();
            _this.createNextButtons();
            _this.totalElement = _this.createLabel();
            _this.totalElement.visible = false;
            _this.init(params.dataSource);
            return _this;
        }
        NumberPagingBar.prototype.createPagingButton = function () {
            var _this = this;
            var pagerSettings = this.pagerSettings;
            var button = document.createElement('a');
            button.href = 'javascript:';
            this.element.appendChild(button);
            var result = {
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
                        button.removeAttribute('href');
                        if (pagerSettings.activeButtonClassName)
                            button.className = pagerSettings.activeButtonClassName;
                        return;
                    }
                    button.href = 'javascript:';
                    if (pagerSettings.buttonClassName)
                        button.className = pagerSettings.buttonClassName;
                    else
                        button.removeAttribute('class');
                }
            };
            button.onclick = function () {
                if (result.onclick) {
                    result.onclick(result, _this);
                }
            };
            return result;
        };
        NumberPagingBar.prototype.createTotalLabel = function () {
            var totalElement = document.createElement('span');
            totalElement.className = 'total';
            var textElement = document.createElement('span');
            textElement.className = 'text';
            textElement.innerHTML = '总记录：';
            totalElement.appendChild(textElement);
            var numberElement = document.createElement('span');
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
                        totalElement.style.display = 'block'; //$(totalElement).show();
                    else
                        totalElement.style.display = 'node'; //$(totalElement).hide();
                }
            };
        };
        NumberPagingBar.prototype.createPreviousButtons = function () {
            this.firstPageButton = this.createButton();
            this.firstPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.firstPageButton.text = this.pagerSettings.firstPageText;
            this.firstPageButton.visible = false;
            this.previousPageButton = this.createButton();
            this.previousPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.previousPageButton.text = this.pagerSettings.previousPageText;
            this.previousPageButton.visible = false;
        };
        NumberPagingBar.prototype.createNextButtons = function () {
            this.nextPageButton = this.createButton();
            this.nextPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.nextPageButton.text = this.pagerSettings.nextPageText;
            this.nextPageButton.visible = false;
            this.lastPageButton = this.createButton();
            this.lastPageButton.onclick = NumberPagingBar.on_buttonClick;
            this.lastPageButton.text = this.pagerSettings.lastPageText;
            this.lastPageButton.visible = false;
        };
        NumberPagingBar.prototype.createNumberButtons = function () {
            var pagingBar = this;
            var buttonCount = this.pagerSettings.pageButtonCount;
            for (var i = 0; i < buttonCount; i++) {
                var button = this.createButton(); //NumberPagingBar.on_buttonClick)
                button.onclick = NumberPagingBar.on_buttonClick;
                this.numberButtons[i] = button;
            }
            $(this.numberButtons).click(function () {
                NumberPagingBar.on_buttonClick(this, pagingBar);
            });
        };
        NumberPagingBar.on_buttonClick = function (button, pagingBar) {
            var pageIndex = button.pageIndex;
            if (!pageIndex == null) {
                return;
            }
            var args = pagingBar.dataSource.selectArguments;
            args.maximumRows = pagingBar.pageSize;
            args.startRowIndex = pageIndex * pagingBar.pageSize;
            pagingBar.pageIndex = pageIndex;
            pagingBar.dataSource.select();
        };
        NumberPagingBar.prototype.render = function () {
            var pagerSettings = this.pagerSettings;
            var buttonCount = pagerSettings.pageButtonCount;
            var pagingBarIndex = Math.floor(this.pageIndex / buttonCount);
            var pagingBarCount = Math.floor(this.pageCount / buttonCount) + 1;
            this.previousPageButton.pageIndex = (pagingBarIndex - 1) * buttonCount;
            this.nextPageButton.pageIndex = (pagingBarIndex + 1) * buttonCount;
            this.firstPageButton.pageIndex = 0;
            this.lastPageButton.pageIndex = this.pageCount - 1;
            for (var i = 0; i < this.numberButtons.length; i++) {
                var pageIndex = pagingBarIndex * buttonCount + i;
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
        };
        return NumberPagingBar;
    }(PagingBar));
    wuzhui.NumberPagingBar = NumberPagingBar;
})(wuzhui || (wuzhui = {}));
var wuzhui;
(function (wuzhui) {
    function applyStyle(element, value) {
        var style = value || '';
        if (typeof style == 'string')
            $(element).attr('style', style);
        else {
            for (var key in style) {
                element.style[key] = style[key];
            }
        }
    }
    wuzhui.applyStyle = applyStyle;
    var Callback = (function () {
        function Callback() {
            this.funcs = new Array();
        }
        Callback.prototype.add = function (func) {
            this.funcs.push(func);
        };
        Callback.prototype.remove = function (func) {
            this.funcs = this.funcs.filter(function (o) { return o != func; });
        };
        Callback.prototype.fire = function (sender, args) {
            this.funcs.forEach(function (o) { return o(sender, args); });
        };
        return Callback;
    }());
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
    var GridViewCell = (function (_super) {
        __extends(GridViewCell, _super);
        function GridViewCell() {
            return _super.call(this, document.createElement('td')) || this;
        }
        return GridViewCell;
    }(wuzhui.Control));
    wuzhui.GridViewCell = GridViewCell;
    var GridViewDataCell = (function (_super) {
        __extends(GridViewDataCell, _super);
        function GridViewDataCell(params) {
            var _this = _super.call(this) || this;
            _this._valueElement = document.createElement('span');
            _this.element.appendChild(_this._valueElement);
            _this.nullText = params.nullText != null ? params.nullText : '';
            _this.dataFormatString = params.dataFormatString;
            _this._dataField = params.dataField;
            _this.render = params.render || (function (element, value) {
                if (!element)
                    throw wuzhui.Errors.argumentNull('element');
                var text;
                if (value == null)
                    text = _this.nullText;
                else if (_this.dataFormatString)
                    text = _this.formatValue(_this.dataFormatString, value);
                else
                    text = value;
                element.innerHTML = text;
            });
            _this.value = params.dataItem[params.dataField];
            _this.render(_this.valueElement, _this.value);
            return _this;
        }
        Object.defineProperty(GridViewDataCell.prototype, "valueElement", {
            get: function () {
                return this._valueElement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridViewDataCell.prototype, "dataField", {
            get: function () {
                return this._dataField;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridViewDataCell.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (this._value == value)
                    return;
                this._value = value;
                // this._valueElement.innerHTML = this.getCellHtml(value);
                this.render(this._valueElement, value);
            },
            enumerable: true,
            configurable: true
        });
        // getCellHtml(value: any): string {
        //     // if (this.html)
        //     //     return this.html(value);
        //     if (value == null)
        //         return this.nullText;
        //     if (this.dataFormatString)
        //         return this.formatValue(this.dataFormatString, value);
        //     return value;
        // }
        GridViewDataCell.prototype.formatValue = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
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
        };
        GridViewDataCell.prototype.formatDate = function (value, format) {
            switch (format) {
                case 'd':
                    return value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate();
                case 'g':
                    return value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate() + " " + value.getHours() + ":" + value.getMinutes();
                case 'G':
                    return value.getFullYear() + "-" + (value.getMonth() + 1) + "-" + value.getDate() + " " + value.getHours() + ":" + value.getMinutes() + ":" + value.getSeconds();
                case 't':
                    return value.getHours() + ":" + value.getMinutes();
                case 'T':
                    return value.getHours() + ":" + value.getMinutes() + ":" + value.getSeconds();
            }
            return value.toString();
        };
        GridViewDataCell.prototype.formatNumber = function (value, format) {
            var reg = new RegExp('^C[0-9]+');
            if (reg.test(format)) {
                var num = format.substr(1);
                return value.toFixed(num);
            }
            return value.toString();
        };
        return GridViewDataCell;
    }(GridViewCell));
    wuzhui.GridViewDataCell = GridViewDataCell;
    var GridViewHeaderCell = (function (_super) {
        __extends(GridViewHeaderCell, _super);
        function GridViewHeaderCell(field) {
            var _this = _super.call(this, document.createElement('th')) || this;
            _this.ascHTML = '↑';
            _this.descHTML = '↓';
            _this.sortingHTML = '...';
            _this.field = field;
            _this.sorting = wuzhui.callbacks();
            _this.sorted = wuzhui.callbacks();
            if (field.sortExpression) {
                var labelElement = document.createElement('a');
                labelElement.href = 'javascript:';
                labelElement.innerHTML = _this.defaultHeaderText();
                //$(labelElement).click(() => this.handleSort());
                labelElement.click = function () { return _this.handleSort(); };
                _this._iconElement = document.createElement('span');
                _this.appendChild(labelElement);
                _this.appendChild(_this._iconElement);
                _this.sorting.add(function () { return _this._iconElement.innerHTML = _this.sortingHTML; });
                _this.sorted.add(function () { return _this.updateSortIcon(); });
            }
            else {
                _this.element.innerHTML = _this.defaultHeaderText();
            }
            _this.style(field.headerStyle);
            return _this;
        }
        GridViewHeaderCell.prototype.handleSort = function () {
            var _this = this;
            var selectArguments = this.field.gridView.dataSource.selectArguments;
            var sortType = this.sortType == 'asc' ? 'desc' : 'asc';
            wuzhui.fireCallback(this.sorting, this, { sortType: sortType });
            selectArguments.sortExpression = this.field.sortExpression + ' ' + sortType;
            return this.field.gridView.dataSource.select()
                .then(function () {
                _this.sortType = sortType;
                wuzhui.fireCallback(_this.sorted, _this, { sortType: sortType });
            });
        };
        GridViewHeaderCell.prototype.defaultHeaderText = function () {
            return this.field.headerText || this.field.dataField || '';
        };
        Object.defineProperty(GridViewHeaderCell.prototype, "sortType", {
            get: function () {
                return this._sortType;
            },
            set: function (value) {
                this._sortType = value;
            },
            enumerable: true,
            configurable: true
        });
        GridViewHeaderCell.prototype.clearSortIcon = function () {
            this._iconElement.innerHTML = '';
        };
        GridViewHeaderCell.prototype.updateSortIcon = function () {
            if (this.sortType == 'asc') {
                this._iconElement.innerHTML = '↑';
            }
            else if (this.sortType == 'desc') {
                this._iconElement.innerHTML = '↓';
            }
            else {
                this._iconElement.innerHTML = '';
            }
        };
        return GridViewHeaderCell;
    }(wuzhui.Control));
    wuzhui.GridViewHeaderCell = GridViewHeaderCell;
    var DataControlField = (function () {
        function DataControlField(params) {
            if (params.visible == null)
                params.visible = true;
            this._params = params;
        }
        Object.defineProperty(DataControlField.prototype, "footerText", {
            /**
             * Gets the text that is displayed in the footer item of a data control field.
             */
            get: function () {
                return this._params.footerText;
            },
            /**
             * Sets the text that is displayed in the footer item of a data control field.
             */
            set: function (value) {
                this._params.footerText = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "headerText", {
            /**
             * Gets the text that is displayed in the header item of a data control field.
             */
            get: function () {
                return this._params.headerText;
            },
            /**
            * Sets the text that is displayed in the header item of a data control field.
            */
            set: function (value) {
                this._params.headerText = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "itemStyle", {
            get: function () {
                return this._params.itemStyle;
            },
            set: function (value) {
                this._params.itemStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "footerStyle", {
            get: function () {
                return this._params.footerStyle;
            },
            set: function (value) {
                this._params.footerStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "headerStyle", {
            get: function () {
                return this._params.headerStyle;
            },
            set: function (value) {
                this._params.headerStyle = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "visible", {
            get: function () {
                return this._params.visible;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "gridView", {
            get: function () {
                return this._gridView;
            },
            set: function (value) {
                this._gridView = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataControlField.prototype, "sortExpression", {
            /**
             * Gets a sort expression that is used by a data source control to sort data.
             */
            get: function () {
                return this._params.sortExpression;
            },
            /**
             * Sets a sort expression that is used by a data source control to sort data.
             */
            set: function (value) {
                this._params.sortExpression = value;
            },
            enumerable: true,
            configurable: true
        });
        DataControlField.prototype.createHeaderCell = function () {
            var cell = new GridViewHeaderCell(this);
            return cell;
        };
        DataControlField.prototype.createFooterCell = function () {
            var cell = new GridViewCell();
            cell.element.innerHTML = this.footerText || '';
            cell.style(this.footerStyle);
            return cell;
        };
        DataControlField.prototype.createItemCell = function (dataItem) {
            if (!dataItem)
                throw wuzhui.Errors.argumentNull('dataItem');
            var cell = new GridViewCell();
            cell.style(this.itemStyle);
            return cell;
        };
        return DataControlField;
    }());
    wuzhui.DataControlField = DataControlField;
})(wuzhui || (wuzhui = {}));
/// <reference path="DataControlField.ts"/>
var wuzhui;
(function (wuzhui) {
    var GridViewEditableCell = (function (_super) {
        __extends(GridViewEditableCell, _super);
        function GridViewEditableCell(field, dataItem) {
            var _this = this;
            if (field == null)
                throw wuzhui.Errors.argumentNull('field');
            if (dataItem == null)
                throw wuzhui.Errors.argumentNull('dataItem');
            _this = _super.call(this, {
                dataItem: dataItem, dataField: field.dataField,
                nullText: field.nullText, dataFormatString: field.dataFormatString
            }) || this;
            _this._field = field;
            _this._dataItem = dataItem;
            _this._editorElement = _this.createControl();
            _this.appendChild(_this._editorElement);
            wuzhui.applyStyle(_this._editorElement, _this.field.controlStyle);
            _this.value = dataItem[field.dataField];
            if (_this.value instanceof Date)
                _this._valueType = 'date';
            else
                _this._valueType = typeof _this.value;
            $(_this._editorElement).hide();
            return _this;
        }
        Object.defineProperty(GridViewEditableCell.prototype, "field", {
            get: function () {
                return this._field;
            },
            enumerable: true,
            configurable: true
        });
        GridViewEditableCell.prototype.beginEdit = function () {
            $(this.valueElement).hide();
            $(this._editorElement).show();
            var value = this._dataItem[this.field.dataField];
            this.controlValue = value;
        };
        GridViewEditableCell.prototype.endEdit = function () {
            this.value = this.controlValue;
            this._dataItem[this.field.dataField] = this.value;
            $(this._editorElement).hide();
            $(this.valueElement).show();
        };
        GridViewEditableCell.prototype.cancelEdit = function () {
            $(this._editorElement).hide();
            $(this.valueElement).show();
        };
        //==============================================
        // Virtual Methods
        GridViewEditableCell.prototype.createControl = function () {
            var ctrl = document.createElement('span');
            ctrl.appendChild(document.createElement('input'));
            return ctrl;
        };
        Object.defineProperty(GridViewEditableCell.prototype, "controlValue", {
            get: function () {
                var text = this._editorElement.querySelector('input').value;
                switch (this._valueType) {
                    case 'number':
                        return new Number(text).valueOf();
                    case 'date':
                        return new Date(text);
                    default:
                        return text;
                }
            },
            set: function (value) {
                this._editorElement.querySelector('input').value = value;
            },
            enumerable: true,
            configurable: true
        });
        return GridViewEditableCell;
    }(wuzhui.GridViewDataCell));
    wuzhui.GridViewEditableCell = GridViewEditableCell;
    var BoundField = (function (_super) {
        __extends(BoundField, _super);
        function BoundField(params) {
            var _this = _super.call(this, params) || this;
            _this._params = params;
            _this._valueElement = document.createElement('span');
            return _this;
        }
        BoundField.prototype.params = function () {
            return this._params;
        };
        Object.defineProperty(BoundField.prototype, "nullText", {
            /**
             * Gets the caption displayed for a field when the field's value is null.
             */
            get: function () {
                return this.params().nullText;
            },
            enumerable: true,
            configurable: true
        });
        BoundField.prototype.createItemCell = function (dataItem) {
            var cell = new GridViewEditableCell(this, dataItem);
            cell.style(this.itemStyle);
            return cell;
        };
        Object.defineProperty(BoundField.prototype, "dataField", {
            /**
             * Gets the field for the value.
             */
            get: function () {
                return this.params().dataField;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoundField.prototype, "dataFormatString", {
            /**
             * Gets the string that specifies the display format for the value of the field.
             */
            get: function () {
                return this.params().dataFormatString;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BoundField.prototype, "controlStyle", {
            get: function () {
                return this.params().controlStyle;
            },
            enumerable: true,
            configurable: true
        });
        return BoundField;
    }(wuzhui.DataControlField));
    wuzhui.BoundField = BoundField;
})(wuzhui || (wuzhui = {}));
/// <reference path="DataControlField.ts"/>
var wuzhui;
(function (wuzhui) {
    var GridViewCommandCell = (function (_super) {
        __extends(GridViewCommandCell, _super);
        function GridViewCommandCell(field) {
            return _super.call(this) || this;
        }
        return GridViewCommandCell;
    }(wuzhui.GridViewCell));
    var CommandField = (function (_super) {
        __extends(CommandField, _super);
        function CommandField(params) {
            var _this = _super.call(this, params) || this;
            // private _updating = false;
            // private _deleting = false;
            _this.currentMode = 'read';
            if (!_this.params().cancelButtonHTML)
                _this.params().cancelButtonHTML = '取消';
            if (!_this.params().deleteButtonHTML)
                _this.params().deleteButtonHTML = '删除';
            if (!_this.params().editButtonHTML)
                _this.params().editButtonHTML = '编辑';
            if (!_this.params().updateButtonHTML)
                _this.params().updateButtonHTML = '更新';
            return _this;
        }
        CommandField.prototype.params = function () {
            return this._params;
        };
        Object.defineProperty(CommandField.prototype, "cancelButtonHTML", {
            get: function () {
                return this.params().cancelButtonHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "deleteButtonHTML", {
            get: function () {
                return this.params().deleteButtonHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "editButtonHTML", {
            get: function () {
                return this.params().editButtonHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "updateButtonHTML", {
            get: function () {
                return this.params().updateButtonHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "newButtonHTML", {
            get: function () {
                return this.params().newButtonHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "insertButtonHTML", {
            get: function () {
                return this.params().insertButtonHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "cancelButtonClass", {
            get: function () {
                return this.params().cancelButtonClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "deleteButtonClass", {
            get: function () {
                return this.params().deleteButtonClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "editButtonClass", {
            get: function () {
                return this.params().editButtonClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "newButtonClass", {
            get: function () {
                return this.params().newButtonClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "updateButtonClass", {
            get: function () {
                return this.params().updateButtonClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CommandField.prototype, "insertButtonClass", {
            get: function () {
                return this.params().insertButtonClass;
            },
            enumerable: true,
            configurable: true
        });
        CommandField.prototype.createItemCell = function (dataItem) {
            var _this = this;
            var cell = new GridViewCommandCell(this);
            cell.style(this.itemStyle);
            if (this.params().showEditButton) {
                var editButton = this.createEditButton();
                editButton.style.marginRight = '4px';
                if (this.editButtonClass)
                    editButton.className = this.editButtonClass;
                cell.editButton = editButton;
                // $(editButton).click(this.on_editButtonClick);
                editButton.addEventListener('click', function (e) { return _this.on_editButtonClick(e); });
                cell.appendChild(editButton);
                var updateButton = this.createUpdateButton();
                updateButton.style.display = 'none';
                updateButton.style.marginRight = '4px';
                if (this.updateButtonClass)
                    updateButton.className = this.updateButtonClass;
                cell.updateButton = updateButton;
                updateButton.addEventListener('click', function (e) { return _this.on_updateButtonClick(e); });
                cell.appendChild(updateButton);
                var cancelButton = this.createCancelButton();
                cancelButton.style.display = 'none';
                cancelButton.style.marginRight = '4px';
                if (this.cancelButtonClass)
                    cancelButton.className = this.cancelButtonClass;
                cell.cacelButton = cancelButton;
                cancelButton.addEventListener('click', function (e) { return _this.on_cancelButtonClick(e); });
                cell.appendChild(cancelButton);
            }
            if (this.params().showDeleteButton) {
                var deleteButton = this.createDeleteButton();
                deleteButton.style.marginRight = '4px';
                if (this.deleteButtonClass)
                    deleteButton.className = this.deleteButtonClass;
                cell.deleteButton = deleteButton;
                $(deleteButton).click(this.on_deleteButtonClick);
                cell.appendChild(deleteButton);
            }
            if (this.params().showNewButton) {
                var newButton = this.createNewButton();
                newButton.style.marginRight = '4px';
                if (this.newButtonClass)
                    newButton.className = this.newButtonClass;
                cell.newButton = newButton;
                cell.appendChild(newButton);
            }
            return cell;
        };
        CommandField.prototype.createEditButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.editButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createDeleteButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.deleteButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createInsertButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.insertButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createUpdateButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.updateButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createCancelButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.cancelButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.createNewButton = function () {
            var button = document.createElement('a');
            button.innerHTML = this.newButtonHTML;
            button.href = 'javascript:';
            return button;
        };
        CommandField.prototype.hideButton = function (button) {
            button.style.display = 'none';
        };
        CommandField.prototype.showButton = function (button) {
            button.style.removeProperty('display');
        };
        CommandField.prototype.findParentCell = function (element) {
            var cellElement;
            var p = element.parentElement;
            while (p) {
                if (p.tagName == 'TD') {
                    cellElement = p;
                    break;
                }
                p = p.parentElement;
            }
            return cellElement;
        };
        CommandField.prototype.on_editButtonClick = function (e) {
            var cellElement = this.findParentCell(e.target);
            console.assert(cellElement != null);
            var rowElement = cellElement.parentElement;
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell_1 = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell_1 instanceof wuzhui.GridViewEditableCell) {
                    cell_1.beginEdit();
                }
            }
            var cell = wuzhui.Control.getControlByElement(cellElement);
            this.showButton(cell.cacelButton);
            this.showButton(cell.updateButton);
            this.hideButton(cell.editButton);
            if (cell.deleteButton)
                this.hideButton(cell.deleteButton);
            if (cell.newButton)
                this.hideButton(cell.newButton);
        };
        CommandField.prototype.on_cancelButtonClick = function (e) {
            var cellElement = this.findParentCell(e.target);
            console.assert(cellElement != null);
            var rowElement = cellElement.parentElement;
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell_2 = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell_2 instanceof wuzhui.GridViewEditableCell) {
                    cell_2.cancelEdit();
                }
            }
            var cell = wuzhui.Control.getControlByElement(cellElement);
            this.hideButton(cell.cacelButton);
            this.hideButton(cell.updateButton);
            this.showButton(cell.editButton);
            if (cell.deleteButton)
                this.showButton(cell.deleteButton);
            if (cell.newButton)
                this.showButton(cell.newButton);
        };
        CommandField.prototype.on_updateButtonClick = function (e) {
            var _this = this;
            if (e.target['_updating'])
                e.target['_updating'] = true;
            var cellElement = $(e.target).parents('td').first()[0];
            var rowElement = cellElement.parentElement;
            var row = wuzhui.Control.getControlByElement(rowElement);
            //==========================================================
            // 复制 dataItem 副本
            var dataItem = $.extend({}, row.dataItem || {});
            //==========================================================
            var dataSource = row.gridView.dataSource;
            var editableCells = new Array();
            for (var i = 0; i < rowElement.cells.length; i++) {
                var cell = wuzhui.Control.getControlByElement(rowElement.cells[i]);
                if (cell instanceof wuzhui.GridViewEditableCell) {
                    dataItem[cell.field.dataField] = cell.controlValue;
                    editableCells.push(cell);
                }
            }
            try {
                return dataSource.update(dataItem)
                    .then(function () {
                    editableCells.forEach(function (item) { return item.endEdit(); });
                    var cell = wuzhui.Control.getControlByElement(cellElement);
                    _this.hideButton(cell.cacelButton);
                    _this.hideButton(cell.updateButton);
                    e.target['_updating'] = false;
                })
                    .catch(function () { return e.target['_updating'] = false; });
            }
            finally {
            }
        };
        CommandField.prototype.on_deleteButtonClick = function (e) {
            // if (this._deleting)
            //     return;
            // this._deleting = true;
            var rowElement = $(e.target).parents('tr').first()[0];
            var row = wuzhui.Control.getControlByElement(rowElement);
            var dataSource = row.gridView.dataSource;
            dataSource.delete(row.dataItem)
                .then(function () {
                $(rowElement).remove();
                // this._deleting = false;
            });
            // .catch(() => this._deleting = false);
        };
        return CommandField;
    }(wuzhui.DataControlField));
    wuzhui.CommandField = CommandField;
})(wuzhui || (wuzhui = {}));
/// <reference path="DataControlField.ts"/>
var wuzhui;
(function (wuzhui) {
    var CustomField = (function (_super) {
        __extends(CustomField, _super);
        function CustomField(params) {
            return _super.call(this, params) || this;
        }
        CustomField.prototype.params = function () {
            return this._params;
        };
        CustomField.prototype.createHeaderCell = function () {
            if (this.params().createHeaderCell) {
                var cell = this.params().createHeaderCell();
                cell.style(this.headerStyle);
                return cell;
            }
            return _super.prototype.createHeaderCell.call(this);
        };
        CustomField.prototype.createFooterCell = function () {
            if (this.params().createFooterCell) {
                var cell = this.params().createFooterCell();
                cell.style(this.params().footerStyle);
                return cell;
            }
            return _super.prototype.createFooterCell.call(this);
        };
        CustomField.prototype.createItemCell = function (dataItem) {
            if (this.params().createItemCell) {
                var cell = this.params().createItemCell(dataItem);
                cell.style(this.params().itemStyle);
                return cell;
            }
            return _super.prototype.createItemCell.call(this, dataItem);
        };
        return CustomField;
    }(wuzhui.DataControlField));
    wuzhui.CustomField = CustomField;
})(wuzhui || (wuzhui = {}));
