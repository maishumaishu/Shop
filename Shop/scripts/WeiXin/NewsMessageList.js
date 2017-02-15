function preViewDialog(id, title, time, picUrl, description) {
    $('#dialog_title').html(title);
    $('#dialog_time').html(time);
    $('#dialog_picUrl').attr('src', picUrl);
    $('#dialog_SubDescription').html(description)


    var existArr;
    $.ajax({
        url: '/AjaxWeiXin/GetExistMessage?ID=' + id,
        type: 'post',
        async: false,
        success: function (data) {
            existArr = data;
        }
    });

    if (existArr == undefined) {
        showBg(1);
        return;
    }

    $('#News_dialog_picUrl').attr('src', picUrl);
    $('#news_dialog_title').html(title);

    var strLi = '';
    $(existArr).each(function (i, item) {

        strLi += '<li><p><a href="#">' + item.Title + '</a></p><a href="#"><img src="' + item.PicUrl + '" width="38" /></a></li>';

    })
    $('#news_LI').html(strLi);
    $('#news_preview_box').show();
}

$(function () {

    var dataSource = new JData.WebDataSource();
    dataSource.set_method('post');
    dataSource.set_selectUrl('/WeiXinData/Select?source=NewsMesses');
    dataSource.set_insertUrl('/WeiXinData/Insert?source=NewsMesses');
    dataSource.set_deleteUrl('/WeiXinData/Delete?source=NewsMesses');
    dataSource.set_updateUrl('/WeiXinData/Update?source=NewsMesses');



    $("#tabCustomerActivityList").gridView({

        dataSource: dataSource,
        columns: [
            { type: JData.SelectColumn, selectControlType: JData.SelectControlType.Checkbox },
            {
                dataField: "KeyWord",
                headerText: '关键词'
            },
            { dataField: "Title", headerText: '标题' },
            {
                dataField: 'SubDescription',
                headerText: '简介',
                displayValue: function (container, value) {
                    value = value.length > 50 ? (value.substring(0, 45) + '……') : value;
                    $(container).append(value);
                }
            },
            { dataField: "BrowseNum", headerText: '访问次数' },
            { readOnly: true, type: JData.DateTimeField, dataField: "CreateDateTime", headerText: '创建时间' },
            { type: JData.CheckBoxField, dataField: "Disabled", headerText: '启用', trueValue: '已禁用', falseValue: '已启用' },
            {
                type: JData.CommandField, headerText: '操作', width: "120px",
                showDeleteButton: true,
                showCancelButton: true
            }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var cell_element = args.row.get_cells()[args.row.get_cells().length - 1].get_element();
            var id = args.row.get_dataItem()['Id'];
            var title = args.row.get_dataItem()['Title'];
            //var time = $.datepicker.formatDate('yy-mm-dd', args.row.get_dataItem()['CreateDateTime']);
            var time = args.row.get_dataItem()['CreateDateTime'];
            var picUrl = args.row.get_dataItem()['PicUrl'];
            var localUrl = args.row.get_dataItem()['LocalUrl'];
            picUrl = (picUrl == '' || picUrl == null) ? localUrl : picUrl;
            var subDescription = args.row.get_dataItem()['SubDescription'];

            var EditBtn = $(String.format("<a class='btn btn-minier btn-info' style='margin-left:4px;' href='/WeiXin/NewsEdit?Id={0}'><i class=\"icon-pencil\"></i></a>", id));
            var PreviewBtn = $('<a>').attr('class', 'btn btn-minier btn-info')
                                     .css('margin-left', '4px')
                                     .click(function () {
                                         preViewDialog(id, title, time, picUrl, subDescription);
                                     })
                                     .append($('<i>').addClass('icon-search'))
            ;

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