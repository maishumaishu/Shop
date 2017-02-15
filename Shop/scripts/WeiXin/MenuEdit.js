
$(function () {

    var isMenuEditorCreated = false;
    function ShowMenuEditor(title, url, menuID, menuName, parentID, menuRank) {
        var $formgroup = $("<div class='form-group'>")
                .append("<div class='col-sm-3'><label for='form-field-1' class='control-label no-padding-right'>菜单名称 :</label></div>")
                .append("<div class='col-sm-9'><input type='text' name='txt_MenuName' class='col-xs-10 col-sm-8' placeholder='菜单名称' id='txt_MenuName'></div>");

        var openObj = $("<div class='form-horizontal' role='form'>").append($formgroup);

        openObj.dialog({
            width: 400,
            title: title,
            buttons: [{
                width: '50px',
                text: "Ok",
                click: function () {
                    if (!$('#txt_MenuName').parent().submit()) {
                        return;
                    }
                },
                open: function () {
                    $("#txt_MenuName").val(menuName);
                },
                create: function (event, ui) {

                    var rules = {
                        txt_MenuName: {
                            required: true
                        }
                    };
                    var message = {
                        txt_MenuName: {
                            required: "请输入菜单名称"
                        }
                    };

                    $("#txt_MenuName").parent().validate({
                        rules: rules,
                        messages: message
                    });



                    $("#txt_MenuName").parent().submit(function () {
                        var validator = $(this).data('validator');
                        Sys.Debug.assert(validator != null);
                        if (validator.errorList.length > 0) {
                            return false;
                        }

                        $.ajax({
                            url: url,
                            data: {
                                MenuName: $("#txt_MenuName").val(),
                                MenuId: menuID,
                                Id: menuID,
                                ParentID: parentID,
                                MenuRank: menuRank
                            },
                            type: 'post',
                            success: function (data) {
                                //Site.showInfo('成功!');
                                $(openObj).dialog("close");
                                pageShow();
                            },
                            error: function (data) {
                                Site.showError('失败');
                                return true;
                            }
                        })

                    });
                }
            }],
            beforeClose: function (event, ui) {
                openObj.remove();
            }

        });


    };

    //一级菜单
    function AddParentMenu() {
        ShowMenuEditor('添加一级菜单', '/AjaxWeiXin/AddMenu', null, null, null, 1);
    }

    //一级菜单
    function EditParentMenu(menuID, menuName) {
        ShowMenuEditor('编辑一级菜单', '/AjaxWeiXin/EditMenu', menuID, menuName);
    }


    //二级菜单

    function AddChildMenu(parentID) {
        ShowMenuEditor('添加二级菜单', '/AjaxWeiXin/AddMenu', null, null, parentID, 2);
    }

    function EditChildMenu(menuID, menuName, parentID) {
        ShowMenuEditor('编辑二级菜单', '/AjaxWeiXin/EditMenu', menuID, menuName, parentID);
    }



    //
    function EditMenuInfo(item) {
        var result;
        //$('#editor2').html('');
        $('#editor2').val('');
        $('#form-field-mask-1').html('');

        var eMessType = item.EMessType;
        $('.tab_active').removeClass('active');
        $('#tab_' + eMessType).addClass('active');
        $('#tab_' + eMessType + '_Content').addClass('active');


        $('#btn_Text_Cancel').click(function () {
            $('#editor2').val(item.Content);
        })



        if (eMessType == 'Text') {
            $('#editor2').val(item.Content);
        } else if (eMessType == 'Link') {
            $('#form-field-mask-1').val(item.LinkUrl);
        } else if (eMessType == 'Music') {
            $.ajax({
                url: '/AjaxWeiXin/GetMenuMusic',
                data: { 'Id': item.MessId },
                async: false,
                success: function (data) {
                    result = data;
                }
            })
        } else if (eMessType == 'News') {
            $.ajax({
                url: '/AjaxWeiXin/GetMenuNews',
                data: { 'Id': item.MessId },
                async: false,
                success: function (data) {
                    result = data;
                }
            })
        }
        return result;
    }


    function ShowNewsDialog(iniID) {

        var result;

        var dataSource = new JData.WebDataSource();
        dataSource.set_selectUrl('/AjaxWeiXin/GetMenuNewsMessageList');


        var pageDIV = $('<div>').pagingBar({
            dataSource: dataSource
        });

        dataSource.add_selected(function (sender, args) {
            $(args.items).each(function (i, item) {
                $.extend(this, {
                    TrBegin: true,
                    _clickImg: function () {
                    },
                    TrEnd: true
                });
            });
            pageDIV.appendTo($('#dialogNewsBtn'));
            result = args.items;
            return result;
        });

        var args = new JData.DataSourceSelectArguments();
        args.set_maximumRows(7);
        dataSource.select(args);
    }



    function ShowMusicDialog(ID, messID) {
        var selMusicEntity;
        var dataSource = new JData.WebDataSource();
        dataSource.set_selectUrl('/AjaxWeiXin/GetMenuMusicMessageList');

        $("<table width='100%'>").appendTo($(Site.get_mainContainer())).gridView({
            width: '100%',
            dataSource: dataSource,
            columns: [
                {
                    dataField: 'ID',
                    headerText: '选择',
                    displayValue: function (container, value) {
                        $('<input name="radio", type="radio">').appendTo($(container)).click(function () {
                            selMusicEntity = $(container).parents('tr').first()[0].control.get_dataItem();
                        }).attr('value', value)[0].checked = value == messID;
                    }
                },
                { dataField: "Title", headerText: '名称', width: "150px" },
                { dataField: "Description", headerText: '描述', width: "198px" },
                { type: JData.CheckBoxField, readOnly: true, type: JData.DateTimeField, dataField: "CreateDateTime", headerText: '创建时间' },
                { dataField: "ID", headerText: 'ID', visible: false }
            ],
            allowPaging: true,
            emptyDataRowStyle: { type: JData.TableItemStyle, textAlign: 'center' },
            rowCreated: function (sender, args) {
                var rowType = args.row.get_rowType();
                if (rowType == JData.DataControlRowType.EmptyDataRow) {
                    var cell = args.row.get_element().cells[0];
                    $('<button class="btn btn-sm btn-primary"></button>').append('<i class="icon-plus"/></i>').append('点击添加数据').appendTo($(cell).html('')).click(function () {
                        sender._HandleNew();
                    });
                }
            }
        }).dialog({
            width: '480px',
            buttons: [{
                text: 'OK',
                click: function () {
                    var selID = $('input[type="radio"][name="radio"]:checked').val();
                    if (selID == undefined) {
                        Site.showError('请选择音乐!');
                        return;
                    }

                    $.ajax({
                        url: '/AjaxWeiXin/SaveMenuMusicInfo',
                        data: { 'ID': ID, 'MessID': selID },
                        success: function (data) {


                            DataModel.NewsEntity(DataModel.IniNewsEntity);
                            $('#editor2').val('');
                            $('#form-field-mask-1').val('http://');

                            Site.showInfo('编辑成功');
                            pageShow();
                            if (selMusicEntity != null) {
                                selMusicEntity.CreateDateTime = $.datepicker.formatDate('yy-mm-dd', selMusicEntity.CreateDateTime);
                                viewModel.MusicEntity(selMusicEntity);
                            }
                        }
                    })
                    $(this).dialog("close");
                }
            }]

        }).validate({
        });
    }



    var MenuPageModel = function (iniMenuList) {
        var self = this;

        this.MenuList = iniMenuList;

        $(iniMenuList).each(function (i, item) {
            //对每条数据进行扩展   
            //EMessType 状态  ： 用来区分当前存储消息类型  显示右边内容编辑栏目
            $.extend(this, {
                //菜单操作
                _clickMenu: function (element, event) {

                    $('#nestable .orange').removeClass('orange');
                    $(event.currentTarget).find('span').addClass('orange')

                    self.CurrentItem(item);
                    self._click_menu();
                },
                _addChildMenu: function () {
                    if (this.ChildrenMenus().length > 4) {
                        Site.showInfo('二级菜单最多有5个');
                        return;
                    }
                    AddChildMenu(item.Id)
                },
                _editMenu: function () {
                    EditParentMenu(item.Id, item.MenuName);
                },
                _deleteMenu: function () {
                    self._delete_Menu(item.Id);
                },
                _selectMusic: function () {
                    self._select_Music(item);
                }
            });



            $(item.ChildrenMenus).each(function (j, itemChild) {
                $.extend(this, {
                    //菜单操作
                    _clickMenu: function (element, event) {

                        $('#nestable .orange').removeClass('orange');
                        $(event.currentTarget).find('span').addClass('orange')

                        self.CurrentItem(itemChild);
                        self._click_menu();
                    },
                    _editMenu: function () {
                        EditChildMenu(itemChild.Id, itemChild.MenuName);
                    },
                    _deleteMenu: function () {
                        self._delete_Menu(itemChild.Id);
                    },
                    _selectMusic: function () {
                        self._select_Music(item);
                    }
                });
            });


        });


    }

    MenuPageModel.prototype = {
        MenuList: null,
        IniMusicEntity: { Title: '请编辑信息', Description: '暂无', CreateDateTime: '暂无' },
        MusicEntity: ko.observable({ Title: '请编辑信息', Description: '暂无', CreateDateTime: '暂无' }),
        IniNewsEntity: { Title: '请编辑信息', PicUrl: '/Images/WeiXin/nopic.gif', LocalUrl: '/Images/WeiXin/nopic.gif' },
        NewsEntity: ko.observable({ Title: '请编辑信息', PicUrl: '', LocalUrl: '/Images/WeiXin/nopic.gif' }),
        NewsEntityList: ko.observable(null),
        TempSelectedNews: ko.observable(null),
        ShowArea: ko.observable('Ini'),
        CurrentItem: ko.observable(null),
        //MenuID: ko.observable(''),
        AddMenu: function () {
            if (this.MenuList().length > 2) {
                Site.showInfo('一级菜单最多三条！');
                return;
            }
            AddParentMenu();
        },
        //排序
        SortMenu: function () {

            var jsdata = ko.mapping.toJS(DataModel.MenuList);
            if (jsdata.length == 0) {
                Site.showInfo('请添加菜单!');
                return;
            }

            var jsonData = JSON.stringify(jsdata);

            $.ajax({
                url: '/AjaxWeiXin/SortMenu',
                type: 'post',
                traditional: true,
                async: false,
                data: { 'jsonData': jsonData },
                success: function (data) {
                    Site.showInfo('排序成功!');
                }
            })
            pageShow();
        },
        _click_menu: function (element, event) {
            $('#form-field-mask-1').val('http://');

            var item = this.CurrentItem();
            this.MusicEntity(this.IniMusicEntity);
            if (!item.ChildrenMenus || item.ChildrenMenus.length == 0) {
                this.ShowArea('Yes');
            } else {
                this.ShowArea('No');
                return;
            }

            var result = EditMenuInfo(item);
            if (item.EMessType == 'Music') {
                result.CreateDateTime = $.datepicker.formatDate('yy-mm-dd', result.CreateDateTime);
                this.MusicEntity(result);
            } else if (item.EMessType == 'News') {
                this.NewsEntity(result);
            }
        },
        _text_Save: function () {
            var self = this;
            $.ajax({
                url: '/AjaxWeiXin/SaveMenuTextInfo?t=' + Math.random(),
                data: { 'ID': this.CurrentItem().Id, 'Content': $("#editor2").val() },
                type: 'post',
                success: function (data) {
                    //self.MenuList(data);
                    Site.showInfo('编辑成功!');

                    self.MusicEntity(self.IniMusicEntity);
                    self.NewsEntity(self.IniNewsEntity);
                    $('#form-field-mask-1').val('http://');

                    pageShow();
                }
            })
        },
        _link_Save: function () {
            var self = this;
            $.ajax({
                url: '/AjaxWeiXin/SaveMenuLinkInfo?t=' + Math.random(),
                data: { 'ID': this.CurrentItem().Id, 'LinkUrl': $("#form-field-mask-1").val() },
                type: 'post',
                success: function (data) {
                    Site.showInfo('编辑成功!');

                    self.MusicEntity(self.IniMusicEntity);
                    self.NewsEntity(self.IniNewsEntity);
                    $('#editor2').val('');

                    pageShow();
                }
            })
        },
        _News_Save: function () {
            var self = this;
            if (this.TempSelectedNews() == null) {
                Site.showError('请选择图文信息');
                return;
            }
            $.ajax({
                url: '/AjaxWeiXin/SaveMenuNewsInfo',
                data: {
                    'ID': this.CurrentItem().Id, 'MessID': this.TempSelectedNews().Id
                },
                success: function (data) {
                    Site.showInfo('编辑成功');


                    self.MusicEntity(self.IniMusicEntity);
                    $('#form-field-mask-1').val('http://');
                    $('#editor2').val('');

                    pageShow();
                    self.NewsEntity(self.TempSelectedNews());
                }
            })

        },
        _delete_Menu: function (delID) {
            Site.confirm('是否删除', '请确实是否删除该菜单!', function () {
                $.ajax({
                    url: '/AjaxWeiXin/DeleteMenu?t=' + Math.random(),
                    data: { 'ID': delID },
                    success: function (data) {
                        Site.showInfo('删除成功!');
                        pageShow();

                    }
                })
            })
        },
        //选择音乐弹出框
        _select_Music: function () {
            var iniID = this.CurrentItem().EMessType == 'Music' ? this.CurrentItem().MessID : null;

            ShowMusicDialog(this.CurrentItem().Id, iniID);
        },
        _select_News: function () {
            var self = this;
            $('#pageLinkBtn').html('');
            //var iniID = '';
            //var list = ShowNewsDialog(iniID);
            //this.NewsEntityList(list);

            var iniID = '';
            if (this.CurrentItem().EMessType == 'News') {
                iniID = this.CurrentItem().MessID;
            }

            var dataSource = new JData.WebDataSource();
            dataSource.set_selectUrl('/AjaxWeiXin/GetMenuNewsMessageList');

            var pageDIV = $('<div>').pagingBar({
                dataSource: dataSource
            });
            dataSource.add_selected(function (sender, args) {
                $(args.items).each(function (i, item) {
                    $.extend(this, {
                        AllowHover: iniID == item.Id,
                        TrBegin: true,
                        _clickImg: function (element, event) {
                            $('.newsLI').removeClass('hover');
                            $(event.currentTarget).parent().parent().parent().parent().addClass('hover');
                            self.TempSelectedNews(item);
                        },
                        TrEnd: true
                    });
                });
                pageDIV.appendTo($('#pageLinkBtn'));
                result = args.items;
                self.NewsEntityList(result);
            });

            var args = new JData.DataSourceSelectArguments();
            args.set_maximumRows(6);
            dataSource.select(args);
        },
        _publish_Menu: function () {
            if (this.MenuList().length == 0) {
                Site.showInfo('请添加菜单!')
                return;
            }

            $.ajax({
                url: '/AjaxWeiXin/PublistMenu',
                type: 'post',
                success: function (data) {
                    Site.showInfo('发布成功!');
                }
            })
        }
    };

    var DataModel;
    var viewModel;

    function pageShow() {
        $.getJSON("/AjaxWeiXin/GetMenuList", null, function (data) {
            DataModel = new MenuPageModel(data);
            ko.mapping.fromJS(DataModel, viewModel);
            drapTableIni();
        });

    }

    $.getJSON("/AjaxWeiXin/GetMenuList", null, function (data) {
        DataModel = new MenuPageModel(data);

        viewModel = ko.mapping.fromJS(DataModel);
        ko.applyBindings(viewModel);

        //setNestable();

        drapTableIni();
    });


    function drapTableIni() {

        $(".dd-list").sortable({
            update: function (event, ui) {

                //===========================================================
                // 找出菜单的位置
                var all_brothers = ui.item.parent().children().toArray();
                var target_index = Array.indexOf(all_brothers, ui.item[0]);
                Sys.Debug.assert(target_index >= 0);
                //===========================================================

                var position = ui.position;
                var id = ui.item.Id;
                var menus = DataModel.MenuList;
                var stack = [];
                for (var i = 0; i < menus.length; i++)
                    stack.push({ menu: menus[i], container: menus });

                var currentData;
                while (stack.length > 0) {
                    var data = stack.pop();
                    if (data.menu.Id == ui.item.data('id')) {
                        currentData = data;
                        break;
                    }
                    for (var i = 0; i < data.menu.ChildrenMenus.length; i++) {
                        stack.push({ menu: data.menu.ChildrenMenus[i], container: data.menu.ChildrenMenus });
                    }
                }

                Sys.Debug.assert(currentData != null);

                var menu = currentData.menu;
                var container = currentData.container;
                var source_index = Array.indexOf(container, menu);
                Sys.Debug.assert(source_index >= 0);
                Array.removeAt(container, source_index);
                Array.insert(container, target_index, menu);
            }
        });
        $(".dd-list").disableSelection();


        $('#testChild').sortable();
        $('#testChild').disableSelection();

    }


    Site.WeiXin = Site.WeiXin || {};
    Site.WeiXin.pageShow = pageShow;


})

















