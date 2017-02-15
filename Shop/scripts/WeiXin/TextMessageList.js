function preViewDialog(keyWord, replyContent) {
    $('#keyWord_Dialog').html(keyWord);
    $('#content_Dialog').html(replyContent);
    showBg(1);
}

$(function () {
    var dataSource = new JData.WebDataSource();
    dataSource.set_method('post');
    dataSource.set_selectUrl('/WeiXinData/Select?source=TextMesses');
    dataSource.set_insertUrl('/WeiXinData/Insert?source=TextMesses');
    dataSource.set_deleteUrl('/WeiXinData/Delete?source=TextMesses');
    dataSource.set_updateUrl('/WeiXinData/Update?source=TextMesses');

    var webDataSource = new JData.WebDataSource();
    dataSource.executeInsert = $.proxy(webDataSource.executeInsert, webDataSource);
    webDataSource.set_insertUrl('/AjaxWeiXin/InsertTextMessage');


    $("#tabTextMessageList").after("<table id=\"editor\" style='display:none;'></table>");
    var details_view = new JData.DetailsView($("#editor")[0]);
    details_view.add_dataBound(function (sender, args) {
        $("#editor").find('input');
    });

    details_view.add_rowCreated(function (sender, args) {

        //属性和方法的通用？？？  下面的索引怎么通过方法来查找到

        if (args.row._field._Index == 0) {
            $('<span>多关键词请用空格隔开</span>').insertAfter($(args.row._cells[1]._element.children[0]));
        }
    });



    $("#tabTextMessageList").gridView({
        dataSource: dataSource,
        columns: [
            { type: JData.SelectColumn, selectControlType: JData.SelectControlType.Checkbox },
            {
                dataField: "KeyWord",
                headerText: '关键词'
            },
            {
                type: JData.HtmlEditorField,
                dataField: 'Content',
                headerText: '回答内容',
                displayValue: function (container, value) {
                    value = value.length > 20 ? (value.substring(0, 18) + '……') : value;
                    $(container).html(value);
                }
            },
            { readOnly: true, dataField:"BrowseNum",headerText:'游览次数'},
            { type: JData.CheckBoxField, dataField: "Disabled", headerText: '是否禁用', trueValue: '已禁用', falseValue: '已启用' },
            { readOnly: true, dataField: "CreateDateTime", headerText: '创建时间' },
            {
                type: JData.CommandField, headerText: '操作', width: "120px",
                showDeleteButton: true,
                showEditButton: true,
                showCancelButton: true
            }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var cell_element = args.row.get_cells()[args.row.get_cells().length - 1].get_element();
            var id = args.row.get_dataItem()['ID'];
            var keyWord = args.row.get_dataItem()['KeyWord'].toString();
            var content = args.row.get_dataItem()['Content'].toString();
            var PreviewBtn = $(String.format("<a onclick=\"preViewDialog('{0}','{1}')\" class=\"btn btn-minier btn-info\" style=\"margin-left:4px;\" href=\"javascript:void(0)\"><i class=\"icon-search\"></i></a>", keyWord, content));
            $(cell_element).append(PreviewBtn);
        },
        editor: $.extend(details_view, {
            _set_fields: details_view.set_fields,
            set_fields: function (fields) {
                for (var i = $(fields).length - 2; i < $(fields).length - 1; i++) {
                    fields[i].set_visible(false);
                }
                this._set_fields(fields);
                fields[1].get_controlStyle().set_width('300px');
            }
        })
    });

    $("#editor").validate({
        rules: {
            KeyWord: { required: true },
            Content: { required: true }
        },
        messages: {
            KeyWord: { required: "请填写关键词！" },
            Content: { required: "请填写内容！" }
        }
    });
    $('#btnAdd').click(function () {
        $("#tabTextMessageList").data('JData.GridView')._HandleNew();
    });


    $('#delBatchBtn').click(function () {
        if ($("#tabTextMessageList").data('JData.GridView').get_selectedRows().length == 0) {
            Site.showInfo('请选择要删除的数据');
            return;
        }

        Site.confirm('删除', '确定要删除？', function () {
            $($("#tabTextMessageList").data('JData.GridView').get_selectedRows()).each(function (i, item) {
                dataSource['delete'](item.get_dataItem());
            });
        });
    })

    var args = new JData.DataSourceSelectArguments();
    args.set_maximumRows(10);
    dataSource.select(args);
});