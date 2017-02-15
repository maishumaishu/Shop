chitu.action(['WeiXin/PreView/js/js', 'css!WeiXin/PreView/css/css.css'],
function (page) {
    /// <param name="page" type="chitu.Page"/>

    var preViewDialog = function (keyWord, title, description) {
        $('#keyWord_Dialog').html(keyWord);
        $('#title_Dialog').html(title);
        $('#description_Dialog').html(description);
        showBg(1);
    }


    var dataSource = new JData.WebDataSource();
    dataSource.set_method('post');
    dataSource.set_selectUrl(site.config.weixinUrl + 'WeiXinData/Select?source=MusicMesses');
    //dataSource.set_insertUrl('/WeiXinData/Insert?source=MusicMesses');
    dataSource.set_deleteUrl(site.config.weixinUrl + 'WeiXinData/Delete?source=MusicMesses');
    //dataSource.set_updateUrl('/WeiXinData/Update?source=MusicMesses');


    //var func_setted = false;
    $("#tabCustomerActivityList").gridView({
        dataSource: dataSource,
        columns: [
            { type: JData.SelectColumn, selectControlType: JData.SelectControlType.Checkbox },
            { dataField: "KeyWord", headerText: '关键词' },
            { dataField: "Title", headerText: '标题' },
            //{ dataField: "Description", headerText: '描述' },
            {
                dataField: 'Description',
                headerText: '描述',
                displayValue: function (container, value) {
                    value = value.length > 20 ? (value.substring(0, 18) + '……') : value;
                    $(container).append(value);
                }
            },
            { dataField: "BrowseNum", headerText: '访问次数' },
            {
                readOnly: true,
                type: JData.DateTimeField,
                dataField: "CreateDateTime",
                headerText: '创建时间',
                displayValue: function (container, value) {
                    //$.datepicker.formatDate('yy-mm-dd', value);
                    $(container).append(value);
                }
            },
            { type: JData.CheckBoxField, dataField: "Disabled", headerText: '启用', trueValue: '已禁用', falseValue: '已启用' },
            {
                type: JData.CommandField, headerText: '操作', width: "120px",
                showDeleteButton: true,
                //showEditButton: true,
                showCancelButton: true
            }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;
            var cell_element = args.row.get_cells()[args.row.get_cells().length - 1].get_element();
            var id = args.row.get_dataItem()['Id'];
            var EditBtn = $(String.format("<a class='btn btn-minier btn-info' style='margin-left:4px;' href='/WeiXin/MusicMessageEdit?Id={0}'><i class=\"icon-pencil\"></i></a>", id));
            var PreviewBtn = $(String.format("<a class=\"btn btn-minier btn-info\" style=\"margin-left:4px;\" href=\"javascript:void(0)\"><i class=\"icon-search\"></i></a>"));

            PreviewBtn.click(function (event) {

                var dataItem = $(event.target).parents('tr').first().data('dataItem');
                var id = dataItem['Id'];
                var keyWord = dataItem['KeyWord'].toString();
                var Title = dataItem['Title'].toString();
                var description = dataItem['Description'];
                preViewDialog(keyWord, Title, description);
                //, keyWord, Title, descriptio
            });

            $(cell_element).append(EditBtn);
            $(cell_element).append(PreviewBtn);


        }

    });


    $('#delBatchBtn').click(function () {
        if ($("#tabCustomerActivityList").data('JData.GridView').get_selectedRows().length == 0) {
            Site.showInfo('请选择要删除的数据');
            return;
        }

        Site.confirm('删除', '确定要删除？', function () {
            $($("#tabCustomerActivityList").data('JData.GridView').get_selectedRows()).each(function (i, item) {
                dataSource['delete'](item.get_dataItem());
            });
        });
    })

    var args = new JData.DataSourceSelectArguments();
    args.set_maximumRows(10);
    dataSource.select(args);


});