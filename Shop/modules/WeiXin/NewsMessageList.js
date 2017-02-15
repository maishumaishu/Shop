chitu.action(['css!WeiXin/PreView/css/css.css', 'WeiXin/PreView/js/js'], function (page) {
    /// <param name="page" type="chitu.Page"/>

    window.preViewDialog = function (id, title, time, picUrl, description) {

        $('#dialog_title').html(title);
        $('#dialog_time').html(time);
        $('#dialog_picUrl').attr('src', picUrl);
        $('#dialog_SubDescription').html(description)

        var existArr;
        $.ajax({
            url: site.config.weixinUrl + 'AjaxWeiXin/GetExistMessage?ID=' + id,
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



    var dataSource = new JData.WebDataSource(
       site.config.weixinUrl + 'WeiXinData/Select?source=NewsMesses',
       site.config.weixinUrl + 'WeiXinData/Insert?source=NewsMesses',
       site.config.weixinUrl + 'WeiXinData/Update?source=NewsMesses',
       site.config.weixinUrl + 'WeiXinData/Delete?source=NewsMesses'
    );
    dataSource.set_method('post');

    $gridView = $('<table>').appendTo(page.node()).gridView({
        dataSource: dataSource,
        columns: [
            { dataField: "KeyWord", headerText: '关键词' },
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
            { type: JData.CommandField, headerText: '操作', width: "120px", showDeleteButton: true, showCancelButton: true }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var EditBtn = $("<a class='btn btn-minier btn-info' style='margin-left:4px;'><i class=\"icon-pencil\"></i></a>")
                                .attr('href', '#WeiXin/NewsEdit/' + args.row.get_dataItem().Id);

            var cell_element = args.row.get_cells()[args.row.get_cells().length - 1].get_element();
            var PreviewBtn = $('<a>')
                .attr('class', 'btn btn-minier btn-info')
                .css('margin-left', '4px')
                .click(function (event) {
                    var dataItem = $(event.target).parents('tr').first().data('dataItem');

                    preViewDialog(dataItem.Id, dataItem.Title, dataItem.CreateDateTime, dataItem.PicUrl, dataItem.SubDescription);
                })
                .append($('<i>')
                .addClass('icon-search'));

            $(cell_element).append(EditBtn);
            $(cell_element).append(PreviewBtn);
        }

    });

    page.load.add(function () {
        var sel_args = $gridView.data('JData.GridView').get_selectArguments();
        dataSource.select(sel_args);
    });
});