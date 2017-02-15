
/*
 * JData v1.0.0
 * This software license is under GPL and Ms-PL.
 * Copyright (c) 2013-06-30 Shu Mai
 *
 */

Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

//======================= DataControlRowState =======================
JData.DataControlRowState = function () {
    /// <field name="Normal" type="Number" integer="true" static="true"/>
    /// <field name="Alternate" type="Number" integer="true" static="true"/>
    /// <field name="Selected" type="Number" integer="true" static="true"/>
    /// <field name="Edit" type="Number" integer="true" static="true"/>
    /// <field name="Insert" type="Number" integer="true" static="true"/>
};

JData.DataControlRowState.prototype = {
    Normal: 1,
    Alternate: 2,
    Selected: 4,
    Edit: 8,
    Insert: 16
};
JData.DataControlRowState.registerEnum('JData.DataControlRowState', true);

//======================= DataControlRowType =======================

JData.DataControlRowType = {
    Header: 'Header',
    Footer: 'Footer',
    DataRow: 'DataRow',
    //    Separator: 3,
    Pager: 'Pager',
    EmptyDataRow: 'EmptyDataRow',
    Caption: 'Caption'
};

//======================= DataControlCellType =======================

JData.DataControlCellType = function () { };

JData.DataControlCellType = {
    Header: 'Header',
    Footer: 'Footer',
    DataCell: 'DataCell'
};

//======================= GridLines ===========================

JData.GridLines = {
    None: 'None',
    Horizontal: 'Horizontal',
    Vertical: 'Vertical',
    Both: 'Horizontal|Vertical'
};

//======================= HorizontalAlign ===========================

JData.HorizontalAlign = {
    NotSet: 'NotSet',
    Left: 'Left',
    Center: 'Center',
    Right: 'Right',
    Justify: 'Justify'

};

//======================= PagerButtons ===========================

JData.PagerButtons = {
    NextPrevious: 'NextPrevious',
    Numeric: 'Numeric',
    NextPreviousFirstLast: 'NextPreviousFirstLast',
    NumericFirstLast: 'NumericFirstLast'
};


//======================= PagerPosition ===========================

JData.PagerPosition = {
    Bottom: 'Bottom',
    Top: 'Top',
    TopAndBottom: 'Top|Bottom'
};

//======================= PagerPosition ===========================

JData.CommandPosition = {
    Bottom: 'Bottom',
    Top: 'Top',
    TopAndBottom: 'Top|Bottom'
};

//======================= DataMode ===========================

JData.DataFieldMode = {
    ReadOnly: 'ReadOnly',
    Edit: 'Edit',
    Insert: 'Insert'
};

//======================= ButtonType ===========================

JData.ButtonType = {
    Button: 'Button',
    Image: 'Image',
    Link: 'Link',
    Icon: 'Icon'
};
Type.registerNamespace("JData");

JData.FontInfo = function () {
}

JData.FontInfo.prototype = {
    get_bold: function () {
        /// <returns type="Boolean">
        /// Gets a value that indicates whether the font is bold.
        /// </returns>
        return this._bold;
    },
    set_bold: function (value) {
        /// <param name="value" type="Boolean">
        /// Sets a value that indicates whether the font is bold.
        /// </param>
        this._bold = value;
    },

    get_italic: function () {
        /// <returns type="Boolean">
        /// Gets a value that indicates whether the font is italic.
        /// </returns>
        return this._italic;
    },
    set_italic: function (value) {
        /// <param name="value" type="Boolean">
        /// Sets a value that indicates whether the font is italic.
        /// </param>
        this._italic = value;
    },

    get_name: function () {
        /// <returns type="String">
        /// Gets the primary font name.
        /// </returns>
        return this._name;
    },
    set_name: function (value) {
        /// <param name="value" type="String">
        /// Sets the primary font name.
        /// </param>
        this._name = value;
    },

    get_names: function () {
        /// <returns type="Array">
        /// Gets an ordered array of font names.
        /// </returns>
        return this._names;
    },
    set_names: function (value) {
        /// <param name="value" type="Array">
        /// Sets an ordered array of font names.
        /// </param>
        this._names = value;
    },

    get_overline: function () {
        /// <returns type="Boolean">
        /// Gets a value that indicates whether the font is overlined.
        /// </returns>
        return this._overline;
    },
    set_overline: function (value) {
        /// <param name="value">
        /// Sets a value that indicates whether the font is overlined.
        /// </param>
        this._overline = value;
    },

    get_size: function () {
        /// <returns type="String">
        /// Gets the font size.
        /// </returns>
        return this._size;
    },
    set_size: function (value) {
        /// <param name="value" type="String">
        ///  Sets the font size.
        /// </param>
        this._size = value;
    },

    get_strikeout: function () {
        /// <returns type="Boolean">
        /// Gets a value that indicates whether the font is strikethrough.
        /// </returns>
        return this._strikeout;
    },
    set_strikeout: function (value) {
        /// <param name="value" type="boolean">
        /// Sets a value that indicates whether the font is strikethrough.
        /// </param>
        this._strikeout = value;
    },

    get_underline: function () {
        /// <returns type="Boolean">
        /// Gets a value that indicates whether the font is underlined.
        /// </returns>
        return this._underline;
    },
    set_underline: function (value) {
        /// <param name="value" type="Boolean">
        /// Sets a value that indicates whether the font is underlined.
        /// </param>
        this._underline = value;
    }

}

JData.FontInfo.registerClass('JData.FontInfo');

//================================================

JData.Style = function () {
    JData.Style.initializeBase(this);

    this._font = new JData.FontInfo();
    this._css = {};
    //this.set_backColor('');
    //this.set_cssClass('');
    //this.set_foreColor('');
    //this.set_height('');
    //this.set_padding('');
    //this.set_textAlign('');
    //this.set_width('');
};

JData.Style.prototype = {

    _cssProperty: function (name, value) {
        if (value === undefined)
            return this._css[name];

        this._css[name] = value;
    },

    get_backColor: function () {
        //return this._backColor;
        return this._cssProperty('backgroundColor');
    },
    set_backColor: function (value) {
        //this.css['backgroundColor'] = value;
        this._cssProperty('backgroundColor', value);
    },

    get_cssClass: function () {
        return this._cssProperty('class');
    },
    set_cssClass: function (value) {
        this._cssProperty('class', value);
    },

    get_cursor: function () {
        return this._cssProperty('cursor');
    },
    set_cursor: function (value) {
        this._cssProperty('cursor', value);
    },

    get_float: function () {
        return this._cssProperty('float');
    },
    set_float: function (value) {
        this._cssProperty('float', value);
    },

    get_font: function () {
        /// <returns name="value" type="JData.Font">
        /// Gets the font properties associated with the Web server control.
        /// </returns>
        return this._font;
    },

    set_font: function (value) {
        /// <param name="value" type="JData.Font">
        /// Sets the font properties associated with the Web server control.
        /// </param>
        this._font = value;
    },

    get_foreColor: function () {
        /// <returns type="String">
        /// Gets the foreground color (typically the color of the text) of the Web server control.
        /// </returns>
        //return this._foreColor;
        return this._cssProperty('color');
    },
    set_foreColor: function (value) {
        /// <param name="value" type="String">
        /// Sets the foreground color (typically the color of the text) of the Web server control.
        /// </param>
        //this._foreColor = value;
        this._cssProperty('color', value);
    },

    get_height: function () {
        /// <returns type="String"/>
        return this._cssProperty('height');
    },
    set_height: function (value) {
        /// <param name="value" type="string"/>
        this._cssProperty('height', value);
    },

    get_margin: function () {
        /// <returns type="String"/>
        return this._cssProperty('margin');
    },
    set_margin: function (value) {
        /// <param name="value" type="string"/>
        this._cssProperty('margin', value);
    },

    get_padding: function () {
        /// <returns type="string"/>
        //return this._padding;
        return this._cssProperty('padding');
    },
    set_padding: function (value) {
        /// <param name="value" type="string"/>
        //this._padding = value;
        this._cssProperty('padding', value);
    },

    get_position: function () {
        /// <returns type="string"/>
        return this._cssProperty('position');
    },
    set_position: function (value) {
        /// <param name="value" type="string"/>
        this._cssProperty('position', value);
    },

    get_textAlign: function () {
        /// <returns type="String"/>
        //return this._horizontalAlign;
        return this._cssProperty('textAlign');
    },
    set_textAlign: function (value) {
        /// <param name="value" type="String"/>
        //this._horizontalAlign = value;
        this._cssProperty('textAlign', value);
    },

    get_width: function () {
        /// <returns type="String"/>
        //return this._width;
        return this._cssProperty('width');
    },
    set_width: function (value) {
        /// <param name="value" type="String"/>
        //this._width = value;
        this._cssProperty('width', value);
    },

    mergeWith: function (style) {
        var newStyle = new JData.Style();

        if (this.get_cssClass() != undefined) {
            newStyle.set_cssClass(this.get_cssClass());
        }
        if (style.get_cssClass() != undefined) {
            if (newStyle.get_cssClass() != undefined) {
                newStyle.set_cssClass(newStyle.get_cssClass() + ' ' + style.get_cssClass());
            }
            else {
                newStyle.set_cssClass(style.get_cssClass());
            }
        }

        for (var key in this._css) {
            if (this._css[key] != undefined) {
                newStyle._css[key] = this._css[key];
            }
        }

        for (var key in style._css) {
            if (style._css[key] != undefined) {
                newStyle._css[key] = style._css[key];
            }
        }
        return newStyle;
    },

    applyTo: function (element) {

        if (this.get_cssClass() != null) {
            element.className = this.get_cssClass();
        }
        //else {
        //    element.className = '';
        //}

        for (var key in this._css) {
            element.style[key] = this._css[key];
        }
        if (this.get_backColor() != null) {
            element.style.backgroundColor = this.get_backColor();
        }
        //else {
        //    element.style.backgroundColor = '';
        //}

        if (this.get_font().get_bold() == true)
            element.style.fontWeight = 'bold';
        else
            element.style.fontWeight = '';

        if (this.get_font().get_size() != null)
            element.style.fontSize = this.get_font().get_size();
        //else
        //    element.style.fontSize = '';

        if (this.get_foreColor() != null)
            element.style.color = this.get_foreColor();
        //else
        //    element.style.color = '';

        if (this.get_height() != null) {
            element.style['height'] = this.get_height();
        }
        //else {
        //    element.style['height'] = '';
        //}

        if (this.get_padding() != null) {
            element.style.padding = this.get_padding();
        }


        if (this.get_textAlign() != null) {
            element.style['textAlign'] = this.get_textAlign();
        }

        if (this.get_width() != null) {
            element.style['width'] = this.get_width();
        }

        if (this.get_float() != null)
            $(element).css('float', this.get_float());
    }
};

JData.Style.registerClass('JData.Style', Sys.Component);

//============================= TableItemStyle =============================

JData.TableItemStyle = function () {
    JData.TableItemStyle.initializeBase(this);
    //this._horizontalAlign = '';
    //this._verticalAlign = '';
    //this._wrap = '';
};

JData.TableItemStyle.prototype = {
    get_horizontalAlign: function () {
        /// <return type="String"/>
        return this._horizontalAlign;
    },
    set_horizontalAlign: function (value) {
        /// <param name="value" type="String">
        /// </param>
        this._horizontalAlign = value;
    },

    get_verticalAlign: function () {
        /// <return type="String"/>
        return this._verticalAlign;
    },
    set_verticalAlign: function (value) {
        /// <param name="value" type="String">
        /// </param>
        this._verticalAlign = value;
    },

    get_wrap: function () {
        return this._wrap;
    },
    set_wrap: function (value) {
        this._wrap = value;
    },

    applyTo: function (element) {

        JData.TableItemStyle.callBaseMethod(this, 'applyTo', new Array(element));

        if (this.get_horizontalAlign() != null)
            element.align = this.get_horizontalAlign();
        //else
        //    element.align = '';

        if (this.get_verticalAlign() != null)
            element.vAlign = this.get_verticalAlign();
        //else
        //    element.vAlign = '';
    }
};

JData.TableItemStyle.registerClass('JData.TableItemStyle', JData.Style);

JData.ControlIcons = {
    cancelIcon: null,
    deleteIcon: null,
    editIcon: null,
    insertIcon: null,
    newIcon: null,
    selectIcon: null,
    unselectIcon: null,
    updateIcon: null
};


/// 
Type.registerNamespace('JData');

(function (ns) {

    //var Strings = JData.Internal.Strings;
    var dialog = ns.Dialog = {
        _dialogHeight: 200,
        _dialogWidth: 340,
        _buttonHeight: 22,
        _buttonWidth: 50,
        _createElement: function () {
            var selector = $('<div>');
            selector.css('margin', '30px 20px 30px 20px');
            return selector;
        },
        success: function (msg) {
            this._createElement().addClass('ui-state-highlight ui-corner-all').html(msg).dialog({
                title: JData.Internal.Strings.Dialog.Success,
                height: this._dialogHeight,
                width: this._dialogWidth,
                buttons: [
                    {
                        text: JData.Internal.Strings.Dialog.OK,
                        showText: JData.Internal.Strings.Dialog.OK,
                        click: function () {
                            $(this).dialog('close');
                        },
                        width: this._buttonWidth,
                        height: this._buttonHeight
                    }
                ]
            });
        },
        error: function (msg) {
            this._createElement().addClass('ui-state-error ui-corner-all').html(msg).dialog({
                title: JData.Internal.Strings.Dialog.Error,
                height: this._dialogHeight,
                width: this._dialogWidth,
                buttons: [
                    {
                        text: JData.Internal.Strings.Dialog.OK,
                        click: function () {
                            $(this).dialog('close');
                        },
                        width: this._buttonWidth,
                        height: this._buttonHeight
                    }
                ]
            });
        },
        confirm: function (msg, okCallback, cancelCallback) {
            if (okCallback == null) throw Error.argumentNull('okCallback');
            if (cancelCallback == null) throw Error.argumentNull('cancelCallback');

            this._createElement().html(msg).dialog({
                title: JData.Internal.Strings.Dialog.Confirm,
                buttons: [
                    {
                        text: JData.Internal.Strings.Dialog.OK,
                        click: function () {
                            $(this).dialog('close');
                            okCallback();
                        }
                    },
                    {
                        text: JData.Internal.Strings.Dialog.Cancel,
                        click: function () {
                            $(this).dialog('close');
                            cancelCallback();
                        }
                    }
                ]
            });
            if (confirm(msg))
                okCallback();
            else
                cancelCallback();
        }
    };

    ns.tooltip = function (element, msg) {
        /// <param name="msg" type="String">
        /// Tooltip to show.
        /// </param>
        element.title = msg;
    };

})(JData);

(function () {
    JData.Internal.PosgressDialog = function (dialogStyle, posgressBarStyle, labelStyle, closeButtonStyle) {
        /// <summary></summary>
        /// <param name="dialogStyle" type="JData.Style">Style of the dialog.</param>
        /// <param name="posgressBarStyle" type="JData.Style">Style of the posgress bar.</param>
        /// <param name="lableStyle" type="JData.Style">Style of the label.</param>
        /// <param name=closeButtonStyle" type="JData.Style">Style of the close button.</param>

        if (dialogStyle == null)
            throw Error.argumentNull('dialogStyle');

        if (posgressBarStyle == null)
            throw Error.argumentNull('posgressBarStyle');

        if (labelStyle == null)
            throw Error.argumentNull('labelStyle');

        if (closeButtonStyle == null)
            throw Error.argumentNull('closeButtonStyle');

        this._dialogElement = $('<div>').appendTo($(document.body)).uniqueId()[0];
        dialogStyle.applyTo(this._dialogElement);

        this._closeButtonElement = document.createElement('div');
        closeButtonStyle.applyTo(this._closeButtonElement);

        var _dialogElement = this._dialogElement;
        $(this._closeButtonElement).click(function () {
            $(_dialogElement).dialog('close');
        });
        $(this._dialogElement).append(this._closeButtonElement);

        this._posgressBarElement = document.createElement('div');
        posgressBarStyle.applyTo(this._posgressBarElement);

        this._posgressLabelElement = document.createElement('div');
        labelStyle.applyTo(this._posgressLabelElement);

        this._posgressBarElement.appendChild(this._posgressLabelElement);
        document.body.appendChild(this._posgressBarElement);

        this._posgressBar = $(this._posgressBarElement).progressbar({ value: false });


        $(this._dialogElement).append(this._posgressBar);
        this.referenceCount = 0;
    };

    JData.Internal.PosgressDialog.prototype = {
        show: function () {
            var dialog = $(this._dialogElement).dialog({ width: 480, modal: true });

            var dialogControl = $.data(this._dialogElement, 'ui-dialog');
            dialogControl.uiDialogTitlebar.hide();
            //dialogControl.uiDialogTitlebar.removeClass('ui-widget-header');
            this.referenceCount = this.referenceCount + 1;
        },
        close: function () {
            this.referenceCount = this.referenceCount - 1;
            var dialog = this;
            window.setTimeout(function () {
                //PosgressDialog 是单例，延迟 100 毫米再执行。如果立即关闭，当其它对象调用show，将会导致反复的打开、关闭，造成闪烁。
                if (dialog.referenceCount <= 0) {
                    $(dialog._dialogElement).dialog('close', true);
                    dialog.referenceCount = 0;
                }

            }, 100);
        },
        setText: function (msg) {
            this._posgressLabelElement.innerHTML = msg;
            $(this._posgressBarElement).progressbar({ value: false });
        }
    };

    JData.Internal.PosgressDialog.dialogStyle = new JData.Style();
    JData.Internal.PosgressDialog.posgressBarStyle = new JData.Style();
    JData.Internal.PosgressDialog.labelStyle = new JData.Style();
    JData.Internal.PosgressDialog.closeButtonStyle = new JData.Style();

    JData.Internal.PosgressDialog.GetInstance = function () {
        /// <return type='PosgressDialog'/>
        if (this.instance == null) {
            var dialogStyle = JData.Internal.PosgressDialog.dialogStyle;
            var posgressBarStyle = JData.Internal.PosgressDialog.posgressBarStyle;
            var labelStyle = JData.Internal.PosgressDialog.labelStyle;
            var closeButtonStyle = JData.Internal.PosgressDialog.closeButtonStyle;

            this.instance = new JData.Internal.PosgressDialog(dialogStyle, posgressBarStyle,
                                                              labelStyle, closeButtonStyle);
        }
        return this.instance;
    };
})();




Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

JData.DataSource = function () {
    this._enableCache = false;
    this._cache = {};
};

JData.DataSource.prototype = {
    get_events: function () {
        if (this._events == null) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },

    executeInsert: function (item, successedCallback, failedCallback) {
        /// <param name="item" type = "Object"/>
        /// <param name="successedCallback" type="Function"/>
        /// <param name="failedCallback" type="Function"/>
        /// <returns type="jQuery.Deferred"/>
        throw Error.notImplemented();
    },
    executeDelete: function (item, successedCallback, failedCallback) {
        /// <param name="item" type = "Object"/>
        /// <param name="successedCallback" type="Function"/>
        /// <param name="failedCallback" type="Function"/>
        /// <returns type="jQuery.Deferred"/>
        throw Error.notImplemented();
    },
    executeUpdate: function (item, successedCallback, failedCallback) {
        /// <param name="item" type = "Object"/>
        /// <param name="successedCallback" type="Function"/>
        /// <param name="failedCallback" type="Function"/>
        /// <returns type="jQuery.Deferred"/>
        throw Error.notImplemented();
    },
    executeSelect: function (args, successedCallback, failedCallback) {
        /// <param name="args" type = "JData.DataSourceSelectArguments"/>
        /// <param name="successedCallback" type="Function"/>
        /// <param name="failedCallback" type="Function"/>
        /// <returns type="jQuery.Deferred"/>
        throw Error.notImplemented();
    },

    //=================== METHODS ===================

    insert: function (item, successedCallback, failedCallback) {
        /// <returns type="jQuery.Deferred"/>
        var h = this.get_events().getHandler('inserting');
        if (h) h(this, { item: item });

        var dataSource = this;
        return this.executeInsert(item).done($.proxy(
            function (returnItem) {
                h = dataSource.get_events().getHandler('inserted');
                if (h) h(dataSource, { item: this._item, returnItem: returnItem });
            },
            { _item: item }
        ));
    },

    'delete': function (item, successedCallback, failedCallback) {
        /// <returns type="jQuery.Deferred"/>

        var h = this.get_events().getHandler('deleting');
        if (h) h(this, { item: item });

        var dataSource = this;
        return this.executeDelete(item).done($.proxy(
            function () {
                h = dataSource.get_events().getHandler('deleted');
                if (h) h(dataSource, { item: this._item });
            },
            { _item: item }
       ));
    },

    update: function (item, successedCallback, failedCallback) {
        /// <returns type="jQuery.Deferred"/>

        var h = this.get_events().getHandler('updating');
        //var item = newItem;
        if (h) h(this, { item: item });

        var dataSource = this;
        var result = this.executeUpdate(item).done($.proxy(
            function (returnItem) {
                h = dataSource.get_events().getHandler('updated');
                if (h) h(dataSource, { item: this._item, returnItem: returnItem });
            },
            { _item: item }
       ));

        return result;
    },

    select: function (args) {
        /// <returns type="jQuery.Deferred"/>
        args = args || new JData.DataSourceSelectArguments();

        var h = this.get_events().getHandler('selecting');

        if (h) h(this, { args: args });

        var dataSource = this;
        return this.executeSelect(args).done(
            $.proxy(function (items) {
                h = dataSource.get_events().getHandler('selected');
                if (h) h(dataSource, { items: items, selectArguments: this._args });
            },
            { _args: args })
        );
    },

    //=================== EVENTS ===================

    add_deleting: function (handler) {
        this.get_events().addHandler('deleting', handler);
    },
    remove_deleting: function (handler) {
        this.get_events().removeHandler('deleting', handler);
    },

    add_deleted: function (handler) {
        this.get_events().addHandler('deleted', handler);
    },
    remove_deleted: function (handler) {
        this.get_events().removeHandler('deleted', handler);
    },

    add_inserting: function (handler) {
        this.get_events().addHandler('inserting', handler);
    },
    remove_inserting: function (handler) {
        this.get_events().removeHandler('inserting', handler);
    },

    add_inserted: function (handler) {
        this.get_events().addHandler('inserted', handler);
    },
    remove_inserted: function (handler) {
        this.get_events().removeHandler('inserted', handler);
    },

    add_updating: function (handler) {
        this.get_events().addHandler('updating', handler);
    },
    remove_updating: function (halder) {
        this.get_events().removeHandler('updating', halder);
    },

    add_updated: function (handler) {
        this.get_events().addHandler('updated', handler);
    },
    remove_updated: function (halder) {
        this.get_events().removeHandler('updated', halder);
    },

    add_selected: function (handler) {
        this.get_events().addHandler('selected', handler);
    },
    remove_selected: function (handler) {
        this.get_events().removeHandler('selected', handler);
    },

    //===============================================

    //Virtual Properties
    canDelete: function (item) {
        return false;
    },
    canInsert: function (item) {
        return false;
    },
    canPage: function () {
        return false;
    },
    canRetrieveTotalRowCount: function () {
        return false;
    },
    canSort: function () {
        return false;
    },
    canUpdate: function (item) {
        return false;
    },
    get_name: function () {
        return this._name;
    },

    set_enableCache: function (value) {
        this._enableCache = value;
    },
    get_enableCache: function () {
        return this._enableCache;
    }

};

JData.DataSource.registerClass("JData.DataSource");

//==========================================================================

JData.DataSourceSelectArguments = function (source) {
    /// <param name="source" type="JData.DataSourceSelectArguments" mayBeNull="true"/>
    if (source != null)
        this._source(source);
    else {
        this._startRowIndex = 0;
        this._totalRowCount = null;
        this._maximumRows = 2147483647;
        this._retrieveTotalRowCount = false;
        this._sortExpression = null;
    }
};

JData.DataSourceSelectArguments.prototype = {

    _source: function (value) {
        /// <returns type="JData.DataSourceSelectArguments"/>
        if (value != null)
            this.__source = value;
        else
            return this.__source;
    },

    get_startRowIndex: function () {
        /// <returns type="Number"/>
        if (this._source() != null)
            return this._source().get_startRowIndex();
        else
            return this._startRowIndex;
    },
    set_startRowIndex: function (value) {
        /// <param name="value" type="Number"/>
        if (this._source() != null)
            this._source().set_startRowIndex(value);
        else
            this._startRowIndex = value;
    },

    get_totalRowCount: function () {
        /// <returns type="Number"/>
        if (this._source() != null)
            return this._source().get_totalRowCount();
        else
            return this._totalRowCount;
    },
    set_totalRowCount: function (value) {
        /// <param name="value" type="Number"/>
        if (this._source() != null)
            this._source().set_totalRowCount(value);
        else
            this._totalRowCount = value;
    },

    get_maximumRows: function () {
        /// <returns type="Number"/>
        if (this._source() != null)
            return this._source().get_maximumRows();
        else
            return this._maximumRows
    },
    set_maximumRows: function (value) {
        /// <param name="value" type="Number"/>
        if (!Number.isInstanceOfType(value))
            value = Number.parseInvariant(value);

        if (value < 1)
            throw JData.Internal.Error.DataSourceView.ErrorMaximumRows(value);

        if (this._source() != null)
            this._source().set_maximumRows(value);
        else
            this._maximumRows = value;
    },

    get_retrieveTotalRowCount: function () {
        /// <returns type="Boolean"/>
        if (this._source() != null)
            return this._source().get_retrieveTotalRowCount();
        else
            return this._retrieveTotalRowCount;
    },
    set_retrieveTotalRowCount: function (value) {
        /// <param name="value" type="Boolean">
        /// Gets or sets a value indicating whether a data source control should retrieve a count of all the data rows during a data retrieval operation.
        /// </param>
        if (this._source() != null)
            this._source().set_retrieveTotalRowCount(value);
        else
            this._retrieveTotalRowCount = value;
    },

    get_sortExpression: function () {
        /// <returns type="String"/>
        if (this._source() != null)
            return this._source().get_sortExpression();
        else
            return this._sortExpression;
    },
    set_sortExpression: function (value) {
        /// <param name="value" type="Number"/>
        if (this._source() != null)
            this._source().set_sortExpression(value);
        else
            this._sortExpression = value;
    },

    get_filter: function () {
        /// <returns type="String"/>
        return this._filter;
    },
    set_filter: function (value) {
        /// <param name="value" type="String"/>
        this._filter = value;
    },

    get_selection: function () {
        /// <returns type="String"/>
        return this._selection;
    },
    set_selection: function (value) {
        this._selection = value;
    }
};

JData.DataSourceSelectArguments.Empty = new JData.DataSourceSelectArguments();

JData.DataSourceSelectArguments.registerClass("JData.DataSourceSelectArguments");

//============================= ArrayDataSource =================================


JData.ArrayDataSource = function (items) {
    JData.ArrayDataSource.initializeBase(this);
    this._items = $.extend([], items || []);
};
JData.ArrayDataSource.prototype = {
    _getSourceItem: function (item) {
        for (var i = 0; i < this._items.length; i++) {
            if ((this._items[i].equals != null && this._items[i].equals(item)) || this._items[i] == item)
                return i;
        }

        return -1;
    },

    executeInsert: function (item) {
        var itemIndex = this._getSourceItem(item);
        if (itemIndex >= 0)
            throw Error.create('The item is exists.');

        Array.add(this._items, item);
        //successedCallback();
        return $.Deferred().resolve();
    },

    executeDelete: function (item) {
        var itemIndex = this._getSourceItem(item);
        if (itemIndex < 0)
            throw Error.create('The item is not exists.');

        Array.removeAt(this._items, itemIndex);
        //successedCallback();
        return $.Deferred().resolve();
    },

    executeUpdate: function (item) {
        var itemIndex = this._getSourceItem(item);
        if (itemIndex < 0)
            throw Error.create('The item is not exists.');

        if (!$.isPlainObject(this._items[itemIndex]))
            this._items[itemIndex] = item;
        else
            $.extend(this._items[itemIndex], item);

        //successedCallback();
        return $.Deferred().resolve();
    },

    executeSelect: function (args) {
        var items = new Array();
        if (args == null || (args.get_startRowIndex() == null || args.get_maximumRows() == null)) {
            for (var i = 0; i < this._items.length; i++)
                Array.add(items, this._items[i]);
        }
        else {
            var maxRows = args.get_maximumRows();
            var start = args.get_startRowIndex();

            Sys.Debug.assert(maxRows > 0);
            Sys.Debug.assert(start >= 0);

            for (var i = start; i < start + maxRows && i < this._items.length; i++)
                Array.add(items, this._items[i]);
        }
        args.set_totalRowCount(this.get_dataItems().length);
        return $.Deferred().resolve(items);
        //successedCallback(items);
    },
    canDelete: function () {
        return true;
    },
    canInsert: function () {
        return true;
    },
    canUpdate: function () {
        return true;
    },
    canPage: function () {
        return true;
    },
    canRetrieveTotalRowCount: function () {
        return true;
    },

    get_dataItems: function () {
        return this._items;
    },
    set_dataItems: function (value) {
        Sys.Debug.assert(Array.isInstanceOfType(value));
        this._items = value;
    }
};

JData.ArrayDataSource.registerClass('JData.ArrayDataSource', JData.DataSource);


//========================= PagingDataSource =============================


JData.Internal.PagingDataSource = function (source) {
    /// <param name="source" type="JData.DataSource"/>
    JData.Internal.PagingDataSource.initializeBase(this, new Array());
    this._source = source;

};

JData.Internal.PagingDataSource.prototype = {

    //====================== Methods ======================

    executeInsert: function (item, successedCallback, failedCallback) {
        return this._source.executeInsert(item, successedCallback, failedCallback);
    },

    executeDelete: function (item, successedCallback, failedCallback) {
        return this._source.executeDelete(item, successedCallback, failedCallback);
    },

    executeUpdate: function (item, successedCallback, failedCallback) {
        return this._source.executeUpdate(item, successedCallback, failedCallback);
    },

    executeSelect: function (args, successedCallback, failedCallback) {

        return this._source.executeSelect(args, function (allItems) {
            args.set_totalRowCount(allItems.length);
            var maxRows = args.get_maximumRows();
            var start = args.get_startRowIndex();
            var items = new Array();
            for (var i = start; i < start + maxRows && i < allItems.length; i++) {
                Array.add(items, allItems[i]);
            }
            successedCallback(items);
        }, failedCallback);
    },

    //====================== Properties ======================

    canRetrieveTotalRowCount: function () {
        return true;
    }
};

JData.Internal.PagingDataSource.registerClass('JData.Internal.PagingDataSource', JData.DataSource);

//============================================================================

JData.GridViewDataSource = function (gridView) {
    /// <summary>Use gridView selected rows as data-source.</summary>
    /// <param name="gridView" type="JData.GridView"></param>

    JData.GridViewDataSource.initializeBase(this);
    this._gridView = gridView;

};

JData.GridViewDataSource.prototype = {
    _source: function () {
        var dataSource = this.get_gridView().get_dataSource();
        if (dataSource == null)
            throw JData.Internal.Error.GridViewDataSourceCanNotNull();

        return dataSource;
    },
    canDelete: function () {
        return this._source().canDelete();
    },
    canInsert: function () {
        return this._source().canInsert();
    },
    canPage: function () {
        return true;
    },
    canRetrieveTotalRowCount: function () {
        return true;
    },
    canSort: function () {
        return false;
    },
    canUpdate: function () {
        return this._source().canUpdate();
    },
    get_gridView: function () {
        /// <summary>Grid view of the data source.</summary>
        /// <returns type="JData.GridView"/>
        return this._gridView;
    },
    get_dataItems: function () {
        var dataItems = new Array();
        for (var i = 0; i < this.get_gridView().get_selectedRows().length; i++) {
            var row = this.get_gridView().get_selectedRows()[i];
            var dataItem = row.get_dataItem();
            Array.add(dataItems, dataItem);
        }
        return dataItems;
    },
    executeSelect: function (args) {
        /// <param name="args" type = "JData.DataSourceSelectArguments"/>
        /// <param name="successedCallback" type="Function"/>
        /// <param name="failedCallback" type="Function"/>
        this._items = this.get_dataItems();

        var items = new Array();
        if (args == null || (args.get_startRowIndex() < 0 || args.get_maximumRows() <= 0)) {
            for (var i = 0; i < this._items.length; i++)
                Array.add(items, this._items[i]);
        } else {
            args.set_totalRowCount(this._items.length);
            var maxRows = args.get_maximumRows();
            var start = args.get_startRowIndex();

            Sys.Debug.assert(maxRows > 0);
            Sys.Debug.assert(start >= 0);

            for (var i = start; i < start + maxRows && i < this._items.length; i++)
                Array.add(items, this._items[i]);
        }

        return $.Deferred().resolve(items);
    },
    executeDelete: function (item, successedCallback, failedCallback) {
        return this._source()['delete'](item, successedCallback, failedCallback);
    },
    executeInsert: function (item, successedCallback, failedCallback) {
        return this._source().insert(item, successedCallback, failedCallback);
    },
    executeUpdate: function (item, successedCallback, failedCallback) {
        return this._source().update(item, successedCallback, failedCallback);
    }
};

JData.GridViewDataSource.registerClass('JData.GridViewDataSource', JData.DataSource);


JData.WebDataSource = function (selectUrl, insertUrl, updateUrl, deleteUrl) {

    JData.WebDataSource.initializeBase(this);

    this._selectUrl = selectUrl;
    this._insertUrl = insertUrl;
    this._updateUrl = updateUrl;
    this._deleteUrl = deleteUrl;
    this._method = 'GET';
};

JData.WebDataSource.prototype = {
    canDelete: function (item) {
        return this._deleteUrl != null;
    },
    canInsert: function (item) {
        return this._insertUrl != null;
    },
    canUpdate: function (item) {
        return this._updateUrl != null;
    },
    canPage: function () {
        return true;
    },
    canRetrieveTotalRowCount: function () {
        return true;
    },
    canSort: function () {
        return false;
    },

    get_method: function () {
        return this._method;
    },
    set_method: function (value) {
        this._method = value;
    },

    get_selectUrl: function () {
        return this._selectUrl;
    },
    set_selectUrl: function (value) {
        this._selectUrl = value;
    },

    get_deleteUrl: function () {
        return this._deleteUrl;
    },
    set_deleteUrl: function (value) {
        this._deleteUrl = value;
    },

    get_updateUrl: function () {
        return this._updateUrl;
    },
    set_updateUrl: function (value) {
        this._updateUrl = value;
    },

    get_insertUrl: function () {
        return this._insertUrl;
    },
    set_insertUrl: function (value) {
        this._insertUrl = value;
    },

    _callAjax: function (url, data) {
        var deferred = $.Deferred();
        $.ajax({
            url: url,
            data: data,
            method: this.get_method(),
            traditional: true
        })
        .done(function (data) {
            if (data.Type == 'ErrorObject' && data.Code != 'Success') {
                $.dialog.alert('错误', data.Message);
                deferred.reject();
            }
            else {
                deferred.resolve(data);
            }
        });

        return deferred;
    },

    executeSelect: function (args, successedCallback, failedCallback) {
        /// <return type="jQuery.Deferred"/>
        var data = this._translateToObject(args);
        return this._callAjax(this._selectUrl, data)
                   .then(function (result) {
                       var data_items;
                       if ($.isArray(result)) {
                           args.set_totalRowCount(result.length);
                           data_items = result;
                       }
                       else if (result.Type == 'DataSourceSelectResult') {
                           args.set_totalRowCount(result.TotalRowCount);
                           data_items = result.DataItems;
                       }
                       else {
                           throw Error.create('Type of the query result is expected as Array or DataSourceSelectResult.');
                       }
                       //successedCallback(data_items);
                       return data_items;
                   })
                   .fail(failedCallback);
    },

    executeDelete: function (item, successedCallback, failedCallback) {
        /// <return type="jQuery.Deferred"/>
        var data = this._formatData(item);
        return this._callAjax(this._deleteUrl, data)
                   .done(successedCallback)
                   .fail(failedCallback);
    },

    executeInsert: function (item, successedCallback, failedCallback) {
        /// <return type="jQuery.Deferred"/>
        var data = this._formatData(item);
        return this._callAjax(this._insertUrl, data)
                   .done(successedCallback)
                   .fail(failedCallback);
    },

    executeUpdate: function (item, successedCallback, failedCallback) {
        /// <return type="jQuery.Deferred"/>
        var data = this._formatData(item);
        return this._callAjax(this._updateUrl, data)
                   .done(successedCallback)
                   .fail(failedCallback);
    },

    _translateToObject: function (args, skipFields) {
        var obj = {};
        skipFields = skipFields || [];
        for (var key in args) {
            if ($.isFunction(args[key]) && key.startsWith('get_')) {
                var name = key.substr(4);
                if (Array.contains(skipFields, name))
                    continue;

                obj[name] = args[key]();
            }
        }
        return obj;
    },

    _formatData: function (data) {
        var obj = $.extend({}, data);
        for (var name in obj) {
            if (Date.isInstanceOfType(data[name])) {
                // 说明：对于MVC3，必须把日期时间转换成'yyyy-MM-dd HH:mm'这种格式。
                var d = obj[name];
                obj[name] = String.format("{0}-{1}-{2} {3}:{4}:{5}",
                                            d.getFullYear(), d.getMonth() + 1, d.getDate(),
                                            d.getHours(), d.getMinutes(), d.getSeconds());
            }
        }
        return obj;
    }
};

JData.WebDataSource.registerClass('JData.WebDataSource', JData.DataSource);









Number.prototype.toFormattedString = function (format) {
    var reg = new RegExp('^C[0-9]+');
    if (reg.test(format)) {
        var num = format.substr(1);
        return this.toFixed(num);
    }
    return this;
};

Date.prototype.toFormattedString = function (format) {
    switch (format) {
        case 'd':
            return String.format("{0}-{1}-{2}", this.getFullYear(), this.getMonth() + 1, this.getDate());
        case 'g':
            return String.format("{0}-{1}-{2} {3}:{4}", this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getHours(), this.getMinutes());
        case 'G':
            return String.format("{0}-{1}-{2} {3}:{4}:{5}", this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
        case 't':
            return String.format("{0}:{1}", this.getHours(), this.getMinutes());
        case 'T':
            return String.format("{0}:{1}:{2}", this.getHours(), this.getMinutes(), this.getSeconds());
    }

    if (format != null && $.datepicker != null)
        return $.datepicker.formatDate(format, this)

    return this.toString();
};

Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

//========================== WebControl ==========================

JData.Internal.WebControl = function (element) {
    if (element == null)
        throw Error.argumentNull(element);

    JData.Internal.WebControl.initializeBase(this, new Array(element));

    this._controls = new Array();
};

JData.Internal.WebControl.prototype = {

    get_heigth: function () {
        /// <returns type="String"/>
        return this._heigth;
    },
    set_heigth: function (value) {
        /// <param name="value" type="String"/>
        this._heigth = value;
    },

    get_text: function () {
        return this.get_element().innerHTML;
    },
    set_text: function (value) {
        this.get_element().innerHTML = value;
    },

    get_visible: function () {
        return Sys.UI.DomElement.getVisible(this.get_element());
        //return this._visible;
    },
    set_visible: function (value) {
        /// <param name="value" type="Boolean"/>
        if (!Boolean.isInstanceOfType(value))
            value = Boolean.parse(value);

        if (this.get_element() != null)
            Sys.UI.DomElement.setVisible(this.get_element(), value);
    },

    get_width: function () {
        /// <returns type="String"/>
        return this._width;
    },
    set_width: function (value) {
        /// <param name="value" type="String"/>
        this._width = value;
    },

    //================ Methods =================

    clear: function () {
        this.get_element().innerHTML = '';
    },

    initialize: function () {
        //this.set_visible(true);
    },

    applyStyle: function (style) {
        style.applyTo(this.get_element());
    },

    get_id: function () {
        return this._id;
    },
    set_id: function (value) {
        this._id = value;
    }

};

JData.Internal.WebControl.registerClass('JData.Internal.WebControl', Sys.UI.Control);

//========================== TableCell ==========================

JData.Internal.TableCell = function (element) {
    if (element == null)
        throw Error.argumentNull(element);

    JData.Internal.TableCell.initializeBase(this, new Array(element));
};

JData.Internal.TableCell.prototype = {

    get_row: function () {
        /// <returns type="JData.Internal.TableRow"/>
        return this.get_parent();
    },
    set_row: function (value) {
        this.set_parent(value);
    },
    initialize: function () {

        var row = this.get_parent();
        var table = row.get_parent();
        var cell = this;
        Sys.Debug.assert(table != null);
        this.get_element().onclick = function () {
            var h = table.get_events().getHandler('cellClick');
            if (h) h(table, { cell: cell });
        };
        this.get_element().ondblclick = function () {
            var h = table.get_events().getHandler('cellDoubleClick');
            if (h) h(table, { cell: cell });
        };
    }
};

JData.Internal.TableCell.registerClass("JData.Internal.TableCell", JData.Internal.WebControl);


//========================== DataControlFieldCell ==========================

JData.Internal.DataControlFieldCell = function (element) {
    JData.Internal.DataControlFieldCell.initializeBase(this, new Array(element));

};

JData.Internal.DataControlFieldCell.prototype = {
    get_containingField: function () {
        return this._dataControlField;
    },
    set_containingField: function (value) {
        this._dataControlField = value;
    },
    get_value: function () {
        return this._value;
    },
    set_value: function (value) {
        var row = this.get_row();
        var col = this.get_containingField();

        if (value == null) {
            var dataField = col.get_dataField();
            if (dataField == null)
                throw JData.Internal.Error.DataControlField.DataFieldCanNotNull(col.get_name());

            var dataItem = row.get_dataItem();
            if (dataItem == null)
                throw JData.Internal.Error.DataControlField.DataItemCanNotNull();

            value = dataItem;
            var fields = dataField.split('.');
            for (var i = 0; i < fields.length; i++) {
                value = value[fields[i]];
                if (value == null && i < fields.length - 1)
                    throw JData.Internal.Error.DataControlField.FieldValueCanNotNull(fields[i]);
            }
        }
        var oldValue = this._value;
        if (value === oldValue) {
            return;
        }
        this._value = value;
        this.displayValue();
        var grid = row.get_parent();
        var h = grid.get_events().getHandler('cellValueChanged');
        if (h) h(grid, { cell: this });
    },
    get_contentContainer: function () {
        return this._contentContainer;
    },

    displayValue: function () {
        var text;
        var value = this.get_value();

        if (this._isEdit != null && this._isEdit()) {
            this.set_controlValue(value);
            return;
        }

        this.get_containingField().displayValue(this.get_contentContainer(), value);
    },

    initialize: function () {
        JData.Internal.DataControlFieldCell.callBaseMethod(this, 'initialize');
        this._contentContainer = document.createElement('div');
        this.get_element().appendChild(this._contentContainer);
    }
};

JData.Internal.DataControlFieldCell.registerClass('JData.Internal.DataControlFieldCell', JData.Internal.TableCell);


//========================== EditableCell ==========================

JData.Internal.EditableCell = function (element) {
    JData.Internal.EditableCell.initializeBase(this, [element]);
    this._isEdit(false);
};

JData.Internal.EditableCell.prototype = {
    get_text: function () {
        return this.get_contentContainer().innerHTML;
    },
    set_text: function (value) {
        this.get_contentContainer().innerHTML = value;
    },

    _isEdit: function (value) {
        if (value != null) {
            this.$isEdit = value;
        }
        return this.$isEdit;
    },

    get_value: function () {
        if (this._isEdit())
            return this.get_controlValue();
        else
            return this._value;
    },

    get_dataValue: function () {
        return this._value;
    },

    _controlMargin: function () {
        return 6;
    },

    _validators: function (value) {
        if (value == null) {
            return this.__validators;
        }
        else {
            for (var i = 0; i < value.length; i++) {
                var validator = value[i];
                validator.set_cellToValidate(this);
            }
            this.__validators = value;
        }
    },

    //======================== EVENTS ========================

    add_cellBeginEdit: function (handler) {
        this.get_events().addHandler('beginEdit', handler);
    },
    remove_cellBeginEdit: function (handler) {
        this.get_events().removeHandler('beginEdit', handler);
    },

    add_cellEndEdit: function (handler) {
        this.get_events().addHandler('endEdit', handler);
    },
    remove_cellEndEdit: function (handler) {
        this.get_events().removeHandler('endEdit', handler);
    },


    //========================================================


    _GetControlWidth: function (cellElement) {
        /*
        if (element.style.width != null && element.style.width.endsWith('px')) {
            var width = Number.parseInvariant(element.style.width.substr(0, element.style.width.length - 2));
            return (width - this._controlMargin()) + 'px';
        }
        */
        var width = Sys.UI.DomElement.getBounds(this.get_element()).width;
        var cw;

        //===========================================
        // 由于计算出来的宽度并不准确，所以采用分级的百份比设置控件的宽度
        var cw;
        if (width < 100)
            cw = '96%';
        else if (width > 100 && width <= 200)
            cw = '97%';
        else if (width > 200 && width < 320)
            cw = '98%'
        else
            cw = '99%';

        //===========================================
        return cw;
    },

    beginEdit: function () {
        if (this.get_containingField().get_readOnly() == true)
            return;
        var grid = this.get_parent().get_parent();
        var h = grid.get_events().getHandler('cellBeginEdit');
        if (h) h(grid, { cell: this });

        this.get_contentContainer().innerHTML = "";
        this._createControl = this.createControl(this.get_contentContainer());

        if (this._createControl != null) {
            this.get_contentContainer().appendChild(this._createControl);
            var controlStyle = this.get_containingField().get_controlStyle();
            controlStyle.applyTo(this._createControl);

            var skipAssignWidth = false;
            if (this._createControl.type != null && this._createControl.type.toLowerCase() == 'checkbox')
                skipAssignWidth = true;

            if ((controlStyle.get_width() == null || controlStyle.get_width() == '') && !skipAssignWidth) {
                this._createControl.style.width = this._GetControlWidth(this.get_element());
                //===========================================
            }
        }

        this.set_controlValue(this.get_value());
        this._isEdit(true);
    },

    pushValue: function () {
        var row = this.get_parent();
        var col = this.get_containingField();

        var dataItem = row.get_dataItem();
        var value = this.get_controlValue();
        dataItem[col.get_dataField()] = value;
        this.set_value(value);

        var grid = this.get_parent().get_parent();
        var h = grid.get_events().getHandler('cellValuePushed');
        if (h) h(grid, { cell: this });

        return true;
    },

    endEdit: function () {
        if (this._isEdit() == false)
            return;

        this.get_contentContainer().innerHTML = '';
        this._isEdit(false);
        this.displayValue();

        var grid = this.get_parent().get_parent();
        var h = grid.get_events().getHandler('cellEndEdit');
        if (h) h(grid, { cell: this });
    },


    //============ Virtual Methods ===============================

    createControl: function () {
        var container = this.get_contentContainer();
        var field = this.get_containingField();
        var control = field.createControl(container);
        return control;
    },

    get_controlValue: function () {
        var container = this.get_contentContainer();
        var field = this.get_containingField();
        var value = field.get_controlValue(container);
        return value;
    },

    set_controlValue: function (value) {
        var container = this.get_contentContainer();
        var field = this.get_containingField();
        field.set_controlValue(container, value);

    },

    //===================================

    initialize: function () {
        JData.Internal.EditableCell.callBaseMethod(this, 'initialize');
        var row = this.get_row();
        var col = this.get_containingField();
        var cell = this;
        var grid = row.get_parent();

        Sys.Debug.assert(this._isEdit() == false);
        Sys.Debug.assert(row.get_rowType() == JData.DataControlRowType.DataRow ||
                         row.get_rowType() == JData.DataControlRowType.EmptyDataRow);

        var dataItem = row.get_dataItem();
        this.set_value();
    },

    dispose: function () {
        //Add custom dispose actions here
        JData.Internal.EditableCell.callBaseMethod(this, 'dispose');
    }
}
JData.Internal.EditableCell.registerClass('JData.Internal.EditableCell', JData.Internal.DataControlFieldCell);

Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

//============================ DataControlField ============================

JData.Internal.DataControlField = function () {
    this._dataPropertyName = null;
    this._displayIndex = 0;
    this._readOnly = false;
    this._valueType = null;
    this._visible = true;
    this._width = '120px';
    this._height = '24px';
    this._cell = null;
    this._dataSource = null;
    this._Index = -1;

    this._controlStyle = new JData.Style();
    this._itemStyle = new JData.TableItemStyle();
    this._headerStyle = new JData.TableItemStyle();
    this._defaultValue = null;
};

JData.Internal.DataControlField.prototype = {
    get_boundTable: function () {
        /// <summary>
        /// Get the containing data bound table of the data control field.
        /// </summary>
        /// <returns type="JData.DataBoundTable"/>
        return this._boundTable;
    },
    get_defaultValue: function () {
        /// <returns type="Object"/>
        return this._defaultValue;
    },
    set_defaultValue: function (value) {
        /// <summary>
        /// Set the default value on the field of the object when it created by the control. 
        /// </summary>
        /// <param name="value" type="Object"/>
        this._defaultValue = value;
    },

    get_footerText: function () {
        /// <summary>
        /// Gets the text that is displayed in the footer item of a data control field.
        /// </summary>
        /// <returns type="String"/>
        if (this._footerText == null)
            return '';
        return this._footerText;
    },
    set_footerText: function (value) {
        /// <summary>
        /// Sets the text that is displayed in the footer item of a data control field.
        /// </summary>
        /// <param name="value" type="String"/>
        this._footerText = value;
    },

    get_headerText: function () {
        /// <summary>
        /// Gets the text that is displayed in the header item of a data control field
        /// </summary>
        /// <returns type="String"/>
        if (this._headerText == null)
            return '';
        return this._headerText;
    },
    set_headerText: function (value) {
        /// <summary>
        /// Sets the text that is displayed in the header item of a data control field
        /// </summary>
        /// <param name="value" type="String"/>

        this._headerText = value;
    },

    get_index: function () {
        /// <summary>
        /// Gets the order of the column relative to the currently columns.
        /// </summary>
        /// <returns type="Number"/>
        Sys.Debug.assert(this._Index > -1);
        return this._Index;
    },

    get_sortExpression: function () {
        /// <returns type="String">
        /// Gets a sort expression that is used by a data source control to sort data.
        /// </returns>
        return this._sortExpression;
    },
    set_sortExpression: function (value) {
        /// <param name="value" type="String">
        /// Sets a sort expression that is used by a data source control to sort data.
        /// </param>
        this._sortExpression = value;
    },

    get_visible: function () {
        /// <summary>
        /// Gets a value indicating whether the column is visible.
        /// </summary>
        /// <returns type="Boolean"/>
        return this._visible;
    },
    set_visible: function (value) {
        /// <summary>
        /// Sets a value indicating whether the column is visible.
        /// </summary>
        /// <param name ="value" type="Boolean"/>
        if (!Boolean.isInstanceOfType(value))
            value = Boolean.parse(value);

        this._visible = value;
    },

    get_name: function () {
        /// <summary> Gets name of this field.</summary>
        return this._name;
    },
    set_name: function (value) {
        /// <summary>
        /// Sets the field name. 
        /// </summary>
        /// <param name="value" type="String">Name of this field.</param>
        this._name = value;
    },

    //============== Style ==============

    get_controlStyle: function () {
        /// <summary>
        /// Gets the style of any Web server controls contained by the DataControlField object.
        /// </summary>
        /// <return type="JData.Style"/>
        return this._controlStyle;
    },
    set_controlStyle: function (value) {
        /// <summary>
        /// Sets the style of any Web server controls contained by the DataControlField object.
        /// </summary>
        /// <param name="value" type="JData.Style"/>
        this._controlStyle = value;
    },

    get_headerStyle: function () {
        /// <summary>
        /// Gets the style of the header of the data control field.
        /// </summary>
        /// <return type="JData.TableItemStyle"/>
        return this._headerStyle;
    },
    set_headerStyle: function (value) {
        /// <summary>
        /// Sets the style of the header of the data control field.
        /// </summary>
        /// <param name="value" type="JData.TableItemStyle"/>
        this._headerStyle = value;
    },

    get_itemStyle: function () {
        /// <summary>
        /// Gets the style of any text-based content displayed by a data control field.
        /// </summary>
        /// <returns type="JData.TableItemStyle"/>
        return this._itemStyle;
    },
    set_itemStyle: function (value) {
        /// <summary>
        /// Sets the style of any text-based content displayed by a data control field.
        /// </summary>
        /// <param name="value" type="JData.TableItemStyle"/>
        this._itemStyle = value;
    },

    //============== Methods ==============

    get_cellType: function () {
        /// <summary>
        /// Gets the run-time type of the cell template.
        /// </summary>
        /// <returns type="Type"/>
        return JData.Internal.DataControlFieldCell;
    },

    get_cellEvents: function () {
        return null;
    },

    get_properties: function () {
        return null;
    },

    _CreateCell: function (obj) {

        var properties = this.get_properties();
        Sys.Debug.assert(properties == null);
        if (properties == null)
            properties = {};

        var cellElement;
        if (Object.getTypeName(obj) == "JData.Internal.GridViewRow") {
            var gridViewRow = obj;
            cellElement = gridViewRow.get_element().insertCell(gridViewRow.get_element().cells.length)
            properties.parent = obj;
        }
        else {
            cellElement = obj;
        }
        Sys.Debug.assert(cellElement != null);

        properties.containingField = this;
        var cell = $create(this.get_cellType(), properties, this.get_cellEvents(), null, cellElement);
        var style = this.get_itemStyle(cell);
        cell.applyStyle(style);

        return cell;
    },

    _CreateHeaderCell: function (cellElement) {
        var column = this;

        var width = column.get_headerStyle().get_width();
        var cell = $create(JData.Internal.TableCell, null, null, null, cellElement);
        if (width != null)
            cell.get_element().style.width = width; //$(cell.get_element()).attr('width', width);

        cell.get_containingField = function () { return column };
        cell.set_text(column.get_headerText());
        cell.applyStyle(this.get_headerStyle());

        this._boundTable = cell.get_parent().get_parent();
        return cell;
    }
};

JData.Internal.DataControlField.registerClass('JData.Internal.DataControlField');

//============================ BoundField ============================

JData.BoundField = function (field, headerText, itemWidth, controlWidth, readOnly) {
    /// <param name="field" type="String" mayBeNull="true">
    /// The name of the data field to bind to the BoundField object.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="controlWidth" type="String" mayBeNull="true">
    /// The with of any control generated by a cell that generated by a data control field.
    /// </param>
    /// <param name="readOnly" type="Boolean" mayBeNull="true"/>

    JData.BoundField.initializeBase(this);


    this._readOnly = false;
    this._validators = new Array();
    this.set_nullText('');

    if (field != null)
        this.set_dataField(field);
    if (headerText != null)
        this.set_headerText(headerText);
    if (itemWidth != null)
        this.get_itemStyle().set_width(itemWidth);
    if (controlWidth != null)
        this.get_controlStyle().set_width(controlWidth);
    if (readOnly != null)
        this.set_readOnly(readOnly);
};

JData.BoundField.prototype = {

    get_dataField: function () {
        /// <returns type="String"/>
        return this._dataField;
    },
    set_dataField: function (value) {
        /// <param name="value" type="String"/>
        this._dataField = value;
    },

    get_name: function () {
        /// <summary> Gets name of this field.</summary>
        var value = JData.BoundField.callBaseMethod(this, 'get_name');
        if (value == null)
            return this.get_dataField();

        return value;
    },

    get_dataFormatString: function () {
        /// <summary>
        /// Gets the string that specifies the display format for the value of the field.
        /// </summary>
        /// <return type="String"/>
        return this._dataFormatString;
    },
    set_dataFormatString: function (value) {
        /// <summary>
        /// Sets the string that specifies the display format for the value of the field.
        /// </summary>
        /// <param name="value" type="String"/>
        this._dataFormatString = value;
    },

    get_headerText: function () {
        if (this._headerText == null)
            return this.get_dataField();
        return this._headerText;
    },
    set_headerText: function (value) {
        this._headerText = value;
    },

    set_readOnly: function (value) {
        /// <summary>
        /// Sets a value indicating whether the value of the field can be modified in edit mode.
        /// </summary>
        /// <param name="value" type="Boolean"/>
        if (value == null)
            throw Error.argumentNull('value');

        if (!Boolean.isInstanceOfType(value))
            value = Boolean.parse(value);

        this._readOnly = value;
    },
    get_readOnly: function () {
        /// <summary>
        /// Sets a value indicating whether the value of the field can be modified in edit mode.
        /// </summary>
        /// <returns type="Boolean"/>
        return this._readOnly;
    },

    get_nullText: function () {
        /// <summary>
        /// Gets the caption displayed for a field when the field's value is null.
        /// </summary>
        /// <returns type="String"/>
        return this._nullText;
    },
    set_nullText: function (text) {
        /// <summary>
        /// Sets the caption displayed for a field when the field's value is null.
        /// </summary>
        /// <param name="text" type="String"/>
        this._nullText = text;
    },

    get_validators: function () {
        /// <returns type="Array"/>
        return this._validators;
    },
    set_validators: function (value) {
        /// <param name="value" type="Array"/>
        this._validators = value;
    },

    get_valueType: function () {
        /// <summary>
        /// Gets the data type of the values in the column's cells.
        /// </summary>
        /// <returns type="Type"/>
        return this._valueType;
    },
    set_valueType: function (value) {
        /// <summary>
        /// Sets the data type of the values in the column's cells.
        /// </summary>
        /// <param name="value" type="Type"/>
        if (!Type.isInstanceOfType(value))
            value = Type.parse(value);

        this._valueType = value;
    },

    get_cellEvents: function () {
        return null;
    },

    //Virtual Method
    get_cellType: function () {
        return JData.Internal.EditableCell;
    },

    parseValue: function (value) {
        if (value == this.get_nullText())
            return null;
        var type = this.get_valueType();
        if (type == Number)
            return new Number(value);

        return value;
    },

    formatValue: function (value) {
        if (value == null)
            return this.get_nullText();
        return value;
    },

    displayValue: function (container, value) {

        var text;
        if (value == null) {
            text = this.get_nullText();
        }
        else {
            var col = this;
            if (col.get_dataFormatString != null && col.get_dataFormatString() != null) {
                text = col._formattedString(true, [col.get_dataFormatString(), value]);
            }
            else if (col.formatValue != null)
                text = col.formatValue(value);
            else
                text = value;
        }

        container.innerHTML = text;
    },

    _formattedString: function (useLocale, args) {
        var result = '';
        var format = args[0];

        for (var i = 0; ;) {
            var open = format.indexOf('{', i);
            var close = format.indexOf('}', i);
            if ((open < 0) && (close < 0)) {
                result += format.slice(i);
                break;
            }
            if ((close > 0) && ((close < open) || (open < 0))) {
                if (format.charAt(close + 1) !== '}') {
                    throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
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

            if (close < 0) throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);


            var brace = format.substring(i, close);
            var colonIndex = brace.indexOf(':');
            var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
            if (isNaN(argNumber)) throw Error.argument('format', Sys.Res.stringFormatInvalid);
            var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);

            var arg = args[argNumber];
            if (typeof (arg) === "undefined" || arg === null) {
                arg = '';
            }

            if (arg.toFormattedString) {
                result += arg.toFormattedString(argFormat);
            }
            else if (useLocale && arg.localeFormat) {
                result += arg.localeFormat(argFormat);
            }
            else if (arg.format) {
                result += arg.format(argFormat);
            }
            else
                result += arg.toString();

            i = close + 1;
        }

        return result;
    },

    createControl: function (container) {
        if (container == null)
            throw Error.argumentNull('container');

        var control = document.createElement('input');
        control.name = this.get_dataField();
        $(container).append(control);
        return control;
    },

    get_controlValue: function (container) {
        if (container == null)
            throw Error.argumentNull('container');

        var val = $(container).find('input').val();
        return this.parseValue(val);
    },

    set_controlValue: function (container, value) {
        if (container == null)
            throw Error.argumentNull('container');

        var val = this.formatValue(value);
        $(container).find('input').val(val);
    },

    get_dataItem: function (container) {
        var dataItem = $(container).parents('tr').first().data('dataItem');
        return dataItem;
    },

    get_fieldValue: function (container) {
        var dataItem = this.get_dataItem(container);
        if (dataItem == null)
            return null;

        return dataItem[this.get_dataField()];
    },
    //===============================================

    _CreateCell: function (cellElement) {
        var cell = JData.BoundField.callBaseMethod(this, '_CreateCell', [cellElement]);
        if (this.get_valueType() == null) {
            var value = cell.get_value();
            if (value != null) {
                var type = Object.getType(value);
                this.set_valueType(type);
            }
        }
        var style = this.get_itemStyle();
        cell.applyStyle(style);

        return cell;
    },

    _CreateHeaderCell: function (cellElement) {
        var column = this;

        var cell = $create(JData.Internal.TableCell, null, null, null, cellElement);
        var dataBoundTable = cell.get_row().get_parent();

        cell.get_containingField = function () { return column };
        if (JData.BoundField.isInstanceOfType(column) &&
                column.get_sortExpression() != null) {

            var url = document.createElement('a');
            var col = column;
            url.href = 'javascript:';
            url.style.textDecoration = 'underline';
            url.sort = column.get_sortExpression();
            url.direct = 'asc';
            /*url.className = 'ui-button ui-widget ui-button-text-icon-secondary';*/
            cell.get_element().appendChild(url);
            $('<span class="ui-button-text">').html(col.get_headerText()).appendTo(url);
            var $icon = $('<span>').appendTo(url);
            column._$icon = $icon;

            $addHandler(url, 'click', function (args) {
                var gridView = cell.get_row().get_parent();
                gridView._HandleSort(this.sort, this.direct);
                var columns = gridView.get_columns();
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i]._$icon == null)
                        continue;

                    columns[i]._$icon.removeAttr('class');
                }

                if (this.direct == 'asc') {
                    this.direct = 'desc';
                    this.title = 'Order Descending';
                    /*$icon.attr('class', 'ui-icon ui-icon-arrowthick-1-n');*/
                }
                else {
                    this.direct = 'asc';
                    this.title = 'Order Ascending';
                    /*$icon.attr('class', 'ui-icon ui-icon-arrowthick-1-s');*/
                }
            });

            $addHandler(url, 'mouseover', function () {
                var sort = this.sort = column.get_sortExpression();
                if (this.direct == 'asc') {
                    this.title = 'Order Ascending';
                }
                else {
                    this.title = 'Order Descending';
                }
            });


        }
        else {
            cell.set_text(column.get_headerText());
        }
        cell.applyStyle(column.get_headerStyle());
        return cell;
    }
};

JData.BoundField.registerClass('JData.BoundField', JData.Internal.DataControlField);

//================================= CheckBoxField ===================================

JData.CheckBoxField = function (field, headerText, itemWidth, controlWidth, trueValue, falseValue, readOnly) {
    /// <param name="field" type="String" mayBeNull="true">
    /// The name of the data field to bind to the BoundField object.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="controlWidth" type="String" mayBeNull="true">
    /// The with of any control generated by a cell that generated by a data control field.
    /// </param>
    /// <param name="trueValue" type="Object" mayBeNull="true">
    /// The underlying value corresponding to a cell value of true, which appears as an checked box.
    /// </param>
    /// <param name="falseValue" type="Object" mayBeNull="true">
    /// The underlying value corresponding to a cell value of false, which appears as an unchecked box.
    /// </param>

    JData.CheckBoxField.initializeBase(this, [field, headerText, itemWidth, controlWidth, readOnly]);

    if (trueValue == null)
        this.set_trueValue(JData.Internal.Strings.CheckBoxField.TrueValue);

    if (falseValue == null)
        this.set_falseValue(JData.Internal.Strings.CheckBoxField.FalseValue);
};

JData.CheckBoxField.prototype = {
    get_falseValue: function () {
        /// <summary>
        /// Gets the underlying value corresponding to a cell value of false, which appears as an unchecked box.
        /// </summary>
        /// <return type="Object"/>
        return this._falseValue;
    },
    set_falseValue: function (value) {
        /// <summary>
        /// Sets the underlying value corresponding to a cell value of false, which appears as an unchecked box.
        /// </summary>    
        /// <param type="Object" name="value"/>
        this._falseValue = value;
    },

    get_trueValue: function () {
        /// <summary>
        /// Gets the underlying value corresponding to a cell value of true, which appears as an checked box.
        /// </summary>
        /// <return type="Object"/>
        return this._trueValue;
    },

    set_trueValue: function (value) {
        /// <summary>
        /// Sets the underlying value corresponding to a cell value of true, which appears as an checked box.
        /// </summary>    
        /// <param type="Object" name="value"/>
        this._trueValue = value;
    },

    createControl: function (container) {
        if (container == null)
            throw Error.argumentNull('container');

        $(container).append($('<input>').attr('type', 'checkbox')
                    .val(this.get_trueValue()))
                    .attr('name', this.get_dataField());
    },

    get_controlValue: function (container) {
        if (container == null)
            throw Error.argumentNull('container');

        if ($(container).find('input[type="checkbox"]')[0].checked)
            return true;

        return false;
    },

    set_controlValue: function (container, value) {
        if (container == null)
            throw Error.argumentNull('container');

        if (value == null) {
            value = false;
        }

        if (!Boolean.isInstanceOfType(value)) {
            var msg = String.format("Value type of the CheckBoxField is '{0}', Boolean type is expected.", Object.getTypeName(value));
            throw Error.argumentType('value', Object.getType(value), Boolean, msg);
        }

        if (value == true) {
            $(container).find('input[type="checkbox"]').attr('checked', 'checked')
        }
        else {
            $(container).find('input[type="checkbox"]').removeAttr('checked');
        }
    },

    displayValue: function (container, value) {
        var text = '';
        if (value == true)
            text = this.get_trueValue();
        else
            text = this.get_falseValue();

        $(container).html(text);
    }
};

JData.CheckBoxField.registerClass('JData.CheckBoxField', JData.BoundField);


//================================= CommandCell ===================================

(function () {
    var CommandType = {
        Edit: 'Edit',
        Insert: 'Insert',
        Cancel: 'Cancel',
        Delete: 'Delete',
        Select: 'Select',
        Unselect: 'Unselect',
        New: 'New',
        Update: 'Update'
    };

    JData.Internal.CommandCell = function (element) {
        JData.Internal.CommandCell.initializeBase(this, new Array(element));
        this._buttons = new Array(7);
    };

    JData.Internal.CommandCell.prototype = {
        get_buttons: function () {
            return this._buttons;
        },

        initialize: function () {
            //==============================
            // 数字必须连续，并且按出现的位置设置值。
            var EDIT = 0;
            var UPDATE = 1;
            var NEW = 2;
            var INSERT = 3;
            var CANCEL = 4;
            var DELETE = 5;
            var SELECT = 6;
            var UNSELECT = 7;
            //==============================
            var row = this.get_row();
            var dataItem = row.get_dataItem();
            var col = this.get_containingField();
            var grid = row.get_parent();
            var state = row.get_rowState();
            var rowType = row.get_rowType();
            var dataSource = grid.get_dataSource();
            var cell = this;

            var editButton;
            var buttons = this.get_buttons();

            if (col.get_showEditButton() == true) {
                buttons[EDIT] = col._CreateButton(CommandType.Edit);
                if (!dataSource.canUpdate(dataItem)) {
                    col._DisableButton(buttons[EDIT]);
                    if (row.get_currentMode() == JData.DataFieldMode.ReadOnly)
                        JData.tooltip(buttons[EDIT], JData.Internal.Messages.CanNotEditDataItem);
                    else
                        JData.tooltip(buttons[EDIT], JData.Internal.Messages.CanNotUpdateDataItem);
                }
                //buttons[EDIT].innerHTML = col.get_editText();
                var gridView = row.get_parent();

                buttons[EDIT].onclick = function () {
                    gridView._HandleEdit(row);
                };

                buttons[UPDATE] = col._CreateButton(CommandType.Update);
                buttons[UPDATE].onclick = function () {
                    gridView._HandleUpdate(row);
                };

                col._HideButton(buttons[UPDATE]);
            }

            if (col.get_showInsertButton()) {
                //INSERT Button
                buttons[INSERT] = col._CreateButton(CommandType.Insert);
                if (!dataSource.canInsert(dataItem)) {
                    col._DisableButton(buttons[INSERT])
                    if (row.get_currentMode() == JData.DataFieldMode.ReadOnly)
                        JData.tooltip(buttons[INSERT], JData.Internal.Messages.CanNotCreateDataItem);
                    else
                        JData.tooltip(buttons[INSERT], JData.Internal.Messages.CanNotInsertDataItem);
                }
                buttons[INSERT].onclick = function (args) {
                    grid._HandleInsert(row);
                };

                buttons[NEW] = col._CreateButton(CommandType.New);
                buttons[NEW].onclick = function () {
                    grid._HandleNew(row);
                };

                if (row.get_currentMode() == 'insert' || row.get_currentMode() == JData.DataFieldMode.Insert) {
                    col._HideButton(buttons[NEW]);
                }
                else {
                    col._HideButton(buttons[INSERT]);
                }
            }

            if (col.get_showCancelButton()) {
                buttons[CANCEL] = col._CreateButton(CommandType.Cancel);
                buttons[CANCEL].onclick = function () {
                    grid._HandleCancel(row);
                };
            }

            if (col.get_showDeleteButton()) {
                buttons[DELETE] = col._CreateButton(CommandType.Delete);
                if (!dataSource.canDelete(buttons[DELETE])) {
                    col._DisableButton(buttons[DELETE]);
                    JData.tooltip(buttons[DELETE], JData.Internal.Messages.CanNotDeleteDataItem);
                }
                if (buttons[DELETE].onclick == null)
                    buttons[DELETE].onclick = function () {
                        grid._HandleDelete(row);
                    };
            }

            if (Object.getType(grid) == JData.GridView) {
                if (col.get_showSelectButton()) {
                    buttons[SELECT] = col._CreateButton(CommandType.Select);
                    buttons[UNSELECT] = col._CreateButton(CommandType.Unselect);
                    Sys.UI.DomElement.setVisible(buttons[UNSELECT], false);

                    buttons[SELECT].onclick = function () {
                        grid._HandleSelect(row);
                    }
                    buttons[UNSELECT].onclick = function () {
                        grid._HandleUnselect(row);
                    }

                    if (JData.GridView.isInstanceOfType(grid)) {
                        grid.add_rowSelected(function (sender, args) {
                            if (args.row == cell.get_row()) {
                                if (buttons[INSERT] != null) Sys.UI.DomElement.setVisible(buttons[NEW], false);
                                if (buttons[EDIT] != null) Sys.UI.DomElement.setVisible(buttons[EDIT], false);
                                if (buttons[DELETE] != null) Sys.UI.DomElement.setVisible(buttons[DELETE], false);
                                if (buttons[SELECT] != null) Sys.UI.DomElement.setVisible(buttons[SELECT], false);
                                if (buttons[UNSELECT] != null) Sys.UI.DomElement.setVisible(buttons[UNSELECT], true);
                            }

                        });
                        grid.add_rowUnselected(function (sender, args) {
                            if (args.row == cell.get_row()) {
                                if (buttons[INSERT] != null) Sys.UI.DomElement.setVisible(buttons[NEW], true);
                                if (buttons[EDIT] != null) Sys.UI.DomElement.setVisible(buttons[EDIT], true);
                                if (buttons[DELETE] != null) Sys.UI.DomElement.setVisible(buttons[DELETE], true);
                                if (buttons[SELECT] != null) Sys.UI.DomElement.setVisible(buttons[SELECT], true);
                                if (buttons[UNSELECT] != null) Sys.UI.DomElement.setVisible(buttons[UNSELECT], false);
                            }
                        });
                    }
                }
            }

            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i] == null)
                    continue;

                var element = buttons[i];
                buttons[i].style.marginLeft = '4px';
                this.get_element().appendChild(buttons[i]);
            }

            if (buttons[CANCEL] != null)
                col._HideButton(buttons[CANCEL]);

            if (buttons[DELETE] != null && row.get_rowType() == JData.DataControlRowType.EmptyDataRow)
                col._HideButton(buttons[DELETE]);

            row.add_modeChanged(function (sender, args) {
                Sys.Debug.assert(args.mode != null);
                if (args.mode == 'insert' || args.mode == JData.DataFieldMode.Insert) {
                    if (buttons[EDIT] != null)
                        col._HideButton(buttons[EDIT]);

                    if (buttons[DELETE] != null)
                        col._HideButton(buttons[DELETE]);

                    if (buttons[SELECT] != null)
                        col._HideButton(buttons[SELECT]);

                    if (buttons[NEW] != null)
                        col._HideButton(buttons[NEW]);

                    if (buttons[INSERT] != null)
                        col._ShowButton(buttons[INSERT]);

                    if (buttons[CANCEL] != null)
                        col._ShowButton(buttons[CANCEL]);
                }
                else if (args.mode == 'readOnly' || args.mode == JData.DataFieldMode.ReadOnly) {
                    if (buttons[EDIT] != null) {
                        col._ShowButton(buttons[EDIT]);
                    }
                    if (buttons[UPDATE] != null) {
                        col._HideButton(buttons[UPDATE]);
                    }
                    if (buttons[CANCEL] != null) {
                        col._HideButton(buttons[CANCEL]);
                    }
                    if (buttons[DELETE] != null) {
                        col._ShowButton(buttons[DELETE]);
                    }
                    if (buttons[NEW] != null) {
                        col._ShowButton(buttons[NEW]);
                    }
                    if (buttons[INSERT] != null) {
                        col._HideButton(buttons[INSERT]);
                    }
                    if (buttons[SELECT] != null) {
                        col._ShowButton(buttons[SELECT]);
                    }
                }
                else if (args.mode == 'edit' || args.mode == JData.DataFieldMode.Edit) {
                    if (buttons[EDIT] != null) {
                        col._HideButton(buttons[EDIT]);
                    }
                    if (buttons[UPDATE] != null) {
                        col._ShowButton(buttons[UPDATE]);
                    }
                    if (buttons[CANCEL] != null)
                        col._ShowButton(buttons[CANCEL]);

                    if (buttons[DELETE] != null)
                        col._HideButton(buttons[DELETE]);

                    if (buttons[INSERT] != null)
                        col._HideButton(buttons[INSERT]);

                    if (buttons[NEW] != null)
                        col._HideButton(buttons[NEW]);

                    if (buttons[SELECT] != null)
                        col._HideButton(buttons[SELECT]);
                }
            });
        }
    };

    JData.Internal.CommandCell.registerClass('JData.Internal.CommandCell', JData.Internal.DataControlFieldCell);

    //================================= CommandField ===================================

    JData.CommandField = function (headerText, itemWidth, showCancelButton, showDeleteButton, showEditButton, showInsertButton, showSelectButton) {
        /// <param name="headerText" type="String" mayBeNull="true">
        /// The text that is displayed in the header item of a data control field
        /// </param>
        /// <param name="itemWidth" type="String" mayBeNull="true">
        /// The with of any cell generated by a data control field.
        /// </param>

        JData.CommandField.initializeBase(this);

        this.set_editText(JData.Internal.Strings.Edit);
        this.set_deleteText(JData.Internal.Strings.Delete);
        this.set_updateText(JData.Internal.Strings.Update);
        this.set_cancelText(JData.Internal.Strings.Cancel);
        this.set_newText(JData.Internal.Strings.New);
        this.set_insertText(JData.Internal.Strings.Insert);
        this.set_selectText(JData.Internal.Strings.Select);
        this.set_unselectText(JData.Internal.Strings.UnSelect);


        if (showCancelButton == null) showCancelButton = false;
        if (showDeleteButton == null) showDeleteButton = false;
        if (showEditButton == null) showEditButton = false;
        if (showInsertButton == null) showInsertButton = false;
        if (showSelectButton == null) showSelectButton = false;

        this.set_showCancelButton(showCancelButton);
        this.set_showDeleteButton(showDeleteButton);
        this.set_showEditButton(showEditButton);
        this.set_showInsertButton(showInsertButton);
        this.set_showSelectButton(showSelectButton);

        if (headerText != null) this.set_headerText(headerText);
        if (itemWidth != null) this.get_itemStyle().set_width(itemWidth);

        //this.set_cancelButtonClass(JData.ControlIcons.cancelIcon);
        //this.set_deleteButtonClass(JData.ControlIcons.deleteIcon);
        //this.set_editButtonClass(JData.ControlIcons.editIcon);
        //this.set_insertButtonClass(JData.ControlIcons.insertIcon);
        //this.set_newButtonClass(JData.ControlIcons.newIcon);
        //this.set_selectButtonClass(JData.ControlIcons.selectIcon);
        //this.set_unselectButtonClass(JData.ControlIcons.unselectIcon);
        //this.set_updateButtonClass(JData.ControlIcons.updateIcon);

        this.set_buttonType(JData.ButtonType.Link);
    };

    JData.CommandField.prototype = {

        get_showCancelButton: function () {
            /// <summary>
            /// Gets a value indicating whether a Cancel button is displayed in a CommandField field.
            /// </summary>
            /// <return type="Boolean"/>
            return this._showCancelButton;
        },
        set_showCancelButton: function (value) {
            /// <summary>
            /// Sets a value indicating whether a Cancel button is displayed in a CommandField field.
            /// </summary>
            /// <param name="value" type="Boolean"/>
            if (value == null)
                throw Error.argumentNull('value');

            if (!Boolean.isInstanceOfType(value))
                value = Boolean.parse(value);

            this._showCancelButton = value;
        },

        get_showDeleteButton: function () {
            /// <summary>
            /// Gets a value indicating whether a Delete button is displayed in a CommandField field.
            /// </summary>
            /// <return type="Boolean"/>
            return this._showDeleteButton;
        },
        set_showDeleteButton: function (value) {
            /// <summary>
            /// Sets a value indicating whether a Delete button is displayed in a CommandField field.
            /// </summary>
            /// <param name="value" type="Boolean"/>
            if (value == null)
                throw Error.argumentNull('value');

            if (!Boolean.isInstanceOfType(value))
                value = Boolean.parse(value);

            this._showDeleteButton = value;
        },

        get_showEditButton: function () {
            /// <summary>
            /// Gets a value indicating whether a Edit button is displayed in a CommandField field.
            /// </summary>
            /// <return type="Boolean"/>
            return this._showEditButton;
        },
        set_showEditButton: function (value) {
            /// <summary>
            /// Sets a value indicating whether a Edit button is displayed in a CommandField field.
            /// </summary>
            /// <param name="value" type="Boolean"/>
            if (value == null)
                throw Error.argumentNull('value');

            if (!Boolean.isInstanceOfType(value))
                value = Boolean.parse(value);

            this._showEditButton = value;
        },

        get_showInsertButton: function () {
            /// <summary>
            /// Gets a value indicating whether a New button is displayed in a CommandField field.
            /// </summary>
            /// <returns type="Boolean"/>
            return this._showInsertButton;
        },
        set_showInsertButton: function (value) {
            /// <summary>
            /// Sets a value indicating whether a New button is displayed in a CommandField field.
            /// </summary>
            /// <param name="value" type="Boolean"/>
            if (value == null)
                throw Error.argumentNull('value');

            if (!Boolean.isInstanceOfType(value))
                value = Boolean.parse(value);

            this._showInsertButton = value;
        },

        get_showSelectButton: function () {
            /// <summary>
            /// Gets a value indicating whether a Select button is displayed in a CommandField field.
            /// </summary>
            /// <returns type="Boolean"/>
            return this._showSelectButton;
        },
        set_showSelectButton: function (value) {
            /// <summary>
            /// Sets a value indicating whether a Select button is displayed in a CommandField field.
            /// </summary>
            /// <param name="value" type="Boolean"/>
            if (value == null)
                throw Error.argumentNull('value');

            if (!Boolean.isInstanceOfType(value))
                value = Boolean.parse(value);

            this._showSelectButton = value;
        },

        get_cancelText: function () {
            return this._cancelText;
        },
        set_cancelText: function (value) {
            this._cancelText = value;
        },

        get_cancelButtonClass: function () {
            return this._cancelButtonClass;
        },
        set_cancelButtonClass: function (value) {
            this._cancelButtonClass = value;
        },

        get_deleteText: function () {
            return this._deleteText;
        },
        set_deleteText: function (value) {
            this._deleteText = value;
        },

        get_deleteButtonClass: function () {
            return this._deleteIconClass;
        },
        set_deleteButtonClass: function (value) {
            this._deleteIconClass = value;
        },

        get_editText: function () {
            return this._editText;
        },
        set_editText: function (value) {
            this._editText = value;
        },

        get_editButtonClass: function () {
            return this._editIconClass;
        },
        set_editButtonClass: function (value) {
            this._editIconClass = value;
        },

        get_updateText: function () {
            return this._updateText;
        },
        set_updateText: function (value) {
            this._updateText = value;
        },

        get_updateButtonClass: function () {
            return this._updateIconClass;
        },
        set_updateButtonClass: function (value) {
            this._updateIconClass = value;
        },

        get_insertText: function () {
            return this._insertText;
        },
        set_insertText: function (value) {
            this._insertText = value;
        },

        get_insertButtonClass: function () {
            return this._insertIconClass;
        },
        set_insertButtonClass: function (value) {
            this._insertIconClass = value;
        },

        get_newText: function () {
            return this._newText;
        },
        set_newText: function (value) {
            this._newText = value;
        },

        get_newButtonClass: function () {
            return this._newIconClass;
        },
        set_newButtonClass: function (value) {
            this._newIconClass = value;
        },

        get_selectText: function () {
            return this._selectText;
        },
        set_selectText: function (value) {
            this._selectText = value;
        },

        get_selectButtonClass: function () {
            return this._selectIconClass;
        },
        set_selectButtonClass: function (value) {
            this._selectIconClass = value;
        },

        get_unselectText: function () {
            return this._unselectText;
        },
        set_unselectText: function (value) {
            this._unselectText = value;
        },

        get_unselectButtonClass: function () {
            return this._unselectIconClass;
        },
        set_unselectButtonClass: function (value) {
            this._unselectIconClass = value;
        },

        get_cellType: function () {
            return JData.Internal.CommandCell;
        },

        get_cellEvents: function () {
            return null;
        },

        _CreateButton: function (commandType) {
            switch (this.get_buttonType()) {
                case JData.ButtonType.Icon:
                    return this._createIconButton(commandType);
                case JData.ButtonType.Link:
                    return this._createLinkButton(commandType);
                case JData.ButtonType.Image:
                    return this._createImageButton(commandType);
                case JData.ButtonType.Button:
                    return this._createTextButton(commandType);
            }

        },

        _createIconButton: function (commandType) {
            var button = document.createElement('a');
            button.href = 'JavaScript:';
            button.style.cssFloat = 'left';

            var span = document.createElement('span');
            button.appendChild(span);

            if (commandType == CommandType.Cancel) {
                span.className = this.get_cancelButtonClass();
            }
            else if (commandType == CommandType.Delete) {
                span.className = this.get_deleteButtonClass();
            }
            else if (commandType == CommandType.Edit) {
                span.className = this.get_editButtonClass();
            }
            else if (commandType == CommandType.Insert) {
                span.className = this.get_insertButtonClass();
            }
            else if (commandType == CommandType.New) {
                span.className = this.get_newButtonClass();
            }
            else if (commandType == CommandType.Select) {
                span.className = this.get_selectButtonClass();
            }
            else if (commandType == CommandType.Unselect) {
                span.className = this.get_unselectButtonClass();
            }
            else if (commandType == CommandType.Update) {
                span.className = this.get_updateButtonClass();
            }
            else {
                span.className = 'UNKNOWN';
            }
            return button;
        },

        _createTextButton: function (commandType) {
            var button = document.createElement('button');
            if (commandType == CommandType.Cancel) {
                button.innerHTML = this.get_cancelText();
                if (this.get_cancelButtonClass() != null)
                    button.className = this.get_cancelButtonClass();
            }
            else if (commandType == CommandType.Delete) {
                button.innerHTML = this.get_deleteText();
                if (this.get_deleteButtonClass() != null)
                    button.className = this.get_deleteButtonClass();
            }
            else if (commandType == CommandType.Edit) {
                button.innerHTML = this.get_editText();
                if (this.get_editButtonClass() != null)
                    button.className = this.get_editButtonClass();
            }
            else if (commandType == CommandType.Insert) {
                button.innerHTML = this.get_insertText();
                if (this.get_insertButtonClass() != null)
                    button.className = this.get_insertButtonClass();
            }
            else if (commandType == CommandType.Select) {
                button.innerHTML = this.get_selectText();
                if (this.get_selectButtonClass() != null)
                    button.className = this.get_selectButtonClass();
            }
            else if (commandType == CommandType.Unselect) {
                button.innerHTML = this.get_unselectText();
                if (this.get_unselectButtonClass() != null)
                    button.className = this.get_unselectButtonClass();
            }
            else if (commandType == CommandType.New) {
                button.innerHTML = this.get_newText();
                if (this.get_newButtonClass())
                    button.className = this.get_newButtonClass();
            }
            else if (commandType == CommandType.Update) {
                button.innerHTML = this.get_updateText();
                if (this.get_updateButtonClass() != null)
                    button.className = this.get_updateButtonClass();
            }
            else {
                button.innerHTML = 'UNKNOWN';
            }
            return button;
        },

        _createLinkButton: function (commandType) {
            var button = document.createElement('a');
            button.href = 'JavaScript:';
            if (commandType == CommandType.Cancel) {
                button.innerHTML = this.get_cancelText();
            }
            else if (commandType == CommandType.Delete) {
                button.innerHTML = this.get_deleteText();
            }
            else if (commandType == CommandType.Edit) {
                button.innerHTML = this.get_editText();
            }
            else if (commandType == CommandType.Insert) {
                button.innerHTML = this.get_insertText();
            }
            else if (commandType == CommandType.Select) {
                button.innerHTML = this.get_selectText();
            }
            else if (commandType == CommandType.Unselect) {
                button.innerHTML = this.get_unselectText();
            }
            else if (commandType == CommandType.New) {
                button.innerHTML = this.get_newText();
            }
            else if (commandType == CommandType.Update) {
                button.innerHTML = this.get_updateText();
            }
            else {
                button.innerHTML = 'UNKNOWN';
            }
            return button;
        },

        _createImageButton: function (commandType) {
            var button = document.createElement('a');
            button.href = 'JavaScript:';
            if (commandType == CommandType.Cancel) {
                button.innerHTML = this.get_cancelText();
            }
            else if (commandType == CommandType.Delete) {
                button.innerHTML = this.get_deleteText();
            }
            else if (commandType == CommandType.Edit) {
                button.innerHTML = this.get_editText();
            }
            else if (commandType == CommandType.Insert) {
                button.innerHTML = this.get_insertText();
            }
            else if (commandType == CommandType.Select) {
                button.innerHTML = this.get_selectText();
            }
            else if (commandType == CommandType.Unselect) {
                button.innerHTML = this.get_unselectText();
            }
            else if (commandType == CommandType.New) {
                button.innerHTML = this.get_newText();
            }
            else if (commandType == CommandType.Update) {
                button.innerHTML = this.get_updateText();
            }
            else {
                button.innerHTML = 'UNKNOWN';
            }
            return button;
        },

        _ShowButton: function (button) {
            //$(button).show();
            //Sys.UI.DomElement.setVisibilityMode(button, Sys.UI.VisibilityMode.collapse);
            //Sys.UI.DomElement.setVisible(button, true);
            $(button).css('display', 'inline');
        },

        _HideButton: function (button) {
            //$(button).hide();
            //Sys.UI.DomElement.setVisibilityMode(button, Sys.UI.VisibilityMode.collapse);
            //Sys.UI.DomElement.setVisible(button, false);
            $(button).css('display', 'none');
        },

        _DisableButton: function (button) {
            button.disabled = true;
        },

        get_buttonType: function () {
            /// <summary>
            /// Gets the button type of the data field.
            /// </summary>
            /// <returns type="JData.ButtonType"/>
            return this._buttonType;
        },
        set_buttonType: function (value) {
            /// <param name="value" type="JData.ButtonType">
            /// Sets the button type of the data field.
            /// </param>
            this._buttonType = value;
        }
    };

    JData.CommandField.registerClass('JData.CommandField', JData.Internal.DataControlField);

})();

//================================= DropDownListField =================================

JData.DropDownListField = function (field, headerText, itemWidth, controlWidth, readOnly, dataSource, displayMember, valueMember) {
    /// <param name="field" type="String" mayBeNull="true">
    /// The name of the data field to bind to the BoundField object.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="controlWidth" type="String" mayBeNull="true">
    /// The with of any control generated by a cell that generated by a data control field.
    /// </param>
    /// <param name="readOnly" type="Boolean" mayBeNull="true"/>

    JData.DropDownListField.initializeBase(this, [field, headerText, itemWidth, controlWidth, readOnly]);
    this.set_dataSource(dataSource);
    this.set_displayMember(displayMember);
    this.set_valueMember(valueMember);
};

JData.DropDownListField.prototype = {

    get_dataSource: function () {
        /// <summary>
        /// An object that represents a data source. The default is null.
        /// </summary>
        /// <returns type="JData.DataSource" mayBeNull="true"/>
        this._dataItems = null;
        return this._dataSource;
    },

    set_dataSource: function (value) {
        /// <summary>
        /// Sets the data source that populates the selections for the combo boxes.
        /// </summary>
        /// <param name="value" type="JData.DataSource"/>
        this._dataSource = value;
    },

    get_displayMember: function () {
        /// <summary>
        /// Gets a string that specifies the property or column from which to retrieve strings for display in the combo boxes.
        /// </summary>
        /// <returns type="String"/>
        return this._displayMember;
    },
    set_displayMember: function (value) {
        /// <summary>
        /// Sets a string that specifies the property or column from which to retrieve strings for display in the combo boxes.
        /// </summary>
        /// <param name="value" type="String"/>
        this._displayMember = value;
    },

    get_valueMember: function () {
        return this._valueMember;
    },
    set_valueMember: function (value) {
        this._valueMember = value;
    },

    _GetDataItems: function (cell, successedCallback, failedCallback) {
        var dataSource = this.get_dataSource();
        if (dataSource == null)
            throw Error.argumentNull('dataSource');

        var items;
        if (Array.isInstanceOfType(dataSource))
            successedCallback(items); //items = dataSource;
        else {
            var args = new JData.DataSourceSelectArguments();
            dataSource.select(args, successedCallback, failedCallback);
        }
    },

    createControl: function (container) {
        /// <param name="container" Type="DomElement">
        /// Option. The parent element of the control to be created. If null, the parnet element is this cell DOM element.
        /// </param>

        var dataItem = this.get_dataItem(container);

        var control = document.createElement('select');
        control.name = this.get_dataField();
        var self = this;
        self._GetDataItems(null, function (items) {
            for (var i = 0; i < items.length; i++) {
                var option = document.createElement('option');
                option.value = items[i] == null ? 'null' : items[i][self.get_valueMember()];
                option.innerHTML = items[i] == null ? 'null' : items[i][self.get_displayMember()];
                var value = dataItem[self.get_dataField()];

                if (items[i][self.get_valueMember()] == value)
                    option.selected = true;

                //option.innerHTML = cell._getDisplay(items[i]);
                control.appendChild(option);
            }
        });
        $(container).append(control);
        return control;
    },

    get_controlValue: function (container) {
        if (container == null)
            throw Error.argumentNull('container');

        var val = $(container).find('select').val();
        return this.parseValue(val);
    },

    set_controlValue: function (container, value) {
        if (container == null)
            throw Error.argumentNull('container');

        var val = this.formatValue(value);
        $(container).find('select').val(val);
    },

    displayValue: function (container) {
        var dataItem = this.get_dataItem(container);
        var value = dataItem[this.get_dataField()];
        var self = this;
        this._GetDataItems(null, function (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item != null) {
                    if (value == item[self.get_valueMember()]) {
                        value = item[self.get_displayMember()];
                        break;
                    }
                }
            }
            if (value == null)
                value = self.get_nullText();

            //If the control is edit, do not show the text.
            var isEdit = $(container).find('select').size() > 0;
            if (!isEdit)
                container.innerHTML = value;
        });
    }
};

JData.DropDownListField.registerClass('JData.DropDownListField', JData.BoundField);




Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

//=========================== TableRow ===========================

JData.Internal.TableRow = function (element) {
    JData.Internal.TableRow.initializeBase(this, new Array(element));
    this._set_rowState(JData.DataControlRowState.Normal);
    this._cells = new Array();
};

JData.Internal.TableRow.prototype = {

    get_rowState: function () {
        ///	<returns type="JData.DataControlRowState" />
        return this._rowState;
    },
    _set_rowState: function (value) {
        this._rowState = value;
    },

    get_rowType: function () {
        ///	<returns type="JData.DataControlRowType" />
        return this._rowType;
    },
    set_rowType: function (value) {
        /// <param name="value" type="JData.DataControlRowType"/>
        this._rowType = value;
    },

    get_cells: function () {
        return this._cells;
    },

    createCell: function () {
        var rowElement = this.get_element();
        var cellElement = rowElement.insertCell(rowElement.cells.length);
        var cell = $create(JData.Internal.TableCell, null, null, null, cellElement);
        Array.add(this.get_cells(), cell);
        return cell;
    },

    dispose: function () {
        for (var i = 0; i < this.get_cells().length; i++) {
            this.get_cells()[i].dispose();
        }
        JData.Internal.TableRow.callBaseMethod(this, 'dispose');
    }
};

JData.Internal.TableRow.registerClass('JData.Internal.TableRow', JData.Internal.WebControl);





(function () {

    var PagingBar = function () {
    };

    PagingBar.prototype = {

        init: function (dataSource) {
            /// <param name="dataSource" type="JData.DataSource"/>
            if (dataSource == null)
                throw Error.argumentNull('dataSource');

            this._pageIndex = 0;
            this._dataSource = dataSource;

            var pagingBar = this;
            //var dataSource = this.dataSource;
            pagingBar.totalRowCount = 1000000;
            dataSource.add_selected(function (source, args) {
                /// <param name="source" type="JData.DataSource"/>

                pagingBar.set_pageSize(args.selectArguments.get_maximumRows());

                var totalRowCount = args.selectArguments.get_totalRowCount();
                if (totalRowCount != null && totalRowCount >= 0) {
                    pagingBar.totalRowCount = totalRowCount;
                }

                var startRowIndex = args.selectArguments.get_startRowIndex();
                if (startRowIndex <= 0)
                    startRowIndex = 0;

                pagingBar._pageIndex = Math.floor(startRowIndex / pagingBar.get_pageSize());

                pagingBar.render();
            })
            dataSource.add_deleted(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount - 1;
                pagingBar.render();
            })
            dataSource.add_inserted(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount + 1;
                pagingBar.render();
            })
        },
        get_pageCount: function () {
            var pageCount = Math.ceil(this.totalRowCount / this.get_pageSize());

            return pageCount;
        },
        get_pageSize: function () {
            return this._pageSize;
        },
        set_pageSize: function (value) {
            this._pageSize = value;
        },
        get_pageIndex: function () {
            return this._pageIndex;
        },
        set_pageIndex: function (value) {
            this._pageIndex = value;
        },
        // Virtual Method
        render: function () {
            throw Error.notImplemented('The table-row render method is not implemented.');
        }
    }

    //=====================================================================
    var NumberPagingBar = function (dataSource, pagerSettings, element, selectArgument) {
        Sys.Debug.assert(arguments.length == 4);
        Sys.Debug.assert(element.tagName != undefined);

        this.dataSource = dataSource;
        this.pagerSettings = pagerSettings;
        this.element = element;
        this._buttons = new Array();
        this._selectArgument = selectArgument;

        this.init(dataSource);
    };

    NumberPagingBar.prototype = $.extend(PagingBar.prototype, {
        _init: PagingBar.prototype.init,
        init: function (dataSource) {
            this._init(dataSource);

            var pagingBar = this;
            pagingBar.dataSource.add_selected(function (sender, args) {
                if (args.selectArguments.get_totalRowCount() != null)
                    $(pagingBar.totalElement).text(args.selectArguments.get_totalRowCount());
            });
        },
        selectArgument: function () {
            if (!this._selectArgument)
                this._selectArgument = new JData.DataSourceSelectArguments();

            return this._selectArgument;
        },
        render: function () {
            var pagerSettings = this.pagerSettings;
            var pagingBar = this;
            pagingBar.cell = this.element;

            var buttonCount = pagerSettings.get_pageButtonCount();
            var FIRST_BUTTON = 0
            var PREVIOUS_PAGING_BUTTON = 1;
            var NEXT_PAGING_BUTTON = pagerSettings.get_pageButtonCount() + 2;
            var LAST_BUTTON = pagerSettings.get_pageButtonCount() + 3
            var OTHER_BUTTONS_COUNT = 4;


            var createButtons;
            var handlePage = function (args) {
                var buttonIndex = Array.indexOf(pagingBar._buttons, this);

                var index;
                var args = pagingBar.selectArgument();
                args.set_maximumRows(pagingBar.get_pageSize());
                args.set_startRowIndex(this.pageIndex * pagingBar.get_pageSize());
                if (pagingBar.sortExpression) {
                    args.set_sortExpression(pagingBar.sortExpression);
                }
                pagingBar.dataSource.select(args);

            };
            for (var i = 0; i < buttonCount + OTHER_BUTTONS_COUNT; i++) {
                if (pagingBar._buttons[i] != null) {
                    pagingBar.cell.removeChild(pagingBar._buttons[i]);
                }
                var url = document.createElement('a');
                pagingBar.cell.appendChild(url);
                pagingBar._buttons[i] = url;
                url.style.paddingLeft = '4px';
                url.href = 'javascript:';
                url.pageIndex = i;
                Sys.UI.DomEvent.addHandler(url, 'click', handlePage);
            }

            if (pagingBar.totalElement == null) {
                pagingBar.totalElement = document.createElement('span');
                $('<div style="float:right;margin-right:4px;">').text('总记录：').append(pagingBar.totalElement).appendTo(pagingBar.cell);
            }
            //if (this.totalRowCount != null)
            //    $(pagingBar.totalElement).text(this.totalRowCount);

            var pagingBarIndex = Math.floor(pagingBar.get_pageIndex() / buttonCount);
            for (var i = 0; i < buttonCount + OTHER_BUTTONS_COUNT; i++) {
                var pageCount = pagingBar.get_pageCount();
                var start = pagingBarIndex * buttonCount;
                var index;
                var url = pagingBar._buttons[i];
                if (i == PREVIOUS_PAGING_BUTTON) {
                    url.innerHTML = '...';
                    url.pageIndex = (pagingBarIndex - 1) * buttonCount;
                }
                else if (i == NEXT_PAGING_BUTTON) {
                    url.innerHTML = '...';
                    url.pageIndex = (pagingBarIndex + 1) * buttonCount;
                }
                else if (i == FIRST_BUTTON) {
                    url.innerHTML = pagerSettings.get_firstPageText();
                    url.pageIndex = 0;
                }
                else if (i == LAST_BUTTON) {
                    url.innerHTML = pagerSettings.get_lastPageText();
                    url.pageIndex = pageCount - 1;
                }
                else {
                    url.innerHTML = start + i - PREVIOUS_PAGING_BUTTON;
                    url.pageIndex = start + i - PREVIOUS_PAGING_BUTTON - 1;
                    if (url.pageIndex == this.get_pageIndex())
                        url.style.color = 'red';
                }
                Sys.UI.DomElement.setVisible(url, true);

                if (pageCount != null && url.pageIndex > pageCount - 1)
                    Sys.UI.DomElement.setVisible(url, false);
            }

            if (pagingBarIndex > 0 && pagerSettings.get_mode() == JData.PagerButtons.NumericFirstLast)
                Sys.UI.DomElement.setVisible(pagingBar._buttons[FIRST_BUTTON], true);
            else
                Sys.UI.DomElement.setVisible(pagingBar._buttons[FIRST_BUTTON], false);

            if (pageCount > 0 && pagingBar.get_pageIndex() < pageCount - 1 && pagerSettings.get_mode() == JData.PagerButtons.NumericFirstLast)
                Sys.UI.DomElement.setVisible(pagingBar._buttons[LAST_BUTTON], true);
            else
                Sys.UI.DomElement.setVisible(pagingBar._buttons[LAST_BUTTON], false);

            if (pagingBarIndex == 0)
                Sys.UI.DomElement.setVisible(pagingBar._buttons[PREVIOUS_PAGING_BUTTON], false);

            //$('<span>').html('总记录：'+).appendTo(pagingBar.cell);
        }
    });

    //=========================== TextPagingBar ===========================

    JData.Internal.TextPagingBar = function (element) {
        /// <field name="gridView" type="JData.GridView"/>
        JData.Internal.TextPagingBar.initializeBase(this, [element]);
    };

    JData.Internal.TextPagingBar.prototype = {
        handlePage: function (args) {
            var gridView = this.gridView;
            var pageIndex = gridView.get_pageIndex();
            var cell = this.parentCell;
            Sys.Debug.assert(pageIndex >= 0);

            if (this == cell.firstButton) {
                pageIndex = 0;
            }
            else if (this == cell.previousButton) {
                pageIndex = pageIndex - 1;
            }
            else if (this == cell.nextButton) {
                pageIndex = pageIndex + 1;
            }
            else if (this == cell.lastButton) {
                pageIndex = gridView.get_pageCount() - 1;
            }
            gridView._HandlePage(pageIndex);
        },

        createButton: function (text) {
            var button = document.createElement('a');
            button.innerHTML = text;
            button.style.paddingLeft = '4px';
            button.href = 'javascript:';
            Sys.UI.DomEvent.addHandler(button, 'click', this.handlePage);
            this.cell.get_element().appendChild(button);
            button.gridView = this.gridView;
            button.parentCell = this;
            return button;
        },

        initialize: function () {
            Sys.Debug.assert(this.get_parent() != null);
            var pagingBar = this;
            this.gridView = this.get_parent();
            this.cell = this.createCell();

            var pagerSettings = this.gridView.get_pagerSettings();
            var buttonCount = pagerSettings.get_pageButtonCount();
            this.cell.get_element().colSpan = '300';

            this.firstButton = this.createButton(pagerSettings.get_firstPageText());
            this.previousButton = this.createButton(pagerSettings.get_previousPageText());
            this.nextButton = this.createButton(pagerSettings.get_nextPageText());
            this.lastButton = this.createButton(pagerSettings.get_lastPageText());

            var method = function (sender, args) {
                var pageCount = pagingBar.gridView.get_pageCount();
                var pageIndex = sender.get_pageIndex();
                if (pageIndex > 0) {
                    Sys.UI.DomElement.setVisible(pagingBar.firstButton, true);
                    Sys.UI.DomElement.setVisible(pagingBar.previousButton, true);
                }
                else {
                    Sys.UI.DomElement.setVisible(pagingBar.firstButton, false);
                    Sys.UI.DomElement.setVisible(pagingBar.previousButton, false);
                }

                if (pageCount != null) {
                    if (pageIndex < pagingBar.gridView.get_pageCount() - 1) {
                        Sys.UI.DomElement.setVisible(pagingBar.nextButton, true);
                        Sys.UI.DomElement.setVisible(pagingBar.lastButton, true);
                    }
                    else {
                        Sys.UI.DomElement.setVisible(pagingBar.nextButton, false);
                        Sys.UI.DomElement.setVisible(pagingBar.lastButton, false);
                    }
                }
                else {
                    if (pagingBar.gridView.get_rows().length < pagingBar.gridView.get_pgeSize())
                        Sys.UI.DomElement.setVisible(pagingBar.nextButton, false);
                    else
                        Sys.UI.DomElement.setVisible(pagingBar.nextButton, true);

                    Sys.UI.DomElement.setVisible(pagingBar.lastButton, false);
                }

                if (pagingBar.gridView.get_pagerSettings().get_mode() == JData.PagerButtons.NextPrevious) {
                    Sys.UI.DomElement.setVisible(pagingBar.firstButton, false);
                    Sys.UI.DomElement.setVisible(pagingBar.lastButton, false);
                }
            };
            this.gridView.add_pageIndexChanged(method);
        }
    };

    JData.Internal.TextPagingBar.registerClass('JData.Internal.TextPagingBar', JData.Internal.TableRow);

    //=========================== NumberPagingBar ===========================

    JData.Internal.CreateNumberPagingBar = function (element, dataSource, pagerSettings) {
        return new NumberPagingBar(dataSource, pagerSettings, element);
    }

    JData.Internal.NumberPagingBar = function (element) {
        JData.Internal.NumberPagingBar.initializeBase(this, [element]);
    };

    JData.Internal.NumberPagingBar.prototype = {
        initialize: function () {
            Sys.Debug.assert(this.get_parent() != null);
            this._buttons = new Array();
            var pagingBar = this;
            var pagingBarIndex = 0;
            this.gridView = this.get_parent();


            this.cell = this.createCell();
            var colSpan = this.get_parent()._MaxColSpan();
            Sys.Debug.assert(colSpan > 0)
            this.cell.get_element().colSpan = colSpan;

            var pagerSettings = this.gridView.get_pagerSettings();
            var selectArgument = this.gridView._getSelectArgument();
            var pagingBar = new NumberPagingBar(this.gridView.get_dataSource(), pagerSettings, this.cell.get_element(), selectArgument);
            this.gridView.add_sorted(function (sender, args) {
                pagingBar.sortExpression = args.expression;
            });
        }
    };

    JData.Internal.NumberPagingBar.registerClass('JData.Internal.NumberPagingBar', JData.Internal.TableRow);

})();

Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

JData.Internal.DataBoundTable = function (element) {

    if (element == null)
        throw Error.argumentNull(element);

    if (element.tagName != 'TABLE')
        throw Error.create('The element is not a table element.');


    //var t = document.createElement('table');

    JData.Internal.DataBoundTable.initializeBase(this, new Array(element));

    this._element = element;
    this._controls = new Array();
    this._headerStyle = new JData.TableItemStyle();
    this._rowStyle = new JData.TableItemStyle();
    this._alternatingRowStyle = new JData.TableItemStyle();
    this._emptyDataRowStyle = new JData.TableItemStyle();
    this._columns = new Array();
    this._rows = new Array();


    this.set_cellSpacing('0px');
    this.set_cellPadding('0px');
    this.set_gridLines(JData.GridLines.Both);
    this.set_footerStyle(new JData.TableItemStyle());
    this.set_captionStyle(new JData.TableItemStyle());
    this.set_pagerStyle(new JData.TableItemStyle());
    this.set_editRowStyle(new JData.TableItemStyle());

    //this.set_pageSize(10);
    this._pageIndex = -1;
    this._pageCount = null;
    this._pagerSettings = new JData.PagerSettings();
    this._headerRows = new Array();
    this._footerRows = new Array();
    this.set_emptyDataText('No Records');
    this._validators = new Array();
    this.__fields = new Array();
};

JData.Internal.DataBoundTable.prototype = {

    //=============== Events ===============

    add_pageIndexChanging: function (handler) {
        /// <summary>
        /// Occurs when one of the pager buttons is clicked, but before the GridView control handles the paging operation.
        /// </summary>
        this.get_events().addHandler('pageIndexChanging', handler);
    },
    remove_pageIndexChanging: function (handler) {
        this.get_events().addHandler('pageIndexChanging', handler);
    },

    add_pageIndexChanged: function (handler) {
        /// <summary>
        /// Occurs when one of the pager buttons is clicked, but after the GridView control handles the paging operation.
        /// </summary>
        this.get_events().addHandler('pageIndexChanged', handler);
    },
    remove_pageIndexChanged: function (handler) {
        this.get_events().addHandler('pageIndexChanged', handler);
    },

    add_rowCreating: function (handler) {
        /// <summary>
        /// Occurs when a row's New button is clicked, but before the GridView DataBoundTable create the row.
        /// </summary>
        this.get_events().addHandler('rowCreating', handler);
    },
    remove_rowCreating: function (handler) {
        this.get_events().removeHandler('rowCreating', handler);
    },

    add_rowCreated: function (handler) {
        /// <summary>
        /// Occurs when a row is created in a DataBoundTable control.
        /// </summary>
        this.get_events().addHandler('rowCreated', handler);
    },
    remove_rowCreated: function (handler) {
        this.get_events().removeHandler('rowCreated', handler);
    },

    add_rowRemoving: function (handler) {
        /// <summary>
        /// Occurs when a row's Delete button is clicked, but before the DataBoundTable control updates the row.
        /// </summary>
        this.get_events().addHandler('rowRemoving', handler);
    },
    remove_rowRemoving: function (handler) {
        this.get_events().removeHandler('rowRemoving', handler);
    },

    add_rowRemoved: function (handler) {
        /// <summary>
        /// Occurs when a row's Delete button is clicked, but after the DataBoundTable control updates the row.
        /// </summary>
        this.get_events().addHandler('rowRemoved', handler);
    },
    remove_rowRemoved: function (handler) {
        this.get_events().removeHandler('rowRemoved', handler);
    },

    add_cellBeginEdit: function (handler) {
        /// <summary>
        /// Occurs when edit mode starts for the selected cell.
        /// </summary>
        this.get_events().addHandler('cellBeginEdit', handler);
    },
    remove_cellBeginEdit: function (handler) {
        this.get_events().removeHandler('cellBeginEdit', handler);
    },

    add_cellClick: function (handler) {
        /// <summary>
        /// Occurs when any part of a cell is clicked.
        /// </summary>
        this.get_events().addHandler('cellClick', handler);
    },
    remove_cellClick: function (handler) {
        this.get_events().removeHandler('cellClick', handler);
    },

    add_cellDoubleClick: function (handler) {
        /// <summary>
        /// Occurs when the user double-clicks anywhere in a cell.
        /// </summary>
        this.get_events().addHandler('cellDoubleClick', handler);
    },
    remove_cellDoubleClick: function (handler) {
        this.get_events().removeHandler('cellDoubleClick', handler);
    },

    add_cellEndEdit: function (handler) {
        /// <summary>
        /// Occurs when edit mode stops for the currently selected cell.
        /// </summary>
        this.get_events().addHandler('cellEndEdit', handler);
    },
    remove_cellEndEdit: function (handler) {
        this.get_events().removeHandler('cellEndEdit', handler);
    },

    add_cellValueChanged: function (handler) {
        /// <summary>
        /// Occurs when the value of a cell changes.
        /// </summary>
        this.get_events().addHandler('cellValueChanged', handler);
    },
    remove_cellValueChanged: function (handler) {
        this.get_events().removeHandler('cellValueChanged', handler);
    },

    add_cellValuePushed: function (handler) {
        /// <summary>
        /// Occurs when a cell value has changed and requires storage in the underlying data source.
        /// </summary>
        this.get_events().addHandler('cellValuePushed', handler);
    },
    remove_cellValuePushed: function (handler) {
        this.get_events().removeHandler('cellValuePushed', handler);
    },

    add_cellValidated: function (handler) {
        /// <summary>
        /// Occurs after the cell has finished validated.
        /// </summary>
        this.get_events().addHandler('cellValidated', handler);
    },
    remove_cellValidated: function (handler) {
        this.get_events().removeHandler('cellValidated', handler);
    },

    add_cellValidating: function (handler) {
        /// <summary>
        /// Occurs after the cell has finished validating.
        /// </summary>
        this.get_events().addHandler('cellValidating', handler);
    },
    remove_cellValidating: function (handler) {
        this.get_events().removeHandler('cellValidating', handler);
    },

    add_dataBound: function (handler) {
        /// <summary>
        /// Occurs after a data-binding operation has finished.
        /// </summary>
        this.get_events().addHandler('dataBound', handler);
    },
    remove_dataBound: function (handler) {
        this.get_events().removeHandler('dataBound', handler);
    },

    add_dataSourceChanging: function (handler) {
        /// <summary>
        /// Occurs when the value of the dataSource property changes.
        /// </summary>
        this.get_events().addHandler('dataSourceChanging', handler);
    },
    remove_dataSourceChanging: function (handler) {
        this.get_events().removeHandler('dataSourceChanging', handler);
    },

    add_dataSourceChanged: function (handler) {
        /// <summary>
        /// Occurs when the value of the dataSource property changes.
        /// </summary>
        this.get_events().addHandler('dataSourceChanged', handler);
    },
    remove_dataSourceChanged: function (handler) {
        this.get_events().removeHandler('dataSourceChanged', handler);
    },

    //=============== Properties ===============

    get_allowPaging: function () {
        /// <summary>
        /// Gets a value indicating whether the paging feature is enabled.
        /// </summary>
        /// <returns type="Boolean"/>
        return this._allowPaging;
    },
    set_allowPaging: function (value) {
        /// <summary>
        /// Sets a value indicating whether the paging feature is enabled.
        /// </summary>
        if (!Boolean.isInstanceOfType(value))
            value = Boolean.parse(value);

        this._allowPaging = value;
    },

    get_pagerSettings: function () {
        /// <summary>
        /// Gets a reference to the PagerSettings object that allows you to set the properties of the pager buttons in a DataBoundTable control.
        /// </summary>
        /// <returns type="JData.PagerSettings"/>
        return this._pagerSettings;
    },
    set_pagerSettings: function (value) {
        /// <summary>
        /// Sets a reference to the PagerSettings object that allows you to set the properties of the pager buttons in a DataBoundTable control.
        /// </summary>
        this._pagerSettings = value;
    },

    get_alternatingRowStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of alternating data rows in a DataBoundTable control.
        /// </summary>
        ///	<returns type="JData.Style" />
        return this._alternatingRowStyle;
    },
    set_alternatingRowStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of alternating data rows in a DataBoundTable control.
        /// </summary>
        this._alternatingRowStyle = value;
    },

    get_backImageUrl: function () {
        /// <summary>
        /// Gets the URL to an image to display in the background of a GridView control.
        /// </summary>
        /// <returns type="String"/>
        return this._backImageUrl;
    },
    set_backImageUrl: function (value) {
        /// <summary>
        /// Sets the URL to an image to display in the background of a GridView control.
        /// </summary>
        this.__backImageUrl = value;
    },

    get_borderWidth: function () {
        /// <summary>
        /// Gets the border width of the Web server control.
        /// </summary>
        /// <returns type="String"/>
        return this._borderWidth;
    },
    set_borderWidth: function (value) {
        /// <summary>
        /// Sets the border width of the Web server control.
        /// </summary>
        this._borderWidth = value;
    },


    get_caption: function () {
        /// <summary>
        /// Gets the text to render in the caption row in a DataBoundTable control.
        /// </summary>
        /// <returns type="String"/>
        return this._caption;
    },
    set_caption: function (value) {
        /// <summary>
        /// Sets the text to render in the caption row in a DataBoundTable control. 
        /// </summary>
        this._caption = value;
    },

    get_captionStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the caption row in a DataBoundTable control.
        /// </summary>
        /// <value type="JData.TableItemStyle"/>
        return this._captionStyle;
    },
    set_captionStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of the caption row in a DataBoundTable control.
        /// </summary>
        this._captionStyle = value;
    },

    get_cellPadding: function () {
        /// <summary>
        ///  Gets the amount of space between the contents of a cell and the cell's border.
        /// </summary>
        /// <returns type="String"/>
        return this._cellpadding;
    },
    set_cellPadding: function (value) {
        /// <summary>
        ///  Sets the amount of space between the contents of a cell and the cell's border.
        /// </summary>
        this._cellpadding = value;
    },

    get_cellSpacing: function () {
        /// <summary>
        /// Gets the amount of space between cells.
        /// </summary>
        return this._cellSpacing;
    },
    set_cellSpacing: function (value) {
        /// <summary>
        /// Sets the amount of space between cells.
        /// </summary>
        this._cellSpacing = value;
    },

    get_cssClass: function () {
        /// <summary>
        /// Gets the Cascading Style Sheet (CSS) class rendered by the Web server control on the client.
        /// </summary>
        return this._cssClass;
    },
    set_cssClass: function (value) {
        /// <summary>
        /// Sets the Cascading Style Sheet (CSS) class rendered by the Web server control on the client.
        /// </summary>
        this._cssClass = value;
    },

    get_editRowStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the row selected for editing in a DataBoundTable control.
        /// </summary>
        /// <value type="JData.TableItemStyle"/>
        return this._editRowStyle;
    },
    set_editRowStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of the row selected for editing in a DataBoundTable control.
        /// </summary>
        this._editRowStyle = value;
    },

    get_emptyDataRowStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the empty data row rendered when a DataBoundTable control is bound to a data source that does not contain any records.
        /// </summary>
        /// <returns type="JData.TableItemStyle"/>
        return this._emptyDataRowStyle;
    },
    set_emptyDataRowStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of the empty data row rendered when a DataBoundTable control is bound to a data source that does not contain any records.
        /// </summary>
        if (value == null)
            throw Error.argumentNull('value');

        this._emptyDataRowStyle = value;
    },

    get_emptyDataText: function () {
        /// <summary>
        /// Gets the text to display in the empty data row rendered when a GridView control is bound to a data source that does not contain any records.
        /// </summary>
        /// <returns type="String"/>
        return this._emptyDataText;
    },
    set_emptyDataText: function (value) {
        /// <summary>
        /// Sets the text to display in the empty data row rendered when a GridView control is bound to a data source that does not contain any records.
        /// </summary>
        this._emptyDataText = value;;
    },

    get_footerRows: function () {
        /// <summary>
        /// Gets a Array object that represents the footer rows in a GridView control.
        /// </summary>
        /// <returns type="Array"/>
        return this._footerRows;
    },

    get_footerStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the footer row in a DataBoundTable control.
        /// </summary>
        /// <value type="JData.TableItemStyle"/>
        return this._footerStyle;
    },
    set_footerStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of the footer row in a DataBoundTable control.
        /// </summary>
        this._footerStyle = value;
    },

    get_gridLines: function () {
        /// <summary>
        /// Gets the gridline style for a DataBoundTable control.
        /// </summary>
        /// <returns type="JData.GridLines"/>
        return this._gridLines;
    },
    set_gridLines: function (value) {
        /// <summary>
        /// Sets the gridline style for a DataBoundTable control.
        /// </summary>
        /// <param name="value" type="JData.GridLines"/>

        if (typeof (value) == String)
            value = JData.GridLines.parse(value, true);

        this._gridLines = value;
    },

    get_headerRows: function () {
        /// <summary>
        /// Gets a Array object that represents the header rows in a GridView control.
        /// </summary>
        /// <returns type="Array"/>
        return this._headerRows;
    },

    get_headerStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the header row in a GridView control.
        /// </summary>
        ///	<returns type="JData.TableItemStyle" />
        return this._headerStyle;
    },
    set_headerStyle: function (value) {
        this._headerStyle = value;
    },

    get_pageCount: function () {
        /// <returns type="Number" mayBeNull="true">
        /// Gets the number of pages required to display the records of the data source in a GridView control.
        /// </returns>
        if (!this.get_allowPaging()) {
            return 1;
        }
        var total = this._get_totalRowCount();
        if (total != null && total > 0)
            this._pageCount = Math.ceil(total / this.get_pageSize());

        return this._pageCount;
    },

    get_pageIndex: function () {
        /// <returns type="Number">
        /// The zero-based index of the currently displayed page.
        /// </returns>
        return this._pageIndex;
    },
    _set_pageIndex: function (value) {
        /// <param name="value" type="Number"></param>
        /// <summary>
        /// Sets the index of the currently displayed page.
        /// </summary>

        if (!Number.isInstanceOfType(value)) {
            value = new Number(value);
        }

        if (this._pageIndex != value) {
            this._pageIndex = value;

            var h = this.get_events().getHandler('pageIndexChanged');
            if (h) {
                h(this, Sys.EventArgs.Empty);
            }
        }


    },

    get_pagerStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the pager row in a GridView control.
        /// </summary>
        ///	<return type="JData.TableItemStyle" />
        return this._pagerStyle;
    },
    set_pagerStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of the pager row in a GridView control.
        /// </summary>
        ///	<value type="JData.TableItemStyle" />
        this._pagerStyle = value;
    },

    get_rows: function () {
        /// <summary>
        /// Gets a collection of TableRow objects that represent the data rows in a DataBoundTable control.
        /// </summary>
        /// <returns type="Array"/>
        Sys.Debug.assert(Array.isInstanceOfType(this._rows));
        return this._rows;
    },

    get_rowStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the data rows in a DataBoundTable control.
        /// </summary>
        ///	<returns type="JData.TableItemStyle" />
        return this._rowStyle;
    },
    set_rowStyle: function (value) {
        this._rowStyle = value;
    },

    get_showCaption: function () {
        /// <summary>
        /// Gets a value indicating whether the caption row is displayed in a GridView control.
        /// </summary>
        return this.get_caption() != null;
    },

    get_dataSource: function () {
        /// <summary>
        /// Gets the object from which the data-bound control retrieves its list of data items.
        /// </summary>
        ///	<returns type="JData.DataSource" mayBeNull="true"/>
        return this._dataSource;
    },
    set_dataSource: function (dataSource) {
        /// <summary>
        /// Sets the object from which the data-bound control retrieves its list of data items.
        /// </summary>
        ///	<param name="items" type="JData.DataSource"/>
        Sys.Debug.assert(JData.DataSource.isInstanceOfType(dataSource) ||
                         Array.isInstanceOfType(dataSource));

        if (this._dataSource == dataSource)
            return;

        var h = this.get_events().getHandler('dataSourceChanging');
        if (h) h(this, { dataSource: dataSource });

        this._dataSource = dataSource;

        var h = this.get_events().getHandler('dataSourceChanged');
        if (h) h(this, { dataSource: dataSource });
    },

    _set_totalRowCount: function (value) {
        this._totalRowCount = value;
    },

    _get_totalRowCount: function () {
        return this._totalRowCount;
    },
    //=============== Methods ===============

    //initialize: function () {
    //    JData.Internal.DataBoundTable.initializeBase(this);
    //},

    createHeaderRow: function (index, properties, rowType) {
        /// <param name="index" type="Number" mayBeNull="false"/>
        /// <param name="properties" type="JSON" mayBeNull="true"/>
        /// <param name="rowType" type="Type" mayBeNull="false"/>
        /// <returns type="JData.Internal.TableRow"/>
        if (index == null) throw Error.argumentNull('index');
        if (rowType == null) throw Error.argumentNull('rowType');
        if (properties == null)
            properties = {}

        properties.rowType = JData.DataControlRowType.Header;
        return this._CreateRow(index, properties, rowType);
    },

    createRow: function (index, properties, rowType) {
        /// <param name="index" type="Number" mayBeNull="false"/>
        /// <param name="properties" type="JSON" mayBeNull="true"/>
        /// <param name="rowType" type="Type" mayBeNull="false"/>
        /// <returns type="JData.Internal.TableRow"/>
        if (index == null) throw Error.argumentNull('index');
        if (rowType == null) throw Error.argumentNull('rowType');
        if (properties == null)
            properties = {};

        properties.rowType = JData.DataControlRowType.DataRow;

        return this._CreateRow(index, properties, rowType);
    },

    createFooterRow: function (index, properties, rowType) {
        /// <param name="index" type="Number" mayBeNull="false"/>
        /// <param name="properties" type="JSON" mayBeNull="true"/>
        /// <param name="rowType" type="Type" mayBeNull="false"/>
        /// <returns type="JData.Internal.TableRow"/>
        if (index == null) throw Error.argumentNull('index');
        if (rowType == null) throw Error.argumentNull('rowType');
        if (properties == null)
            properties = {};

        properties.rowType = JData.DataControlRowType.Footer;

        return this._CreateRow(index, properties, rowType);
    },

    removeRow: function (row) {
        this._RemoveRow(row);
    },

    get_emptyRow: function () {
        return this.emptyRow;
    },

    //==========================================================================

    _fields: function (value) {
        /// <param name="value" type="Array"/>
        /// <returns type="Array"/>
        if (value == null)
            return this.__fields;

        for (var i = 0; i < value.length; i++) {
            value[i]._Index = i;
            //value[i]._set_owner(this);
        }
        this.__fields = value;
    },

    _visibleFields: function () {
        /// <returns type="Array"/>
        var array = new Array();
        for (var i = 0; i < this.get_fields().length; i++) {
            if (this._fields()[i].get_visible() == true)
                Array.add(array, this._fields()[i]);
        }
        return array;
    },

    //========================================================================

    _pagerType: function () {
        var mode = this.get_pagerSettings().get_mode();
        if (mode == JData.PagerButtons.NextPrevious ||
                    mode == JData.PagerButtons.NextPreviousFirstLast)
            return JData.Internal.TextPagingBar;

        if (mode == JData.PagerButtons.Numeric ||
                    mode == JData.PagerButtons.NumericFirstLast)
            return JData.Internal.NumberPagingBar;

    },

    _GetRowType: function (index, properties) {
        /// <param name="index" type="Number">
        /// Index of the row.
        /// </param>
        /// <param name="properties" type="JSON">
        /// </param>
        /// <returns type="Type"/>
        throw Error.notImplemented();
    },

    _GetRowStyle: function (tableRow) {
        /// <param name="tableRow" type="JData.Internal.GridViewRow">
        /// </param>

        var style = this.get_rowStyle();
        var index = Array.indexOf(this.get_rows(), tableRow);
        if (index / 2 != Math.round(index / 2)) {
            style = this.get_alternatingRowStyle();//.mergeWith(style);
        }
        return style;
    },

    _getClientDataSource: function () {
        if (this._clientDataSource == null) {
            if (this.get_dataSource() == null)
                return null;

            if (Array.isInstanceOfType(this.get_dataSource())) {
                this._clientDataSource = new JData.ArrayDataSource(this.get_dataSource());
            }
            else if (JData.ArrayDataSource.isInstanceOfType(this.get_dataSource())) {
                this._clientDataSource = this.get_dataSource();
            }
            else {
                if (this.get_allowPaging() && !this.get_dataSource().canPage())
                    this._clientDataSource = new JData.Internal.PagingDataSource(this.get_dataSource());
                else
                    this._clientDataSource = this.get_dataSource();
            }
        }
        return this._clientDataSource;
    },

    _showError: function (error, cells) {
        if (error == null)
            error = 'error';
        if (!String.isInstanceOfType(error) && cells != null) {
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                var msg = error[cell.get_containingField().get_dataField()];
                if (msg != null)
                    cell._showError(msg);
                else
                    cell._clearError();
            }
            return;
        }
        alert(error);
    },

    _CreateCaption: function () {
        if (this.get_showCaption()) {
            var caption = this.get_element().createCaption();
            caption.innerHTML = this.get_caption();
            this.get_captionStyle().applyTo(caption);
        }
    },

    _CreateHeader: function () {
        //create caption row
        var gridView = this;
        if (gridView.get_allowPaging() && gridView.get_pagerSettings().get_visible() &&
            (this.get_pagerSettings().get_position().indexOf(JData.PagerPosition.Top) >= 0)) {
            var properties = { parent: gridView, rowType: JData.DataControlRowType.Header };
            var pagingBar = gridView._CreateRow(gridView.get_headerRows().length, properties, this._pagerType());
            pagingBar.applyStyle(gridView.get_pagerStyle());
        }

        //gnerate the grid header
        if (gridView.get_showHeader()) {
            var properties = { rowType: JData.DataControlRowType.Header };
            var index = gridView.get_headerRows().length;
            var row = gridView._CreateRow(index, properties);
            var style = gridView.get_headerStyle();
            row.applyStyle(style);
        }

    },

    _CreateFooter: function () {
        //generate the grid footer
        var gridView = this;
        if (gridView.get_showFooter() == true) {
            var properties = {
                parent: gridView,
                rowType: JData.DataControlRowType.Footer
            };
            var row = gridView._CreateRow(gridView.get_footerRows().length, properties);
            row.applyStyle(gridView.get_footerStyle());
        }

        //create paging bar
        if (gridView.get_allowPaging() && gridView.get_pagerSettings().get_visible() &&
            this.get_pagerSettings().get_position().indexOf(JData.PagerPosition.Bottom) >= 0) {
            var properties = { parent: gridView, rowType: JData.DataControlRowType.Pager };
            //var rowType = gridView._GetRowType(JData.DataControlRowType.Pager, properties);
            var pagingBar = gridView._CreateRow(gridView.get_footerRows().length, properties, this._pagerType());
            pagingBar.applyStyle(gridView.get_pagerStyle());
        }
    },



    _CreateRow: function (index, properties, rowType) {
        /// <param name="rowType" type="Type" mayBeNull="true"/>

        if (index == null) throw Error.argumentNull('index');
        if (properties == null) throw Error.argumentNull('properties');
        if (properties.rowType == null) throw Error.argumentNull('properties.rowType');

        //if (properties.rowType == JData.DataControlRowType.DataRow) {
        var h = this.get_events().getHandler('rowCreating');
        if (h) h(this, { properties: properties });
        //}

        var rowElement;
        //移除 element 字段。
        if (properties.element != null) {
            rowElement = properties.element;
            var a = {};
            for (var k in properties) {
                if (k == 'element')
                    continue;

                a[k] = properties[k];
            }
            properties = a;
        }

        var tHead = this.get_element().tHead;
        if (tHead == null)
            tHead = this.get_element().createTHead();

        var tBody = this.get_element().tBodies[0];
        if (tBody == null) {
            //注：Firefox 不支持 createTBody 方法
            var tBody = document.createElement('tbody');
            this.get_element().appendChild(tBody);
        }

        var tFoot = this.get_element().tFoot;
        if (tFoot == null)
            tFoot = this.get_element().createTFoot();

        var rows;
        switch (properties.rowType) {
            //case JData.DataControlRowType.Caption:
            case JData.DataControlRowType.Header:
            case JData.DataControlRowType.EmptyDataRow:
                rows = this.get_headerRows();
                rowElement = rowElement != null ? rowElement : tHead.insertRow(index);
                break;
            case JData.DataControlRowType.DataRow:
                rows = this.get_rows();
                elementIndex = index + this.get_headerRows().length;
                rowElement = rowElement != null ? rowElement : tBody.insertRow(index);
                break;
            case JData.DataControlRowType.Footer:
            case JData.DataControlRowType.Pager:
                rows = this.get_footerRows();
                rowElement = rowElement != null ? rowElement : tFoot.insertRow(index);
                break;
            default:
                throw Error.notImplemented();
        }

        if (index < 0 || index > rows.length) throw Error.argumentOutOfRange('index', index);

        if (rowType == null) {
            rowType = this._GetRowType(index, properties);
            Sys.Debug.assert(rowType != null);
        }

        properties.parent = this;
        var row = $create(rowType, properties, null, null, rowElement);
        Array.insert(rows, index, row);

        var gridView = this;

        //if (properties.rowType == JData.DataControlRowType.DataRow) {
        var h = this.get_events().getHandler('rowCreated');
        if (h) h(this, { row: row });
        //}
        return row;
    },

    _CreateRows: function (items) {
        throw Error.notImplemented();
    },


    _getSelectArgument: function (value) {
        if (this._getSelectArgumentResult == null) {
            this._getSelectArgumentResult = new JData.DataSourceSelectArguments();
        }

        if (this.get_allowPaging()) {
            var args = this._getSelectArgumentResult;
            args.set_maximumRows(this.get_pageSize());
            args.set_startRowIndex(this.get_pageIndex() * this.get_pageSize());
        }
        return this._getSelectArgumentResult;
    },

    _HandleCancel: function (row) {
        throw Error.notImplemented();
    },

    _HandleDelete: function (row) {
        throw Error.notImplemented();
    },

    _HandleEdit: function (row) {
        throw Error.notImplemented();
    },

    _HandleInsert: function (row) {
        throw Error.notImplemented();
    },

    _HandleNew: function (beforeRow) {
        throw Error.notImplemented();
    },

    _HandlePage: function (pageIndex) {
        throw Error.notImplemented();
    },

    _HandleUpdate: function (cells) {
        throw Error.notImplemented();
    },

    _RemoveRow: function (row) {
        if (row == null)
            throw Error.argumentNull('row');

        //if (JData.DataControlRowType.DataRow == row.get_rowType()) {
        //    var h = this.get_events().getHandler('rowRemoving');
        //    if (h) h(this, { row: row });
        //}

        var rows;
        switch (row.get_rowType()) {
            case JData.DataControlRowType.Header:
            case JData.DataControlRowType.EmptyDataRow:
                rows = this.get_headerRows();
                break;
            case JData.DataControlRowType.DataRow:
                //rows = this.get_rows();
                //break;
                this._RemoveDataRow(row);
                return;
            case JData.DataControlRowType.Pager:
            case JData.DataControlRowType.Footer:
                rows = this.get_footerRows();
                break;
            default:
                throw Error.notImplemented();
        }

        this.get_element().deleteRow(row.get_element().rowIndex);
        Array.remove(rows, row);

        //if (JData.DataControlRowType.DataRow == row.get_rowType()) {
        //    var h = this.get_events().getHandler('rowRemoved');
        //    if (h) h(this, { row: row });
        //}

        row.dispose();
    },

    _RemoveDataRow: function (row) {
        if (row == null)
            throw Error.argumentNull('row');

        if (JData.DataControlRowType.DataRow == row.get_rowType()) {
            var h = this.get_events().getHandler('rowRemoving');
            if (h) h(this, { row: row });
        }

        var rows;
        //switch (row.get_rowType()) {
        //    case JData.DataControlRowType.Header:
        //    case JData.DataControlRowType.EmptyDataRow:
        //        rows = this.get_headerRows();
        //        break;
        //    case JData.DataControlRowType.DataRow:
        rows = this.get_rows();
        //        break;
        //    case JData.DataControlRowType.Pager:
        //    case JData.DataControlRowType.Footer:
        //        rows = this.get_footerRows();
        //        break;
        //    default:
        //        throw Error.notImplemented();
        //}

        this.get_element().deleteRow(row.get_element().rowIndex);
        Array.remove(rows, row);

        if (JData.DataControlRowType.DataRow == row.get_rowType()) {
            var h = this.get_events().getHandler('rowRemoved');
            if (h) h(this, { row: row });
        }

        row.dispose();
    },

    _CreateDataRow: function (index, dataItem) {
        var properties = {
            parent: this,
            dataItem: dataItem,
            rowType: JData.DataControlRowType.DataRow
        };
        var row = this._CreateRow(index, properties);
        var style = this._GetRowStyle(row);
        row.applyStyle(style);

        return row;
    },

    createEmptyRow: function (text) {
        if (text == null)
            text = this.get_emptyDataText();

        var gridView = this;
        if (gridView.emptyRow == null) {
            var properties = { rowType: JData.DataControlRowType.EmptyDataRow, text: this.get_emptyDataText() };
            this.emptyRow = this._CreateRow(this.get_headerRows().length, properties, JData.Internal.SingleCellRow);
            var style = gridView.get_emptyDataRowStyle();
            this.emptyRow.applyStyle(style);
        }

        return this.emptyRow;
    },

    removeEmptyRow: function () {
        var gridView = this;
        if (gridView.emptyRow != null) {
            gridView._RemoveRow(this.emptyRow);
            gridView.emptyRow = null;
        }
    },

    _clearRows: function () {
        var table = this.get_element();
        while (table.rows.length > 0) {
            table.deleteRow(table.rows.length - 1);
        }
    },

    _ApplyStyle: function () {
        var gridView = this;
        switch (gridView.get_gridLines()) {
            case JData.GridLines.Both:
                gridView.get_element().style.borderCollapse = 'collapse';
                gridView.get_element().border = '1';
                break;
            case JData.GridLines.None:
                gridView.get_element().style.borderCollapse = 'collapse';
                gridView.get_element().border = '0';
                break;
            case JData.GridLines.Horizontal:
                gridView.get_element().borderCollapse = 'collapse';
                gridView.get_element().border = '1';
                gridView.get_element().rules = 'rows';
                break;
            case JData.GridLines.Vertical:
                gridView.get_element().style.borderCollapse = 'collapse';
                gridView.get_element().style.border = '1';
                gridView.get_element().rules = 'cols';
                break;
        }
        if (gridView.get_cssClass() != null) {
            gridView.get_element().className = gridView.get_cssClass();
        }

        if (gridView.get_width() != null)
            gridView.get_element().width = gridView.get_width();

        if (gridView.get_cellSpacing() != null)
            gridView.get_element().cellSpacing = gridView.get_cellSpacing();

        if (gridView.get_cellPadding() != null)
            gridView.get_element().cellPadding = gridView.get_cellPadding();
    },

    //Virutal Methods Begin
    _MaxColSpan: function () {
        return -1;
    }

    //Virutal Methods End
};

JData.Internal.DataBoundTable.registerClass('JData.Internal.DataBoundTable', JData.Internal.WebControl);

//============================== JData.PagerSettings ================================

JData.PagerSettings = function () {
    this.set_pageButtonCount(10);
    this.set_position(JData.PagerPosition.Bottom);
    this.set_visible(true);
    this.set_mode(JData.PagerButtons.Numeric);
    this.set_firstPageText("&lt;&lt;");
    this.set_lastPageText("&gt;&gt;");
    this.set_nextPageText("&gt;");
    this.set_previousPageText("&lt;");
};

JData.PagerSettings.prototype = {
    get_firstPageText: function () {
        /// <return type="String">
        /// Gets the text to display for the first-page button.
        /// </return>
        return this._FirstPageText;
    },
    set_firstPageText: function (value) {
        /// <param name="value" type="String">
        /// Sets the text to display for the first-page button.
        /// </param>
        this._FirstPageText = value;
    },

    get_lastPageText: function () {
        /// <summary>
        /// Gets the text to display for the last-page button.
        /// </summary>
        /// <return type="String"/>
        return this._LastPageText;
    },
    set_lastPageText: function (value) {
        /// <summary>
        /// Sets the text to display for the last-page button.
        /// </summary>
        /// <param name="value" type="String"/>
        this._LastPageText = value;
    },

    get_mode: function () {
        /// <summary>
        /// Gets the mode in which to display the pager controls in a control that supports pagination.
        /// </summary>
        /// <return type="JData.PagerButtons" />
        return this._Mode;
    },
    set_mode: function (value) {
        /// <summary>
        /// Sets the mode in which to display the pager controls in a control that supports pagination.
        /// </summary>
        /// <param name="value" type="JData.PagerButtons" />
        this._Mode = value;
    },

    get_nextPageText: function () {
        /// <summary>
        /// Gets the text to display for the next-page button.
        /// </summary>
        return this._NextPageText;
    },
    set_nextPageText: function (value) {
        /// <summary>
        /// Sets the text to display for the next-page button.
        /// </summary>
        this._NextPageText = value;
    },

    get_pageButtonCount: function () {
        /// <summary>
        /// Gets the number of page buttons to display in the pager when the Mode property is set to the Numeric or NumericFirstLast value.
        /// </summary>
        return this._pageButtonCount;
    },
    set_pageButtonCount: function (value) {
        /// <summary>
        /// Sets the number of page buttons to display in the pager when the Mode property is set to the Numeric or NumericFirstLast value.
        /// </summary>
        this._pageButtonCount = value;
    },

    get_position: function () {
        /// <summary>
        /// Gets a value that specifies the location where the pager is displayed.
        /// </summary>
        /// <returns type="String"/>
        return this._position;
    },
    set_position: function (value) {
        /// <summary>
        /// Sets a value that specifies the location where the pager is displayed.
        /// </summary>
        /// <param name="value" type="String"/>
        this._position = value;
    },

    get_previousPageText: function () {
        /// <summary>
        /// Gets the text to display for the previous page button.
        /// </summary>
        /// <returns type="String" />
        return this._PreviousPageText;
    },
    set_previousPageText: function (value) {
        /// <summary>
        /// Sets the text to display for the previous page button.
        /// </summary>
        /// <param name="value" type="String"/>
        this._PreviousPageText = value;
    },

    get_visible: function () {
        /// <summary>
        /// Gets a value indicating whether the paging controls are displayed in a control that supports pagination.
        /// </summary>
        /// <returns type="Boolean" />
        return this._Visible;
    },
    set_visible: function (value) {
        /// <summary>
        /// Sets a value indicating whether the paging controls are displayed in a control that supports pagination.
        /// </summary>
        /// <param name="value" type="Boolean" />
        this._Visible = value;
    }
};

JData.PagerSettings.registerClass('JData.PagerSettings');

Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");
//================================== GridView ============================================
//TODO:1、Selected的样式通过监听Select事件来更改。（已完成）
//TODO:2、实现GridViewRow的rowState属性。(包括编辑，选择）
JData.GridView = function (element) {

    JData.GridView.initializeBase(this, [element]);
    $.data(element, Object.getTypeName(this), this);

    this.set_showHeader(true);
    this.set_showFooter(false);
    this.set_pageSize(10);
    this._fields([]);
    this.set_selectedRowStyle(new JData.TableItemStyle());

    this.add_dataSourceChanging(function (sender, args) {
        /// <param name="sender" type="JData.GridView"></param>
        /// <param name="args" type="Object"></param>

        var gridView = sender;
        if (gridView.get_dataSource() == null)
            return;

        if (girdView._proxy_onDataSourceInserted)
            gridView.get_dataSource().remove_inserted(gridView._proxy_onDataSourceInserted);

        if (gridView._proxy_onDataSourceDeleted)
            gridView.get_dataSource().remove_deleted(gridView._proxy_onDataSourceDeleted);

        if (gridView._proxy_onDataSourceUpdated)
            gridView.get_dataSource().remove_updated(gridView._proxy_onDataSourceUpdated);

        if (gridView._proxy_onDataSourceSelect)
            gridView.get_dataSource().remove_selected(gridView._proxy_onDataSourceSelect);
    });
    this.add_dataSourceChanged(function (sender, args) {
        var dataSource = args.dataSource;
        if (dataSource == null)
            return;

        var gridView = sender;

        gridView._proxy_onDataSourceInserted = $.proxy(gridView._onDataSourceInserted, gridView);
        gridView._proxy_onDataSourceDeleted = $.proxy(gridView._onDataSourceDeleted, gridView);
        gridView._proxy_onDataSourceUpdated = $.proxy(gridView._onDataSourceUpdated, gridView);
        gridView._proxy_onDataSourceSelect = $.proxy(gridView._onDataSourceSelect, gridView);

        dataSource.add_inserted(gridView._proxy_onDataSourceInserted);
        dataSource.add_deleted(gridView._proxy_onDataSourceDeleted);
        dataSource.add_updated(gridView._proxy_onDataSourceUpdated);
        dataSource.add_selected(gridView._proxy_onDataSourceSelect);
    });
    this.add_rowCreated(function (sender, args) {
        sender.removeEmptyRow();
    });
    this.add_rowRemoved(function (sender, args) {
        if (sender.get_rows().length == 0) {
            sender.createEmptyRow();
        }
    });
};

JData.GridView.prototype = {
    _ROW_SELECTED_FIELD: '$selected',
    _onDataSourceInserted: function (sender, args) {
        if (args.item == null)
            throw Error.argumentNull('args.item');

        var gridView = this;
        //如果 GridViewRow 已经创建，则直接返回。
        for (var i = 0; i < gridView.get_rows().length; i++) {
            var row = gridView.get_rows()[i];
            if (row.get_dataItem() == args.item) {
                return;
            }
        }
        //否则，创建 GridViewRow
        //============================================================
        var dataItem = $.extend(args.item, args.returnItem || {});
        gridView._CreateDataRow(0, dataItem);
        //============================================================
        //同步更新对应行的单元格数据
        var row = gridView.get_rows()[0];
        if (args.returnItem) {
            gridView._refreshItem(args.returnItem, row);
            for (var j = 0; j < row.get_cells().length; j++) {
                var cell = row.get_cells()[j];
                if (JData.Internal.EditableCell.isInstanceOfType(cell))
                    cell.set_value();
            }
        }
        //============================================================
    },
    _onDataSourceDeleted: function (sender, args) {
        var gridView = this;
        for (var i = 0; i < gridView.get_rows().length; i++) {
            var row = gridView.get_rows()[i];
            if (row.get_dataItem() == args.item) {
                gridView._RemoveRow(row);
                break;
            }
        }
    },
    _onDataSourceUpdated: function (sender, args) {
        var gridView = this;
        for (var i = 0; i < gridView.get_rows().length; i++) {
            var row = gridView.get_rows()[i];
            if (row.get_dataItem() == args.item) {
                for (var j = 0; j < row.get_cells().length; j++) {
                    var cell = row.get_cells()[j];
                    if (JData.Internal.EditableCell.isInstanceOfType(cell))
                        cell.set_value();
                }
                break;
            }
        }
    },
    _onDataSourceSelect: function (sender, obj) {
        var gridView = this;
        var items = obj.items;
        var args = obj.selectArguments;
        var dataSource = sender;
        var total;
        if (dataSource.canRetrieveTotalRowCount()) {
            total = args.get_totalRowCount();
            if (total == null)
                throw Error.argumentNull('args.totalRowCount');

        } else if (dataSource.canPage() == false) {
            total = items.length;
        }

        //=========================================================
        // 清除已经选择行
        while (gridView.get_selectedRows().length > 0) {
            gridView._HandleUnselect(gridView.get_selectedRows()[0]);
        }
        //=========================================================

        var pageIndex = Math.ceil(args.get_startRowIndex() / args.get_maximumRows());
        gridView._set_totalRowCount(total);
        gridView._CreateRows(items);
        gridView._set_pageIndex(pageIndex);

        //设置 Header 的排序
        var headerRows = gridView.get_headerRows();
        for (var i = 0; i < headerRows.length; i++) {
            var headerRow = headerRows[i];
            if (JData.Internal.GridViewHeaderRow.isInstanceOfType(headerRow)) {
                var sort_expression = args.get_sortExpression();
                if (sort_expression != null) {
                    for (var j = 0; j < headerRow.get_cells().length; j++) {
                        var cell = headerRow.get_cells()[j];
                        var sort_url = cell.get_element().children[0];
                        if (sort_url != null && sort_url.tagName == 'A') {
                            var arr = sort_expression.split(/\s+/);
                            var file_name = arr[0];
                            var direct = arr[1];
                            if (direct == null)
                                direct = 'asc';

                            if (sort_url.sort == file_name) {
                                if (direct.toLowerCase() == 'asc')
                                    sort_url.direct = 'desc';
                                else
                                    sort_url.direct = 'asc';

                                break;
                            }
                        }

                    }
                }

            }
        }
    },

    //=========================== EVENTS ==================================
    add_rowDeleting: function (handler) {
        /// <summary>
        /// Occurs when a row's Delete button is clicked, but before the DataBoundTable control deletes the row.
        /// </summary>
        this.get_events().addHandler('rowDeleting', handler);
    },
    remove_rowDeleting: function (handler) {
        this.get_events().removeHandler('rowDeleting', handler);
    },

    add_rowDeleted: function (handler) {
        /// <summary>
        /// Occurs when a row's Delete button is clicked, but after the DataBoundTable control deletes the row.
        /// </summary>
        this.get_events().addHandler('rowDeleted', handler);
    },
    remove_rowDeleted: function (handler) {
        this.get_events().removeHandler('rowDeleted', handler);
    },

    add_rowUpdating: function (handler) {
        /// <summary>
        /// Occurs when a row's Update button is clicked, but before the DataBoundTable control updates the row.
        /// </summary>
        this.get_events().addHandler('rowUpdating', handler);
    },
    remove_rowUpdating: function (handler) {
        this.get_events().removeHandler('rowUpdating', handler);
    },

    add_rowUpdated: function (handler) {
        /// <summary>
        /// Occurs when a row's Update button is clicked, but after the DataBoundTable control updates the row.
        /// </summary>
        this.get_events().addHandler('rowUpdated', handler);
    },
    remove_rowUpdated: function (handler) {
        this.get_events().removeHandler('rowUpdated', handler);
    },

    add_rowInserting: function (handler) {
        /// <summary>
        /// Occurs when a row's Insert button is clicked, but before the DataBoundTable control updates the row.
        /// </summary>
        this.get_events().addHandler('rowInserting', handler);
    },
    remove_rowInserting: function (handler) {
        this.get_events().removeHandler('rowInserting', handler);
    },

    add_rowInserted: function (handler) {
        /// <summary>
        /// Occurs when a row's Insert button is clicked, but after the DataBoundTable control updates the row.
        /// </summary>
        this.get_events().addHandler('rowInserted', handler);
    },
    remove_rowInserted: function (handler) {
        this.get_events().removeHandler('rowInserted', handler);
    },

    add_rowCancelingEdit: function (handler) {
        this.get_events().addHandler('rowCancelingEdit', handler);
    },
    remove_rowCancelingEdit: function (handler) {
        this.get_events().removeHandler('rowCancelingEdit', handler);
    },

    add_rowCanceledEdit: function (handler) {
        this.get_events().addHandler('rowCanceledEdit', handler);
    },
    remove_rowCanceledEdit: function (handler) {
        this.get_events().removeHandler('rowCanceledEdit', handler);
    },

    add_rowEditing: function (handler) {
        this.get_events().addHandler('rowEditing', handler);
    },
    remove_rowEditing: function (handler) {
        this.get_events().addHandler('rowEditing', handler);
    },

    add_rowSelected: function (handler) {
        /// <summary>
        /// Occurs when a row's Select button is clicked, but after the GridView control selects the row.
        /// </summary>
        this.get_events().addHandler('rowSelected', handler);
    },
    remove_rowSelected: function (handler) {
        /// <summary>
        /// Occurs when a row's Select button is clicked, but after the GridView control selects the row.
        /// </summary>
        this.get_events().removeHandler('rowSelected', handler);
    },

    add_rowSelecting: function (handler) {
        /// <summary>
        /// Occurs when a row's Select button is clicked, but before the GridView control selects the row.
        /// </summary>
        this.get_events().addHandler('rowSelecting', handler);
    },
    remove_rowSelecting: function (handler) {
        /// <summary>
        /// Occurs when a row's Select button is clicked, but before the GridView control selects the row.
        /// </summary>
        this.get_events().removeHandler('rowSelecting', handler);
    },

    add_rowUnselected: function (handler) {
        /// <summary>
        /// Occurs when a row's Select button is clicked, but after the GridView control selects the row.
        /// </summary>
        this.get_events().addHandler('rowUnselected', handler);
    },
    remove_rowUnselected: function (handler) {
        /// <summary>
        /// Occurs when a row's Select button is clicked, but after the GridView control selects the row.
        /// </summary>
        this.get_events().removeHandler('rowUnselected', handler);
    },

    add_rowUnselecting: function (handler) {
        /// <summary>
        /// Occurs when a row's Cancel button is clicked, but before the GridView control selects the row.
        /// </summary>
        this.get_events().addHandler('rowUnselecting', handler);
    },
    remove_rowUnselecting: function (handler) {
        /// <summary>
        /// Occurs when a row's Cancel button is clicked, but before the GridView control selects the row.
        /// </summary>
        this.get_events().removeHandler('rowUnselecting', handler);
    },

    add_sorted: function (handler) {
        this.get_events().addHandler('sorted', handler);
    },
    remove_sorted: function (handler) {
        this.get_events().removeHandler('sorted', handler);
    },

    add_sorting: function (handler) {
        this.get_events().addHandler('sorting', handler);
    },
    remove_sorting: function (handler) {
        this.get_events().removeHandler('sorting', handler);
    },

    //=========================== PROPERTIES ==================================

    get_editor: function () {
        /// <returns type="JData.DetailsView"/>
        return this._editor;
    },
    set_editor: function (value) {
        /// <summary>Provide a editor for the grid view when edit a row.</summary>
        /// <param name="value" type="JData.DetailsView">The editor can be a details view or form view.</param>
        if (value == null)
            throw Error.arugmentNull('value');

        if (Object.getType(value) != JData.DetailsView && Object.getType(value) != JData.FormView)
            throw Error.create('Type of the value expected JData.DetailsView type or JData.FormView type.');

        this._editor = value;
        this.set_insertEditor(value);
        this.set_updateEditor(value);
    },

    get_insertEditor: function () {
        return this._insertEditor;
    },
    set_insertEditor: function (value) {
        if (value == null)
            throw Error.arugmentNull('value');

        if (Object.getType(value) != JData.DetailsView && Object.getType(value) != JData.FormView)
            throw Error.create('Type of the value expected JData.DetailsView type or JData.FormView type.');

        this._insertEditor = value;
    },

    get_updateEditor: function () {
        return this._updateEditor;
    },
    set_updateEditor: function (value) {
        if (value == null)
            throw Error.arugmentNull('value');

        if (Object.getType(value) != JData.DetailsView && Object.getType(value) != JData.FormView)
            throw Error.create('Type of the value expected JData.DetailsView type or JData.FormView type.');

        this._updateEditor = value;
    },

    get_pageSize: function () {
        /// <summary>
        /// Gets the number of records to display on a page in a GridView control.
        /// </summary>
        /// <returns type="Number"/>
        return this._pageSize;
    },

    set_pageSize: function (number) {
        /// <summary>
        /// Sets the number of records to display on a page in a GridView control.
        /// </summary>
        /// <param name="number" type="Number"/>
        this._pageSize = number;
    },

    get_selectArguments: function () {
        /// <returns type="JData.DataSourceSelectArguments"/>
        return this._getSelectArgument();
    },

    get_selectedRowStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the selected row in a GridView control.
        /// </summary>
        /// <returns type="JData.TableItemStyle"/>
        return this._selectedRowStyle;
    },
    set_selectedRowStyle: function (value) {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the selected row in a GridView control.
        /// </summary>
        /// <param name="value" type="JData.TableItemStyle"/>
        this._selectedRowStyle = value;
    },

    get_selectedRows: function () {
        //return this._selectedRows;
        var selected_rows = new Array();
        var rows = this.get_rows();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i][this._ROW_SELECTED_FIELD] == true)
                Array.add(selected_rows, rows[i]);
        }
        return selected_rows;
    },

    get_showFooter: function () {
        /// <returns type="Boolean"/>
        return this._showFooter;
    },
    set_showFooter: function (value) {
        /// <param name="value" type="Boolean"/>
        if (value == null)
            throw Error.argumentNull('value');

        if (!Boolean.isInstanceOfType(value))
            value = Boolean.parse(value);

        this._showFooter = value;
    },

    get_showHeader: function () {
        /// <returns type="Boolean"/>
        return this._showHeader;
    },
    set_showHeader: function (value) {
        /// <param name="value" type="Boolean"/>
        if (value == null)
            throw Error.argumentNull('value');

        if (!Boolean.isInstanceOfType(value))
            value = Boolean.parse(value);

        this._showHeader = value;
    },

    set_columns: function (value) {
        /// <param name="value" type="Array"/>
        this._fields(value);
    },
    get_columns: function () {
        /// <returns type="Array"/>
        return this._fields();
    },

    _GetRowType: function (index, properties) {
        /// <param name="index" type="Number">
        /// Index of the row.
        /// </param>
        /// <param name="properties" type="JSON">
        /// </param>
        /// <returns type="Type"/>

        if (index == null) throw Error.argumentNull('index');
        if (properties == null) throw Error.argumentNull('properties');
        if (properties.rowType == null) throw Error.argumentNull('properties.rowType');
        var gridView = this;
        switch (properties.rowType) {

            case JData.DataControlRowType.DataRow:
                return JData.Internal.GridViewRow;

            case JData.DataControlRowType.Caption:
                return JData.Internal.SingleCellRow;
            case JData.DataControlRowType.Footer:
                return JData.Internal.GridViewFooterRow;
            case JData.DataControlRowType.Header:
                return JData.Internal.GridViewHeaderRow;
            case JData.DataControlRowType.Pager:
                var mode = gridView.get_pagerSettings().get_mode();
                if (mode == JData.PagerButtons.NextPrevious ||
                    mode == JData.PagerButtons.NextPreviousFirstLast)
                    return JData.Internal.TextPagingBar;

                if (mode == JData.PagerButtons.Numeric ||
                    mode == JData.PagerButtons.NumericFirstLast)
                    return JData.Internal.NumberPagingBar;

                break;
            case JData.DataControlRowType.EmptyDataRow:
                return JData.Internal.EmptyGridViewRow;
            case JData.DataControlRowType.Separator:
                break;
        }
        throw Error.notImplemented();
    },

    _GetRowStyle: function (tableRow) {
        /// <param name="tableRow" type="JData.Internal.GridViewRow">
        /// </param>

        var style = this.get_rowStyle();
        var index = Array.indexOf(this.get_rows(), tableRow);
        if (index / 2 != Math.round(index / 2)) {
            style = this.get_alternatingRowStyle().mergeWith(style);
        }

        if (tableRow[this._ROW_SELECTED_FIELD] == true)
            style = style.mergeWith(this.get_selectedRowStyle());

        if (tableRow.$editing == true)
            style = style.mergeWith(this.get_editRowStyle());

        return style;
    },

    updateRowsStyle: function (from, end) {
        /// <param name="from" type="Number"/>
        /// <param name="end" type="Number" mayBeNull="true"/>

        var index = from;
        var j = 0;
        for (var i = index; i < this.get_rows().length; i++) {
            var row = this.get_rows()[i];
            if (row.get_visible() == false)
                continue;

            var style = this._GetRowStyle(row);
            row.applyStyle(style);
            j++;
        }
    },

    _refreshItem: function (returnItem, currentRow) {
        Sys.Debug.assert(returnItem != null);

        var dataItem = $.extend(currentRow.get_dataItem(), returnItem);
        currentRow.set_dataItem(dataItem);
    },

    handleNew: function (rowIndex) {
        /// <param name="rowIndex" type="Number" />
        if (rowIndex == null)
            rowIndex = 0;

        if (rowIndex < 0 || rowIndex > this.get_rows().length)
            throw Error.argumentOutOfRange('rowIndex', rowIndex);

        var dataRow = rowIndex == 0 ? null : this.get_rows()[rowIndex - 1];
        return this._HandleNew(dataRow);
    },

    createDataRow: function (rowIndex, dataItem) {
        if (rowIndex == null)
            throw Error.argumentNull('rowIndex')

        if (dataItem == null)
            throw Error.argumentNull('dataItem');

        if (rowIndex < 0 || rowIndex > this.get_rows().length)
            throw Error.argumentOutOfRange('rowIndex', rowIndex);

        return this._CreateDataRow(rowIndex, dataItem);
    },

    removeDataRow: function (row) {
        /// <param name="row" >
        /// &#10;1. Index of the data row.
        /// &#10;2. Html element of the data row.
        /// </param>
        if (row == null)
            throw Error.argumentNull('row');

        if (Number.isInstanceOfType(row)) {
            var rowIndex = row;

            if (rowIndex < 0 || rowIndex > this.get_rows().length - 1)
                throw Error.argumentOutOfRange('row', rowIndex);

            row = this.get_rows()[rowIndex];
        }
        else {
            if (row.tagName != 'TR') {
                throw JData.Internal.Error.GridView.InvalidTableRow('row');
            }

            if (row.control == null)
                throw JData.Internal.Error.GridView.InvalidDataRow('row');

            row = row.control;
        }

        return this._RemoveRow(row);
    },

    _CreateRows: function (items) {
        if (items == null)
            throw Error.argumentNull('items');

        //======================================================
        // 说明：即使一行数据都没有，也不能直接返回，因为需要清除之前的数据。
        //if (items.length == 0)
        //    return;
        //======================================================

        var gridView = this;
        if (items.length == 0)
            this.createEmptyRow();
        else
            this.removeEmptyRow();

        while (gridView.get_rows().length > 0) {
            gridView._RemoveRow(gridView.get_rows()[0]);
        }
        for (var i = 0; i < items.length; i++) {
            var row = gridView._CreateDataRow(i, items[i]);
            var style = this._GetRowStyle(row);
            row.applyStyle(style);
        }

        var h = this.get_events().getHandler('dataBound');
        if (h) h(this, {});
    },

    _HandleCancel: function (row) {
        var h = this.get_events().getHandler('rowCancelingEdit');
        if (h) h(this, { row: row });

        if (row.get_currentMode() == JData.DataFieldMode.Insert) {
            this._RemoveRow(row);
        }
        else {
            row.changeMode(JData.DataFieldMode.ReadOnly);
            row.$editing = false;
            style = this._GetRowStyle(row);
            row.applyStyle(style);
        }

        var rows = this.get_rows();
        if (rows.length == 0)
            this.createEmptyRow();

        var h = this.get_events().getHandler('rowCanceledEdit');
        if (h) h(this, { row: row });
    },

    _HandleDelete: function (row) {

        Sys.Debug.assert(row.get_rowType() == JData.DataControlRowType.DataRow);
        var h = this.get_events().getHandler('rowDeleting');
        if (h) h(this, { row: row });

        var dataSource = this._getClientDataSource();

        var gridView = this;
        var success = function () {
            gridView._RemoveRow(row);
            if (gridView.get_rows().length == 0)
                gridView.createEmptyRow();

            var h = gridView.get_events().getHandler('rowDeleted');
            if (h) h(gridView, { row: row });
        }

        var fail = function (data) {
            if (data.processed == true)
                return;

            gridView._showError(JData.Internal.Messages.DeleteFail)
        };

        var result = dataSource['delete'](row.get_dataItem(), success, fail);
    },

    _getEditor: function (dataItem) {

        var mode = dataItem == null ? JData.DataFieldMode.Insert : JData.DataFieldMode.Edit;
        dataItem = dataItem || {};

        var editor = mode == JData.DataFieldMode.Insert ? this.get_insertEditor() : this.get_updateEditor();
        if (editor == null)
            return null;

        var editor_data_source = new JData.GridViewDataSource(this);
        editor_data_source.get_dataItems = function () {
            return [dataItem];
        }
        editor_data_source.get_dataItems = $.proxy(editor_data_source.get_dataItems, editor_data_source);
        editor.set_dataSource(editor_data_source);
        editor.set_defaultMode(mode);

        if (editor._init != true) {
            var fields = editor.get_fields();
            if (fields == null || fields.length == 0) {
                fields = [];
                for (var i = 0; i < this.get_columns().length; i++) {
                    var column_type = Object.getType(this.get_columns()[i]);
                    if (column_type == JData.SelectColumn || column_type == JData.CommandField)
                        continue;

                    var field = $.extend({}, this.get_columns()[i]);
                    field.get_headerStyle().set_width(null);
                    field.get_itemStyle().set_width(null);
                    field.get_controlStyle().set_width(null);
                    field.set_sortExpression(null);
                    Array.add(fields, field);
                }
            }

            var cmd_field = new JData.CommandField();
            cmd_field.set_showInsertButton(true);
            cmd_field.set_showEditButton(true);
            cmd_field.set_showCancelButton(true);
            fields[fields.length] = cmd_field;

            editor.set_fields(fields);

            editor.add_itemUpdated(function () {
                $(editor.get_element()).dialog('close');
            });
            editor.add_itemCanceledEdit(function () {
                $(editor.get_element()).dialog('close');
            });
            editor.add_itemInserted(function () {
                $(editor.get_element()).dialog('close');
            });

            editor.initialize();
            editor._init = true;
        }
        else {
            editor_data_source.select(new JData.DataSourceSelectArguments());
        }



        return editor;
    },

    _HandleEdit: function (row) {
        if (row.get_currentMode() != JData.DataFieldMode.ReadOnly)
            return;

        var editor = this._getEditor(row.get_dataItem());

        var h = this.get_events().getHandler('rowEditing');
        if (h) h(this, { row: row, editor: editor });

        if (editor != null) {
            $(editor.get_element()).dialog({
                width: 'auto',
                modal: true
            });
            //说明：样式的宽度在css文件中定义，因此这里需要清除掉，以免冲突。
            editor.get_element().style.width = null;
            //=========================================================
        }
        else {
            row.changeMode(JData.DataFieldMode.Edit);
            row.$editing = true;
            style = this._GetRowStyle(row);
            row.applyStyle(style);
        }

    },

    _Save: function (row) {
        if (row.get_currentMode() != JData.DataFieldMode.Edit &&
            row.get_currentMode() != JData.DataFieldMode.Insert)
            return;

        var is_edit = row.get_currentMode() == JData.DataFieldMode.Edit;

        var h = this.get_events().getHandler(is_edit ? 'rowUpdating' : 'rowInserting');
        if (h) h(this, { row: row });

        var gridView = this;
        row.validate(function () {
            var edit_values = {};
            var edit_cells = [];
            for (var i = 0; i < row.get_cells().length; i++) {
                var cell = row.get_cells()[i];
                var field = cell.get_containingField();
                if (JData.Internal.EditableCell.isInstanceOfType(cell) && !field.get_readOnly() && field.get_visible()) {
                    edit_cells[edit_cells.length] = cell;
                }
            }

            for (var i = 0; i < edit_cells.length; i++) {
                var cell = edit_cells[i];
                edit_values[cell.get_containingField().get_dataField()] = cell.get_controlValue();
            }

            var dataSource = gridView._getClientDataSource();
            var successedCallback = function (returnItem) {
                for (var i = 0; i < edit_cells.length; i++) {
                    var cell = edit_cells[i];
                    cell.pushValue();
                }

                //===================================================
                //更新行的 DataItem 。例如：自增长列在服务端生成，在插入后需要自动更新。
                if (returnItem != null) {
                    gridView._refreshItem(returnItem, row);
                }
                //===================================================

                row.changeMode(JData.DataFieldMode.ReadOnly);

                row.$editing = false;
                style = gridView._GetRowStyle(row);
                row.applyStyle(style);

                var h = gridView.get_events().getHandler(is_edit ? 'rowUpdated' : 'rowInserted');
                if (h) h(gridView, { row: row });
            };

            var failedCallback = function (error) {

                if (error.processed == true) {
                    return;
                }

                var msg = is_edit ? JData.Internal.Messages.UpdateFail : JData.Internal.Messages.InsertFail;
                gridView._showError(msg);
            };

            var data = $.extend(row.get_dataItem(), edit_values);
            if (is_edit)
                dataSource.update(data, successedCallback, failedCallback);
            else
                dataSource.insert(data, successedCallback, failedCallback)
        });
    },

    _HandleInsert: function (row) {
        this._Save(row);
    },

    _HandleNew: function (beforeRow) {

        var editor = this._getEditor();
        if (editor != null) {
            $(editor.get_element()).dialog({
                width: 'auto',
                modal: true
            });
            return;
        }

        var state = JData.DataControlRowState.Normal | JData.DataControlRowState.Insert;

        var dataItem = {};
        for (var i = 0; i < this.get_columns().length; i++) {
            var column = this.get_columns()[i];
            if (JData.BoundField.isInstanceOfType(column)) {
                var defaultValue = column.get_defaultValue();
                dataItem[column.get_dataField()] = defaultValue;
            }
        }

        var properties = {
            parent: this,
            rowState: state,
            rowType: JData.DataControlRowType.DataRow,
            dataItem: dataItem
        };

        var index = 0;
        if (beforeRow != null)
            index = Array.indexOf(this.get_rows(), beforeRow) + 1;

        this.removeEmptyRow();
        var row = this._CreateRow(index, properties);
        row.changeMode(JData.DataFieldMode.Insert);
    },

    _HandlePage: function (pageIndex) {
        var h = this.get_events().getHandler('pageIndexChanging');
        if (h) {
            h(this, Sys.EventArgs.Empty);
        }

        var args = this._getSelectArgument();
        if (this.get_allowPaging()) {
            args.set_maximumRows(this.get_pageSize());
            Sys.Debug.assert(pageIndex >= 0);
            args.set_startRowIndex(pageIndex * this.get_pageSize());
        }
        this._getClientDataSource().select(args);
    },

    _HandleSelect: function (row) {
        var RowState = JData.DataControlRowState;
        if ((row.get_rowState() & RowState.Selected) == RowState.Selected)
            return;

        var h = this.get_events().getHandler('rowSelecting');
        if (h) h(this, { row: row });

        row[this._ROW_SELECTED_FIELD] = true;
        var state = row.get_rowState() | RowState.Selected;
        row.set_rowState(state);

        var style = this._GetRowStyle(row);
        row.applyStyle(style);

        h = this.get_events().getHandler('rowSelected');
        if (h) h(this, { row: row });
    },

    _HandleUnselect: function (row) {
        var RowState = JData.DataControlRowState;
        if ((row.get_rowState() & RowState.Selected) != RowState.Selected)
            return;

        var h = this.get_events().getHandler('rowUnselecting');
        if (h) h(this, { row: row });

        row[this._ROW_SELECTED_FIELD] = false;
        var state = row.get_rowState() & ~JData.DataControlRowState.Selected;
        row.set_rowState(state);

        var style = this._GetRowStyle(row);
        row.applyStyle(style);

        h = this.get_events().getHandler('rowUnselected');
        if (h) h(this, { row: row });
    },

    _HandleSort: function (sortExpression, sortDirection) {
        /// <param name="sortExpression" type="string">
        /// </param>
        /// <param name="sortDirection" type="string">
        /// use asc or desc
        /// </param>
        var h = this.get_events().getHandler('sorting');
        if (h) h(this, {});

        var args = this._getSelectArgument();
        if (sortDirection == 'desc')
            args.set_sortExpression(sortExpression + ' desc');
        else
            args.set_sortExpression(sortExpression + ' asc');

        this._HandlePage(this.get_pageIndex());

        var h = this.get_events().getHandler('sorted');
        if (h) h(this, { expression: args.get_sortExpression() });

    },

    _HandleUpdate: function (row) {
        this._Save(row);
    },

    _MaxColSpan: function () {
        var count = 0;
        for (var i = 0; i < this.get_columns().length; i++) {
            if (this.get_columns()[i].get_visible())
                count = count + 1;
        }
        return count;
    },

    initialize: function () {

        this._ApplyStyle();
        this._CreateCaption();
        this._CreateHeader();
        this.createEmptyRow();
        this._CreateFooter();
        this._HandlePage(0);
    }

}

JData.GridView.registerClass('JData.GridView', JData.Internal.DataBoundTable);

//================================== GridViewRow ============================================

JData.Internal.GridViewRow = function (element) {
    JData.Internal.GridViewRow.initializeBase(this, new Array(element));
    this._dataItem = {};
    this.set_rowState(JData.DataControlRowState.Normal);
    this._cells = new Array();
};

JData.Internal.GridViewRow.prototype = {

    get_rowState: function () {
        ///	<returns type="JData.DataControlRowState" />
        return this._rowState;
    },
    set_rowState: function (value) {
        /// <param name="value" type="JData.DataControlRowState"/>
        this._rowState = value;
    },

    get_rowType: function () {
        ///	<returns type="JData.DataControlRowType" />
        return this._rowType;
    },
    set_rowType: function (value) {
        /// <param name="value" type="JData.DataControlRowType"/>
        //JData.DataControlRowType.isInstanceOfType(value);
        this._rowType = value;
    },

    get_cells: function () {
        /// <returns type="Array"/>
        return this._cells;
    },

    get_rowIndex: function () {

        Sys.Debug.assert(this.get_rowType() == JData.DataControlRowType.DataRow);
        var result;
        var sourceIndex = this.get_element().rowIndex;
        if (sourceIndex < 0)
            throw Error.create('The row is removed.');

        result = sourceIndex - this.get_parent().get_headerRows().length;
        return result;
    },

    remove: function () {
        this.get_parent().removeRow(this);
    },

    //===================== Properties =============================

    get_dataItem: function () {
        return this._dataItem;
    },
    set_dataItem: function (value) {
        var obj1 = {};
        var obj2 = {};

        var allFields = new Array();
        if (value != null) {
            for (var col in value)
                Array.add(allFields, col);
            obj1 = value;
        }

        if (this.get_dataItem() != null) {
            for (var col in this.get_dataItem()) {
                if (Array.contains(allFields, col) == false)
                    Array.add(allFields, col);
            }
            obj2 = this.get_dataItem();
        }

        var fields = new Array();
        for (var i = 0; i < allFields.length; i++) {
            var col = allFields[i];
            if (obj1[col] != obj2[col]) {
                Array.add(fields, col);
            }
        }

        if (fields.length > 0) {
            this._dataItem = value;
            $(this.get_element()).data('dataItem', value);

            var h = this.get_events().getHandler('valueChanged');
            var args = new Sys.EventArgs();
            args.fields = fields;
            if (h) h(this, args);
        }


    },

    isEdit: function () {
        return (this.get_rowState() & JData.DataControlRowState.Edit) == JData.DataControlRowState.Edit;
    },

    get_currentMode: function () {
        return this._currentMode;
    },

    changeMode: function (mode) {
        /// <param name="mode" type="JData.DataFieldMode"/>

        if (mode == this.get_currentMode())
            return;

        var h = this.get_events().getHandler('modeChanging');
        if (h) h(this, { mode: mode });

        for (var i = 0; i < this.get_cells().length; i++) {
            var cell = this.get_cells()[i];
            if (JData.Internal.EditableCell.isInstanceOfType(cell) == false ||
                cell.get_containingField().get_readOnly())
                continue;

            if (mode != JData.DataFieldMode.ReadOnly)
                cell.beginEdit();
            else
                cell.endEdit();
        }
        this._currentMode = mode;

        var h = this.get_events().getHandler('modeChanged');
        if (h) h(this, { mode: mode });
    },

    get_selected: function () {
        return this.$selected == true;
    },

    //===================== EVENTS =============================

    add_modeChanging: function (handler) {
        this.get_events().addHandler('modeChanging', handler);
    },
    remove_modeChanging: function (handler) {
        this.get_events().removeHandler('modeChanging', handler);
    },

    add_modeChanged: function (handler) {
        this.get_events().addHandler('modeChanged', handler);
    },
    remove_modeChanged: function (handler) {
        this.get_events().removeHandler('modeChanged', handler);
    },

    //==========================================================

    _createCells: function () {
        var gridView = this.get_parent();
        var columns = gridView.get_columns();
        for (var j = 0; j < columns.length; j++) {
            var col = columns[j];

            var cell = col._CreateCell(this);
            if (cell != null) {
                cell.set_parent(this);
                Array.add(this.get_cells(), cell);
            }

            if (col.get_visible() == false) {
                cell.set_visible(false);
            }
        }
    },

    validate: function (successedCallback, failedCallback) {
        if (successedCallback == null)
            throw Error.argumentNull('successedCallback');

        successedCallback();
    },

    initialize: function () {
        var rowState = this.get_rowState();
        this._currentMode = JData.DataFieldMode.ReadOnly;
        this._createCells();
    }
};

JData.Internal.GridViewRow.registerClass('JData.Internal.GridViewRow', JData.Internal.TableRow);

//================================ GridViewHeaderRow ================================

JData.Internal.GridViewHeaderRow = function (element) {
    JData.Internal.GridViewHeaderRow.initializeBase(this, new Array(element));
    this._setDirect('asc');
}

JData.Internal.GridViewHeaderRow.prototype = {
    _getDirect: function () {
        return this._direct;
    },
    _setDirect: function (string) {
        this._direct = string;
    },

    _createCells: function () {
        var gridView = this.get_parent();
        var row = this;
        var columns = gridView.get_columns();
        for (var j = 0; j < columns.length; j++) {
            var column = columns[j];
            var htmlRow = this.get_element();
            var cellElement = document.createElement('th'); //htmlRow.insertCell(htmlRow.cells.length);
            htmlRow.appendChild(cellElement);
            var cell = column._CreateHeaderCell(cellElement);
            if (cell != null)
                Array.add(this.get_cells(), cell);

            if (column.get_visible() == false) {
                cell.set_visible(false);
            }
        }
    },
    initialize: function () {
        this._createCells();
    }
}

JData.Internal.GridViewHeaderRow.registerClass('JData.Internal.GridViewHeaderRow', JData.Internal.TableRow);

//================================ GridViewFooterRow ================================

JData.Internal.GridViewFooterRow = function (element) {
    JData.Internal.GridViewFooterRow.initializeBase(this, new Array(element));
}

JData.Internal.GridViewFooterRow.prototype = {
    _createCells: function () {
        var gridView = this.get_parent();
        var gridView = this.get_parent();
        var columns = this.get_parent().get_columns();
        for (var j = 0; j < columns.length; j++) {
            var cell = this.createCell(columns[j]);
            cell.set_text(columns[j].get_footerText());

            if (columns[j].get_visible() == false) {
                cell.set_visible(false);
            }
        }
    },
    initialize: function () {
        this._createCells();
    }
}

JData.Internal.GridViewFooterRow.registerClass('JData.Internal.GridViewFooterRow', JData.Internal.GridViewRow);

//=========================== SingleCellRow ===========================

JData.Internal.SingleCellRow = function (element) {
    JData.Internal.SingleCellRow.initializeBase(this, new Array(element));
};

JData.Internal.SingleCellRow.prototype = {
    get_cellText: function () {
        return this._cellText;
    },
    set_cellText: function (value) {
        this._cellText = value;
    },

    get_text: function () {
        return this.get_cellText();
    },
    set_text: function (value) {
        this.set_cellText(value);
    },

    initialize: function () {
        var cell = this.createCell();
        cell.set_text(this.get_cellText());
        //if (this.get_parent().get_columns != null)
        //    var length = this.get_parent().get_columns().length;
        //else {
        var length = 300;
        //if (this.get_parent()._MaxColSpan != null) {
        var a = this.get_parent()._MaxColSpan();
        if (a != null && a > 0)
            length = a;
        //}
        //}

        //if (length > 0)
        cell.get_element().colSpan = length; //$(cell.get_element()).attr('colSpan', length);
    }
};

JData.Internal.SingleCellRow.registerClass('JData.Internal.SingleCellRow', JData.Internal.TableRow);

//=========================== EmptyGridViewRow ===========================

JData.Internal.EmptyGridViewRow = function (element) {
    if (element == null)
        throw Error.argumentNull('element');

    JData.Internal.EmptyGridViewRow.initializeBase(this, new Array(element));

    this.set_text('Loading...');
}

JData.Internal.EmptyGridViewRow.prototype = {

}

JData.Internal.EmptyGridViewRow.registerClass('JData.Internal.EmptyGridViewRow', JData.Internal.SingleCellRow);

//====================================================================================











Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

JData.DetailsView = function (element) {

    JData.DetailsView.initializeBase(this, [element]);
    $.data(element, Object.getTypeName(this), this);

    this._fieldHeaderStyle = new JData.TableItemStyle();
    this.set_defaultMode(JData.DataFieldMode.ReadOnly);
    this._mode = JData.DataFieldMode.ReadOnly;
    this._commandRowStyle = new JData.TableItemStyle();
    this._commandRows = new Array();

    this.add_dataSourceChanging(function (sender, args) {
        var dataSource = args.dataSource;
        if (dataSource == null)
            return;

        var detailsView = sender;
        if (detailsView._proxy_onDataSourceSelect != null) {
            dataSource.remove_selected(detailsView._proxy_onDataSourceSelect);
        }
    });

    this.add_dataSourceChanged(function (sender, args) {
        var dataSource = args.dataSource;
        if (dataSource == null)
            return;

        var detailsView = sender;
        detailsView._proxy_onDataSourceSelect = $.proxy(detailsView._onDataSourceSelect, detailsView);
        dataSource.add_selected(detailsView._proxy_onDataSourceSelect);
    });
};

JData.DetailsView.prototype = {
    _onDataSourceSelect: function (sender, obj) {
        var items = obj.items;
        var args = obj.selectArguments;
        var dataSource = sender;

        var total;
        if (dataSource.canRetrieveTotalRowCount()) {
            total = args.get_totalRowCount();
            if (total == null)
                throw Error.argumentNull('args.totalRowCount');
        } else if (dataSource.canPage() == false) {
            total = items.length;
        }
        var pageIndex = Math.ceil(args.get_startRowIndex() / args.get_maximumRows());
        var detailsView = this;
        detailsView._set_pageIndex(pageIndex);
        detailsView._set_totalRowCount(total);
        detailsView._CreateRows(items);
        detailsView.changeMode(detailsView.get_defaultMode());
    },
    get_commandRowStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of a command row in a DetailsView control.
        /// </summary>
        /// <returns type="JData.TableItemStyle"/>
        return this._commandRowStyle;
    },
    set_commandRowStyle: function (value) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of a command row in a DetailsView control.
        /// </summary>
        /// <param name="value" type="JData.TableItemStyle"/>
        this._commandRowStyle = value;
    },

    get_dataItem: function () {
        /// <summary>
        /// Gets the data item bound to the DetailsView control.
        /// </summary>
        /// <returns type="Object"/>
        return this._dataItem;
    },

    get_fieldHeaderStyle: function () {
        /// <summary>
        /// Gets a reference to the TableItemStyle object that allows you to set the appearance of the header column in a DetailsView control.
        /// </summary>
        /// <returns type="JData.TableItemStyle"/>
        return this._fieldHeaderStyle;
    },
    set_fieldHeaderStyle: function (style) {
        /// <summary>
        /// Sets a reference to the TableItemStyle object that allows you to set the appearance of the header column in a DetailsView control.
        /// </summary>
        /// <param name="value" type="JData.TableItemStyle"/>
        this._fieldHeaderStyle = style;
    },

    get_fields: function () {
        /// <summary>
        /// Gets a collection of DataControlField objects that represent the explicitly declared row fields in a DetailsView control.
        /// </summary>
        /// <return type="Array"/>
        return this._fields();
    },
    set_fields: function (value) {
        /// <summary>
        /// Sets a collection of DataControlField objects that represent the explicitly declared row fields in a DetailsView control.
        /// </summary>
        /// <param name="value" type="Array"/>
        this._fields(value);
    },

    get_footerText: function () {
        /// <summary>
        /// Gets the text to display in the footer row of a DetailsView control.
        /// </summary>
        /// <returns type="String"/>
        return this._footerText;
    },
    set_footerText: function (value) {
        /// <summary>
        /// Sets the text to display in the footer row of a DetailsView control.
        /// </summary>
        /// <param name="value" type="String"/>
        this._footerText = value;
    },

    get_headerText: function () {
        /// <summary>
        /// Gets the text to display in the header row of a DetailsView control.
        /// </summary>
        /// <returns type="String"/>
        return this._headerText;
    },
    set_headerText: function (value) {
        /// <summary>
        /// Sets the text to display in the header row of a DetailsView control.
        /// </summary>
        /// <param name="value" type="String"/>
        this._headerText = value;
    },

    get_pageSize: function () {
        /// <summary>
        /// Gets the number of records to display on a page in a DetailsView control, the number is one.
        /// </summary>
        return 1;
    },

    get_showHeader: function () {
        /// <summary>
        /// Gets a value indicating whether the header row is displayed in a DetailsView control.
        /// </summary>
        /// <returns type="Boolean"/>
        return this.get_headerText() != null;
    },

    get_showFooter: function () {
        /// <summary>
        /// Gets a value indicating whether the footer row is displayed in a DetailsView control.
        /// </summary>
        /// <returns type="Boolean"/>
        return this.get_footerText() != null
    },

    get_currentMode: function () {
        /// <summary>
        /// Gets the current data-entry mode of the DetailsView control.
        /// </summary>
        /// <returns type="JData.DataFieldMode"/>
        return this._mode;
    },

    get_defaultMode: function () {
        /// <summary>
        /// Get the default data-entry mode of the DetailsView control.
        /// </summary>
        /// <returns type="JData.DataFieldMode"/>
        return this._defaultMode;
    },

    set_defaultMode: function (value) {
        /// <summary>
        /// Sets the default data-entry mode of the DetailsView control.
        /// </summary>
        /// <param name="value" type="JData.DataFieldMode">
        /// readOnly, edit, insert
        /// </param>
        this._defaultMode = value;
    },

    //==================== Events ======================
    add_modeChanging: function (handler) {
        /// <summary>
        /// Occurs when a DetailsView control attempts to change between edit, insert, and read-only mode, but before the DetailsView.CurrentMode property is updated.
        /// </summary>
        this.get_events().addHandler('modeChanging', handler);
    },
    remove_modeChanging: function (handler) {
        /// <summary>
        /// Occurs when a DetailsView control attempts to change between edit, insert, and read-only mode, but before the DetailsView.CurrentMode property is updated.
        /// </summary>
        this.get_events().removeHandler('modeChanging', handler);
    },

    add_modeChanged: function (handler) {
        /// <summary>
        /// Occurs when a DetailsView control attempts to change between edit, insert, and read-only mode, but after the DetailsView.CurrentMode property is updated.
        /// </summary>
        this.get_events().addHandler('modeChanged', handler);
    },
    remove_modeChanged: function (handler) {
        /// <summary>
        /// Occurs when a DetailsView control attempts to change between edit, insert, and read-only mode, but after the DetailsView.CurrentMode property is updated.
        /// </summary>
        this.get_events().removeHandler('modeChanged', handler);
    },

    add_itemCancelingEdit: function (handler) {
        this.get_events().addHandler('itemCancelingEdit', handler);
    },
    remove_itemCancelingEdit: function (handler) {
        this.get_events().removeHandler('itemCancelingEdit', handler);
    },

    add_itemCanceledEdit: function (handler) {
        this.get_events().addHandler('itemCanceledEdit', handler);
    },
    remove_itemCanceledEdit: function (handler) {
        this.get_events().removeHandler('itemCanceledEdit', handler);
    },

    add_itemDeleted: function (handler) {
        /// <summary>
        /// Occurs when a Delete button within a DetailsView control is clicked, but after the delete operation.
        /// </summary>
        this.get_events().addHandler('itemDeleted', handler);
    },
    remove_itemDeleted: function (handler) {
        /// <summary>
        /// Occurs when a Delete button within a DetailsView control is clicked, but after the delete operation.
        /// </summary>
        this.get_events().removeHandler('itemDeleted', handler);
    },

    add_itemDeleting: function (handler) {
        /// <summary>
        /// Occurs when a Delete button within a DetailsView control is clicked, but before the delete operation.
        /// </summary>
        this.get_events().addHandler('itemDeleting', handler);
    },
    remove_itemDeleting: function (handler) {
        /// <summary>
        /// Occurs when a Delete button within a DetailsView control is clicked, but before the delete operation.
        /// </summary>
        this.get_events().removeHandler('itemDeleting', handler);
    },

    add_itemInserted: function (handler) {
        /// <summary>
        /// Occurs when an Update button within a DetailsView control is clicked, but after the update operation.
        /// </summary>
        this.get_events().addHandler('itemInserted', handler);
    },
    remove_itemInserted: function (handler) {
        /// <summary>
        /// Occurs when an Update button within a DetailsView control is clicked, but after the update operation.
        /// </summary>
        this.get_events().removeHandler('itemInserted', handler);
    },

    add_itemInserting: function (handler) {
        /// <summary>
        /// Occurs when an Insert button within a DetailsView control is clicked, but before the insert operation.
        /// </summary>
        this.get_events().addHandler('itemInserting', handler);
    },
    remove_itemInserting: function (handler) {
        /// <summary>
        /// Occurs when an Insert button within a DetailsView control is clicked, but before the insert operation.
        /// </summary>
        this.get_events().removeHandler('itemInserting', handler);
    },

    add_itemUpdated: function (handler) {
        /// <summary>
        /// Occurs when an Update button within a DetailsView control is clicked, but after the update operation.
        /// </summary>
        this.get_events().addHandler('itemUpdated', handler);
    },
    remove_itemUpdated: function (handler) {
        /// <summary>
        /// Occurs when an Update button within a DetailsView control is clicked, but after the update operation.
        /// </summary>
        this.get_events().removeHandler('itemUpdated', handler);
    },

    add_itemUpdating: function (handler) {
        /// <summary>
        /// Occurs when an Update button within a DetailsView control is clicked, but before the update operation.
        /// </summary>
        this.get_events().addHandler('itemUpdating', handler);
    },
    remove_itemUpdating: function (handler) {
        /// <summary>
        /// Occurs when an Update button within a DetailsView control is clicked, but before the update operation.
        /// </summary>
        this.get_events().removeHandler('itemUpdating', handler);
    },

    add_pageIndexChanged: function (handler) {
        /// <summary>
        /// Occurs when the value of the PageIndex property changes after a paging operation.
        /// </summary>
        this.get_events().addHandler('pageIndexChanged', handler);
    },
    remove_pageIndexChanged: function (handler) {
        /// <summary>
        /// Occurs when the value of the PageIndex property changes after a paging operation.
        /// </summary>
        this.get_events().removeHandler('pageIndexChanged', handler);
    },

    add_pageIndexChanging: function (handler) {
        /// <summary>
        /// Occurs when the value of the PageIndex property changes before a paging operation.
        /// </summary>
        this.get_events().addHandler('pageIndexChanging', handler);
    },
    remove_pageIndexChanging: function (handler) {
        /// <summary>
        /// Occurs when the value of the PageIndex property changes before a paging operation.
        /// </summary>
        this.get_events().removeHandler('pageIndeChanging', handler);
    },

    //==================== Methods ======================

    changeMode: function (value) {
        /// <summary>
        /// Switches the DetailsView control to the specified mode.
        /// </summary>
        /// <param name="value" type="JData.DataFieldMode"/>

        if (this.get_currentMode() == value)
            return;

        var h = this.get_events().getHandler('modeChanging');
        if (h) h(this, { mode: value });

        switch (value) {
            case JData.DataFieldMode.Edit:
                for (var i = 0; i < this.get_rows().length; i++) {
                    var row = this.get_rows()[i];
                    if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row))
                        continue;

                    $(row.get_cells()).each(function () {
                        if (this.beginEdit != null)
                            this.beginEdit();
                    })
                }
                break;
            case JData.DataFieldMode.Insert:
                this._CreateRows([{}]);
                for (var i = 0; i < this.get_rows().length; i++) {
                    var row = this.get_rows()[i];
                    if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row))
                        continue;

                    for (var j = 0; j < row.get_cells().length; j++) {
                        if (row.get_cells()[j].beginEdit != null)
                            row.get_cells()[j].beginEdit();
                    }
                }
                break;
            case JData.DataFieldMode.ReadOnly:
                Sys.Debug.assert(this.get_currentMode() != JData.DataFieldMode.ReadOnly)
                for (var i = 0; i < this.get_rows().length; i++) {
                    var row = this.get_rows()[i];
                    if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row))
                        continue;
                    //row.get_cells()[1].endEdit();
                    $(row.get_cells()).each(function () {
                        if (this.endEdit != null)
                            this.endEdit();
                    })
                }
                break;
        }
        this._mode = value;

        var h = this.get_events().getHandler('modeChanged');
        if (h) h(this, { mode: value });
    },

    _GetRowType: function (index, properties) {
        /// <param name="index" type="Number">
        /// Index of the row.
        /// </param>
        /// <param name="properties" type="JSON">
        /// </param>
        /// <returns type="Type"/>
        if (index == null) throw Error.argumentNull('index');
        if (properties == null) throw Error.argumentNull('properties');
        if (properties.rowType == null) throw Error.argumentNull('properties.rowType');
        var detailView = this;
        switch (properties.rowType) {

            case JData.DataControlRowType.DataRow:
                return JData.Internal.DetailsViewRow;

            case JData.DataControlRowType.Footer:
                properties.cellText = this.get_footerText();
                return JData.Internal.SingleCellRow;

            case JData.DataControlRowType.Caption:
                return JData.Internal.SingleCellRow;

            case JData.DataControlRowType.Header:
                properties.cellText = this.get_headerText();
                return JData.Internal.DetailsViewHeaderRow;

            case JData.DataControlRowType.Pager:
                var mode = detailView.get_pagerSettings().get_mode();
                if (mode == JData.PagerButtons.NextPrevious ||
                    mode == JData.PagerButtons.NextPreviousFirstLast)
                    return JData.Internal.TextPagingBar;

                if (mode == JData.PagerButtons.Numeric ||
                    mode == JData.PagerButtons.NumericFirstLast)
                    return JData.Internal.NumberPagingBar;

            case JData.DataControlRowType.EmptyDataRow:
                return JData.EmptydetailsViewRow;
            case JData.DataControlRowType.Separator:
                break;
        }
        throw Error.notImplemented();
    },

    _CreateRows: function (items) {
        var detailView = this;
        while (detailView.get_rows().length > 0) {
            detailView._RemoveRow(detailView.get_rows()[0]);
        }

        this._commandRows = new Array();

        if (items.length > 0)
            detailView.removeEmptyRow();
        else {
            detailView.createEmptyRow();
            return;
        }

        var fields = this._visibleFields();
        var index = 0;
        this._dataItem = items[0];
        //==========================================================
        // 关于 rowType 的说明：
        // 所有随当前数据而变化的行，都为 DataRow。DetailsViewCommandRow 是需要随数据
        // 的变化而重创建。因为某些的 dataItem，仅允许更新，某些 dataItem，仅允许删除
        // 这些按钮都要跟随 dataItem 的变化而变化。
        //===========================================================
        for (var i = 0; i < fields.length; i++) {
            if (JData.BoundField.isInstanceOfType(fields[i])) {
                var properties = {
                    parent: this,
                    //dataItem: this.get_dataItem(),
                    rowType: JData.DataControlRowType.DataRow,
                    field: fields[i]
                };
                var row = this._CreateRow(index, properties);

                row.applyStyle(this._GetRowStyle(row));
                index = index + 1;
                row.get_cells()[0].applyStyle(this.get_fieldHeaderStyle());
            }
            else if (JData.CommandField.isInstanceOfType(fields[i])) {
                if (i != 0 && i != fields.length - 1)
                    throw Error.create('The position of command field must be first or lastest.');

                var properties = {
                    parent: this,
                    rowType: JData.DataControlRowType.DataRow,
                    field: fields[i]
                };
                var row = this._CreateRow(index, properties, JData.Internal.DetailsViewCommandRow);
                row.applyStyle(this.get_commandRowStyle());
                Array.add(this._commandRows, row);
            }
            else {
                throw Error.notImplemented(String.format('The "{0}" field is not supported', Object.getTypeName(fields[i])));
            }
        }
        //===========================================================

        this._mode = JData.DataFieldMode.ReadOnly;

        var h = this.get_events().getHandler('dataBound');
        if (h) h(this, {});
    },

    _HandleCancel: function () {
        var h = this.get_events().getHandler('itemCancelingEdit');
        if (h) h(this, {});

        if (this.get_currentMode() == JData.DataFieldMode.Insert && this.get_pageIndex() >= 0) {
            this._HandlePage(this.get_pageIndex());
        }
        else {
            this.changeMode(JData.DataFieldMode.ReadOnly);
        }

        var h = this.get_events().getHandler('itemCanceledEdit');
        if (h) h(this, {});
    },

    _HandleDelete: function () {
        var h = this.get_events().getHandler('itemDeleting');
        if (h) h(this, {});

        var dataSource = this._getClientDataSource();
        var detailsView = this;
        var success = function () {
            var h = detailsView.get_events().getHandler('itemDeleted');
            if (h) h(detailsView, {});
        }

        var fail = function (message) {
            detailsView._showError(message)
        };

        var result = dataSource['delete'](
            this.get_dataItem(),
            function () {
                if (success) success()

                if (detailsView.get_pageIndex() >= detailsView.get_pageCount() - 1) {
                    detailsView._HandlePage(0);
                }
                else
                    detailsView._HandlePage(detailsView.get_pageIndex());
            },
            fail
        );

    },

    _HandlePage: function (pageIndex) {
        Sys.Debug.assert(pageIndex >= 0, 'pageIndex should >= 0');

        this.changeMode(this.get_defaultMode());
        var detailView = this;

        this._set_pageIndex(pageIndex);

        args = this._getSelectArgument();
        if (this.get_allowPaging()) {
            args.set_maximumRows(this.get_pageSize());
            Sys.Debug.assert(this.get_pageIndex() >= 0);
            args.set_startRowIndex(this.get_pageIndex() * this.get_pageSize());
        }
        this._getClientDataSource().select(args);
    },

    _HandleEdit: function () {
        this.changeMode(JData.DataFieldMode.Edit);
    },

    _updateDataItem: function (returnItem) {
        Sys.Debug.assert(returnItem != null);

        var dataItem = this.get_dataItem();
        $.extend(dataItem, returnItem);
    },

    _HandleInsert: function () {
        var h = this.get_events().getHandler('itemInserting');
        if (h) h(this, { row: row });

        var detailView = this;

        this.validate(function () {

            var dataSource = detailView._getClientDataSource();
            var cells = new Array();
            var readOnlyCells = new Array();
            var newItem = detailView.get_dataItem();

            for (var i = 0; i < detailView.get_rows().length; i++) {
                var row = detailView.get_rows()[i];
                for (var j = 0; j < row.get_cells().length; j++) {
                    var cell = row.get_cells()[j];
                    if (JData.Internal.EditableCell.isInstanceOfType(cell) == false)
                        continue;

                    if (cell.get_containingField().get_readOnly())
                        Array.add(readOnlyCells, cell);
                    else
                        Array.add(cells, cell);
                }
            }

            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                var col = cell.get_containingField();
                newItem[col.get_dataField()] = cell.get_controlValue();
            }



            var successedCallback = function (returnItem) {

                for (var i = 0; i < cells.length; i++) {
                    cells[i].pushValue();
                }

                if (returnItem != null)
                    detailView._updateDataItem(returnItem);

                detailView.changeMode(detailView.get_defaultMode());
                if (detailView.get_defaultMode() == JData.DataFieldMode.ReadOnly) {
                    for (var i = 0; i < readOnlyCells.length; i++)
                        readOnlyCells[i].set_value();
                }

                var h = detailView.get_events().getHandler('itemInserted');
                if (h) h(detailView, {});
            };

            var failedCallback = function (error) {
                if (error.processed == true)
                    return;

                var message = JData.Internal.Messages.InsertFail;
                detailView._showError(message);
            };

            dataSource.insert(newItem, successedCallback, failedCallback)

        });

    },

    _HandleNew: function () {
        this.changeMode(JData.DataFieldMode.Insert);
    },

    //Virtual Method
    validate: function (successedCallback, failedCallback) {
        if (successedCallback == null)
            throw Error.argumentNull('successedCallback');

        successedCallback();
    },

    _HandleUpdate: function () {
        if (this.get_currentMode() != JData.DataFieldMode.Edit)
            return;

        var h = this.get_events().getHandler('itemUpdating');
        if (h) h(this, {});

        var cells = new Array();
        var oldItem = {};
        for (var key in this.get_dataItem()) {
            oldItem[key] = this.get_dataItem()[key];
        }

        var detailsView = this;
        this.validate(function () {
            for (var j = 0; j < detailsView.get_rows().length; j++) {
                var row = detailsView.get_rows()[j];
                for (var i = 0; i < row.get_cells().length; i++) {
                    var cell = row.get_cells()[i];
                    if (JData.Internal.EditableCell.isInstanceOfType(cell) && !cell.get_containingField().get_readOnly()) {
                        cell.pushValue();
                    }
                }
            }

            var dataSource = detailsView._getClientDataSource();
            var successedCallback = function () {
                detailsView.changeMode(detailsView.get_defaultMode());

                var h = detailsView.get_events().getHandler('itemUpdated');
                if (h) h(detailsView, {});
            };

            var failedCallback = function (message) {
                for (var key in detailsView.get_dataItem()) {
                    detailsView.get_dataItem()[key] = oldItem[key];
                }
                detailsView._showError(message);
            };

            dataSource.update(detailsView.get_dataItem(), successedCallback, failedCallback);
        })
    },

    _MaxColSpan: function () {
        return 2;
    },

    initialize: function () {
        //JData.DetailsView.initializeBase(this);
        this._ApplyStyle();
        this._CreateCaption();
        this._CreateHeader();
        //this.createEmptyRow();
        this._CreateFooter();

        if (this.get_defaultMode() == JData.DataFieldMode.Insert)
            this.changeMode(JData.DataFieldMode.Insert)
        else
            this._HandlePage(0);

    }

}

JData.DetailsView.registerClass('JData.DetailsView', JData.Internal.DataBoundTable);

//================================ DetailsViewRow ================================

JData.Internal.DetailsViewRow = function (element) {

    if (element == null)
        throw Error.argumentNull();

    JData.Internal.DetailsViewRow.initializeBase(this, new Array(element));
};

JData.Internal.DetailsViewRow.prototype = {
    initialize: function () {
        Sys.Debug.assert(this.get_field() != null);

        var element = this.get_element();
        $(element).data('dataItem', this.get_dataItem());

        var field = this.get_field();
        Sys.Debug.assert(JData.BoundField.isInstanceOfType(field));
        var cell = field._CreateHeaderCell(element.insertCell(0));
        Array.add(this.get_cells(), cell);

        var cellElement = this.get_element().insertCell(this.get_element().cells.length);
        cell = field._CreateCell(cellElement);
        Array.add(this.get_cells(), cell);


    },

    get_cells: function () {
        if (this._cells == null)
            this._cells = new Array();

        return this._cells;
    },

    get_field: function () {
        /// <return type="JData.Internal.DataControlField"/>
        return this._field;
    },
    set_field: function (value) {
        this._field = value;
    },

    get_dataItem: function () {
        return this.get_parent().get_dataItem();
    },

    get_rowIndex: function () {
        return Array.indexOf(this.get_parent().get_rows(), this);
    },

    //==================== Events ======================

    add_valueChanged: function (handler) {
        this.get_events().addHandler('valueChanged', handler);
    },
    remove_valueChanged: function (handler) {
        this.get_events().removeHandler('valueChanged', handler);
    }
};

JData.Internal.DetailsViewRow.registerClass('JData.Internal.DetailsViewRow', JData.Internal.TableRow);

//===============================================================================

JData.Internal.DetailsViewHeaderRow = function (element) {

    if (element == null)
        throw Error.argumentNull(element);

    JData.Internal.DetailsViewHeaderRow.initializeBase(this, new Array(element));

    //var cellElement = document.createElement('th'); //this.get_element().insertCell(0);
    //this.get_element().appendChild(cellElement);
    //cellElement.colSpan = '2';
    //cellElement.innerHTML = this.get_headerText();
    //var cell = $create(JData.Internal.DataControlFieldCell, { parent: this }, null, null, cellElement);
    //Array.add(this.get_cells(), cell);
}

JData.Internal.DetailsViewHeaderRow.prototype = {
    createCell: function () {
        var rowElement = this.get_element();
        var cellElement = document.createElement('th');//rowElement.insertCell(rowElement.cells.length);
        rowElement.appendChild(cellElement);
        var cell = $create(JData.Internal.TableCell, null, null, null, cellElement);
        Array.add(this.get_cells(), cell);
        return cell;
    },
    initialize: function () {
        JData.Internal.DetailsViewHeaderRow.callBaseMethod(this, 'initialize');
    }
}

JData.Internal.DetailsViewHeaderRow.registerClass('JData.Internal.DetailsViewHeaderRow', JData.Internal.SingleCellRow);

//===============================================================================


JData.Internal.DetailsViewFooterRow = function (element) {
    JData.Internal.DetailsViewFooterRow.initializeBase(this, new Array(element));

    var cellElement = this.get_element().insertCell(0);
    cellElement.colSpan = '2'; //$(cellElement).attr('colspan', '2');
    var cell = $create(JData.Internal.DataControlFieldCell, { parent: this }, null, null, cellElement);
    Array.add(this.get_cells(), cell);
}

JData.Internal.DetailsViewFooterRow.prototype = {

}

JData.Internal.DetailsViewFooterRow.registerClass('JData.Internal.DetailsViewFooterRow', JData.Internal.TableRow);


//================================== DetailsViewRow ==================================

JData.Internal.DetailsViewCommandRow = function (element) {
    JData.Internal.DetailsViewCommandRow.initializeBase(this, new Array(element));
};

JData.Internal.DetailsViewCommandRow.prototype = {

    //==================== Events ======================

    add_modeChanged: function (handler) {
        this.get_parent().add_modeChanged(handler);
    },

    add_modeChanging: function (handler) {
        this.get_parent().add_modeChanging(handler);
    },

    //==================== Properties ======================

    get_field: function () {
        return this._field
    },
    set_field: function (value) {
        this._field = value;
    },

    get_currentMode: function () {
        return this.get_parent().get_currentMode();
    },

    get_dataItem: function () {
        return this.get_parent().get_dataItem();
    },
    //==================== Methods ======================

    initialize: function () {
        var cellElement = this.get_element().insertCell(0);
        cellElement.colSpan = this.get_parent()._MaxColSpan();
        var cell = this.get_field()._CreateCell(cellElement);
        cell.set_parent(this);
        Array.add(this.get_cells(), cell);
        var row = this;
        this.get_parent().add_pageIndexChanged(function () {
            var h = row.get_events().getHandler('valueChanged');
            if (h) h(row, { dataItem: row.get_dataItem() });
        });
    }
};

JData.Internal.DetailsViewCommandRow.registerClass('JData.Internal.DetailsViewCommandRow', JData.Internal.TableRow);

//====================================================================================




JData.FormView = function (element) {
    JData.FormView.initializeBase(this, [element]);
    Sys.Debug.assert(element.tagName == 'TABLE');


}

JData.FormView.prototype = {
    initialize: function () {

        //===========================================================
        //必须在调用基类的 initialize 方法前，创建 rows
        var headerRows = this.get_headerRows();
        for (var i = 0; i < this.get_element().rows.length - headerRows.length; i++) {
            var elementIndex = i + headerRows.length;
            var row = this._CreateRow(i, { element: this.get_element().rows[elementIndex], rowType: JData.DataControlRowType.DataRow }, JData.FormViewRow);
        }
        //============================================================
        JData.FormView.callBaseMethod(this, 'initialize');
        var rows = this.get_rows();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.get_rowType() == JData.DataControlRowType.DataRow) {
                var style = this._GetRowStyle(row);
                row.applyStyle(style);
            }
        }
        //if (this.get_defaultMode() == JData.DataFieldMode.Insert)
        //    this.changeMode(JData.DataFieldMode.Insert)
        //else
        //    this._HandlePage(0);
    },

    get_dataItem: function () {
        return this._dataItem;
    },

    _Render: function () {

        this._ApplyStyle();
        this._CreateCaption();
        this._CreateHeader();
        this._CreateFooter();
        this._HandlePage(0);
    },

    _MaxColSpan: function () {
        var max_cells_number = 2;
        var rows = this.get_element().rows;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].cells.length > max_cells_number) {
                max_cells_number = rows[i].cells.length;
            }
        }
        return max_cells_number;
    },

    //=======================================
    createEmptyRow: function () {
        for (var i = 0; i < this.get_rows().length; i++) {
            var row = this.get_rows()[i];
            row.set_visible(false);
        }
        return JData.FormView.callBaseMethod(this, 'createEmptyRow');

    },
    //=======================================
    _RemoveRow: function (row) {
        if (row == null)
            throw Error.argumentNull('row');

        if (JData.DataControlRowType.DataRow == row.get_rowType()) {
            var h = this.get_events().getHandler('rowRemoving');
            if (h) h(this, { row: row });
        }

        var rows;
        switch (row.get_rowType()) {
            case JData.DataControlRowType.Header:
            case JData.DataControlRowType.EmptyDataRow:
                rows = this.get_headerRows();
                this.get_element().deleteRow(row.get_element().rowIndex);
                break;
            case JData.DataControlRowType.DataRow:
                rows = this.get_rows();
                var rowElement = row.get_element();
                for (var i = 0; i < rowElement.cells.length; i++) {
                    var cellElement = rowElement.cells[i];
                    if (cellElement.control != null) {
                        cellElement.control.dispose();
                        cellElement.control = undefined;
                    }
                }
                rowElement.control.dispose();
                rowElement.control = undefined;
                if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row)) {
                    this.get_element().deleteRow(rowElement.rowIndex);
                }
                break;
            case JData.DataControlRowType.Pager:
            case JData.DataControlRowType.Footer:
                rows = this.get_footerRows();
                this.get_element().deleteRow(row.get_element().rowIndex);
                break;
            default:
                throw Error.notImplemented();
        }

        Array.remove(rows, row);

        if (JData.DataControlRowType.DataRow == row.get_rowType()) {
            var h = this.get_events().getHandler('rowRemoved');
            if (h) h(this, { row: row });
        }

        row.dispose();

    },

    _getField: function (fieldName) {
        var field;
        for (var i = 0; i < this.get_fields().length; i++) {
            if (this.get_fields()[i].get_name() == fieldName) {
                field = this.get_fields()[i];
                break;
            }
        }

        if (field == null)
            throw Error.create(String.format('Field "{0}" is not exists.', fieldName));

        return field;
    },

    _CreateRows: function (items) {
        if (items.length > 0)
            this.removeEmptyRow();
        else {
            this.createEmptyRow();
            return;
        }

        var item = items[0];
        this._dataItem = item;

        var rows = this.get_rows();
        while (rows.length > 0) {
            this._RemoveRow(rows[0]);
        }
        this._mode = JData.DataFieldMode.ReadOnly;
        var table = this;

        var headerRows = this.get_headerRows();
        var footerRows = this.get_footerRows();
        for (var i = 0; i < this.get_element().rows.length - headerRows.length - footerRows.length; i++) {
            var elementIndex = i + headerRows.length;
            var row = this._CreateRow(i, { element: this.get_element().rows[elementIndex], rowType: JData.DataControlRowType.DataRow, visible: true }, JData.FormViewRow);
            $(row.get_element().cells).each(function () {
                var cellElement = this;
                var cell;

                var valueField = $(cellElement).attr('field-value');
                var headerField = $(cellElement).attr('field-header');
                if (valueField != null) {
                    var field = table._getField(valueField);
                    this.innerHTML = '';
                    cell = field._CreateCell(this);
                }
                else if (headerField != null) {
                    var field = table._getField(headerField);
                    this.innerHTML = '';
                    cell = field._CreateHeaderCell(this);
                    cell.applyStyle(table.get_fieldHeaderStyle());
                }
                else {
                    cell = new JData.Internal.TableCell(cellElement);
                }

                Array.add(row.get_cells(), cell);
            })

        }

        //==================================================================
        // 创建命令按钮

        var command_field;
        $(table.get_fields()).each(function () {
            if (JData.CommandField.isInstanceOfType(this)) {
                command_field = this;
            }
        })

        if (command_field != null) {
            var index = this.get_rows().length;
            var properties = {
                parent: this,
                rowType: JData.DataControlRowType.DataRow,
                field: command_field
            };
            this.commandRow = this._CreateRow(index, properties, JData.Internal.DetailsViewCommandRow);
            this.commandRow.applyStyle(this.get_commandRowStyle());
        }

        //==================================================================

        var h = this.get_events().getHandler('dataBound');
        if (h) h(this, {});

        this.changeMode(this.get_defaultMode());
    }
}

JData.FormView.registerClass('JData.FormView', JData.DetailsView);

JData.FormViewRow = function (element) {
    JData.FormViewRow.initializeBase(this, [element]);
    this.set_rowType(JData.DataControlRowType.DataRow);
};
JData.FormViewRow.prototype = {
    initialize: function () {
        JData.FormViewRow.callBaseMethod(this, 'initialize');

        $(this.get_element()).data('dataItem', this.get_dataItem());
    },

    get_currentMode: function () {
        /// <returns type="JData.DataFieldMode"/>
        return this._mode;
    },

    get_dataItem: function () {
        return this.get_parent().get_dataItem();
    },

    changeMode: function (value) {
        /// <param name="value" type="JData.DataFieldMode"/>
        //if(this.get_defaultMode() == JData.DataFieldMode.Insert)
        if (this.get_currentMode() == value && this.get_defaultMode() != JData.DataFieldMode.Insert)
            return;

        var h = this.get_events().getHandler('modeChanging');
        if (h) h(this, { mode: value });

        switch (value) {
            case JData.DataFieldMode.Edit:
                for (var i = 0; i < this.get_rows().length; i++) {
                    var row = this.get_rows()[i];
                    if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row))
                        continue;

                    $(row.get_cells()).each(function () {
                        if (this.beginEdit != null)
                            this.beginEdit();
                    })
                }
                break;
            case JData.DataFieldMode.Insert:
                this._CreateRows([{}]);
                for (var i = 0; i < this.get_rows().length; i++) {
                    var row = this.get_rows()[i];
                    if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row))
                        continue;
                    row.get_cells()[1].beginEdit();
                }
                break;
            case JData.DataFieldMode.ReadOnly:
                Sys.Debug.assert(this.get_currentMode() != JData.DataFieldMode.ReadOnly)
                for (var i = 0; i < this.get_rows().length; i++) {
                    var row = this.get_rows()[i];
                    if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(row))
                        continue;
                    //row.get_cells()[1].endEdit();
                    $(row.get_cells()).each(function () {
                        if (this.endEdit != null)
                            this.endEdit();
                    })
                }
                break;
        }
        this._mode = value;

        var h = this.get_events().getHandler('modeChanged');
        if (h) h(this, { mode: value });
    },

    //==================== Events ======================

    add_modeChanged: function (handler) {
        this.get_events().addHandler('modeChanged', handler);
    },
    remove_modeChanged: function (handler) {
        this.get_events().removeHandler('modeChanged', handler);
    }

}
JData.FormViewRow.registerClass('JData.FormViewRow', JData.Internal.TableRow);

Type.registerNamespace("JData.Internal");

JData.Internal.Strings = (function () {
    return {
        Cancel: 'Cancel',
        Confirm: 'Confirm', //确认
        Delete: 'Delete',
        Edit: 'Edit',
        Fail: 'Fail',//失败
        Insert: 'Insert',
        New: 'New',
        Select: 'Select',
        Success: 'Success', //成功
        Update: 'Update',
        UnSelect: 'Unselect',
        Dialog: {
            Error: 'Error',
            Success: 'Success',
            Confirm: 'Confirm',
            OK: 'OK',
            Cancel: 'Cancel'
        },
        CheckBoxField: {
            TrueValue: 'Yes',
            FalseValue: 'No'
        }
    }
})()

JData.Internal.Messages = (function () {
    return {
        NoPaging: 'The data source does not support server-side data paging.',
        NoPrimaryKes: 'Primary keys is not defined.',
        NoRowCount: 'The data source does not support retrieving the number of rows of data.',
        NoSorting: 'The data source does not support sorting.',
        CanNotUpdateDataItem: 'The data item could not be update.',
        CanNotInsertDataItem: 'A data item could not be insert.',
        CanNotDeleteDataItem: 'The data item could not be delete.',
        CanNotEditDataItem: 'The data item could not be edit.',
        CanNotCreateDataItem: 'A data item could not be create.',
        PrimaryKeyValueCanntNull: 'The primary value can not be null.',
        UpdateFail: 'Update the record fail',
        InsertFail: 'Insert the record fail'
    }
})()


Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");

JData.Internal.Error = function () {
};

JData.Internal.Error.prototype = {

};



//========================================================================

JData.Internal.Error.DataSourceView = (function () {
    return {
        NoPaging: function () {
            return Error.create(JData.Internal.Messages.NoPaging);
        },
        NoRowCount: function () {
            return Error.create(JData.Internal.Messages.NoRowCount);
        },
        NoSorting: function () {
            return Error.create(JData.Internal.Messages.NoSorting);
        },
        ErrorMaximumRows: function (value) {
            return Error.argumentOutOfRange('maximumRows', value);
        }
    };
})();


JData.Internal.Error.NullDataSource = function () {
    return Error.create('Data source can not be null.');
};

JData.Internal.Error.GridViewDataSourceCanNotNull = function () {
    return Error.create('The gridView data source can not be null.');
};

JData.Internal.Error.ElementNotExists = function (elementId) {
    return Error.create(String.format('The element with id "{0}" is not exists.', elementId));
};

JData.Internal.Error.NotEvent = function (instance, eventName) {
    Sys.Debug.assert(instance != null);
    Sys.Debug.assert(eventName != null);
    return Error.create(String.format('"{0}" instance does not has a "{1}" envent.', Object.getTypeName(instance), eventName));
};

//========================================================================
JData.Internal.Error.ODataSource = (function () {
    return {
        NoPrimaryKes: function () {
            return Error.create(JData.Internal.Messages.NoPrimaryKes);
        },
        PrimaryValueCanntNull: function () {
            return Error.create(JData.Internal.Messages.PrimaryKeyValueCanntNull);
        }
    };
})();

JData.Internal.Error.DataControlField = (function () {
    return {
        DataFieldCanNotNull: function (fieldName) {
            return Error.create(String.format('The data field of field "{0}" can not be null.', fieldName));
        },
        DataItemCanNotNull: function () {
            return Error.create('The data item can not be null');
        },
        FieldValueCanNotNull: function (fieldName) {
            return Error.create(String.format('The value of field "{0}" can not be null.', fieldName));
        }
    };
})();

JData.Internal.Error.GridView = (function () {
    return {
        InvalidTableRow: function (argName) {
            var msg = String.format('"{0}" is a invalid table row.', argName);
            return Error.create(msg);
        },
        InvalidDataRow: function (argName) {
            var msg = String.format('"{0}" is a invalid data row.', argName);
            return Error.create(msg);
        }
    }
})();






JData.DateTimeField = function (field, headerText, itemWidth, controlWidth, readOnly) {
    /// <param name="field" type="String" mayBeNull="true">
    /// The name of the data field to bind to the BoundField object.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="controlWidth" type="String" mayBeNull="true">
    /// The with of any control generated by a cell that generated by a data control field.
    /// </param>
    /// <param name="readOnly" type="Boolean" mayBeNull="true"/>
    JData.DateTimeField.initializeBase(this, [field, headerText, itemWidth, controlWidth, readOnly]);
    this.set_formatString('yy-mm-dd');
}

JData.DateTimeField.prototype = {
    get_formatString: function () {
        /// <summary>Get the value format for the control value.</summary>
        return this._formatString
    },
    set_formatString: function (value) {
        /// <summary>Set the value format for the control value.</summary>
        /// <param name="value" type="String" />
        this._formatString = value;
    },

    get_controlValue: function (container) {
        if (container == null)
            throw Error.argumentNull('container');

        var value = $(container).find('input').val();
        var result = $.datepicker.parseDate(this.get_formatString(), value);
        return result;
    },

    set_controlValue: function (container, value) {
        if (container == null)
            throw Error.argumentNull('container');

        if (typeof value != 'string') {
            value = $.datepicker.formatDate(this.get_formatString(), value);
        }

        $(container).find('input').val(value);
    },

    displayValue: function (container, value) {

        var text = value;
        if (Date.isInstanceOfType(value))
            text = $.datepicker.formatDate(this.get_formatString(), value);

        $(container).html(text);
    },

    createControl: function (container) {
        JData.DateTimeField.callBaseMethod(this, 'createControl', [container]);

        $(container).find('input').datepicker({
            showButtonPanel: true, duration: '', dateFormat: 'yy-mm-dd',
            beforeShow: function (i, e) {
                var z = jQuery(i).closest(".ui-dialog").css("z-index") + 4;
                e.dpDiv.css('z-index', z);
            }
        });
        return $(container).find('input')[0];
    }
};

JData.DateTimeField.registerClass('JData.DateTimeField', JData.BoundField);


Type.registerNamespace("JData");

JData.ExpandButtonCell = function (element) {
    JData.ExpandButtonCell.initializeBase(this, [element]);

    this._expanded = false;
};

JData.ExpandButtonCell.prototype = {
    get_button: function () {
        return this._button;
    },

    get_expanded: function () {
        return this._expanded;
    },

    get_label: function () {
        return this._label;
    },

    expand: function () {
        var col = this.get_containingField();
        var h = this._expanded ? col.get_events().getHandler('collapsing') : h = col.get_events().getHandler('expanding');
        if (h) h(col, { cell: this });

        this._expanded = !this._expanded;
        this._setButtonStyle();

        h = this._expanded ? h = col.get_events().getHandler('expanded') : h = col.get_events().getHandler('collapsed');
        if (h) h(col, { cell: this });
    },

    _createExpandButton: function () {
        var cell = this;
        var col = this.get_containingField();
        this._expandButton = document.createElement('span');
        this._setButtonStyle();
        var url = document.createElement('a');
        url.href = 'javascript:';
        url.appendChild(this._expandButton);
        this.get_element().appendChild(url);

        $addHandler(url, 'click', function (args) {
            cell.expand();
        });
    },

    _setButtonStyle: function () {
        this._expandButton.style.cssText = this._expandButton.style.cssText + ';float:left';
        if (this.get_expanded() == false) {
            this._expandButton.className = 'ui-icon ui-icon-plus';
        }
        else {
            this._expandButton.className = 'ui-icon ui-icon-minus';
        }
    },

    initialize: function () {
        this._createExpandButton();
        JData.ExpandButtonCell.callBaseMethod(this, 'initialize');
    },
    dispose: function () {
        //Add custom dispose actions here
        JData.ExpandButtonCell.callBaseMethod(this, 'dispose');
    }
};

JData.ExpandButtonCell.registerClass('JData.ExpandButtonCell', JData.Internal.DataControlFieldCell);


JData.ExpandButtonColumn = function () {
    JData.ExpandButtonColumn.initializeBase(this, null);
};

JData.ExpandButtonColumn.prototype = {
    get_cellType: function (gridRow) {
        return JData.ExpandButtonCell;
    },

    get_events: function () {
        if (this._events == null)
            this._events = new Sys.EventHandlerList();

        return this._events;
    },

    add_collapsed: function (handler) {
        this.get_events().addHandler('collapsed', handler);
    },
    remove_collapsed: function (handler) {
        this.get_events().removeHandler('collapsed', handler);
    },

    add_collapsing: function (handler) {
        this.get_events().addHandler('collapsing', handler);
    },
    remove_collapsing: function (handler) {
        this.get_events().removeHandler('collapsing', handler);
    },

    add_expanding: function (handler) {
        this.get_events().addHandler('expanding', handler);
    },
    remove_expanding: function (handler) {
        this.get_events().removeHandler('expanding', handler);
    },

    add_expanded: function (handler) {
        this.get_events().addHandler('expanded', handler);
    },
    remove_expanded: function (handler) {
        this.get_events().removeHandler('expanded', handler);
    },

    initialize: function () {
        JData.ExpandButtonColumn.callBaseMethod(this, 'initialize');
    },
    dispose: function () {
        //Add custom dispose actions here
        JData.ExpandButtonColumn.callBaseMethod(this, 'dispose');
    }
};
JData.ExpandButtonColumn.registerClass('JData.ExpandButtonColumn', JData.Internal.DataControlField);


Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");
JData.Internal.Expression = {};

(function (ns) {

    var TokenId = ns.TokenId = function () {
        return {
            Amphersand: 'Amphersand',
            Asterisk: 'Asterisk',
            Bar: 'Bar',
            CloseParen: 'CloseParen',
            Colon: 'Colon',
            Comma: 'Comma',
            Dot: 'Dot',
            DoubleBar: 'DoubleBar',
            DoubleAmphersand: 'DoubleAmphersand',
            DoubleEqual: 'DoubleEqual',
            End: 'End',
            Exclamation: 'Exclamation',
            ExclamationEqual: 'ExclamationEqual',
            GreaterThan: 'GreaterThan',
            GreaterThanEqual: 'GreaterThanEqual',
            Identifier: 'Identifier',
            IntegerLiteral: 'IntegerLiteral',
            LessGreater: 'LessGreater',
            LessThan: 'LessThan',
            LessThanEqual: 'LessThanEqual',
            Minus: 'Minus',
            OpenBracket: 'OpenBracket',
            OpenParen: 'OpenParen',
            Plus: 'Plus',
            Question: 'Question',
            Semicolon: 'Semicolon',
            StringLiteral: 'StringLiteral',
            Slash: 'Slash'
        };
    }();

    ConstantExpression = function (value) {
        if (value !== undefined)
            this.set_value(value);
    };

    ConstantExpression.prototype = {
        type: 'Constant',
        get_value: function () {
            return this._value;
        },
        set_value: function (value) {
            this._value = value;
        },

        eval: function () {
            return this.get_value();
        }
    };

    (function (my) {
        my.unterminatedStringLiteral = function () {
            return Error.create('unterminated string literal');
        };
        my.parseError = function () {
            return Error.create('parse error');
        };
    })(Error);

    ns.Error = Error;



    ns.Parser = function (text, instance) {
        /// <param name="text" type="String" maybeNull="false">
        /// The expression to be evaluate.
        /// </param>
        /// <param name="instance" type="object" maybeNull="true">
        /// The instance that contains the symbols in the expression. 
        /// </param>

        this._token = {};
        this._text = text;
        this._textLen = text.length;
        this._setTextPos(0);
        this._instance = instance || {};
    };

    ns.Parser.prototype = {
        functions: {
            iif: function (arg1, arg2, arg3) {
                if (arg1 == true)
                    return arg2;

                return arg3;
            }
        },
        constants: {
            'null': new ConstantExpression(null),
            'true': new ConstantExpression(true),
            'false': new ConstantExpression(false)
        },
        _tokenText: '',
        _setTextPos: function (pos) {
            this.textPos = pos;
            this.ch = this.textPos < this._textLen ? this._text[this.textPos] : '\0';
        },
        _isLetter: function (s) {
            var patrn = /[A-Za-z]/;

            if (!patrn.exec(s))
                return false;
            return true;
        },
        _isDigit: function (s) {
            var patrn = /[0-9]/;

            if (!patrn.exec(s))
                return false;
            return true;
        },
        _nextChar: function () {
            if (this.textPos < this._textLen)
                this.textPos = this.textPos + 1;

            this.ch = this.textPos < this._textLen ? this._text[this.textPos] : '\0';
        },
        _nextToken: function () {
            while (this.ch == ' ') {
                this._nextChar();
            }

            var t = null;
            var tokenPos = this.textPos;
            switch (this.ch) {
                case '!':
                    this._nextChar();
                    if (tiis.ch == '=') {
                        this._nextChar();
                        t = TokenId.ExclamationEqual;
                    }
                    else {
                        t = TokenId.Exclamation;
                    }
                    break;
                case '%':
                    NextChar();
                    t = TokenId.Percent;
                    break;
                case '&':
                    this._nextChar();
                    if (this.ch == '&') {
                        this._nextChar();
                        t = TokenId.DoubleAmphersand;
                    }
                    else {
                        t = TokenId.Amphersand;
                    }
                    break;
                case '(':
                    this._nextChar();
                    t = TokenId.OpenParen;
                    break;
                case ')':
                    this._nextChar();
                    t = TokenId.CloseParen;
                    break;
                case '*':
                    this._nextChar();
                    t = TokenId.Asterisk;
                    break;
                case '+':
                    this._nextChar();
                    t = TokenId.Plus;
                    break;
                case ',':
                    this._nextChar();
                    t = TokenId.Comma;
                    break;
                case ';':
                    this._nextChar();
                    t = TokenId.Semicolon;
                    break;
                case '-':
                    this._nextChar();
                    t = TokenId.Minus;
                    break;
                case '.':
                    this._nextChar();
                    t = TokenId.Dot;
                    break;
                case '/':
                    this._nextChar();
                    t = TokenId.Slash;
                    break;
                case ':':
                    this._nextChar();
                    t = TokenId.Colon;
                    break;
                case '<':
                    this._nextChar();
                    if (this.ch == '=') {
                        this._nextChar();
                        t = TokenId.LessThanEqual;
                    }
                    else if (this.ch == '>') {
                        this._nextChar();
                        t = TokenId.LessGreater;
                    }
                    else {
                        t = TokenId.LessThan;
                    }
                    break;
                case '=':
                    this._nextChar();
                    if (this.ch == '=') {
                        this._nextChar();
                        t = TokenId.DoubleEqual;
                    }
                    else {
                        t = TokenId.Equal;
                    }
                    break;
                case '>':
                    this._nextChar();
                    if (this.ch == '=') {
                        this._nextChar();
                        t = TokenId.GreaterThanEqual;
                    }
                    else {
                        t = TokenId.GreaterThan;
                    }
                    break;
                case '?':
                    this._nextChar();
                    t = TokenId.Question;
                    break;
                case '[':
                    this._nextChar();
                    t = TokenId.OpenBracket;
                    break;
                case ']':
                    this._nextChar();
                    t = TokenId.CloseBracket;
                    break;
                case '|':
                    this._nextChar();
                    if (ch == '|') {
                        this._nextChar();
                        t = TokenId.DoubleBar;
                    }
                    else {
                        t = TokenId.Bar;
                    }
                    break;
                case '"':
                case '\'':
                    var quote = this.ch;
                    do {
                        this._nextChar();
                        while (this.textPos < this._textLen && this.ch != quote) this._nextChar();
                        if (this.textPos == this._textLen)
                            throw Error.unterminatedStringLiteral(tokenPosition);
                        //throw ParseError(textPos, Res.UnterminatedStringLiteral);
                        this._nextChar();
                    } while (this.ch == quote);
                    t = TokenId.StringLiteral;
                    break;
                default:
                    if (this._isLetter(this.ch)) {
                        do {
                            this._nextChar();
                        } while (this._isLetter(this.ch) || this._isDigit(this.ch));
                        t = TokenId.Identifier;
                        break;
                    }
                    if (this._isDigit(this.ch)) {
                        t = TokenId.IntegerLiteral;
                        do {
                            this._nextChar();
                        } while (this._isDigit(this.ch));
                        break;
                    }
                    if (this.ch == '.') {
                        t = TokenId.RealLiteral;
                        this._nextChar();
                        do {
                            this._nextChar();
                        } while (this._isDigit(this.ch));
                        break;
                    }
                    if (this.textPos == this._textLen) {
                        t = TokenId.End;
                        break;
                    }
                    throw Error.parseError();
            }
            this._tokenText = this._text.substr(tokenPos, this.textPos - tokenPos);
            this._token.id = t;
            this._token.text = this._text.substr(tokenPos, this.textPos - tokenPos);
            this._token.pos = tokenPos;
        },
        _parsePrimaryStart: function () {
            switch (this._token.id) {
                case TokenId.Identifier:
                    return this._parseIdentifier();
                case TokenId.StringLiteral:
                    return this._parseStringLiteral();
                case TokenId.IntegerLiteral:
                    return this._parseIntegerLiteral();
                case TokenId.RealLiteral:
                    return this._parseRealLiteral();
                case TokenId.OpenParen:
                    return this._parseParenExpression();
                default:
                    throw Error.create(String.format('Unknowed token id "{0}"', this._token.id)); //ParseError(Res.ExpressionExpected);
            }
        },

        _validateToken: function (expectedTokenId) {
            if (this._token.id != expectedTokenId) {
                throw Error.create(String.format('Expect token "{0}", Actual is "{1}".', expectedTokenId, this._token.id));
            }
        },

        _parseIntegerLiteral: function () {
            var expr = new ConstantExpression();
            expr.set_value(new Number(this._token.text));
            this._nextToken();
            return expr;
        },

        _parseParenExpression: function () {
            this._validateToken(TokenId.OpenParen);
            this._nextToken();
            var expr = this._parseExpression();
            this._validateToken(TokenId.CloseParen);
            this._nextToken();
            return expr;
        },

        _parseStringLiteral: function () {
            var expr = new ConstantExpression();
            var text = this._token.text;
            expr.set_value(text.substr(1, text.length - 2));
            this._nextToken();
            return expr;
        },

        _parseFunction: function () {
            var func = this.functions[this._tokenText];
            Sys.Debug.assert(func != null);
            this._nextToken();

            this._validateToken(TokenId.OpenParen);
            this._nextToken();

            var args = [];
            while (true) {
                var expr = this._parseExpression();
                args[args.length] = expr;
                if (this._token.id == TokenId.CloseParen)
                    break;

                this._validateToken(TokenId.Comma);
                this._nextToken();
            }

            this._validateToken(TokenId.CloseParen);
            this._nextToken();

            var expr = new MethodCallExpression(null, func, args);
            return expr;
        },

        _parseIdentifier: function () {
            var self = this;
            var constant = this.constants[this._tokenText.toLowerCase()];
            if (constant != null) {
                this._nextToken();
                return constant;
            }
            var func = this.functions[this._tokenText];
            if (func != null) {
                return this._parseFunction();
            };

            for (var k in this._instance) {
                if (k == this._tokenText) {
                    var exp = new MemberExpression();
                    exp.set_expression(new ConstantExpression(this._instance));
                    exp.set_member(k);
                    this._nextToken();
                    return exp;
                }
            }
            throw Error.create(String.format('Parse expression "{0}" fail."', this._tokenText));
        },
        _parsePrimary: function () {
            var expr = this._parsePrimaryStart();

            while (true) {
                if (this._token.id == TokenId.Dot) {
                    this._nextToken();
                    expr = this._parseMemberAccess(expr);
                }
                    //else if (token.id == JData.Internal.Expression.TokenId.OpenBracket) {
                    //    expr = this._parseElementAccess(expr);
                    //}
                else {
                    break;
                }
            }
            return expr;
        },

        // -, !, not unary operators
        _parseUnary: function () {
            if (this._token.id == TokenId.Minus) {
                var op = this._token;
                this._nextToken();
                if (op.id == TokenId.Minus && (this._token.id == TokenId.IntegerLiteral || this._token.id == TokenId.RealLiteral)) {
                    this._token.text = '-' + this._token.text;
                    this._token.pos = op.pos;
                    return this._parsePrimary();
                }
                var expr = this._parseUnary();
                if (op.id == Expression.TokenId.Minus) {
                    expr = Expression.Negate(expr);
                }
            }
            return this._parsePrimary();
        },
        _parseMemberAccess: function (instance) {
            //this._validateToken(TokenId.Dot);
            //this._nextToken();
            this._validateToken(TokenId.Identifier);
            var expr = new MemberExpression();
            expr.set_expression(instance);
            expr.set_member(this._token.text);
            this._nextToken();

            return expr;
        },
        _parseMultiplicative: function () {
            var left = this._parseUnary();
            while (this._token.id == TokenId.Asterisk || this._token.id == TokenId.Slash ||
                   this._token.id == TokenId.Percent) {
                var op = this._token.text;
                this._nextToken();
                var right = this._parseUnary();

                var expr = new BinaryExpression();
                expr.set_leftExpression(left);
                expr.set_rightExpression(right);
                expr.set__operator(op);

                left = expr;
            }
            return left;
        },

        _parseLogicalOr: function () {
            var left = this._parseLogicalAnd();
            if (this._token.id == TokenId.DoubleBar || this._token.text == 'or') {
                var op = this._token.text;
                var right = this._parseLogicalAnd();
                var expr = new BinaryExpression();
                expr.set_operator(op);
                expr.set_leftExpression(left);
                expr.set_rightExpression(right);
                left = expr;
            }
            return left;
        },

        _parseLogicalAnd: function () {
            var left = this._parseComparison();
            if (this._token.id == TokenId.DoubleAmphersand || this._token.id == TokenId.Amphersand) {
                var op = this._token.text;
                var right = this._parseComparison();
                var expr = new BinaryExpression();
                expr.set__operator(op);
                expr.set_leftExpression(left);
                expr.set_rightExpression(right);
                left = expr;
            }
            return left;
        },

        // =, ==, !=, <>, >, >=, <, <= operators
        _parseComparison: function () {
            var left = this._parseAdditive();
            while (this._token.id == TokenId.Equal || this._token.id == TokenId.DoubleEqual ||
                   this._token.id == TokenId.ExclamationEqual || this._token.id == TokenId.LessGreater ||
                   this._token.id == TokenId.GreaterThan || this._token.id == TokenId.GreaterThanEqual ||
                   this._token.id == TokenId.LessThan || this._token.id == TokenId.LessThanEqual) {

                var op = this._token.text;
                this._nextToken();
                var right = this._parseAdditive();
                var expr = new BinaryExpression();
                expr.set__operator(op);
                expr.set_leftExpression(left);
                expr.set_rightExpression(right);
                left = expr;
            }
            return left;
        },

        // +, -, & operators
        _parseAdditive: function () {
            var left = this._parseMultiplicative();
            while (this._token.id == TokenId.Plus || this._token.id == TokenId.Minus || this._token.id == TokenId.Amphersand) {
                var tokenId = this._token.id;
                var tokenText = this._token.text;

                this._nextToken();
                var right = this._parseMultiplicative();
                var expr = new BinaryExpression();
                expr.set__operator(tokenText);
                expr.set_leftExpression(left);
                expr.set_rightExpression(right);
                left = expr;
            }
            return left;
        },

        _parseExpression: function () {
            var expr = this._parseLogicalOr();
            return expr;
        },

        parse: function () {
            this._nextToken();
            var expr = this._parseExpression();
            this._validateToken(TokenId.End);
            return expr.eval();
        }
    };

    MemberExpression = function () {
    };

    MemberExpression.prototype = {
        type: 'Member',
        set_expression: function (value) {
            Sys.Debug.assert(value.eval != null);
            this._expression = value;
        },
        get_expression: function () {
            return this._expression;
        },

        set_member: function (value) {
            this._member = value;
        },
        get_member: function () {
            return this._member;
        },

        eval: function () {
            Sys.Debug.assert(this.get_member() != null);
            Sys.Debug.assert(this.get_expression() != null);

            var dataItem = this.get_expression().eval();
            if (dataItem == null)
                throw Error.create('Value of the expression is null.');

            return dataItem[this.get_member()];
        }
    };




    BinaryExpression = function () {
    };

    BinaryExpression.prototype = {
        type: 'Binary',
        get_leftExpression: function () {
            return this._leftExpression;
        },
        set_leftExpression: function (value) {
            this._leftExpression = value;
        },

        get_rightExpression: function () {
            return this._rightExpression;
        },
        set_rightExpression: function (value) {
            this._rightExpression = value;
        },

        get_operator: function () {
            return this._operator;
        },
        set__operator: function (value) {
            Sys.Debug.assert(value != null && value != '');
            this._operator = value;
        },

        eval: function () {
            switch (this.get_operator()) {
                case '+':
                    return this.get_leftExpression().eval() + this.get_rightExpression().eval();
                case '-':
                    return this.get_leftExpression().eval() - this.get_rightExpression().eval();
                case '*':
                    return this.get_leftExpression().eval() * this.get_rightExpression().eval();
                case '/':
                    return this.get_leftExpression().eval() / this.get_rightExpression().eval();
                case '>':
                    return this.get_leftExpression().eval() > this.get_rightExpression().eval();
                case '>=':
                    return this.get_leftExpression().eval() >= this.get_rightExpression().eval();
                case '<':
                    return this.get_leftExpression().eval() < this.get_rightExpression().eval();
                case '<=':
                    return this.get_leftExpression().eval() <= this.get_rightExpression().eval();
                case '=':
                case '==':
                    return this.get_leftExpression().eval() == this.get_rightExpression().eval();
                case '||':
                    return this.get_leftExpression().eval() || this.get_rightExpression().eval();
                case '&&':
                    return this.get_leftExpression().eval() && this.get_rightExpression().eval();
                default:
                    throw Error.notImplemented();
            }
        }
    };

    MethodCallExpression = function (instance, method, arguments) {
        /// <param name="instance" type="object" />
        /// <param name="method" type="Function" />
        /// <param name="arguments" type="Array" />

        if (method == null)
            throw Error.argumentNull('method');

        if (arguments == null)
            throw Error.argumentNull('arugments');

        this.instance = instance;
        this.method = method;

        this.arguments = [];
        for (var i = 0; i < arguments.length; i++) {
            this.arguments[i] = arguments[i].eval();
        }
    };

    MethodCallExpression.prototype = {
        type: 'MethodCall',
        eval: function () {
            return this.method.call(this.instance, this.arguments);
        }
    };

})(JData.Internal.Expression);

Type.registerNamespace("JData");

JData.ExpressionCell = function (element) {
    JData.ExpressionCell.initializeBase(this, new Array(element));
};

JData.ExpressionCell.prototype = {
    get_contentContainer: function () {
        return this._contentContainer;
    },
    initialize: function () {
        JData.ExpressionCell.callBaseMethod(this, 'initialize');
        this._contentContainer = document.createElement('span');
        this.get_element().appendChild(this._contentContainer);
    }
};
JData.ExpressionCell.registerClass('JData.ExpressionCell', JData.Internal.DataControlFieldCell);


JData.ExpressionField = function (expression, headerText, itemWidth) {
    /// <param name="expression" type="String" mayBeNull="true">
    /// Sets the expression used to calculate the values in a column.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    JData.ExpressionField.initializeBase(this);

    if (expression != null)
        this.set_expression(expression);
    if (headerText != null)
        this.set_headerText(headerText);
    if (itemWidth != null)
        this.get_itemStyle().set_width(itemWidth);

};

JData.ExpressionField.prototype = {
    get_cellType: function () {
        return JData.ExpressionCell;
    },
    get_expression: function () {
        /// <summary>
        /// Gets the expression used to calculate the values in a column.
        /// </summary>
        /// <returns type="String"/>
        return this._expression;
    },
    set_expression: function (value) {
        /// <summary>
        /// Sets the expression used to calculate the values in a column.
        /// </summary>
        /// <param name="value" type="String"/>
        this._expression = value;
    },
    get_dataFormatString: function () {
        /// <summary>
        /// Gets the string that specifies the display format for the value of the field.
        /// </summary>
        /// <return type="String"/>
        return this._dataFormatString;
    },
    set_dataFormatString: function (value) {
        /// <summary>
        /// Sets the string that specifies the display format for the value of the field.
        /// </summary>
        /// <param name="value" type="String"/>
        this._dataFormatString = value;
    }
};

JData.ExpressionField.registerClass('JData.ExpressionField', JData.Internal.DataControlField);


JData.Internal.TextAreaFieldCell = function (element) {
    JData.Internal.TextAreaFieldCell.initializeBase(this, [element]);
};

//JData.Internal.TextAreaFieldCell.prototype = {
//    createControl: function () {
//        this._control = document.createElement('textarea');
//        this._control.name = this.get_containingField().get_dataField();
//        return this._control;
//    },
//    set_controlValue: function (value) {
//        return $(this._control).val(value);
//    },
//    get_controlValue: function () {
//        return $(this._control).val();
//    }
//};

//JData.Internal.TextAreaFieldCell.registerClass('JData.Internal.TextAreaFieldCell', JData.Internal.TextBoxCell);

JData.TextAreaField = function (field, headerText, itemWidth, controlWidth, readOnly) {
    /// <param name="field" type="String" mayBeNull="true">
    /// The name of the data field to bind to the BoundField object.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="controlWidth" type="String" mayBeNull="true">
    /// The with of any control generated by a cell that generated by a data control field.
    /// </param>
    /// <param name="readOnly" type="Boolean" mayBeNull="true"/>
    JData.TextAreaField.initializeBase(this, [field, headerText, itemWidth, controlWidth, readOnly]);
}

JData.TextAreaField.prototype = {
    createControl: function (container) {
        this._control = $('<textarea>').attr('name', this.get_dataField()).appendTo($(container))[0];
        return this._control;
    },
    set_controlValue: function (container, value) {
        return $(this._control).val(value);
    },
    get_controlValue: function (container) {
        return $(this._control).val();
    }
};

JData.TextAreaField.registerClass('JData.TextAreaField', JData.BoundField);


Type.registerNamespace("JData");

JData.GroupColumn = function (field, headerText, itemWidth, controlWidth, readOnly) {
    /// <param name="field" type="String" mayBeNull="true">
    /// The name of the data field to bind to the BoundField object.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="controlWidth" type="String" mayBeNull="true">
    /// The with of any control generated by a cell that generated by a data control field.
    /// </param>
    /// <param name="readOnly" type="Boolean" mayBeNull="true"/>

    JData.GroupColumn.initializeBase(this, [field, headerText, itemWidth, controlWidth, readOnly]);
    //this.set_readOnly(true);
};

JData.GroupColumn.prototype = {
    _CreateCell: function (gridRow) {
        //throw Error.notImplemented();
        var dataItem = gridRow.get_dataItem();
        var dataField = this.get_dataField();
        Sys.Debug.assert(dataItem != null);
        Sys.Debug.assert(dataField != null);

        if (this.cell != null && this.cell.get_value() == dataItem[dataField] && this.cell.get_element() != null) {
            this.cell.get_element().rowSpan = this.cell.get_element().rowSpan + 1;
            return null;
        }
        this.cell = JData.GroupColumn.callBaseMethod(this, '_CreateCell', new Array(gridRow));
        return this.cell;
    },
    get_readOnly: function () {
        return true;
    }
};

JData.GroupColumn.registerClass('JData.GroupColumn', JData.BoundField);

Type.registerNamespace("JData");

//=========================== GroupHeaderTop ===========================

JData.GroupHeaderTop = function (element) {
    if (element == null)
        throw Error.argumentNull('element');

    JData.GroupHeaderTop.initializeBase(this, [element]);

}

JData.GroupHeaderTop.prototype = {

    get_groupItems: function () {
        /// <returns type="Array"/>
        return this._groupItems;
    },
    set_groupItems: function (groupItems) {
        /// <param name="items" type="Array"/>
        this._groupItems = groupItems;
    },

    _createCells: function () {
        var gridView = this.get_parent();
        var row = this;
        var columns = gridView.get_columns();
        var groupItems = new Array();
        Array.addRange(groupItems, this.get_groupItems());
        Array.add(groupItems, new JData.GroupHeaderItem(Number.MAX_VALUE - 1, Number.MAX_VALUE, 'NULL'));

        var groupItem = groupItems.shift();
        for (var j = 0; j < columns.length; j++) {
            var column = columns[j];
            if (j < groupItem.get_start()) {
                var htmlCell = this.get_element().insertCell(this.get_element().cells.length)
                cell = column._CreateHeaderCell(htmlCell);
                cell.get_element().rowSpan = 2;
                Array.add(this.get_cells(), cell);

                if (column.get_visible() == false) {
                    cell.set_visible(false);
                }
            }
            else if (j >= groupItem.get_start() && j < groupItem.get_end()) {
                continue;
            }
            else if (j = groupItem.get_end()) {
                var rowElement = this.get_element();
                var cellElement = rowElement.insertCell(rowElement.cells.length);
                var cell = $create(JData.Internal.TableCell, null, null, null, cellElement);
                cell.get_element().colSpan = groupItem.get_end() - groupItem.get_start() + 1;
                cell.set_text(groupItem.get_text());
                groupItem = groupItems.shift();

                if (column.get_visible() == false) {
                    cell.set_visible(false);
                }
            }
            else
                throw Error.argumentOutOfRange(j);
        }
    },

    initialize: function () {
        JData.GroupHeaderTop.callBaseMethod(this, 'initialize');

        // Add custom initialization here
    },
    dispose: function () {
        //Add custom dispose actions here
        JData.GroupHeaderTop.callBaseMethod(this, 'dispose');
    }
}
JData.GroupHeaderTop.registerClass('JData.GroupHeaderTop', JData.Internal.GridViewHeaderRow);


//=========================== GroupHeaderBottom ===========================

JData.GroupHeaderBottom = function (element) {
    if (element == null)
        throw Error.argumentNull('element');

    JData.GroupHeaderBottom.initializeBase(this, [element]);

}

JData.GroupHeaderBottom.prototype = {

    get_groupItems: function () {
        /// <returns type="Array"/>
        return this._groupItems;
    },
    set_groupItems: function (groupItems) {
        /// <param name="items" type="Array"/>
        this._groupItems = groupItems;
    },

    _createCells: function () {
        var gridView = this.get_parent();
        var row = this;
        var columns = gridView.get_columns();
        var groupItems = new Array();
        Array.addRange(groupItems, this.get_groupItems());
        Array.add(groupItems, new JData.GroupHeaderItem(Number.MAX_VALUE - 1, Number.MAX_VALUE, 'NULL'));

        var groupItem = groupItems.shift();
        for (var j = 0; j < columns.length; j++) {
            var column = columns[j];
            if (j < groupItem.get_start()) {
                continue;
            }
            else if (j >= groupItem.get_start() && j <= groupItem.get_end()) {
                var htmlCell = this.get_element().insertCell(this.get_element().cells.length)
                cell = column._CreateHeaderCell(htmlCell);
                //cell.get_element().colSpan = groupItem.get_end() - groupItem.get_start() + 1;
                Array.add(this.get_cells(), cell);
                if (j == groupItem.get_end())
                    groupItem = groupItems.shift();

                if (column.get_visible() == false) {
                    cell.set_visible(false);
                }
            }
            else
                throw Error.argumentOutOfRange(j);
        }
    },

    initialize: function () {
        JData.GroupHeaderBottom.callBaseMethod(this, 'initialize');

        // Add custom initialization here
    },
    dispose: function () {
        //Add custom dispose actions here
        JData.GroupHeaderBottom.callBaseMethod(this, 'dispose');
    }
}
JData.GroupHeaderBottom.registerClass('JData.GroupHeaderBottom', JData.Internal.GridViewHeaderRow);


//=========================== GroupHeaderItem ===========================

JData.GroupHeaderItem = function (start, end, text) {
    /// <param name="start" type="Number">
    /// </param>
    /// <param name="end" type="Number">
    /// </param>
    /// <param name="name" type="String">
    /// </param>
    this._start = start;
    this._end = end;
    this._text = text;
};

JData.GroupHeaderItem.prototype = {
    get_start: function () {
        return this._start;
    },
    set_start: function (value) {
        this._start = value;
    },

    get_end: function () {
        return this._end;
    },
    set_end: function (value) {
        this._end = value;
    },

    get_text: function () {
        return this._text;
    },
    set_text: function (value) {
        this._text = value;
    }
};

JData.GroupHeaderItem.registerClass('JData.GroupHeaderItem');

//=======================================================================
JData.GroupHeader = {};

JData.GroupHeader.applyTo = function (gridView, groupItems) {
    /// <param name="gridView" type="JData.GridView"/>
    /// <param name="groupItems" type="Array"/>

    if (gridView == null) throw Error.argumentNull('gridView');

    var orgMethod = gridView._CreateHeader;
    var newMethod = function () {
        if (gridView.get_showHeader()) {
            //Disable display the header.
            gridView.set_showHeader(false);
            orgMethod.apply(gridView, arguments);

            var properties = { rowType: JData.DataControlRowType.Header, groupItems: groupItems };
            var index = gridView.get_headerRows().length;
            var row = gridView._CreateRow(index, properties, JData.GroupHeaderTop);
            var style = gridView._GetRowStyle(row);
            row.applyStyle(style);

            index = gridView.get_headerRows().length;
            row = gridView._CreateRow(index, properties, JData.GroupHeaderBottom);
            var style = gridView._GetRowStyle(row);
            row.applyStyle(style);
            gridView.set_showHeader(true);
        }
        else {
            orgMethod.apply(gridView, new Array());
        }
    }
    gridView._CreateHeader = newMethod;
}

Type.registerNamespace("JData");

JData.GroupExpandCell = function (element) {
    if (element == null)
        throw Error.argumentNull('element');

    JData.TreeColumnCell.initializeBase(this, new Array(element));

    this._expanded = false;
    this._childRows = new Array();
};

JData.GroupExpandCell.prototype = {

    get_expanded: function () {
        return this._expanded;
    },

    get_controlValue: function () {
        if (this._createControl == null)
            return null;

        var value = $(this._createControl).attr('value');
        var type = this.get_containingField().get_valueType();

        if (type == Boolean) {
            value = Boolean.parse(value);
        }
        else if (type == Number) {
            value = Number.parseLocale(value);
        }
        else if (type == Date) {
            value = Date.parse(value);
        }

        return value;
    },
    set_controlValue: function (value) {
        if (this._createControl == null)
            return;

        var text = value == null ? this.get_containingField().get_nullText() : value;
        $(this._createControl).attr('value', text);
    },

    get_contentContainer: function () {
        return this.contentContainer;
    },

    //======================== EVENTS =============================

    add_nodeExpanded: function (handler) {
        this.get_events().addHandler('nodeExpanded', handler);
    },
    remove_nodeExpanded: function (handler) {
        this.get_events().removeHandler('nodeExpanded', handler);
    },

    //=============================================================

    expand: function () {
        var gridView = this.get_parent().get_parent();
        var dataItem = this.get_parent().get_dataItem();
        var index = Array.indexOf(gridView.get_rows(), this.get_parent());
        var cell = this;
        if (this._expanded == false) {
            var children = gridView.get_dataSource().getChildren(dataItem);
            if (children != null) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var properties = {
                        dataItem: child,
                        parent: gridView,
                        rowType: JData.DataControlRowType.DataRow
                    };
                    var row = gridView._CreateRow(index + i + 1, properties);
                    Array.add(this._childRows, row);

                    var style;
                    if (i / 2 != Math.round(i / 2))
                        style = gridView.get_alternatingRowStyle();
                    else
                        style = gridView.get_rowStyle();
                    row.applyStyle(style);
                }
            }
        }
        else {
            while (this._childRows.length > 0) {
                var childRow = this._childRows.pop();
                gridView._RemoveRow(childRow);
            }
        }

        Sys.Debug.assert(this._expanded != null);
        this._expanded = !this._expanded;

        var h = this.get_events().getHandler('nodeExpanded');
        if (h) h(this, {});
    },

    _getChildren: function (dataItem) {
        var gridView = this.get_parent().get_parent(); //this.get_containingField().gridView;
        var dataSource = gridView.get_dataSource();
        if (dataSource.getChildren == null)
            throw Error.argumentNull('dataSource.getChildren');

        return dataSource.getChildren(dataItem);
    },

    removeChildRows: function () {
        while (this._childRows.length > 0) {
            var childRow = this._childRows.pop();
            this.get_parent().get_parent()._RemoveRow(childRow);
        }
    },

    deleteChildRows: function () {
        while (this._childRows.length > 0) {
            var childRow = this._childRows.pop();
            gridView._HandleDelete(childRow);
        }
    },

    initialize: function () {
        var row = this.get_parent();
        var children = this._getChildren(row.get_dataItem());
        var gridView = this.get_parent().get_parent();
        var cell = this;
        var col = this.get_containingField();

        this.contentContainer = document.createElement('span');
        $(this.contentContainer).css('padding-top', '4px');
        $(this.contentContainer).css('float', 'left');

        this.set_value();
        if (children != null && children.length > 0) {
            var button = document.createElement('span');
            $(button).addClass('ui-icon ui-icon-plus');
            button.style.marginLeft = '0px';
            button.style.cssFloat = 'left'; //for firefox and chorme
            $(button).css('float', 'left'); //for IE and opera
            $(button).addClass('ui-icon');
            var url = document.createElement('a');
            url.href = 'javascript:';
            url.appendChild(button);
            this.get_element().appendChild(url);

            $addHandler(url, 'click', function (args) {
                cell.expand();
            });

            this.add_nodeExpanded(function (sender, args) {
                if (sender.get_expanded() == true) {
                    //button.className = ('ui-icon ui-icon-minus');
                    $(button).removeClass('ui-icon-plus');
                    $(button).addClass('ui-icon-minus');
                }
                else {
                    //button.className = ('ui-icon ui-icon-plus');
                    $(button).removeClass('ui-icon-minus');
                    $(button).addClass('ui-icon-plus');
                }
            });
        }
        else {
            this.contentContainer.style.marginLeft = (1 * 10 + 8) + 'px';
        }
        this.get_element().appendChild(this.contentContainer);

        row.add_valueChanged(function (sender, args) {
            Sys.Debug.assert(Array.isInstanceOfType(args.fields));
            if (Array.contains(args.fields, col.get_dataField())) {
                cell.set_value();
            }
        });
    }
};
JData.GroupExpandCell.registerClass('JData.GroupExpandCell', JData.Internal.EditableCell);



JData.GroupRow = function (element) {
    JData.GroupRow.initializeBase(this, new Array(element));
};

JData.GroupRow.prototype = {
    get_column: function () {
        if (this._column == null) throw Error.argumentNull('column');

        return this._column;
    },
    set_column: function (value) {
        this._column = value;
    },

    _createCells: function () {
        var gridView = this.get_parent();
        var columns = gridView.get_columns();
        var colSpan = 1;
        for (var j = 0; j < columns.length; j++) {
            var col = columns[j];
            if (col == this.get_column()) {
                var cellElement = this.get_element().insertCell(this.get_element().cells.length);
                var properties = { parent: this, containingField: col, parent: this };
                this.cell = $create(JData.GroupExpandCell, properties, null, null, cellElement); //col._CreateCell(this);
                Array.add(this.get_cells(), this.cell);
            }
            else if (JData.CommandField.isInstanceOfType(col)) {
                var cell = col._CreateCell(this);
                Array.add(this.get_cells(), cell);
            }
            else {
                colSpan++;
            }

            if (col.get_visible() == false) {
                cell.set_visible(false);
            }
        }
        $(this.cell.get_element()).attr('colSpan', colSpan);
    }
};

JData.GroupRow.registerClass('JData.GroupRow', JData.Internal.GridViewRow); // JData.Internal.TableRow);

JData.GroupRow.applyTo = function (gridView, column, style, cascadeDelete) {
    /// <param name="gridView" type="JData.GridView"/>
    /// <param name="column" type="JData.BoundField"/>
    /// <param name="style" type="JData.Style"/>
    if (gridView == null) throw Error.argumentNull('gridView');
    if (column == null) throw Error.argumentNull('column');

    var orgGetRowType = gridView._GetRowType;
    var newGetRowType = function (index, properties) {
        if (properties.rowType == JData.DataControlRowType.DataRow && properties.dataItem.Key != null) {
            properties.column = column;
            return JData.GroupRow;
        }
        return orgGetRowType.apply(gridView, new Array(index, properties));
    }
    gridView._GetRowType = newGetRowType;

    if (style == null) {
        style = gridView.get_rowStyle();
    }
    var orgGetRowStyle = gridView._GetRowStyle;
    var newGetRowStyle = function (row) {
        if (row.get_rowType() == JData.DataControlRowType.DataRow)
            return style;
        var index = row.get_rowIndex();
        return orgGetRowStyle.apply(gridView, new Array(row));
    }
    gridView._GetRowStyle = newGetRowStyle;


    var parent;
    gridView.add_rowUpdating(function (sender, args) {
        var dataSource = gridView.get_dataSource();
        var dataItem = args.row.get_dataItem();
        if (dataSource.getParent == null) throw Error.notImplemented('dataSource.getParent(dataItem) method is not implemented.');

        parent = dataSource.getParent(dataItem);
    });

    gridView.add_rowUpdated(function (sender, args) {
        var dataSource = gridView.get_dataSource();
        var dataItem = args.row.get_dataItem();
        if (dataSource.getParent == null) throw Error.notImplemented('dataSource.getParent(dataItem) method is not implemented.');

        var current = dataSource.getParent(dataItem);
        if (parent != current) {
            gridView._RemoveRow(args.row);

            var gridRow;
            var gridRows = gridView.get_rows();
            for (var i = 0; i < gridRows.length; i++) {
                if (gridRows[i].get_dataItem() == current) {
                    gridRow = gridRows[i];
                    break;
                }
            }
            if (gridRow.cell.get_expanded()) {
                gridRow.cell.expand();
                gridRow.cell.expand();
            }
        }
    });

    gridView.add_rowDeleting(function (sender, args) {
        var gridRow = args.row;
        if (JData.GroupRow.isInstanceOfType(gridRow) == false)
            return;

        if (cascadeDelete == true)
            gridRow.cell.deleteChildRows();
        else
            gridRow.cell.removeChildRows();
    });
};

(function () {
    //TODO: 1、验证输入的参数
    var my = {
    };

    formatDataSource = function (value, fields) {
        if (value == null || JData.DataSource.isInstanceOfType(value) || value.type != null)
            return value;

        var dataSource;
        if (Array.isInstanceOfType(value)) {
            dataSource = {
                type: JData.ArrayDataSource
                , init: [value]
                //, canDelete: function () { return false; }
                //, canInsert: function () { return false; }
                //, canUpdate: function () { return false; }
            }
        }
        else if (String.isInstanceOfType(value)) {
            var uri = value;
            var pks = new Array();
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i] || {};
                if (field.primaryKey == true) {
                    Array.add(pks, field.dataField);
                }
            }
            dataSource = new JData.ODataSource(uri, pks);
        }
        else if (JData.GridView.isInstanceOfType(value)) {
            dataSource = my.gridViewDataSource(value);
        }
        else {
            dataSource = new JData.ArrayDataSource([value]);
            dataSource.canDelete = function () { return false; }
            dataSource.canInsert = function () { return false; }
            dataSource.canUpdate = function () { return false; }
        }

        return dataSource;
    }

    my.parseHTMLElement = function (element) {
        if (String.isInstanceOfType(element)) {
            var elementId = element;
            element = document.getElementById(elementId);
            if (element == null)
                throw JData.Internal.Error.ElementNotExists(elementId);
        }

        return element;
    }

    my.gridViewDataSource = function (gridView) {
        /// <param name="gridView" type="JData.GridView"/>
        /// <return type="JData.DataSource"/>

        return new JData.GridViewDataSource(gridView);
    }

    my.detailsView = function (element, args) {
        /// <param name="element" type="HTMLElement"/>
        /// <param name="args" type="Object"/>
        /// <return type="JData.DetailView"/>

        if (element == null)
            throw Error.argumentNull('element');

        if (args == null)
            throw Error.argumentNull('args');

        args = $.extend({ type: args.type || JData.DetailsView, init: [element] }, args);

        element = my.parseHTMLElement(element);
        var detailsView = $.data(element, args.type.getName());
        if (detailsView != null)
            return detailsView;

        var obj = formatObject(args)
        detailsView = parseObject(obj);
        if (JData.GridView.isInstanceOfType(args['dataSource'])) {
            var gridView = args['dataSource'];
            var dataSource = detailsView.get_dataSource();
            gridView.add_rowSelected(function (sender, args) {
                var row = args.row;
                var rows = sender.get_selectedRows();
                var index = Array.indexOf(rows, row);
                var selectArguments = new JData.DataSourceSelectArguments();
                selectArguments.set_startRowIndex(index);
                selectArguments.set_totalRowCount(rows.length);
                selectArguments.set_maximumRows(1);
                dataSource.select(selectArguments);
            })
            gridView.add_rowUnselected(function (sender, args) {
                var index = detailsView.get_pageIndex();
                var rows = sender.get_selectedRows();
                if (index > rows.length - 1)
                    index = rows.length - 1;

                var selectArguments = new JData.DataSourceSelectArguments();
                selectArguments.set_startRowIndex(index);
                selectArguments.set_totalRowCount(rows.length);
                selectArguments.set_maximumRows(1);
                dataSource.select(selectArguments);
            })
        }

        if (args.dialog != null) {
            var options = $.isPlainObject(args.dialog) ? args.dialog : {};

            options.width = options.width || 'auto';
            options.title = options.title || detailsView.get_caption();
            options.closeOnEscape = options.closeOnEscape || true;
            options.resizable = options.resizable || false;

            detailsView.set_caption(null);
            $(detailsView.get_element()).hide();
            detailsView.add_dataBound(function () {
                $(detailsView.get_element()).dialog(options);
            });

        }

        return detailsView;
    }

    my.gridView = function (element, args) {
        /// <param name="element" type="HTMLElement"/>
        /// <param name="args" type="Object"/>
        /// <return type="JData.GridView"/>

        if (element == null)
            throw Error.argumentNull('element');

        if (args == null)
            throw Error.argumentNull('args');

        element = my.parseHTMLElement(element);
        var gridView = $.data(element, JData.GridView.getName());
        if (gridView != null) {
            return gridView;
        }

        args = $.extend({ type: JData.GridView, init: [element] }, args);
        var obj = formatObject(args)
        gridView = parseObject(obj, JData.GridView, element);
        gridView.initialize = function () {
            this._ApplyStyle();
            this._CreateCaption();
            this._CreateHeader();
            this.createEmptyRow();
            this._CreateFooter();
        };
        gridView.initialize();
        $.data(element, JData.GridView.getName(), gridView);

        return gridView;
    }

    //#region formView
    var parseFields = function (element, args) {
        if (args.fields == null)
            throw Error.create(String.format('The "fields" field is required.'));

        if (!Array.isInstanceOfType(args.fields))
            throw Error.create(String.format('Type of the "fields" field expect Array type.'));

        if (args.fields.length == 0)
            throw Error.create('The "fields" field can not be an empty array.');

        var firstItem = args.fields[0];
        if (!Array.isInstanceOfType(firstItem)) {
            if (element.rows.length == 0) {
                for (var i = 0; i < args.fields.length; i++) {
                    var $row = $('<tr>').appendTo($(element));
                    $('<td>').appendTo($row).attr('field-header', args.fields[i].name || args.fields[i].dataField);
                    $('<td>').appendTo($row).attr('field-value', args.fields[i].name || args.fields[i].dataField);
                }
            }
            return;
        }

        for (var i = 0; i < args.fields.length; i++) {
            if (args.fields[i].type == JData.CommandField) {
                args.fields[i] = [args.fields[i]];
                continue;
            }

            if (!Array.isArray(args.fields[i]))
                throw Error.create(String.format('All the elements in the array must be a array type, but the element at index {0} is not.', i));
        }

        var allFields = new Array();
        for (var i = 0; i < args.fields.length; i++) {
            var fields = args.fields[i];
            var $row = $('<tr>').appendTo($(element));
            for (var j = 0; j < fields.length; j++) {
                if (fields[j] == null) {
                    if (j == 0)
                        throw Error.create('The first element of the array can not be null.');

                    var cell = $row[0].cells[j * 2 - 1];
                    cell.colSpan = cell.colSpan + 2;
                    continue;
                }
                Array.add(allFields, fields[j]);
                $('<td>').appendTo($row).attr('field-header', fields[j].name || fields[j].dataField);
                $('<td>').appendTo($row).attr('field-value', fields[j].name || fields[j].dataField);

            }
        }

        args.fields = allFields;
    }

    my.formView = function (element, args) {
        if (element == null)
            throw Error.argumentNull('element');

        if (args == null)
            throw Error.argumentNull('args');

        args.type = JData.FormView;
        parseFields(element, args);

        var formView = my.detailsView(element, args);
        return formView;
    }
    //#endregion

    my.parseExtendField = function (instance, fieldName, fieldValue) {
        if (JData.Internal.DataControlField.isInstanceOfType(instance)) {
            if (fieldName == 'width') {
                instance.get_itemStyle().set_width(fieldValue);
                return true;
            }
            else if (fieldName == 'controlWidth') {
                instance.get_controlStyle().set_width(fieldValue);
                return true;
            }
            else if (fieldName == 'primaryKey') {
                instance.primaryKey = fieldValue;
                return true;
            }
        }
        return false;
    }

    parseObject = function (obj) {
        if (obj == null)
            return obj;

        if (String.isInstanceOfType(obj) || Number.isInstanceOfType(obj) || Boolean.isInstanceOfType(obj))
            return obj;

        if (Array.isInstanceOfType(obj)) {
            var arr = [];
            for (var i = 0; i < obj.length; i++)
                arr[i] = parseObject(obj[i]);

            return arr;
        }

        if (obj.type == null)
            return obj;

        var type = obj.type;
        var skip_fields = ['type', 'init'];

        var instance;
        if (obj.init == null) {
            instance = new type();
        }
        else {
            var init_args;
            for (var i = 0 ; i < obj.init.length; i++) {
                if (i == 0)
                    init_args = 'obj.init[0]';
                else
                    init_args = init_args + ',' + String.format('obj.init[{0}]', i);
            }
            var expr = String.format('new type({0})', init_args);
            instance = eval(expr)
        }

        for (var name in obj) {
            if (Array.contains(skip_fields, name))
                continue;

            var field = parseObject(obj[name]);
            var adder = instance['add_' + name];
            if (adder != null) {
                if (!Function.isInstanceOfType(field))
                    throw Error.create(String.format('Function is expected for field "{0}", actual is "{1}"', name, Object.getTypeName(field)));

                adder.apply(instance, [field]);
                continue;
            }

            var setter = instance['set_' + name];
            if (setter != null) {
                setter.apply(instance, [field]);
                continue;
            }

            if (instance[name] != null && Object.getType(instance[name]) == Function) {
                instance.methods = instance.methods || {};
                instance.methods[name] = $.proxy(instance[name], instance);
                instance[name] = field;

                continue;
            }

            if (my.parseExtendField(instance, name, field)) {
                continue;
            }

            //var msg = String.format("'{0} is not property or event for type '{1}'.", name, Object.getTypeName(instance));
            //throw Error.create(msg);
        }
        return instance;
    }//JData.CommandField.prototype.get_showInsertButton

    //对JSON对象中的字段，重新整理，使得易于解释。
    formatObject = function (obj) {
        if (!Object.isInstanceOfType(obj))
            return obj;

        if (obj.type.inheritsFrom(JData.Internal.DataBoundTable)) {
            //=====================================================================================
            // 解释字段
            var fieldName;
            if (obj.type == JData.GridView)
                fieldName = 'columns';
            else
                fieldName = 'fields';

            var fields = obj[fieldName];
            if (fields != null) {
                if (!Array.isInstanceOfType(fields) || fields.length == 0)
                    throw Error.create(String.format('The "{0}" field can not be a empty array.', fieldName));

                if (!Array.isInstanceOfType(fields))
                    throw Error.argumentType(fieldName, Object.getType(fields), Array);

                if (fields.length == 0)
                    throw Error.create(String.format('The "{0}" field can not be a empty array.', fieldName));

                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].type == null)
                        fields[i].type = JData.BoundField;

                }

                for (var i = 0; i < fields.length; i++) {
                    fields[i] = formatObject(fields[i]);
                }
            }

            //=====================================================================================
            // 解释数据源
            var dataSource = obj.dataSource;
            if (dataSource != null) {
                obj.dataSource = formatDataSource(obj.dataSource, fields);
            }

            //=====================================================================================

            var skip_fields = ['type', 'init', fieldName, 'dataSource'];
            for (var name in obj) {
                if (Array.contains(skip_fields, name))
                    continue;

                var value = obj[name];
                if (value == null || value.type == null)
                    continue;


                obj[name] = formatObject(obj[name]);
            }

            return obj;
        }
        else if (obj.type.inheritsFrom(JData.Internal.DataControlField) ||
                 obj.type == JData.Internal.DataControlField) {
            for (var name in obj) {
                if ((name == 'itemStyle' || name == 'headerStyle' || name == 'controlStyle') && Object.getType(obj[name]) == Object) {
                    obj[name] = $.extend(obj[name], { type: JData.TableItemStyle });
                }
            }
            return obj;
        }

        return obj;
    }



    $.extend($.fn, {
        detailsView: function (options) {
            this.each(function () {
                var detailsView = my.detailsView(this, options);
                detailsView.initialize();
            })
            return this;
        },
        formView: function (options) {
            this.each(function () {
                var formView = my.formView(this, options);
                formView.initialize();
            })
            return this;
        },
        gridView: function (options) {
            this.each(function () {
                my.gridView(this, options)
            })
            return this;
        }
    })
})();


Type.registerNamespace("JData");

//===================== Inner Class =============================

JData.Internal.NumberCell = function (element) {
    JData.Internal.NumberCell.initializeBase(this, new Array(element));
};

JData.Internal.NumberCell.prototype = {
    initialize: function () {
        var index = this.get_parent().get_rowIndex() + 1;
        this.get_element().innerHTML = index;
        var col = this.get_containingField();
    }
};

JData.Internal.NumberCell.registerClass('JData.Internal.NumberCell', JData.Internal.DataControlFieldCell);

//===============================================================

JData.NumberColumn = function (headerText, itemWidth) {
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>

    JData.NumberColumn.initializeBase(this);

    if (headerText != null)
        this.set_headerText(headerText);
    if (itemWidth != null)
        this.get_itemStyle().set_width(itemWidth);


};

JData.NumberColumn.prototype = {
    get_cellType: function () {
        return JData.Internal.NumberCell;
    }
};

JData.NumberColumn.registerClass('JData.NumberColumn', JData.Internal.DataControlField);


(function () {

    function entityEquals(obj1, obj2, primaryKeys) {
        /// <param name="primaryKeys" type="Array"/>
        if (primaryKeys == null)
            throw Error.argumentNull('primaryKeys');

        if (obj1 == null && obj2 == null)
            return true;

        if (obj1 == null || obj2 == null)
            return false;

        var msg = 'The primary key "{0}" value of the argument "{1}" is null.';
        for (var i = 0; i < primaryKeys.length; i++) {
            var key = primaryKeys[i];
            if (obj1[key] == null)
                throw Error.create(String.format(msg, key, 'obj1'));

            if (obj2[key] == null)
                throw Error.create(String.format(msg, key, 'obj2'));
        }

        var equals = true;
        for (var j = 0; j < primaryKeys.length; j++) {
            var name = primaryKeys[j];
            if (obj1[name] != obj2[name]) {
                equals = false;
            }
        }
        return equals;
    }

    var TreeNode = function (element, col) {
        if (element == null)
            throw Error.argumentNull('element');

        if (col == null)
            throw Error.argumentNull('col');

        this._element = element;
        this._col = col;
        this._expandButton = element;
        this.setButtonIcon();

        var self = this;
        $(this._element).click(function () {
            self.toggle();
        });

        this._marginBlock = $('<div>').css('float', 'left')
                                      .html('&nbsp')
                                      .insertBefore($(this.get_element()).parents('td').first().children())[0];
    };

    TreeNode.ClassName = 'JData.TreeColumnNode';
    TreeNode.Indent = 14;

    TreeNode.prototype = {
        _marginBlock: null
        , _element: null
        , _col: null
        , _expanded: false
        , _depth: 0
        , onExpanded: null
        , get_element: function () {
            return this._element;
        }
        , set_depth: function (value) {
            $(this._marginBlock).css('width', (value * TreeNode.Indent) + 'px');
            this._depth = value;
        }
        , get_depth: function () {
            return this._depth;
        }
        , get_expanded: function () {
            return this._expanded;
        }
        , toggle: function () {
            if (this.get_expanded() == true) {
                this.collapse();
            } else {
                this.expand();
            }
        }
        , collapse: function () {
            this._expanded = false;
            this.setButtonIcon();
            for (var i = 0; i < this.get_children().length; i++) {
                var expandButton = this.get_children()[i];
                $(expandButton._element).parents('tr').first().hide();
                expandButton.collapse();
            }
        }
        , get_children: function () {
            var $cell = $(this._element).parents('td').first();
            var $row = $(this._element).parents('tr').first();
            var table = $(this._element).parents('table').first()[0];

            var buttons = [];
            var rowIndex = $row.prop('rowIndex');
            var cellIndex = $(this._element).parents('td').first().prop('cellIndex');
            for (var i = rowIndex + 1; i < table.rows.length; i++) {
                var cell = table.rows[i].cells[cellIndex];
                var childExpandButton = $(cell).data(TreeNode.ClassName);
                if (childExpandButton == null)
                    break;

                if (childExpandButton.get_depth() == this.get_depth() + 1)
                    buttons[buttons.length] = childExpandButton;
                else if (childExpandButton.get_depth() == this.get_depth())
                    break;

            }
            return buttons;
        }
        , expand: function () {
            if (this._expanded == true)
                return;

            var gridView = $(this._element).parents('table').first()[0].control;
            var col = this._col;
            var row = $(this._element).parents('tr').first()[0].control;

            this._expanded = true;
            this.setButtonIcon();
            var self = this;

            var buttons = this.get_children();
            for (var i = 0; i < buttons.length; i++) {
                $(buttons[i].get_element()).parents('tr').first().show();
            };
        }
        , expandAll: function () {
            var stack = [this];
            while (stack.length > 0) {
                var item = stack.pop();
                item.expand();
                var children = item.get_children();
                for (var i = 0; i < children.length; i++) {
                    stack.push(children[i]);
                }
            }
        }
        , hideExpandButton: function () {
            //Sys.UI.DomElement.setVisibilityMode($(this._element).find('span')[0], Sys.UI.VisibilityMode.hide);
            //Sys.UI.DomElement.setVisible($(this._element).find('span')[0], false);
            $(this._element).find('span').hide();
        }
        , showExpandButton: function () {
            $(this._element).find('span').show();
        }
        , setButtonIcon: function () {
            this._col.setButtonIcon(this);
        }
        , get_childDataItems: function (dataItem, success) {
            if (dataItem == null)
                throw Error.argumentNull('dataItem');

            if (success == null)
                throw Error.argumentNull('success');

            var col = this._col;
            var row = $(this._element).parents('tr').first()[0].control;

            var gridView = $(this.get_element()).parents('table').first().data('JData.GridView');
            Sys.Debug.assert(gridView != null);
            var dataSource = gridView.get_dataSource();
            if (JData.TreeDataSource.isInstanceOfType(dataSource) == false) {
                var msg = String.format("Type of the grid-view's data-source is exptected '{0}', acutal is '{1}'.",
                                        JData.TreeDataSource.getName(), Object.getTypeName(dataSource));
                throw Error.create(msg);
            }

            var children = dataSource.getChildren(dataItem);
            Sys.Debug.assert(children != null && Array.isInstanceOfType(children));
            success(children);

        }
        , _createChildNode: function (dataItem) {
            var gridView = $(this._element).parents('table').first()[0].control;
            var current_row_index = $(this.get_element()).parents('tr').first()[0].control.get_rowIndex();
            rowIndex = current_row_index + 1;

            var row = gridView._CreateDataRow(rowIndex, dataItem);
            var cell_index = $(this._element).parents('td').prop('cellIndex');
            var child_cell = row.get_element().cells[cell_index];
            var child_node = $(child_cell).data(TreeNode.ClassName);
            child_node.set_depth(this.get_depth() + 1);

            this.get_childDataItems(dataItem, function (dataItems) {

                for (var i = 0; i < dataItems.length; i++) {
                    child_node._createChildNode(dataItems[i]);
                }
                child_node._createChildRows = true;
            });

            this.showExpandButton();
        }
        , addChild: function (dataItem) {
            if (dataItem == null)
                throw Error.argumentNull('dataItem');

            this.expand();
            this._createChildNode(dataItem);

        }
        , removeChild: function (treeNode) {
            var gridView = $(this._element).parents('table').first()[0].control;

            var stack = [];
            stack.push(treeNode);
            while (stack.length > 0) {
                var node = stack.pop();
                for (var i = 0; i < node.get_children().length; i++) {
                    stack.push(node.get_children()[i]);
                }

                var current_row = $(node.get_element()).parents('tr').first().prop('control');
                gridView._RemoveRow(current_row);
            }
        }
        , handleNew: function () {
            throw Error.notImplemented();
        }
        , handleInsert: function () {
            throw Error.notImplemented();
        }
        , handleDelete: function () {
            throw Error.notImplemented();
        }
    };


    JData.TreeColumn = function (field, headerText, itemWidth, controlWidth) {
        /// <param name="field" type="String" mayBeNull="true">
        /// The name of the data field to bind to the BoundField object.
        /// </param>
        /// <param name="headerText" type="String" mayBeNull="true">
        /// The text that is displayed in the header item of a data control field
        /// </param>
        /// <param name="itemWidth" type="String" mayBeNull="true">
        /// The with of any cell generated by a data control field.
        /// </param>
        /// <param name="controlWidth" type="String" mayBeNull="true">
        /// The with of any control generated by a cell that generated by a data control field.
        /// </param>
        JData.TreeColumn.initializeBase(this, [field, headerText, itemWidth, controlWidth]);
    }

    JData.TreeColumn.prototype = {
        _changeMethod: false
        , _CreateDataRow: null
        , set_childDataField: function (value) {
            this._childrenDataField = value;
        }
        , get_childDataField: function () {
            return this._childrenDataField;
        }
        , displayValue: function (container, value) {
            var $cell = $(container).parents('td').first();
            var node = $cell.data(TreeNode.ClassName);
            if (node == null) {
                node = this._createTreeNode(container);
                $cell.data(TreeNode.ClassName, node);
            }
            JData.TreeColumn.callBaseMethod(this, 'displayValue', [container, value]);

        }
        , get_controlValue: function (container) {
            return JData.TreeColumn.callBaseMethod(this, 'get_controlValue', [container]);
        }
        , set_controlValue: function (container, value) {
            JData.TreeColumn.callBaseMethod(this, 'set_controlValue', [container, value]);
        }
        , _createTreeNode: function (container) {
            var $cell = $(container).parents('td').first();

            var $url = $('<a>').attr('href', 'javascript:')
                               .css('float', 'left')
                            .append($('<span>').attr('class', 'ui-icon'))
                            .insertBefore($cell.children());

            var node = new TreeNode($url[0], this);
            return node;
        }
        , setButtonIcon: function (treeNode) {
            if (treeNode.get_expanded() == false) {
                $(treeNode._element).find('span').removeClass('ui-icon-minus').addClass('ui-icon-plus');
            }
            else {
                $(treeNode._element).find('span').addClass('ui-icon-minus').removeClass('ui-icon-plus');
            }
        }

    }

    JData.DataCache = function (primaryKey) {
        /// <param name="primaryKey" type="String"/>
        if (primaryKey == null)
            throw Error.argumentNull('primaryKey');

        this._primaryKey = primaryKey.split(',');
        this._items = [];
    };

    JData.DataCache.prototype = {
        _primaryKey: [],
        _items: [],
        getItemIndex: function (primaryKeyValues) {
            /// <param name="primaryKeyValues" type="Object"/>
            /// <returns type="Number"/>
            if (primaryKeyValues == null)
                throw Error.argumentNull('primaryKeyValues');

            for (var i = 0; i < this._items.length; i++) {
                var equals = true;
                var item = this._items[i];
                for (var j = 0; j < this._primaryKey.length; j++) {
                    var name = this._primaryKey[j];
                    if (item[name] != primaryKeyValues[name]) {
                        equals = false;
                    }
                }

                if (equals)
                    return i;
            }
            return -1;
        },
        getItem: function (primaryKeyValues) {
            var itemIndex = this.getItemIndex(primaryKeyValues);
            if (itemIndex >= 0) {
                var data = $.extend({}, this._items[itemIndex]);
                return data;
            };

            return null;
        },
        saveItem: function (data) {
            if (data == null)
                throw Error.argumentNull('data');

            //将 item 的值复制出来
            var item = $.extend({}, data);

            var keyValues = {};
            for (var i = 0; i < this._primaryKey.length; i++) {
                var field = this._primaryKey[i];
                if (item[field] == null)
                    throw Error.create(String.format('The primary key field "{0}" is null.', field));

                keyValues[field] = item[field];
            }

            var item_index = this.getItemIndex(keyValues);
            if (item_index >= 0)
                this._items[item_index] = item;
            else
                this._items[this._items.length] = item;
        },
        removeItem: function (item) {
            var index = this.getItemIndex(item);
            if (index > 0) {
                Array.removeAt(this._items, index);
            }
        },
        allItems: function () {
            var all = [];
            for (var i = 0; i < this._items.length; i++)
                all[i] = $.extend({}, this._items[i]);

            return all;
        }
    };

    JData.TreeColumn.registerClass("JData.TreeColumn", JData.BoundField);

    JData.TreeDataSource = function (dataSource, thisKey, otherKey) {
        /// <param name="dataSource" type="JData.DataSource" required="true"/>
        /// <param name="thisKey" type="String" required="true"/>
        /// <param name="otherKey" type="String" required="true"/>
        /// <param name="childrenField" type="String"/>
        /// <field name="_source" type="JData.DataSource"/>
        /// <field name="_cache" type="JData.DataCache"/>
        if (dataSource == null)
            throw Error.argumentNull('dataSource');

        if (thisKey == null)
            throw Error.argumentNull('thisKey');

        if (otherKey == null)
            throw Error.argumentNull('otherKey');

        JData.TreeDataSource.initializeBase(this, null);
        this._source = dataSource;
        this._cache = new JData.DataCache(thisKey);
        this._primaryKeys = thisKey.split(',');
        this._otherKeys = otherKey.split(',');

        if (this._primaryKeys.length != this._otherKeys.length)
            throw Error.create('Count of the primary keys in not same as other keys\'s.');

        var self = this;
        this.add_updated(function (sender, args) {
            /// <param name="sender" type="JData.TreeDataSource"/>
            var item = args.item;
            //TODO:验证 item 包含完整的主外键。
            var oldItem = self._cache.getItem(item);
            Sys.Debug.assert(oldItem != null);

            //更新缓存中的数据
            self._cache.saveItem(item);

            var old_parent = self.getParent(oldItem);
            var new_parent = self.getParent(item);
            if (old_parent != new_parent) {
                var parentChanged = self.get_events().getHandler('parentChanged');
                if (parentChanged)
                    parentChanged(self, { currentParent: new_parent, oldParent: old_parent, dataItem: item });
            }
        });
        this.add_inserted(function (sender, args) {
            var item = $.extend(args.item, args.returnItem);
            self._cache.saveItem(item);
        });

    };

    JData.TreeDataSource.prototype = {
        _primaryKeys: [],
        _otherKeys: [],
        _cache: null,
        _source: null,
        get_primaryKeys: function () {
            return this._primaryKeys;
        },
        get_otherKeys: function () {
            return this._otherKeys;
        },
        getParent: function (item) {
            var self = this;
            var primary_keys = {};
            for (var i = 0; i < self._otherKeys.length; i++) {
                primary_keys[self._primaryKeys[i]] = item[self._otherKeys[i]];
            }
            var parent = self._cache.getItem(primary_keys);
            return parent;
        },
        getChildren: function (item) {
            var children = [];
            var allItems = this._cache.allItems();
            for (var i = 0; i < allItems.length; i++) {
                var parent = this.getParent(allItems[i]);
                if ((parent == null && item == null) ||
                    (parent != null && item != null && entityEquals(parent, item, this._primaryKeys))) {
                    children[children.length] = allItems[i];
                }
            }
            return children;
        },
        add_parentChanged: function (handler) {
            this.get_events().addHandler('parentChanged', handler);
        },
        remove_parentChanged: function (handler) {
            this.get_events().removeHandler('parentChanged', handler);
        },
        executeInsert: function (item, successedCallback, failedCallback) {
            /// <param name="item" type = "Object"/>
            /// <param name="successedCallback" type="Function"/>
            /// <param name="failedCallback" type="Function"/>
            return this._source.executeInsert(item, successedCallback, failedCallback);
        },
        executeDelete: function (item, successedCallback, failedCallback) {
            /// <param name="item" type = "Object"/>
            /// <param name="successedCallback" type="Function"/>
            /// <param name="failedCallback" type="Function"/>
            return this._source.executeDelete(item, successedCallback, failedCallback);
        },
        executeUpdate: function (item, successedCallback, failedCallback) {
            /// <param name="item" type = "Object"/>
            /// <param name="successedCallback" type="Function"/>
            /// <param name="failedCallback" type="Function"/>
            return this._source.executeUpdate(item, successedCallback, failedCallback);
        },
        executeSelect: function (args, successedCallback, failedCallback) {
            /// <param name="args" type = "JData.DataSourceSelectArguments"/>
            /// <param name="successedCallback" type="Function"/>
            /// <param name="failedCallback" type="Function"/>

            //==================================================================
            // 说明：对原来数据进行拦截，然后只返回顶级的数据

            var self = this;
            //this._source.executeSelect(args,
            //        function (dataItems) {
            //            for (var i = 0; i < dataItems.length; i++) {
            //                self._cache.saveItem(dataItems[i]);
            //            }

            //            var items = [];
            //            for (var i = 0; i < dataItems.length; i++) {
            //                dataItems[i].equals = function (obj) {
            //                    return entityEquals(obj, this, self.get_primaryKeys());
            //                };
            //                var parent = self.getParent(dataItems[i]);
            //                if (parent == null)
            //                    items[items.length] = dataItems[i];
            //            }
            //            successedCallback(items);
            //        },
            //        failedCallback);

            return this._source.executeSelect(args, $.proxy(
                  function (dataItems) {
                      for (var i = 0; i < dataItems.length; i++) {
                          self._cache.saveItem(dataItems[i]);
                      }

                      var items = [];
                      for (var i = 0; i < dataItems.length; i++) {
                          dataItems[i].equals = function (obj) {
                              return entityEquals(obj, this, self.get_primaryKeys());
                          };
                          var parent = self.getParent(dataItems[i]);
                          if (parent == null)
                              items[items.length] = dataItems[i];
                      }
                      //successedCallback(items);
                  },
                  {}
            ));

            //==================================================================
        },
        canDelete: function (item) {
            return this._source.canDelete(item);
        },
        canInsert: function (item) {
            return this._source.canInsert(item);
        },
        canPage: function () {
            return this._source.canPage();
        },
        canRetrieveTotalRowCount: function () {
            return this._source.canRetrieveTotalRowCount();
        },
        canSort: function () {
            return this._source.canSort();
        },
        canUpdate: function (item) {
            return this._source.canUpdate(item);
        },
        get_name: function () {
            return this._source.get_name();
        },
        filter: function (value) {
            if (value === undefined)
                return this._filter;

            this._filter = value;
            var args = new JData.DataSourceSelectArguments();
            args.set_maximumRows(10);
            args.set_filter(this._filter);
            this.select(args);
        }
    };

    JData.TreeDataSource.registerClass("JData.TreeDataSource", JData.DataSource);

    var GridView_CreateDataRow = JData.Internal.DataBoundTable.prototype._CreateDataRow;
    var GridView_setDataSource = JData.Internal.DataBoundTable.prototype.set_dataSource;
    var GridView_RemoveDataRow = JData.Internal.DataBoundTable.prototype._RemoveDataRow;
    $.extend(JData.GridView.prototype, {
        _getTreeColumn: function () {
            var tree_column;
            for (var i = 0; i < this.get_columns().length; i++) {
                if (JData.TreeColumn.isInstanceOfType(this.get_columns()[i])) {
                    if (tree_column != null) {
                        throw Error.create('Count of the tree-column in a grid view can not more than one.');
                    }
                    tree_column = this.get_columns()[i];
                    break;
                }
            }
            return tree_column;
        },
        _CreateDataRow: function (index, dataItem) {
            var dataSource = this.get_dataSource();
            var tree_column = this._getTreeColumn();
            if (!JData.TreeDataSource.isInstanceOfType(dataSource) || tree_column == null) {
                return GridView_CreateDataRow.call(this, index, dataItem);
            }

            var col_index = tree_column.get_index();
            var data_row;
            var parent = dataSource.getParent(dataItem);
            if (parent != null) {
                var parentRow = this._getDataRow(parent);
                var parentNode = $(parentRow.get_cells()[col_index].get_element()).data(TreeNode.ClassName);

                index = parentRow.get_rowIndex() + 1;
                data_row = GridView_CreateDataRow.call(this, index, dataItem);

                var node = $(data_row.get_cells()[col_index].get_element()).data(TreeNode.ClassName);
                var parent_depth = parentNode.get_depth();
                node.set_depth(parent_depth + 1);

                if (!parentNode.get_expanded()) {
                    $(node.get_element()).parents('tr').first().hide();
                }
            }
            else {
                var index = this.get_rows().length;
                data_row = GridView_CreateDataRow.call(this, index, dataItem);
            }

            var children = dataSource.getChildren(dataItem);
            if (children.length > 0) {
                var col_index = tree_column.get_index();
                var parentNode = $(data_row.get_cells()[col_index].get_element()).data(TreeNode.ClassName);

                for (var i = 0; i < children.length; i++) {
                    var childRow = this._CreateDataRow(index + i + 1, children[i]);
                    //$(childRow.get_element()).hide();
                }
            }
            return data_row;
        },
        _getDataRow: function (dataItem) {
            for (var i = 0; i < this.get_rows().length; i++) {
                var row = this.get_rows()[i];
                if (entityEquals(dataItem, row.get_dataItem(), this.get_dataSource().get_primaryKeys()))
                    return row;
            }
            return null;
        },
        _RemoveDataRow: function (row) {
            var dataSource = this.get_dataSource();
            if (!JData.TreeDataSource.isInstanceOfType(dataSource)) {
                return GridView_RemoveDataRow.call(this, row);
            }

            var dataItem = row.get_dataItem();
            var stack = new Array();
            stack.push(dataItem);
            while (stack.length > 0) {
                dataItem = stack.pop();
                var row = this._getDataRow(dataItem);
                if (row != null)
                    GridView_RemoveDataRow.call(this, row);

                var children = this.get_dataSource().getChildren(dataItem);
                for (var i = 0; i < children.length; i++) {
                    stack.push(children[i]);
                }
            }
        },
        set_dataSource: function (value) {
            GridView_setDataSource.call(this, value);
            var self = this;
            if (JData.TreeDataSource.isInstanceOfType(value) && value._parentChangedAdded == undefined) {
                value.add_parentChanged(function (sender, args) {
                    /// <param name="sender" type="JData.TreeDataSource"/>
                    var pks = sender.get_primaryKeys();
                    for (var i = 0; i < self.get_rows().length ; i++) {
                        if (entityEquals(args.dataItem, self.get_rows()[i].get_dataItem(), pks)) {
                            self._RemoveRow(self.get_rows()[i]);
                            self._CreateDataRow(0, args.dataItem);
                            break;
                        }
                    }
                });
                value._parentChangedAdded = true;
            }
        }
    });

})();

Type.registerNamespace("JData");

//===================== Inner Class =============================
JData.Internal.SelectColumnButtonCell = function (element) {
    JData.Internal.SelectColumnButtonCell.initializeBase(this, new Array(element));
};

JData.Internal.SelectColumnButtonCell.prototype = {
    initialize: function () {
        var index = this.get_parent().get_rowIndex() + 1;
        this.get_element().innerHTML = index;
        var cell = this;
        var col = this.get_containingField();

        var RowState = JData.DataControlRowState;
        $(this.get_element()).mousedown(function (event) {

            event.preventDefault();

            var gridView = cell.get_parent().get_parent();
            var row = cell.get_parent();
            var col = cell.get_containingField();

            if (window.event.shiftKey) {
                var min, max;
                if (col.pre_selected_row_index != null) {
                    var min = col.pre_selected_row_index < row.get_rowIndex() ? col.pre_selected_row_index : row.get_rowIndex();
                    var max = min == row.get_rowIndex() ? col.pre_selected_row_index : row.get_rowIndex();
                }
                else {
                    min = 0;
                    max = row.get_rowIndex();
                }

                var rows = gridView.get_rows();
                $(rows).each(function () {
                    //-----------------------------------
                    // 取消对行的选择
                    if ((this.get_rowState() && RowState.Selected) == RowState.Selected) //if (this.get_selected())
                        gridView._HandleUnselect(this);
                    //-----------------------------------
                });

                for (var i = min; i <= max; i++) {
                    if ((rows[i].get_rowState() && RowState.Selected) == RowState.Selected) //if (rows[i].get_selected())
                        gridView._HandleUnselect(rows[i]);
                    else
                        gridView._HandleSelect(rows[i]);
                }
            }
            else if (window.event.ctrlKey) {
                if ((row.get_rowState() & RowState.Selected) == RowState.Selected) //if (row.get_selected())
                    gridView._HandleUnselect(row);
                else
                    gridView._HandleSelect(row);
                //window.event.cancelBubble = true;
            }
            else {
                var rows = gridView.get_rows();
                $(rows).each(function () {
                    //-----------------------------------
                    // 取消对行的选择
                    if ((this.get_rowState() && JData.DataControlRowState.Selected) == JData.DataControlRowState.Selected && this != row)//if (this.get_selected() && this != row)
                        gridView._HandleUnselect(this);
                    //-----------------------------------
                });

                if ((row.get_rowState() & RowState.Selected) != RowState.Selected)//if (!row.get_selected())
                    gridView._HandleSelect(row)
                else
                    gridView._HandleUnselect(row);

                col.pre_selected_row_index = row.get_rowIndex();
            }


        }).hover(function () {
            $(cell.get_element()).css('cursor', 'pointer');
        })


    }
};

JData.Internal.SelectColumnButtonCell.registerClass('JData.Internal.SelectColumnButtonCell', JData.Internal.DataControlFieldCell);

JData.Internal.SelectColumnCheckboxCell = function (element) {
    JData.Internal.SelectColumnCheckboxCell.initializeBase(this, new Array(element));
};

JData.Internal.SelectColumnCheckboxCell.prototype = {
    initialize: function () {
        var $checkbox = $('<input type="checkbox" style="border:none;">').appendTo($(this.get_element()));
        var cell = this;
        var grid = cell.get_parent().get_parent();
        var RowState = JData.DataControlRowState;
        $checkbox.click(function (event) {
            var row = cell.get_parent();
            var gridView = row.get_parent();
            if ((row.get_rowState() & RowState.Selected) == RowState.Selected)
                gridView._HandleUnselect(row);
            else
                gridView._HandleSelect(row);
        });

    }
}

JData.Internal.SelectColumnCheckboxCell.registerClass('JData.Internal.SelectColumnCheckboxCell', JData.Internal.DataControlFieldCell);

//===============================================================

JData.SelectColumn = function (itemWidth, headerText) {
    /// <param name="itemWidth" type="String" mayBeNull="true">
    /// The with of any cell generated by a data control field.
    /// </param>
    /// <param name="headerText" type="String" mayBeNull="true">
    /// The text that is displayed in the header item of a data control field
    /// </param>
    /// <field name='_gridView', type='JData.GridView' static='false'/>

    JData.SelectColumn.initializeBase(this);

    if (headerText != null)
        this.set_headerText(headerText);
    if (itemWidth != null)
        this.get_itemStyle().set_width(itemWidth);

    this._selectControlType = JData.SelectControlType.Button;
    this.get_itemStyle().set_width(JData.SelectColumn.ButtonCellStyle.width);
    this.get_itemStyle().set_cssClass(JData.SelectColumn.ButtonCellStyle.cssClass);
};

JData.SelectColumn.prototype = {
    _gridView: null,
    _CreateHeaderCell: function (cellElement) {
        var headerCell = JData.SelectColumn.callBaseMethod(this, '_CreateHeaderCell', [cellElement]);
        var row = headerCell.get_row();
        var grid = row.get_parent();

        if (this.get_selectControlType() == JData.SelectControlType.Checkbox) {
            var col = headerCell.get_containingField();
            var col_index = col.get_index();
            var header_checkbox = $('<input type="checkbox" style="border:none;"/>').appendTo($(cellElement)).click(function () {
                var rows = grid.get_rows();
                if (this.checked) {
                    for (var i = 0; i < rows.length; i++) {
                        grid._HandleSelect(rows[i]);
                    }
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        grid._HandleUnselect(rows[i]);
                    }
                }
            })[0];

            var RowState = JData.DataControlRowState;
            var on_rowSelectedChanged = function (sender, args) {
                var row_select_checkbox = $(args.row.get_cells()[col_index].get_element()).find('input[type="checkbox"]')[0];
                if ((args.row.get_rowState() & RowState.Selected) == RowState.Selected) {
                    row_select_checkbox.checked = true;
                }
                else {
                    row_select_checkbox.checked = false;
                }

                var checked_count = 0;
                for (var i = 0; i < grid.get_rows().length; i++) {
                    var checkbox = $(grid.get_rows()[i].get_cells()[col_index].get_element()).find('input[type="checkbox"]')[0]
                    if (checkbox.checked) {
                        checked_count = checked_count + 1;
                    }
                }

                var header_checkbox_checked = header_checkbox.checked;
                if (checked_count == grid.get_rows().length && header_checkbox_checked == false) {
                    header_checkbox.checked = true;
                }
                else if (checked_count < grid.get_rows().length && header_checkbox_checked) {
                    header_checkbox.checked = false;
                }
            };
            grid.add_rowSelected(on_rowSelectedChanged);
            grid.add_rowUnselected(on_rowSelectedChanged);
        }

        return headerCell;
    },
    get_cellType: function () {
        if (this.get_selectControlType() == JData.SelectControlType.Checkbox)
            return JData.Internal.SelectColumnCheckboxCell;

        return JData.Internal.SelectColumnButtonCell;
    },
    get_selectControlType: function () {
        /// <return type="JData.SelectControlType" />
        return this._selectControlType;
    },
    set_selectControlType: function (value) {
        /// <summary>
        /// Set the column select control type, default is button.
        /// </sumary>
        /// <param name="value" type="JData.SelectControlType"/>
        this._selectControlType = value;
    }
};

JData.SelectColumn.registerClass('JData.SelectColumn', JData.Internal.DataControlField);

JData.SelectControlType = function () {
    /// <field name='Button' type='Number' static='true' />
    /// <field name='Checkbox' type='Number' static='true' />
}

JData.SelectControlType.prototype = {
    Button: 0,
    Checkbox: 1
}

JData.SelectControlType.registerEnum('JData.SelectControlType', false);

JData.SelectColumn.ButtonCellStyle = {
    width: '24px',
    cssClass: ''
}


Type.registerNamespace("JData");
Type.registerNamespace("JData.Internal");
//============================= JQueryUIStyle =============================


(function (ns) {
    //====================================================
    // 1、为组件提供与 JQueryUI 一致的样式
    // 2、为 datajs 处理数据加上进度条。
    // 3、使用得 GridView 的列可以调整宽度
    // 4、对于 GridView、FormView、DetailsView ，弹出窗口时，隐藏原有的标题栏。
    // 5、设置进度窗口的样式。
    // 6、设置控件的默认图标。
    //====================================================

    var my = {
        DETAILS_VIEW_WIDTH: '400px',
        DETAILS_VIEW_ITEM_WIDTH: '320px',
        DETAILS_VIEW_HEADER_WIDTH: '80px'
    };

    var CAPTION_HEIGHT = '30px';
    var HEADER_HEIGHT = '28px';
    var ITEM_HEIGHT = '34px';
    var ALT_ITEM_HEIGHT = '34px';
    var PAGER_HEIGHT = '32px';
    var FOOTER_HEIGHT = '26px';
    var COMMAND_HEIGHT = '40px';

    var _CreateButton = function (commandType) {
        var button = document.createElement('button');
        var buttonText;
        var icon;
        if (commandType == 'Edit') {
            buttonText = this.get_editText();
            icon = JData.ControlIcons.editIcon; //'ui-icon-pencil';
        }
        else if (commandType == 'Cancel') {
            buttonText = this.get_cancelText();
            icon = JData.ControlIcons.cancelIcon; //'ui-icon-arrowreturnthick-1-w';
        }
        else if (commandType == 'Update') {
            buttonText = this.get_updateText();
            icon = JData.ControlIcons.updateIcon; //'ui-icon-disk';
        }
        else if (commandType == 'Insert') {
            buttonText = this.get_insertText();
            icon = JData.ControlIcons.insertIcon; //'ui-icon-disk';
        }
        else if (commandType == 'New') {
            buttonText = this.get_newText();
            icon = JData.ControlIcons.newIcon; //'ui-icon-plusthick';
        }
        else if (commandType == 'Delete') {
            buttonText = this.get_deleteText();
            icon = JData.ControlIcons.deleteIcon; //'ui-icon-closethick';
        }
        else
            throw Error.notImplemented();

        button.innerHTML = buttonText;
        $(button).button({
            icons: {
                primary: icon
            },
            text: true
        });
        return button;
    };

    ns.gridView = function (gridView, options) {
        /// <param name="gridView" type="JData.GridView"/>

        Sys.Debug.assert(JData.GridView.isInstanceOfType(gridView));

        options = options || {};

        if (options.autoUpdateStyle == null)
            options.autoUpdateStyle = true;


        gridView.set_gridLines(JData.GridLines.Both);
        var cssClass = gridView.get_cssClass();
        cssClass = cssClass == null ? 'ui-widget ui-widget-content gridView' :
                                      cssClass + ' ' + 'ui-widget ui-widget-content gridView';

        gridView.set_cssClass(cssClass);

        //Set the selected row style.
        gridView.get_selectedRowStyle().set_cssClass("ui-state-highlight selectedRow");

        //Set the edited row style.
        gridView.get_editRowStyle().set_cssClass("ui-state-highlight editRow");

        ns._setStyleDefaultValue(gridView.get_captionStyle(), gridView.get_headerStyle(),
                                                 gridView.get_emptyDataRowStyle(), gridView.get_rowStyle(),
                                                 gridView.get_alternatingRowStyle(), gridView.get_pagerStyle(),
                                                 gridView.get_footerStyle());

        if (options.autoUpdateStyle) {
            var rowIndex;
            gridView.add_rowRemoving(function (sender, args) {
                if (args.row.get_rowType() == JData.DataControlRowType.DataRow)
                    rowIndex = args.row.get_rowIndex();
            });
            gridView.add_rowRemoved(function (sender, args) {
                if (args.row.get_rowType() == JData.DataControlRowType.DataRow) {
                    gridView.updateRowsStyle(rowIndex);
                }
            });
            gridView.add_rowCreated(function (sender, args) {
                if (args.row.get_rowType() == JData.DataControlRowType.DataRow) {
                    rowIndex = args.row.get_rowIndex();
                    gridView.updateRowsStyle(rowIndex);
                }
            });
        }
    };

    ns.detailsView = function (detailsView) {
        /// <param name="detailsView" type="JData.DetailsView"/>
        if (JData.FormView.isInstanceOfType(detailsView))
            return;

        Sys.Debug.assert(JData.DetailsView.isInstanceOfType(detailsView));

        if (detailsView.get_gridLines() == null)
            detailsView.set_gridLines(JData.GridLines.Both);

        detailsView.set_gridLines(JData.GridLines.None);
        var cssClass = detailsView.get_cssClass();
        cssClass = cssClass == null ? 'ui-widget ui-widget-content gridView' :
                                      cssClass + ' ' + 'ui-widget ui-widget-content gridView';

        detailsView.set_cssClass(cssClass);
        detailsView.get_commandRowStyle().set_cssClass('ui-state-default command');

        ns._setStyleDefaultValue(detailsView.get_captionStyle(), detailsView.get_headerStyle(),
                                                 detailsView.get_emptyDataRowStyle(), detailsView.get_rowStyle(),
                                                 detailsView.get_alternatingRowStyle(), detailsView.get_pagerStyle(),
                                                 detailsView.get_footerStyle());




        var boundFields = new Array();
        for (var i = 0; i < detailsView.get_fields().length; i++) {
            if (JData.BoundField.isInstanceOfType(detailsView.get_fields()[i])) {
                Array.add(boundFields, detailsView.get_fields()[i]);
            }
            else if (JData.CommandField.isInstanceOfType(detailsView.get_fields()[i])) {
                detailsView.get_fields()[i]._CreateButton = _CreateButton;
                detailsView.get_fields()[i]._DisableButton = function (button) {
                    $(button).button({ disabled: true });
                };
            }
        }
        for (var i = 0; i < boundFields.length; i++) {
            var field = boundFields[i];
            if (i == 0) {
                field.get_itemStyle().set_cssClass('fieldValue first');
                field.get_headerStyle().set_cssClass('fieldHeader first');
            }
            else if (i == boundFields.length - 1) {
                field.get_itemStyle().set_cssClass('fieldValue last');
                field.get_headerStyle().set_cssClass('fieldHeader last');
            }
            else {
                field.get_itemStyle().set_cssClass('fieldValue');
                field.get_headerStyle().set_cssClass('fieldHeader');
            }
        }

        detailsView.add_rowCreated(function (sender, args) {
            if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(args.row)) {
                var cellElement = args.row.get_cells()[0].get_element();
                cellElement.className = 'ui-dialog-buttonpane ui-widget-content ui-helper-clearfix';
            }
        });
    };

    ns.formView = function (formView) {
        /// <param name="formView" type="JData.FormView"/>

        Sys.Debug.assert(JData.FormView.isInstanceOfType(formView));

        formView.set_gridLines(JData.GridLines.None);
        var cssClass = formView.get_cssClass();
        cssClass = cssClass == null ? 'ui-widget ui-widget-content gridView' :
                                      cssClass + ' ' + 'ui-widget ui-widget-content gridView';

        formView.set_cssClass(cssClass);
        formView.get_commandRowStyle().set_cssClass('ui-state-default command');

        ns._setStyleDefaultValue(formView.get_captionStyle(), formView.get_headerStyle(),
                                                 formView.get_emptyDataRowStyle(), formView.get_rowStyle(),
                                                 formView.get_alternatingRowStyle(), formView.get_pagerStyle(),
                                                 formView.get_footerStyle());

        var boundFields = new Array();
        for (var i = 0; i < formView.get_fields().length; i++) {
            if (JData.BoundField.isInstanceOfType(formView.get_fields()[i])) {
                Array.add(boundFields, formView.get_fields()[i]);
            }
            else if (JData.CommandField.isInstanceOfType(formView.get_fields()[i])) {
                formView.get_fields()[i]._CreateButton = _CreateButton;
                formView.get_fields()[i]._DisableButton = function (button) {
                    $(button).button({ disabled: true });
                }
            }
        }
        for (var i = 0; i < boundFields.length; i++) {
            var field = boundFields[i];
            if (i == 0) {
                field.get_itemStyle().set_cssClass('fieldValue first');
                field.get_headerStyle().set_cssClass('fieldHeader first');
            }
            else if (i == boundFields.length - 1) {
                field.get_itemStyle().set_cssClass('fieldValue last');
                field.get_headerStyle().set_cssClass('fieldHeader last');
            }
            else {
                field.get_itemStyle().set_cssClass('fieldValue');
                field.get_headerStyle().set_cssClass('fieldHeader');
            }
        }

        formView.add_rowCreated(function (sender, args) {
            if (JData.Internal.DetailsViewCommandRow.isInstanceOfType(args.row)) {
                var cellElement = args.row.get_cells()[0].get_element();
                cellElement.className = 'ui-dialog-buttonpane ui-widget-content ui-helper-clearfix';
            }
        });
    };

    ns._setStyleDefaultValue = function (captionStyle, headerStyle, emptyRowStyle,
        rowStyle, altRowStyle, pagerStyle, footerStyle) {
        /// <param name="captionStyle" type="JData.TableItemStyle"/>
        /// <param name="headerStyle" type="JData.TableItemStyle"/>
        /// <param name="emptyRowStyle" type="JData.TableItemStyle"/>
        /// <param name="rowStyle" type="JData.TableItemStyle"/>
        /// <param name="altRowStyle" type="JData.TableItemStyle"/>
        /// <param name="commandRowStyle" type="JData.TableItemStyle"/>
        /// <param name="pagerStyle" type="JData.TableItemStyle"/>
        /// <param name="footerStyle" type="JData.TableItemStyle"/>

        captionStyle.set_cssClass('ui-widget-header');
        headerStyle.set_cssClass('ui-state-default');
        emptyRowStyle.set_cssClass('emptyRow');
        rowStyle.set_cssClass('');
        altRowStyle.set_cssClass('');
        pagerStyle.set_cssClass('ui-state-hover pagerBar');
        footerStyle.set_cssClass('ui-state-default footer');
    };

    if (JData.GridView != null) {
        var gridView_init = JData.GridView.prototype.initialize;
        JData.GridView.prototype.initialize = function () {
            for (var i = 0; i < this.get_columns().length; i++) {
                var col = this.get_columns()[i];
                var headerStyle = col.get_headerStyle();
                var itemStyle = col.get_itemStyle();
                if (headerStyle.get_width() == null)
                    headerStyle.set_width(itemStyle.get_width());
            }
            ns.gridView(this);
            gridView_init.apply(this, arguments);
        };
    }

    if (JData.DetailsView != null) {
        var detailsView_init = JData.DetailsView.prototype.initialize;
        JData.DetailsView.prototype.initialize = function () {
            ns.detailsView(this);
            detailsView_init.apply(this, arguments);
        };
    }

    if (JData.FormView != null) {
        var formView_init = JData.FormView.prototype.initialize;
        JData.FormView.prototype.initialize = function () {
            ns.formView(this);
            formView_init.apply(this, arguments);
        };
    }

    //--------------------------------------------------------------------
    // 6、设置进度窗口样式
    var dialogStyle = JData.Internal.PosgressDialog.dialogStyle;
    var posgressBarStyle = JData.Internal.PosgressDialog.posgressBarStyle;
    var labelStyle = JData.Internal.PosgressDialog.labelStyle;
    var closeButtonStyle = JData.Internal.PosgressDialog.closeButtonStyle;

    posgressBarStyle.set_height('40px');
    posgressBarStyle.set_margin('36px 0px 0px 0px');
    posgressBarStyle.set_textAlign('center');

    labelStyle.get_font().set_bold(true);
    labelStyle.get_font().set_size('12px');
    labelStyle.set_padding('12px 0px 0px 0px');
    labelStyle.set_width('94%');
    labelStyle.set_foreColor('#ffffff');
    labelStyle.set_textAlign('center');
    labelStyle.set_position('absolute');

    closeButtonStyle.set_cssClass('ui-button-icon-primary ui-icon ui-icon-closethick');
    closeButtonStyle.set_height('18px');
    closeButtonStyle.set_width('18px');
    closeButtonStyle.set_float('right');
    closeButtonStyle.set_cursor('pointer');
    //---------------------------------------------------------------------

    var PosgressDialog = JData.Internal.PosgressDialog;

    //===========================================================================
    // 使得 GridView 的列可以调整大小
    if (JData.GridView != null) {
        var org_method = JData.Internal.DataBoundTable.prototype._CreateHeader;
        JData.GridView.prototype._CreateHeader = function () {
            org_method.apply(this, arguments);
            var header_rows = this.get_headerRows();
            for (var i = 0; i < header_rows.length; i++) {
                var header_row = header_rows[i];
                $(header_row.get_element().cells).resizable({ handles: "e" });
            }
        };

        var org_showError = JData.Internal.DataBoundTable.prototype._showError;
        JData.Internal.DataBoundTable.prototype._showError = function (msg) {
            PosgressDialog.GetInstance().setText(msg);
        };
    }
    //===========================================================================
    // 对于 GridView、FormView、DetailsView ，弹出窗口时，隐藏原有的标题栏。
    var _ui_dialog_create = $.ui.dialog.prototype._create;
    var _ui_dialog_close = $.ui.dialog.prototype.close;
    $.extend($.ui.dialog.prototype, {
        _getBoundTable: function () {
            var boundTable = $.data(this.element[0], JData.GridView.getName()) ||
                $.data(this.element[0], JData.DetailsView.getName()) ||
                $.data(this.element[0], JData.FormView.getName());

            return boundTable;
        },
        _create: function () {
            var boundTable = this._getBoundTable();
            if (boundTable != null) {
                boundTable.get_element().style.border = '0px';
                if (this.options.title == null && boundTable.get_caption() != null) {
                    this.options.title = boundTable.get_caption();

                    var captionRow = boundTable.get_element().caption;
                    Sys.Debug.assert(captionRow != null);
                    $(captionRow).hide();
                }

            }
            _ui_dialog_create.apply(this, arguments);
        },
        close: function () {
            _ui_dialog_close.apply(this, arguments);
            var boundTable = this._getBoundTable();
            if (boundTable != null && boundTable.get_caption() != null) {
                var captionRow = boundTable.get_element().caption;
                Sys.Debug.assert(captionRow != null);
                $(captionRow).show();
            }
        }
    });
    //===========================================================================
    var _cancelIconClas = JData.CommandField.prototype.get_cancelButtonClass;
    var _deleteIconClass = JData.CommandField.prototype.get_deleteButtonClass;
    var _editIconClass = JData.CommandField.prototype.get_editButtonClass;
    var _insertIconClass = JData.CommandField.prototype.get_insertButtonClass;
    var _newIconClass = JData.CommandField.prototype.get_newButtonClass;
    var _selectIconClass = JData.CommandField.prototype.get_selectButtonClass;
    var _unselectIconClass = JData.CommandField.prototype.get_unselectButtonClass;
    var _updateIconClass = JData.CommandField.prototype.get_updateButtonClass;

    JData.ControlIcons = $.extend(JData.ControlIcons, {
        cancelIcon: 'ui-icon ui-icon-arrowreturnthick-1-w',
        deleteIcon: 'ui-icon ui-icon-closethick',
        editIcon: 'ui-icon ui-icon-pencil',
        insertIcon: 'ui-icon ui-icon-disk',
        newIcon: 'ui-icon ui-icon-plusthick',
        selectIcon: 'ui-icon ui-icon-check',
        unselectIcon: 'ui-icon ui-icon-arrowreturnthick-1-w',
        updateIcon: 'ui-icon ui-icon-disk'
    });

    if (JData.SelectColumn != null) {
        JData.SelectColumn.ButtonCellStyle = $.extend(JData.SelectColumn.ButtonCellStyle, {
            cssClass: 'ui-state-default'
        });
    }
})(JData.Style);
(function () {
    //#region PagingBar
    var PagingBar = function (dataSource, pagerSettings, element) {
        Sys.Debug.assert(arguments.length == 3);
        Sys.Debug.assert(element.tagName != undefined);

        this.dataSource = dataSource;
        this.pagerSettings = pagerSettings;
        this.element = element;
        this._buttons = new Array();

        this.init(dataSource);
    };

    PagingBar.prototype = {
        init: function (dataSource) {
            /// <param name="dataSource" type="JData.DataSource"/>
            if (dataSource == null)
                throw Error.argumentNull('dataSource');

            this._pageIndex = 0;
            this._dataSource = dataSource;

            var pagingBar = this;
            //var dataSource = this.dataSource;
            pagingBar.totalRowCount = 1000000;
            dataSource.add_selected(function (source, args) {
                /// <param name="source" type="JData.DataSource"/>

                pagingBar.set_pageSize(args.selectArguments.get_maximumRows());

                var totalRowCount = args.selectArguments.get_totalRowCount();
                if (totalRowCount != null && totalRowCount >= 0) {
                    pagingBar.totalRowCount = totalRowCount;
                }

                var startRowIndex = args.selectArguments.get_startRowIndex();
                if (startRowIndex <= 0)
                    startRowIndex = 0;

                pagingBar._pageIndex = Math.floor(startRowIndex / pagingBar.get_pageSize());

                pagingBar.render();
            })
            dataSource.add_deleted(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount - 1;
                pagingBar.render();
            })
            dataSource.add_inserted(function () {
                pagingBar.totalRowCount = pagingBar.totalRowCount + 1;
                pagingBar.render();
            })
        },
        get_pageCount: function () {
            var pageCount = Math.ceil(this.totalRowCount / this.get_pageSize());

            return pageCount;
        },
        get_pageSize: function () {
            return this._pageSize;
        },
        set_pageSize: function (value) {
            this._pageSize = value;
        },
        get_pageIndex: function () {
            return this._pageIndex;
        },
        set_pageIndex: function (value) {
            this._pageIndex = value;
        },
        get_element: function () {
            return this.element;
        },
        createButton: function (nameOrIndex, fn) {

            var button_text;
            if (nameOrIndex == 'first')
                button_text = this.pagerSettings.get_firstPageText();
            else if (nameOrIndex == 'last')
                button_text = this.pagerSettings.get_lastPageText();
            else if (nameOrIndex == 'prev')
                button_text = this.pagerSettings.get_previousPageText();
            else if (nameOrIndex == 'next')
                button_text = this.pagerSettings.get_nextPageText();
            else
                button_text = nameOrIndex;

            var $c = $('<span>')
                        .append($('<a>').css('paddingLeft', '4px').prop('href', 'javascript:').html(button_text).click(fn))
                        .append($('<label>').css('paddingLeft', '4px').html(button_text).hide())
                        .appendTo($(this.element));

            return $c[0];
        },
        hideButon: function (btn) {
            $(btn).hide();
        },
        showButton: function (btn) {
            $(btn).show();
        },
        disableButton: function (btn) {
            $(btn).find('a').hide();
            $(btn).find('label').show();
        },
        enableButton: function (btn) {
            $(btn).find('a').show();
            $(btn).find('label').hide();
        },
        handlePage: function (event) {
            var pagingBar = this;

            var args = new JData.DataSourceSelectArguments();
            args.set_maximumRows(pagingBar.get_pageSize());
            args.set_startRowIndex(event.target.pageIndex * pagingBar.get_pageSize());
            pagingBar.dataSource.select(args);
        },
        render: function () {
            var pagerSettings = this.pagerSettings;
            var pagingBar = this;
            pagingBar.cell = this.element;

            var buttonCount = pagerSettings.get_pageButtonCount();
            var FIRST_BUTTON = 0
            var PREVIOUS_PAGING_BUTTON = 1;
            var NEXT_PAGING_BUTTON = pagerSettings.get_pageButtonCount() + 2;
            var LAST_BUTTON = pagerSettings.get_pageButtonCount() + 3
            var OTHER_BUTTONS_COUNT = 4;

            var createButtons;
            for (var i = 0; i < buttonCount + OTHER_BUTTONS_COUNT; i++) {
                if (pagingBar._buttons[i] != null) {
                    this.element.removeChild(pagingBar._buttons[i]);
                }

                var nameOrIndex;
                if (i == FIRST_BUTTON)
                    nameOrIndex = 'first'
                else if (i == LAST_BUTTON)
                    nameOrIndex = 'last';
                else if (i == PREVIOUS_PAGING_BUTTON)
                    nameOrIndex = 'prev';
                else if (i == NEXT_PAGING_BUTTON)
                    nameOrIndex = 'next';
                else
                    nameOrIndex = i - 1;

                var btn = this.createButton(nameOrIndex, $.proxy(this.handlePage, this));
                pagingBar._buttons[i] = btn;

            }
            var pagingBarIndex = Math.floor(pagingBar.get_pageIndex() / buttonCount);
            for (var i = 0; i < buttonCount + OTHER_BUTTONS_COUNT; i++) {
                var pageCount = pagingBar.get_pageCount();
                var start = pagingBarIndex * buttonCount;
                var pageIndex;
                var btn = pagingBar._buttons[i];
                if (i == PREVIOUS_PAGING_BUTTON) {
                    pageIndex = (pagingBarIndex - 1) * buttonCount;
                }
                else if (i == NEXT_PAGING_BUTTON) {
                    pageIndex = (pagingBarIndex + 1) * buttonCount;
                }
                else if (i == FIRST_BUTTON) {
                    pageIndex = 0;
                }
                else if (i == LAST_BUTTON) {
                    pageIndex = pageCount - 1;
                }
                else {
                    pageIndex = start + i - PREVIOUS_PAGING_BUTTON - 1;
                }
                $(btn).find('a').prop('pageIndex', pageIndex);
                pagingBar.enableButton(btn);

                if (pageCount != null && pageIndex > pageCount - 1)
                    pagingBar.hideButon(btn);

                if (this.get_pageIndex() == pageIndex) {
                    pagingBar.disableButton(btn);
                }
            }

            if (pagingBar.get_pageIndex() > 0 && pagerSettings.get_mode() == JData.PagerButtons.NumericFirstLast)
                this.enableButton(pagingBar._buttons[FIRST_BUTTON]);
            else
                this.disableButton(pagingBar._buttons[FIRST_BUTTON]);

            if (pageCount > 0 && pagingBar.get_pageIndex() < pageCount - 1 && pagerSettings.get_mode() == JData.PagerButtons.NumericFirstLast)
                this.enableButton(pagingBar._buttons[LAST_BUTTON]);
            else
                this.disableButton(pagingBar._buttons[LAST_BUTTON]);

            if (pagingBarIndex == 0)
                pagingBar.hideButon(pagingBar._buttons[PREVIOUS_PAGING_BUTTON]);
        }
    };

    createPagingBar = function (element, options, pagerSettings) {

        options = options || {};
        options.pageSize = options.pageSize || 10;

        if (options.dataSource == null)
            throw Error.create('The dataSource field of the options can not be null.');

        pagerSettings = pagerSettings || new JData.PagerSettings();
        var pagingBar = new PagingBar(options.dataSource, pagerSettings, element);

        $(element).data('JData.PagingBar', pagingBar);

        return pagingBar;
    };
    //#endregion

    $.extend($.fn, {
        pagingBar: function (options) {
            this.each(function () {
                var setting = new JData.PagerSettings();
                setting.set_mode(JData.PagerButtons.NumericFirstLast);
                var pagingBar = createPagingBar(this, options, setting);
                if (options.autoSelect == true)
                    options.dataSource.select(new JData.DataSourceSelectArguments());

            });
            return this;
        }
    });
})();
if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();
