chitu.action(['com/ue.ext', 'css!WeiXin/PreView/css/css.css', 'WeiXin/PreView/js/js'],
function (page) {
    /// <param name="page" type="chitu.Page"/>

    var dataSource = new JData.WebDataSource(
        site.config.weixinUrl + 'WeiXinData/Select?source=TextMesses',
        site.config.weixinUrl + 'WeiXinData/Insert?source=TextMesses',
        site.config.weixinUrl + 'WeiXinData/Update?source=TextMesses',
        site.config.weixinUrl + 'WeiXinData/Delete?source=TextMesses'
    );
    dataSource.set_method('post');

    var col_content = {
        dataField: 'Content',
        headerText: '回答内容',
        displayValue: function (container, value) {
            value = value.length > 20 ? (value.substring(0, 18) + '……') : value;
            $(container).html(value);
        }
    };

    var $gridView = $('<table>').appendTo(page.node()).gridView({
        dataSource: dataSource,
        columns: [
            { dataField: "KeyWord", headerText: '关键词' },
            col_content,
            { dataField: "BrowseNum", headerText: '游览次数' },
            { type: JData.CheckBoxField, dataField: "Disabled", headerText: '是否禁用', trueValue: '已禁用', falseValue: '已启用' },
            { type: JData.DateTimeField, dataField: "CreateDateTime", headerText: '创建时间' },
            { type: JData.CommandField, headerText: '操作', width: "160px", showEditButton: true, showDeleteButton: true }
        ],
        allowPaging: true,
        rowCreated: function (sender, args) {
            if (args.row.get_rowType() != JData.DataControlRowType.DataRow)
                return;

            var cell_element = args.row.get_cells()[args.row.get_cells().length - 1].get_element();

            $btn_preview = $('<button class="btn btn-info btn-minier" style="margin-left:4px;"><i class=\"icon-search\"></i></button>')
                .appendTo(cell_element)
                .click(function (event) {
                    var dataItem = $(event.target).parents('tr').first().data('dataItem');
                    var keyWord = dataItem['KeyWord'];
                    var content = dataItem['Content'];
                    model.preview(keyWord, content);
                });
        },
        _HandleEdit: function (row) {
            var dataItem = row.get_dataItem();
            $(page.node()).find('[name="KeyWord"]').val(dataItem.KeyWord);
            $(page.node()).find('[name="Content"]').val(dataItem.Content);
            $dlg_textMessage.modal();
            $dlg_textMessage.row = row;
        },
        _HandleNew: function () {
            $dlg_textMessage.modal();
            $(page.node()).find('[name="KeyWord"]').val('');
            $(page.node()).find('[name="Content"]').val('');
        }
    });

    page.load.add(function () {
        var sel_args = $gridView.data('JData.GridView').get_selectArguments();
        dataSource.select(sel_args);
    });

    //var $element = $('[name="editor"]').uniqueId();
    //var ue = UE.getEditor($element[0].id);
    //ue.ready(function () {
    //    ue.setHeight('250');
    //});

    var $dlg_textMessage = $('[name="dlg_textMessage"]');
    var model = {
        preview: function (keyWord, replyContent) {
            $(page.node()).find('[name="keyWord_dialog"]').html(keyWord);
            $(page.node()).find('[name="content_dialog"]').html(replyContent);
            showBg(1);
        }
    };

    $(page.node()).find('[name="btn_save"]').click(function () {
        if ($dlg_textMessage.row != null) {
            var dataItem = $dlg_textMessage.row.get_dataItem();
            dataItem.KeyWord = $(page.node()).find('[name="KeyWord"]').val();
            dataItem.Content = $(page.node()).find('[name="Content"]').val();
            dataSource.update(dataItem).done(function () {
                $dlg_textMessage.modal('hide');
            });
        }
        else {
            var dataItem = {};
            dataItem.KeyWord = $(page.node()).find('[name="KeyWord"]').val();
            dataItem.Content = $(page.node()).find('[name="Content"]').val();
            dataSource.insert(dataItem).done(function () {
                $dlg_textMessage.modal('hide');
            });
        }

        //$gridView.data('JData.GridView')._HandleUpdate($dlg_textMessage.row);
    })


    $(page.node()).find('[name="btnAdd"]').click(function () {
        $gridView.data('JData.GridView')._HandleNew();
    });


});