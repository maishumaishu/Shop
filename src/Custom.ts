import services = require('services/Service');
import bootbox = require('bootbox');

let JData = window['JData'];

(function ($) {
    (<any>$).widget("ui.dialog", $.extend({}, (<any>$).ui.dialog.prototype, {
        _title: function (title) {
            var $title = this.options.title;// || '&nbsp;'
            if ($title == null) {
                $title = "&nbsp;";
                this.options.title_html = true;
            }
            if (("title_html" in this.options) && this.options.title_html == true)
                title.html($title);
            else
                title.text($title);
        }
    }));

    //===========================================================================
    // JQuery 的扩展
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var _ajax = $.ajax;
    $.extend($, {
        ajax: function (options) {
            if (typeof options === 'string')
                options = { url: options };

            options = options || {};
            options.data = options.data || {};
            options.headers = options.headers || {};

            // var appToken = "E26297B41339791C2F79EA9F5D66CC090C47F8265F984EA7239322642C0B333D65E49B0DDC581C3C";
            // var token = "EFF37347E349626066055C5DA0EE895BA324ECCEE1DE8DED406F81087BFAC8B02819259C34553F88";


            // if (typeof options.data === 'string')
            //     options.data = options.data + '&$appToken=' + appToken;
            // else
            //     options.data.$appToken = appToken;
            //}

            //if ($.cookie('Token')) {
            // if (typeof options.data === 'string')
            //     options.data = options.data + '&$token=' + token;
            // else
            //     options.data.$token = token;
            //}

            if (services.appToken) {
                options.headers['application-token'] = services.appToken;
            }
            if (services.token) {
                options.headers['user-token'] = services.token;
            }

            if ((options.url as string).indexOf('?') < 0)
                options.url = options.url + `?storeId=${services.storeId}`;
            else
                options.url = options.url + `&storeId=${services.storeId}`;


            options.traditional = true
            var result = $.Deferred();
            _ajax(options)
                .then(function (data) {
                    if (data.Type == 'ErrorObject' && data.Code != 'Success') {
                        services.error.fire(data);
                    }
                    return data;
                })
                .done(function (data) {
                    if (data.Type == 'ErrorObject') {
                        if (data.Code == 'Success') {
                            result.resolve(data);
                            return;
                        }

                        result.reject(data);
                        return;
                    }

                    result.resolve(data);
                })
                .fail(function (error) {
                    //debugger;
                    var obj = { Code: error.status, Message: error.statusText };
                    services.error.fire(obj);
                });
            return result;
        }
    })

    //============================================================
    //这一部份可能需要移入 JData
    $.ajaxSettings.converters['text json'] = function (json) {
        var result = $.parseJSON(json);
        if (typeof result == 'string')
            return result;

        var stack = new Array();
        stack.push(result);
        while (stack.length > 0) {
            var item = stack.pop();

            for (var key in item) {
                var value = item[key];
                if (value == null)
                    continue;

                if ($.isPlainObject(value)) {
                    stack.push(value);
                    continue;
                }

                if ($.isArray(value)) {
                    $(value).each(function () {
                        stack.push(this);
                    });
                    continue;
                }

                if (typeof value == 'string' && value.startsWith('/Date(')) {
                    var star = '/Date('.length;
                    var len = value.length - '/Date('.length - ')/'.length;
                    var str = value.substr(star, len);
                    var num = parseInt(str);
                    var date = new Date(num);
                    item[key] = date;
                }
            }
        }
        return result;
    };
    //=================================================================
    //对 JData 框架的扩展
    (function () {
        if (window['JData'] == null)
            return;

        function confirm(title, message, ok_callback) {
            bootbox.confirm(message, ok_callback);
        }

        //#region 样式设定
        JData.GridView.prototype = $.extend(JData.GridView.prototype, {
            get_cssClass: function () {
                return 'table table-striped table-bordered table-hover';
            }
        });

        JData.Internal.DataControlField.prototype = $.extend(JData.Internal.DataControlField.prototype, {
            _get_headerStyle: JData.Internal.DataControlField.prototype.get_headerStyle,
            get_headerStyle: function () {
                var style = this._get_headerStyle();
                style.set_textAlign('center');
                return style;
            }
        });

        JData.DetailsView.prototype = $.extend(JData.DetailsView.prototype, {
            get_cssClass: function () {
                return 'table table-striped table-bordered table-hover';
            }
        });
        //var cmd = new JData.CommandField();
        //cmd.get_itemStyle
        JData.CommandField.prototype = $.extend(JData.CommandField.prototype, {
            get_cancelText: function () {
                return "<i class='icon-reply'></i>";
            },
            get_deleteText: function () {
                return "<i class='icon-trash'></i>";
            },
            get_editText: function () {
                return "<i class='icon-pencil'></i>";
            },
            get_insertText: function () {
                return "<i class='icon-ok'></i>";
            },
            get_newText: function () {
                return "<i class='icon-plus'></i>";
            },
            get_updateText: function () {
                return "<i class='icon-ok'></i>";
            },

            get_cancelButtonClass: function () {
                return "btn btn-minier btn-warning";
            },
            get_deleteButtonClass: function () {
                return "btn btn-minier btn-danger";
            },
            get_editButtonClass: function () {
                return 'btn btn-minier btn-info';
            },
            get_insertButtonClass: function () {
                return 'btn btn-minier btn-success';
            },
            get_newButtonClass: function () {
                return 'btn btn-minier btn-warning';
            },
            get_updateButtonClass: function () {
                return 'btn btn-minier btn-success';
            },

            get_buttonType: function () {
                return JData.ButtonType.Button;
            },

            _get_itemStyle: JData.Internal.DataControlField.prototype.get_itemStyle,

            get_itemStyle: function () {
                var style = this._get_itemStyle();
                style.set_textAlign('center');
                return style;
            }
        });
        //#endregion

        //#region 界面操作设置
        var _gridView = $.fn.gridView;
        var _pagingBar = $.fn.pagingBar;
        $.extend($.fn, {
            gridView: function (options) {
                var _rowCreated = options.rowCreated;
                options.rowCreated = function (sender, args) {
                    if (args.row.get_rowType() == JData.DataControlRowType.DataRow) {
                        $(args.row.get_element()).find('.icon-trash').parent().each(function () {
                            var on_click = this.onclick;
                            if (on_click == null)
                                return;

                            this.onclick = function () {
                                confirm('删除', '请确认删除。', function (result) {
                                    if (result)
                                        on_click.call();
                                });
                            }
                        });
                    }

                    if (_rowCreated != null)
                        _rowCreated(sender, args);
                }
                var result = _gridView.call(this, options);
                this.each(function () {
                    var gridView = $(this).data('JData.GridView');
                    $.extend(gridView, {
                        initialize: function () {
                            this._ApplyStyle();
                            this._CreateCaption();
                            this._CreateHeader();
                            this.createEmptyRow();
                            this._CreateFooter();
                        }
                    });
                    //gridView.initialize
                })
                return result;
            },
            _pagingBar: $.fn.pagingBar,
            pagingBar: function (options) {
                var result = this._pagingBar(options);
                $(this).each(function () {
                    var pagingBar = $(this).data('JData.PagingBar');
                    $.extend(pagingBar, {
                        _createButton: pagingBar.createButton,
                        createButton: function (nameOrIndex, fn) {
                            var btn = this._createButton(nameOrIndex, fn);
                            var $new_btn = $(btn).wrap('<li>');
                            $new_btn.children().css('padding-left', '0px')
                            return $new_btn[0];
                        }
                    });
                    //$(pagingBar.get_element()).wrap('<ul>');
                })
                return result;
            },
            dropDownList: function (options) {
                /// <param name='options' type='Object'>
                /// Arguments:
                /// dataSource: string, notNull, 数据源 <br/>
                /// selectedValue: object, null, 设定默认的选择项 <br/>
                /// displayField: string, null, 默认值为 Name <br/>
                /// valueField: string, null, 默认值为 Id <br/>
                /// </param>

                options = options || {};
                options = $.extend({
                    displayField: 'Name',
                    valueField: 'Id'
                }, options);

                if (options.dataSource == null)
                    throw chitu.Errors.argumentNull('dataSource');

                var self = this;

                var field_id = options.valueField;
                var field_name = options.displayField;
                var dataSource = options.dataSource;
                var serviceUrl = options.serviceUrl || services.config.shopUrl;

                var arr = dataSource.split('/');
                if (arr.length != 2) {
                    var msg = 'The dataSource argument format is error.';
                    throw new Error(msg);
                }
                var context = arr[0];
                var source = arr[1];

                var url = serviceUrl + `${context}/Select?source=${source}&selection=${field_id},${field_name}`;
                //String.format(serviceUrl + '{0}/Select?source={1}&selection={2},{3}', context, source, field_id, field_name);
                $.ajax(url).done(function (data) {
                    for (var i = 0; i < data.DataItems.length; i++) {
                        var item = data.DataItems[i];
                        var $option = $(`<option value="${item['field_id']}">${item[field_name]}</option>`);
                        //$(String.format('<option value="{0}">{1}</option>', item[field_id], item[field_name]));
                        if (item[field_id] == options.selectedValue)
                            $option.attr('selected', 'selected');

                        self.append($option);
                    }


                    if (options.success != null) {
                        options.success();
                    }

                });

                return this;
            },
            confirm: function (options) {

                options = options || {};

                if ($(this).data('ui-dialog')) {
                    //return $(this).dialog({
                    //    autoOpen: true
                    //});
                    options.autoOpen = true;
                }

                var fun_cancle = function () {
                    $(this).dialog('close');
                };

                var fun_confirm = function () {
                    var confirm = options.confirm || options.ok;
                    if (confirm != null && $.isFunction(confirm)) {
                        if (!confirm())
                            return;
                    }

                    $(this).dialog('close');
                }

                var buttons = [
                    { text: '确认', className: 'btn btn-sm btn-info', icon: 'icon-ok bigger-110', click: fun_confirm },
                    { text: '取消', className: 'btn btn-sm btn-default', icon: 'icon-reply bigger-110', click: fun_cancle }
                ];
                $.extend(options, {
                    buttons: buttons,
                    _open: options.open,
                    open: function (event, ui) {
                        var button_set = $(this).data('ui-dialog').uiButtonSet;
                        $(button_set).find('button').each(function (i) {
                            $(this).html('')
                                .append($('<i>').attr('class', buttons[i].icon))
                                .append(buttons[i].text)
                                .attr('class', buttons[i].className);
                        });

                        if (options._open)
                            options._open(event, ui);
                    }
                });

                if (options.title != null) {
                    var title = `<div class='widget-header widget-header-small'><h4 class='smaller'>${options.title}</h4></div>`;
                    options.title = title//String.format(title, options.title);
                }

                return $(this).dialog(options);
            }
        });
        //#endregion
    })();
    //=================================================================




})($);