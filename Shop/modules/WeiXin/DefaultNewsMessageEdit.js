chitu.action(['jquery.validate', 'com/ue.ext'], function (page) {
    /// <param name="page" type="chitu.Page"/>


    var currentID = page.context().routeData().values()["id"]; //$('#hidId').val();
    var oldEntityList = [];
    var oldSelectIDArr = [];
    var oldSelectRelationIDArr = [];
    var delSelectIDArr = [];
    var addSelectIDArr = [];
    var currentDelIDArr = [];
    //取出已经存在的
    var existArr;

    var dataSource_CurrentMoreNews;

    function deleteMoreNews(delrelationID) {
        Site.confirm('删除', '确认删除吗？', function () {
            $(existArr).each(function (j, jitem) {
                if (delrelationID == jitem.RelationId) {
                    existArr.splice(j, 1);
                    dataSource_CurrentMoreNews['delete'](jitem);
                }
            });
        })
    }

    //$.validator.addMethod("ValiImgUrl", function (value, element) {
    //    if ($("#PicUrl").val().length > 0)
    //        return true;

    //    if ($('#LocalUrl').attr('data-url').length > 0 || $('#LocalUrl').val().length > 0)
    //        return true;

    //    return false;
    //}, "");



    Site.ajax({
        url: '/AjaxWeiXin/GetExistMessage?Id=' + currentID,
        type: 'post',
        async: false,
        success: function (data) {
            existArr = data;
        }
    });

    dataSource_CurrentMoreNews = new JData.ArrayDataSource(existArr);
    dataSource_CurrentMoreNews.add_deleted(function (sender, args) {

        $(existArr).each(function (j, jitem) {
            if (args.item.RelationId == jitem.RelationId) {
                existArr.splice(j, 1);
                //dataSource_CurrentMoreNews.delete(jitem);
            }
        });



        if (args.item.Id == '') {
            if ($.inArray(args.item.RelationId, currentDelIDArr) == -1) {
                currentDelIDArr.push(args.item.RelationId);
            }
        } else {
            if ($.inArray(args.item.Id, delSelectIDArr) == -1) {
                delSelectIDArr.push(args.item.Id);
            }
        }
    });


    $("#moreNews_List").gridView({
        dataSource: dataSource_CurrentMoreNews,
        columns: [
            { dataField: "Id", headerText: 'Id', visible: false },
            { dataField: "Title", headerText: '标题' },
            {
                type: JData.CommandField, headerText: '操作', width: "120px"
            }
        ],
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var cell_element = args.row.get_cells()[args.row.get_cells().length - 1].get_element();
            var id = args.row.get_dataItem()['Id'];
            var RelationId = args.row.get_dataItem()['RelationId'];
            var EditBtn = $(String.format("<a class='btn btn-minier btn-danger' style='margin-left:4px;' onclick=\"deleteMoreNews('{1}')\" href='javascript:;'><i class=\"icon-trash\"></i></a>", id, RelationId));

            $(cell_element).append(EditBtn);
        }

    });

    function ShowNewsDialog() {


        var temp_delSelectIDArr = [];
        $(delSelectIDArr).each(function (i, Id) {
            temp_delSelectIDArr.push(Id);
        });
        var temp_addSelectIDArr = [];
        $(addSelectIDArr).each(function (i, Id) {
            temp_addSelectIDArr.push(Id);
        })

        var temp_list = [];

        if (oldSelectIDArr.length == 0) {
            if (currentID.length > 0) {
                $.ajax({
                    url: '/AjaxWeiXin/GetMessageRelation',
                    data: { 'Id': currentID },
                    type: 'post',
                    async: false,
                    success: function (result) {
                        oldEntityList = result;
                        $(result).each(function (i, item) {
                            oldSelectIDArr.push(item.Id);
                            oldSelectRelationIDArr.push(item.RelationId);
                        })
                    }
                });
            }
        }



        $(currentDelIDArr).each(function (del_i, delID) {
            if ($.inArray(delID, temp_addSelectIDArr) > -1) {
                temp_addSelectIDArr.splice($.inArray(delID, temp_addSelectIDArr), 1);
            }
        });

        var temp_selectedIDArr = [];
        $(temp_addSelectIDArr).each(function (i, id) {
            temp_selectedIDArr.push(id);
        })

        $(oldSelectIDArr).each(function (i, Id) {
            if ($.inArray(Id, delSelectIDArr) == -1) {
                $(oldEntityList).each(function (j, Item) {
                    if (Item.Id == Id && ($.inArray(Item.RelationId, temp_selectedIDArr) == -1)) {
                        temp_selectedIDArr.push(Item.RelationId);
                    }
                });
            }
        });


        var dialogContain = $('<div>').append(
            $('<div>').append('<input type="radio" value="news" checked="" name="dialogSourceType">新闻 <input type="radio" value="product" name="dialogSourceType">  产品 <input type="text" id="searchText" name="searchText"><button type="button" data-toggle="button" class="btn btn-xs btn-info" id="selectSourceBtn">确定</button>')
        ).attr('style', 'width:100%')



        var dataSource = new JData.WebDataSource();
        dataSource.set_selectUrl('/AjaxWeiXin/GetMoreNewsList?Id=' + currentID);

        $(dialogContain).append($("<table width='100%' id='viewTable'>").gridView({
            width: '100%',
            dataSource: dataSource,
            columns: [
                {
                    dataField: 'Id',
                    headerText: '选择',
                    displayValue: function (container, value) {

                        $('<input name="cb_News", type="checkbox">').appendTo($(container)).click(function (event) {
                            var currentClickObj = $(container).parents('tr').first()[0].control.get_dataItem()
                            temp_list.push(currentClickObj);
                            //var currentStatus = event.srcElement.checked;

                            //event.target.checked = false;
                            if (event.target.checked) {
                                if ($.inArray(value, currentDelIDArr) > -1) {
                                    currentDelIDArr.splice($.inArray(value, currentDelIDArr), 1);
                                }


                                if ($.inArray(value, oldSelectRelationIDArr) == -1) {
                                    if ($.inArray(value, temp_addSelectIDArr) == -1) {
                                        temp_addSelectIDArr.push(value);
                                    }
                                } else if ($.inArray(value, temp_delSelectIDArr) > -1) {
                                    temp_delSelectIDArr.splice($.inArray(value, temp_delSelectIDArr), 1);
                                }
                            } else {
                                if ($.inArray(value, oldSelectRelationIDArr) > -1) {
                                    if ($.inArray(value, temp_delSelectIDArr) == -1) {
                                        temp_delSelectIDArr.push(value);
                                    }
                                } else if ($.inArray(value, temp_addSelectIDArr > -1)) {
                                    temp_addSelectIDArr.splice($.inArray(value, temp_addSelectIDArr), 1);
                                    if ($.inArray(value, currentDelIDArr) == -1) {
                                        currentDelIDArr.push(value);
                                    }
                                    if ($.inArray(value, addSelectIDArr) > -1) {
                                        addSelectIDArr.slice($.inArray(value, addSelectIDArr), 1);
                                    }
                                }
                            }

                        }).attr('value', value)[0].checked = ($.inArray(value, temp_selectedIDArr) > -1);
                    }
                },
                { dataField: "Title", headerText: '名称', width: "433px" },
                { dataField: "Id", headerText: 'Id', visible: false }
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
        })).dialog({
            width: '480px',
            buttons: [{
                text: 'OK',
                click: function () {
                    $(temp_delSelectIDArr).each(function (i, Id) {
                        var temp__delID = oldSelectIDArr[$.inArray(Id, oldSelectRelationIDArr)];
                        if ($.inArray(temp__delID, delSelectIDArr) == -1) {
                            delSelectIDArr.push(temp__delID);
                        }
                    })

                    $(temp_addSelectIDArr).each(function (i, Id) {
                        if ($.inArray(Id, addSelectIDArr) == -1) {
                            addSelectIDArr.push(Id);
                        }
                    })

                    var isExist = 0;
                    $(temp_addSelectIDArr).each(function (i, iID) {
                        isExist = 0;
                        $(existArr).each(function (j, jitem) {
                            if (iID == jitem.RelationId) {
                                isExist = 1;
                                return;
                            }
                        });
                        if (isExist == 0) {
                            $(temp_list).each(function (k, kitem) {
                                if (iID == kitem.Id) {
                                    var temp_addEntity = { Id: '', Title: kitem.Title, RelationId: kitem.Id };
                                    existArr.push(temp_addEntity);

                                    dataSource_CurrentMoreNews.insert(temp_addEntity);
                                }
                            })
                        }
                    });

                    $(temp_delSelectIDArr).each(function (i, delID) {
                        $(existArr).each(function (j, jitem) {
                            if (delID == jitem.RelationId) {
                                existArr.splice(j, 1);
                                dataSource_CurrentMoreNews['delete'](jitem);
                            }
                        });
                    })

                    $(currentDelIDArr).each(function (i, delID) {

                        addSelectIDArr.splice($.inArray(delID, addSelectIDArr), 1);

                        $(existArr).each(function (j, jitem) {
                            if (delID == jitem.RelationId) {
                                existArr.splice(j, 1);
                                dataSource_CurrentMoreNews['delete'](jitem);
                            }
                        });
                    })



                    $(this).dialog("close");
                }
            }],
            beforeClose: function (event, ui) {
                dialogContain.remove();
            }
        }).validate({});

        $('#selectSourceBtn').click(function () {

            var searchTxt = $('#searchText').val();
            var strSourceType = $('input[name="dialogSourceType"]:checked').val();

            var args = new JData.DataSourceSelectArguments();
            if (strSourceType == 'news') {
                dataSource.set_selectUrl('/AjaxWeiXin/GetMoreNewsList');
                args.set_filter('Title like "%' + searchTxt + '%"');
            } else {
                args.set_filter('Title like "%' + searchTxt + '%"');
                dataSource.set_selectUrl('/AjaxWeiXin/GetMoreProductList');
            }


            args.set_maximumRows(10);
            dataSource.select(args);
        });
    }

    $('#btn_moreNews').click(ShowNewsDialog);

    //表单验证
    var rules = {
        KeyWord: { required: true },
        Title: { required: true },
        SubDescription: { required: true },
        Url: { url: true }//,
        //Description: { required: true }
        //LocalUrl: { ValiImgUrl: true },
        //PicUrl: { ValiImgUrl: true }
        //Description: { required: true }
    };
    var message = {
        KeyWord: { required: "请输入关键词" },
        Title: { required: "请输入标题" },
        SubDescription: { required: "请输入简介" },
        Description: { required: "请输入内容" },
        Url: { url: "请输入正确的跳转地址" }
        //,
        //LocalUrl: { ValiImgUrl: "请输入网上图片地址或者上传本地图片" },
        //PicUrl: { ValiImgUrl: "请输入网上图片地址或者上传本地图片" }
        //, Description: { required: "请输入内容" }
    };

    var $form = $("#formWXNewsMessage");
    $form.validate({
        rules: rules,
        //errorTargets: {
        //    Description: $('#descriptionErrorShow')
        //},
        messages: message,
        ignore: {}
    });
    //表单提交
    //$('#formWXNewsMessage').submit(function (enent) {

    //    var validator = $(this).data('validator');
    //    Sys.Debug.assert(validator != null);

    //    $('#addIds').val(addSelectIDArr);
    //    $('#deleteIds').val(delSelectIDArr);
    //});
    var model = {
        SaveDefaultNewsMessage: function () {
            if (!$form.valid())
                return;

            Site.ajax({ url: '/AjaxWeiXin/SaveDefaultNewsMessage', data: $form.serialize(), method: 'post' })
                .done(function () {
                    location.href = '/WeiXin/DefaultMessageEdit';
                })
                .fail(function (error) {
                    alert(error.responseText);
                })
        }
    };
    ko.applyBindings(model, page.node());

    //在线编辑器*****************************************

    //$('#Description').xheditor({ upImgUrl: "/Scripts/Plug/xheditor-1.1.14/upload.aspx", upImgExt: "jpg,jpeg,gif,png" });

    $('#ImageUpload').fileupload({
        url: site.config.shopUrl + 'Common/UploadImage?dir=Shopping',
        dataType: 'json'
    }).on('fileuploaddone', function (e, data) {
        $('#PicUrl').val(data.result.path);
    }).on('fileuploadfail', function (error) {
        Site.showInfo('上传图片失败');
    });
});